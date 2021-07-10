import msRest from "@azure/ms-rest-js";
import qnamaker from "@azure/cognitiveservices-qnamaker";
import qnamaker_runtime from "@azure/cognitiveservices-qnamaker-runtime";
import config from "../config.js";
import { getEndpointKeys } from "../Utils/query_runtime_key.js";

const { QnA_subscription_key, QnA_endpoint, QnA_runtime_endpoint } = config;
const creds = new msRest.ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": QnA_subscription_key },
});
const qnaMakerClient = new qnamaker.QnAMakerClient(creds, QnA_endpoint);
const knowledgeBasekClient = new qnamaker.Knowledgebase(qnaMakerClient);

export const createKnowledgeBase = async (
  qbname = "QnA Tester",
  urls = ["https://codekavya.blob.core.windows.net/pdfs/cpp.txt"]
) => {
  console.log(urls);
  const create_kb_payload = {
    name: qbname,
    qnaList: [],
    urls,
    files: [
      /*{
                fileName: "myfile.md",
                fileUri: "https://mydomain/myfile.md"
            }*/
    ],
    defaultAnswerUsedForExtraction: "Sorry No answer found.",
    enableHierarchicalExtraction: true,
    language: "English",
  };

  try {
    const results = await knowledgeBasekClient.create(create_kb_payload);

    if (!results._response.status.toString().startsWith("2")) {
      console.log(
        `Create request failed - HTTP status ${results._response.status}`
      );
      return;
    }

    const operationResult = await wait_for_operation(
      qnaMakerClient,
      results.operationId
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

    // parse resourceLocation for KB ID
    const kbID = operationResult.resourceLocation.replace(
      "/knowledgebases/",
      ""
    );

    return kbID;
  } catch (E) {
    console.log(E);
    return;
  }
};

export async function publishKnowledgeBase(kb_id) {
  console.log(`Publishing knowledge base...`);

  const results = await qnaMakerClient.publish(kb_id);

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
}

export const generateKBAnswer = async (kb_id, query) => {
  const EndpointKeys = await getEndpointKeys(qnaMakerClient);
  if (!EndpointKeys) throw new Error("No Key Available");
  const queryRuntimeCredentials = new msRest.ApiKeyCredentials({
    inHeader: { Authorization: "EndpointKey " + EndpointKeys },
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
