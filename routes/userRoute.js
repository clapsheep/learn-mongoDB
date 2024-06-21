const { Router } = require("express");
const userRouter = Router();
const { User, Blog } = require("../src/models");
const valid = require("../utils/valid");
const { errMessage } = require("../utils/err");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    errMessage(res, err);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    valid.userId(userId);

    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    errMessage(res, err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { username, name } = req.body;
    valid.filledusername(username);
    valid.filledName(name);

    const user = new User(req.body);
    await user.save();
    res.send({ user });
  } catch (err) {
    errMessage(res, err);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    valid.userId(userId);

    const [user] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMany(
        { "comments.user": userId },
        { $pull: { comments: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);

    return req.send({ user });
  } catch (err) {
    errMessage(res, err);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    valid.userId(userId);

    const { age, name } = req.body;
    valid.filledAge(res, age);
    if (!age && !name) {
      return res
        .status(400)
        .send({ err: "age와 name은 필수 입력 사항입니다." });
    }
    if (typeof age !== "number") {
      return res.status(400).send({ err: "age를 숫자로 입력해주세요." });
    }
    if (typeof name.first !== "string" && typeof name.last !== "string") {
      return res.status(400).send({ err: "name은 문자로 입력해주세요." });
    }

    let user = await User.findById(userId);

    if (age) user.age = age;
    if (name) {
      user.name = name;
      // 유저 정보가 바뀌었을 때, Blog에 올라간 user정보도 바꿔주는 API
      await Promise.all([
        Blog.updateMany({ "user._id": userId }, { "user.name": name }),
        Blog.updateMany(
          {},
          { "comments.$[].userFullName": `${name.first} ${name.last}` },
          { arrayFilters: [{ "comment.user": userId }] }
        ),
      ]);
    }

    await user.save();

    return res.send({ user });
  } catch (err) {
    errMessage(res, err);
  }
});
module.exports = { userRouter };
