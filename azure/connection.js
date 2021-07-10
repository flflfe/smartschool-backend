import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
} from "@azure/storage-blob";

import config from "../config.js";
const { AZURE_STORAGE_ACCOUNT_ACCESS_KEY, AZURE_STORAGE_ACCOUNT_NAME } = config;


const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);

const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);
export default blobServiceClient