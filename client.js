const { default: axios } = require("axios");

const URL = "http://localhost:3000";
const test = async () => {
  let {
    data: { blogs },
  } = await axios.get(`${URL}/blog`);

  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const [res1, res2] = await Promise.all([
        axios.get(`${URL}/user/${blog.user}`),
        axios.get(`${URL}/blog/${blog._id}/comment`),
      ]);

      blog.user = res1.data.user;
      blog.comments = await Promise.all(
        res2.data.comments.map(async (comment) => {
          const {
            data: { user },
          } = await axios.get(`${URL}/user/${comment.user}`);
          comment.user = user;
          return comment;
        })
      );
      return blog;
    })
  );
  console.dir(blogs[0], { depth: 10 });
};
test();
