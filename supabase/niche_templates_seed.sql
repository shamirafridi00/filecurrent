-- Niche-specific contract templates seed
-- Run this in the Supabase SQL Editor AFTER migrations.sql
-- Uses dollar-quoting so apostrophes in contract prose don't need escaping.
-- ON CONFLICT DO NOTHING makes this idempotent — safe to re-run.

DO $outer$
BEGIN

-- ── 1. Web Designer / Web Developer ──────────────────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  'web_developer',
  'Web Design & Development Agreement (Full)',
  'Comprehensive contract for website design and development projects. Covers scope, milestones, IP, revisions, kill fee, and more.',
  $content$# Website Design & Development Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Designer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). The parties agree to the following terms and conditions governing the design and development services described herein.

---

## 1. Project Scope and Deliverables

The Designer agrees to design and develop a website for the Client as described in this Agreement. The specific deliverables for this project are as follows: {{project_description}}. The scope of work is limited exclusively to the deliverables listed above. The following are expressly excluded from this Agreement unless separately contracted in writing: search engine optimization (SEO) beyond basic on-page meta tags, copywriting or content creation, logo design or brand identity work, e-commerce functionality beyond what is specified, mobile application development, and any integrations not explicitly listed. Any work outside the agreed scope constitutes a change order and is subject to separate pricing and written approval.

## 2. Milestone-Based Payment Schedule

The total contract value is {{currency}} {{rate}}, payable as follows: (a) a non-refundable deposit of fifty percent (50%) is due upon execution of this Agreement and before any work begins; (b) twenty-five percent (25%) is due upon the Client's written approval of the design mockups; and (c) the remaining twenty-five percent (25%) is due upon delivery of the completed website files or launch, whichever occurs first. The Designer shall not be obligated to proceed to the next milestone until the corresponding payment has cleared. Payment terms are {{payment_terms}}.

## 3. Scope Changes and Change Orders

Any additions to, deletions from, or modifications of the agreed project scope — including changes to functionality, design direction, number of pages, or feature set — must be documented in a written Change Order signed by both parties before work on the change commences. Verbal agreements, emails, text messages, or other informal communications do not constitute authorization for scope changes. Change Orders will be priced at the Designer's current hourly rate or at a mutually agreed fixed price, and the project timeline will be adjusted accordingly. The Designer reserves the right to decline scope changes that would materially alter the nature of the project.

## 4. Third-Party Costs

The quoted contract price does not include third-party costs. The Client is solely responsible for all fees associated with: web hosting and domain registration, content management system (CMS) licenses or plugin fees, stock photography, icons, fonts, or other licensed assets, third-party API subscriptions, SSL certificates, and any other external services required for the project. The Designer will inform the Client of any anticipated third-party costs before incurring them on the Client's behalf. If the Designer pays for third-party services on the Client's behalf, the Client agrees to reimburse the Designer within seven (7) business days of invoice.

## 5. Browser and Device Compatibility

The Designer will test and optimize the website for the following browsers and environments: the latest two major versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge, on both desktop and mobile viewports. The Designer does not warrant compatibility with older browser versions, legacy Internet Explorer versions, or non-standard browsers. Minor rendering differences between browsers are inherent to web development and do not constitute defects.

## 6. Content Provision Deadline

The Client agrees to provide all necessary content — including written copy, images, logos, brand assets, and any other materials required for the project — within fourteen (14) calendar days of the Agreement start date, or as otherwise agreed in writing. If the Client fails to provide required content by the agreed deadline, the project timeline will be extended by a period equal to the delay, and the Designer reserves the right to invoice for idle time exceeding five (5) business days.

## 7. Revision Policy

This Agreement includes two (2) rounds of revisions per major deliverable. A revision round is defined as one consolidated set of changes submitted by the Client at one time. Additional revision rounds will be billed at the Designer's hourly rate. Revision requests must be submitted within seven (7) business days of each deliverable being presented.

## 8. Intellectual Property Transfer

