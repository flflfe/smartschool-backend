import express from "express";
const { Router } = express;
import chapters from "../models/chapters.js";
import subjects from "../models/subjects.js";

import checkRole from "../auth/checkRole.js";
import recordings from "../models/recordings.js";
import { createAndUploadTextFile } from "../services/textFileCreator.js";
import { createKB } from "../services/qnaMaker.js";
import config from "../config.js";
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
    await subjects.findByIdAndUpdate(req.subject, { chapters: chapter._id });
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
export const transcriptToTextFile = async (recordingsList) => {
  let transcriptText = "";
  for (const recordingId of recordingsList) {
    const transcripts = await recordings
      .findOne({ _id: recordingId }, { transcript: 1 })
      .populate({ path: "transcript" });
    transcripts.transcript.sort((a, b) => {
      a.startTime - b.startTime;
    });
    transcripts.transcript.forEach((message) => {
      // console.log(message.text);
      transcriptText += message.text + "\n";
    });
  }
  return transcriptText;
};

export const createKnowledgeBase = async (req, res) => {
  const chapterId = req.params.chapter;
  const chapterObj = await chapters.findOne({ _id: chapterId }, { name: 1 });
  if (!chapterObj) {
    return res.status(400).send({ Error: "Invalid Chapter Id" });
  }
  const { recordingsId, resourcesArray } = req.body;
  const textContent = await transcriptToTextFile(recordingsId);
  const textFileUrl = await createAndUploadTextFile(textContent, chapterId);
  const resourceFiles =
    (resourcesArray &&
      resourcesArray.length &&
      resourcesArray.map((resource) => {
        const fileExt = resource.fileUrl.match(".(txt|docx|pdf|doc)$")[0];
        return {
          fileName: `${resource.name}${fileExt}`,
          fileUri: resource.fileUrl,
          isUnstructured: true,
        };
      })) ||
    [];
  const files = [
    {
      fileName: `${chapterObj.name}.docx`,
      fileUri: textFileUrl,
      isUnstructured: true,
    },
    ...resourceFiles,
  ];
  console.log(files);
  const kbId = await createKB(chapterObj.name, files);
  chapterObj.isPublished = false;
  chapterObj.chatBotId = kbId;
  chapterObj.chatbotSubKey = config.QnA_subscription_key;
  chapterObj.save();
  res.send(chapterObj);
};

// router.get("/:subject/chapters", getchapters);
router.get("/:id", getchapter);
// router.post("/", checkRole(["admin"]), createchapter);
router.patch("/:id", checkRole(["admin"]), updatechapter);
router.delete("/:id", checkRole(["admin"]), deletechapter);

export default router;
