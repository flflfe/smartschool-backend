import Topics from "../models/topics.js";

export const saveManyTopics = async (topicArray) => {
  // console.log(qopicArray.length);
  topicArray.forEach((topic) => {
    delete Object.assign(topic, { ["t_id"]: topic["id"] })["id"];
  });
  const topics = await Topics.insertMany(topicArray, {
    ordered: false,
  }).catch((err) => console.log(err));
  //   console.log(topics);
  return topics;
};
