import React from "react";
import { Grid, Image, Text, Button } from "../elements";
import { HeartButton } from "./index";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { history } from "../redux/configureStore";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as likeActions } from "../redux/modules/like";

// 게시글 1개 뷰를 담당합니다.
// layout_type에 따라 각각 타입에 맞는 레이아웃을 그려줄거예요.
// layout_type : a, b, c
//  - a : 텍스트가 위, 이미지가 아래인 레이아웃
//  - b : 텍스트가 좌측, 이미지가 우측인 레이아웃
//  - c : 텍스트가 우측, 이미지가 좌측인 레이아웃
// image_url : 이미지 주소
// like_cnt : 좋아요 갯수
// insert_dt : 작성일시
// user_info: 유저 정보 (딕셔너리 / user_name, user_id, user_profile를 가지고 있어요.)
// is_me : 지금 로그인한 사용자가 작성자인지 아닌 지 판단해요.
// id : 게시글 id
// contents : 게시글 내용
const Post = React.memo((props) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.like.list);
  const { user_info, image_url, contents, like_cnt, insert_dt, id, layout } =
    props;
    
  React.useEffect(() => {
    dispatch(likeActions.getLikeFB(id));
  }, []);

  const deleteCheck = () => {
    const really = window.confirm(
      `정말로 삭제하시겠습니까?\n다시 되돌릴 수 없습니다.`
    );
    if (really === true) {
      dispatch(likeActions.unLikeFB(props.id));
      window.alert("게시글 삭제 완료!");
      // 시간 지연이 없으면, postDB의 객체 찾을 수 없다는 error!
      setTimeout(() => {
        dispatch(postActions.deletePostFB(props.id));
      }, 500);
    } else {
      return;
    }
  };

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <React.Fragment>
                <Button
                  width="auto"
                  margin="0em 0em 0em 0.5em"
                  padding="4px"
                  border="1px solid white"
                  _onClick={(e) => {
                    //  이벤트 캡쳐링과 버블링을 막아요!
                    // 이벤트 캡쳐링, 버블링이 뭔지 검색해보기! :)
                    e.preventDefault();
                    e.stopPropagation();
                    history.push(`/write/${props.id}`);
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  width="auto"
                  margin="0em 0em 0em 0em"
                  padding="4px"
                  border="1px solid white"
                  _onClick={(e) => {
                    //  이벤트 캡쳐링과 버블링을 막아요!
                    // 이벤트 캡쳐링, 버블링이 뭔지 검색해보기! :)
                    e.preventDefault();
                    e.stopPropagation();

                    // 게시글 삭제하기
                    // 여기에서는 window.confirm 등을 사용해서 진짜 지우냐고 한 번 더 물어봐주면 정말 좋겠죠!
                    deleteCheck();
                  }}
                >
                  <DeleteForeverIcon />
                </Button>
              </React.Fragment>
            )}
          </Grid>
        </Grid>

        {/* layout type이 a일 때 */}
        {props.layout_type === "a" && (
          <React.Fragment>
            <Grid>
              {/* <Text>{props.contents}</Text>
            </Grid>
            <Grid>
              <Image shape="rectangle" src={props.image_url} /> */}
              <Image
                shape="AboveTxtBeneathImg"
                width="20em"
                height="20em"
                contents={props.contents}
                src={props.image_url}
                _onClick={() => {
                  history.push(`/post/${props.id}`);
                }}
              />
            </Grid>
          </React.Fragment>
        )}

        {/* layout type이 b일 때 */}
        {props.layout_type === "b" && (
          <React.Fragment>
            <Grid is_flex margin="2em 0em 1em 0em">
              <Image
                is_flex
                shape="leftTxtRightImg"
                contents={props.contents}
                src={props.image_url}
                _onClick={() => {
                  history.push(`/post/${props.id}`);
                }}
              />
            </Grid>
          </React.Fragment>
        )}

        {/* layout type이 c일 때 */}
        {props.layout_type === "c" && (
          <React.Fragment>
            <Grid is_flex>
              {/* <Image shape="rectangle" src={props.image_url} />
              <Grid width="50%" padding="16px">
                <Text>{props.contents}</Text>
              </Grid> */}
              <Image
                is_flex
                shape="leftImgRightTxt"
                contents={props.contents}
                src={props.image_url}
                _onClick={() => {
                  history.push(`/post/${props.id}`);
                }}
              />
            </Grid>
          </React.Fragment>
        )}

        <Grid is_flex padding="16px">
          <Text margin="0px" bold>
            좋아요 {props.like_cnt}개
          </Text>
          <HeartButton post_id={props.id} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

Post.defaultProps = {
  id: null,
  user_info: {
    user_id: "",
    user_name: "",
    user_profile: "",
  },
  image_url: "",
  contents: "",
  like_cnt: 10,
  layout_type: "a",
  insert_dt: "2021-02-27 10:00:00",
  is_me: false,
};

export default Post;
