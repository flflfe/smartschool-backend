import Messages from "./../models/messages.js";

export const saveManyMessages = async (messageArray) => {
  console.log(messageArray.length);
  const messages = await Messages.insertMany(messageArray, {
    ordered: false,
  }).catch((err) => console.log(err));
  //   console.log(messages);
  return messages;
};
