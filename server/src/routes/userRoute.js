const express = require("express");

const { isAuth } = require("../isAuth");
const User = require("../../Users/User");

const userRoute = express.Router();

//4.1 User route
userRoute.get("/user_info", async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      const user = await User.findOne({ _id: userId });
      return res.send({
        userInfo: {
          id: user["id"],
          name: user["name"],
          address: user["address"],
          age: user["age"],
        },
      });
    } else {
      return res.status(403).send("Wrong accessToken format");
    }
  } catch (err) {
    return res.send({
      error: `${err.message}`,
    });
  }
});

//4.2 Edit user info - post
userRoute.patch("/user_info", async (req, res) => {
  const { id, name, email, age, address } = req.body;
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      const user = await User.findOne({ _id: userId });
      console.log(user);
      if(name!=null){
        user.name = name;
      }
      if(email !=null){
        user.email = email;
      }
      if(age != null) {
        user.age = age;
      }
      if(address != null) {
        user.address = address;
      }    
      await user.save();
      return res.status(200).send({ message: "Update successfully!" });
      console.log(user);
    } else {
      return res.status(403).send("Wrong accessToken format");
    }
  } catch (err) {
    return res.send(err);
  }
});

module.exports = userRoute;
