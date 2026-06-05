// Niche-specific contract templates for FileCurrent.
// Pure pre-fill data — no DB storage. Content flows into the contract content field.
// Variables: {{client_name}}, {{client_company}}, {{client_email}},
//            {{freelancer_name}}, {{freelancer_business}}, {{rate}}, {{currency}},
//            {{start_date}}, {{end_date}}, {{payment_terms}}, {{project_description}}

export type ContractNiche =
  | 'web-designer'
  | 'photographer'
  | 'wedding-photographer'
  | 'graphic-designer'
  | 'copywriter'
  | 'videographer'
  | 'social-media-manager'
  | 'blank'

export interface ContractTemplate {
  id: ContractNiche
  label: string
  description: string
  icon: string
  suggestedTitle: string
  suggestedPaymentTerms: string
  content: string
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // 1. WEB DESIGNER / WEB DEVELOPER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'web-designer',
    label: 'Web Designer / Developer',
    description: 'For website builds, redesigns, and web app development projects.',
    icon: 'Globe',
    suggestedTitle: 'Web Design & Development Agreement',
    suggestedPaymentTerms: '50% deposit due before work begins. Remaining 50% due upon final delivery before site launch.',
    content: `# Web Design & Development Agreement

This Web Design and Development Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}}, operating as {{freelancer_business}} ("I," "me," or "the Freelancer"), and {{client_name}} of {{client_company}} ("you" or "the Client"). By proceeding with this project, both parties agree to be bound by the terms set forth below.

---

## 1. PARTIES AND PROJECT OVERVIEW

I, {{freelancer_name}} of {{freelancer_business}}, agree to provide web design and development services to you, {{client_name}} of {{client_company}}, as described in this Agreement. The project description is as follows: {{project_description}}. This Agreement is effective as of {{start_date}} and covers all work performed through {{end_date}} or until project completion, whichever comes later.

## 2. PROJECT SCOPE AND DELIVERABLES

I will design and develop the website and digital deliverables as described in the project overview above. The scope of this project is limited exclusively to the features, pages, and functionality described in that overview. Any items not explicitly mentioned are out of scope. I want to be clear: if a feature, page, integration, or design element is not listed, it is not included. Any additions or changes to the agreed scope must be submitted as a written change order, signed by both parties, before I begin the additional work. I reserve the right to quote additional fees for any change order.

## 3. MILESTONE-BASED PAYMENT SCHEDULE

The total fee for this project is {{currency}} {{rate}}. Payment is structured as follows: a deposit of fifty percent (50%) of the total project fee is due before any work begins — no work will commence until this deposit is received and cleared. A second payment is due upon your written approval of the design mockups or design phase deliverables. The final remaining balance is due upon project completion, before the completed site files are transferred to you or the site goes live. I retain ownership of all work product until full payment is received. Payment terms are {{payment_terms}}.

## 4. SCOPE CHANGES AND CHANGE ORDERS

Any request to add pages, features, third-party integrations, design revisions beyond the agreed revision rounds, or any other change to the project as originally described constitutes a scope change. Scope changes are not covered by this Agreement and are not binding on me until a written change order has been prepared and signed by both of us. I do not accept verbal scope changes, and no email or message exchange constitutes authorization to proceed with additional work unless a signed change order exists. Additional scope is billed at my standard hourly rate, which will be specified in the change order.

## 5. THIRD-PARTY COSTS

My project fee covers design and development labor only. The following costs are your responsibility and are not included in the quoted price unless explicitly stated otherwise: web hosting and server fees, domain name registration and renewal, premium plugins, CMS licenses, theme licenses, stock photography, licensed fonts, third-party API fees, payment processing fees, and any other software subscriptions required for the project. I will notify you in advance of any third-party costs I am aware of, but I am not responsible for costs you incur independently.

## 6. CONTENT PROVISION DEADLINE

You agree to provide all content required for this project — including written copy, images, logos, brand guidelines, video files, and any other assets — by a date we will agree upon in writing. If content is not delivered on time, the project timeline will shift accordingly, and I will not be penalized for delays caused by late content delivery. I am not responsible for writing, photographing, or sourcing content unless we have separately contracted for those services.

## 7. BROWSER AND DEVICE COMPATIBILITY

I will test and optimize the completed project for current major versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge, on both standard desktop and mobile screen sizes. I do not guarantee compatibility with outdated or legacy browser versions, enterprise-specific browser configurations, or non-standard environments. Minor visual differences between browsers are inherent to web development and do not constitute defects requiring correction under this Agreement.

## 8. REVISION LIMIT

This Agreement includes two (2) rounds of revisions per design phase. A revision round means one consolidated set of feedback submitted by you in a single communication — not a running series of individual requests over multiple messages. Once I have addressed one round of revisions, the next round begins fresh. If you require additional revision rounds beyond the two included, those are billed at my standard hourly rate and invoiced separately. Revision requests must be submitted within seven (7) business days of each deliverable being presented to you.

## 9. INTELLECTUAL PROPERTY

All work product, designs, code, and deliverables created by me under this Agreement remain my intellectual property until I have received full and final payment. Upon receipt of final payment, I assign all intellectual property rights in the final deliverables to you. This transfer does not include my pre-existing tools, frameworks, libraries, boilerplate code, or development methodologies, which remain my property. I retain the right to display the completed work — including screenshots, mockups, and project descriptions — in my portfolio, on my website, and in my marketing materials, regardless of any other terms of this Agreement.

## 10. CONFIDENTIALITY

I agree to keep confidential any proprietary business information, trade secrets, customer data, or sensitive information you share with me in connection with this project. You agree to keep confidential any information I share about my rates, methods, tools, or proprietary processes. These confidentiality obligations survive the termination of this Agreement for a period of three (3) years.

## 11. HOSTING AND MAINTENANCE DISCLAIMER

This Agreement covers the design and development of your project only. Once the project is delivered and final payment is received, my obligations under this Agreement are complete. Ongoing web hosting, server maintenance, software updates, security monitoring, content updates, and technical support after launch are not included and are not my responsibility. If you would like ongoing maintenance services, we will need to negotiate a separate maintenance agreement.

## 12. TERMINATION AND KILL FEE

Either party may terminate this Agreement with fourteen (14) days written notice. If you terminate this Agreement after work has begun, you agree to pay me for all work completed through the date of termination, calculated at the pro-rated contract rate, plus a kill fee equal to twenty-five percent (25%) of the remaining unpaid contract balance. The kill fee compensates me for time I have reserved for your project and opportunities I have declined. If I terminate due to your material breach, I will retain all fees paid and deliver work completed to the payment level received.

## 13. LATE PAYMENT PENALTIES

Invoices not paid within seven (7) days of the due date will incur a late fee of one and one-half percent (1.5%) per month on the outstanding balance, compounding monthly. I reserve the right to suspend all work and withhold all deliverables until your account is brought current. You agree to reimburse me for any reasonable costs I incur in collecting overdue payments, including attorney's fees.

## 14. LIMITATION OF LIABILITY

My total liability to you under this Agreement, for any claim of any kind, shall not exceed the total fees you have actually paid to me under this Agreement. I am not liable for any lost profits, lost business opportunities, consequential damages, incidental damages, or special damages, even if I have been advised of the possibility of such damages.

## 15. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I am domiciled. Any disputes arising out of or related to this Agreement shall be resolved in the courts of my state of domicile, and you consent to personal jurisdiction in that venue.

---

**Freelancer:** {{freelancer_name}} / {{freelancer_business}}
**Client:** {{client_name}} / {{client_company}}
**Project Start:** {{start_date}} | **Project End:** {{end_date}}
**Total Fee:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. PHOTOGRAPHER (GENERAL / COMMERCIAL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'photographer',
    label: 'Photographer',
    description: 'For commercial, portrait, product, and general photography sessions.',
    icon: 'Camera',
    suggestedTitle: 'Photography Services Agreement',
    suggestedPaymentTerms: '50% non-refundable retainer due at booking. Remaining balance due 48 hours before the session.',
    content: `# Photography Services Agreement

This Photography Services Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}}, operating as {{freelancer_business}} ("I," "me," or "the Freelancer"), and {{client_name}} of {{client_company}} ("you" or "the Client"). Both parties agree to the following terms governing the photography services described below.

