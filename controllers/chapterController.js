import express from "express";
const { Router } = express;
import chapters from "../models/chapters.js";
import subjects from "../models/subjects.js";

import checkRole from "../auth/checkRole.js";
const router = Router();

export async function getchapters(req, res) {
    try {
        const chapterList = await chapters.find({
            subject: req.params.subject,
        });
        res.send({ chapters: chapterList });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Error: error });
    }
}
export async function getchapter(req, res) {
    try {
        const chapter = await chapters
            .findOne({ _id: req.params.id })
            .populate({
                path: "recordings",
                select: ["title", "author"],
                populate: { path: "author", select: "Name" },
            })
            .populate({
                path: "resourceFiles",
                populate: { path: "author", select: "Name" },
            });
        res.send({ chapter });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Error: error });
    }
}
export async function createchapter(req, res) {
    const chapter = new chapters({
        name: req.body.name,
        subject: req.params.subject,
    });
    try {
        await chapter.save();
        await subjects.findByIdAndUpdate(req.subject, { chapters: chapter._id })
        res.send({ chapter });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Error: error });
    }
}
export async function deletechapter(req, res) {
    try {
        const chapter = await chapters.findByIdAndDelete(req.params.id);

        if (!chapter) return res.status(404).send({ Error: "No items Found" });
        res.send({ message: "chapter deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Error: error });
    }
}
export async function updatechapter(req, res) {
    try {
        await chapters.findByIdAndUpdate(req.params.id, req.body);
        const chapter = await chapters.findOne({ _id: req.params.id });
        res.send({ chapter });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Error: error });
    }
}
// router.get("/:subject/chapters", getchapters);
router.get("/:id", getchapter);
// router.post("/", checkRole(["admin"]), createchapter);
router.patch("/:id", checkRole(["admin"]), updatechapter);
router.delete("/:id", checkRole(["admin"]), deletechapter);

export default router;