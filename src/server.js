const express = require("express");
const app = express();
const { userRouter, blogRouter, commentRouter } = require("../routes");
const { generateFakeData } = require("../faker");

const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://admin:wardrobe@first-project.rdjqwo0.mongodb.net/?retryWrites=true&w=majority&appName=first-project";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URL, { dbName: "blog" });

    // generateFakeData(100, 10, 300);

    console.log("DB연결 성공");

    app.use(express.json());

    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    app.use("/blog/:blogId/comment", commentRouter);

    app.listen(3000, () => {
      console.log("서버 연결 성공");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
