import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const recordingsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: "users" },
  chapter: { type: Schema.Types.ObjectId, ref: "chapters" },
  jobId: String,
  conversationId: String,
  recordingUrl: String,
  isRequested: { type: Boolean, default: false },
  isComplete: { type: Boolean, default: false },
  transcript: [{ type: Schema.Types.ObjectId, ref: "messages" }],
  questions: [{ type: Schema.Types.ObjectId, ref: "questions" }],
  followups: [{ type: Schema.Types.ObjectId, ref: "followups" }],
  summary: [{ type: Schema.Types.ObjectId, ref: "summary" }],
  topics: [{ type: Schema.Types.ObjectId, ref: "topics" }],
  actions: [{ type: Schema.Types.ObjectId, ref: "actions" }],
  startTime: String,
  endTime: String,
});

const recordings = model("recordings", recordingsSchema);

export default recordings;
