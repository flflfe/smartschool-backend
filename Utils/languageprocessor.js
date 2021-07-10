import Axios from "axios";
import { tokenGenerator } from "./authtokengenerator.js";
import { API } from "./constants.js";

export const submitVideo = async ({ videoUrl }) => {
  const data = {
    url: videoUrl,
    confidenceThreshold: 0.6,
    timezoneOffset: 0,
  };
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "post",
      url: API.SUBMIT_VIDEO,
      data: data,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getTranscript = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_TRANSCRIPT`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getTopics = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_TOPICS`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getQuestions = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_QUESTIONS`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getFollowups = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_FOLLOWUPS`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getEntities = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_ENTITIES`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getSummary = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_SUMMARY`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};

export const getActions = async (conversationId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_ACTIONS`${conversationId}`,
      headers: headers,
    });
    return res.body;
  } catch (err) {
    return err;
  }
};