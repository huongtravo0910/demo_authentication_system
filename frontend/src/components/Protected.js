import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import UserInfoSaved from "./Protected/UserInfoSaved";

const Protected = () => {
  const [user] = useContext(UserContext);
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    async function fetchProtected() {
      const result = await (
        await fetch("http://localhost:4000/api/user_info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.accessToken}`,
          },
        })
      ).json();
      if (result.userInfo) setUserInfo(result.userInfo);
    }
    fetchProtected();
  }, [user]);
  if (userInfo == null) return <div>You need to login</div>;
  // if (content.length === 1) return <div>{content[0]}</div>;

  return (
    <div>
      <UserInfoSaved
        id={userInfo.id}
        name={userInfo.name}
        email={userInfo.email}
        address={userInfo.address}
        age={userInfo.age}
      />
    </div>
  );
};

export default Protected;
