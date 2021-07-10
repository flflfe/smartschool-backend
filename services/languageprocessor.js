import Axios from "axios";
import { tokenGenerator } from "../Utils/authtokengenerator.js";
import { API } from "../Utils/constants.js";

export const submitVideo = async (options) => {
  const data = {
    url: options.url,
    confidenceThreshold: 0.6,
    timezoneOffset: 0,
    enableSummary: true,
    detectEntities: true,
    detectPhrases: true,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 3,
    ...options,
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
    console.log(res.data);
    console.log({ res: res.data });
    return res.data;
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
    return res.data;
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
    return res.data;
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
    return res.data;
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
    return res.data;
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
    return res.data;
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
    return res.data;
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
    return res.data;
  } catch (err) {
    return err;
  }
};

export const checkJobStatus = async (jobId) => {
  const token = await tokenGenerator();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: `https://api-labs.symbl.ai/v1/job/${jobId}`,
      headers: headers,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
