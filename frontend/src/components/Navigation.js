import React from "react";
import { Link } from "@reach/router";

const Navigation = ({ logOutCallBack }) => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/user_info">Protected</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <button onClick={logOutCallBack}>Log out</button>
      </li>
    </ul>
  );
};
export default Navigation;
