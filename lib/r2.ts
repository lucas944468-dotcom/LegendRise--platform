import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 client (ADR-4, S3-compatible). ONLY server-side import —
// credentials must never reach the browser (non-negotiable: secrets server-side).
// Required env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.
// Optional: R2_PUBLIC_URL (for the public lesson-media prefix).

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const bucket = process.env.R2_BUCKET ?? "";

export const r2 = new S3Client({
  region: "auto",
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export const R2_BUCKET = bucket;

// Bucket layout: lessons/* (public), resources/* (public),
// evidence/{userId}/* (PRIVATE — presigned URLs only, §12/§16).
export function publicMediaUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL ?? "";
  if (!base) throw new Error("R2_PUBLIC_URL is not set");
  return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}

/** Short-lived download link for PRIVATE evidence files. */
export async function presignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(r2, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
}

/** Short-lived upload link so browsers PUT directly to R2 (no file via server). */
export async function presignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600,
): Promise<string> {
  return getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn },
  );
}