All original design work, code, and deliverables remain the intellectual property of the Designer until full payment has been received. Upon receipt of final payment in full, the Designer assigns to the Client all ownership rights, including copyright, in the final deliverables specifically created for this project. Pre-existing tools, frameworks, libraries, and development methodologies remain the Designer's property.

## 9. Designer Portfolio Rights

The Designer retains the perpetual, irrevocable right to display the completed work — including screenshots, mockups, and project descriptions — in the Designer's portfolio, case studies, website, social media profiles, and award submissions. If the Client requires confidentiality, this must be requested in writing at signing, and a separate confidentiality fee will be negotiated.

## 10. Confidentiality

Each party agrees to keep confidential all non-public information received from the other party in connection with this project. This obligation survives termination for three (3) years.

## 11. Hosting and Maintenance Disclaimer

This Agreement covers design and development only. Ongoing maintenance, security monitoring, software updates, content updates, and technical support are not included and require a separate agreement.

## 12. Termination and Kill Fee

Either party may terminate this Agreement upon fourteen (14) days written notice. If the Client terminates for any reason other than the Designer's material breach, the Client agrees to pay: (a) all fees for work completed to the date of termination; and (b) a kill fee equal to twenty-five percent (25%) of the remaining unpaid contract balance.

## 13. Late Payment Penalties

Invoices not paid within the due date shall accrue interest at 1.5% per month (18% per annum). The Designer reserves the right to suspend all work and withhold deliverables until the account is current.

## 14. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE]. Disputes shall be resolved in the state or federal courts located in [COUNTY], [STATE].

---

**Designer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Project Start:** {{start_date}} | **End:** {{end_date}} | **Value:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ── 2. Photographer (General / Commercial) ───────────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  'photographer',
  'Photography Services Agreement (Full)',
  'Comprehensive photography contract covering copyright, usage rights, raw files, cancellation, and model releases.',
  $content$# Photography Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Photographer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs all photography services described below.

---

## 1. Session Details

The Photographer agrees to provide photography services as follows: {{project_description}}. The session is scheduled for {{start_date}} through {{end_date}}. The final edited image count is an estimate and may vary based on session conditions, subject matter, and the Photographer's editorial judgment.

## 2. Compensation

The total fee is {{currency}} {{rate}}, payable as follows: {{payment_terms}}. The deposit is non-refundable and required to reserve the session date. No date is confirmed until the deposit is received.

## 3. Copyright Ownership

The Photographer is and shall remain the sole author and copyright owner of all photographs produced under this Agreement, pursuant to the United States Copyright Act (17 U.S.C. § 101 et seq.). The Client does not acquire ownership rights in the photographs. The Client receives only the limited license described below.

## 4. Usage Rights and License

Upon receipt of full payment, the Photographer grants the Client a non-exclusive, non-transferable license to use the delivered photographs for the following purposes: {{project_description}}. Commercial use beyond the licensed scope, print publication, advertising, resale, or sublicensing requires a separate written license and additional fees.

## 5. Model and Property Releases

The Client is solely responsible for obtaining signed model releases from all identifiable persons appearing in the photographs, and property releases for identifiable private property, before the session date. The Client agrees to indemnify and hold the Photographer harmless from any claims arising from the failure to obtain required releases.

## 6. Post-Processing and Editing

Standard post-processing includes color correction, exposure adjustment, and basic retouching. The following are not included and are available as add-ons: heavy skin retouching, body modification, background removal, compositing, and object removal. The Photographer applies professional editorial judgment to all editing decisions.

## 7. Aesthetic Disclaimer

By signing this Agreement, the Client confirms familiarity with and approval of the Photographer's style as represented in the portfolio. Dissatisfaction with artistic style, editing style, or creative choices is not grounds for a refund, re-shoot, or fee reduction.

## 8. Raw Files Not Included

Unedited raw or source files are the exclusive property of the Photographer and will not be delivered unless explicitly contracted in a separate written addendum at an additional fee.

## 9. Image Delivery Timeline

