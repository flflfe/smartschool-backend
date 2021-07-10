import express from "express";
const { Router } = express;
import meetings from "../models/chapters.js";
import checkRole from "../auth/checkRole.js";
const router = Router();

export async function getmeetings(req, res) {
  try {
    const meetingList = await meetings.find({});
    res.send({ meetings: meetingList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getmeeting(req, res) {
  try {
    const meeting = await meetings.findOne({ _id: req.params.id });
    res.send({ meeting });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function createmeeting(req, res) {
  const meeting = new meetings(req.body);
  try {
    await meeting.save();
    res.send({ meeting });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deletemeeting(req, res) {
  try {
    const meeting = await meetings.findByIdAndDelete(req.params.id);

    if (!meeting) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "meeting deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updatemeeting(req, res) {
  try {
    await meetings.findByIdAndUpdate(req.params.id, req.body);
    const meeting = await meetings.findOne({ _id: req.params.id });
    res.send({ meeting });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/all", checkRole(["admin"]), getmeetings);
router.get("/:id", getmeeting);
router.post("/", checkRole(["admin"]), createmeeting);
router.patch("/:id", checkRole(["admin"]), updatemeeting);
router.delete("/:id", checkRole(["admin"]), deletemeeting);

export default router;
