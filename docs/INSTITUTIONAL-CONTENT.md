# Institutional content and visual revision

Reviewed against the rendered Arabic and English APSR site on 4 November 2026.

## About Us

The [official About Us page](https://apsr.om/pages/about-us-lb) supplies the reception photograph, chairman photograph and seven board portraits. The local page follows its introduction, vision and mission, chairman’s foreword and board structure. Text is paraphrased, not presented as a verbatim quotation. The Arabic page contains more detail than the English version, including vision, mission and the 2020 expansion of the remit. Names use the corresponding official language version. This is a dated content snapshot, not a live leadership feed.

Files in `public/about/` are unmodified source images. The photographs remain separate from the official logo asset. Original APSR attachment identifiers:

| File | Attachment ID |
| --- | --- |
| authority.png | eb4c482f-59e8-4972-aa14-317ec253c25b |
| chairman.png | ae91c95a-7187-4478-974d-593ea57aa01e |
| salim-al-aufi.png | d660ca32-9bfa-40e8-83a1-f10da27219b4 |
| adham-al-said.png | 6b54ce91-a773-4b82-957f-5acda7de1b5f |
| mohammed-al-mutawwa.png | f5565219-9e9d-41d1-8b51-9138ecd56f4a |
| ibtisam-al-faroujiya.png | 3a373218-6195-4b27-b799-0bf4cee3874c |
| abdul-wahid-al-murshidi.png | ce2094e8-afd6-45cd-9045-94f6e030a46c |
| shatha-al-maskiry.png | f4ffb5be-05e4-406d-a328-16454ea28df8 |

The attachment URL prefix is `https://apsr.om/conn_app/technadopt/webapi/api/Attachment/d/`. The final portrait, `intisar-al-kandiyah.jpg`, comes from `https://evlsbe.blob.core.windows.net/prod-apsr-technadopt-library/d2cbe466-eaec-4279-baa7-d617c178bcae.` as linked by the same page.

## Sector lessons

- [Electricity](https://apsr.om/pages/electricity-lb): generation, transmission, distribution and supply/billing. The lesson distinguishes the network role from the account and billing role.
- [Water](https://apsr.om/pages/water-lb): reliable supply, sampling, audits and corrective action. The About Us page confirms the wastewater remit; the lesson does not invent wastewater process requirements. The Arabic water page also contained a waste-licensing article, which is deliberately not treated as water guidance.
- [Gas](https://apsr.om/pages/gas-lb): high-pressure transmission, pipeline integrity, pressure control and preparedness. This does not imply a household gas connection service.
- [Solid waste](https://apsr.om/pages/solid-waste-lb): the Arabic content distinguishes municipal collection from be’ah’s facilities, transfer, treatment and recovery activities. No licence-issuance outcome or completion date is inferred from the discussion of licence preparation.

Each chapter shows its explanations together, followed by a definition, APSR’s role, practical enquiry guidance and its source. The electricity chapter includes generation ownership and procurement, transmission voltages and dispatch, distribution and supply responsibilities, and all residential, non-residential and agriculture/fisheries tariff tables from the official page, checked on 4 November 2026. Residential account categories appear side by side. The page preserves the published bands and figures, explains the source’s unit label, and does not calculate bills or infer eligibility. The assistant receives bounded sector summaries and a safe internal source link.

## Visual and interaction changes

The homepage now uses the official reception photograph. The invented animated triangle, orbital lines, dots and coordinate labels are removed from the page. The chat launcher and header use a plain message icon. News without a loaded photograph uses the original logo asset instead of a drawn triangle. The standalone mobile showcase is replaced by a short footer device note.

The service rows retain their background reveal, directional text movement and arrow response on hover, with keyboard focus treatment and reduced-motion support. These functional interactions are separate from the removed decoration.

## Checks

`tests/institutional-review.js` checks both languages at desktop, phone and narrow-phone widths; the seven board images; visible sector explanations, electricity tariff categories and figures, and sector navigation; assistant suggestions; removed decoration; the footer note; and the actual service-row hover transforms. The production build and API/chat tests also pass. Browser checks use the production preview harness, not the deployed Render service.

## Homepage and media update, 4 November 2026

The reception photo now introduces APSR in a dedicated section below the service rows. The opening focuses on service guidance and request tracking.

The official Arabic navigation maps Publications to `announcement-f` and Announcements to `publications-f`, despite the English URL names. The homepage now follows that mapping. The Publications panel summarises the water-disruption item and links to its Arabic PDF (246.3 KB): https://idenediprod.blob.core.windows.net/blb/-zlfutSVrEGY3D9FjEOVUQ. Source: https://apsr.om/pages/announcement-f.

The official pages at `publications-f` and `releases-f` returned no links, and `views-b` returned no blog entries on review. Those categories display explicit empty states with access to news and publications; no articles were invented. A single borderless highlight slides between category buttons, with straight directional arrows. Browser checks covered all five categories in both languages at 1440, 390 and 320 pixels, keyboard selection, reduced motion and the intermediate position of the animated highlight.

## Homepage indicators and motion

The strip immediately below the header reports water smart-meter adoption (99%), electricity smart-meter adoption (80%) and digitisation of APSR services (100%). These are reported indicators from the 2026 media briefing, not live measurements or claims about this demonstration. Source: Oman News Agency, republished by Argaam on 31 March 2026, https://www.argaam.com/ar/article/articledetail/id/1892206. The reporting context and source link appear alongside the figures.

Homepage sections reveal once as they enter view, with staggered service rows, sector entries, media categories and quick links. Keyboard focus exposes a section immediately, and reduced-motion and print modes keep the content visible. The hero mark rotates with scroll progress; mouse movement reveals 28 triangular contour lines with local displacement. Leaving the hero restores the filled mark. Pointer and scroll updates use a single scheduled animation frame, with listeners removed on unmount.

Board portrait reveals use a staggered layout, keyboard focus, Escape dismissal and a persistent touch toggle. Personal statements are used only for two sourced posts: [Shatha Al Maskiry on leadership](https://www.linkedin.com/posts/shathamaskiry_leadership-is-no-longer-about-commanding-activity-7374687002757234688-KMuE) and [Adham Al Said on his economics podcast appearance](https://www.linkedin.com/posts/adhamalsaid_30-economics-hhal-sayyid-dr-adham-bin-activity-7035235212896677889-VhFy). Arabic excerpts are labelled as translations. These personal posts are not presented as APSR policy. Other members link to the official board page without invented statements or unverified social accounts.

On 5 November 2026, the About copy was checked against the live Arabic APSR page (the crawler's English version omits newer detail). The bilingual adaptation now includes the founding date and Article 19, decree amendments, the separate 2020 extensions of remit, tariff regulation, competition where feasible and service continuity. The mission retains future planning and system safety. The chairman section is a summary, not a direct quotation. Assistant evidence was updated to match.

Homepage indicators now appear below the hero in three groups of three. Source: ONA's 31 March 2026 APSR media-briefing report, syndicated by [Argaam](https://www.argaam.com/ar/article/articledetail/id/1892206). The figures distinguish complaints handled (not necessarily resolved), approximate compensation paid and recipient counts, digital transition percentages, 2021 to 2025 investment, 2025 renewable generation share and 2025 jobs created. Compensation and digital transition figures are labelled by their announcement date where the cited passage does not state a separate reporting period. They are published sector indicators, not live demo analytics. The interactive hero mark is enlarged without changing its mouse and scroll behaviour.
