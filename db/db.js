import mongoose from "mongoose";
const { connect } = mongoose;
import config from "../config.js";
const { mongoDbKey } = config;

const mongo = connect(mongoDbKey, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then((e) => console.log("connected to db"))
  .catch((e) => {
    console.log(e);
  });
