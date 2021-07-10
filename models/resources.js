import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const resourcesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  filUrl: { type: String },
});

const resources = model("resources", resourcesSchema);

export default resources;
