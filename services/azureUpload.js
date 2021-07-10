import getStream from "into-stream";
import { getBlobName } from "../Utils/randon_name_generater.js";
import blobServiceClient from '../azure/connection.js'
import { UPLOAD_TYPE } from "../Utils/constants.js";

const ONE_MEGABYTE = 1024 * 1024;

const uploadOptions = {
    bufferSize: 1 * ONE_MEGABYTE,
    maxBuffers: 20,
};

export const uploadFileToAzure = async(file, blobType) => {
    try {
        const containerName = blobType === UPLOAD_TYPE.AZURE_UPLOAD_FILE ? 'resources' : 'videos'
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = getBlobName(file.originalname);
        const stream = getStream(file.buffer);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadStream(
            stream,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
                onProgress: (ev) => console.log(({ progress: (Math.floor((ev.loadedBytes / file.size) * 100)) }))

            })
        return (blockBlobClient.url)
    } catch (err) {
        throw new Error(err.message)
    }

}