Final edited images will be delivered within the timeframe specified in the project description above, measured in business days from the session date (or final payment, whichever is later). The Client is responsible for downloading and backing up all images within thirty (30) days of delivery notification.

## 10. Cancellation and Rescheduling Policy

The deposit is non-refundable under all circumstances. Rescheduling more than seventy-two (72) hours before the session will be accommodated subject to availability, with the deposit applied. Rescheduling within seventy-two (72) hours forfeits the deposit and requires a new deposit to rebook.

## 11. Incapacitation Backup Clause

If the Photographer is unable to perform due to illness or emergency, the Photographer will make reasonable good-faith efforts to arrange a qualified substitute. If no substitute can be found, the Photographer's liability is limited to a full refund of all amounts paid.

## 12. Non-Disparagement

Each party agrees not to publicly defame, disparage, or make false statements about the other party or their work in any medium.

## 13. Equipment Liability

The Photographer is not responsible for equipment damage arising from hazardous conditions, outdoor environments, or client-directed activities. The Photographer reserves the right to decline placing equipment in conditions that create unreasonable risk of damage.

## 14. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes shall be subject to the jurisdiction of the courts in [COUNTY], [STATE].

---

**Photographer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Session Date:** {{start_date}} | **Value:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ── 3. Wedding Photographer ───────────────────────────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  'photographer',
  'Wedding Photography Agreement (Full)',
  'Full-day wedding photography contract with non-refundable retainer, tiered cancellation policy, exclusivity, and gallery delivery terms.',
  $content$# Wedding Photography Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Photographer") and {{client_name}} (hereinafter "the Client" or "the Couple"). The parties agree to the following terms governing wedding photography services.

---

## 1. Event Details

The Photographer is engaged to provide photography coverage for the wedding event as follows: {{project_description}}. The wedding is scheduled for {{start_date}}. Coverage begins at the agreed call time and concludes at the agreed wrap time. Ceremony and reception locations will be confirmed no later than thirty (30) days before the wedding date.

## 2. Non-Refundable Retainer

A retainer equal to thirty percent (30%) of the total contract price is due upon execution of this Agreement. This retainer is NON-REFUNDABLE under all circumstances, including cancellation by the Client, postponement, illness, or any event beyond either party's control. The retainer represents the Photographer's reservation of the wedding date, forgoing all other bookings. Total contract value: {{currency}} {{rate}}. Payment terms: {{payment_terms}}.

## 3. Payment Schedule

The remaining balance is due no later than thirty (30) days before the wedding date. Failure to remit the balance by this deadline may result in the Photographer treating the booking as cancelled, in which case the retainer is forfeited.

## 4. Exclusive Photographer Clause

The Photographer is engaged as the exclusive professional photographer for the wedding event. The Client agrees not to hire any other professional photographers or videographers without prior written consent. Guests are welcome to take casual photographs, but the Client agrees to ask guests not to obstruct the Photographer during the ceremony and formal portrait sessions.

## 5. Force Majeure

Neither party is liable for failure to perform due to events beyond reasonable control, including acts of God, extreme weather, natural disasters, pandemics, government restrictions, venue closure, serious illness or injury, or immediate family emergency. If the Photographer cannot perform due to a qualifying force majeure event, the Photographer's liability is limited to a full refund of all amounts paid (the retainer is non-refundable only if the Client cancels due to a force majeure event).

## 6. Second Shooter

If a second photographer is included in the contracted package, their role is supplemental coverage. The Photographer reserves the right to substitute the second shooter with a comparably qualified photographer. The second shooter is contracted by and reports to the Photographer.

## 7. Meal and Break Policy

If coverage extends beyond six (6) consecutive hours, the Client agrees to provide a hot vendor meal for the Photographer and second shooter during a natural break in coverage, typically during dinner service. The Photographer is entitled to a minimum thirty (30)-minute uninterrupted break during events exceeding six (6) hours.

## 8. Safety and Harassment Policy

