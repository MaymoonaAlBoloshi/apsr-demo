# About APSR and consumer rights

Reviewed 4 November 2026. The demo now has bilingual `/about` and `/rights` pages, homepage entry points, navigation and contextual assistant guidance. Arabic uses the locally bundled Tajawal font from Google Fonts, with its SIL Open Font License in `public/fonts/Tajawal-OFL.txt`.

## Source decisions

- [About APSR](https://apsr.om/pages/about-us-lb): establishment and governance. The rendered page was checked as well as the text extraction. The extracted chairman attribution differed from the rendered page. The current About page uses names and photographs checked against the rendered Arabic and English pages, and a paraphrased foreword rather than a quotation.
- [Water](https://apsr.om/pages/water-lb): provider oversight, technical standards, water quality and sustainable supply.
- [Electricity](https://apsr.om/pages/electricity-lb): verified live sector information and navigation. Current tariff values and company names were not copied into this change.
- [Customer Guide 2021](https://apsr.om/downloadsdocs/CustomerGuide2021EN.pdf): published rights guidance, standards and complaint oversight.
- [Know your rights as a customer](https://apsr.om/downloadsdocs/Know%20your%20rights%20as%20a%20customer.pdf): billing and payment difficulty principles.
- [Electricity FAQ](https://www.apsr.om/en/faq): provider-first complaint handling and additional support arrangements.
- [Determinations](https://www.apsr.om/en/node/33): decisions depend on the circumstances of each dispute.

The older guides and FAQ were available through indexed official text; some legacy URLs render the newer site shell. The demo therefore identifies this material as published electricity guidance, asks users to confirm current arrangements with their provider and includes current sector links. It does not repeat historic contact details, supplier names, disconnection deadlines, tariff rates or guaranteed remedies. Arabic text is an editorial translation, not an official legal translation.

The preparation checklist is local interface state. It does not collect or transmit information, decide eligibility or submit a complaint. Its practical preparation suggestions are distinct from the published rights summaries. Complaint actions use the existing demo workflow.

## Verification

`npm test` covers existing complaint behaviour and assistant source handling, including the new About and Rights references. `npm run build` checks TypeScript and creates the production bundle.

`tests/knowledge-review.js` runs against the production preview harness. It checks both languages, 1440, 390 and 320 pixel layouts, Tajawal loading, topic selection, checklist updates, contextual assistant suggestions, navigation and absence of the not-found state. Screenshots are saved under the ignored `evidence/` directory. Browser assistant responses use the existing offline fixture; provider prompting and source mapping are checked separately by the backend tests.

The later [institutional revision](INSTITUTIONAL-CONTENT.md) adds official photographs, the About Us section structure and interactive sector lessons.
