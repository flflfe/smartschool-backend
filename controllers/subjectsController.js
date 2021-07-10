import express from "express";
const { Router } = express;
import subjects from "../models/subjects.js";
import checkRole from "../auth/checkRole.js";
const router = Router();
import { USER_ROLES } from "../Utils/constants.js";
import classrooms from "../models/classrooms.js";

export async function getMysubjects(req, res) {
  try {
    let subjectList;
    if (req.user.role === USER_ROLES.TEACHER) {
      subjectList = await subjects
        .find({ teachers: req.user._id }, { chapters: 0 })
        .populate({ path: "classroom", select: ["name"] })
        .populate({ path: "teachers", select: ["Name"] });
    }
    if (req.user.role === USER_ROLES.STUDENT) {
      const myClassroom = await classrooms.findById(req.user.classroom);
      if (myClassroom) {
        subjectList = await subjects
          .find({ classroom: myClassroom._id }, { chapters: 0 })
          .populate({ path: "classroom", select: ["name"] })
          .populate({ path: "teachers", select: ["Name"] });
      } else {
        subjectList = [];
      }
    }
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      subjectList = await subjects
        .find({}, { chapters: 0 })
        .populate({ path: "classroom", select: ["name"] })
        .populate({ path: "teachers", select: ["Name"] });
    }
    res.send({ subjects: subjectList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function getsubject(req, res) {
  try {
    const subject = await subjects.findOne({ _id: req.params.id });
    res.send({ subject });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function createsubject(req, res) {
  const classroom = await classrooms.findOne({ _id: req.params.classroom });
  if (!classroom) {
    return res.status(404).send({ Error: "Classroom not found" });
  }
  const subject = new subjects({
    name: req.body.name,
    classroom: classroom,
    teachers: req.body.teachers,
  });
  try {
    await subject.save();
    classroom.subjects.push(subject);
    await classroom.save();
    res.send({ subject });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function deletesubject(req, res) {
  try {
    const subject = await subjects.findByIdAndDelete(req.params.id);

    if (!subject) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "subject deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updatesubject(req, res) {
  try {
    await subjects.findByIdAndUpdate(req.params.id, req.body);
    const subject = await subjects.findOne({ _id: req.params.id });
    res.send({ subject });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", getMysubjects);
router.get("/:id", getsubject);
// router.post("/", checkRole(["admin"]), createsubject);
router.patch("/:id", checkRole(["admin"]), updatesubject);
router.delete("/:id", checkRole(["admin"]), deletesubject);

export default router;
