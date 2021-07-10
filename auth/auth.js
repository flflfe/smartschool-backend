import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken;
import userModels from "../models/users.js";
import config from "../config.js";
const { jwtsigninKey } = config;

const auth = () => async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("No Auth Header");
    const token = req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    const payload = verify(token, jwtsigninKey);
    const user = await userModels.findOne({
      _id: payload._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    return next();
  } catch (e) {
    console.log(e);
    return res.send({ Error: "Unable to Authorize" });
  }
};

export default auth;
