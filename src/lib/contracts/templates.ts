// Niche-specific contract templates for FileCurrent.
// Each template is full professional US-compliant contract prose, not a skeleton.
// Variables use {{variable_name}} syntax matched to the app's resolver.

export type ContractNiche =
  | 'web-designer'
  | 'photographer'
  | 'wedding-photographer'
  | 'graphic-designer'
  | 'copywriter'
  | 'videographer'
  | 'social-media-manager'

export interface NicheContractTemplate {
  id: ContractNiche
  label: string
  description: string
  icon: string
  suggestedPaymentTerms: string
  suggestedTitle: string
  content: string
}

export const NICHE_CONTRACT_TEMPLATES: NicheContractTemplate[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. WEB DESIGNER / WEB DEVELOPER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'web-designer',
    label: 'Web Designer / Developer',
    description: 'For website builds, redesigns, and web app development projects.',
    icon: 'Monitor',
    suggestedPaymentTerms: '50% deposit due at project start, 25% at design approval, 25% upon final delivery',
    suggestedTitle: 'Website Design & Development Agreement',
    content: `# Website Design & Development Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Designer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). The parties agree to the following terms and conditions governing the design and development services described herein.

---

## 1. Project Scope and Deliverables

The Designer agrees to design and develop a website for the Client as described in this Agreement. The specific deliverables for this project are as follows: {{project_description}}. The scope of work is limited exclusively to the deliverables listed above. The following are expressly excluded from this Agreement unless separately contracted in writing: search engine optimization (SEO) beyond basic on-page meta tags, copywriting or content creation, logo design or brand identity work, e-commerce functionality beyond what is specified, mobile application development, and any integrations not explicitly listed. Any work outside the agreed scope constitutes a change order and is subject to separate pricing and written approval.

## 2. Milestone-Based Payment Schedule

The total contract value is {{currency}} {{rate}}, payable as follows: (a) a non-refundable deposit of fifty percent (50%), equal to {{currency}} {{rate}} × 50%, is due upon execution of this Agreement and before any work begins; (b) twenty-five percent (25%) is due upon the Client's written approval of the design mockups; and (c) the remaining twenty-five percent (25%) is due upon delivery of the completed website files or launch, whichever occurs first. The Designer shall not be obligated to proceed to the next milestone until the corresponding payment has cleared. Payment terms are {{payment_terms}}.

## 3. Scope Changes and Change Orders

Any additions to, deletions from, or modifications of the agreed project scope — including changes to functionality, design direction, number of pages, or feature set — must be documented in a written Change Order signed by both parties before work on the change commences. Verbal agreements, emails, text messages, or other informal communications do not constitute authorization for scope changes. Change Orders will be priced at the Designer's current hourly rate of $[HOURLY_RATE] per hour or at a mutually agreed fixed price, and the project timeline will be adjusted accordingly. The Designer reserves the right to decline scope changes that would materially alter the nature of the project.

## 4. Third-Party Costs

The quoted contract price does not include third-party costs. The Client is solely responsible for all fees associated with: web hosting and domain registration, content management system (CMS) licenses or plugin fees, stock photography, icons, fonts, or other licensed assets, third-party API subscriptions, SSL certificates, and any other external services required for the project. The Designer will inform the Client of any anticipated third-party costs before incurring them on the Client's behalf. If the Designer pays for third-party services on the Client's behalf, the Client agrees to reimburse the Designer within seven (7) business days of invoice.

## 5. Browser and Device Compatibility

The Designer will test and optimize the website for the following browsers and environments: the latest two major versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge, on both desktop (Windows and macOS) and mobile viewports. The Designer does not warrant compatibility with older browser versions, legacy Internet Explorer versions, or non-standard browsers. Minor rendering differences between browsers are inherent to web development and do not constitute defects. The Designer is not responsible for issues arising from the Client's use of unsupported browsers.

## 6. Content Provision Deadline

The Client agrees to provide all necessary content — including written copy, images, logos, brand assets, and any other materials required for the project — by {{start_date}} plus fourteen (14) calendar days, or as otherwise agreed in writing. If the Client fails to provide required content by the agreed deadline, the project timeline will be extended by a period equal to the delay, and the Designer reserves the right to invoice for any idle time exceeding five (5) business days at the Designer's hourly rate.

## 7. Revision Policy

This Agreement includes two (2) rounds of revisions per major deliverable. A "revision round" is defined as one consolidated set of changes submitted by the Client at one time. Each revision request must be submitted as a single, comprehensive document or message — not incrementally. Additional revision rounds beyond the included two (2) will be billed at the Designer's hourly rate of $[HOURLY_RATE] per hour, invoiced separately. Revision requests must be submitted within seven (7) business days of each deliverable being presented. Requests submitted after that period may be treated as new work.

## 8. Intellectual Property Transfer

All original design work, code, and other deliverables created by the Designer under this Agreement are the intellectual property of the Designer until full payment of the contract price has been received. Upon receipt of final payment in full, the Designer assigns and transfers to the Client all ownership rights, including copyright, in the final deliverables specifically created for this project. This transfer excludes: (a) any third-party assets subject to their own licenses; (b) the Designer's pre-existing tools, frameworks, libraries, and development methodologies; and (c) general design concepts, techniques, or processes that are not unique to this project.

## 9. Designer Portfolio Rights

Notwithstanding any confidentiality provisions herein, the Designer retains the perpetual, irrevocable right to display the completed work — including screenshots, mockups, and descriptions of the project — in the Designer's portfolio, case studies, website, social media profiles, and award submissions. If the Client requires the work to remain confidential and not appear in the Designer's portfolio, the Client must notify the Designer in writing at the time of signing, and the parties will negotiate a separate confidentiality fee.

## 10. Confidentiality

Each party agrees to keep confidential all non-public information received from the other party in connection with this project, including but not limited to business strategies, client data, proprietary systems, and pricing information. This obligation survives termination of this Agreement for a period of three (3) years. The Designer may disclose the existence of the Client relationship (but not confidential details) for general marketing purposes unless the Client opts out in writing.

## 11. Hosting and Maintenance

This Agreement covers the design and development of the website only. Ongoing website maintenance, security monitoring, software updates, content updates, hosting management, and technical support are not included and constitute a separate service agreement. The Designer will not be liable for issues arising after project completion, including but not limited to plugin conflicts, hosting failures, security breaches, or compatibility issues resulting from third-party updates.

## 12. Termination and Kill Fee

Either party may terminate this Agreement upon fourteen (14) days' written notice. In the event of termination by the Client for any reason other than the Designer's material breach, the Client agrees to pay: (a) all fees for work completed to the date of termination, calculated at the pro-rated contract rate; and (b) a kill fee equal to twenty-five percent (25%) of the remaining unpaid contract balance, as compensation for the Designer's reserved capacity and opportunity cost. In the event of termination due to the Designer's material breach, the Client's sole remedy is a refund of fees paid for work not yet delivered.

## 13. Late Payment Penalties

Invoices not paid within the due date specified on the invoice shall accrue interest at the rate of 1.5% per month (18% per annum) on the outstanding balance. The Designer reserves the right to suspend all work, withhold deliverables, and/or take down any live work until the account is current. The Client agrees to reimburse the Designer for all reasonable costs of collection, including attorney's fees, in the event that legal action is required to recover unpaid amounts.

## 14. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE], without regard to its conflict of law provisions. Any disputes arising out of or related to this Agreement shall be resolved in the state or federal courts located in [COUNTY], [STATE], and both parties consent to the personal jurisdiction of such courts.

## 15. Entire Agreement

This Agreement, together with any attached schedules or change orders, constitutes the entire agreement between the parties with respect to the subject matter herein and supersedes all prior negotiations, representations, warranties, and understandings. This Agreement may be amended only by a written instrument signed by both parties.

---

**Designer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Project Start Date:** {{start_date}}
**Project End Date:** {{end_date}}
**Contract Value:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. PHOTOGRAPHER (GENERAL / COMMERCIAL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'photographer',
    label: 'Photographer',
    description: 'For commercial, portrait, product, and general photography sessions.',
    icon: 'Camera',
    suggestedPaymentTerms: '50% non-refundable deposit to book, 50% due 48 hours before session',
    suggestedTitle: 'Photography Services Agreement',
    content: `# Photography Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Photographer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs all photography services described below.

---

## 1. Session Details

The Photographer agrees to provide photography services as follows: {{project_description}}. The session is scheduled to begin on {{start_date}} and is expected to conclude by {{end_date}}. The deliverables will include the number of final edited images specified in the project description above. The number of final images is an estimate and may vary based on session conditions, subject matter, and the Photographer's editorial judgment.

## 2. Compensation and Payment Terms

The total fee for services under this Agreement is {{currency}} {{rate}}, payable as follows: {{payment_terms}}. The deposit is non-refundable and is required to reserve the Photographer's time and hold the session date. No date is considered confirmed until the deposit has been received.

## 3. Copyright Ownership

The Photographer is and shall remain the sole author and copyright owner of all photographs produced under this Agreement, pursuant to the United States Copyright Act (17 U.S.C. § 101 et seq.). The Client does not acquire any ownership rights in the photographs. The Client receives only the limited license granted below. Any use of the photographs outside the scope of that license requires a separate written agreement and additional licensing fees.

## 4. Usage Rights and License

Upon receipt of full payment, the Photographer grants the Client a non-exclusive, non-transferable license to use the delivered photographs for the following purposes: {{project_description}}. This license is limited to the specific uses described. Commercial use beyond personal or internal business purposes, print publication, advertising, resale, sublicensing, or any other use not explicitly described requires a separate written license agreement and additional fees. The Photographer retains the right to license the same images to other parties unless an exclusivity agreement has been separately contracted in writing.

## 5. Model and Property Releases

If identifiable persons appear in the photographs, the Client is solely responsible for obtaining signed model releases from all such individuals before the session date, unless the Photographer has explicitly agreed in writing to obtain releases as a paid add-on service. If identifiable private property appears in the photographs, the Client is similarly responsible for obtaining written property releases. The Client warrants that all required releases will be obtained and agrees to indemnify and hold the Photographer harmless from any claims arising from the Client's failure to obtain necessary releases.

## 6. Post-Processing and Editing

The Photographer's standard post-processing includes color correction, exposure adjustment, and basic retouching to maintain a consistent, professional look. The following are not included in the standard fee and are available as add-ons at an additional cost: heavy skin retouching, body modification, background removal or replacement, compositing or image manipulation, and object removal. The Client acknowledges that the Photographer will apply their professional editing judgment to each image, and that the final edited images will reflect the Photographer's established aesthetic style.

## 7. Aesthetic Disclaimer

The Photographer's photographic style, editing approach, and artistic choices are as represented in the Photographer's portfolio, which the Client has had the opportunity to review prior to booking. By signing this Agreement, the Client confirms that they are familiar with and approve of the Photographer's style. Dissatisfaction with the Photographer's artistic style, editing style, or creative choices is not grounds for a refund, re-shoot, or reduction in fees.

## 8. Raw Files

Unedited raw or source files are the exclusive property of the Photographer and are not included in any standard package or delivery. Raw files will not be delivered unless explicitly contracted in a separate written addendum and at an additional fee. This policy is standard in the photography industry and reflects the Photographer's professional judgment regarding quality control.

## 9. Image Delivery Timeline

The Photographer will deliver the final edited images within the timeframe specified in the project description above, measured in business days from the date of the session (or from the date of final payment, whichever is later). The Photographer will deliver images via an online gallery, file transfer service, or other digital delivery method. The Client is responsible for downloading and backing up all delivered images within thirty (30) days of delivery notification. The Photographer is not responsible for storing or re-delivering images after the gallery access period expires.

## 10. Cancellation and Rescheduling

The deposit paid to reserve the session date is non-refundable under all circumstances, including illness, scheduling conflicts, or change of mind. If the Client requests a reschedule more than seventy-two (72) hours before the session, the Photographer will make reasonable efforts to accommodate the request, subject to availability, and the deposit will be applied to the rescheduled date. If the Client requests a reschedule within seventy-two (72) hours of the session, or fails to appear at the scheduled session, the deposit is forfeited and a new deposit is required to rebook. If the Photographer must cancel due to circumstances within the Photographer's control, the Client will receive a full refund of all amounts paid.

## 11. Incapacitation and Backup Clause

In the unlikely event that the Photographer is unable to perform services due to illness, injury, family emergency, or circumstances beyond the Photographer's control, the Photographer will make reasonable good-faith efforts to arrange a qualified substitute photographer at no additional cost to the Client. If no suitable substitute can be found, the Photographer's liability shall be limited to a full refund of all amounts paid by the Client. The Photographer shall not be liable for any consequential, incidental, or special damages arising from the Photographer's inability to perform.

## 12. Non-Disparagement

Each party agrees not to publicly disparage, defame, or make false statements about the other party, their business, or their work, whether online, in print, or in any other medium. This includes social media posts, review platforms, and professional networks. Honest, good-faith reviews based on actual experience are not prohibited by this clause.

## 13. Equipment Liability

The Photographer maintains professional-grade equipment and insurance. If the session takes place in a hazardous environment, an outdoor location with unpredictable conditions, or involves client-directed activities that may expose the Photographer's equipment to damage, the Client acknowledges and accepts that the Photographer is not responsible for any equipment damage, malfunction, or failure arising from such conditions. The Photographer reserves the right to decline to place equipment in conditions that, in the Photographer's professional judgment, create unreasonable risk of damage.

## 14. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE]. Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the state or federal courts in [COUNTY], [STATE].

---

**Photographer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Session Date:** {{start_date}}
**Contract Value:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. WEDDING PHOTOGRAPHER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'wedding-photographer',
    label: 'Wedding Photographer',
    description: 'Comprehensive contract for full-day wedding photography coverage.',
    icon: 'Heart',
    suggestedPaymentTerms: '30% non-refundable retainer at booking, remaining balance due 30 days before wedding',
    suggestedTitle: 'Wedding Photography Agreement',
    content: `# Wedding Photography Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Photographer") and {{client_name}} (hereinafter "the Client" or "the Couple"). Together, the parties agree to the following terms governing wedding photography services.

---

## 1. Event Details

The Photographer is engaged to provide photography coverage for the wedding event as follows: {{project_description}}. The wedding is scheduled for {{start_date}}. Coverage will begin at the agreed call time and conclude at the agreed wrap time, as communicated in the pre-wedding planning session. Ceremony location and reception location will be confirmed no later than thirty (30) days before the wedding date.

## 2. Non-Refundable Retainer

A retainer equal to thirty percent (30%) of the total contract price is due upon execution of this Agreement. This retainer is NON-REFUNDABLE under all circumstances, including but not limited to cancellation by the Client, postponement of the wedding, illness, change of mind, or any event beyond either party's control. The retainer represents the Photographer's reservation of the wedding date, forgoing all other bookings for that date. The total contract value is {{currency}} {{rate}}, and payment terms are {{payment_terms}}.

## 3. Payment Schedule

The remaining balance is due no later than thirty (30) days before the wedding date. Failure to remit the remaining balance by this deadline may result in the Photographer treating the booking as cancelled, in which case the retainer is forfeited and the Photographer is released from any obligation to provide services. The Photographer will provide a written reminder of the payment deadline no later than forty-five (45) days before the wedding.

## 4. Exclusive Photographer Clause

The Photographer is engaged as the exclusive professional photographer for the wedding event. The Client agrees not to hire any other professional photographers or videographers without the prior written consent of the Photographer. "Professional photographer" means any person who is engaged for compensation or who uses professional-grade equipment. Guests are welcome to take casual photographs with personal devices, but the Client agrees to ask guests to refrain from obstructing the Photographer's access to key moments during the ceremony and formal portrait sessions.

## 5. Force Majeure

Neither party shall be liable for failure to perform obligations under this Agreement due to circumstances beyond their reasonable control, including but not limited to: acts of God, extreme weather events, natural disasters, pandemics, government-mandated restrictions, venue closure, transportation disruptions, sudden serious illness or injury, or death in the immediate family. In the event that the Photographer cannot perform due to a qualifying force majeure event, the Photographer's liability shall be limited to a full refund of all amounts paid. The retainer is non-refundable only if the Client cancels due to a force majeure event. The parties agree to act in good faith to reschedule when possible.

## 6. Second Shooter

If a second photographer is included in the contracted package, their role is to provide supplemental coverage — including guest candids, alternate angles, and coverage of parallel events (e.g., separate getting-ready rooms). The second shooter's deliverables are included in the main gallery. The Photographer reserves the right to substitute the second shooter with a comparably qualified photographer. The second shooter is contracted by and reports to the Photographer, and is not a party to this Agreement.

## 7. Meal and Break Policy

If wedding coverage extends beyond six (6) consecutive hours, the Client agrees to arrange and provide a hot vendor meal for the Photographer (and second shooter, if applicable) during a natural break in coverage, typically during the dinner service. The Photographer is entitled to a minimum thirty (30)-minute uninterrupted break during events lasting more than six (6) hours. The Photographer will coordinate the timing of this break with the Client to minimize impact on coverage.

## 8. Safety and Harassment Policy

The Photographer reserves the right to immediately cease services and leave the event without refund of any fees paid if the Photographer or their assistants are subjected to physical violence, credible threats of violence, sustained harassment, verbal abuse, or unsafe working conditions from the Client, wedding party, guests, venue staff, or any other person at the event. Disagreement about shot selection, direction, or scheduling does not constitute grounds to invoke this clause; however, abusive, threatening, or physically dangerous conduct does.

## 9. Timeline Cooperation

The Client agrees to provide the Photographer with a detailed wedding day timeline no later than fourteen (14) days before the wedding. The timeline should include all key events, locations, travel times, and portrait session windows. The Photographer is not responsible for missing key moments, events, or portrait sessions caused by delays attributable to the Client, the wedding party, the venue, vendors, or other factors outside the Photographer's control. The Photographer will make all reasonable efforts to adapt and capture moments as they occur.

## 10. Editing Style and Expectations

The delivered photographs will be edited in the Photographer's established style as reflected in the Photographer's portfolio, which the Client has reviewed and approved by entering into this Agreement. The Photographer's editing process includes color correction, exposure adjustment, and stylistic tone-mapping. Specific editing requests — including but not limited to extensive skin retouching, body modification, background replacement, or heavy compositing — are available as add-ons at an additional fee. The Client may not request that the Photographer convert color images to black and white after the gallery has been delivered, as this constitutes a rework of the edited files. The Client may request black-and-white versions of specific images during the ordering phase at an additional cost.

## 11. Image Delivery Timeline

The Photographer will deliver the completed online gallery within eight (8) to twelve (12) weeks of the wedding date, depending on the volume of photographs and current workload. The Photographer will provide periodic updates if delivery is expected to exceed this range. Expedited delivery may be available at an additional rush fee.

## 12. Online Gallery Access

The online gallery will be accessible for a period of ninety (90) days from the date of delivery. The Client is solely responsible for downloading all images and creating personal backups within this period. The Photographer is not obligated to store or re-deliver images after the gallery expires. Re-uploading or re-delivering an expired gallery may be available at an additional fee, subject to the Photographer's file retention policies.

## 13. Cancellation Policy

If the Client cancels this Agreement, the following cancellation fees apply: (a) if cancellation occurs more than six (6) months before the wedding date, the Client forfeits the non-refundable retainer only; (b) if cancellation occurs between three (3) and six (6) months before the wedding date, the Client forfeits fifty percent (50%) of the total contract value; (c) if cancellation occurs within three (3) months of the wedding date, the Client forfeits one hundred percent (100%) of the total contract value. These fees reflect the Photographer's inability to rebook the date on short notice.

## 14. Postponement Policy

The Client may request one (1) complimentary date change, provided the Photographer is available on the new date and written notice of postponement is received at least sixty (60) days before the original wedding date. If the Photographer is not available on the new requested date, the postponement will be treated as a cancellation under the schedule above. A second date change, or a date change with less than sixty (60) days' notice, will be treated as a cancellation and new booking, requiring a new retainer.

## 15. Venue Access

The Client is responsible for ensuring that the Photographer has full, unrestricted access to all ceremony and reception venues at the contracted times, including any restricted areas needed for portrait sessions, detail shots, or special moments. If a venue imposes restrictions on photography — including flash restrictions, location bans, or equipment limitations — the Client must notify the Photographer in writing no later than fourteen (14) days before the wedding so that the Photographer can prepare accordingly.

## 16. Social Media and Marketing

The Photographer reserves the right to post selected wedding images on the Photographer's website, social media platforms, blog, and marketing materials. Images will be used in a tasteful and professional manner. If the Client wishes to restrict the Photographer's use of wedding images for marketing purposes, the Client must submit a written opt-out request at the time of signing. Opt-out of marketing use does not entitle the Client to a discount or rebate.

## 17. Backup Equipment

The Photographer uses professional-grade camera equipment and carries backup camera bodies, lenses, memory cards, and batteries at all times. In the event of equipment malfunction during the event, the Photographer will immediately switch to backup equipment. All memory cards will be duplicated as soon as reasonably possible after the event to protect against data loss.

## 18. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE]. Any disputes arising hereunder shall be submitted to binding arbitration in [COUNTY], [STATE], before a single arbitrator under the rules of the American Arbitration Association.

---

**Photographer:** {{freelancer_name}} ({{freelancer_business}})
**Client(s):** {{client_name}}
**Wedding Date:** {{start_date}}
**Contract Value:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. GRAPHIC DESIGNER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'graphic-designer',
    label: 'Graphic Designer',
    description: 'For logos, brand kits, print materials, and visual identity projects.',
    icon: 'PaintBrush',
    suggestedPaymentTerms: '50% deposit at project start, 50% upon final file delivery',
    suggestedTitle: 'Graphic Design Services Agreement',
    content: `# Graphic Design Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Designer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the graphic design services described herein.

---

## 1. Project Scope and Deliverables

The Designer agrees to create and deliver the following design work: {{project_description}}. Final files will be delivered in the formats specified in Section 6 below. Any deliverable not explicitly listed in the project description above is outside the scope of this Agreement and will require a written change order. Design work is created exclusively for the intended use described herein; any adaptation for use in additional formats, markets, or media requires a separate agreement.

## 2. Revision Policy

This Agreement includes three (3) rounds of revisions per deliverable. A "revision round" is defined as one complete, consolidated set of changes communicated by the Client in a single document or message. Piecemeal revision requests submitted across multiple messages or sessions will be treated as multiple revision rounds. Revision requests must be submitted within seven (7) business days of each deliverable being presented. After three (3) revision rounds have been exhausted, any further revisions will be billed at the Designer's hourly rate of $[HOURLY_RATE] per hour, invoiced separately and due upon completion.

## 3. Approval Deadline and Deemed Approval

The Client has five (5) business days to review and respond to each deliverable presented for approval. If the Client does not provide written feedback or approval within five (5) business days of a deliverable being submitted, that deliverable shall be deemed approved by the Client, and the Designer may proceed to the next phase of work. The Designer is not responsible for design decisions made under deemed approval. The Designer will send one reminder before the approval deadline expires.

## 4. Concept Presentation

The Designer will present two (2) initial design concepts for the Client's review. The Client will select one (1) concept direction to develop further. Revisions and refinements will be applied to the selected concept only. The non-selected concept(s) are not carried forward and are not subject to further development under this Agreement.

## 5. File Delivery Formats

Upon receipt of final payment, the Designer will deliver final files in the following formats: PNG (high-resolution, transparent background where applicable), PDF (print-ready), and SVG (vector format). Layered source files — including Adobe Illustrator (.ai), Adobe Photoshop (.PSD), or other native application files — will be delivered only upon receipt of full payment, and only if source file delivery was explicitly included in the agreed project scope. If source files were not included in the agreed scope, they may be purchased separately.

## 6. Payment Structure and Terms

The total contract value is {{currency}} {{rate}}, payable as follows: {{payment_terms}}. The deposit is non-refundable and is required before any design work commences. The deposit compensates the Designer for creative time, research, and opportunity cost associated with reserving capacity for this project.

## 7. Intellectual Property Transfer

All design concepts, artwork, and deliverables created by the Designer under this Agreement remain the intellectual property of the Designer until the total contract price has been paid in full. Upon receipt of full payment, the Designer assigns to the Client all copyright and ownership rights in the final approved deliverables. This transfer is limited to the final deliverables as approved and does not include preliminary concepts, unused design directions, or design elements not incorporated into the final deliverables.

## 8. Exclusivity and Non-Resale

The Designer will not sell or license the final approved design to any direct competitor of the Client within the same primary industry or geographic market for a period of two (2) years following the completion of this Agreement. The Designer may, however, use similar design techniques, color palettes, or general stylistic approaches in work for other clients, as these reflect the Designer's professional craft and cannot be exclusively owned by the Client.

## 9. Portfolio and Self-Promotion Rights

The Designer retains the perpetual right to display the final deliverables — including process work, mockups, and case study descriptions — in the Designer's portfolio, website, social media profiles, industry publications, and award submissions. If the Client requires that the work remain confidential and not be displayed publicly, the Client must request this in writing at the time of signing, and the parties will negotiate a separate confidentiality fee reflecting the loss of portfolio value to the Designer.

## 10. Print and Production Disclaimer

The Designer provides digital design files optimized to industry standards. Colors in the final files are specified using standard color systems (e.g., CMYK, Pantone, RGB). However, the Designer cannot guarantee that printed output will exactly match the colors displayed on any particular screen or monitor, as color rendering varies significantly between displays and printing devices. The Client is solely responsible for obtaining and approving physical proofs before authorizing any production run. The Designer is not liable for print errors, color variation, or production defects after the Client has approved proofs.

## 11. Client-Provided Materials

If the Client provides logos, photographs, text, or other materials for use in the design work, the Client warrants that they own or have obtained all necessary rights, licenses, and permissions to use such materials, and that the use of such materials in the design work will not infringe any third-party intellectual property rights. The Client agrees to indemnify and hold the Designer harmless from any claims, losses, or damages arising from the Client's breach of this warranty.

## 12. Confidentiality

The Designer agrees to keep confidential all non-public information provided by the Client in connection with this project, including but not limited to business strategies, product plans, proprietary data, and financial information. This obligation survives termination of this Agreement for three (3) years.

## 13. Termination and Kill Fee

Either party may terminate this Agreement upon written notice. If the Client terminates for any reason other than the Designer's material breach, the Client agrees to pay: (a) fees for all work completed to the date of termination, at the pro-rated contract rate; and (b) a kill fee of twenty-five percent (25%) of the remaining contract balance. If the Designer terminates due to the Client's failure to pay or material breach, the Designer will retain all fees paid and transfer only the work already paid for.

## 14. Late Payment Penalties

Balances not paid by the invoice due date will accrue interest at 1.5% per month (18% per annum) on the outstanding balance. The Designer reserves the right to withhold final file delivery until the account is paid in full. The Client agrees to reimburse the Designer for all reasonable collection costs, including attorney's fees, in the event payment must be pursued through legal action.

## 15. Governing Law

This Agreement shall be governed by the laws of the State of [STATE]. Any disputes shall be resolved by binding arbitration in [COUNTY], [STATE], under the rules of the American Arbitration Association, with costs shared equally by both parties.

---

**Designer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Project Start:** {{start_date}}
**Contract Value:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. COPYWRITER / CONTENT WRITER
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'copywriter',
    label: 'Copywriter / Content Writer',
    description: 'For blog posts, web copy, email sequences, and content strategy.',
    icon: 'PencilLine',
    suggestedPaymentTerms: '50% deposit upfront, 50% upon delivery of final drafts',
    suggestedTitle: 'Copywriting & Content Services Agreement',
    content: `# Copywriting & Content Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (hereinafter "the Copywriter") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the copywriting and content creation services described herein.

---

## 1. Project Scope and Deliverables

The Copywriter agrees to produce the following written content: {{project_description}}. Deliverables are as specified above, including the number of pieces, approximate word counts per piece, and content types. Any additional content pieces, additional word count significantly exceeding the specified range, or new content types not listed above constitute out-of-scope work and require a written addendum and additional compensation.

## 2. Research Scope

The Copywriter will conduct research using publicly available sources — including industry publications, the Client's existing materials, and general reference resources — to inform the content. The Client is responsible for providing: access to proprietary data, internal reports, subject matter experts for interviews (if interviews are part of the agreed scope), specific statistics or claims the Client requires in the content, brand voice guidelines, target audience profiles, and any confidential company information relevant to the project. Research beyond publicly available sources is available as a billable add-on.

## 3. Revision Policy

Each deliverable includes two (2) rounds of revisions. A revision round consists of one complete set of changes communicated in a single, consolidated document. Revisions must be limited to refinements within the original creative brief — significant changes to topic, angle, tone, or audience that amount to starting over will be treated as new work. Revision requests must be submitted within seven (7) business days of delivery. Requests submitted after that period may incur additional fees. Additional revision rounds beyond the included two (2) will be billed at $[HOURLY_RATE] per hour.

## 4. Originality and Plagiarism Warranty

The Copywriter warrants that all content delivered under this Agreement: (a) is wholly original and created by the Copywriter; (b) does not infringe any third-party copyright, trademark, or other intellectual property right; and (c) has not been previously published or sold to any other party. The Copywriter further warrants that all content passes standard plagiarism detection software. If the Client specifically requires that content pass AI-detection tools, this must be stated in writing as part of the project scope, as it may affect the Copywriter's process and pricing.

## 5. Indemnification

The Client agrees to indemnify, defend, and hold harmless the Copywriter from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising from: (a) information, facts, data, claims, or instructions provided by the Client that are inaccurate, misleading, defamatory, or legally problematic; (b) the Client's use of the delivered content in a manner not contemplated by this Agreement; or (c) the Client's failure to obtain required legal review before publishing content that makes regulated claims (e.g., medical, financial, legal advice). The Copywriter is not a lawyer, financial advisor, or licensed professional, and content should not be relied upon as professional advice.

## 6. Copyright and Ownership

Copyright in all delivered content vests in the Client upon receipt of full and final payment. Before full payment is received, all copyright remains with the Copywriter, and the Client has no right to publish, distribute, or otherwise use the content. The Copywriter retains the right to retain a copy of the delivered content as a portfolio sample unless the Client has requested confidentiality in writing. If the Client requests that the work remain confidential (i.e., not displayed in the Copywriter's portfolio), a confidentiality premium may apply.

## 7. Confidentiality

The Copywriter agrees to keep confidential all non-public information disclosed by the Client during this engagement, including but not limited to business strategies, target audience research, proprietary data, internal processes, product roadmaps, and financial information. This confidentiality obligation survives termination of this Agreement for a period of three (3) years. The Copywriter may disclose the existence of the client relationship for general marketing purposes unless the Client expressly requests otherwise in writing.

## 8. Content Approval and Client Responsibility for Publication

The Copywriter delivers content based on the creative brief and information provided by the Client. The Client is solely responsible for reviewing all delivered content for legal compliance, factual accuracy, regulatory requirements (including industry-specific disclosure requirements), and suitability for publication. The Copywriter is not responsible for how the content is edited, used, or distributed after delivery. The Client bears full responsibility for ensuring that published content complies with applicable laws, including FTC guidelines, healthcare regulations, financial services regulations, and any other industry-specific requirements.

## 9. Fact-Checking Responsibility

The Copywriter writes based on information and facts provided by the Client or sourced from publicly available references. The Client is responsible for reviewing all factual claims in the delivered content before publication. If specific statistics, data points, or claims are required in the content, the Client must provide verified source material. The Copywriter is not liable for inaccuracies in content that arose from incorrect or incomplete information provided by the Client.

## 10. Payment Terms

The total contract value is {{currency}} {{rate}}, payable as follows: {{payment_terms}}. Invoices are due upon receipt unless otherwise specified. The Copywriter will not begin work until the deposit has been received. Content deliverables will be withheld until payment has been received in full for each invoice cycle.

## 11. Rush Fee

Projects requiring delivery within fewer than five (5) business days from the date of the signed Agreement and complete creative brief constitute rush projects and are subject to a rush surcharge of twenty-five percent (25%) of the applicable project fee. Rush delivery is subject to the Copywriter's availability and must be confirmed in writing before the rush fee is invoiced.

## 12. Competitive Exclusivity

During the term of this Agreement, the Copywriter will not write content for a direct competitor of the Client in the same primary product or service category, unless the Client explicitly waives this restriction in writing. A "direct competitor" is a business offering substantially similar products or services to the same target audience within the same geographic market. This exclusivity applies only to content in the same category or topic area as the work described in this Agreement.

## 13. Kill Fee and Cancellation

If the Client cancels this Agreement after work has begun, the Client agrees to pay: (a) fees for all work completed and delivered to the date of cancellation; and (b) a kill fee of twenty-five percent (25%) of the remaining contract balance, as compensation for reserved creative time and opportunity cost. If the Copywriter cancels due to circumstances within the Copywriter's control, the Client will receive a full refund of any amounts paid for work not yet delivered.

## 14. Late Payment

Invoices not paid by the due date shall accrue interest at 1.5% per month (18% per annum). The Copywriter reserves the right to suspend all work until overdue invoices are paid and to pursue legal remedies for collection. The Client agrees to pay reasonable attorney's fees if collection action is required.

## 15. Governing Law

This Agreement is governed by the laws of the State of [STATE]. Disputes arising hereunder shall be resolved by binding arbitration in [COUNTY], [STATE].

---

**Copywriter:** {{freelancer_name}}
**Client:** {{client_name}} ({{client_company}})
**Project Start:** {{start_date}}
**Contract Value:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VIDEOGRAPHER / VIDEO EDITOR
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'videographer',
    label: 'Videographer / Video Editor',
    description: 'For event coverage, commercial videos, music videos, and branded content.',
    icon: 'VideoCamera',
    suggestedPaymentTerms: '50% non-refundable deposit to book, 50% due before final file delivery',
    suggestedTitle: 'Video Production Services Agreement',
    content: `# Video Production Services Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (operating as {{freelancer_business}}, hereinafter "the Videographer") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the video production and editing services described herein.

---

## 1. Project Details

The Videographer agrees to provide video production services as follows: {{project_description}}. The project is scheduled for {{start_date}} through {{end_date}}. The project type, shoot location(s), and final deliverables are as described above. Any changes to the scope, shoot date, location, or deliverables require a written amendment to this Agreement.

## 2. Pre-Production Scope

Pre-production services included in the contract price are as specified in the project description above. Pre-production services that are NOT included unless separately contracted include: casting and talent coordination, professional location scouting beyond basic reconnaissance, production design, prop sourcing, wardrobe styling, hair and makeup, custom music composition, scriptwriting beyond basic outline guidance, and permit acquisition (permit fees are always the Client's responsibility). If any of these services are required, they will be scoped and priced in a separate addendum.

## 3. Shoot Day Terms

The shoot day begins at the agreed call time and is scheduled to wrap at the agreed wrap time. If the shoot runs over the agreed wrap time due to Client-caused delays, scope expansion, or other factors within the Client's control, overtime will be billed at $[OVERTIME_RATE] per hour (or part thereof) per crew member, invoiced separately. The Videographer will notify the Client as soon as it appears the shoot may run over schedule so the Client can make an informed decision about continuing.

## 4. Post-Production Scope

Post-production services included in the contract price are: video editing and assembly, color grading, basic sound mixing and audio cleanup, addition of title cards and lower thirds (text on screen) as specified, and licensed background music selected from the Videographer's royalty-free music library. The following are NOT included unless separately contracted and priced: custom motion graphics and animation, visual effects (VFX), subtitles and closed captioning, audio voiceover recording, additional language versions, social media format cuts (vertical 9:16, square 1:1) beyond what is specified, and speed ramp effects or other specialized edits not included in the brief.

## 5. Revision Policy

This Agreement includes two (2) rounds of revisions on the edited video. A revision round is one complete, consolidated list of changes submitted by the Client in a single communication. Revisions must be submitted via a written document with timecode references where applicable. Additional revision rounds beyond the included two (2) will be billed at $[HOURLY_RATE] per hour of editing time, invoiced upon completion. Revision requests must be submitted within seven (7) business days of each edit being delivered.

## 6. Raw Footage

Unedited raw footage files remain the property of the Videographer and are not included in any standard delivery package. Raw footage will not be delivered to the Client unless explicitly contracted in a written addendum to this Agreement, at an additional fee. If raw footage delivery is included, the format and delivery method will be specified in the addendum. The Videographer is not obligated to retain raw footage beyond ninety (90) days following final project delivery.

## 7. Music Licensing

All background music included in the final video is sourced from a royalty-free music library and is licensed by the Videographer for use within the specific video deliverable described in this Agreement. This license does not extend to: re-editing or remixing the video with the licensed music, uploading the video to platforms other than those specified, using the music separately from the video, or any other use outside the original deliverable. If the Client requires music licensed under specific terms (e.g., a major music catalog song, a sync license for broadcast television, or a music license covering a specific upload platform), the Client must provide such licensed music or arrange and pay for the appropriate license separately.

## 8. Delivery Format and Timeline

The final video will be delivered in 1080p MP4 format (H.264 codec) unless otherwise specified in the project description. Delivery will occur via a file transfer service or online platform within the number of business days specified in the project description, measured from the date of the Client's final written approval of the last revision. The Client is responsible for downloading and backing up all delivered files within thirty (30) days of delivery. The Videographer is not responsible for re-delivering files after this period.

## 9. Cancellation and Rescheduling

The deposit paid to reserve the shoot date is non-refundable under all circumstances. If the Client requests to reschedule the shoot more than seventy-two (72) hours before the scheduled date, the Videographer will make reasonable efforts to accommodate the request subject to availability, and the deposit will be applied to the rescheduled date. Rescheduling within seventy-two (72) hours of the shoot date forfeits the deposit, and a new deposit is required to rebook. If the Videographer cancels due to circumstances within the Videographer's control, the Client will receive a full refund of all amounts paid.

## 10. Force Majeure and Outdoor Weather

For outdoor shoots, the Videographer and Client agree to monitor weather conditions in the days before the shoot. If weather conditions at the time of the shoot are, in the Videographer's professional judgment, likely to damage equipment or produce unusable footage (e.g., heavy rain, extreme wind, electrical storm), the Videographer reserves the right to postpone the shoot to a mutually agreed rescheduled date. The deposit will be applied to the rescheduled date. Neither party will be liable to the other for losses resulting from weather-related postponement.

## 11. Equipment Handling

The Videographer's equipment — including cameras, lenses, audio gear, lighting, stabilizers, and drones — is to be operated exclusively by the Videographer and their crew. The Client, Client's guests, venue staff, and any other parties at the shoot location are not permitted to handle, operate, direct the handling of, or make physical contact with the Videographer's equipment without explicit permission from the Videographer. The Client is liable for any damage to the Videographer's equipment caused by the Client's breach of this provision.

## 12. Model and Location Releases

The Client is solely responsible for: obtaining signed model releases from all identifiable persons who appear in the video; obtaining location permits, location releases, and any required permissions from property owners or venue managers; and ensuring that no intellectual property belonging to third parties (including copyrighted artwork, logos, or branded materials) appears in the video in a way that requires a license. The Client agrees to indemnify and hold the Videographer harmless from any claims arising from the Client's failure to obtain required releases or permits.

## 13. Intellectual Property

All video content produced under this Agreement remains the intellectual property of the Videographer until full payment has been received. Upon receipt of full and final payment, the Videographer assigns to the Client all ownership rights in the final edited video deliverables. The Videographer retains the perpetual right to use clips, screenshots, and descriptions of the project in the Videographer's portfolio, reel, website, and marketing materials, unless the Client requests confidentiality in writing at the time of signing.

## 14. Drone and Aerial Footage

If aerial or drone footage is included in the project scope, the following terms apply: all drone operations will be conducted in compliance with applicable FAA regulations, including registration requirements and applicable airspace authorizations. Drone footage is weather-dependent and may be limited or unavailable due to wind, precipitation, restricted airspace, or other conditions on the day of the shoot. The Videographer will make all reasonable efforts to capture drone footage as planned but cannot guarantee aerial coverage if conditions make safe operation impossible. Drone-related permits, airspace authorizations, and location-specific drone permissions are the Client's responsibility unless otherwise agreed.

## 15. Late Payment Penalties

Invoices not paid by their due date shall accrue interest at 1.5% per month. The Videographer reserves the right to withhold delivery of final files until the account is paid in full and to pursue legal remedies for overdue balances. The Client agrees to pay reasonable attorney's fees if collection action is required.

## 16. Governing Law

This Agreement shall be governed by the laws of the State of [STATE]. Any disputes shall be resolved by binding arbitration in [COUNTY], [STATE].

---

**Videographer:** {{freelancer_name}} ({{freelancer_business}})
**Client:** {{client_name}} ({{client_company}})
**Project Dates:** {{start_date}} – {{end_date}}
**Contract Value:** {{currency}} {{rate}}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. SOCIAL MEDIA MANAGER / MARKETING CONSULTANT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'social-media-manager',
    label: 'Social Media Manager',
    description: 'For monthly social media management, content creation, and marketing retainers.',
    icon: 'ChartBar',
    suggestedPaymentTerms: 'Monthly retainer billed on the 1st of each month, due within 5 business days',
    suggestedTitle: 'Social Media Management Agreement',
    content: `# Social Media Management Agreement

**This Agreement** is entered into as of {{start_date}} by and between {{freelancer_name}} (hereinafter "the Manager") and {{client_name}} of {{client_company}} (hereinafter "the Client"). This Agreement governs the social media management and marketing services to be provided on a monthly retainer basis.

---

## 1. Scope of Services

The Manager agrees to provide the following social media management services on the platforms specified in the project description: {{project_description}}. Services are limited to those explicitly described above. The following are expressly NOT included in this Agreement unless separately contracted and priced in writing: paid advertising management (Facebook Ads, Instagram Ads, Google Ads, TikTok Ads, or any other paid media); custom graphic design or illustration beyond basic branded templates; video production, filming, or professional editing; influencer outreach or influencer relationship management; customer service or inbox/comment management on behalf of the Client; public relations or press outreach; and search engine optimization (SEO). Any out-of-scope requests will be quoted and billed separately.

## 2. Performance Disclaimer — NON-NEGOTIABLE

THE MANAGER MAKES NO REPRESENTATIONS, WARRANTIES, OR GUARANTEES, EXPRESS OR IMPLIED, REGARDING THE PERFORMANCE RESULTS OF ANY SOCIAL MEDIA ACTIVITIES CONDUCTED UNDER THIS AGREEMENT. Specific outcomes — including but not limited to follower count growth, engagement rate, reach, impressions, website traffic, lead generation, conversion rates, or revenue attributable to social media activity — are NOT guaranteed and are not the basis of this Agreement. Social media platform algorithms, audience behavior, platform policy changes, market conditions, and competitive factors are entirely outside the Manager's control and can materially affect performance metrics regardless of the quality of content and strategy employed. The Manager's obligation under this Agreement is to deliver the specified services — content creation, posting, scheduling, and strategy — with professional skill and care. The Manager is NOT responsible for outcomes that are contingent on factors beyond the Manager's control.

## 3. Content Approval Process

The Manager will prepare and submit a content calendar for the upcoming calendar month no later than the fifth (5th) business day of the current month (or at the cadence agreed in the project description). The Client will have three (3) business days to review and respond with approval or revision requests. If the Client does not respond within three (3) business days, the content calendar shall be deemed approved, and the Manager is authorized to schedule and publish the approved content on the agreed dates. The Manager will not be held responsible for delays in publishing or missed posting schedules caused by the Client's failure to respond within the review window.

## 4. Client Responsibilities

The Client agrees to: (a) provide brand guidelines, logo files, product images, and other brand assets within five (5) business days of the Agreement start date; (b) provide timely information about promotions, events, product launches, or other content topics; (c) respond to content calendar submissions within the three (3)-business-day approval window; (d) grant the Manager authorized access to all required social media account dashboards, scheduling tools, and analytics platforms; and (e) notify the Manager promptly of any brand, product, or messaging changes that may affect content. Delays caused by the Client's failure to fulfill these responsibilities — including delays in providing access, assets, or approvals — do not reduce, suspend, or excuse the monthly retainer payment obligation.

## 5. Account Ownership

All social media accounts managed under this Agreement are and shall remain the sole property of the Client. The Manager acts as an authorized operator of the Client's accounts for the purpose of fulfilling the services described herein. The Manager does not claim any ownership over the accounts, audience, or followers accumulated on those accounts. Upon termination of this Agreement, the Manager will immediately cease posting and return or revoke all access credentials.

## 6. Content Ownership

All branded content created and published by the Manager on behalf of the Client under this Agreement — including copy, captions, and basic graphic templates — becomes the Client's property upon full payment of the monthly retainer for the period in which it was created. The Manager retains ownership of content frameworks, editorial strategies, scheduling systems, content calendar formats, and general methodologies developed in the course of providing services. These underlying systems and approaches are not transferred to the Client and may be used by the Manager for other clients.

## 7. Out-of-Scope and Add-On Services

Requests for services not listed in Section 1 of this Agreement — including paid ad management, influencer outreach, graphic design beyond basic templates, video editing, customer service responses, or additional platforms — will be scoped and priced separately. Out-of-scope work will not begin until the Client has approved a written quote and, where applicable, paid a deposit. Add-on services are invoiced separately from the monthly retainer.

## 8. Confidentiality and Non-Disclosure

The Manager agrees to keep confidential all non-public information disclosed by the Client in connection with this Agreement, including but not limited to business strategies, marketing plans, target audience data, customer lists, financial performance data, product roadmaps, and any other proprietary business information. This obligation survives termination of this Agreement for a period of three (3) years. The Manager may not use the Client's confidential information for any purpose other than providing the services described herein.

## 9. Non-Compete

During the term of this Agreement, the Manager will not simultaneously provide social media management services to a direct competitor of the Client in the same primary product or service category and target market. A "direct competitor" is a business that sells substantially similar products or services to the same customer demographic. If the Manager is uncertain whether a potential new client constitutes a direct competitor, the Manager will notify the Client before accepting that engagement.

## 10. Reporting and Analytics

The Manager will provide the Client with a monthly performance report within five (5) business days of the end of each calendar month. The report will include the following metrics (to the extent available through the platforms' native analytics): total posts published, reach and impressions, engagement rate and total engagements, follower count and net follower change, and any other metrics agreed upon in the project description. The Manager will present this data objectively and without manipulation, and will provide context where relevant.

## 11. Password and Access Security

The Client is responsible for maintaining the security of access credentials shared with the Manager. Upon termination of this Agreement for any reason, the Client agrees to promptly change all passwords, revoke all third-party application access, and remove the Manager from all platform admin roles. The Manager will cooperate fully with the offboarding process. The Manager is not liable for any security incident that occurs after the Client has been notified that offboarding is required.

## 12. Termination and Offboarding

Either party may terminate this Agreement by providing thirty (30) days' written notice to the other party. The monthly retainer for the notice month is due in full regardless of the termination date within that month. Upon termination, the Manager will: (a) deliver all content calendars, scheduled posts (in draft), and asset files created during the engagement; (b) provide a written record of all account logins and connected tools; (c) transfer admin access back to the Client; and (d) cooperate with the Client's transition to a new provider. The Manager will not delete, archive, or otherwise modify any accounts, content, or data during the offboarding period.

## 13. Monthly Retainer and Payment

The monthly retainer is {{currency}} {{rate}} per month, due and payable on the first (1st) of each month for services to be rendered during that month. If payment is not received within five (5) business days of the due date, the Manager reserves the right to pause all services until the account is brought current. Paused months do not reduce the retainer obligation — services paused due to non-payment will resume upon payment of the overdue balance plus any applicable late fees. The Manager's work product for paused months remains the Manager's property until payment is received.

## 14. Late Payment Penalties

Retainer payments not received by the fifth (5th) business day of the month shall be considered overdue and will accrue a late fee of five percent (5%) of the monthly retainer for each week (or part thereof) that payment is delayed. The Manager reserves the right to suspend services and pursue legal remedies for overdue balances. The Client agrees to reimburse the Manager for reasonable collection costs, including attorney's fees.

## 15. Governing Law

This Agreement shall be governed by the laws of the State of [STATE]. Any disputes arising hereunder shall be resolved by binding arbitration in [COUNTY], [STATE], under the American Arbitration Association's Commercial Arbitration Rules.

---

**Manager:** {{freelancer_name}}
**Client:** {{client_name}} ({{client_company}})
**Agreement Start:** {{start_date}}
**Monthly Retainer:** {{currency}} {{rate}}`,
  },
]
