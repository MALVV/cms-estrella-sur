import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_DEFAULT_REGION as string;
const bucket = process.env.AWS_BUCKET as string;
const endpoint = process.env.AWS_ENDPOINT as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

if (!region || !bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error("Faltan variables de entorno para configurar Spaces (AWS_*)");
}

export const s3 = new S3Client({
  region,
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: false,
});

export async function getUploadUrl(key: string, contentType: string, expiresIn = 60) {
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ACL: "public-read" });
  return getSignedUrl(s3, cmd, { expiresIn });
}

export async function getDownloadUrl(key: string, expiresIn = 60) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn });
}

export async function list(prefix?: string) {
  const cmd = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix });
  const res = await s3.send(cmd);
  return res.Contents ?? [];
}


