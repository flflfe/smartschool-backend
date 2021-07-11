import config from "../config.js";
import fetch from "node-fetch";

export const getAnswer = async (question, kb_id) => {
  console.log(kb_id);
  const res = await fetch(
    `https://analytics-smart-school.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/${kb_id}/generateAnswer`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json",
        "ocp-apim-subscription-key": `${config.Ocp_Sub_key}`,
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-ms-useragent": "QnaMakerPortal",
      },
      referrer: "https://www.qnamaker.ai/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"question":"${question}","userId":"Default","isTest":true,"answerSpanRequest":{"enable":true,"topAnswersWithSpan":1},"includeUnstructuredSources":true}`,
      method: "POST",
      mode: "cors",
    }
  );
  const json = await res.json();
  return json;
};
