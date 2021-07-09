import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";
import { actionCreators as likeActions } from "./like";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";
const SET_LIKE = "SET_LIKE";

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

// 포스트에 들어가야만 하는 기본 정보를 미리 하나 만들어요! (매번 적기는 귀찮으니까..!)
// layout_type : a, b, c
//  - a : 텍스트가 위, 이미지가 아래인 레이아웃
//  - b : 텍스트가 좌측, 이미지가 우측인 레이아웃
//  - c : 텍스트가 우측, 이미지가 좌측인 레이아웃
// image_url : 이미지 주소
// like_cnt : 좋아요 갯수
// insert_dt : 작성일시
const initialPost = {
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "",
  like_cnt: 0,
  layout_type: "a",
  insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
};

// 게시글 수정하기
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    // 프리뷰 이미지를 가져옵니다.
    const _image = getState().image.preview;

    // 수정하려는 게시글이 게시글 목록에서 몇 번째에 있나 확인합니다.
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    // 수정하려는 게시글 정보를 가져옵니다. (수정 전 정보겠죠!)
    const _post = getState().post.list[_post_idx];
    // 아래의 주석을 풀고 확인해보세요!
    // console.log(_post);

    // 파이어스토어에서 콜렉션 선택하기
    const postDB = firestore.collection("post");

    // 현재 프리뷰의 이미지와 게시글 정보에 있는 이미지가 같은 지 확인합니다.
    // 같다면 이미지 업로드는 할 필요 없겠죠!
    if (_image === _post.image_url) {
      // 게시글 정보를 수정해요!
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          //   프리뷰는 이제 null로 바꿔줍니다!
          dispatch(imageActions.setPreview(null));
          window.alert("게시글 수정 완료!");
          history.replace("/");
        });
      return;
    } else {
      // 유저 정보를 가져와요 (유저 id!)
      const user_id = getState().user.user.uid;
      // 이미지를 data_url 방식으로 업로드하도록 준비!
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      // 이미지를 업로드하고,
      _upload.then((snapshot) => {
        //   업로드한 뒤 링크를 가져옵니다. (업로드한 이미지의 경로를 가져와요.)
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            //   아래 주석을 풀고 경로를 확인해보세요 :)
            // console.log(url);

            return url;
          })
          .then((url) => {
            // 경로를 가지고 게시글 정보를 수정해줍니다.
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                //   리덕스에도 수정한 정보를 넣어줘요.
                dispatch(editPost(post_id, { ...post, image_url: url }));
                //   프리뷰는 이제 null로 바꿔줍니다!
                dispatch(imageActions.setPreview(null));
                // 수정이 끝났으니, / 경로로 돌아갑니다.
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

// 게시글 추가하기
const addPostFB = (contents = "", layout_type = "a") => {
  return function (dispatch, getState, { history }) {
    //  파이어스토어에서 콜렉션부터 잡아줍니다.
    const postDB = firestore.collection("post");

    // 게시글 작성자 (로그인한 유저겠죠!) 정보를 가져와요.
    const _user = getState().user.user;

    // 유저 정보를 꾸려주고,
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    // 게시글 정보도 꾸려줘요.
    const _post = {
      ...initialPost,
      contents: contents,
      layout_type: layout_type,
      insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    // 이미지도 가져옵니다.
    const _image = getState().image.preview;

    // 만약 이미지가 없으면? 경고를 띄워주고 업로드하지 않아요!
    if (!_image) {
      window.alert("이미지가 필요해요!");
      return;
    }
    // 이미지 업로드 먼저! (이미지 업로드가 실패하면 게시글도 업로드 하지 않게!)
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          return url;
        })
        .then((url) => {
          // 이미지 업로드가 무사히 잘 끝났다면, 이제 게시글 정보를 파이어스토어에 넣어줍니다.
          // 주의! 파이어스토어에는 리덕스에서 관리하는 것과 조금 다르게 게시글 1개 정보를 관리할거예요.
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              window.alert("게시글 작성 완료!");
              history.replace("/");

              //   프리뷰는 이제 null로 바꿔줍니다!
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

// 게시글 가져오기
const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    //   가장 먼저 페이징 정보를 가져와요.
    let _paging = getState().post.paging;

    // 시작점이 있고, 다음 게시글이 없다면? 더 가져올 게 없다는 뜻이니 return!
    if (_paging.start && !_paging.next) {
      return;
    }

    // 가져오기 중일 때는 loading을 true로 바꿔줍니다.
    // 연속해서 계속 불러오는 걸 방지하기 위함입니다.
    dispatch(loading(true));

    // 파이어스토어에서 post 콜렉션을 먼저 잡아주고,
    const postDB = firestore.collection("post");

    // 쿼리를 작성해요!
    // 작성일 기준으로 역순 정렬할거예요.
    // +) asc, desc를 왔다갔다 하면서 정렬을 바꿔보세요!
    let query = postDB.orderBy("insert_dt", "desc");

    // 만약 시작점이 있다면? (start는 매개변수로 가져오는 걸 잊으면 안됩니다! -> getPostFB를 부를 때는? paging의 next 값을 start로 넘겨주겠죠!)
    if (start) {
      // 쿼리에 몇번째 게시글부터 가져올 지, 시작점 정보를 추가해줍니다.
      query = query.startAt(start);
    }

    // 우리가 미리 지정한 사이즈(갯수)보다 1개 더 많이 가져올거예요.
    // 그래야 next에 무언가를 넣어서 다음에 또 불러올 게 있나 없나 판단할 수 있어요.
    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];

        // 페이징 정보를 만들어줘요.
        // start는 지금 가져온 데이터의 첫번째 걸로,
        // next는 가져온 데이터의 길이를 보고 지정 사이즈보다 +1개면 마지막 데이터를,
        // 지금 사이즈와 같거나 작으면 null을 넣어줘요.
        let paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        // 이제 파이어스토어에서 가져온 데이터를 리덕스에 넣기 좋게 만들어요!
        docs.forEach((doc) => {
          let _post = doc.data();

          // reduce로 데이터를 정제해요!
          // reduce 사용법이 익숙하지 않으시다면 reduce 사용법 검색해보기!
          //  게시글 하나는 딕셔너리 형태예요.
          // 이 딕셔너리 형태 데이터의 키만 가지고 배열을 만들어 reduce를 돌립니다.
          let post = Object.keys(_post).reduce(
            (acc, cur) => {
              // acc는 누적 값, cur은 현재 값이에요.
              // 현재 값(key 값 중 하나겠죠!)에 user_가 들어있다면?
              if (cur.indexOf("user_") !== -1) {
                //   user_info에 현재 키값과 현재 키를 사용해 가져온 밸류를 누적 딕셔너리에 추가해줍니다.
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }

              //   user_가 없다면? 누적 딕셔너리에 바로 넣어주기!
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );

          //   정제한 데이터를 post_list에 넣어줘요.
          post_list.push(post);
        });

        // 마지막 1개는 빼줘요! (다음 번 리스트에 있어야할 값이니까요!)
        if (paging.next) {
          post_list.pop();
        }

        // post_list를 확인해봅시다!
        // console.log(post_list);

        // 이제 게시글 목록을 리덕스에 넣어줍시다!
        dispatch(setPost(post_list, paging));
      });
  };
};

// 게시글 하나만 가져오기
// 상세페이지 등에 바로 접근할 때를 대비해서 게시글 하나만 가져오는 함수도 만들어요.
const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        // 하나를 가져오지만, 게시글 목록은 배열이잖아요! 배열 형태에 맞게 []로 싸줍니다.
        dispatch(setPost([post]));
      });
  };
};