---

## 1. PARTIES AND SESSION DETAILS

I, {{freelancer_name}} of {{freelancer_business}}, agree to provide professional photography services to you, {{client_name}} of {{client_company}}, as follows: {{project_description}}. The session is scheduled for {{start_date}}. The total fee for this engagement is {{currency}} {{rate}}, payable under the terms stated in Section 2. All session details — including location, duration, and final image count — are as described in the project overview above.

## 2. COMPENSATION AND PAYMENT TERMS

The total fee for this session is {{currency}} {{rate}}, payable as follows: {{payment_terms}}. The retainer required to reserve your session date is non-refundable under all circumstances, including illness, scheduling conflicts, or change of plans on your part. No session date is confirmed until the retainer has cleared. The remaining balance is due as specified in the payment terms above; failure to pay the balance by the due date may result in cancellation of the session with forfeiture of the retainer.

## 3. COPYRIGHT OWNERSHIP

I retain full copyright ownership of all photographs produced under this Agreement. This is my right as the author of these works under the United States Copyright Act (17 U.S.C. § 101 et seq.), and it is non-negotiable. You do not own the images — you receive a license to use them as described below. You may not sell, sublicense, transfer, or assign usage rights to any third party without my prior written permission. Any unauthorized use of my images constitutes copyright infringement and may subject you to legal liability.

## 4. USAGE RIGHTS AND LICENSE

Upon receipt of full payment, I grant you a non-exclusive, non-transferable license to use the delivered photographs for the purposes described in the project overview. Personal use includes family sharing, printing for personal display, and sharing on personal social media accounts with credit to me. Commercial use — including advertising, product promotion, editorial use, stock licensing, and any use intended to generate revenue — requires a separate commercial license at an additional cost. If you intend to use the images commercially, you must disclose this before booking so I can quote the appropriate commercial license fee.

## 5. MODEL RELEASE REQUIREMENT

If identifiable people appear in the photographs, you are solely responsible for obtaining signed model releases from each such individual before the session. I am not responsible for obtaining releases on your behalf unless we have separately agreed to that as a paid service. You agree to indemnify and hold me harmless from any claims, damages, or legal actions arising from the use of images containing people who have not signed valid model releases.

## 6. LIMITED EDITS INCLUDED

My session fee includes standard post-processing on all delivered images: color correction, exposure adjustment, contrast balancing, and light retouching to ensure a consistent, polished look. The following are not included in the standard fee and are available at an additional per-image rate: heavy skin retouching, blemish or scar removal, body modification or reshaping, background removal or replacement, object removal, and compositing or digital manipulation. I will not deliver images in a style inconsistent with my published portfolio work.

## 7. RAW FILES NOT DELIVERED

Raw, unedited image files are my exclusive property and will not be delivered under any circumstances as part of a standard session booking. Raw files represent my unfinished, proprietary work product and are not a deliverable. If you require raw files, this must be contracted separately in a written addendum at an additional fee, and even then delivery is at my sole discretion.

## 8. IMAGE DELIVERY TIMELINE

I will deliver your final edited images within fourteen (14) business days of the session date via an online gallery link. This timeline assumes I have received full payment before or on the session date. Rush delivery — within five (5) business days — is available at an additional fee. You are responsible for downloading all images within thirty (30) days of gallery delivery; I am not obligated to re-deliver or store images after the gallery access period expires.

## 9. AESTHETIC DISCLAIMER

My editing style is consistent with my published portfolio, which you have had the opportunity to review before booking. By signing this Agreement, you confirm that you are engaging me on the basis of my established style. Dissatisfaction with my artistic choices, editing style, color treatment, or creative direction does not constitute grounds for a refund, a reshoot, or any reduction in fees. I do not alter my editing style to match other photographers' work.

## 10. CANCELLATION AND RESCHEDULING

The retainer paid to reserve your session date is non-refundable under all circumstances. If you cancel your session more than seven (7) days before the scheduled date, you forfeit only the retainer and owe no additional amount. If you cancel within seven (7) days of the session, or fail to appear at the scheduled time and location, you forfeit one hundred percent (100%) of the total session fee. I will permit one (1) reschedule with at least seventy-two (72) hours advance notice, subject to my availability; the retainer will be applied to the rescheduled date.

## 11. ILLNESS AND INCAPACITATION BACKUP CLAUSE