The Photographer reserves the right to immediately cease services and leave the event without refund if subjected to physical violence, credible threats, sustained harassment, or verbal abuse from the Client, wedding party, guests, venue staff, or any other person at the event.

## 9. Timeline Cooperation

The Client agrees to provide a detailed wedding day timeline no later than fourteen (14) days before the wedding. The Photographer is not responsible for missing moments caused by delays attributable to the Client, wedding party, venue, or other vendors outside the Photographer's control.

## 10. Editing Style and Expectations

Delivered photographs will reflect the Photographer's established portfolio style. Specific requests — including heavy retouching, body modification, or background replacement — are available as add-ons. The Client may not request conversion of color images to black and white after gallery delivery.

## 11. Image Delivery Timeline

The completed online gallery will be delivered within eight (8) to twelve (12) weeks of the wedding date.

## 12. Online Gallery Access

The gallery will be accessible for ninety (90) days from delivery. The Client is responsible for downloading all images within this period. Re-uploading expired galleries may incur an additional fee.

## 13. Cancellation Policy

Cancellation fees: (a) more than six (6) months before the wedding — retainer forfeited only; (b) three (3) to six (6) months before — fifty percent (50%) of total contract value forfeited; (c) within three (3) months — one hundred percent (100%) of total contract value forfeited.

## 14. Postponement Policy

One complimentary date change is available if the Photographer is available on the new date and written notice is provided at least sixty (60) days before the original date. If the Photographer is unavailable on the new date, the postponement is treated as a cancellation.

## 15. Venue Access

The Client is responsible for ensuring the Photographer has full, unrestricted access to all ceremony and reception venues at the contracted times. Venue photography restrictions must be communicated in writing no later than fourteen (14) days before the wedding.

## 16. Social Media and Marketing

The Photographer reserves the right to post selected images on social media, website, blog, and marketing materials. Clients wishing to opt out must submit a written request at the time of signing.

## 17. Backup Equipment

The Photographer carries professional-grade backup camera bodies, lenses, memory cards, and batteries. All memory cards are duplicated as soon as reasonably possible after the event.

## 18. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes shall be submitted to binding arbitration in [COUNTY], [STATE].

---

**Photographer:** {{freelancer_name}} ({{freelancer_business}})
**Client(s):** {{client_name}}
**Wedding Date:** {{start_date}} | **Value:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ── 4. Graphic Designer ───────────────────────────────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  'designer',
  'Graphic Design Services Agreement (Full)',
  'Full graphic design contract covering revisions, concept presentation, IP transfer, file formats, print disclaimer, and kill fee.',
  $content$# Graphic Design Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Designer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the graphic design services described herein.

---

## 1. Project Scope and Deliverables

The Designer agrees to create and deliver the following design work: {{project_description}}. Final files will be delivered in the formats specified in Section 5. Any deliverable not explicitly listed is outside the scope of this Agreement and will require a written change order.

## 2. Revision Policy

This Agreement includes three (3) rounds of revisions per deliverable. A revision round is one complete, consolidated set of changes submitted in a single document or message. Piecemeal revision requests submitted across multiple messages will be treated as multiple revision rounds. Additional rounds will be billed at the Designer's hourly rate. Revision requests must be submitted within seven (7) business days of each deliverable being presented.

## 3. Approval Deadline and Deemed Approval

The Client has five (5) business days to review and respond to each deliverable. If the Client does not provide written feedback or approval within five (5) business days, the deliverable shall be deemed approved and the Designer may proceed to the next phase.

## 4. Concept Presentation

The Designer will present two (2) initial design concepts. The Client will select one (1) direction to develop. Non-selected concepts are not carried forward.

## 5. File Delivery Formats

Final files will be delivered in PNG (high-resolution), PDF (print-ready), and SVG (vector). Layered source files (Adobe Illustrator .ai, Photoshop .PSD) are delivered only upon full payment, and only if source file delivery was explicitly included in the agreed scope.

## 6. Payment Structure

Total contract value: {{currency}} {{rate}}, payable as follows: {{payment_terms}}. The deposit is non-refundable and required before any design work commences.

