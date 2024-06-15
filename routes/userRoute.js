const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { User } = require("../src/models/User");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({
        err: "userId가 잘못됐습니다.",
      });
    }
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

userRouter.post("/", async (req, res, next) => {
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
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({
        err: "userId가 잘못됐습니다.",
      });
    }
    const user = await User.findOneAndDelete({ _id: userId });
    return req.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({
        err: "userId가 잘못됐습니다.",
      });
    }

    const { age } = req.body;
    if (!age) {
      return res.status(400).send({ err: "나이를 입력해주세요." });
    }
    if (typeof age !== "number") {
      return res.status(400).send({ err: "나이는 숫자로만 입력해주세요." });
    }
    // 이미 생성된 유저의 required 속성을 무시하고 업데이트가 되는 문제가 생김
    // [문제해결 방법 1]
    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;
    // const user = await User.findByIdAndUpdate(userId, { age }, { new: true });
    // 위의 문제를 해결하기 위해 클라이언트단에서 밸리데이션을 해도 OK -> DB 요청 1번

    // [문제해결 방법 2]
    // 몽구스가 알아서 처리하게 하는 방법 -> DB에서 user정보를 한번 더 받아옴 -> DB 요청 2번
    // 해당 이슈로 2번 요청을 하는게 비효율적이고 성능적으로 느리지만, 1개의 데이터 1번정도 더 받아오는 것은 큰 차이가 없음 (데이터가 복잡할 때, Developer의 선택)
    let user = await User.findById(userId);
    if (age) user.age = age;
    if (name) user.name = name;
    console.log({ userAfterEdit: user });
    await user.save();

    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});
module.exports = { userRouter };