If I am unable to perform the session due to sudden illness, injury, or personal emergency, I will make every reasonable effort to find a qualified substitute photographer to fulfill the booking. If no qualified substitute is available, you will receive a full refund of all payments made to me. This represents my sole liability to you in the event I cannot perform. I am not responsible for any consequential damages, including travel costs or event costs you have incurred.

## 12. NON-DISPARAGEMENT

Both parties agree not to make false, misleading, or defamatory statements about the other in any public forum, including but not limited to social media, Google reviews, Yelp, or professional networks. Honest feedback based on genuine experience is not restricted by this clause; however, knowingly false or maliciously exaggerated statements are prohibited.

## 13. EQUIPMENT LIABILITY

You and your representatives may not handle my camera equipment, lighting, or accessories at any time. I am not responsible for damage to my equipment caused by venue conditions, adverse weather, third-party interference, or client-directed activities. If a venue or shoot location poses a risk to my equipment that I deem unreasonable, I reserve the right to decline to use equipment in that location without penalty.

## 14. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I operate my business. Any dispute arising under this Agreement shall be resolved in the courts of my state of operation, and you consent to jurisdiction in that venue.

---

**Freelancer:** {{freelancer_name}} / {{freelancer_business}}
**Client:** {{client_name}} / {{client_company}}
**Session Date:** {{start_date}} | **Total Fee:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. WEDDING PHOTOGRAPHER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'wedding-photographer',
    label: 'Wedding Photographer',
    description: 'Full-day wedding coverage with retainer, cancellation tiers, and gallery terms.',
    icon: 'Heart',
    suggestedTitle: 'Wedding Photography Agreement',
    suggestedPaymentTerms: '30% non-refundable retainer due at signing. 70% balance due 30 days before the wedding date.',
    content: `# Wedding Photography Agreement

This Wedding Photography Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}}, operating as {{freelancer_business}} ("I," "me," or "the Freelancer"), and {{client_name}} ("you," "the Client," or "the Couple"). Both parties agree to be bound by every term set forth in this Agreement.

---

## 1. PARTIES AND EVENT DETAILS

I, {{freelancer_name}} of {{freelancer_business}}, agree to provide wedding photography services for your event as follows: {{project_description}}. The wedding is scheduled for {{start_date}}. My coverage will begin at the agreed call time and conclude at the agreed wrap time as confirmed in our planning communications. Ceremony and reception locations will be confirmed in writing no later than thirty (30) days before the wedding date. The total fee for this engagement is {{currency}} {{rate}}.

## 2. NON-REFUNDABLE RETAINER

A retainer equal to thirty percent (30%) of the total contract fee is due upon execution of this Agreement. This retainer is NON-REFUNDABLE under all circumstances, without exception. This means that if you postpone, cancel, change your mind, experience a personal emergency, or encounter any other circumstance — regardless of how unforeseen — the retainer will not be returned. The retainer represents my reservation of your wedding date, during which I decline all other bookings. The financial loss I suffer by holding that date exclusively for you is what the retainer compensates. Payment terms are: {{payment_terms}}.

## 3. PAYMENT SCHEDULE

The remaining seventy percent (70%) balance of the total fee is due no later than thirty (30) days before the wedding date. I will send you a reminder no later than forty-five (45) days before the wedding. If the balance is not received by the thirty-day deadline, I reserve the right to treat the booking as cancelled, retain all payments received, and release the date to other clients. I will not begin preparing for your wedding — reviewing timelines, scouting locations, preparing equipment — until the balance is paid in full.

## 4. EXCLUSIVE PHOTOGRAPHER CLAUSE

I am the exclusive contracted professional photographer for your wedding event. You agree not to engage any other professional photographer — meaning any person hired for compensation or using professional-grade equipment — to photograph your event without my prior written consent. Guests are welcome to take casual photographs with their personal phones and cameras, but I ask that you communicate to your guests and officiant that they should not step into the aisle, position themselves in front of me, or interfere with my access to key moments during the ceremony and portrait sessions.

## 5. SECOND SHOOTER

If a second photographer is included in your package, I will arrange for a qualified associate photographer. The specific second shooter may vary based on availability, but all second shooters I work with meet my professional standards. Second shooter images will be included in your final gallery. I reserve the right to substitute the second shooter with a comparably qualified professional if circumstances require.

## 6. FORCE MAJEURE

If I am unable to perform my services due to circumstances beyond my reasonable control — including but not limited to sudden serious illness, hospitalization, death in my immediate family, natural disaster, extreme weather that makes travel impossible, government-mandated event restrictions, or venue closure — my liability to you is limited to a full refund of all payments I have received from you. I will make every reasonable effort to find a qualified replacement photographer and will assist with the transition at no cost to you. I am not liable for any other costs you may incur, including vendor fees, travel expenses, or event costs.

## 7. MEAL AND BREAK POLICY

For any wedding coverage extending beyond six (6) consecutive hours, you agree to provide me — and my second shooter, if applicable — with a hot vendor meal at the same time as the wedding party or catering staff meal is served, typically during dinner service. I am entitled to a minimum thirty (30)-minute uninterrupted break during the reception. I will coordinate the timing of this break with you to ensure no key moments are missed. If a vendor meal is not provided, my fee will not be reduced, but I reserve the right to take a break as needed regardless.

## 8. SAFETY AND HARASSMENT CLAUSE

I take my personal safety seriously. I reserve the right to cease services and leave the event immediately, without refund of any fees paid, if I am subjected to physical violence, credible threats of physical harm, sustained verbal abuse, racial or sexual harassment, or any other conduct that creates an unsafe working environment. This includes conduct directed at me by you, members of your wedding party, your guests, or venue staff. Disagreements about shot selection or scheduling are not harassment; abusive, threatening, or physically dangerous conduct is.

## 9. TIMELINE COOPERATION

You agree to provide me with a detailed, written wedding day timeline no later than fourteen (14) days before your wedding date. This timeline should include all locations, travel times, ceremony time, portrait session windows, and reception schedule. I will use this timeline to plan coverage and ensure no key moments are missed. I am not responsible for missing moments, portraits, or events caused by late starts, schedule overruns, uncooperative guests or vendors, or timeline changes made without adequate notice to me.

## 10. EDITING STYLE AND EXPECTATIONS

All images will be edited in my signature style, consistent with my published portfolio, which you have reviewed and approved by entering into this Agreement. My editing process includes color correction, exposure adjustment, and stylistic tone treatment. Specific requests — including heavy skin retouching, body modification, background removal, or major compositing — are available as add-on services at an additional per-image rate. After the gallery has been delivered, I do not convert color images to black and white, re-edit images in a different style, or make other retrospective changes as part of this Agreement.

## 11. IMAGE DELIVERY TIMELINE

Your final edited wedding gallery will be delivered within eight (8) weeks of your wedding date. I will send you a notification when the gallery is ready. Rush delivery — within four (4) weeks — is available at an additional fee. I appreciate your patience; editing a full wedding gallery to my quality standards takes significant time.

## 12. ONLINE GALLERY ACCESS

Your online gallery will remain accessible for twelve (12) months from the date of delivery. You are solely responsible for downloading all images and creating your own backups within that twelve-month period. After the gallery expires, I am not obligated to store or re-deliver your images, though I may be able to do so for an archival retrieval fee at my discretion.

## 13. CANCELLATION POLICY

All cancellations must be communicated in writing. If you cancel more than six (6) months before the wedding date, you forfeit only the non-refundable retainer; no additional amount is owed. If you cancel between three (3) and six (6) months before the wedding date, fifty percent (50%) of the total contract fee is owed to me regardless of payments already made. If you cancel within three (3) months of the wedding date, one hundred percent (100%) of the total contract fee is owed. These fees reflect the reality that close-in cancellations make it impossible for me to rebook that date.

## 14. POSTPONEMENT POLICY

I will accommodate one (1) date change at no additional charge, provided the new date is available on my calendar and you notify me in writing at least sixty (60) days before the original wedding date. If the new date is not available on my calendar, the postponement will be treated as a cancellation under the policy above. A second date change, or a change requested with fewer than sixty (60) days notice, will be treated as a cancellation and new booking, requiring a fresh retainer.

## 15. VENUE ACCESS

You are responsible for ensuring I have full, unrestricted access to all ceremony and reception spaces at the contracted coverage times. If a venue has photography restrictions — including flash restrictions, location limitations, or timing restrictions — you must notify me in writing at least fourteen (14) days before the wedding so I can plan accordingly. Venue-imposed restrictions that limit my ability to photograph your event are not grounds for a refund or fee reduction.

## 16. SOCIAL MEDIA AND PORTFOLIO USAGE

I may publish your wedding images on my website, social media accounts, blog, and in my marketing and promotional materials. If you would like a temporary social media embargo — meaning you want to share the images yourself first — I will honor up to a forty-eight (48)-hour embargo from your wedding date if you request it in writing before the wedding. If you wish to opt out of portfolio use entirely, you must request this in writing before the wedding date, and we will discuss whether a portfolio opt-out fee applies.

## 17. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I am domiciled. Any disputes shall be resolved in the courts of my state of domicile.

---

**Freelancer:** {{freelancer_name}} / {{freelancer_business}}
**Client(s):** {{client_name}}
**Wedding Date:** {{start_date}} | **Total Fee:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. GRAPHIC DESIGNER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'graphic-designer',
    label: 'Graphic Designer',
    description: 'For logos, brand kits, print materials, and visual identity projects.',
    icon: 'PenNib',
    suggestedTitle: 'Graphic Design Services Agreement',
    suggestedPaymentTerms: '50% deposit due before work begins. Remaining 50% due upon delivery of final files.',
    content: `# Graphic Design Services Agreement

