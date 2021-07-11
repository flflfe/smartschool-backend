import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const topicsSchema = new Schema({
  t_id: { type: Number, unique: true },
  text: String,
  type: { type: String },
  messageIds: [String],
  parentRefs: [Object],
});

const topics = model("topics", topicsSchema);

export default topics;
