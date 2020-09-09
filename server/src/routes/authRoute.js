const express = require("express");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../token");
const User = require("../../Users/User");

const authRoute = express.Router();


////1. Register a user
authRoute.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    //a. check if the email exist
    const user = await User.findOne({ email: email });
    if (user) throw new Error("User already exist");
    //b. if not creat hashedPassword
    const hashedPassword = await hash(password, 10);
    //c. insert into user database
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(JSON.stringify(savedUser));
    return res.send({ message: "User Created" });
  } catch (err) {
    return res.send({ error: `${err.message}` });
  }
});

// 2. Login a user
authRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //1. Check if the user exist or not
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User does not exist");
    //2.Compare password
    const valid = await compare(password, user.password);

    if (!valid) throw new Error("Password not correct");

    //3. Create Refresh and access token
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    //4. Put the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();
    // 5.Send token. Refresh token as a cookie and access token as a regular response
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accessToken);
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

//3.Logout a user
authRoute.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken");
  return res.send({ message: "logged out" });
});

//5. Get a new access token with a refresh token
authRoute.post("/refresh_token", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    //If we don't have a token in our request

    if (!token) {
      console.log("no token");
      return res.send({ accessToken: "" });
    }
    //If we have a token, let's verify it!
    let payload = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).send({ err: "not verify" });
    }
    console.log(payload);

    //Token is valid, check if user exist
    let user = null;
    try {
      user = await User.findOne({ _id: payload.userId });
    } catch (e) {
      return res.status(403).send({ err: "find user error" });
    }

    if (!user) {
      console.log("user non-exist");
      return res.status(403).send({ err: "user non-exist" });
    }
    //User exist, check if refresh token exist on user
    console.log("User.refreshtoken:" + user.refreshToken);
    console.log("Cookies refreshtoken:" + token);
    if (user.refreshToken !== token) {
      console.log("non-exist token");
      return res.status(403).send({ err: "non-exist token" });
    }
    // Token exist, create new Refresh - and Access Token
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    //All good to go, send new refresh token ans accesstoken
    sendRefreshToken(res, refreshToken);
    return res.send({ accessToken });
  } catch (e) {
    console.error(e);
  }
});

module.exports = authRoute;