This Graphic Design Services Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}}, operating as {{freelancer_business}} ("I," "me," or "the Freelancer"), and {{client_name}} of {{client_company}} ("you" or "the Client"). Both parties agree to the terms below.

---

## 1. PARTIES AND PROJECT OVERVIEW

I, {{freelancer_name}} of {{freelancer_business}}, agree to provide graphic design services to you, {{client_name}} of {{client_company}}, as described in this Agreement. The project description is as follows: {{project_description}}. This Agreement is effective as of {{start_date}} with an anticipated completion of {{end_date}}. The total fee is {{currency}} {{rate}}, payable per the terms stated below.

## 2. PROJECT SCOPE AND DELIVERABLES

The deliverables for this project are those described in the project overview above, including the specific design items, quantities, and file formats listed therein. Any deliverable type, format, size, or design element not explicitly included in the project description is out of scope and is not covered by this Agreement. Out-of-scope requests will be quoted separately and require a written change order before I begin work on them.

## 3. INITIAL CONCEPTS

I will present two (2) initial design concepts in the first round of work. You will select one (1) concept direction to develop further. Non-selected concepts are not carried forward, developed further, or available for purchase separately. The concept presentation round is not a revision round — it is an exploratory phase, and only the selected concept proceeds to refinement.

## 4. REVISION ROUNDS LIMIT

This Agreement includes three (3) rounds of revisions on the selected design direction. A revision round is defined as one consolidated set of feedback submitted by you in a single document or message — it is not a back-and-forth conversation or a running series of individual change requests. Each round of revisions is addressed in full before the next round begins. If you require more than three (3) revision rounds, additional rounds are billed at my standard hourly rate. You must submit revision requests within five (5) business days of receiving each deliverable.

## 5. APPROVAL DEADLINE AND DEEMED APPROVAL

You have five (5) business days to review and respond to each deliverable I submit for your approval. If I do not receive written feedback or written approval from you within five (5) business days, the deliverable shall be considered approved and I may proceed to the next phase of the project. I will send one reminder before the deadline. I am not responsible for design decisions made under deemed approval.

## 6. FILE DELIVERY FORMATS

Final files will be delivered in the following formats: PNG (high-resolution with transparent background where applicable), PDF (print-ready), and SVG (vector format for scalability). Layered source files — including Adobe Illustrator (.ai), Adobe Photoshop (.psd), or other native application files — will be delivered only upon receipt of full and final payment, and only if source file delivery was included in the agreed project scope. If source files were not included in the scope, they are available for purchase separately at an additional fee.

## 7. PAYMENT STRUCTURE

The total project fee is {{currency}} {{rate}}, payable as follows: {{payment_terms}}. The deposit is non-refundable and must be received before I begin any design work. The deposit compensates me for the creative research, planning, and opportunity cost of reserving time for your project.

