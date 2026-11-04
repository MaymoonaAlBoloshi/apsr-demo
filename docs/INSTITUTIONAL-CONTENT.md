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
