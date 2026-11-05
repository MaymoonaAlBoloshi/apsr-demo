# Provider directory and complaint routing

The demo includes 34 named organisations across electricity, water, wastewater, natural gas transmission and waste services. The list combines consumer suppliers, special-zone operators, networks and generation/desalination companies. It is not a complete register of every LPG distributor, private contractor or municipal service in Oman.

`shared/providers.json` is the shared source for the form, API validation, demo provider accounts and staff reports. Each entry includes its source, service sectors and verification date (5 November 2026). Arabic labels are display translations, not certified legal names.

## Sources and coverage

- [APSR electricity sector](https://apsr.om/pages/electricity-lb): Nama Supply, Nama Electricity Distribution, Nama Dhofar and Oman Electricity Transmission. The old Muscat, Mazoon and Majan brands are not offered as separate current suppliers.
- [Nama Water Services](https://nws.nama.om/About-Us/CEO-Message): water and wastewater outside Dhofar.
- [Nama Dhofar licence](https://apsr.om/pdfs/water/NamaDhofar01January2025.pdf): Dhofar water and wastewater.
- [Nama PWP contracts](https://omanpwp.om/contracts): 24 distinct generation and desalination counterparties. Listing a producer does not mean it bills households directly.
- [OQGN annual report](https://oqgn.om/annualreport2025/introduction/at_a_glance.html): natural gas transmission. This is separate from household LPG cylinders.
- [Marafiq profile](https://marafiq.om/en-us/About-Marafiq/Profile): Duqm utilities.
- [Majis](https://majis.om/about/): industrial water services in Sohar.
- [be’ah](https://beah.om/web/guest/our-story): waste services. Responsibility for collection or facilities depends on locality and service; the form does not automatically assign every waste complaint to be’ah.

Unlisted organisations can be entered through **Other provider / not sure**. These cases remain unrouted until a case officer selects a listed provider. Provider membership is validated against the selected sector on the server.

## Demo flow

1. Sign in as Maryam, open a complaint, select sector, provider and issue category. Drafts retain these choices.
2. Open the account menu, choose **Service provider**, select a company and confirm **Sign in to workspace**. The workspace counts and lists only that company's routed cases. Providers can reply and attach evidence to active cases.
3. Sign in as the officer or manager and open **Provider performance**. Compare open cases, overdue cases, quality complaints and recorded findings. Select a provider to inspect the underlying cases.
4. Officers record an assessment with an explanation, or correct the provider routing. Reassignment removes the previous company's access and resets the current finding to unassessed. Previous assessments retain their provider identifier in the event history.

Company accounts are simulated through the existing demo persona switcher. Production identity verification and company membership administration are not implemented. Case data and performance figures are fictional. Raw complaint volume is not a fair quality ranking without subscriber totals and a comparable reporting period. Overdue means the stored illustrative case target has passed, not a confirmed regulatory breach.

Providers cannot read other companies' cases, attachments or notifications, read internal staff notes, resolve complaints or enter APSR findings. Staff retain access across providers. Existing submitted cases are preserved; only recognised old sample records are migrated to named providers.

## Verification

`npm test` covers routing validation, drafts, provider isolation, attachments, private notes, response permissions, recorded assessments and reassignment, alongside the existing complaint lifecycle and assistant tests. `npm run build` validates the TypeScript application and production bundle.

The assistant now receives the public provider directory and workflow guidance, including two-step sign-in, provider replies, officer assessments and provider comparisons. It receives the authenticated role from the API, but no case records or attachments. Workspace citations are filtered by role. It can help draft text for copying; it cannot submit or update a case. The chat interface provides role-specific starter questions, a workspace shortcut, copy and stop controls.

The assistant opens in **Step by step** mode. Consumers can follow service/problem/contact choices to complaint preparation or relevant guidance, track existing requests, identify business approval guides or learn about rights and sectors. Providers and staff see routes specific to their workspace. Back changes an earlier answer, Start again clears the path, and Help me with this step prepares a chat question from the selected labels for the user to review and send. Switching modes preserves the path. These navigation steps run locally even if the AI endpoint is unavailable and never submit a complaint or alter records.
