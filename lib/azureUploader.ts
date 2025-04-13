import { BlobServiceClient } from "@azure/storage-blob";
import {getBlobServiceClient} from "./azure";
import fs from "fs";

const AZURE_PROPS = getBlobServiceClient()

export async function uploadToAzure(folder: string, file: any, code: string): Promise<string> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_PROPS.connectionString);
  const containerClient = blobServiceClient.getContainerClient(AZURE_PROPS.container);

  const fileName = file.originalFilename || file.newFilename || "arquivo";
  const extension = fileName.includes('.') ? fileName.split('.').pop() : 'bin';
  const blobName = `${folder}/${code}.${extension}`;
  
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadStream = fs.createReadStream(file.filepath);

  await blockBlobClient.uploadStream(uploadStream, undefined, undefined, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return `${folder}/${code}.${extension}`;
}
