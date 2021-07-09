import React from "react";
import { Text, Grid, Button } from "../elements";
import styled from "styled-components";

// 분홍 하트, 회색 하트 이미지 가져오기
import heart_pink from "../shared/heart_pink.png";
import heart_gray from "../shared/heart_gray.png";

import { history } from "../redux/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as likeActions } from "../redux/modules/like";

// 하트 버튼은 일단 모양새만 잡아줄거예요!
const HeartButton = (props) => {
  const dispatch = useDispatch();

  const like_list = useSelector((state) => state.like.list);
  const user_info = useSelector((state) => state.user.user);

  const { _onClick, _onChange, like, post_id } = props;
  const styles = {}

  React.useEffect(() => {
    if (like_list[post_id]?.includes(user_info?.uid)) {
      setLike(true);
    } else {
      setLike(false);
    }
  });

  const [islike, setLike] = React.useState(false);
  const updateHeart = () => {
    if (!user_info) {
      return (
        <Grid margin="100px 0px" padding="16px" center>
          <Text size="32px" bold>
            앗 잠깐!
          </Text>
          <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
          <Button
            _onClick={() => {
              history.replace("/login");
            }}
          >
            로그인 하러 가기!
          </Button>
        </Grid>
      );
    } else if (!like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.addLikeFB(post_id));
    } else if (like_list[post_id]?.includes(user_info.uid)) {
      dispatch(likeActions.unLikeFB(post_id));
    }
  };

  return (
    <div onClick={updateHeart}>
      {/* <Heart icon_url={like? heart_pink : heart_gray} onClick={_onClick}></Heart> */}
      {islike? <Heart icon_url={heart_pink}/> : <Heart icon_url={heart_gray}/> }
    </div>
  );
};
HeartButton.defaultProps = {
  _onClick: () => {},
  _onChange: () => {},
  like: false,
};
const Heart = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  background: url(${(props) => props.icon_url});
  background-size: cover;
  cursor: pointer;
`;

export default HeartButton;