## 8. INTELLECTUAL PROPERTY TRANSFER

All designs, artwork, and deliverables created by me under this Agreement remain my intellectual property until full payment has been received. Upon receipt of final payment in full, I assign to you all copyright and ownership rights in the final approved deliverables specifically created for this project. Preliminary concepts, unused directions, rejected designs, and my pre-existing design assets, fonts, textures, and tools remain my property and are not transferred.

## 9. EXCLUSIVITY CLAUSE

To protect the value of your investment, I will not sell, license, or otherwise provide the final approved designs to any direct competitor of yours operating in the same primary industry and geographic market for a period of two (2) years from the date of final delivery. This exclusivity applies to the final approved deliverables only — not to design techniques, color approaches, or general stylistic methods that reflect my professional craft.

## 10. PORTFOLIO RIGHTS

I retain the permanent right to display the final deliverables — including mockups, screenshots, and written case study descriptions — in my portfolio, on my website, on social media, in award submissions, and in any other professional or marketing context. If you need the work to remain confidential and not appear publicly in my portfolio, you must request this in writing at the time of signing this Agreement, and we will negotiate a confidentiality premium that reflects the loss of portfolio value to me.

## 11. PRINT AND PRODUCTION DISCLAIMER

I design to industry-standard color specifications, and final files are prepared for both screen and print use. However, I cannot guarantee that colors displayed on your screen will match the output of any particular printing device, as color rendering varies significantly based on printer type, paper stock, ink profile, and monitor calibration. Before you authorize any print production run, you must obtain and approve physical proofs from your print vendor. I am not responsible for print errors, color variations, or production defects after you have approved proofs and authorized production.

## 12. CLIENT-PROVIDED CONTENT WARRANTY

If you provide me with logos, photographs, written content, or any other materials to incorporate into the design work, you represent and warrant that you own or have obtained all necessary rights, licenses, and permissions to use those materials, and that incorporating them into the design work will not infringe any third-party intellectual property rights. You agree to indemnify and hold me harmless from any claims, losses, or legal costs arising from your breach of this warranty.

## 13. CONFIDENTIALITY

I agree to keep confidential all non-public information you share with me in connection with this project — including business strategies, unreleased products, pricing, and competitive information — for a period of three (3) years from the date of this Agreement.

## 14. TERMINATION AND KILL FEE

Either party may terminate this Agreement with written notice. If you terminate after work has begun, you owe me: (a) payment for all work completed to date, at the pro-rated contract rate; and (b) a kill fee equal to twenty-five percent (25%) of the remaining unpaid contract balance. The kill fee compensates me for reserved capacity and foregone opportunities. Final files will be delivered only for phases that have been paid in full.

## 15. LATE PAYMENT PENALTIES

Balances not paid by the invoice due date will accrue interest at one and one-half percent (1.5%) per month on the outstanding amount. I reserve the right to withhold final file delivery until the account is paid in full and to pursue legal action for collection of overdue amounts, including attorney's fees.

## 16. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I am domiciled. Disputes shall be resolved in the courts of my state of domicile.

---

**Freelancer:** {{freelancer_name}} / {{freelancer_business}}
**Client:** {{client_name}} / {{client_company}}
**Project Start:** {{start_date}} | **Total Fee:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. COPYWRITER / CONTENT WRITER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'copywriter',
    label: 'Copywriter / Content Writer',
    description: 'For blog posts, web copy, email sequences, and content strategy.',
    icon: 'PencilLine',
    suggestedTitle: 'Copywriting Services Agreement',
    suggestedPaymentTerms: 'Net 14 — payment due within 14 days of invoice date upon delivery of each piece.',
    content: `# Copywriting Services Agreement

This Copywriting Services Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}} ("I," "me," or "the Freelancer"), and {{client_name}} of {{client_company}} ("you" or "the Client"). Both parties agree to the following terms governing the copywriting and content creation services described herein.

---

## 1. PARTIES AND PROJECT SCOPE

I, {{freelancer_name}}, agree to write and deliver the following content for you, {{client_name}} of {{client_company}}: {{project_description}}. The specific deliverables — including the number of pieces, content type, approximate word count per piece, and delivery schedule — are as described above. This Agreement is effective as of {{start_date}} with completion anticipated by {{end_date}}. The total fee for this project is {{currency}} {{rate}}, payable per {{payment_terms}}.

## 2. RESEARCH SCOPE

My fee includes research using publicly available sources — including industry publications, government sources, academic summaries, and other freely accessible reference materials. I will also incorporate information you provide directly. Research that is not included in the standard fee includes: commissioning original surveys or studies, purchasing proprietary industry reports, conducting interviews beyond what you facilitate, or any specialized research that requires paid access to proprietary databases or expert consultants. If specialized research is needed, we will agree on the scope and cost separately before I proceed.

## 3. REVISION ROUNDS

Each deliverable includes two (2) rounds of revisions. A revision round means one complete, consolidated set of feedback submitted in a single document or message — not a running series of individual changes made over multiple conversations. Revisions must stay within the original creative brief; significant changes to topic, audience, tone, or direction that amount to starting over will be treated as new work and invoiced separately. Revision requests must be submitted within seven (7) business days of delivery. Additional revision rounds beyond the two included are billed at my hourly rate.

## 4. ORIGINALITY AND PLAGIARISM WARRANTY

I warrant that all content I deliver under this Agreement is original work written by me, is not plagiarized from any source, does not infringe any third-party copyright or intellectual property rights, and has not been previously published or sold to any other party. I do not use AI-generated text as a substitute for my own writing unless we have explicitly agreed otherwise in writing. If you require that delivered content pass specific AI detection tools, you must state this requirement in writing before work begins, as it affects my process and timeline.

## 5. INDEMNIFICATION

You agree to indemnify, defend, and hold me harmless from and against any claims, damages, losses, liabilities, costs, and expenses — including reasonable attorney's fees — arising from: (a) factual claims, data, statistics, or instructions you have provided that are inaccurate, misleading, or defamatory; (b) your use of the delivered content in a manner not described in this Agreement; or (c) your failure to have the content reviewed by qualified legal, medical, financial, or regulatory counsel before publishing content that makes regulated claims. I am a writer, not a licensed attorney, doctor, financial advisor, or compliance officer, and nothing I write constitutes professional advice in any regulated field.

## 6. COPYRIGHT TRANSFER

Copyright in all content I create under this Agreement transfers to you upon receipt of full and final payment. Before I receive full payment, all copyright remains mine, and you have no right to publish, distribute, adapt, or otherwise use the content. After full payment, you own the content outright. I retain the right to keep a sample of the delivered work in my private portfolio unless you request confidentiality in writing at the time of signing. A portfolio sample is for my own reference and is not published publicly.

## 7. FACT-CHECKING RESPONSIBILITY

I write based on the information, facts, and data you provide to me, as well as publicly available sources. I use professional judgment in evaluating sources, but I am not a journalist, researcher, or subject-matter expert in your industry. You are solely responsible for reviewing all factual claims in the delivered content before publication and for ensuring that all statistics, quotes, product claims, and other factual statements are accurate and can be substantiated. I am not liable for inaccuracies that originate from information you have provided or that I have sourced in good faith from reputable public sources.

## 8. CONTENT APPROVAL AND PUBLICATION

Once I deliver content and you have approved it, you are responsible for all decisions about how, when, and where it is published. I am not responsible for how the content is edited after delivery, the context in which it is used, or any consequences arising from its publication. If you make significant changes to the delivered content after approval — including changes that alter its meaning, factual accuracy, or tone — my warranty in Section 4 no longer applies to the modified version.

## 9. CONFIDENTIALITY

I agree to keep confidential all non-public business information you share with me during this engagement, including but not limited to business strategies, target audience data, product roadmaps, pricing, competitive intelligence, and customer information. This obligation lasts for three (3) years from the date of this Agreement.

## 10. RUSH FEE

Projects that require delivery within three (3) business days of the date I receive a complete, final creative brief are considered rush projects. Rush projects incur an additional fee of twenty-five percent (25%) of the applicable project or piece fee. Rush availability is subject to my current workload and must be confirmed in writing before I begin.

## 11. KILL FEE

If you cancel this project after I have begun writing — meaning I have invested substantive time in research, outlining, or drafting — you owe me: (a) payment for all work I have completed and delivered to date; and (b) a kill fee of fifty percent (50%) of the remaining unpaid contract balance. The kill fee compensates me for time invested that cannot be recovered or repurposed.

## 12. LATE PAYMENT PENALTIES

Invoices not paid within the payment terms stated above will accrue a late fee of one and one-half percent (1.5%) per month on the outstanding balance. I reserve the right to suspend all work on your project until overdue invoices are paid in full. You agree to reimburse me for reasonable collection costs, including attorney's fees, if legal action is required.

## 13. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I reside. Any disputes arising under this Agreement shall be resolved in the courts of my state of residence.

---

**Freelancer:** {{freelancer_name}}
**Client:** {{client_name}} / {{client_company}}
**Project Start:** {{start_date}} | **Total Fee:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VIDEOGRAPHER / VIDEO EDITOR
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'videographer',
    label: 'Videographer / Video Editor',
    description: 'For event coverage, commercial videos, music videos, and branded content.',
    icon: 'VideoCamera',
    suggestedTitle: 'Videography Services Agreement',
    suggestedPaymentTerms: '50% deposit due before shoot date. Remaining 50% due upon delivery of final edited video.',
    content: `# Videography Services Agreement

