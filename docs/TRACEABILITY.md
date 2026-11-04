# Proposal to demonstration mapping

Source: SE-2026-APSR-Digital Platform and Services Development Technical proposal v2.docx, copied from Downloads on 4 November 2026.

| Proposal area | Demonstrated behavior | Boundary |
| --- | --- | --- |
| 3.1 Personas | Consumer, second consumer, officer, management, editor and publisher | Presenter-controlled demo identities |
| 3.2 Bilingual responsive platform | Arabic-first layout, English switch, preserved route and entered values | Official website logo and cyan palette; layout remains a proposed design |
| 3.3 Digital services | Complaint submission, assignment, document requests, resolution and tracking | Custom prototype workflow, not Flowable |
| 3.3.1 Existing services | Six-service catalogue and supporting information pages | Complaint is the complete transaction; other services explain scope and next steps |
| 3.3.2 CMS | Separate editor and publisher, bilingual validation, draft and publication history | Custom prototype CMS, not Strapi; no scheduled publishing |
| 3.3.3 Assistant | Source-linked FAQ guidance, complaint navigation and unsupported-question fallback | Live Siraaj model, published guidance only, no private case access or action tools |
| 3.3.4 Engagement | Consumer satisfaction rating after closure | Surveys, polls and maturity assessments are outside this prototype |
| 3.3.5 Notifications | Shared case events displayed in-app | No email, SMS or device push delivery |
| 3.3.6 Web analytics | Not implemented | No visitor tracking or claims about real adoption |
| 3.3.7 Reporting | Live case totals, resolution time, satisfaction, sector/status filters, case drill-down and CSV export | Fictional operational records, not Metabase |
| 3.4 Integrations | Architecture and presenter notes explain identity, signing, payments and messaging | External integrations are not connected |
| 3.5 Migration | Not implemented | No client data imported |
| 3.6 Mobile | Responsive case continuation using the shared server | No native packaging, biometrics or offline synchronization |
| 3.9 Access control | API role checks, consumer ownership, internal-note isolation, publisher permissions | Demo persona selection is intentionally open; not production authentication |
| 3.14 Architecture | In-app architecture explanation and production component mapping | Production stack is described, not deployed |

## Decisions to confirm before a commercial commitment

1. Reconcile the proposal's native mobile wording with its React Native stack entry.
2. Reconcile named external integrations with the broad exclusion of external data access.
3. Confirm CMS edition and licensing implications for the exact approval and scheduling features.
4. Confirm official complaint eligibility, required evidence, processing states and target durations.
5. Validate the proposed layout against APSR’s brand manual and the applicable national design system. The logo and primary color already match the official website.
6. Keep operational complaint processing targets separate from the proposal's incident support commitments.

These are discovery and proposal clarification items. The demonstration does not resolve them by adding new contractual promises.
