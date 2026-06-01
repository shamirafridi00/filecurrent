// ============================================================
// src/lib/system-templates.ts
// Default system contract templates
// These are seeded into the DB on first run / migration
// ============================================================

import type { ContractTemplate } from '@/types'

export const SYSTEM_CONTRACT_TEMPLATES: Omit<ContractTemplate, 'id' | 'userId' | 'createdAt'>[] = [
  {
    name: 'Standard Service Agreement',
    description: 'General freelance services contract suitable for most projects',
    isDefault: true,
    isGlobal: true,
    content: `**STANDARD SERVICE AGREEMENT**

This Service Agreement ("Agreement") is entered into as of **{{start_date}}** ("Effective Date") by and between:

**SERVICE PROVIDER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Contact Email: {{client_email}}

---

## 1. Scope of Work

**Services**
The Service Provider agrees to provide the following professional services ("Services"):

{{project_description}}

## 2. Compensation

The Client agrees to pay the Service Provider a total fee of {{currency}} {{rate}}.

## 3. Payment Terms

{{payment_terms}}

## 4. Project Timeline

Start Date: {{start_date}}
Expected Completion Date: {{end_date}}

## 5. Intellectual Property Rights

Upon receipt of full and final payment, all rights, title, and interest in the final deliverables shall transfer to the Client.

## 6. Confidentiality

Both Parties agree to protect confidential information and not disclose it to third parties.

## 7. Termination

Either Party may terminate this Agreement with 14 days written notice.

---

**SERVICE PROVIDER SIGNATURE:**
Name: {{freelancer_name}}
Date: {{sign_date_provider}}

**CLIENT SIGNATURE:**
Name: {{client_name}}
Date: {{sign_date_client}}`,
  },
  {
    name: 'Photography Services Agreement',
    description: 'Contract for general corporate & commercial photography services',
    isDefault: false,
    isGlobal: true,
    content: `**PHOTOGRAPHY SERVICES AGREEMENT**

This Photography Services Agreement ("Agreement") is entered into as of **{{start_date}}** ("Effective Date") by and between:

**PHOTOGRAPHER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Scope of Services

{{project_description}}

## 2. Project Schedule

Start Date: {{start_date}}
End Date: {{end_date}}

## 3. Fees

Total fee: {{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Deliverables

Final edited images in high-resolution digital format, as specified in project scope.

## 6. Copyright & Usage Rights

The Photographer retains full copyright ownership. Upon full payment, the Client is granted a non-exclusive, perpetual license for business and marketing use.

## 7. Cancellation

- More than 48 hours before shoot: no penalty
- Within 48 hours: up to 50% fee
- Same-day: up to 100% fee

---

**PHOTOGRAPHER SIGNATURE:**
Name: {{freelancer_name}}
Date: {{sign_date_photographer}}

**CLIENT SIGNATURE:**
Name: {{client_name}}
Date: {{sign_date_client}}`,
  },
  {
    name: 'Web Development Contract',
    description: 'Specialized contract for website and web application development projects',
    isDefault: false,
    isGlobal: true,
    content: `**WEB DEVELOPMENT AGREEMENT**

This Web Development Agreement ("Agreement") is entered into as of **{{start_date}}** ("Effective Date") by and between:

**DEVELOPER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Project Description

{{project_description}}

## 2. Development Timeline

Start Date: {{start_date}}
Expected Completion: {{end_date}}

## 3. Project Fee

Total fee: {{currency}} {{rate}}

## 4. Payment Schedule

{{payment_terms}}

## 5. Revisions

Includes up to 3 rounds of revisions.

## 6. Intellectual Property

Upon full payment, all rights transfer to the Client.

## 7. Warranty

30-day warranty for bugs in delivered code.

---

**DEVELOPER SIGNATURE:**
Name: {{freelancer_name}}
Date: {{sign_date_developer}}

**CLIENT SIGNATURE:**
Name: {{client_name}}
Date: {{sign_date_client}}`,
  },
  {
    name: 'Consulting Services Agreement',
    description: 'Professional consulting agreement for advisory and strategic services',
    isDefault: false,
    isGlobal: true,
    content: `**CONSULTING SERVICES AGREEMENT**

This Consulting Services Agreement ("Agreement") is entered into as of **{{start_date}}** ("Effective Date") by and between:

**CONSULTANT:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Contact Email: {{client_email}}

---

## 1. Consulting Services

{{project_description}}

## 2. Term

From {{start_date}} to {{end_date}}.

## 3. Compensation

{{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Independent Contractor

The Consultant is an independent contractor, not an employee.

## 6. Confidentiality

The Consultant agrees to maintain strict confidentiality of all business information.

---

**CONSULTANT SIGNATURE:**
Name: {{freelancer_name}}
Date: {{sign_date_consultant}}

**CLIENT SIGNATURE:**
Name: {{client_name}}
Date: {{sign_date_client}}`,
  },
  {
    name: 'Content Writing Agreement',
    description: 'Contract for blog posts, articles, copywriting, and content creation services',
    isDefault: false,
    isGlobal: true,
    content: `**CONTENT WRITING AGREEMENT**

This Content Writing Agreement ("Agreement") is entered into as of **{{start_date}}** ("Effective Date") by and between:

**WRITER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Contact Email: {{client_email}}

---

## 1. Content Deliverables

{{project_description}}

## 2. Project Timeline

Start Date: {{start_date}}
Deadline: {{end_date}}

## 3. Compensation

{{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Revisions

Includes up to 2 rounds of revisions per content piece.

## 6. Copyright

Upon full payment, all rights transfer to the Client.

## 7. Kill Fee

If cancelled after work has commenced: 50% of total fee.

---

**WRITER SIGNATURE:**
Name: {{freelancer_name}}
Date: {{sign_date_writer}}

**CLIENT SIGNATURE:**
Name: {{client_name}}
Date: {{sign_date_client}}`,
  },
  {
    name: 'Design Services Agreement',
    description: 'Contract for graphic design, logo design, branding, and creative services',
    isDefault: false,
    isGlobal: true,
    content: `**DESIGN SERVICES AGREEMENT**

This Design Services Agreement ("Agreement") is entered into as of **{{start_date}}** ("Effective Date") by and between:

**DESIGNER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Project Scope

{{project_description}}

## 2. Project Schedule

Start Date: {{start_date}}
Completion Date: {{end_date}}

## 3. Project Fee

{{currency}} {{rate}}

## 4. Payment Schedule

{{payment_terms}}

## 5. Revision Rounds

Includes up to 3 rounds of revisions.

## 6. Copyright

Upon full payment, Client receives exclusive rights to final approved designs.

## 7. Client Delays

If Client fails to provide materials/approvals, timeline may be extended.

---

**DESIGNER SIGNATURE:**
Name: {{freelancer_name}}
Date: {{sign_date_designer}}

**CLIENT SIGNATURE:**
Name: {{client_name}}
Date: {{sign_date_client}}`,
  },
]

