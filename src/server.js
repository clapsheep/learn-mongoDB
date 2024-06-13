const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { User } = require("./models/User");

const MONGO_URL =
  "mongodb+srv://admin:wardrobe@first-project.rdjqwo0.mongodb.net/";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB연결 성공");

    app.use(express.json());

    app.get("/user", (req, res, next) => {
      // res.send({ users: users });
    });

    app.post("/user", async (req, res, next) => {
      try {
        const { username, name } = req.body;
        if (!username) {
          return res.status(400).send({ err: "username을 입력해주세요." });
        }
        if (!name) {
          return res.status(400).send({ err: "name을 입력해주세요." });
        }

        const user = new User(req.body);
        await user.save();
        res.send({ user });
      } catch (error) {
        console.log(err);
        return res.status(500).send({ err: err.massage });
      }
    });

    app.listen(3000, () => {
      console.log("서버 연결 성공");
    });
  } catch (error) {
    console.log(err);
  }
};

server();