This Videography Services Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}}, operating as {{freelancer_business}} ("I," "me," or "the Freelancer"), and {{client_name}} of {{client_company}} ("you" or "the Client"). Both parties agree to the following terms governing video production services.

---

## 1. PARTIES AND PROJECT DETAILS

I, {{freelancer_name}} of {{freelancer_business}}, agree to provide video production and editing services to you, {{client_name}} of {{client_company}}, as follows: {{project_description}}. The shoot is scheduled for {{start_date}}, with post-production and delivery anticipated by {{end_date}}. The total fee for this engagement is {{currency}} {{rate}}, payable per {{payment_terms}}.

## 2. PRE-PRODUCTION SCOPE

Pre-production services included in the contract price are limited to those specifically described in the project overview above. Unless explicitly included, the following are not covered: casting and talent sourcing, professional location scouting beyond basic remote reconnaissance, production design, prop sourcing, wardrobe styling, professional hair and makeup, custom music composition, scriptwriting beyond a basic outline, storyboarding, and permit acquisition. Permit fees — including location permits, FAA waivers for drone use, and any other government-issued permits — are always the client's responsibility regardless of who handles the application.

## 3. SHOOT DAY TERMS

The shoot will begin at the agreed call time and is scheduled to wrap at the agreed end time. If the shoot runs over the agreed wrap time due to circumstances within your control — including late starts, scope creep, subject unavailability, or requests to capture additional footage not in the original scope — overtime will be charged at my standard overtime rate per crew member, per hour or part thereof. I will notify you as soon as I anticipate an overtime situation so you can make an informed decision about whether to continue.

## 4. POST-PRODUCTION SCOPE

Post-production services included in my fee are: video editing and assembly, color grading to my standard style, basic sound mixing and audio cleanup, addition of title cards and lower thirds as specified in the project description, and licensed background music selected from my royalty-free music library. The following are not included in the standard fee and are available as quoted add-ons: custom motion graphics and animation, visual effects (VFX), closed captioning or subtitles, voiceover recording, additional language versions, social media format cuts beyond what is specified (e.g., vertical 9:16, square 1:1), and specialized editing effects not included in the original brief.

## 5. REVISION LIMIT

This Agreement includes two (2) rounds of revisions on the edited video. A revision round is one consolidated list of specific, time-coded changes submitted in a single communication. Revision requests must be submitted within seven (7) business days of each cut being delivered to you. If you require additional revision rounds beyond the two included, those are billed at my hourly rate. Changes to the fundamental structure, narrative, or scope of the edit beyond the original brief may be treated as a new project rather than a revision.

## 6. RAW FOOTAGE CLAUSE

Unedited raw footage — including all camera files, B-roll, and audio recordings captured during the shoot — is my property and is not included in any standard delivery. I will not deliver raw footage under the terms of this Agreement. If you require raw footage, this must be contracted in a separate written addendum at an additional fee. Even when raw footage is delivered, my editing assembly, color grades, and post-production assets remain mine. I am not obligated to retain raw footage beyond ninety (90) days following final project delivery.

## 7. MUSIC LICENSING

