import express from "express";
const { Router } = express;
import recordings from "../models/recordings.js";
import checkRole from "../auth/checkRole.js";
import chapters from "./../models/chapters.js";
import {
  checkJobStatus,
  getActions,
  getFollowups,
  getQuestions,
  getSummary,
  getTopics,
  getTranscript,
  submitVideo,
} from "../services/languageprocessor.js";
const router = Router();

export async function getrecordings(req, res) {
  try {
    const recordingList = await recordings.find({});
    res.send({ recordings: recordingList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getrecording(req, res) {
  try {
    const recording = await recordings
      .findOne({ _id: req.params.id })
      .populate({ path: "author", select: ["Name"] })
      .populate({ path: "chapter", select: ["name"] });
    res.send({ recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function createrecording(req, res) {
  const chapter = await chapters.findOne({ _id: req.params.chapter });
  if (!chapter) {
    return res.status(404).send({ Error: "No such chapter" });
  }
  const recording = new recordings({
    title: req.body.title,
    recordingUrl: req.body.recordingUrl,
    chapter: chapter._id,
    isComplete: false,
    author: req.user._id,
  });
  try {
    await recording.save();
    chapter.recordings.push(recording);
    await chapter.save();
    res.send({ recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function deleterecording(req, res) {
  try {
    const recording = await recordings.findByIdAndDelete(req.params.id);

    if (!recording) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "recording deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updaterecording(req, res) {
  try {
    await recordings.findByIdAndUpdate(req.params.id, req.body);
    const recording = await recordings.findOne({ _id: req.params.id });
    res.send({ recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export const requestProcessing = async (req, res) => {
  try {
    const recording = await recordings.findOne({ _id: req.params.id });
    if (!recording) {
      return res.status(400).send({ Error: "Invalid recording Url" });
    }
    if (recording.isRequested) {
      return res.status(409).send({ Error: "Already Requested" });
    }
    const processingStatus = await submitVideo({ url: recording.recordingUrl });
    recording.isRequested = true;
    recording.conversationId = processingStatus.conversationId;
    recording.jobId = processingStatus.jobId;
    await recording.save();
    return res.send({ processingStatus, recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
};

export const checkIfCompleted = async (req, res) => {
  const id = req.params.id || req.recordingId;
  try {
    const recording = await recordings.findOne({ _id: id });
    if (recording.isComplete) {
      return res.status(409).send({ Error: "Already Completed" });
    }
    const status = await checkJobStatus(recording.jobId);
    if (status.status === "completed") {
      Promise.all([
        getTranscript(recording.conversationId),
        getQuestions(recording.conversationId),
        getFollowups(recording.conversationId),
        getSummary(recording.conversationId),
        getTopics(recording.conversationId),
        getActions(recording.conversationId),
      ]).then(
        ([transcript, questions, followups, summary, topics, actions]) => {
          recording.transcript = transcript;
          recording.questions = questions;
          recording.followups = followups;
          recording.summary = summary;
          recording.topics = topics;
          recording.actions = actions;
          recording.save();
          return res.send({ status: "Completed" });
        }
      );
    } else {
      return res.send({ status: status.status });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
};
export const webhookHandler = async (req, res) => {
  try {
    const { jobId } = req.body;
    const recording = await recordings.findOne({ jobId });
    if (!recording) {
      return res.status(404).send({ Error: "No recording with matching Id" });
    } else {
      return await checkIfCompleted(req, res);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
};

router.get("/all", checkRole(["admin"]), getrecordings);
router.get("/:id", getrecording);
// router.post("/", checkRole(["admin"]), createrecording);
router.patch("/:id", checkRole(["admin"]), updaterecording);
router.delete("/:id", checkRole(["admin"]), deleterecording);

export default router;
