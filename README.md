# APSR connected services demo

An Arabic-first interactive prototype built from the APSR Digital Platform and Services Development proposal. It connects a consumer complaint, officer review, mobile evidence response, resolution, management reporting and bilingual content publishing.

All accounts, records, targets and outcomes are fictional. This is a presentation prototype, not an official government service.

## Run

Requires Node.js 22.13 or newer and npm. Node's built-in SQLite module may print an experimental warning on Node 22.

```sh
npm ci
npm run dev
```

Open **http://localhost:5188**. For a production build:

```sh
npm run build
npm start
```

`PORT` changes the port. `DEMO_DB` changes the SQLite file path, defaulting to `data/demo.sqlite`. The server binds to `127.0.0.1`. To demonstrate on a second device on a trusted local network, start with `HOST=0.0.0.0 npm start` and open the host computer's LAN address on the phone. Do not expose the prototype on a public network: its presenter selector deliberately allows entry into every demo persona.

The application stores complaint data, uploaded evidence and content in SQLite. Web and phone sessions therefore share the same records. Attachments accept PDF, PNG, JPEG and TXT, up to 2 MB each. Draft saving persists form fields; attach evidence when submitting or responding.

## Deploy on Render

The repository includes a [Render Blueprint](https://render.com/docs/blueprint-spec) in `render.yaml`. It runs the Node server, serves the built interface and keeps SQLite on a 1 GB persistent disk. The configured Starter service and disk require a paid Render plan.

1. In Render, select **New > Blueprint** and connect this GitHub repository.
2. Set `SIRAAJ_API_KEY`, `SIRAAJ_BASE_URL` and `SIRAAJ_MODEL` using the values from your local `.env.local`. Enter them in Render's environment settings. Keep the key out of GitHub.
3. Review the plan and deploy. Render installs dependencies, builds the app and starts `npm start`.
4. Check `/api/health` for `{"ok":true}`. Open the site and ask the assistant a question in Arabic and English. `/api/chat/status` confirms configuration only, not provider connectivity.

Render supplies `PORT`; the Blueprint sets `HOST=0.0.0.0` and `DEMO_DB=/var/data/demo.sqlite`. Keep one service instance because SQLite and in-memory sessions are local to it. Data survives restarts on the disk, but users must select their persona again after a restart.

The hosted app retains the presentation persona selector, which gives visitors access to all demo roles. Use fictional records only and restrict access to the intended presentation audience. The AI endpoint uses your provider account. This deployment does not add production authentication.

The source proposal, local database, credentials, generated build and presentation recordings are excluded from GitHub.

## Present

Open **Account and workspace** in the header to switch between public visitor, Maryam, Salim, officer, management, content editor and content publisher. Use a separate browser context or device for simultaneous consumer and officer sessions; tabs in one browser share the current session cookie.

Start from the Arabic homepage. Follow [the bilingual presenter script](docs/PRESENTER.md). The in-app **Run of show & architecture** page provides the presentation sequence and production component mapping.

Use [sample-bill.txt](public/sample-bill.txt) as fictional evidence. The browser's phone preview changes the layout; a real second browser/device demonstrates shared state. Refresh or wait up to four seconds to see another session's changes.

Restore the starting dataset with:

```sh
npm run reset
```

Or select Management, open Account and workspace, expand **Presentation tools** and choose **Reset demo data**. Confirm the reset to restore 30 cases and the original FAQ, removing demo-created cases, drafts and attachments. Session cookies remain valid; after restarting the server, select a persona again.

## Check

```sh
npm test
npm run build
npm run test:e2e
```

The backend tests call the real API handler against SQLite without a network listener. They cover the complaint lifecycle, internal-note isolation, file ownership, validation, saved drafts, publishing permissions, required languages and reset behavior.

Browser tests use Playwright and the production build. Install its Chromium browser if needed with `npx playwright install chromium`, or set `BROWSER_PATH` to an existing compatible Chromium executable. Browser tests route the production interface to the real API handler source with an in-memory storage adapter. They complement the SQLite tests; they are not live HTTP server tests. Screenshots, results and video are written under `evidence/`.

Initial execution restrictions blocked local HTTP listeners and local Chromium launch. The full browser journey was checked through the connected browser tool using the same harness. A later permitted development-server launch succeeded on port 5188, and the refreshed branded homepage was checked against that live server. See [verification notes](docs/VERIFICATION.md) for the exact checks and limitations.

## Structure and boundaries

- `src/`: React, TypeScript, bilingual interface and responsive styling.
- `server/`: Node HTTP API, cookie-based demo sessions and SQLite persistence.
- `tests/`: backend checks and reproducible browser journey.
- `docs/`: presenter script, proposal traceability and verification notes.
- `public/`: locally bundled Arabic font, its license and fictional sample evidence.

The assistant uses the live Siraaj model with published bilingual guidance and service navigation context. Set SIRAAJ_API_KEY, SIRAAJ_BASE_URL and SIRAAJ_MODEL in .env.local (see .env.example). Credentials remain on the server. Chat cannot access private cases or documents, or perform actions. National identity, external notifications, signatures and payments are simulated or described, not integrated.

The proposed production stack remains Flowable, Strapi, Metabase, Keycloak and PostgreSQL, subject to the proposal's stated confirmations. This prototype does not run those products or claim production authentication, native mobile, offline synchronization, analytics tracking or production compliance certification.

Vite is used for development middleware and production bundling. Reference: [Vite JavaScript API](https://vite.dev/guide/api-javascript). SQLite uses [Node's built-in SQLite API](https://nodejs.org/download/release/latest-v22.x/docs/api/sqlite.html).
