# PWA and mobile support

The demo can be installed from a supporting browser. The footer includes “Add the portal to your device”. When the browser offers an install prompt, this button opens it. Otherwise it shows instructions for adding the site to the home screen. Installed standalone windows hide the install button.

Render needs no extra environment variables or build settings. Keep `npm run build` and `npm run start`, and use the HTTPS service URL. Installation depends on the browser and device. On iPhone, open the site in Safari and use Share, then Add to Home Screen. On Android, use the browser’s Install app or Add to Home Screen option.

The manifest includes standard, maskable and Apple home-screen icons derived from the existing APSR logo, standalone display, and shortcuts to services and requests. The app remains labelled as a demonstration.

The worker caches only the bilingual offline page, its logo and two fonts. Navigation uses the network and falls back to the offline page on connection failure. Case records, session responses, documents, chat and mutations never enter this cache. Services need a connection; offline actions are not queued. The existing page shows a connection notice when the browser reports that it is offline.

`npm run build` fingerprints the offline assets in the worker’s cache name. Updated workers wait until existing windows close, so an update does not reload a form while someone is editing it. The static server sends JavaScript and manifest MIME types and revalidation headers for the worker, manifest and HTML.

## Mobile layout

- Navigation has two columns, accessible expanded state and Escape dismissal.
- Forms use 16px input text and larger controls. Filters use two columns, or one on narrow phones.
- Case lists become cards with labelled fields. Provider comparisons retain horizontal scrolling and a pinned provider column.
- Case progress fits without horizontal scrolling. Reports no longer have an empty container above their heading.
- The chatbot has a compact launcher, a full-height mobile panel and a composer that remains reachable in a short viewport.
- Safe-area spacing supports standalone windows and devices with screen cutouts. The About heading scales down on narrow screens.

## Verification

Run `npm run build` and `npm test`. The tests cover manifest icon dimensions, offline navigation, cache boundaries, cache updates and production static headers, alongside the existing API, chat and provider tests.

The browser review scripts are functions accepting a Playwright page:

- `tests/create-preview.mjs` writes the production-bundle preview harness. Load `evidence/preview-harness.js` before the mobile scripts. The fixture uses the actual API handler with in-memory records and a canned chat response.
- `tests/mobile-review.js` checks 22 public routes in Arabic and English at widths of 320, 390 and 768 pixels.
- `tests/mobile-workspaces.js` checks consumer, provider, officer, manager, editor and publisher screens, including case details, at the same widths and languages.
- `tests/mobile-interactions.js` exercises menus, chat at a short viewport, all board reveals, media tabs, service search, sign-in and case cards.
- `tests/provider-journey.js` exercises complaint submission, provider reply and an officer assessment. It can run at a phone viewport.
- `tests/pwa-browser.js` runs on the actual built site over HTTPS or localhost with an active worker. It checks browser installability, icon sizes, offline deep links in both languages, API isolation and reconnection. Use a clean public session for this check.

The mobile layout review covers 216 route, language and viewport combinations. Visual checks use screenshots for the public-page layouts, service guides, news, install dialog, chat and workspaces. These are browser emulation checks, not a physical iPhone or Android installation test.

Implementation references: [MDN installable PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [web.dev manifest guidance](https://web.dev/learn/pwa/web-app-manifest), and [MDN service worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
