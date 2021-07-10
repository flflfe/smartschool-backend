import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const questionsSchema = new Schema({
  q_id: { type: Number, unique: false },
  text: String,
  type: { type: String },
  score: Number,
  messageIds: [String],
  from: {
    id: String,
    name: String,
  },
});

const questions = model("questions", questionsSchema);

export default questions;
