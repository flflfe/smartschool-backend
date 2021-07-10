import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const followupSchema = new Schema(
  {
    text: String,
  },
  { strict: false }
);

const followup = model("followup", followupSchema);

export default followup;
