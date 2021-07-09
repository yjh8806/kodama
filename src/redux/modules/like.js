import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";

import firebase from "firebase/app";
import { actionCreators as postActions } from "./post";

const SET_LIKE = "SET_LIKE";
const ADD_LIKE = "ADD_LIKE";
const LOADING = "LOADING";
const UN_LIKE = "UN_LIKE";

const setlike = createAction(SET_LIKE, (post_id, user_list) => ({
  post_id,
  user_list,
}));
const addlike = createAction(ADD_LIKE, (post_id, user_id) => ({
  post_id,
  user_id,
}));
const unlike = createAction(UN_LIKE, (post_id, user_id) => ({
  post_id,
  user_id,
}));

const initialState = {
  list: {},
};

const addLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    const user_info = getState().user.user;

    let like = {
      post_id: post_id,
      user_id: user_info.uid,
    };

    likeDB.add(like).then((doc) => {
      const postDB = firestore.collection("post");

      const post = getState().post.list.find((l) => l.id === post_id);

      const increment = firebase.firestore.FieldValue.increment(1);

      like = { ...like, id: doc.id };

      postDB
        .doc(post_id)
        .update({ like_cnt: increment })
        .then((_post) => {
          dispatch(addlike(post_id, user_info.uid));

          if (post) {
            dispatch(
              postActions.editPost(post_id, {
                like_cnt: parseInt(post.like_cnt) + 1,
              })
            );
          }
        });
    });
  };
};

const getLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      return;
    }

    const likeDB = firestore.collection("like");

    likeDB
      .where("post_id", "==", post_id)
      .get()
      .then((docs) => {
        let list = [];
        docs.forEach((doc) => {
          list.push(doc.data().user_id);
        });

        dispatch(setlike(post_id, list));
      })
      .catch((error) => {
        console.log("좋아요 정보를 가져올 수가 없네요ㅜㅜ", error);
      });
  };
};

const unLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    const user_info = getState().user.user;

    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_info.uid)
      .get()
      .then((docs) => {
        let id = "";
        docs.forEach((doc) => (id = doc.id));
        likeDB
          .doc(id)
          .delete()
          .then(() => {
            const postDB = firestore.collection("post");

            const post = getState().post.list.find((l) => l.id === post_id);

            const decrement = firebase.firestore.FieldValue.increment(-1);

            postDB
              .doc(post_id)
              .update({ like_cnt: decrement })
              .then((_post) => {
                dispatch(unlike(post_id, user_info.uid));
                if (post) {
                  if (parseInt(post.like_cnt) === 0) {
                    return;
                  }
                  dispatch(
                    postActions.editPost(post_id, {
                      like_cnt: parseInt(post.like_cnt) - 1,
                    })
                  );
                }
              });
          });
      })
      .catch((error) => {
        console.log("좋아요를 취소할 포스트를 찾을수가 없어요ㅜㅜ");
      });
  };
};
export default handleActions(
  {
    [SET_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id] = action.payload.user_list;
      }),
    [ADD_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].push(action.payload.user_id);
      }),
    [UN_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id] = draft.list[
          action.payload.post_id
        ].filter((l) => l !== action.payload.user_id);
      }),
  },
  initialState
);

const actionCreators = {
  addLikeFB,
  getLikeFB,
  unLikeFB,
};

export { actionCreators };
