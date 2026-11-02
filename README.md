# Khwab Stitch

A bilingual custom-tailoring storefront for women's blouses, kurtis, suits, and other made-to-measure garments. Customers choose fabric and styling, provide measurements or a fitting method, add delivery details, and receive an order receipt. The atelier dashboard manages orders and production status.

## Production architecture

- **Storefront:** GitHub Pages serves the Vite-built React app.
- **Order service:** A separate Node.js service validates and stores orders in SQLite. The admin API is password-protected and CORS is restricted to the storefront origin.
- **Persistent storage:** The SQLite database must live on a persistent disk. The included Render Blueprint mounts it at `/var/data/orders.sqlite`.
- **Private data:** Customer contact information, measurements, delivery addresses, and reference photos are sent only to the configured HTTPS order service. Do not put orders in public ntfy topics or browser storage.
- Customers must consent to use of their tailoring details before an order is accepted; the server records the consent time.

## Local development

Requirements: Node.js 22.5 or later.

```powershell
npm ci
Copy-Item .env.example .env
```

Set a unique `ADMIN_PASSWORD` in your local `.env` before starting the app. Keep `.env` private; it is ignored by Git.

```powershell
npm run dev
npm test
npm run build
```

The Vite development server includes the API middleware. Local orders are stored in `data/orders.sqlite`.

## Deploy the private order service

1. In Render, create a **Blueprint** from this repository and deploy `render.yaml`.
2. Set `ADMIN_PASSWORD` as a Render secret. Use a unique random password with at least 32 characters; do not reuse the old static-site password.
3. Keep the persistent disk mounted at `/var/data` and `DB_PATH=/var/data/orders.sqlite`. Do not deploy the API on ephemeral storage.
4. Confirm `ALLOWED_ORIGINS` is the exact HTTPS origin of the live storefront (for example, `https://khwabstitch-max.github.io`). Origins do not include the repository path. Add a custom domain there if you use one.
5. Verify the service health check at `/api/health`.

The persistent-disk service may have a hosting cost. Do not use a free/ephemeral service for live customer orders unless its database storage is independently durable.

## Deploy the GitHub Pages storefront

1. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables**.
2. Add the repository variable `VITE_API_BASE_URL` with the HTTPS base URL of the Render service, without a trailing slash.
3. Confirm the GitHub Pages deployment workflow is enabled and has Pages deployment permissions.
4. Run the deployment workflow again. It intentionally fails if `VITE_API_BASE_URL` is missing.

The frontend URL is public and does not contain a secret. The admin password must only be configured in the API host's secret settings.

## Security and operations

- Stop using the old public ntfy topic immediately. Assume any customer information previously sent there may have been visible to others; remove old topic messages if possible and notify affected customers if required by your privacy obligations.
- The previous admin fallback was embedded in `App.jsx` and committed to Git history. Treat it as compromised, rotate it, and do not reuse it. Rewriting history is not a substitute for rotating a credential.
- Never commit `.env`, database files, exported CSVs, or customer reference photos. Store exports securely and delete them when no longer needed.
- Back up the persistent database regularly and test restoring a backup. A persistent disk is not itself a backup.
- Use HTTPS for both the storefront and API. Restrict `ALLOWED_ORIGINS` to the real storefront origins.
- Order submission fails visibly if the secure API is unavailable; the app does not claim that a locally cached order was saved.
- Admin access uses a shared server-side password with rate-limited failed attempts. Use a unique password manager-generated value and log out when finished.

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local app and API |
| `npm test` | API validation, CORS, authentication, persistence, CSV safety, and order-status tests |
| `npm run build` | Production frontend build |
| `npm start` | Production Node server (requires `dist/` and `ADMIN_PASSWORD`) |
