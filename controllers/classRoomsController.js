import express from "express";
const { Router } = express;
import classrooms from "../models/classrooms.js";
import checkRole from "../auth/checkRole.js";
import { USER_ROLES } from "../Utils/constants.js";
const router = Router();

export async function getclassrooms(req, res) {
  try {
    const classroomList = await classrooms.find({});
    res.send({ classrooms: classroomList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getclassroom(req, res) {
  try {
    const classroom = await classrooms
      .findOne({ _id: req.params.id })
      .populate({
        path: "subjects",
        populate: { path: "teachers", select: ["Name"] },
      });
    res.send({ classroom });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function createclassroom(req, res) {
  const classroom = new classrooms(req.body);
  try {
    await classroom.save();
    res.send({ classroom });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteclassroom(req, res) {
  try {
    const classroom = await classrooms.findByIdAndDelete(req.params.id);

    if (!classroom) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "classroom deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateclassroom(req, res) {
  try {
    await classrooms.findByIdAndUpdate(req.params.id, req.body);
    const classroom = await classrooms.findOne({ _id: req.params.id });
    res.send({ classroom });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", checkRole([USER_ROLES.SUPER_ADMIN]), getclassrooms);
router.get("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), getclassroom);
router.post("/", checkRole([USER_ROLES.SUPER_ADMIN]), createclassroom);
router.patch("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), updateclassroom);
router.delete("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), deleteclassroom);

export default router;
