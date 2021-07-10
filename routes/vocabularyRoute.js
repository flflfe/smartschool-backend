import {
    Router,
} from "express";
import { isSubjectAvailable } from "../middlewares/subjectMiddleware.js"
import auth from "../auth/auth.js";
import {
    getvocabularyList,
    addData,
    deleteVocabularyData,
    updateVocabularyData
} from "../controllers/vocabularyController.js";
const router = Router();

router.get("/subjects/:subject/chapters/:chapter/vocabulary", auth(),
    isSubjectAvailable, getvocabularyList);

router.post("/subjects/:subject/chapters/:chapter/vocabulary", auth(),
    isSubjectAvailable, addData);

router.delete("/subjects/:subject/chapters/:chapter/vocabulary", auth(),
    isSubjectAvailable, deleteVocabularyData);

router.patch("/subjects/:subject/chapters/:chapter/vocabulary", auth(),
    isSubjectAvailable, updateVocabularyData);
export default router;