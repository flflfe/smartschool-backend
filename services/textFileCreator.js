import getStream from "into-stream";
import { createTextFileName, getBlobName } from "../Utils/randon_name_generater.js";
import blobServiceClient from '../azure/connection.js'
import { UPLOAD_TYPE } from "../Utils/constants.js";

const ONE_MEGABYTE = 1024 * 1024;

const uploadOptions = {
    bufferSize: 1 * ONE_MEGABYTE,
    maxBuffers: 20,
};

export const createAndUploadTextFile = async(response) => {
    try {
        const containerName = 'transcript'
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = createTextFileName();
        const stringData = (JSON.stringify(response));
        const stream = getStream(Buffer.from(stringData, 'utf8'))
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadStream(
            stream,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers, {
                blobHTTPHeaders: {
                    blobContentType: 'application/text',
                }
            })
        return (blockBlobClient.url)
    } catch (err) {
        console.log(err)
    }

}

export async function textFileCreator(response){
    try {
        if(!response || !filename) throw new Error('Either Filename doesnot exists or error in reponse.')
        const responseUrl=  await createAndUploadTextFile(response)
        return responseUrl
    } catch (error) {
        return response.status(501).send({error:error.message})
    }
  
}