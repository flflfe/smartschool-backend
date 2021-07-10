import subjectModel from "../models/subjects.js";
import chapterModel from "../models/chapters.js";

import { USER_ROLES } from "../Utils/constants.js";

export const isSubjectChapterAvailable = async (req, res, next) => {
  const chapter = req.params.chapter || req.body.chapter_id
  const subject = req.params.subject


  try {
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      const isSubjectAvailable = await subjectModel.findOne({ _id: subject, chapters: chapter })
      if (!isSubjectAvailable) throw new Error("No such subject or chapter  is available")
    } else if (req.user.role === USER_ROLES.TEACHER) {
      const isSubjectAvailable = await subjectModel.findOne({ _id: subject, teachers: req.user._id, chapters: chapter })
      if (!isSubjectAvailable) throw new Error("Invalid operation.invalid subject or chapter")

    } else {
      throw new Error("Unauthorized for your role")
    }
    req.chapter = chapter
    req.subject = subject
    next()
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

export const isSubjectAvailable = async (req, res, next) => {
  const chapter = req.params.chapter;
  const subject = req.params.subject;

  try {

    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      const isSubjectAvailable = await subjectModel.findOne({ _id: subject });
      if (!isSubjectAvailable)
        throw new Error("No such subject  is available");
    } else if (req.user.role === USER_ROLES.TEACHER) {
      const isSubjectAvailable = await subjectModel.findOne({
        _id: subject,
        teachers: req.user._id,
      });
      if (!isSubjectAvailable)
        throw new Error("operation error not allowed")
    }

    else {
      throw new Error("Unauthorized for your role")
    }

    req.chapter = chapter;
    req.subject = subject;
    next();
  } catch (err) {
    return res.status(404).send({ message: err.message });
  }
};
