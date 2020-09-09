import React, { useState, useEffect } from "react";
import { Router, navigate } from "@reach/router";

import Content from "./components/Content";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Protected from "./components/Protected";
import Register from "./components/Register";
import UserInfoEdit from "./components/UserInfoEdit";

export const UserContext = React.createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logOutCallBack = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    });
    //Clear user from context
    setUser({});
    //Navigate back to startpage
    navigate("/");
  };
  //First thing, get a new accessToken if a refreshToken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (
        await fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include", //Needed to include the cookie
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setUser({
        accessToken: result.accessToken,
      });
      setLoading(false);
    }
    checkRefreshToken();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logOutCallBack={logOutCallBack} />
        <Router id="router">
          <Login path="login" />
          <Register path="register" />
          <Protected path="user_info" />
          <Content path="/" />
          <UserInfoEdit path="user_info_edit"/>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
