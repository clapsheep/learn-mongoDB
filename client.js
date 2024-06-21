console.log("클라이언트 코드 실행");

const { default: axios } = require("axios");

const URI = "http://localhost:3000";

const test = async () => {
  console.time("loading time : ");

  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);
  console.log("블로그 전체를 읽었지만 1번째 거만 출력", blogs[0]);

  console.timeEnd("loading time : ");
};
test();
