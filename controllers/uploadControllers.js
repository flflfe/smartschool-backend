import getStream from "into-stream";

const uploadOptions = {
    bufferSize: 4 * ONE_MEGABYTE,
    maxBuffers: 20,
};
const ONE_MEGABYTE = 1024 * 1024;



export async function getUploadedFile(req, res, next) {
    let viewData;

    try {
        const containerClient =
            blobServiceClient.getContainerClient(containerName1);
        const listBlobsResponse = await containerClient.listBlobFlatSegment();

        for await (const blob of listBlobsResponse.segment.blobItems) {
            console.log(`Blob: ${blob.name}`);
        }

        viewData = {
            title: "Home",
            viewName: "index",
            accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
            containerName: containerName1,
        };

        if (listBlobsResponse.segment.blobItems.length) {
            viewData.thumbnails = listBlobsResponse.segment.blobItems;
        }
    } catch (err) {
        viewData = {
            title: "Error",
            viewName: "error",
            message: "There was an error contacting the blob storage container.",
            error: err,
        };
        res.status(500);
    } finally {
        res.render(viewData.viewName, viewData);
    }
}

export async function uploadFileAzure(req, res, next) {
    async(req, res) => {
        const blobName = getBlobName(req.file.originalname);
        const stream = getStream(req.file.buffer);
        const containerClient = blobServiceClient.getContainerClient(containerName2);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            const audio = await blockBlobClient.uploadStream(
                stream,
                uploadOptions.bufferSize,
                uploadOptions.maxBuffers, {
                    blobHTTPHeaders: {
                        blobContentType: '',
                    },
                }
            );
            console.log(audio)
                // user.img = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName1}/${blobName}`
                // await user.save();
            res.render("success", {
                message: "File uploaded to Azure Blob storage.",
            });
        } catch (err) {
            res.render("error", {
                message: err.message,
            });
        }
    }
}