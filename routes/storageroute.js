import { Router } from "express";
import multer from "multer";
import { getUploadedFile, uploadFileAzure } from '../controllers/uploadControllers.js'


const uploadStrategy = multer({ storage: inMemoryStorage, }).single("audio");
const inMemoryStorage = multer.memoryStorage();



const router = Router();
router.get("/audiofile", getUploadedFile);

router.post("/media/upload", uploadStrategy, uploadFileAzure);

module.exports = router;