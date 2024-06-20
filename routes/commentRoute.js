const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { Comment, Blog, User } = require("../src/models");
const { isValidObjectId } = require("mongoose");

commentRouter.post("/:commentId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ err: "blogId가 유효하지 않습니다." });
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ err: "userId가 유효하지 않습니다." });
    }
    if (typeof content !== "string") {
      return res.status(400).send({ err: "내용을 입력해주세요." });
    }
    const [blog, user] = await Promise.all([
      Blog.findByIdAndUpdate(blogId),
      User.findByIdAndUpdate(userId),
    ]);

    if (!blog || !user) {
      return res
        .status(400)
        .send({ err: "blog 또는 user가 존재하지 않습니다." });
    }
    if (!blog.islive) {
      return res.status(400).send({ err: "blog가 현재 닫겨있습니다." });
    }
    const comment = new Comment({ content, user, blog });
    await comment.save();
    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.send({ err: err.massage });
  }
});

commentRouter.get("/", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ err: "blogId가 유효하지 않습니다." });
    }
    const comments = await Comment.find({ blog: blogId });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.massage });
  }
});
module.exports = { commentRouter };
