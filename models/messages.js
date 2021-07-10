import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const messagesSchema = new Schema({
  m_id: { type: Number, unique: false },
  text: String,
  from: {
    id: String,
    name: String,
  },
  startTime: Number,
  endTime: Number,
  phrases: [
    {
      type: { type: String },
      text: String,
    },
  ],
  sentiment: {
    polarity: {
      score: Number,
    },
    suggested: String,
  },
});

const messages = model("messages", messagesSchema);

export default messages;
