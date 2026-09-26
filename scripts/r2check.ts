// R2 round-trip check (Phase 3 storage gate).
// Requires founder R2 values in .env. Usage: npx tsx scripts/r2check.ts
// Writes a tiny object, reads it back presigned, then deletes it.
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, presignedDownloadUrl } from "../src/lib/r2";

const key = "health/r2check.txt";
const body = `legendrise r2 ok ${new Date().toISOString()}`;

for (const v of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"] as const) {
  if (!process.env[v]) throw new Error(`Missing ${v} in .env (founder task).`);
}
await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: "text/plain" }));
console.log("PUT ok");
const url = await presignedDownloadUrl(key, 300);
const res = await fetch(url);
const text = await res.text();
if (text !== body) throw new Error("Round-trip mismatch");
console.log("GET (presigned) ok");
await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
console.log("DELETE ok — R2 round-trip green");
