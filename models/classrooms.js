import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const classroomsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subjects: [{ type: Schema.Types.ObjectId, ref: "subjects" }],
});

const classrooms = model("classrooms", classroomsSchema);

export default classrooms;
