import React from "react";
import {  Link } from "@reach/router";

const UserInfoSaved = function (props) {
  return (
    <div className="user-info">
      User information:
      <h4>Name: {props.name}</h4>
      <h4>Email: {props.email}</h4>
      <h4>Address: {props.address}</h4>
      <h4>Age: {props.age}</h4>
      <span className="button">
        <Link to="/user_info_edit">Edit</Link>
      </span>
    </div>
  );
};

export default UserInfoSaved;
