import Questions from "../models/questions.js";

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
