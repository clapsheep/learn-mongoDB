const { isValidObjectId } = require("mongoose");

const blogId = (id) => {
  if (!isValidObjectId(id)) {
    return res.status(400).send({ err: "BlogId가 유효하지 않습니다." });
  }
};
const userId = (id) => {
  if (!isValidObjectId(id)) {
    return res.status(400).send({ err: "UserId가 유효하지 않습니다." });
  }
};
const commentId = (id) => {
  if (!isValidObjectId(id)) {
    return res.status(400).send({ err: "commentId가 유효하지 않습니다." });
  }
};
const islive = (islive) => {
  if (islive && typeof islive !== "boolean") {
    return res.status(400).send({ err: "islive는 Boolean 타입입니다." });
  }
};
const blogState = (blog) => {
  if (!blog.islive) {
    return res.status(400).send({ err: "blog가 현재 닫겨있습니다." });
  }
};

const content = (content) => {
  if (typeof content !== "string") {
    return res.status(400).send({ err: "내용을 입력해주세요." });
  }
};
const title = (content) => {
  if (typeof content !== "string") {
    return res.status(400).send({ err: "제목을 입력해주세요." });
  }
};
const filledusername = (username) => {
  if (!username) {
    return res.status(400).send({ err: "username을 입력해주세요." });
  }
};
const filledName = (name) => {
  if (!name) {
    return res.status(400).send({ err: "name을 입력해주세요." });
  }
};
const filledAge = (res, age) => {
  if (!age) {
    return res.status(400).send({ err: "나이를 입력해주세요." });
  }
  if (typeof age !== "number") {
    return res.status(400).send({ err: "나이는 숫자로만 입력해주세요." });
  }
};

const user = (user) => {
  if (!user) {
    return res.status(400).send({ err: "userId가 DB에 존재하지 않습니다." });
  }
};

module.exports = {
  blogId,
  userId,
  commentId,
  islive,
  blogState,
  content,
  title,
  user,
  filledusername,
  filledName,
  filledAge,
};
