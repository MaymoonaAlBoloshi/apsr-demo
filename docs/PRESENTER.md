# APSR demonstration script

## Before the meeting

Run the production build locally and reset the dataset. Open the homepage in Arabic. Close other tabs using the same demo session. Keep the sample bill ready and open a separate browser context or phone for Maryam if demonstrating two devices. Use the same server address from both devices.

Open Account and workspace only when changing roles. Close it during each business interaction. Avoid reading technical product names during the consumer story.

The scenario is fictional: Maryam's electricity bill rose from OMR 24 to OMR 87. She asks for a review of the meter reading. The demo does not assert any complaint eligibility rule or promise a regulatory outcome.

## 0 to 2 minutes: discover the service

**Arabic:** «سنتابع شكوى واحدة من البداية إلى النتيجة، ونرى ما يظهر للمستهلك وموظف الهيئة والإدارة في كل خطوة.»

**English:** “We will follow one complaint from submission to outcome, showing what the consumer, APSR officer and management each see.”

Show the Arabic homepage. Open the service guide and choose the billing complaint question. Point to the guidance source and the action to start a complaint.

**Proof:** Guidance leads directly into a service. The answer comes from the published sample FAQ. It does not make an unsupported regulatory decision.

## 2 to 5 minutes: submit as Maryam

Select Maryam through Account and workspace. Open New complaint and enter:

| Field | Demonstration value |
| --- | --- |
| Sector | Electricity |
| Provider | Demo Electricity Provider |
| Account | DEMO-10482 |
| Subject | مراجعة ارتفاع فاتورة الكهرباء |
| Details | ارتفعت فاتورة الكهرباء لشهر أكتوبر من 24 إلى 87 ريالاً عمانياً. أرجو مراجعة قراءة العداد والمبلغ المحتسب. |

Leave the initial attachment empty, so the officer can request it later. The default service setting allows this. Save a draft, briefly switch to English and back, then submit.

**Arabic:** «تظل البيانات محفوظة عند تبديل اللغة. بعد الإرسال، تحصل مريم على رقم مرجعي وخطوة واضحة للمتابعة.»

**English:** “Switching language preserves the entered details. On submission, Maryam receives a reference and a clear way to follow the request.”

Keep the reference visible. It should be APSR-2026-0031 after a reset.

## 5 to 8 minutes: review as the officer

Select Ahmed. Open Maryam's new complaint and start review. Explain the owner, supporting documents and activity history. Enter this message:

**Arabic message:** «يرجى إرفاق فاتورة أكتوبر حتى نتمكن من مراجعة قراءة العداد والمبلغ المحتسب.»

**English alternative:** “Please attach the October bill so we can review the meter reading and billed amount.”

Choose Request documents. Show the status and timeline change. If time permits, add an internal note and later demonstrate that it does not appear in the consumer account.

**Proof:** The action changes the shared case and tells the consumer exactly what is needed. It is not a disconnected notification mockup.

## 8 to 10 minutes: continue from mobile

Open Maryam's account on the phone, separate browser context or phone preview. Show the same reference and the document request. Upload `public/sample-bill.txt`, enter a brief response and send it.

**Arabic:** «لا تبدأ مريم طلباً جديداً من الهاتف. تضيف المستند إلى الشكوى نفسها، ويصل التحديث إلى الموظف.»

**English:** “Maryam does not start again on mobile. She adds evidence to the same complaint, and the officer receives the update.”

Switch languages on the case page. The reference and progress remain unchanged.

## 10 to 12 minutes: resolve and gather feedback

Return to Ahmed and the same case. Enter:

**Arabic resolution:** «تمت مراجعة الفاتورة الافتراضية وتسجيل قراءة مصححة للعداد في هذا العرض التوضيحي.»

**English alternative:** “The sample bill has been reviewed and a corrected meter reading recorded in this demonstration.”

Record the resolution, then close the complaint. Return to Maryam and rate the service with five stars.

**Proof:** The outcome has an explanation, an actor and a timestamp. The consumer sees closure and can provide feedback.

## 12 to 13 minutes: management oversight

Select Management. Show the complaint totals, active cases, average resolution time and satisfaction. Filter by electricity or closed status, then open Maryam's case from the records.

**Arabic:** «هذه الأرقام محسوبة من الحالات المعروضة. يمكن للإدارة الانتقال من المؤشر إلى الطلب الذي يقف وراءه.»

**English:** “These figures are calculated from the demonstration records. Management can move from an indicator to the request behind it.”

State that the seven-day target is illustrative. The dashboard shows neither an approved regulatory target nor an operational support SLA.

## 13 to 14 minutes: publish with accountability

Select Content editor. Update the FAQ in both languages:

**Arabic:** «أرفق الفاتورة واشرح المشكلة. يمكنك متابعة طلبات المستندات من حسابك على الويب أو الهاتف. إرشادات توضيحية للعرض.»

**English:** “Attach the bill and describe the issue. Follow document requests from your account on web or mobile. Demonstration guidance.”

Send for review. Select Content publisher, approve and publish. Open the public page and change language. If time permits, open the assistant to show it uses the newly published guidance.

**Proof:** Editors and publishers have separate permissions. One published record serves both channels and the assistant.

## 14 to 15 minutes: close with evidence

Open the in-app architecture page if the committee asks about implementation.

**Arabic:** «رأيتم اليوم طلباً واحداً ينتقل بين المستهلك والموظف والإدارة، ومحتوى يُنشر باللغتين من مصدر واحد. الخطوة التالية هي اعتماد مسار الشكوى مع مالك الخدمة واختيار الخدمة التالية.»

**English:** “You have seen one request move between the consumer, officer and management, with bilingual content published from one source. The next step is to validate the complaint workflow with its service owner and choose the next service.”

Ask which internal handoff causes the most delay today and who should own validation of that step. Capture the answer for the discovery workshop.

## Technical questions and precise answers

| Question | Answer |
| --- | --- |
| Is Theqa connected? | No. Demo personas simulate sign-in. Production integration requires approved access and credentials. |
| Does this run Flowable or Strapi? | No. The prototype demonstrates their proposed user-facing behavior. Production component configuration remains part of delivery. |
| Is this a native mobile app? | This is a responsive mobile preview. The proposal's native and React Native wording must be reconciled before confirming mobile implementation. |
| Are SMS messages being sent? | No. In-app event notifications work; external delivery is simulated. |
| Is the assistant using a live LLM? | Yes. It calls Siraaj from the server using published service guidance and supports follow-up questions. It has no case access or action tools. |
| Are the targets approved? | No. The demonstration uses a seven-day illustrative case target. Confirm operational rules with APSR. |
| Can data move between devices? | Yes, when both devices use the same running server. Each uses its own session, and the shared SQLite records refresh periodically. |
| What is production-ready here? | This is a functional prototype for evaluating the experience. Production security, integration, capacity, native mobile and operational acceptance are separate delivery work. |

## Recovery

If a wrong role is selected, choose the correct persona and reopen the case by reference. If a request fails, read the inline error before repeating it. Do not reset mid-story unless restarting the demonstration.

Keep the screenshots and recorded walkthrough in `evidence/` available for a presentation fallback. They contain fictional data only.
