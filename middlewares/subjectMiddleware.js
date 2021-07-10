import subjectModel from "../models/subjects.js";
import chapterModel from "../models/chapters.js";

import { USER_ROLES } from "../Utils/constants.js";

export const isSubjectChapterAvailable = async(req, res, next) => {
    const chapter = req.params.chapter || req.body.chapter_id
    const subject = req.params.subject


    try {
        if (req.user.role === USER_ROLES.SUPER_ADMIN) {
            const isSubjectAvailable = await subjectModel.findOne({ _id: subject_id, chapters: chapter })
            if (!isSubjectAvailable) return res.status(404).send({ message: "No such subject or chapter is available" })
        }
        const isSubjectAvailable = await subjectModel.findOne({ _id: subject, teachers: req.user._id, chapters: chapter })
        if (!isSubjectAvailable) return res.status(404).send({ message: "Invalid Operation. Either UnAuthorized or Invalid Subject or Chapter" })
        req.chapter = chapter
        req.subject = subject

        next()
    } catch (err) {
        return res.status(404).send({ message: err.message })

    }
}

export const isSubjectAvailable = async(req, res, next) => {
    const chapter = req.params.chapter
    const subject = req.params.subject


    try {
        if (req.user.role === USER_ROLES.SUPER_ADMIN) {
            const isSubjectAvailable = await subjectModel.findOne({ _id: subject_id })
            if (!isSubjectAvailable) return res.status(404).send({ message: "No such subject  is available" })
        }
        const isSubjectAvailable = await subjectModel.findOne({ _id: subject, teachers: req.user._id })
        if (!isSubjectAvailable) return res.status(404).send({ message: "Invalid Operation. Either UnAuthorized or Invalid Subject" })
        req.chapter = chapter
        req.subject = subject
        next()
    } catch (err) {

        return res.status(404).send({ message: err.message })

    }
}