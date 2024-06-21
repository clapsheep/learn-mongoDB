const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { Comment, Blog, User } = require("../src/models");
const valid = require("../utils/valid");
const { errMessage } = require("../utils/err");

commentRouter.post("/", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;

    valid.blogId(blogId);
    valid.userId(userId);
    valid.content(content);

    const [blog, user] = await Promise.all([
      Blog.findById(blogId),
      User.findById(userId),
    ]);
    valid.blogState(blog);

    if (!blog || !user) {
      return res
        .status(400)
        .send({ err: "blog 또는 user가 존재하지 않습니다." });
    }

    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });
    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ]);

    return res.send({ comment });
  } catch (err) {
    errMessage(res, err);
  }
});

commentRouter.get("/", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    valid.blogId(blogId);

    const comments = await Comment.find({ blog: blogId });
    return res.send({ comments });
  } catch (err) {
    errMessage(res, err);
  }
});

commentRouter.patch("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    valid.commentId(commentId);
    valid.content(content);

    const [comment] = await Promise.all([
      Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
      ,
      Blog.updateOne(
        { "comments._id": commentId },
        { "comments.$.content": content }
      ),
    ]);

    return res.send({ comment });
  } catch (err) {
    errMessage(res, err);
  }
});

commentRouter.delete("/:commentId", async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findByIdAndDelete({ _id: commentId });
  await Blog.updateOne(
    { "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } }
  );
  return res.send({ comment });
});
module.exports = { commentRouter };
