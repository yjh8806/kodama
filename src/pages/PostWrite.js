import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import RadioBtn from "../elements/RadioBtn";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

//   게시글 수정과 작성을 이 컴포넌트 하나로 할거예요.
const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  //   주소창을 보고 id값을 가져와요.
  const post_id = props.match.params.id;
  //   post id를 가지고 수정모드인 지, 작성 모드인지 구분해줍니다.
  const is_edit = post_id ? true : false;

  const { history } = props;

  //   수정모드라면? 게시글 정보를 가져와요!
  // 미리 어느정도 정보를 넣어주기 위해서 가져오는 거예요 :)
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;

  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  const _layout_type = post_id ? _post.layout_type : "";
  const [layout_type, setLayoutType] = React.useState(
    _layout_type ? _layout_type : ""
  );
  const setDisabled = layout_type === "" || contents === "" ? true : false;
  console.log(setDisabled);
  React.useEffect(() => {
    // 수정모드인데, 게시글 정보가 없으면? 경고를 띄우고 뒤로 가게 합니다.
    if (is_edit && !_post) {
      window.alert("포스트 정보가 없어요!");
      history.goBack();
      return;
    } else {
      setTimeout(() => {
        window.alert(
          "게시글 작성 시 레이아웃 선택 및 내용 작성은 필수항목입니다!"
        );
      }, 200);
    }

    // 수정모드라면?
    // 이미지 미리보기도 하나 넣어줘야죠!
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
      console.log(_post);
    }
  }, []);

  //   내용을 바꿔주는 함수
  // useState를 이용해요!
  const changeContents = (e) => {
    setContents(e.target.value);
  };

  // 레이아웃 타입을 정해주는 함수
  // useState를 이용해요!
  const changeLayoutType = (event) => {
    setLayoutType(event.target.value);
  };

  //   게시글을 추가하는 함수
  const addPost = () => {
    window.alert(`게시글을 업로드 중입니다! 잠시만 기다려 주세요 :)\n(이미지 크기에 따라 시간이 다소 걸릴 수 있습니다!)`);
    dispatch(postActions.addPostFB(contents, layout_type));
  };

  //   게시글을 수정하는 함수
  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
  };

  //   로그인 하지 않았다면? 로그인 사용자만 작성할 수 있다는 화면을 보여줘요!
  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          앗! 잠깐!
        </Text>
        <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
        <Button
          _onClick={() => {
            history.replace("/");
          }}
        >
          로그인 하러가기
        </Button>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        <Upload />
      </Grid>

      <Grid>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            ・&nbsp;미리보기
            <br />
            <span style={{ fontSize: "0.7em" }}>(레이아웃 설정)</span>
          </Text>
        </Grid>

        <Grid is_flex>
          <RadioBtn
            type="radio"
            id="radio1"
            value="a"
            checked={layout_type === "a"}
            _onChange={changeLayoutType}
            text="텍스트(상)) / 이미지(하)"
          />

          <RadioBtn
            type="radio"
            id="radio2"
            value="b"
            checked={layout_type === "b"}
            _onChange={changeLayoutType}
            text="텍스트(좌) / 이미지(우)"
          />

          <RadioBtn
            type="radio"
            id="radio3"
            value="c"
            checked={layout_type === "c"}
            _onChange={changeLayoutType}
            text="이미지(좌) / 텍스트(우)"
          />
        </Grid>

        {layout_type === "" ? (
          <Image
            shape="rectangle"
            src={preview ? preview : "http://via.placeholder.com/400x300"}
          />
        ) : (
          ""
        )}

        {layout_type === "a" ? (
          <Image
            shape="AboveTxtBeneathImg"
            width="21em"
            height="20em"
            contents={contents}
            src={preview ? preview : "http://via.placeholder.com/400x300"}
          />
        ) : (
          ""
        )}

        {layout_type === "b" ? (
          <Image
            is_flex
            shape="leftTxtRightImg"
            contents={contents}
            src={preview ? preview : "http://via.placeholder.com/400x300"}
          />
        ) : (
          ""
        )}

        {layout_type === "c" ? (
          <Image
            is_flex
            shape="leftImgRightTxt"
            contents={contents}
            src={preview ? preview : "http://via.placeholder.com/400x300"}
          />
        ) : (
          ""
        )}
      </Grid>

      <Grid padding="16px">
        <Input
          value={contents}
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px">
        {is_edit ? (
          <Button disabled={setDisabled} _onClick={editPost}>
            게시글 수정
          </Button>
        ) : (
          <Button disabled={setDisabled} _onClick={addPost}>
            게시글 작성
          </Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
