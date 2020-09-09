require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
);

//1. Register a user
//2. Login a user
//3. Logout a user
//4. Set up a protected route
//5. Get a new access_token with a refresh token

//SET UP server - middleware

const server = express();


server.use(morgan('combined'))
server.use(cookieParser()); // easier cookie
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/auth", authRoute);
server.use("/api", userRoute);

//6. Send email
server.post("/email", async (req, res) => {
  try {
    console.log(req.body);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "huongtravo0910@gmail.com",
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: "huongtravo0910@gmail.com",
      to: req.body.email,
      subject: req.body.subject,
      text: req.body.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).send("Ok");
  } catch (e) {
    console.error(e);
    res.status(500).send("Cannot send email");
  }
});

server.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
