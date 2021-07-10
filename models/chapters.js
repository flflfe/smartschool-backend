import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const chaptersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "classrooms",
  },
  date: {
    default: Date.now(),
    type: Date,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videos",
    },
  ],
  resourceFiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resources",
    },
  ],
  organizer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  chatBotId: {
    type: String,
    default: null,
  },
});

const chapters = model("chapters", chaptersSchema);

export default chapters;
