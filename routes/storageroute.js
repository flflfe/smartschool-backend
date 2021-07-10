import { Router } from "express";
import multer from "multer";
import {
  getUploadedFile,
  uploadFileAzure,
} from "../controllers/uploadControllers.js";

const inMemoryStorage = multer.memoryStorage();

const uploadStrategy = multer({ storage: inMemoryStorage }).single("video");

const router = Router();
// router.get("/getall", getUploadedFile);

router.post("/media/upload", uploadStrategy, uploadFileAzure);

export default router;
