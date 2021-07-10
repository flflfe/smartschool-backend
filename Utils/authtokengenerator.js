import Axios from "axios";
import config from "../config.js";
const { SYMBL_APP_ID, SYMBL_APP_SECRET } = config;
import { API } from "../Utils/constants.js";

export const tokenGenerator = async () => {
  const data = {
    type: "application",
    appId: SYMBL_APP_ID,
    appSecret: SYMBL_APP_SECRET,
  };
  try {
    const res = await Axios({
      method: "post",
      url: API.REQUEST_TOKEN,
      data: data,
      headers: { "Content-Type": "application/json" },
    });
    return res.data.accessToken;
  } catch (err) {
    return err;
  }
};
