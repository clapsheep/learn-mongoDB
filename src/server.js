const express = require("express");
const app = express();
const { userRouter, blogRouter, commentRouter } = require("../routes");
const { generateFakeData } = require("../faker2");

const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://admin:wardrobe@first-project.rdjqwo0.mongodb.net/?retryWrites=true&w=majority&appName=first-project";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URL, { dbName: "blog" });

    console.log("DB연결 성공");

    app.use(express.json());

    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    app.use("/blog/:blogId/comment", commentRouter);

    app.listen(3000, async () => {
      console.log("서버 연결 성공");
      // await generateFakeData(3, 5, 15);
    });
  } catch (err) {
    console.log(err);
  }
};

server();
