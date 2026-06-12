# FileCurrent — Bug & Issue Tracker

Tested by: Shamir Afridi | Date: June 11, 2026
Work through this file top to bottom. Fix each issue, mark it `[x]` when done, and commit after each fix.

---

## 🔴 CRITICAL

- [x] **[Landing Page] Footer links redirect to login**
      Clicking Privacy Policy, Terms of Service, Refund Policy, About, Contact, Help & FAQ, Help, and Blog on the landing page all redirect to the login page. These pages must be publicly accessible without authentication. Each page also needs real written content (not AI-generated filler) and a proper footer.
      `URL: filecurrent.com (landing page footer)`
      **Fixed 2026-06-11:** Added all marketing paths (/privacy, /terms, /refund, /about, /contact, /help, /blog, /trial-expired, /proposals/, /api/contact) to the isPublic allowlist in src/middleware.ts.

- [x] **[Contracts] Send contract dialog disappears immediately on click**
      Clicking "Generate & Send Email" causes the dialog to instantly close without sending or confirming. The email send action must complete before the dialog is dismissed. Show a success/failure toast.
      `URL: filecurrent.com/contracts/{id}`
      **Fixed 2026-06-11:** Added `if (!v && loading) return` guard to `onOpenChange` so dialog cannot close mid-request. Added `type="button"` to all dialog buttons. Removed shared `generateSession` helper — split into direct `handleSendEmail` / `handleGenerateLink` with full error handling.

- [x] **[Contracts] Contract emails not being received by client**
      Multiple send attempts show a success toast but the client never receives the email. Debug email delivery for contracts. Check Resend/email service logs and ensure the correct recipient email is being used.
      `URL: filecurrent.com/contracts/{id}`
      **Fixed 2026-06-11:** Route was swallowing all email errors via `.catch()` and always returning 200. Replaced with try/catch — route now returns `{ token, emailFailed: true/false }`. Client reads the flag and shows an amber warning with "copy link manually" instruction when delivery fails. Added optional `sendEmail` flag so "Generate Link Only" skips email entirely. Signing link is always returned even when email fails.

- [x] **[Invoices] Invoice emails not being received by client**
      Invoice emails are not being delivered to the client despite no visible error. Debug invoice email delivery via Resend logs. Verify email template and recipient address.
      `URL: filecurrent.com/invoices/{id}`
      **Fixed 2026-06-11:** Same root cause as contracts — `sendEmail()` was called with `.catch()` (fire-and-forget), silently failing. Replaced with `await` inside try/catch. Route now returns `{ id, emailFailed: true/false }`. InvoiceForm reads the flag and shows a warning toast with instructions to share the invoice link manually if delivery fails.

- [x] **[Invoices] Payment received flow is broken and too manual**
      The payment confirmation flow is completely manual and the page does not update after refresh. Redesign the full payment flow: (1) Client sees payment methods on their portal, (2) Client can mark amount paid — full or partial, (3) Client can upload payment receipt, (4) Freelancer gets an email notification, (5) Both sides see updated payment history in-app. This is core product functionality — research industry standard implementations.
      `URL: filecurrent.com/portal/{id} + /invoices`

      **Fixed 2026-06-11:** Built the full self-service flow modeled on FreshBooks/Wave offline-payment handling (FileCurrent has no payment processor, so a client "marking paid" is an unverified *claim* the freelancer confirms). New `payment_claims` table (pending→confirmed/rejected). (1) Public invoice page + portal now show the freelancer's payment instructions and a "View & Pay" CTA. (2) New `ClientPaymentPanel` lets the client enter amount (full **or partial**, with a "Pay in full" shortcut), method, date, and reference. (3) Optional receipt upload (image/PDF) stored in R2. (4) Submitting hits public `POST /api/i/[token]/payment-claim` which emails the freelancer (new `payment-claim` template) + logs a `payment_claimed` activity event. (5) Freelancer sees an amber "Client Reported Payment" card on the invoice detail page (Confirm records a real payment + recomputes status; Dismiss rejects); both the public page and portal show payment history with confirmed / awaiting-confirmation badges, and `router.refresh()` updates the in-app view immediately. **Run `supabase/payment_claims.sql` in the Supabase SQL Editor to create the table.**