// ── System email templates
export const SYSTEM_EMAIL_TEMPLATES = [
  {
    name: 'Due in 3 Days',
    key: 'default_due_3_days_before',
    description: 'Sent 3 days before invoice is due',
    subject: 'Reminder: Invoice {{invoice_number}} due on {{due_date}}',
    isSystem: true,
    body: `<html><body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hello {{client_name}},</p>
    <p>This is a friendly reminder that invoice <strong>{{invoice_number}}</strong> from <strong>{{brand_name}}</strong> is due on <strong>{{due_date}}</strong>.</p>
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Invoice Number</td>
        <td style="padding: 12px; border: 1px solid #ddd;">{{invoice_number}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Amount Due</td>
        <td style="padding: 12px; border: 1px solid #ddd;">{{invoice_balance}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Due Date</td>
        <td style="padding: 12px; border: 1px solid #ddd;">{{due_date}}</td>
      </tr>
    </table>
    <p><a href="{{payment_link}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View &amp; Pay Invoice</a></p>
    <p>Thank you for your business!</p>
    <p>{{user_name}}<br>{{brand_name}}</p>
  </div>
</body></html>`,
  },
  {
    name: 'Due Today',
    key: 'default_due_on_date',
    description: 'Sent on the invoice due date',
    subject: 'Invoice {{invoice_number}} is due today...',
    isSystem: true,
    body: `<html><body style="font-family: Arial, sans-serif;">
  <p>Hello {{client_name}},</p>
  <p>Invoice <strong>{{invoice_number}}</strong> for <strong>{{invoice_balance}}</strong> is due today.</p>
  <p><a href="{{payment_link}}">Pay Now</a></p>
  <p>{{user_name}}</p>
</body></html>`,
  },
  {
    name: 'Manual Follow-up',
    key: 'manual_followup_generic',
    description: 'Generic template for manual payment follow-up',
    subject: 'Follow-up: Invoice {{invoice_number}} payment...',
    isSystem: true,
    body: `<html><body style="font-family: Arial, sans-serif;">
  <p>Hello {{client_name}},</p>
  <p>I wanted to follow up on invoice <strong>{{invoice_number}}</strong> with a balance of <strong>{{invoice_balance}}</strong>.</p>
  <p><a href="{{payment_link}}">View Invoice</a></p>
  <p>{{user_name}}</p>
</body></html>`,
  },
  {
    name: 'Overdue – 7 Days',
    key: 'default_overdue_7_days',
    description: 'Sent 7 days after invoice becomes overdue',
    subject: 'URGENT: Invoice {{invoice_number}} is now {{days_overdue}} days overdue...',
    isSystem: true,
    body: `<html><body style="font-family: Arial, sans-serif;">
  <p>Hello {{client_name}},</p>
  <p>Invoice <strong>{{invoice_number}}</strong> is now <strong>{{days_overdue}} days overdue</strong>. Outstanding balance: <strong>{{invoice_balance}}</strong>.</p>
  <p>Please arrange payment immediately to avoid further issues.</p>
  <p><a href="{{payment_link}}" style="background: #DC2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Pay Now</a></p>
  <p>{{user_name}}<br>{{brand_name}}</p>
</body></html>`,
  },
]