// 게시글 삭제하기
const deletePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    // id가 없으면 return!
    if (!id) {
      window.alert("삭제할 수 없는 게시글이에요!");
      return;
    }

    const postDB = firestore.collection("post");

    // 게시글 id로 선택해서 삭제하기!(글 삭제하면 좋아요도 삭제 하야함!! DB 쓸데 없는 공간차지!)
    postDB
      .doc(id)
      .delete()
      .then((res) => {
        dispatch(deletePost(id));
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// 리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        //   데이터를 기존 데이터에 추가해요.
        draft.list.push(...action.payload.post_list);

        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        // 페이징도 넣어줍니다.
        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }

        // 리듀서에 기록할 때는 이미 로딩이 끝났겠죠! 여기에서 false로 바꿔줘요.
        // 액션을 따로 호출해도 좋지만, 무조건 is_loading이 false 되는 지점에서는 굳이 액션을 두번 일으키기 보단
        // 이런 식으로 바로 바꿔주는 게 좋아요.
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        // 데이터를 배열 맨 앞에 넣어줍니다.
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        // 배열의 몇 번째에 있는 지 찾습니다.
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        // 해당 위치에 넣어줍니다.
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        if (idx !== -1) {
          // 배열에서 idx 위치의 요소 1개를 지웁니다.
          draft.list.splice(idx, 1);
        }
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        //   데이터를 가져오는 중인 지 여부를 작성합니다.
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
  deletePostFB,
};

export { actionCreators };
