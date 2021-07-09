import React from "react";
import { Grid, Text, Button, Image } from "../elements";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import kodama from '../shared/kodama_icon.jpeg';
import main_img from "../shared/kodama_main.jpeg";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();

  //   리덕스에서 로그인 중인지 상태값 가져오기
  const is_login = useSelector((state) => state.user.is_login);

  //   세션에 기록된 로그인 정보 가져오기
  // 어떻게 생겼는 지는 파이어베이스에서 결정해요! (우리가 결정할 수 있는 건 저장 위치뿐..!)
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  //   세션이(로그인 정보겠죠!) 있나없나 확인해요!
  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  //  아래 주석을 풀고 세션이 있나 없나 확인해볼까요? :)
  //   console.log(is_session);

  // 리덕스에서 is_login이 true로 저장되어 있고, 세션도 있으면 로그인 중인 것으로 판단해요!
  // 로그인 한 뒤 헤더를 보여줄거예요.
  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid padding="0px">
          <Grid padding="16px 0px" is_flex_main>
            <Image shape="main_circle" src={main_img}/>
            <Text
              main
              size="1.8em"
              margin="0em 0.5em 0em 0.2em"
              bold
              height="13vh"
            >
              𝕂𝕆𝔻𝔸𝕄𝔸 𝕄𝔸𝔾𝔸ℤ𝕀ℕ𝔼
            </Text>
          </Grid>
        </Grid>
        <Grid
          is_header
          is_flex
          width="100%"
          maxwidth="33.8em"
          margin="0px auto"
        >
          <Button
            padding="5px 30px"
            _onClick={() => {
              history.push("/");
            }}
          >
            <HomeIcon />
          </Button>
          <Button
            padding="5px 30px"
            _onClick={() => {
              window.alert("로그아웃 완료!");
              dispatch(userActions.logoutFB());
            }}
          >
            <ExitToAppIcon />
          </Button>
        </Grid>
      </React.Fragment>
    );
  }

  //   로그인 중이 아니라면 로그인 전 헤더를 보여줍니다.
  return (
    <React.Fragment>
      <Grid padding="0px">
        <Grid padding="16px 0px" is_flex_main>
          <Image is_flex shape="main_circle" src={main_img}/>
          <Text
            main
            size="1.8em"
            margin="0em 0.5em 0em 0.2em"
            bold
            height="13vh"
          >
            𝕂𝕆𝔻𝔸𝕄𝔸 𝕄𝔸𝔾𝔸ℤ𝕀ℕ𝔼
          </Text>
        </Grid>
      </Grid>
      <Grid
        is_header
        is_flex
        width="100%"
        maxwidth="33.750em"
        minwidth="24em"
        margin="0px auto"
      >
        <Button
          padding="5px 30px"
          _onClick={() => {
            history.push("/");
          }}
        >
          <HomeIcon />
        </Button>
        <Button
          padding="5px 30px"
          _onClick={() => {
            history.push("/login");
          }}
        >
          <VpnKeyIcon />
        </Button>
        <Button
          padding="5px 30px"
          _onClick={() => {
            history.push("/signup")
          }}
        >
          <AssignmentIndIcon />
        </Button>
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
