import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const questionsSchema = new Schema({
  q_id: { type: Number, unique: true },
  text: String,
  type: { type: Number },
  score: Number,
  messageIds: [{ type: Number ,ref:"messages"}],
  from: {
    id: String,
    name: String,
  },
}, { toJSON: { virtual: true },toObject:{virtual:true} });


questionsSchema.virtual('question', {
  ref: 'messages',
  localField: 'messageIds',
  foreignField: 'm_id',

})



const questions = model("questions", questionsSchema);

export default questions;
