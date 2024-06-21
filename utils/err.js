const errMessage = (res, err) => {
  console.log(err);
  return res.status(500).send({ err: err.massage });
};
module.exports = { errMessage };
