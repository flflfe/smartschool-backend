import express from "express";
const { Router } = express;
import recordings from "../models/recordings.js";
import checkRole from "../auth/checkRole.js";
const router = Router();

export async function getrecordings(req, res) {
  try {
    const recordingList = await recordings.find({});
    res.send({ recordings: recordingList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getrecording(req, res) {
  try {
    const recording = await recordings.findOne({ _id: req.params.id });
    res.send({ recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function createrecording(req, res) {
  const recording = new recordings(req.body);
  try {
    await recording.save();
    res.send({ recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleterecording(req, res) {
  try {
    const recording = await recordings.findByIdAndDelete(req.params.id);

    if (!recording) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "recording deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updaterecording(req, res) {
  try {
    await recordings.findByIdAndUpdate(req.params.id, req.body);
    const recording = await recordings.findOne({ _id: req.params.id });
    res.send({ recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/all", checkRole(["admin"]), getrecordings);
router.get("/:id", getrecording);
router.post("/", checkRole(["admin"]), createrecording);
router.patch("/:id", checkRole(["admin"]), updaterecording);
router.delete("/:id", checkRole(["admin"]), deleterecording);

export default router;
