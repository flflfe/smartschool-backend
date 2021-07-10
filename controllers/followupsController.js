import Followup from "../models/followUps.js";

export const saveManyfollowups = async (followupArray) => {
  // console.log(followupArray.length);
  followupArray.forEach((element) => {
    delete Object.assign(element, { ["f_id"]: element["id"] })["id"];
  });
  const followups = await Followup.insertMany(followupArray, {
    ordered: false,
  }).catch((err) => console.log(err));
  //   console.log(followups);
  return followups;
};