Any background music I include in the final video is sourced from a licensed royalty-free music library and is licensed for use within the specific video deliverable described in this Agreement, on the platforms specified. This license does not extend to: re-cutting the video with the same music, using the music as a standalone audio track, uploading the video to platforms not included in the original agreement, or any other use of the music beyond the delivered video. If you require music from a major commercial catalog, a custom sync license for broadcast, or a license with expanded platform rights, you are responsible for sourcing and paying for that license separately, or I can facilitate it as a quoted add-on.

## 8. DELIVERY FORMAT AND TIMELINE

The final video will be delivered in 1080p MP4 format (H.264 codec, unless otherwise specified) within fourteen (14) business days of your written final approval of the last revision round. Delivery will be via a file transfer service or cloud link. You are responsible for downloading and backing up all delivered files within thirty (30) days of the delivery notification. I am not obligated to re-deliver files after that period, though I may be able to do so at an archival retrieval fee.

## 9. CANCELLATION AND RESCHEDULING

The deposit paid to reserve the shoot date is non-refundable under all circumstances. If you request to reschedule the shoot more than seventy-two (72) hours before the scheduled date, I will make reasonable efforts to accommodate the new date subject to my availability, and your deposit will apply to the rescheduled date. If you reschedule within seventy-two (72) hours of the shoot, or fail to show up at the scheduled location and time, your deposit is forfeited and a new deposit is required to rebook.

## 10. FORCE MAJEURE AND WEATHER

For outdoor shoots, I will monitor weather conditions and communicate with you if conditions on the shoot day are expected to be problematic. If, in my professional judgment, weather conditions at the time of the shoot present a significant risk of equipment damage or will result in unusable footage — including heavy rain, lightning, extreme wind, or similar conditions — I reserve the right to postpone the shoot to a mutually agreed rescheduled date, with your deposit applied to the new date. Neither of us will be liable to the other for losses resulting from a weather-related postponement made in good faith.

## 11. EQUIPMENT LIABILITY

My camera equipment, audio gear, lighting, stabilizers, and accessories are to be operated exclusively by me and my crew. You, your employees, guests, and venue staff are not permitted to handle, operate, or direct the positioning of my equipment without my explicit permission. You are liable for any damage to my equipment caused by your breach of this clause, your employees or representatives, or your venue.

## 12. MODEL AND LOCATION RELEASES

You are solely responsible for: obtaining signed model releases from all identifiable individuals who appear on camera; obtaining location permits and written permission from property owners for any private property used in the shoot; and ensuring that no third-party intellectual property — including copyrighted artwork, branded signage, or music playing in the background — appears in the final video in a way that requires a separate license. I am not liable for claims arising from your failure to obtain necessary releases or permits.

## 13. DRONE AND AERIAL FOOTAGE

If aerial or drone footage is included in this project, all drone operations will be conducted in strict compliance with applicable FAA regulations, including Part 107 requirements. Drone footage is inherently weather-dependent and cannot be guaranteed if wind speed, precipitation, airspace restrictions, or other conditions make safe drone operation impossible on the shoot day. I will make every reasonable effort to capture agreed drone footage, but weather-related inability to fly does not constitute a breach of this Agreement, and no fee reduction will apply. Location-specific drone permits and restricted airspace authorizations are your responsibility unless we have separately agreed otherwise.

## 14. INTELLECTUAL PROPERTY

All video content, edits, color grades, and post-production work produced by me under this Agreement remains my intellectual property until full payment is received. Upon receipt of full and final payment, I assign to you all ownership rights in the final edited video deliverables. I retain the right to use clips, stills, and descriptions of this project in my portfolio, showreel, website, and marketing materials, unless you request confidentiality in writing at the time of signing.

## 15. LATE PAYMENT PENALTIES

Invoices not paid by their due date will accrue a late fee of one and one-half percent (1.5%) per month on the outstanding balance. I reserve the right to withhold delivery of final files until the account is paid in full and to pursue legal remedies for overdue balances.

## 16. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I operate my business. Disputes shall be resolved in the courts of my state of operation.

---