## 7. Intellectual Property Transfer

All deliverables remain the intellectual property of the Designer until full payment is received. Upon receipt of full payment, the Designer assigns to the Client all copyright and ownership rights in the final approved deliverables only. Preliminary concepts, unused design directions, and the Designer's pre-existing tools remain the Designer's property.

## 8. Exclusivity and Non-Resale

The Designer will not sell or license the final approved design to any direct competitor of the Client in the same primary industry for a period of two (2) years following project completion.

## 9. Portfolio and Self-Promotion Rights

The Designer retains the perpetual right to display final deliverables, mockups, and case study descriptions in the portfolio, website, social media, and award submissions. If the Client requires confidentiality, this must be requested in writing at signing and a confidentiality fee will be negotiated.

## 10. Print and Production Disclaimer

Colors in delivered files are specified to industry standards. However, printed output may vary from on-screen appearance due to differences in displays and printing devices. The Client is solely responsible for approving physical proofs before any production run. The Designer is not liable for print errors or color variation after proof approval.

## 11. Client-Provided Materials

The Client warrants that they own or have rights to all logos, images, and text provided to the Designer. The Client agrees to indemnify and hold the Designer harmless from any intellectual property claims arising from client-provided materials.

## 12. Confidentiality

The Designer agrees to keep confidential all non-public information disclosed by the Client during this project for a period of three (3) years following project completion.

## 13. Termination and Kill Fee

If the Client terminates for any reason other than the Designer's material breach, the Client agrees to pay: (a) fees for work completed to date; and (b) a kill fee of twenty-five percent (25%) of the remaining contract balance.

## 14. Late Payment Penalties

Balances not paid by invoice due date accrue interest at 1.5% per month (18% per annum). The Designer reserves the right to withhold final file delivery until paid in full.

## 15. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes shall be resolved by binding arbitration in [COUNTY], [STATE].

---

**Designer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Project Start:** {{start_date}} | **Value:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ── 5. Copywriter / Content Writer ───────────────────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  'copywriter',
  'Copywriting & Content Services Agreement (Full)',
  'Full copywriting contract with originality warranty, indemnification, revision policy, rush fees, and competitive exclusivity.',
  $content$# Copywriting & Content Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (hereinafter "the Copywriter") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the copywriting and content creation services described herein.

---

## 1. Project Scope and Deliverables

The Copywriter agrees to produce the following written content: {{project_description}}. Deliverables are as specified above, including number of pieces, approximate word counts, and content types. Additional pieces, significant word count overages, or new content types constitute out-of-scope work requiring a written addendum.

## 2. Research Scope

The Copywriter will conduct research using publicly available sources. The Client is responsible for providing: proprietary data and internal reports, subject matter expert access (if required), specific statistics and claims, brand voice guidelines, target audience profiles, and other confidential company information. Research beyond publicly available sources is available as a billable add-on.

## 3. Revision Policy

Each deliverable includes two (2) rounds of revisions. A revision round is one complete, consolidated set of changes communicated in a single document. Revisions must stay within the original creative brief — requests amounting to a complete restart will be treated as new work. Additional rounds are billed at the Copywriter's hourly rate. Revision requests must be submitted within seven (7) business days of delivery.

## 4. Originality and Plagiarism Warranty

The Copywriter warrants that all content delivered under this Agreement: (a) is wholly original and not plagiarized; (b) does not infringe any third-party intellectual property rights; and (c) has not been previously published or sold to another party. If AI detection compliance is required, this must be specified in writing at the time of signing.

## 5. Indemnification

The Client agrees to indemnify, defend, and hold harmless the Copywriter from all claims, damages, and expenses — including attorney's fees — arising from: (a) inaccurate, misleading, or defamatory information provided by the Client; (b) the Client's use of content in a manner not contemplated by this Agreement; or (c) the Client's failure to obtain required legal review before publishing regulated content. The Copywriter is not a licensed attorney, financial advisor, or medical professional, and no content constitutes professional advice.

