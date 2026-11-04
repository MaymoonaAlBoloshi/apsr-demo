# APSR identity and homepage direction

Updated 4 November 2026 using the user-supplied eight-page `BrandingGuideline.pdf` and the [APSR website](https://apsr.om/pages/home).

## Verified identity

- The bilingual logo is the original PNG served by APSR's website, saved locally at `public/brand/apsr-logo.png`. Its proportions and colors are unchanged.
- Source asset: https://idenediprod.blob.core.windows.net/blb/Slb3IXfn2E-zn8a0iQR2Og
- Page 6 specifies `#0096B3`, `#B3DBE5`, `#D9F0FB`, `#3AACC1`, `#ECF3F7` and `#75C7D6`. These are centralised in `src/brand.css` and used for accents, surfaces, borders and illustration details.
- Page 7 specifies Tajawal. The demo bundles Regular, Medium, Bold and ExtraBold locally for both Arabic and English. Its licence is in `public/fonts/Tajawal-OFL.txt`. This supersedes the earlier Changa selection.
- Pages 3 to 5 show the approved stacked and horizontal logos and prohibit arbitrary recolouring. The demo retains the original horizontal asset used by the official website, without filters or blending. It does not redraw or recolour that asset. The guide identifies the stacked mark as the main logo for official websites; the responsive header continues to use the supplied horizontal lockup, so this is not a claim of complete identity compliance.
- Page 8 shows fine triangular outlines over pale gradients. The decorative homepage geometry now follows that treatment. It is separate from the official logo.
- Dark ink, muted text and darker action colours are accessibility choices rather than extra official brand colours. White text on the primary cyan is insufficient for small text, so buttons use `#00677E`, with `#004E62` on hover. Status and error colours retain their functional meaning.

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

## Brand kit implementation checks

The production build and bilingual browser review check Tajawal loading, the official colour variables, unchanged logo rendering and responsive layouts at 1440, 390 and 320 pixels. The review also checks the rights topics, checklist, assistant entry point and navigation. The Arabic and English homepage and new information pages are captured under `evidence/`.

`tests/brand-kit-review.js` also passed for consumer, officer, management, editor and publisher screens in both languages at desktop and phone widths. Review found and fixed an Arabic table overflow caused by off-screen labels escaping the scroll container. The dark rights panel uses light text after correcting a conflicting paragraph rule.
