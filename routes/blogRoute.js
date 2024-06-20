const { Router } = require("express");
const blogRouter = Router();
const { Blog, User } = require("../src/models");
const { isValidObjectId } = require("mongoose");

blogRouter.post("/", async (req, res, next) => {
  try {
    const { title, content, islive, userId } = req.body;
    if (typeof title !== "string") {
      res.status(400).send({ err: "타이틀을 문자로 입력해주세요." });
    }
    if (typeof content !== "string") {
      res.status(400).send({ err: "내용을 문자로 입력해주세요." });
    }
    if (islive && typeof islive !== "string") {
      res.status(400).send({ err: "islive는 Boolean 타입입니다." });
    }
    if (!isValidObjectId(userId)) {
      res.status(400).send({ err: "userId가 DB형식에 맞지 않습니다." });
    }
    let user = await User.findById(userId);
    if (!user) {
      res.status(400).send({ err: "userId가 DB에 존재하지 않습니다." });
    }

    let blog = new Blog({ ...req.body, user });
    await blog.save();
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});
blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    return res.send({ blogs });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});
blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ err: "blogId가 DB형식에 맞지 않습니다." });
    }
    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ err: "blogId가 DB형식에 맞지 않습니다." });
    }
    const { title, content } = req.body;
    if (typeof title !== "string") {
      res.status(400).send({ err: "타이틀을 문자로 입력해주세요." });
    }
    if (typeof content !== "string") {
      res.status(400).send({ err: "내용을 문자로 입력해주세요." });
    }
    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

blogRouter.patch("/:blogId/live", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ err: "blogId가 DB형식에 맞지 않습니다." });
    }
    const { islive } = req.body;
    if (typeof islive !== "boolean") {
      return res
        .status(400)
        .send({ err: "islive는 boolean 타입이어야 합니다." });
    }
    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { islive },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});

module.exports = { blogRouter };
