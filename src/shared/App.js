import "./App.css";
import React from "react";

import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import { Login, Signup, PostDetail, PostList, PostWrite } from "../pages";

import { Header } from "../components";
import { Grid, Button } from "../elements";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { actionCreators as imageActions } from "../redux/modules/image";

import { apiKey } from "./firebase";
import { Route } from "react-router-dom";

import Permit from "./Permit";

function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <Grid is_mob bg="linear-gradient(45deg, #e66465, #9198e5)">
      <Grid padding="0px" maxwidth="33.750em" margin="0px auto" bg="white">
        <ConnectedRouter history={history}>
          <Header></Header>
          {/* 아직 목록 페이지가 없으니, 루트 경로(/)는 Login을 엮어줄게요! */}
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write/:id" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button
          is_float
          _onClick={() => {
            dispatch(imageActions.setPreview(null));
            history.push("/write");
          }}
        >
          +
        </Button>
      </Permit>
    </Grid>
  );
}

export default App;
