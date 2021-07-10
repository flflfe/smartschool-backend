export const USER_ROLES = {
  SUPER_ADMIN: "role.superAdmin",
  TEACHER: "role.teacher",
  STUDENT: "role.student",
};

export const UPLOAD_TYPE = {
  AZURE_UPLOAD_FILE: 0,
  AZURE_UPLOAD_VIDEOS: 1,
};

export const AUTH_TYPE = {
  TOKEN: "token",
  API: "api",
};

export const PLACEHOLDER_IMAGES = {
  PROFILE_PHOTO: "",
};

export const API = {
  BASE_URL: "https://api.symbl.ai/v1/conversations/",
  LABS_BASE_URL: "https://api-labs.symbl.ai/v1/conversations/",
  SUBMIT_VIDEO:
    "https://api-labs.symbl.ai/v1/process/video/url?detectEntities=true",
  REQUEST_TOKEN: "https://api.symbl.ai/oauth2/token:generate",
  GET_TRANSCRIPT: (_, conversationId) => {
    return `${API.BASE_URL}${conversationId}/messages?sentiment=true`;
  },
  GET_FOLLOWUPS: (_, conversationId) => {
    return `${API.BASE_URL}${conversationId}/follow-ups`;
  },
  GET_QUESTIONS: (_, conversationId) => {
    return `${API.BASE_URL}${conversationId}/questions`;
  },
  GET_ACTIONS: (_, conversationId) => {
    return `${API.BASE_URL}${conversationId}/action-items`;
  },
  GET_SUMMARY: (_, conversationId) => {
    return `${API.LABS_BASE_URL}${conversationId}/summary`;
  },
  GET_ENTITIES: (_, conversationId) => {
    return `${API.BASE_URL}${conversationId}/entities`;
  },
  GET_TOPICS: (_, conversationId) => {
    return `${API.BASE_URL}${conversationId}/topics`;
  },
};
