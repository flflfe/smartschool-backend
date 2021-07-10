import {
    Router,
} from "express";
import { isSubjectAvailable } from "../middlewares/subjectMiddleware.js"
import auth from "../auth/auth.js";
import {
    getVocabilaryList,
    addData,
    deleteVocabilaryData,
    updateVocabilaryData
} from "../controllers/vocabilaryController.js";
const router = Router();

router.get("/subjects/:subject/chapters/:chapter/get", auth(),
    isSubjectAvailable, getVocabilaryList);

router.post("/subjects/:subject/chapters/:chapter/add", auth(),
    isSubjectAvailable, addData);

router.delete("/subjects/:subject/chapters/:chapter/remove", auth(),
    isSubjectAvailable, deleteVocabilaryData);

router.patch("/subjects/:subject/chapters/:chapter/update", auth(),
    isSubjectAvailable, updateVocabilaryData);
export default router;