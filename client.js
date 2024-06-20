const { default: axios } = require("axios");

const test = async () => {
  let {
    data: { blogs },
  } = await axios.get("http://localhost:3000/blog");

  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const res1 = await axios.get(`http://localhost:3000/user/${blog.user}`);
      const res2 = await axios.get(
        `http://localhost:3000/blog/${blog._id}/comment`
      );
      blog.user = res1.data.user;
      blog.comments = res2.data.comments;
      return blog;
    })
  );
  console.log(blogs[0]);
};
test();
