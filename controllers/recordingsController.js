import express from "express";
const { Router } = express;
import recordings from "../models/recordings.js";
import checkRole from "../auth/checkRole.js";
import chapters from "./../models/chapters.js";
import {
  checkJobStatus,
  getActions,
  getConversationDetails,
  getFollowups,
  getQuestions,
  getSummary,
  getTopics,
  getTranscript,
  submitVideo,
} from "../services/languageprocessor.js";
import { tokenGenerator } from "../Utils/authtokengenerator.js";
import { saveManyMessages } from "./messagesController.js";
import { saveManyquestions } from "./questionsController.js";
import { saveManyfollowups } from "./followupsController.js";
import { saveManyTopics } from "./topicsController.js";
import { saveManyactions } from "./actionsController.js";
import { saveManysummarys } from "./summaryController.js";
import recordings from "./../models/recordings";
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
export async function getRecordingProperty(req, res) {
  const property = req.params.property;
  try {
    const recording = await recordings
      .findOne({ _id: req.params.id }, { [property]: 1 })
      .populate({ path: property });
    if (property === "transcript") {
      recording.transcript.sort((a, b) => {
        a.startTime - b.startTime;
      });
    }
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
    const chapter = await chapters.findOne({ _id: recording.chapter });
    const customVocabulary = chapter.VocabularyList.map((obj) => obj.data);
    // console.log({ customVocabulary });
    const processingStatus = await submitVideo({
      url: recording.recordingUrl,
      customVocabulary,
    });
    if (processingStatus?.error) {
      throw new Error(processingStatus.data.message);
    }
    recording.isRequested = true;
    recording.conversationId = processingStatus.conversationId;
    recording.jobId = processingStatus.jobId;
    await recording.save();
    return res.send({ processingStatus, recording });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error.message });
  }
};

const convertTimeStamp = (data, startTime) => {
  const startTimeDate = new Date(startTime);
  data.forEach((message) => {
    delete Object.assign(message, { ["m_id"]: message["id"] })["id"]; //rename id to m_id
    const messageStartDate = new Date(message.startTime);
    const messageEndDate = new Date(message.endTime);
    message.startTime = messageStartDate - startTimeDate;
    message.endTime = messageEndDate - startTimeDate;
  });
  return data;
};

export const checkIfCompleted = async (req, res) => {
  const id = req.params.id || req.recordingId;
  try {
    const recording = await recordings.findOne({ _id: id });
    if (recording.isComplete) {
      return res.status(409).send({ Error: "Already Completed" });
    }
    const token = await tokenGenerator();
    const status = await checkJobStatus(recording.jobId, token);
    if (status.status === "completed") {
      const conversationDetails = await getConversationDetails(
        recording.conversationId,
        token
      );
      // console.log(conversationDetails);
      const { startTime, endTime } = conversationDetails;
      recording.startTime = startTime;
      recording.endTime = endTime;
      recording.startTime;
      const [
        { value: transcript },
        { value: questions },
        { value: followups },
        { value: summary },
        { value: topics },
        { value: actions },
      ] = await Promise.allSettled([
        getTranscript(recording.conversationId, token),
        getQuestions(recording.conversationId, token),
        getFollowups(recording.conversationId, token),
        getSummary(recording.conversationId, token),
        getTopics(recording.conversationId, token),
        getActions(recording.conversationId, token),
      ]);

      const [
        { value: transcriptList },
        { value: questionsList },
        { value: followupsList },
        { value: summaryList },
        { value: topicsList },
        { value: actionsList },
      ] = await Promise.allSettled([
        saveManyMessages(convertTimeStamp(transcript.messages, startTime)),
        saveManyquestions(questions.questions),
        saveManyfollowups(followups.followUps),
        saveManysummarys(summary.summary),
        saveManyTopics(topics.topics),
        saveManyactions(actions.actionItems),
      ]);
      recording.transcript = transcriptList;
      recording.questions = questionsList;
      recording.followups = followupsList;
      recording.summary = summaryList;
      recording.topics = topicsList;
      recording.actions = actionsList;
      recording.isComplete = true;
      await recording.save();
      res.send({ status: "Completed" });
    } else {
      return res.send({ status: status.status || "Okay" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error.message });
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
