import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const summarySchema = new Schema({
  s_id: { type: Number, unique: true },
  text: String,
  messageRefs: [{ id: Number }],
});

const summary = model("summary", summarySchema);

export default summary;
