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
    return res.data;
  } catch (err) {
    return { data: err.response.data, error: true };
  }
};

export const getTranscript = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getTopics = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getQuestions = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getFollowups = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getEntities = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getSummary = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getActions = async (conversationId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const checkJobStatus = async (jobId, authtoken = false) => {
  const token = authtoken || (await tokenGenerator());
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
    return { data: err.response.data, error: true };
  }
};

export const getConversationDetails = async (
  conversationId,
  authtoken = false
) => {
  const token = authtoken || (await tokenGenerator());
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await Axios({
      method: "get",
      url: API.GET_CONVERSATION_DETAILS`${conversationId}`,
      headers: headers,
    });
    console.log(res.status);
    return res.data;
  } catch (err) {
    return { data: err.response.data, error: true };
  }
};
