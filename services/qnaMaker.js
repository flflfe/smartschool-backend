import msRest from "@azure/ms-rest-js";
import qnamaker from "@azure/cognitiveservices-qnamaker";
import qnamaker_runtime from "@azure/cognitiveservices-qnamaker-runtime";
import config from "../config.js";
import { getEndpointKeys } from "../Utils/query_runtime_key.js";
import Axios from "axios";
const {
  QnA_subscription_key,
  QnA_endpoint,
  QnA_runtime_endpoint,
  Resource_Name,
} = config;
const creds = new msRest.ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": QnA_subscription_key },
});
const qnaMakerClient = new qnamaker.QnAMakerClient(creds, QnA_endpoint);
const knowledgeBasekClient = new qnamaker.Knowledgebase(qnaMakerClient);

export const createKB = async (qbname, files) => {
  const create_kb_payload = {
    name: qbname,
    files: files,
    defaultAnswerUsedForExtraction: "Sorry No answer found.",
    enableHierarchicalExtraction: true,
    language: "English",
  };
  const headers = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": QnA_subscription_key,
  };
  try {
    const res = await Axios({
      method: "post",
      url: `https://${Resource_Name}.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/create`,
      data: create_kb_payload,
      headers: headers,
    });
    const operationResult = await wait_for_operation(
      qnaMakerClient,
      res.data.operationId
    );

    if (
      !operationResult ||
      !operationResult.operationState ||
      !(operationResult.operationState = "Succeeded") ||
      !operationResult.resourceLocation
    ) {
      console.log(
        `Create operation state failed - HTTP status ${operationResult._response.status}`
      );
      return;
    }
    console.log(operationResult);

    // parse resourceLocation for KB ID
    const kbID = operationResult.resourceLocation.replace(
      "/knowledgebases/",
      ""
    );

    return kbID;
  } catch (err) {
    console.log(err.response.data.error.details);
    return err;
  }
};
export async function publishKnowledgeBase(kb_id) {
  console.log(`Publishing knowledge base...` + kb_id);
  try {
    const results = await knowledgeBasekClient.publish(kb_id);

    if (!results._response.status.toString().startsWith("2")) {
      console.log(
        `Publish request failed - HTTP status ${results._response.status}`
      );
      return false;
    }

    console.log(
      `Publish request succeeded - HTTP status ${results._response.status}`
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const generateKBAnswer = async (kb_id, query) => {
  const EndpointKey = await getEndpointKeys(qnaMakerClient);
  if (!EndpointKey) throw new Error("No Key Available");
  const queryRuntimeCredentials = new msRest.ApiKeyCredentials({
    inHeader: { Authorization: "EndpointKey " + EndpointKey },
  });
  const runtimeClient = new qnamaker_runtime.QnAMakerRuntimeClient(
    queryRuntimeCredentials,
    QnA_runtime_endpoint
  );

  console.log(`Querying knowledge base...`);

  const requestQuery = await runtimeClient.runtime.generateAnswer(kb_id, query);
  console.log(JSON.stringify(requestQuery));
  return requestQuery;
};
const wait_for_operation = async (qnaClient, operation_id) => {
  let state = "NotStarted";
  let operationResult = undefined;

  while ("Running" === state || "NotStarted" === state) {
    operationResult = await qnaClient.operations.getDetails(operation_id);
    state = operationResult.operationState;

    console.log(`Operation state - ${state}`);

    await delayTimer(1000);
  }

  return operationResult;
};
const delayTimer = async (timeInMs) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });
};
