import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./login.css"

const LoginToContinue = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <div className="center-container">
      <h1 className="sidebar__top center-container ">Login To Continue</h1>
      <button className="setting__btn active__btn" onClick={() => loginWithRedirect()}>Login</button>
    </div>
  );
};

export default LoginToContinue;
