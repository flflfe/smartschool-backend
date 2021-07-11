import { Router } from "express";
import multer from "multer";
import { uploadFileToAzure } from '../services/azureUpload.js'
import { UPLOAD_TYPE } from "../Utils/constants.js";

const inMemoryStorage = multer.memoryStorage();
const videoUploadStrategy = multer({
    storage: inMemoryStorage,
    limits: 1000000,
    fileFilter(req, file, callback) {
        if (!file.originalname.match('(.*?)\.(webm|mp4)$')) {
            return callback(new Error("Invalid file type"))
        }
        callback(undefined, true)
    }
}).single("videos")


const fileUploadStrategy = multer({
    storage: inMemoryStorage,
    limits: 10000000,
    fileFilter(req, file, callback) {
        if (!file.originalname.match('(.*?)\.(txt|docx|pdf|doc)$')) {
            return callback(new Error("Invalid file type"))
        }
        callback(undefined, true)
    }
}).single("documents")





const router = Router();

router.post("/upload/files", fileUploadStrategy, async(req, res) => {
    try {
        const upload = await uploadFileToAzure(req.file, UPLOAD_TYPE.AZURE_UPLOAD_FILE)
        return res.send({ Message: "File Uploaded Sucessfully", Response: upload })
    } catch (error) {
        res.send({ error: error.message })

    }
}, (err, req, res, next) => {
    // file size error
    if (err instanceof multer.MulterError) {
        return res.send({
            fileSize: "Max file size 40MB allowed!"
        });
    }
    //Normal Errors
    else if (err) {
        return res.send({
            Error: err.message,
            allowed: "Only Docs and Pdf are allowed"
        });
    }

});

router.post("/upload/videos", videoUploadStrategy, async(req, res) => {
    if(!req.file)throw new Error('Please select any video file')
        try {
            const upload = await uploadFileToAzure(req.file, UPLOAD_TYPE.AZURE_UPLOAD_VIDEOS)
            return res.send({ Message: "Video Uploaded Sucessfully", Response: upload })
        } catch (error) {
            res.send({ error: error.message })

        }
    },
    (err, req, res, next) => {
        // file size error
        if (err instanceof multer.MulterError) {
            return res.send({
                fileSize: "Max file size 40MB allowed!"
            });
        }
        //Normal Errors
        else if (err) {
            return res.send({
                Error: err.message,
                allowed: "Only Vidoes file are allowed"
            });
        }

    });
export default router;