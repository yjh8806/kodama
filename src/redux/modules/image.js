// image를 담당할 모듈입니다. :) 
// 미리보기 이미지를 넣어놓을거예요.
// post에 한 번에 해도 괜찮지만 저는 따로 만들어봤어요!
import { createAction, handleActions } from "redux-actions";
import produce from "immer";

const SET_PREVIEW = "SET_PREVIEW";

const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

const initialState = {
  preview: null,
};


export default handleActions(
  {
    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {

        draft.preview = action.payload.preview;
      }),
  },
  initialState
);

const actionCreators = {
  setPreview,
};

export { actionCreators };


