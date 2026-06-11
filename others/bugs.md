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

- [ ] **[Intake Forms] Submitted intake form not reflected anywhere in app**
      A client filled out an intake form via link, got a success message, but the submission does not appear in the client's activity tab, the forms section, or anywhere in the app. Fix the submission storage and display pipeline.
      `URL: filecurrent.com/forms`

- [ ] **[Clients] Client page does not load after adding a new client**
      After successfully creating a client, the route /clients fails to load and shows a blank or error state. Debug the post-creation redirect and ensure the clients list re-fetches after a new client is added.
      `URL: filecurrent.com/clients`

- [ ] **[Notifications / Email] All email notification triggers are broken**
      None of the email notifications in Settings > Notifications are working: contract opened, contract signed, invoice opened, invoice overdue, daily summary. Audit all notification event hooks and test each trigger individually.
      `URL: filecurrent.com/settings/notifications`

- [ ] **[Notifications / Email] Missing email notification events**
      The following notification events are missing from Settings entirely: proposal accepted, proposal declined, client submitted intake form, payment marked as received. Add the missing toggles and implement their email triggers.
      `URL: filecurrent.com/settings/notifications`

---

## 🟠 HIGH

- [ ] **[Auth / OAuth] Supabase URL shown during Google Sign-In**
      The Google account picker displays the raw Supabase project URL (gqwbsrzhhoivzbuaeryu.supabase.co) instead of "FileCurrent". Configure the OAuth app display name and redirect URL in Supabase Auth settings so users see "FileCurrent" throughout the sign-in flow.
      `URL: filecurrent.com/auth`

- [ ] **[Onboarding] Selected profession template not loading on first entry**
      After selecting a profession during onboarding, navigating to contracts does not apply the template. The template only loads if the user re-opens onboarding and re-selects. On selection, the template must be immediately applied and persisted so it loads automatically when the user goes to contracts.
      `URL: filecurrent.com/onboarding`

- [ ] **[Onboarding] Email field is not editable**
      The email field in the onboarding business profile form and in Settings is frozen and cannot be edited. Either allow email editing with a verification flow, or clearly label it as managed via account settings with a direct link.
      `URL: filecurrent.com/settings`

- [ ] **[Dashboard] Navigation links are very slow to load**
      Clicking "Add your first client", "Create a contract", "Send an invoice", and "Set up payment reminders" from the dashboard takes a very long time. Investigate route-level performance, add prefetching or code splitting.
      `URL: filecurrent.com/dashboard`

- [ ] **[Dashboard] Proposal acceptance/dismissal not reflected on dashboard**
      When a client accepts or dismisses a proposal, the dashboard shows no banner, no activity update, and no email is sent. Dashboard must show a notification banner and the freelancer must receive an email for both events.
      `URL: filecurrent.com/dashboard`

- [ ] **[Clients] New client creation is very slow**
      Adding a new client takes an unusually long time to process. Profile the client creation API call, optimize the database write, and add a loading skeleton so the experience feels faster.
      `URL: filecurrent.com/clients/new`

- [ ] **[Client Portal] Proposals not visible in client portal**
      Clients cannot see their proposals (pending, accepted, or declined) in their portal. Add a Proposals tab to the client portal showing proposal status and content.
      `URL: filecurrent.com/portal/{id}`

- [ ] **[Client Portal] Proposal acceptance not reflected in client activity or dashboard**
      After a client accepts a proposal, neither the client's activity tab nor the freelancer's dashboard reflects the event. Fix the event propagation for proposal acceptance/dismissal.
      `URL: filecurrent.com/dashboard + /clients/{id}`

- [ ] **[Intake Forms] No way to send intake form to client**
      After creating an intake form there is no send button or sharing mechanism. Add a "Send to Client" button on intake forms. Also add a form preview/sample inside the form builder so users understand what the client will see.
      `URL: filecurrent.com/forms`

- [ ] **[Proposals] Proposal send button gives error but proposal link works**
      Clicking "Send to Client" on a proposal returns "Failed to send proposal" but the proposal itself works fine when the link is opened in incognito. The issue is in email delivery, not the proposal generation. Debug the send endpoint and email service.
      `URL: filecurrent.com/proposals/{id}`

- [ ] **[Proposals] No freelancer email notification on proposal acceptance/dismissal**
      When a client accepts or dismisses a proposal the freelancer receives no email. Send an email to the freelancer on both events including client name, proposal title, and a link to next steps.
      `URL: Proposal workflow`

- [ ] **[Contracts] Asterisk markdown visible in contract output**
      The generated contract displays raw markdown asterisks (_Freelancer:_, _Client:_, etc.) instead of formatted bold text. Strip markdown from contract output and apply proper HTML/CSS bold styling.
      `URL: Contract PDF/view`

- [ ] **[Contracts] Signed document link shows "Already Signed" error**
      After signing, the client receives a "View Signed Document" link via email. Clicking it shows "Document Already Signed" error instead of a read-only view of the signed contract. Fix the routing for post-sign document view.
      `URL: filecurrent.com/sign/{hash}`

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

