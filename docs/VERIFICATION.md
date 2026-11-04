# Verification, 4 November 2026

## Passed

- TypeScript type checking and Vite production build.
- Seven backend scenarios using the actual API and SQLite: complete complaint lifecycle and authorization, saved drafts across sessions, content publishing separation and language validation, document requirements and invalid files, anonymous/cross-origin restrictions and reset, database reopening, and production HTML/asset/deep-link serving.
- Eleven browser journey checks using the production bundle and the actual API handler source with an in-memory storage adapter. These cover Arabic and English, desktop and 390-pixel phone layouts, saved drafts, case references, mobile evidence upload, resolution, satisfaction, management reporting, publication and assistant fallback.
- No page runtime errors in the completed browser journey.
- No horizontal page overflow in the checked desktop homepage, English phone homepage, mobile case and Arabic mobile publication views.
- Visual inspection of the Arabic homepage, mobile case and management report screenshots.

The completed browser run and its results are in `evidence/browser-results.json`. The recorded, accelerated walkthrough is `evidence/APSR-demo-walkthrough.webm`; it has no narration. The 15-minute live presentation script is in `docs/PRESENTER.md`.

## Initial environment limits

The initial execution attempts blocked listening HTTP sockets and local Chromium launch. Automatic approval review rejected elevated test execution because escalation is disabled. At that stage, the local server could not be left running, and a live HTTP/browser test was not claimed. A later permitted `npm run dev` launch succeeded on port 5188; the server was verified and opened in Firefox. Subsequent branding and homepage checks used that live server. See `docs/BRAND.md`.

Browser checks ran through the connected browser tool. The harness uses the actual API routing and validation source, with a deterministic storage adapter in the browser test process. Real SQLite persistence and the production static server handler were checked separately without listening sockets.

Dependency installation used a writable copy of the existing npm cache because ordinary npm network requests were blocked. The esbuild installation check could not run under the sandbox's child-process restrictions, so install scripts were skipped for this environment; the subsequent Vite build succeeded. The committed package lock supports normal `npm ci` on the presentation machine.

## Before presenting on another machine

1. Run `npm ci`, `npm run build`, then `npm start`.
2. Open `http://localhost:5188` and select a demo persona.
3. If using two devices, verify that both reach the same server on the trusted LAN. Use separate sessions for consumer and officer.
4. Reset the data and rehearse the scripted complaint once.
5. Keep the recording and screenshots ready as a fallback.

## Boundaries

This is a presentation prototype. It intentionally exposes a persona switcher, uses fictional data and targets, and has no production identity, outbound messaging, payment or signing connection. It is not a native application or an implementation of Flowable, Strapi, Metabase or Keycloak. Accessibility was checked for labels, focus styles, responsive behavior and the selected keyboard controls; a formal accessibility audit was not performed.

## November 2026 refinement verification

Production build and 7 API checks passed. Five chat checks cover provider configuration, bounded conversations, source allowlisting, errors, rate limits and role/page guidance. Live Arabic complaint guidance returned successfully with a service link and no demo wording. Browser checks passed for six persona suggestion sets, licensing-page guidance, media category selection, story preview controls, Arabic/English layouts, mobile account access and reduced motion. The news heading computes to white on the cyan background. Sector disclosure heights change with the active sector; both opening and closing use CSS grid transitions.

News content is a verified snapshot of four entries from the official APSR news listing, with concise bilingual summaries. Images load from APSR's image host. Dates were not inferred from the source's relative timestamps. Quick links point to verified official destinations. The media card uses layered transitions and four story selectors; the news page link opens the official listing.
