import Summary from "../models/summary.js";
import { populateMessage } from "../Utils/messagePopulate.js";

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

export const getPopulatedSummary = async (req, res) => {
  try {
    const summary_id = req.params.summary;
    const summary = await Summary.findOne({ _id: summary_id });
    const getMessages = async (messageIds) => {
      return await Promise.all(messageIds.map(({ id }) => populateMessage(id)));
    };
    const messages = await getMessages(summary.messageRefs);
    res.send({ ...summary.toObject(), messages });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
