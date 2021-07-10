import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const actionsSchema = new Schema(
  {
    text: String,
  },
  { strict: false }
);

const actions = model("actions", actionsSchema);

export default actions;
