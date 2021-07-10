import express from "express";
const { Router } = express;

import auth from "../auth/auth.js";
import checkRole from "../auth/checkRole.js";
import chaptersController from "../controllers/chapterController.js";
import subjectsController from "../controllers/subjectsController.js";
import {
  getchapters,
  createchapter,
} from "../controllers/chapterController.js";
import { USER_ROLES } from "../Utils/constants.js";

const router = Router();

router.use("/chapters/", auth(), chaptersController);
router.post(
  "/subjects/:subject/chapters",
  auth(),
  checkRole([USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER]),
  createchapter
);
router.get("/subjects/:subject/chapters", auth(), getchapters);
router.use("/subjects/", auth(), subjectsController);
export default router;
