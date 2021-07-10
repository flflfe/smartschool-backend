import Summary from "../models/summary.js";

export const saveManysummarys = async (summaryArray) => {
  // console.log(summaryArray.length);
  summaryArray.forEach((summary) => {
    delete Object.assign(summary, { ["s_id"]: summary["id"] })["id"];
  });
  const summarys = await Summary.insertMany(summaryArray, {
    ordered: false,
  }).catch((err) => console.log(err));
  //   console.log(summarys);
  return summarys;
};
