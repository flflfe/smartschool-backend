import PDFDocument from "pdfkit";
import blobServiceClient from "../azure/connection.js";
import getStream from "into-stream";
const ONE_MEGABYTE = 1024 * 1024;

const uploadOptions = {
  bufferSize: 1 * ONE_MEGABYTE,
  maxBuffers: 20,
};

export const createAndUploadTextFile = async (stringData, fileName) => {
  try {
    const containerName = "transcript";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // pipe the document to a blob
    const doc = new PDFDocument();
    doc.text(stringData);
    doc.end();
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${fileName}.pdf`
    );
    await blockBlobClient.uploadStream(
      doc,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      {
        blobHTTPHeaders: {
          blobContentType: "application/pdf",
        },
      }
    );
    console.log(blockBlobClient.url);
    return blockBlobClient.url;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export async function textFileCreator(response) {
  try {
    if (!response || !filename)
      throw new Error("Either Filename doesnot exists or error in reponse.");
    const responseUrl = await createAndUploadTextFile(response);
    return responseUrl;
  } catch (error) {
    return response.status(501).send({ error: error.message });
  }
}