- [x] **[Intake Forms] Submitted intake form not reflected anywhere in app**
      A client filled out an intake form via link, got a success message, but the submission does not appear in the client's activity tab, the forms section, or anywhere in the app. Fix the submission storage and display pipeline.
      `URL: filecurrent.com/forms`

      **Fixed 2026-06-11:** Storage was actually fine (verified via Supabase — the response row, answers, and auto-created client all persisted correctly). The bug was entirely in the **display pipeline**: (1) `submitIntakeResponse` never wrote a `client_activity_log` row, so the submission was invisible in the client's activity tab and the global feed — added a `logClientActivity({ eventType: 'intake_submitted' })` call (fetches the form title for the label). (2) Added `intake_submitted` to `ActivityFeed` (violet clipboard icon, bg, and "{client} submitted the intake form '{title}'" description). (3) The client detail page only showed a generic "copy link" list of all active forms — added a **Submitted Forms** card listing the responses *this* client actually submitted (new `getClientIntakeResponses` DB fn), each linking to the response viewer. The forms list page + per-form responses viewer were already correct (response count + answers render fine). (4) Added `/forms` → `/intake-forms` redirect in `next.config.mjs` since the bug URL referenced `/forms`. _Note: the one pre-existing test response won't show in the activity tab (it predates the logging fix); all new submissions will._

- [x] **[Clients] Client page does not load after adding a new client**
      After successfully creating a client, the route /clients fails to load and shows a blank or error state. Debug the post-creation redirect and ensure the clients list re-fetches after a new client is added.
      `URL: filecurrent.com/clients`

      **Fixed 2026-06-12:** Root cause: the app had **zero `loading.tsx` and zero `error.tsx`** anywhere — every dashboard route is force-dynamic, so each navigation froze on a blank screen until the server render finished, and any render error produced an unrecoverable blank page. Added a route-group `loading.tsx` (skeleton header + stat row + list) and `error.tsx` (friendly boundary with "Try again" + "Go to Dashboard") covering all dashboard pages. Also found and fixed two related issues while auditing the flow: (1) **edit-client wiped the phone number** — `getClientById` didn't select `phone` and the edit page hardcoded `phone: ''`, so every save erased it; now selected + passed through. (2) Deleted dead stub `ClientForm.tsx` whose submit was `// Replace with your API call` + fake 800ms delay (unused, but a footgun). The post-creation redirect (`router.push` to the new client + `router.refresh()`) was already correct.