**Freelancer:** {{freelancer_name}} / {{freelancer_business}}
**Client:** {{client_name}} / {{client_company}}
**Shoot Date:** {{start_date}} | **Delivery By:** {{end_date}} | **Total Fee:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. SOCIAL MEDIA MANAGER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'social-media-manager',
    label: 'Social Media Manager',
    description: 'Monthly retainer for social media management, content, and scheduling.',
    icon: 'ChartBar',
    suggestedTitle: 'Social Media Management Agreement',
    suggestedPaymentTerms: 'Monthly retainer billed on the 1st of each month. Services pause if payment not received within 5 days.',
    content: `# Social Media Management Agreement

This Social Media Management Agreement ("Agreement") is entered into as of {{start_date}}, by and between {{freelancer_name}} ("I," "me," or "the Manager"), and {{client_name}} of {{client_company}} ("you" or "the Client"). Both parties agree to the following terms governing social media management services on a monthly retainer basis.

---

## 1. PARTIES AND SERVICES OVERVIEW

I, {{freelancer_name}}, agree to provide social media management services to you, {{client_name}} of {{client_company}}, beginning {{start_date}}. The services to be provided are as follows: {{project_description}}. The monthly retainer for these services is {{currency}} {{rate}} per month, payable per {{payment_terms}}.

## 2. SERVICES INCLUDED

The services covered by this Agreement are limited to those explicitly described in the project overview above. To be specific, my standard services include: creating and scheduling a defined number of posts per week across the specified social media platforms; writing captions, selecting or creating basic visual assets using approved brand templates, and scheduling posts using a social media management tool; preparing and submitting a monthly content calendar for your review; and providing a monthly performance report. Everything I do for you is described above or in the project overview — if it is not listed, it is not included.

## 3. SERVICES NOT INCLUDED

The following services are expressly excluded from this Agreement and are not covered by the retainer unless separately contracted and priced in a written addendum signed by both of us: paid advertising management of any kind, including Facebook Ads, Instagram Ads, TikTok Ads, Google Ads, or any other paid promotion; custom graphic design or illustration beyond basic branded templates; video production, filming, or professional video editing; influencer outreach, vetting, or relationship management; customer service responses or comment management on behalf of your brand; public relations, press outreach, or media pitching; and search engine optimization. If you ask me to perform any of these services, I will quote them separately.

## 4. PERFORMANCE DISCLAIMER

I need to be completely clear about this: I do not guarantee any specific results from social media management. Results including follower growth, engagement rate, reach, impressions, click-through rate, lead generation, and revenue attributable to social media activity are NOT guaranteed and are not promised by this Agreement. Social media platform algorithms change constantly and without notice. Audience behavior is unpredictable. Platform policy changes can dramatically affect organic reach. All of these factors are entirely outside my control, and no social media manager — regardless of skill or experience — can guarantee outcomes on platforms I do not own or control. What I guarantee is the quality and consistency of the services I perform: the content I create, the posting schedule I maintain, the strategy I develop, and the reporting I deliver. You agree that my deliverables are the services themselves — not follower counts, engagement metrics, or any other outcome. You agree not to hold me liable for any performance metric or business result attributable to social media activity.

## 5. CONTENT APPROVAL PROCESS

I will prepare and submit a content calendar for the upcoming month no later than five (5) business days before the start of that calendar month. You will have forty-eight (48) hours from the time I submit the content calendar to review it and provide feedback or approval in writing. If I do not receive a response within forty-eight (48) hours, the content calendar is deemed approved and I am authorized to schedule and publish the approved content on the planned dates. I will not be held responsible for delayed publishing, missed posting windows, or suboptimal posting times resulting from your failure to respond within the approval window.

## 6. CLIENT RESPONSIBILITIES

For me to do my job effectively, you agree to: provide me with complete brand guidelines, logo files, brand photography, and product information within five (5) business days of this Agreement's start date; promptly share information about upcoming promotions, launches, events, and announcements that are relevant to social media content; respond to my content calendar submissions within the forty-eight (48)-hour approval window; grant me authorized access to all required social media account dashboards, scheduling tools, and analytics platforms; and notify me immediately of any changes to your brand, messaging, or sensitive business circumstances that might affect what I post. Delays caused by your failure to fulfill these responsibilities — including delays in providing access, assets, information, or approvals — do not reduce or suspend your monthly retainer payment obligation.

## 7. PLATFORM ACCOUNT OWNERSHIP

All social media accounts I manage under this Agreement are and shall remain your property. I am acting as an authorized operator of your accounts — I have no ownership interest in your accounts, your followers, your audience, or your account history. Upon termination of this Agreement for any reason, I will immediately cease all posting and activity on your accounts and cooperate fully with any access revocation or admin removal you initiate.

## 8. CONTENT OWNERSHIP

All branded content I create and post on your behalf under this Agreement — including captions, graphics created from your templates, and written copy — becomes your property upon full payment of the monthly retainer for the period in which it was created. I retain ownership of the underlying content frameworks, editorial systems, scheduling templates, strategy documents, and processes I have developed independently. These tools and systems are part of my professional practice and are not transferred to you.

## 9. ADD-ONS AND OUT-OF-SCOPE WORK

If you request services outside the scope of this Agreement, I will provide a written quote before beginning any work. Out-of-scope work will not commence until you have approved the quote in writing. Add-on services are invoiced separately from the monthly retainer.

## 10. CONFIDENTIALITY AND NON-DISCLOSURE

I agree to keep strictly confidential all non-public information you share with me in connection with this engagement, including business strategies, marketing plans, audience data, customer information, unreleased products, financial information, and any other proprietary business information. I will not share this information with any third party without your written consent. This confidentiality obligation survives termination of this Agreement for three (3) years.

## 11. NON-COMPETE

During the term of this Agreement, I will not simultaneously provide social media management services to a business that is a direct competitor of yours. A "direct competitor" means a business that sells substantially the same products or services to the same target customer demographic in the same geographic market as you. If I am uncertain whether a prospective client constitutes a direct competitor, I will consult with you before accepting that engagement.

## 12. REPORTING AND ANALYTICS

By the fifth (5th) business day of each calendar month, I will deliver to you a written performance report covering the prior month's social media activity. The report will include: total posts published per platform, total reach and impressions, engagement rate and total engagements, follower count and net change, and any additional metrics available through each platform's native analytics. I will present this data objectively and provide context where appropriate.

## 13. PASSWORD AND ACCESS SECURITY

You are responsible for the security of all login credentials and access tokens shared with me. At the termination of this Agreement for any reason, you agree to promptly change all passwords, revoke all connected app authorizations, and remove me from all platform administrator roles. I will remind you to complete this offboarding when the termination is confirmed. I am not liable for any security incident, unauthorized access, or account compromise that occurs after you have been notified to complete offboarding.

## 14. TERMINATION AND OFFBOARDING

Either party may terminate this Agreement by providing thirty (30) days written notice to the other party. The monthly retainer for the notice period is due in full regardless of when within the month the termination takes effect. Upon termination, I will: deliver all content calendars, scheduled but unpublished post drafts, and brand asset files I have created; provide a written summary of active tools, connected accounts, and scheduled content; transfer all account admin access back to you; and cooperate fully with your transition to a new provider or in-house management. I will not delete, archive, or modify any account content, followers, or data during the offboarding process.

## 15. MONTHLY RETAINER AND LATE PAYMENT PENALTIES

The monthly retainer of {{currency}} {{rate}} is due on the first (1st) of each month for services to be performed during that month. If payment is not received within five (5) business days of the due date, I reserve the right to pause all services — including content scheduling, calendar preparation, and reporting — until the outstanding balance is paid. Paused months are not discounted; you owe the full retainer regardless of the service pause caused by non-payment. Overdue balances accrue a late fee of five percent (5%) of the monthly retainer for each week — or part thereof — that payment remains outstanding.

## 16. GOVERNING LAW

This Agreement is governed by the laws of the United States and the state in which I reside and operate. Any disputes arising under this Agreement shall be resolved in the courts of my state of operation.

---

**Manager:** {{freelancer_name}}
**Client:** {{client_name}} / {{client_company}}
**Agreement Start:** {{start_date}} | **Monthly Retainer:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. BLANK
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'blank',
    label: 'Start from Scratch',
    description: 'Blank contract — write your own clauses from the ground up.',
    icon: 'FileText',
    suggestedTitle: 'Freelance Services Agreement',
    suggestedPaymentTerms: 'Net 30 — payment due within 30 days of invoice date.',
    content: '',
  },
]