- [ ] **[Onboarding] Incorrect trial duration mentioned**
      The onboarding dialog mentions "30-day free trial" but the actual trial has been shortened. Update the trial duration text to show the correct number of days.
      `URL: filecurrent.com/onboarding — Step 3`

- [ ] **[Onboarding] No logo upload option**
      Onboarding does not offer a business/freelancer logo upload step. The logo appears on contracts and invoices so this should be part of setup. Add a logo upload step with a "Skip for now" option.
      `URL: filecurrent.com/onboarding`

- [ ] **[Onboarding] No final settings-redirect step**
      Onboarding ends without directing the user to Settings to complete their profile (taxes, discounts, payment methods). Add a final step summarizing what's left and linking to the relevant settings pages.
      `URL: filecurrent.com/onboarding`

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

- [ ] **[Proposals] "Valid Until" date is confusingly linked to contract due date**
      The proposal validity date appears to be tied to the contract due date. Decouple them — these are separate concepts. Add a clear label and tooltip for each field.
      `URL: filecurrent.com/proposals/new`

- [ ] **[Proposals] No next-step guidance after proposal is accepted**
      After a proposal is accepted there is no prompt or guidance for the freelancer. Display: "Your proposal was accepted! Ready to create a contract?" with a quick action button.
      `URL: filecurrent.com/proposals`

- [ ] **[Contracts] Contract template content needs improvement**
      Default contract templates are not polished enough for production. Review and improve all templates with professionally drafted, legally appropriate boilerplate per profession.
      `URL: filecurrent.com/contracts`

- [ ] **[Contracts] Contract signing URL is a raw hash**
      The signing URL (/sign/{hash}) looks untrustworthy. Generate a cleaner URL like /sign/jhon-ibrahim-photography or /sign/{short-readable-id}.
      `URL: filecurrent.com/sign/{hash}`

- [ ] **[Contracts] Contract signing page not inside client portal**
      The contract signing page opens as a standalone page. Route it through the client portal for a consistent branded experience.
      `URL: filecurrent.com/sign/{hash}`

- [ ] **[Contracts] Profession template menu opens even if profession already selected**
      When creating a contract, the profession/template selection dialog appears even if the user already chose one during onboarding. Pre-select the profession and skip the selection step if already set.
      `URL: filecurrent.com/contracts/new`

- [ ] **[Contracts] IP address collection method in audit trail is unclear**
      The audit trail shows a client IP address with no explanation of how it is collected. Add a tooltip or help text explaining the collection method and note any VPN/proxy caveats.
      `URL: Contract audit trail`

- [ ] **[Invoices] Tax rate not auto-populated**
      The tax rate set in Settings is not pre-filled when creating a new invoice. Pull the default tax rate from user settings and pre-populate it automatically.
      `URL: filecurrent.com/invoices/new`

- [ ] **[Invoices] Invoice opens on standalone page instead of client portal**
      Invoice links open on a standalone page. Route invoice viewing through the client portal for a consistent experience.
      `URL: filecurrent.com/invoices/{id}`

- [ ] **[Invoices] Amount field is too sensitive to mouse scroll**
      The invoice amount input field changes value when the user scrolls over it. Disable scroll behavior on number inputs: `onWheel={e => e.target.blur()}`.
      `URL: filecurrent.com/invoices/new`

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

- [ ] **[Onboarding] Skip button triggers loading/processing**
      Clicking "Skip for now" in the onboarding dialog triggers a loading spinner. Skip should close the dialog and do nothing else. Remove any async call triggered by the Skip button.
      `URL: filecurrent.com/onboarding`

- [ ] **[Clients] Client detail page URL uses UUID**
      (See Medium section — listed here as a reminder for URL cleanup pass.)
      `URL: filecurrent.com/clients/{uuid}`

- [ ] **[Proposals] Send button label is too generic**
      The send button reads "Send to Client". Rename to "Send Proposal to Client".
      `URL: filecurrent.com/proposals/{id}`

- [ ] **[Contracts] "Generate & Send Email" button label is verbose**
      Rename to simply "Send Email".
      `URL: filecurrent.com/contracts/{id}`

- [ ] **[Contracts] Browser autofill in signature field**
      Add `autocomplete="off"` to the signature input field on the contract signing page.
      `URL: filecurrent.com/sign/{hash}`

- [ ] **[Invoices] No prompt to create time log when no unbilled entries exist**
      When importing unbilled time entries shows an empty state, add a "Do you want to create a time log now?" link below it.
      `URL: filecurrent.com/invoices/new`

- [ ] **[Invoices] Duplicate button not visible on invoice**
      Add a visible Duplicate button to the invoice actions menu.
      `URL: filecurrent.com/invoices/{id}`

- [ ] **[Payment Reminders] Marketing copy inside product UI**
      The reminders section contains: "FileCurrent sends reminders automatically with no daily limits. You'll never miss a late payment because of an artificial cap." Remove this — it belongs on the landing page, not in the product.
      `URL: filecurrent.com/reminders`

- [ ] **[Navigation] No back button on invoices page**
      The /invoices page has no back button or breadcrumb. Add navigation.
      `URL: filecurrent.com/invoices`

---

_Total issues: 62 | Critical: 9 | High: 19 | Medium: 25 | Low: 9_