## 6. Copyright and Ownership

Copyright in all delivered content vests in the Client upon receipt of full payment. Before full payment, all copyright remains with the Copywriter. The Copywriter retains the right to retain portfolio samples unless the Client has requested confidentiality in writing.

## 7. Confidentiality

The Copywriter agrees to keep confidential all non-public information disclosed by the Client — including strategies, audience data, proprietary processes, and financial information — for three (3) years following project completion.

## 8. Content Approval and Client Responsibility

The Client is solely responsible for reviewing all delivered content for legal compliance, factual accuracy, and suitability for publication. The Copywriter is not responsible for how content is edited, used, or distributed after delivery. The Client bears full responsibility for ensuring published content complies with applicable laws and regulations.

## 9. Fact-Checking Responsibility

The Copywriter writes based on information provided by the Client or publicly available references. The Client is responsible for reviewing all factual claims before publication. The Copywriter is not liable for inaccuracies arising from incorrect or incomplete information provided by the Client.

## 10. Payment Terms

Total contract value: {{currency}} {{rate}}, payable as follows: {{payment_terms}}. Content deliverables will be withheld until payment has been received for each invoice cycle.

## 11. Rush Fee

Projects requiring delivery within fewer than five (5) business days of the signed Agreement and complete brief are subject to a rush surcharge of twenty-five percent (25%) of the applicable fee. Rush delivery is subject to availability and must be confirmed in writing.

## 12. Competitive Exclusivity

During the term of this Agreement, the Copywriter will not write content for a direct competitor of the Client in the same primary product or service category, unless the Client explicitly waives this restriction in writing.

## 13. Kill Fee and Cancellation

If the Client cancels after work has begun, the Client agrees to pay: (a) fees for all work completed and delivered to date; and (b) a kill fee of twenty-five percent (25%) of the remaining contract balance.

## 14. Late Payment

Invoices not paid by the due date accrue interest at 1.5% per month. The Copywriter reserves the right to suspend all work until overdue invoices are paid.

## 15. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes shall be resolved by binding arbitration in [COUNTY], [STATE].

---

**Copywriter:** {{freelancer_name}}
**Client:** {{client_name}} ({{client_company}})
**Project Start:** {{start_date}} | **Value:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ── 6. Videographer / Video Editor ───────────────────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  NULL,
  'Video Production Services Agreement (Full)',
  'Comprehensive videography contract covering pre-production, shoot day terms, post-production, raw footage, music licensing, and drone use.',
  $content$# Video Production Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Videographer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the video production and editing services described herein.

---

## 1. Project Details

The Videographer agrees to provide video production services as follows: {{project_description}}. The project is scheduled for {{start_date}} through {{end_date}}. Changes to scope, shoot date, location, or deliverables require a written amendment.

## 2. Pre-Production Scope

