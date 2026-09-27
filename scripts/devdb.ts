// Dev-only embedded Postgres (Phase 3 unblocker).
// Real PostgreSQL 17 engine, zero-install, data in ./data/devpg.
// The founder's EDB install remains the canonical local DB; this exists so
// migrations, seeds, and tests verify on ANY machine without setup.
// Usage:  npx tsx scripts/devdb.ts   (starts on 127.0.0.1:5433, blocks)
// Then in another shell with DATABASE_URL=postgresql://legendrise:legendrise@127.0.0.1:5433/legendrise:
//   npm run prisma:migrate && npm run prisma:seed && npx vitest run
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const pg = new EmbeddedPostgres({
  databaseDir: "./data/devpg",
  user: "legendrise",
  password: "legendrise",
  port: 5433,
  persistent: true,
});

// initialise() runs initdb — only valid on a FRESH data dir. Skip when the
// cluster already exists (idempotent restarts, e.g. after a stale lock clear).
if (!existsSync("./data/devpg/PG_VERSION")) {
  await pg.initialise();
} else {
  console.log("Existing cluster found — skipping initdb.");
}
await pg.start();
console.log("Embedded Postgres up: postgresql://legendrise:legendrise@127.0.0.1:5433/legendrise");
console.log("Press Ctrl+C to stop (data persists in ./data/devpg).");
await new Promise(() => {});
