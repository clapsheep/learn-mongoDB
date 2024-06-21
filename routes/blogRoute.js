const { Router } = require("express");
const blogRouter = Router();
const { Blog, User } = require("../src/models");
const valid = require("../utils/valid");
const { errMessage } = require("../utils/err");

blogRouter.post("/", async (req, res, next) => {
  try {
    const { title, content, islive, userId } = req.body;

    valid.title(title);
    valid.content(content);
    valid.islive(islive);
    valid.userId(userId);

    let user = await User.findById(userId);
    valid.user(user);

    let blog = new Blog({ ...req.body, user });
    await blog.save();
    return res.send({ blog });
  } catch (err) {
    errMessage(res, err);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).limit(20);
    return res.send({ blogs });
  } catch (err) {
    errMessage(res, err);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    valid.blogId(blogId);

    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    errMessage(res, err);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    valid.blogId(blogId);

    const { title, content } = req.body;
    valid.title(title);
    valid.content(content);

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    errMessage(res, err);
  }
});

blogRouter.patch("/:blogId/live", async (req, res, next) => {
  try {
    const { blogId } = req.params;
    valid.blogId(blogId);

    const { islive } = req.body;
    valid.islive(islive);

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { islive },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    err();
  }
});

module.exports = { blogRouter };
