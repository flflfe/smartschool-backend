import messages from "./../models/messages.js";

export const populateMessage = async (m_id) => {
  const messageObj = await messages.findOne({ m_id: m_id });
  console.log(messageObj);
  return messageObj;
};
