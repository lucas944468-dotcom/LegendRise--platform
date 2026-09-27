# Deploy guide — VPS (Phase 11, when a public host is needed)

Local-first until then (`npm run dev`, `npm run build` + `node build`).
No Vercel involved at any stage.

## 1. Provision (any VPS with 2GB+ RAM)

- Ubuntu LTS, Node 20+, PostgreSQL 16/17 (UTF8), Caddy or Nginx, firewall 80/443.
- DNS A record → server IP (e.g. `app.yourdomain.com`).

## 2. Database

- Create role + database, note connection string.
- `pg_hba` local trust or password; nightly `pg_dump` via `scripts/backup.ps1`
  equivalent (`pg_dump --format=custom`) to off-server storage.

## 3. App

```bash
git clone <repo> && cd <repo>
npm install --omit=dev
cp .env.example .env   # fill: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
                       # R2_*, RESEND_API_KEY, OPENAI_API_KEY
npx prisma migrate deploy
npm run build
node build             # listens on $PORT (default 3000) behind the proxy
```

- Run under systemd (restart always) with `PORT`, `NODE_ENV=production`.
- Reverse-proxy with TLS (Caddy automatic HTTPS recommended).

## 4. Storage & mail & AI

- Cloudflare R2 bucket + token (ADR-004); Resend domain verification;
  OpenAI key with spend cap + usage alerts.

## 5. Go-live re-check (§22 gate)

Product, AI, content, assessment, data+backup, analytics, support, legal
(privacy/terms reviewed), payments OFF until commercial validation.