Pre-production included in the contract price is as specified in the project description. NOT included unless separately contracted: casting, professional location scouting, production design, prop sourcing, wardrobe styling, hair and makeup, custom music composition, scriptwriting beyond basic outline guidance, and permit acquisition (permit fees are always the Client's responsibility).

## 3. Shoot Day Terms

The shoot begins at the agreed call time and wraps at the agreed wrap time. If the shoot runs over due to Client-caused delays or scope expansion, overtime will be billed per crew member at the agreed overtime rate, invoiced separately.

## 4. Post-Production Scope

Included in the contract price: video editing and assembly, color grading, basic sound mixing and audio cleanup, title cards and lower thirds as specified, and licensed royalty-free background music. NOT included unless separately contracted: custom motion graphics, VFX, subtitles or closed captioning, voiceover recording, additional language versions, additional social media format cuts beyond what is specified, and specialized effects not included in the brief.

## 5. Revision Policy

This Agreement includes two (2) rounds of revisions on the edited video. A revision round is one complete, consolidated list of changes submitted with timecode references. Additional rounds are billed at the Videographer's hourly rate. Revision requests must be submitted within seven (7) business days of each cut being delivered.

## 6. Raw Footage

Unedited raw footage remains the property of the Videographer and is not included in standard delivery. Raw footage will not be delivered unless explicitly contracted in a written addendum at an additional fee. The Videographer is not obligated to retain raw footage beyond ninety (90) days following final project delivery.

## 7. Music Licensing

All background music is sourced from a royalty-free library and licensed for use within the specific deliverable described in this Agreement. This license does not extend to re-editing the video, uploading to platforms not specified, or using the music separately. If the Client requires a specific sync license or music from a major catalog, the Client must provide licensed music or pay for the appropriate license separately.

## 8. Delivery Format and Timeline

The final video will be delivered in 1080p MP4 format within the timeframe specified in the project description, measured from the date of final written approval. The Client is responsible for downloading and backing up all files within thirty (30) days of delivery.

## 9. Cancellation and Rescheduling

The deposit is non-refundable under all circumstances. Rescheduling more than seventy-two (72) hours before the shoot will be accommodated subject to availability, with the deposit applied. Rescheduling within seventy-two (72) hours forfeits the deposit.

## 10. Force Majeure and Outdoor Weather

For outdoor shoots, if weather conditions at the time of the shoot are — in the Videographer's professional judgment — likely to damage equipment or produce unusable footage, the Videographer reserves the right to postpone to a mutually agreed rescheduled date.

## 11. Equipment Handling

The Videographer's equipment is to be operated exclusively by the Videographer and crew. The Client and other parties are not permitted to handle or direct the handling of equipment. The Client is liable for equipment damage caused by the Client's breach of this provision.

## 12. Model and Location Releases

The Client is solely responsible for obtaining model releases from all identifiable persons in the video, location permits, and all required permissions. The Client agrees to indemnify and hold the Videographer harmless from claims arising from the failure to obtain required releases or permits.

## 13. Intellectual Property

All video content remains the Videographer's property until full payment is received. Upon full payment, the Videographer assigns to the Client all ownership rights in the final edited deliverables. The Videographer retains portfolio and reel rights.

## 14. Drone and Aerial Footage

If included, all drone operations comply with applicable FAA regulations. Drone footage is weather-dependent and cannot be guaranteed if conditions make safe operation impossible. Location-specific drone permits are the Client's responsibility.

## 15. Late Payment Penalties

Invoices not paid by their due date accrue interest at 1.5% per month. The Videographer reserves the right to withhold delivery of final files until the account is paid in full.

## 16. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes shall be resolved by binding arbitration in [COUNTY], [STATE].

---

**Videographer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Project Dates:** {{start_date}} – {{end_date}} | **Value:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ── 7. Social Media Manager / Marketing Consultant ────────────────────────
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global)
VALUES (
  NULL,
  'marketer',
  'Social Media Management Agreement (Full)',
  'Monthly retainer contract for social media management with performance disclaimer, content approval workflow, and termination/offboarding terms.',
  $content$# Social Media Management Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (hereinafter "the Manager") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs social media management services on a monthly retainer basis.

---

## 1. Scope of Services

The Manager agrees to provide the following social media management services: {{project_description}}. Services are limited to those explicitly described above. The following are expressly NOT included unless separately contracted in writing: paid advertising management (Facebook Ads, Instagram Ads, Google Ads, TikTok Ads, or any other paid media); custom graphic design or illustration beyond basic branded templates; video production, filming, or editing; influencer outreach or management; customer service or inbox and comment management; public relations or press outreach; and search engine optimization (SEO). Out-of-scope requests will be quoted and billed separately.

## 2. Performance Disclaimer — NON-NEGOTIABLE

THE MANAGER MAKES NO REPRESENTATIONS, WARRANTIES, OR GUARANTEES REGARDING PERFORMANCE RESULTS OF ANY SOCIAL MEDIA ACTIVITIES UNDER THIS AGREEMENT. Specific outcomes — including follower count growth, engagement rate, reach, impressions, website traffic, lead generation, conversion rates, or revenue — are NOT guaranteed and are not the basis of this Agreement. Social media platform algorithms, audience behavior, platform policy changes, market conditions, and competitive factors are entirely outside the Manager's control. The Manager's obligation is to deliver the specified services with professional skill and care. The Manager is NOT responsible for outcomes contingent on factors beyond the Manager's control.

## 3. Content Approval Process

The Manager will prepare and submit a content calendar for the upcoming calendar month no later than the fifth (5th) business day of the current month. The Client has three (3) business days to review and respond. If the Client does not respond within three (3) business days, the content calendar shall be deemed approved and the Manager is authorized to schedule and publish the approved content. The Manager will not be held responsible for delays caused by the Client's failure to respond within the review window.

## 4. Client Responsibilities

The Client agrees to: (a) provide brand guidelines, logo files, product images, and brand assets within five (5) business days of the Agreement start date; (b) provide timely information about promotions, events, and product launches; (c) respond to content calendar submissions within the three (3)-business-day window; (d) grant authorized access to all required social media account dashboards and scheduling tools; and (e) promptly notify the Manager of any brand or messaging changes. Delays caused by the Client's failure to fulfill these responsibilities do not reduce or excuse the monthly retainer payment obligation.

## 5. Platform Account Ownership

All social media accounts managed under this Agreement are and shall remain the sole property of the Client. The Manager acts as an authorized operator only. Upon termination, the Manager will immediately cease posting and cooperate fully with access revocation.

## 6. Content Ownership

All branded content created and published on behalf of the Client becomes the Client's property upon full payment of the monthly retainer for the period in which it was created. The Manager retains ownership of content frameworks, editorial strategies, scheduling systems, content calendar formats, and general methodologies. These underlying systems are not transferred to the Client.

## 7. Add-Ons and Out-of-Scope Work

Out-of-scope requests will be scoped and priced separately. Out-of-scope work will not begin until the Client has approved a written quote and, where applicable, paid a deposit.

## 8. Confidentiality and Non-Disclosure

The Manager agrees to keep confidential all non-public information disclosed by the Client — including business strategies, marketing plans, target audience data, customer lists, financial performance data, and proprietary information — for three (3) years following termination of this Agreement.

## 9. Non-Compete

During the term of this Agreement, the Manager will not simultaneously provide social media management services to a direct competitor of the Client in the same primary product or service category and target market.

## 10. Reporting and Analytics

The Manager will provide a monthly performance report within five (5) business days of the end of each calendar month. The report will include: total posts published, reach and impressions, engagement rate and total engagements, follower count and net follower change, and any other metrics agreed upon in the project description.

## 11. Password and Access Security

Upon termination of this Agreement for any reason, the Client agrees to promptly change all passwords, revoke all third-party application access, and remove the Manager from all platform admin roles. The Manager is not liable for security incidents after the Client has been notified that offboarding is required.

## 12. Termination and Offboarding

Either party may terminate by providing thirty (30) days written notice. The monthly retainer for the notice month is due in full. Upon termination, the Manager will deliver all content calendars, scheduled post drafts, and asset files; provide a record of all account logins and connected tools; and cooperate fully with the transition.

## 13. Monthly Retainer and Payment

The monthly retainer is {{currency}} {{rate}} per month, due on the first (1st) of each month. Payment terms: {{payment_terms}}. If payment is not received within five (5) business days of the due date, the Manager reserves the right to pause all services until the account is current.

## 14. Late Payment Penalties

Retainer payments not received by the fifth (5th) business day of the month will accrue a late fee of five percent (5%) of the monthly retainer per week (or part thereof) of delay. The Manager reserves the right to suspend services and pursue legal remedies for overdue balances.

## 15. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes shall be resolved by binding arbitration in [COUNTY], [STATE].

---

**Manager:** {{freelancer_name}}
**Client:** {{client_name}} ({{client_company}})
**Agreement Start:** {{start_date}} | **Monthly Retainer:** {{currency}} {{rate}}$content$,
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;

END;
$outer$;
