import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const chaptersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subjects",
  },
  recordings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recordings",
    },
  ],
  resourceFiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resources",
    },
  ],
  chatBotId: {
    type: String,
    default: null,
  },
  isPublished: { type: Boolean, default: false },
  VocabularyList: [
    {
      data: {
        type: String,
      },
    },
  ],
  chatbotSubKey: { type: String, default: null },
});

const chapters = model("chapters", chaptersSchema);

export default chapters;
