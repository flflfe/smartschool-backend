import express from "express";
const { Router } = express;

import {
  // createKnowledgeBase,
  publishKnowledgeBase,
  generateKBAnswer,
  createKB,
} from "../services/qnaMaker.js";

const router = Router();

router.post("/kb/create", async (req, res, next) => {
  try {
    const kbname = req.body.name;
    const urls = req.body.urls;
    const kdId = await createKB(kbname);
    if (!kdId) throw new Error("Error Creating KB");
    console.log(kdId);
    return res.send({ Id: kdId });
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/kb/publish", async (req, res, next) => {
  try {
    const result = await publishKnowledgeBase(req.body.kb_id);
    if (result) return res.send({ message: "Sucess", result });
    throw new Error("Failed to Publish KB.Try Again");
  } catch (error) {
    return res.send({ Error: error.message });
  }
});

router.post("/kb/qn", async (req, res, next) => {
  try {
    const qnObject = req.body.qn;
    const kb_id = req.body.kb_id;
    console.log(kb_id, qnObject);
    const response = await generateKBAnswer(kb_id, qnObject);
    return res.json({ answer: response });
  } catch (E) {
    console.log(E);
    return res.send({ error: E.message });
  }
});
export default router;
