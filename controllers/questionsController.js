import Questions from "../models/questions.js";
import { populateMessage } from "../Utils/messagePopulate.js";

export const saveManyquestions = async (questionArray) => {
  questionArray.forEach((element) => {
    delete Object.assign(element, { ["q_id"]: element["id"] })["id"];
  });
  // console.log(questionArray.length);
  const questionList = await Questions.insertMany(questionArray, {
    ordered: true,
  }).catch((err) => console.log(err));
  //   console.log(questions);
  return questionList;
};

export const getPopulatedQuestion = async (req, res) => {
  try {
    const question_id = req.params.question;
    const question = await Questions.findOne({ _id: question_id });
    const getMessages = async (messageIds) => {
      return await Promise.all(messageIds.map((id) => populateMessage(id)));
    };
    const messages = await getMessages(question.messageIds);
    res.send({ ...question.toObject(), messages });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
