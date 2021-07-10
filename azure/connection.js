import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
} from "@azure/storage-blob";

import {
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
    AZURE_STORAGE_ACCOUNT_NAME,
} from "../config.js";


const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

exports = blobServiceClient