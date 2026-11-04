# APSR identity and homepage direction

Updated 4 November 2026 from the [APSR website](https://apsr.om/pages/home).

## Verified identity

- The bilingual logo is the original PNG served by APSR's website, saved locally at `public/brand/apsr-logo.png`. Its proportions and colors are unchanged.
- Source asset: https://idenediprod.blob.core.windows.net/blb/Slb3IXfn2E-zn8a0iQR2Og
- The site's active root style sets `--primary-color: #0096B3`. The demo uses this cyan for accents and the homepage artwork.
- Darker cyan and blue neutrals support readable text and controls. These supporting shades are design choices, not a claim about an official brand manual.
- The large triangular illustration is an original SVG visual inspired by the identity. It is decorative and does not replace the official logo.

## Design references

The [Terminal Industries Awwwards entry](https://www.awwwards.com/sites/terminal-industries) informed the restrained industrial geometry and progression between sections. The [Paper Tiger Awwwards entry](https://www.awwwards.com/sites/paper-tiger) provided a reference for typography, introduction motion and deliberate transitions. Their artwork and source code were not copied.

The homepage now leads from the main service promise to three service entry points, an interactive sector overview, cross-device continuity and the service guide. Arabic and English retain the same information and actions.

## Motion

- Headline and supporting elements enter with short, staggered fades and small vertical movement.
- The decorative triangular form moves gently, with a corresponding shadow.
- Sections reveal once as they enter the viewport.
- Service rows, arrows and sector content use short hover or disclosure transitions.
- `prefers-reduced-motion: reduce` disables the decorative animation and reveals all content immediately. Normal document scrolling is preserved.

## Verification

The production build and TypeScript check passed. The live server at port 5188 was checked in Arabic and English at 1440 and 390 pixels. The actual logo loaded at its original 336-pixel source width, and the homepage cyan resolved to RGB(0, 150, 179). The checked views had no horizontal page overflow. Sector selection, complaint navigation and reduced-motion behavior were verified in the browser.

## Media centre

Verified APSR navigation on 4 November 2026 includes News, Announcement, Releases, Publications and Views. The homepage now provides bilingual category tabs linking to https://apsr.om/pages/news-f, /pages/announcement-f, /pages/releases-f, /pages/publications-f and /pages/views-b. An eParticipation link opens https://apsr.om/pages/eparticipate-lb for consultations and surveys. The live news listing eventually loaded after the initial empty response. Four verified entries are now presented with concise bilingual summaries, original source images where supplied and links to the matching source element IDs. English and Arabic summaries are adapted from the source. The site displays only “2 months ago”, so absolute publication dates are not inferred. This is a content snapshot, not a synchronized feed. Quick links use verified destinations; Open Data and Recruitment did not expose usable destinations and are omitted.
