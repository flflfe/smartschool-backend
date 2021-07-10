import express from "express";
const { Router } = express;

import auth from "../auth/auth.js";
import checkRole from "../auth/checkRole.js";
import chaptersController, {
  getchapters,
  createchapter,
} from "../controllers/chapterController.js";
import subjectsController, {
  createsubject,
  getMysubjects,
} from "../controllers/subjectsController.js";
import classroomsController from "../controllers/classroomsController.js";
import { USER_ROLES } from "../Utils/constants.js";
import { createrecording } from "../controllers/recordingsController.js";
import { createresource } from "../controllers/resourcesController.js";

const router = Router();

// router.use("/chapters/", auth(), chaptersController);
router.post(
  "/chapters/:chapter/recordings",
  auth(),
  checkRole([USER_ROLES.TEACHER]),
  createrecording
);
router.post(
  "/chapters/:chapter/resources",
  auth(),
  checkRole([USER_ROLES.TEACHER]),
  createresource
);
router.post(
  "/subjects/:subject/chapters",
  auth(),
  checkRole([USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER]),
  createchapter
);
router.get("/subjects/:subject/chapters", auth(), getchapters);
router.post(
  "/classrooms/:classroom/subjects",
  auth(),
  checkRole(["admin"]),
  createsubject
);
router.use("/classrooms", auth(), classroomsController);
router.get("/subjects/", auth(), getMysubjects);
export default router;
