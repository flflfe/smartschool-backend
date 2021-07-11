import {Document,Paragraph,TextRun,Packer} from 'docx'

export const createAndUploadTextFile = async (stringData, fileName) => {
  try {
    const containerName = "transcript";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${fileName}.docx`;

    const doc = new Document({
      sections: [{
          properties: {},
          children: [
              new Paragraph({
                  children: [
                      new TextRun({
                          text: stringData,
                          bold: true,
                      }),

                  ],
              }),
          ],
      }],
  });
  const b64string = await Packer.toBase64String(doc);
    const stream = getStream(Buffer.from(b64string, 'base64'));
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadStream(
      stream,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      {
        blobHTTPHeaders: {
          blobContentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      }
    );
    return {url:blockBlobClient.url,filename:blobName}
  } catch (err) {
    console.log(err);
    throw new Error(err)
  }
};