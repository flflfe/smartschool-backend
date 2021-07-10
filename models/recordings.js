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
  transcript: Object,
  questions: Object,
  followups: Object,
  summary: Object,
  topics: Object,
  actions: Object,
});

const recordings = model("recordings", recordingsSchema);

export default recordings;
