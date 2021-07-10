import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const subjectsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  classroom: { type: Schema.Types.ObjectId, ref: "classrooms" },
  teachers: [{ type: Schema.Types.ObjectId, ref: "users" }],
  chapters: [{ type: Schema.Types.ObjectId, ref: "chapters" }],
});

const subjects = model("subjects", subjectsSchema);

export default subjects;
