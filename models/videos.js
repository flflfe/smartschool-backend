import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const videosSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: String,
  isComplete: { type: Boolean, default: false },
  transcipt: Object,
  questions: Object,
  followups: Object,
  summary: Object,
  topics: Object,
  actions: Object,
});

const videos = model("videos", videosSchema);

export default videos;