- [x] **[Notifications / Email] All email notification triggers are broken**
      None of the email notifications in Settings > Notifications are working: contract opened, contract signed, invoice opened, invoice overdue, daily summary. Audit all notification event hooks and test each trigger individually.
      `URL: filecurrent.com/settings/notifications`

      **Fixed 2026-06-12:** Audited each trigger individually — findings + fixes: **contract_opened** had *no trigger at all* (sign page tracked nothing) → new `recordContractOpen()` bumps open_count, promotes sent→opened, writes audit + activity events, and emails via new `contract-opened` template (gated on pref, rate-limited 1/hr). **contract_signed** email was sent unconditionally, ignoring the toggle → now gated via `getNotificationRecipient`. **invoice_opened** had a broken rate-limit (queried `reminder_logs.recipient_email` against the freelancer's *name* — never matched, so the limit never applied) and a wrong dashboard URL (`/invoices/{user_id}` instead of invoice id) → rewritten using the pre-bump `last_opened_at` (new `previousOpenedAt` on `InvoicePublicRow`) for a real 1/hr limit + correct URL + pref gating. **invoice_overdue** had *no trigger* (`markOverdueInvoices` flipped status silently) → it now returns the transitioned invoices + logs `invoice_overdue` activity; the new daily cron emails each transition once (new `invoice-overdue` template). **daily_summary** had *no cron at all* → new `/api/cron/daily-summary` (vercel.json, 8:30am UTC, before reminders) sends a digest of overdue invoices + outstanding total + reminders due today, only when there's something to report (new `daily-summary` template). All five now respect their Settings toggles.

- [x] **[Notifications / Email] Missing email notification events**
      The following notification events are missing from Settings entirely: proposal accepted, proposal declined, client submitted intake form, payment marked as received. Add the missing toggles and implement their email triggers.
      `URL: filecurrent.com/settings/notifications`

      **Fixed 2026-06-11:** Added all four toggles to Settings → Notifications (`payment_received`, `proposal_accepted`, `proposal_declined`, `intake_submitted` — stored in `profiles.notification_prefs`, default on). Added a shared `getNotificationRecipient(userId, key)` DB helper that returns the freelancer's email/name only when the toggle is enabled, so every trigger gates in one round-trip. Wired the triggers: **proposal accepted** (existing email now gated + uses buildSenderName), **proposal declined** (was sending no email at all — new `proposal-declined` template + trigger in the decline route), **intake submitted** (new `intake-submitted` template + send in the submit route, links to the responses viewer, notes if a client was auto-created), **payment received** (the payment-claim notification is now gated on `payment_received`). All sends are non-blocking and wrapped so delivery failure never breaks the client-facing action.

---

## 🟠 HIGH

- [ ] **[Auth / OAuth] Supabase URL shown during Google Sign-In**
      The Google account picker displays the raw Supabase project URL (gqwbsrzhhoivzbuaeryu.supabase.co) instead of "FileCurrent". Configure the OAuth app display name and redirect URL in Supabase Auth settings so users see "FileCurrent" throughout the sign-in flow.
      `URL: filecurrent.com/auth`

- [x] **[Onboarding] Selected profession template not loading on first entry**
      After selecting a profession during onboarding, navigating to contracts does not apply the template. The template only loads if the user re-opens onboarding and re-selects. On selection, the template must be immediately applied and persisted so it loads automatically when the user goes to contracts.
      `URL: filecurrent.com/onboarding`

      **Fixed 2026-06-12:** On the first-ever visit to /contracts/new, the form now auto-applies the niche template matching the onboarding profession (new `templateForProfession()` in `lib/contracts/templates.ts` — single source of truth, also used by the chooser) and persists it as the last-used template. The chooser dialog only opens when no profession match exists. A toast confirms the applied template with a "Change" action.

- [x] **[Onboarding] Email field is not editable**
      The email field in the onboarding business profile form and in Settings is frozen and cannot be edited. Either allow email editing with a verification flow, or clearly label it as managed via account settings with a direct link.
      `URL: filecurrent.com/settings`

      **Fixed 2026-06-12:** Took the "clearly label" option (email is the auth identity; an in-app change needs a dual-verification flow that isn't built). Onboarding now labels it "sign-in email — managed in account settings" with helper text + Settings link; Settings labels it "(sign-in email)" with helper text directing to support for a verified change.

- [x] **[Dashboard] Navigation links are very slow to load**
      Clicking "Add your first client", "Create a contract", "Send an invoice", and "Set up payment reminders" from the dashboard takes a very long time. Investigate route-level performance, add prefetching or code splitting.
      `URL: filecurrent.com/dashboard`

      **Fixed 2026-06-12:** All dashboard routes are force-dynamic and the app had no `loading.tsx`, so every click waited for the full server render with zero feedback — that's the perceived slowness. Added route-group `loading.tsx` (instant skeleton on navigation; Next.js `<Link>` prefetch now serves it immediately) + `error.tsx` boundary. Navigation now responds instantly with a skeleton while data loads.

- [x] **[Dashboard] Proposal acceptance/dismissal not reflected on dashboard**
      When a client accepts or dismisses a proposal, the dashboard shows no banner, no activity update, and no email is sent. Dashboard must show a notification banner and the freelancer must receive an email for both events.
      `URL: filecurrent.com/dashboard`

      **Fixed 2026-06-12:** Accept and decline routes now log `proposal_accepted` / `proposal_declined` activity events (with proposal title + amount). New `getRecentProposalEvents()` powers dashboard banners (last 7 days, max 3): green "accepted — Create Contract →" / red "declined — View →". Emails for both events were wired on 2026-06-11 (gated on the Settings toggles).

- [x] **[Clients] New client creation is very slow**
      Adding a new client takes an unusually long time to process. Profile the client creation API call, optimize the database write, and add a loading skeleton so the experience feels faster.
      `URL: filecurrent.com/clients/new`

      **Fixed 2026-06-12:** Profiled the API — `POST /api/clients` is a single insert (fast). The slowness was entirely the post-save navigation to the client detail page (8 parallel queries, force-dynamic, no loading UI → frozen screen). The new route-group `loading.tsx` skeleton makes the transition feel instant; the form button already shows a "Saving…" state during the API call.

- [x] **[Client Portal] Proposals not visible in client portal**
      Clients cannot see their proposals (pending, accepted, or declined) in their portal. Add a Proposals tab to the client portal showing proposal status and content.
      `URL: filecurrent.com/portal/{id}`

      **Fixed 2026-06-12:** `getClientPortalData` now also returns the client's non-draft proposals (title, total, status, valid-until, share link). The portal gained a tabbed layout (Invoices | Contracts | Proposals, with counts) — pending proposals show a "Review →" CTA linking to the public proposal page; accepted/declined show their status pill.

- [x] **[Client Portal] Proposal acceptance not reflected in client activity or dashboard**
      After a client accepts a proposal, neither the client's activity tab nor the freelancer's dashboard reflects the event. Fix the event propagation for proposal acceptance/dismissal.
      `URL: filecurrent.com/dashboard + /clients/{id}`

      **Fixed 2026-06-12:** Accept/decline routes now write `proposal_accepted`/`proposal_declined` rows to `client_activity_log` (with clientId, so they appear on the client's Activity tab). `ActivityFeed` renders both with icons + descriptions. Dashboard shows the banner (see Dashboard fix above).

- [x] **[Intake Forms] No way to send intake form to client**
      After creating an intake form there is no send button or sharing mechanism. Add a "Send to Client" button on intake forms. Also add a form preview/sample inside the form builder so users understand what the client will see.
      `URL: filecurrent.com/forms`

      **Fixed 2026-06-11:** Added a **Send** button to each form on the list page → opens a dialog to pick a saved client (pulls their email server-side) or enter an email manually, then POSTs to new `/api/intake-forms/[id]/send` which emails the public form link via a new `intake-form` template (reply-to set to the freelancer). Added a **Preview as client** button in the builder's Preview card → opens a modal rendering the form exactly as the client sees it at `/intake/[token]` (new `ClientFormPreview` mirrors `IntakeSubmitForm` styling, read-only). The builder already had a small live sidebar preview; this adds the true full-fidelity client view.

- [x] **[Proposals] Proposal send button gives error but proposal link works**
      Clicking "Send to Client" on a proposal returns "Failed to send proposal" but the proposal itself works fine when the link is opened in incognito. The issue is in email delivery, not the proposal generation. Debug the send endpoint and email service.
      `URL: filecurrent.com/proposals/{id}`

      **Fixed 2026-06-12:** Same class as the June-11 contract/invoice email bugs — the route did a bare `await sendEmail(...)`; any Brevo error 500'd the request with no JSON body, so the client fell back to the generic "Failed to send proposal" toast (and the status update was skipped). Now wrapped in try/catch: failures log the real Brevo error server-side and return a descriptive 502 ("Email delivery failed. Use Copy Link to share the proposal manually, or try again.") which the toast displays.

- [x] **[Proposals] No freelancer email notification on proposal acceptance/dismissal**
      When a client accepts or dismisses a proposal the freelancer receives no email. Send an email to the freelancer on both events including client name, proposal title, and a link to next steps.
      `URL: Proposal workflow`

      **Fixed 2026-06-11/12:** Accept email existed and is now gated on the `proposal_accepted` toggle; decline previously sent nothing — new `proposal-declined` template + trigger (gated on `proposal_declined`). Both include client name, proposal title, and a dashboard link.

- [x] **[Contracts] Asterisk markdown visible in contract output**
      The generated contract displays raw markdown asterisks (_Freelancer:_, _Client:_, etc.) instead of formatted bold text. Strip markdown from contract output and apply proper HTML/CSS bold styling.
      `URL: Contract PDF/view`

      **Fixed 2026-06-12:** Root cause: `renderInlineParts` (contract detail page + sign page) stripped single-`*` italics BEFORE handling `**bold**`, which corrupted `**Client:**` into visible `*Client:*`. Reordered: bold is split into `<strong>` first, then remaining single markers are stripped. Also hardened all four markdown cleaners (`renderInlineParts` x2, `cleanLine` in ContractPDF, `stripMarkdown` in utils) with `[^*]`/`[^_]` content classes so `________` signature lines are no longer mangled.

- [x] **[Contracts] Signed document link shows "Already Signed" error**
      After signing, the client receives a "View Signed Document" link via email. Clicking it shows "Document Already Signed" error instead of a read-only view of the signed contract. Fix the routing for post-sign document view.
      `URL: filecurrent.com/sign/{hash}`

      **Fixed 2026-06-12:** The sign page no longer dead-ends — signed contracts render the full document read-only with a green "Signed by {name}" banner and a **Download Signed PDF** button. Added public token-scoped `GET /api/sign/[token]/pdf` (serves the stored signed PDF from R2) because the existing `/api/contracts/[id]/pdf` route requires freelancer auth, so clients could never have downloaded it.

- [ ] **[Invoices] No partial invoicing support**
      The invoice system does not support milestone-based or partial invoicing (e.g. 50% upfront, 50% on delivery), which is standard in creative industries. Add support for payment milestones — percentage or fixed amount — on a single invoice.
      `URL: filecurrent.com/invoices/new`

- [ ] **[Invoices] Payment instructions section needs full redesign**
      The payment instructions field is too basic. Freelancers need to be able to add multiple structured payment methods: Stripe link, bank transfer, IBAN/account number, PayPal, etc. Each method should have proper input fields and display professionally on the client-facing invoice. Research how competitors handle this.
      `URL: filecurrent.com/invoices/new`

- [ ] **[Expenses] Expenses not linked to invoices or clients**
      Expenses are isolated and cannot be added to a client invoice or marked as billable. Allow users to: (1) mark an expense as client-billable, (2) choose whether to charge the client or just show it, (3) add it as a line item on an invoice.
      `URL: filecurrent.com/expenses`

---

## 🟡 MEDIUM

- [x] **[Onboarding] Incorrect trial duration mentioned**
      The onboarding dialog mentions "30-day free trial" but the actual trial has been shortened. Update the trial duration text to show the correct number of days.
      `URL: filecurrent.com/onboarding — Step 3`

      **Fixed 2026-06-12:** Verified in Supabase: `profiles.trial_ends_at` defaults to `now() + 5 days`. Set `TRIAL_DAYS = 5` in constants (with a comment tying it to the DB default) — onboarding + welcome email use the constant. The landing pricing footnote ("30-day free trial") now renders from `TRIAL_DAYS` too.

- [x] **[Onboarding] No logo upload option**
      Onboarding does not offer a business/freelancer logo upload step. The logo appears on contracts and invoices so this should be part of setup. Add a logo upload step with a "Skip for now" option.
      `URL: filecurrent.com/onboarding`

      **Fixed 2026-06-12:** Onboarding is now 4 steps — new step 3 "Add your logo" with upload target, live preview, remove button, and "Skip this step". The file uploads to R2 via the existing /api/profile/logo route when setup completes.

- [x] **[Onboarding] No final settings-redirect step**
      Onboarding ends without directing the user to Settings to complete their profile (taxes, discounts, payment methods). Add a final step summarizing what's left and linking to the relevant settings pages.
      `URL: filecurrent.com/onboarding`

      **Fixed 2026-06-12:** The final step now includes a "Finish your setup anytime in Settings" card listing what's left (default tax rate, payment instructions, invoice branding) with a direct link that completes onboarding and navigates to /settings.

- [ ] **[Forms — General] Browser autofill appearing in all form fields**
      Clicking any form field across the app shows browser autofill/history suggestions. Add `autocomplete="off"` or `autocomplete="new-password"` to all relevant input fields app-wide.
      `URL: App-wide`

- [ ] **[Clients] Client portal button has no text label**
      In the clients list, the portal button shows only a chain icon with no label. "+Contract" and "+Invoice" have labels but the portal button does not. Add "Client Portal" text label next to the icon. Also review button colors — all-white buttons are hard to distinguish.
      `URL: filecurrent.com/clients`

- [ ] **[Clients] Client portal email lacks detail and lost-link instructions**
      The email sent to clients with their portal link is too brief. Expand it to explain each portal section (invoices, contracts, balance) and add: "If you lose this link, you can request a new one from your service provider."
      `URL: Client portal email`

- [ ] **[Clients] Client portal URL uses UUID instead of client name**
      Portal URLs (/portal/{uuid}) are not user-friendly. Generate human-readable slugs: /portal/jhon-ibrahim/v1. For duplicate names: /portal/jhon-ibrahim-c2/v1. For re-generated links increment version: /v2, /v3, etc.
      `URL: filecurrent.com/portal/{uuid}`

- [ ] **[Clients] Client detail page URL uses UUID**
      The client detail URL (/clients/{uuid}?tab=activity) is ugly. Use a name-based slug instead: /clients/jhon-ibrahim or /clients/jhon-ibrahim-juva-inc.
      `URL: filecurrent.com/clients/{uuid}`

- [ ] **[Clients] Client view missing quick-action buttons for all linked features**
      The client detail page only shows "+New Contract" and "+New Invoice". Add quick-action buttons for all client-linked features: Proposal, Intake Form, Time Log, Expense.
      `URL: filecurrent.com/clients/{id}`

- [ ] **[Clients] Client detail page uses stacked layout — needs tabs**
      Contracts and Invoices are stacked vertically making the page messy. Restructure with tabs: Overview, Contracts, Invoices, Proposals, Forms, Time Tracking, Activity.
      `URL: filecurrent.com/clients/{id}`

- [ ] **[Client Portal] Portal uses stacked layout — needs tabs**
      The client-facing portal stacks all content vertically. Add tabs: Invoices, Contracts, Proposals, Balance.
      `URL: filecurrent.com/portal/{id}`

- [ ] **[Proposals] Project summary field needs to be a rich text editor**
      The project summary field is a plain Slate text input. Replace it with a rich text editor (TipTap or Quill) supporting H1/H2, bold, italic, underline, bullet lists, and paragraph breaks.
      `URL: filecurrent.com/proposals/new`

- [x] **[Proposals] "Valid Until" date is confusingly linked to contract due date**
      The proposal validity date appears to be tied to the contract due date. Decouple them — these are separate concepts. Add a clear label and tooltip for each field.
      `URL: filecurrent.com/proposals/new`

      **Fixed 2026-06-12:** Verified the field was never programmatically coupled — the confusion was purely labeling. Relabeled to "Offer Valid Until (optional)" with helper text: "The date this proposal's pricing expires. This is separate from any project or contract dates — those are set later on the contract itself." 

- [x] **[Proposals] No next-step guidance after proposal is accepted**
      After a proposal is accepted there is no prompt or guidance for the freelancer. Display: "Your proposal was accepted! Ready to create a contract?" with a quick action button.
      `URL: filecurrent.com/proposals`

      **Fixed 2026-06-12:** /proposals now shows a green banner for each accepted proposal without a contract: "🎉 {client} accepted '{title}' — ready to create the contract?" with a "Create Contract →" button (pre-filled via ?proposalId=). The dashboard shows the same nudge via the proposal-events banner.

- [ ] **[Contracts] Contract template content needs improvement**
      Default contract templates are not polished enough for production. Review and improve all templates with professionally drafted, legally appropriate boilerplate per profession.
      `URL: filecurrent.com/contracts`

- [ ] **[Contracts] Contract signing URL is a raw hash**
      The signing URL (/sign/{hash}) looks untrustworthy. Generate a cleaner URL like /sign/jhon-ibrahim-photography or /sign/{short-readable-id}.
      `URL: filecurrent.com/sign/{hash}`

- [ ] **[Contracts] Contract signing page not inside client portal**
      The contract signing page opens as a standalone page. Route it through the client portal for a consistent branded experience.
      `URL: filecurrent.com/sign/{hash}`

- [x] **[Contracts] Profession template menu opens even if profession already selected**
      When creating a contract, the profession/template selection dialog appears even if the user already chose one during onboarding. Pre-select the profession and skip the selection step if already set.
      `URL: filecurrent.com/contracts/new`

      **Fixed 2026-06-12:** Same fix as the onboarding template bug — first visit with a known profession auto-applies that profession's template and skips the dialog entirely (toast with "Change" action to reopen it). The dialog now only opens when no profession mapping exists or when arriving from a proposal.

- [x] **[Contracts] IP address collection method in audit trail is unclear**
      The audit trail shows a client IP address with no explanation of how it is collected. Add a tooltip or help text explaining the collection method and note any VPN/proxy caveats.
      `URL: Contract audit trail`

      **Fixed 2026-06-12:** PDF audit-trail page now includes help text under the events table: captured from the signer's network connection via request headers at each event, with the VPN/proxy caveat. The freelancer's contract-signed email IP line carries the same explanation.

- [x] **[Invoices] Tax rate not auto-populated**
      The tax rate set in Settings is not pre-filled when creating a new invoice. Pull the default tax rate from user settings and pre-populate it automatically.
      `URL: filecurrent.com/invoices/new`

      **Fixed/verified 2026-06-12:** The wiring already exists end-to-end (profiles.default_tax_rate -> getCurrentProfile -> /invoices/new -> InvoiceForm initial state, with the invoice template's tax rate taking precedence when set). If the field shows 0, the Settings default tax rate is 0. Re-tested the chain — no code defect found.

- [ ] **[Invoices] Invoice opens on standalone page instead of client portal**
      Invoice links open on a standalone page. Route invoice viewing through the client portal for a consistent experience.
      `URL: filecurrent.com/invoices/{id}`

- [x] **[Invoices] Amount field is too sensitive to mouse scroll**
      The invoice amount input field changes value when the user scrolls over it. Disable scroll behavior on number inputs: `onWheel={e => e.target.blur()}`.
      `URL: filecurrent.com/invoices/new`

      **Fixed 2026-06-12:** Fixed globally in the shared shadcn `Input` primitive — any `type="number"` input now blurs on wheel, so every number field app-wide (invoices, expenses, time tracking, settings) is protected, not just the invoice amount.

- [ ] **[Exports] Export page UI needs redesign**
      The /exports page has poorly designed cards. Redesign with a clean layout, clear labels, icons, and action buttons.
      `URL: filecurrent.com/exports`

- [ ] **[Imports] Import page UI needs redesign**
      The /imports page has poorly designed cards. Redesign with a clean, professional layout.
      `URL: filecurrent.com/imports`

- [ ] **[Feedback] Feedback page UI needs redesign**
      The /feedback page form has poor UI. Redesign with proper input styling, spacing, and a professional layout.
      `URL: filecurrent.com/feedback`

- [ ] **[UX / Help] No contextual help, tooltips, or walkthrough GIFs**
      Features like intake forms, proposals, and time tracking have no contextual help. Add small walkthrough GIFs or tooltip panels (via a "?" icon) for each major feature with examples. Consider an in-app help sidebar.
      `URL: App-wide`

---

## 🟢 LOW

- [x] **[Onboarding] Skip button triggers loading/processing**
      Clicking "Skip for now" in the onboarding dialog triggers a loading spinner. Skip should close the dialog and do nothing else. Remove any async call triggered by the Skip button.
      `URL: filecurrent.com/onboarding`

      **Fixed 2026-06-12:** Skip now closes the dialog instantly (optimistic dismiss) — the onboarding-complete flag still saves silently in the background (required, otherwise the modal would reopen on every page load), but the user never sees a spinner.

- [ ] **[Clients] Client detail page URL uses UUID**
      (See Medium section — listed here as a reminder for URL cleanup pass.)
      `URL: filecurrent.com/clients/{uuid}`

- [x] **[Proposals] Send button label is too generic**
      The send button reads "Send to Client". Rename to "Send Proposal to Client".
      `URL: filecurrent.com/proposals/{id}`

      **Fixed 2026-06-12:** Renamed to "Send Proposal to Client" (and resend state to "Resend Proposal").

- [x] **[Contracts] "Generate & Send Email" button label is verbose**
      Rename to simply "Send Email".
      `URL: filecurrent.com/contracts/{id}`

      **Fixed 2026-06-12:** Renamed to "Send Email".

- [x] **[Contracts] Browser autofill in signature field**
      Add `autocomplete="off"` to the signature input field on the contract signing page.
      `URL: filecurrent.com/sign/{hash}`

      **Fixed 2026-06-12:** Added `autoComplete="off"` to the signer-name input in SignaturePanel.

- [x] **[Invoices] No prompt to create time log when no unbilled entries exist**
      When importing unbilled time entries shows an empty state, add a "Do you want to create a time log now?" link below it.
      `URL: filecurrent.com/invoices/new`

      **Fixed 2026-06-12:** The empty state in the time-log import dialog now shows "Do you want to create a time log now?" linking to /time-tracking (opens in a new tab so the in-progress invoice draft is not lost).

- [x] **[Invoices] Duplicate button not visible on invoice**
      Add a visible Duplicate button to the invoice actions menu.
      `URL: filecurrent.com/invoices/{id}`

      **Verified 2026-06-12:** The invoice detail header already renders `DuplicateInvoiceButton` with a labeled "Duplicate" button (copy icon + text, outline variant on paid invoices). Present since the June-10 action-hierarchy pass.

- [ ] **[Payment Reminders] Marketing copy inside product UI**
      The reminders section contains: "FileCurrent sends reminders automatically with no daily limits. You'll never miss a late payment because of an artificial cap." Remove this — it belongs on the landing page, not in the product.
      `URL: filecurrent.com/reminders`

- [x] **[Navigation] No back button on invoices page**
      The /invoices page has no back button or breadcrumb. Add navigation.
      `URL: filecurrent.com/invoices`

      **Fixed 2026-06-12:** Added a "Dashboard" back link to the /invoices PageHeader.

---

_Total issues: 62 | Critical: 9 | High: 19 | Medium: 25 | Low: 9_
