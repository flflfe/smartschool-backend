import express from "express";
const { Router } = express;

import auth from "../auth/auth.js";
import checkRole from "../auth/checkRole.js";
import {
  getchapters,
  createchapter,
  getchapter,
} from "../controllers/chapterController.js";
import {
  createsubject,
  getMysubjects,
} from "../controllers/subjectsController.js";
import classroomsController from "../controllers/classRoomsController.js";
import { USER_ROLES } from "../Utils/constants.js";
import resourcesModel from "../models/resources.js";
import {createAndUploadTextFile} from "../services/textFileCreator.js";
import chatperModel from "../models/chapters.js";
import {
  createrecording,
  getrecording,
  requestProcessing,
  checkIfCompleted,
} from "../controllers/recordingsController.js";
import { createresource } from "../controllers/resourcesController.js";
import {textFileCreator} from '../services/textFileCreator.js'
import {
  isSubjectChapterAvailable,
  isSubjectAvailable,
} from "../middlewares/subjectMiddleware.js";

const router = Router();

router.get("/chapters/:id", auth(), getchapter);
router.post("/recordings/:id/requestprocessing", auth(), requestProcessing);
router.post("/recordings/:id/checkstatus", auth(), checkIfCompleted);
router.get("/recordings/:id", getrecording);
router.post(
  "/chapters/:chapter/recordings",
  auth(),
  checkRole([USER_ROLES.TEACHER]),
  createrecording
);
router.post(
  "/subjects/:subject/chapters/:chapter/resources",
  auth(),
  checkRole([USER_ROLES.TEACHER]),
  createresource
);
router.post(
  "/subjects/:subject/chapters",
  auth(),
  checkRole([USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER]),
  isSubjectAvailable,
  createchapter
);
router.get("/subjects/:subject/chapters", auth(), getchapters);
router.post(
  "/classrooms/:classroom/subjects",
  auth(),
  checkRole(["admin"]),
  createsubject
);

router.patch(
  "/subjects/:subject/chatpers",
  auth(),
  checkRole([USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN]),
  isSubjectChapterAvailable,
  async (req, res, next) => {
    const name = req.body.name;

    try {
      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        const __response__update = await chatperModel.findByIdAndUpdate(
          req.chapter,
          { name },
          { new: true }
        );
        if (!__response__update)
          throw new Error("Invalid Operation No Such Chapter to Update");
        return res.send({
          message: "Update Sucess",
          Response: __response__update,
        });
      }

      console.log(name);
      const __response__update = await chatperModel.findByIdAndUpdate(
        req.chapter,
        { name },
        { new: true }
      );
      if (!__response__update)
        throw new Error("Invalid Operation!!! No Such Chapter");
      return res.send({
        message: "Update Success",
        Response: __response__update,
      });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  }
);

//Resources Update Route(done)
router.patch(
  "/subjects/:subject/chatpers/:chapter/resources/:resource",
  auth(),
  checkRole([USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN]),
  isSubjectChapterAvailable,
  async (req, res, next) => {
    const resourceId = req.params.resource;
    const newFileUrl = req.body.fileUrl;
    try {
      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        const __response__update = await resourcesModel.findOneAndUpdate(
          { _id: resourceId },
          { fileUrl: newFileUrl }
        );
        if (!__response__update)
          throw new Error("Invalid Operation No Such Resources to Update");
        return res.send({
          message: "resource Uudate  Sucess",
          Response: __response__update,
        });
      }
      const __response__update = await resourcesModel.findOneAndUpdate(
        { _id: resourceId },
        { fileUrl: newFileUrl },
        { new: true }
      );
      if (!__response__update)
        throw new Error("Invalid Operation!!! No Such Resource");
      return res.send({
        message: "resource update Success",
        Response: __response__update,
      });
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
);

router.delete(
  "/subjects/:subject/chatpers/",
  auth(),
  checkRole([USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN]),
  isSubjectChapterAvailable,
  async (req, res, next) => {
    try {
      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        const __response__deletion = await chatperModel.findByIdAndDelete(
          req.chapter
        );
        if (!__response__deletion)
          throw new Error("Invalid Operation No Such Chapter");
        return res.send({
          message: "Deletion Sucess",
          Response: __response__deletion,
        });
      }

      console.log(req.chapter);
      const __response__deletion = await chatperModel.findByIdAndDelete(
        req.chapter
      );
      if (!__response__deletion)
        throw new Error("Invalid Operation!!! No Such Chapter");
      return res.send({
        message: "Deletion Sucess",
        Response: __response__deletion,
      });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  }
);

//delete specific resource of a chapter()
router.delete(
  "/subjects/:subject/chatpers/:chapter/resources",
  auth(),
  checkRole([USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN]),
  isSubjectChapterAvailable,
  async (req, res, next) => {
    const resource_id = req.body.resource_id;
    try {
      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        const __response__deletion = await resourcesModel.findOneAndDelete({
          _id: resource_id,
          chapter: req.chapter,
        });
        if (!__response__deletion)
          throw new Error("Invalid Operation No Such Resource to Delete");
        return res.send({
          message: "Resource delete process success",
          Response: __response__deletion,
        });
      }

      const __response__deletion = await resourcesModel.findOneAndDelete({
        _id: resource_id,
        chapter: req.chapter,
      });
      if (!__response__deletion)
        throw new Error("Invalid Operation!!! No Such Resource to Delete");
      return res.send({
        message: "Resource Deletion Success",
        Response: __response__deletion,
      });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  }
);

router.post('/subjects/:subject/chapters/:chapter/transcript/upload',
auth(),
checkRole([USER_ROLES.SUPER_ADMIN,USER_ROLES.TEACHER]),
isSubjectChapterAvailable,
async(req,res,next)=>{
    try{
        const responseUrl = await createAndUploadTextFile(req.body.response_json)
        return res.send({file_url:responseUrl})
    }catch(error){
        return res.send({ error: error.message });

    }
   


}

)
router.use("/classrooms", auth(), classroomsController);
router.get("/subjects/", auth(), getMysubjects);
export default router;
