import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const resourcesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    fileUrl: { type: String },
    chapter: { type: Schema.Types.ObjectId, ref: "chapters" },
    author: { type: Schema.Types.ObjectId, ref: "users" },
});

const resources = model("resources", resourcesSchema);

export default resources;