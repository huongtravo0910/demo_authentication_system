import React, { useState, useEffect, useContext} from "react";
import { navigate } from "@reach/router";
import { UserContext } from "../App";

const UserInfoEdit = function () {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();
  const [age, setAge] = useState();
  const [id, setId] = useState();

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
      if (result.userInfo) {
        setUserInfo(result.userInfo);
        setEmail(result.userInfo.email);
        setName(result.userInfo.name);
        setAddress(result.userInfo.address);
        setAge(result.userInfo.age)
        setId(result.userInfo.id);
      };

    }
    fetchProtected();
  }, [user]);
  if (userInfo == null) return <div>You need to login</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await (await fetch('http://localhost:4000/api/user_info', {
        method: "PATCH",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email, id, age, address, name
        }),
    })).json();
    if(result) {
        navigate("/user_info");
    }else {
        console.log(result.error);
    };
  };

  const handleInputChange = (event) => {
    const target = event.target;
    if (target.name === "name") {
      setName(target.value);
    }
    if (target.name === "email") {
      setEmail(target.value);
    }
    if (target.name === "address") {
      setAddress(target.value);
    }
    if (target.name === "age") {
      setAge(target.value);
    }
  };

  return (
    <div className="user-info">
      Edit user information
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            name="name"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            name="email"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            name="address"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            value={age}
            name="age"
            onChange={handleInputChange}
          />
        </div>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="button">
          Save
        </button>
      </form>
    </div>
  );
};

export default UserInfoEdit;
