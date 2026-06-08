# FileCurrent — Design System & UI Standards
**Purpose:** Single source of truth for visual consistency across all dashboard pages.
**Stack:** Next.js 14 · Tailwind CSS · shadcn/ui · Phosphor Icons
**Theme:** Stripe-inspired — navy sidebar (`#0A2540`), white cards, indigo primary (`#635BFF`)

---

## Table of Contents
1. [Color Tokens](#1-color-tokens)
2. [Typography Scale](#2-typography-scale)
3. [Spacing Scale](#3-spacing-scale)
4. [Button System](#4-button-system)
5. [Card System](#5-card-system)
6. [Badge & Status System](#6-badge--status-system)
7. [Page Layout Pattern](#7-page-layout-pattern)
8. [Stat Cards](#8-stat-cards)
9. [Data Tables](#9-data-tables)
10. [Empty States](#10-empty-states)
11. [Interactive States](#11-interactive-states)
12. [Icons](#12-icons)
13. [Inconsistencies Found (Current Codebase)](#13-inconsistencies-found-current-codebase)
14. [Improvement Backlog](#14-improvement-backlog)

---

## 1. Color Tokens

All colors defined as CSS variables in `src/app/globals.css`. **Never use raw hex values in components — always use semantic token classes.**

### Semantic Tokens (Tailwind classes)
| Token | Tailwind Class | Hex Value | Use |
|---|---|---|---|
| Primary | `bg-primary` / `text-primary` | `#635BFF` | CTAs, links, active nav, accents |
| Primary foreground | `text-primary-foreground` | `#FFFFFF` | Text on primary bg |
| Background | `bg-background` | `#F6F9FC` | Page background |
| Card | `bg-card` | `#FFFFFF` | Card backgrounds |
| Foreground | `text-foreground` | `#0A2540` | Primary body text |
| Muted | `text-muted-foreground` | `#8898AA` | Secondary text, labels, helpers |
| Border | `border-border` | `#E6EBF1` | Card borders, dividers |
| Success | `text-[#1DB954]` | `#1DB954` | Paid status, positive values |
| Warning | `text-[#E6A817]` | `#E6A817` | Pending, overdue, trial warning |
| Destructive | `text-destructive` | `#DF1B41` | Delete, errors |
| Accent | `bg-accent` | `#F0EFFF` | Icon backgrounds, soft highlights |

### Sidebar-specific tokens
| Token | Value | Use |
|---|---|---|
| `#0A2540` | Sidebar background | Never use elsewhere |
| `#1A3A5C` | Active nav item bg | Sidebar only |
| `#8898AA` | Sidebar default text | Sidebar only |

### ❌ Anti-patterns
```
❌ className="bg-[#635BFF]"          → ✅ className="bg-primary"
❌ className="text-[#0A2540]"        → ✅ className="text-foreground"
❌ className="border-[#E6EBF1]"      → ✅ className="border-border"
❌ className="text-[#8898AA]"        → ✅ className="text-muted-foreground"
```
**Exception:** Sidebar colors (`#0A2540`, `#1A3A5C`) are sidebar-specific and acceptable as raw hex in Sidebar.tsx only.

---

## 2. Typography Scale

| Use Case | Classes | Example |
|---|---|---|
| Page title | `text-2xl font-bold tracking-tight text-foreground` | "Payment Reminders" |
| Section title (card) | `text-base font-semibold text-foreground` | "Recent Invoices" |
| Sub-section title | `text-sm font-semibold text-foreground` | "Payment History" |
| Body text | `text-sm text-foreground` | Table cells, descriptions |
| Secondary / helper | `text-sm text-muted-foreground` | Subtitles, captions |
| Tiny label | `text-xs text-muted-foreground` | Date stamps, invoice numbers |
| Stat value | `text-2xl font-bold` | "$12,450" |
| Stat label | `text-xs font-semibold uppercase tracking-wide text-muted-foreground` | "TOTAL INVOICED" |
| Table header | `text-xs font-semibold uppercase tracking-wide text-slate-500` | Column heads |
| Link | `text-sm font-medium text-primary hover:underline` | "View All →" |

---

## 3. Spacing Scale

Use **only these values** — no arbitrary px values.

| Token | Value | When to use |
|---|---|---|
| `gap-2` | 8px | Tight groups (icon + text, badge row) |
| `gap-3` | 12px | Activity items, form field gap |
| `gap-4` | 16px | Card grid gap (default) |
| `gap-5` | 20px | Section-level gaps |
| `gap-6` | 24px | Between major page sections |
| `p-3` | 12px | Compact card content, table rows |
| `p-4` | 16px | Alert banners, small cards |
| `p-5` | 20px | Standard card padding |
| `p-6` | 24px | Large card padding (How It Works, settings) |
| `mb-6` | 24px | Below PageHeader (standard) |
| `space-y-5` | 20px | Between page sections |

---

## 4. Button System

### Standard variants — use `<Button>` from `@/components/ui/button` directly
| Variant | shadcn variant | When to use | Example |
|---|---|---|---|
| **Primary** | `default` (no variant prop) | Main CTA, most important action per section | "New Invoice", "Save" |
| **Outline** | `variant="outline"` | Secondary action alongside primary | "Add Client", "Settings" |
| **Ghost** | `variant="ghost"` | Tertiary / nav-like action | "Import Clients", "Cancel" |
| **Destructive** | `variant="destructive"` | Delete / danger only | "Delete Invoice" |

### Sizes
| Size | When | Classes |
|---|---|---|
| Default | Most actions | No size prop |
| `sm` | Inline actions, card headers | `size="sm"` |
| `icon` | Icon-only buttons | `size="icon"` |

### Rules
- **One primary button per section.** Two blue buttons side-by-side = wrong.
- Action bar order: `[Primary] [Primary] [Outline] [Ghost]` — ghost always last
- Button labels are **sentence case** — "New Contract", NOT "NEW CONTRACT"
- Icon in button: `<Icon className="mr-1.5 h-4 w-4" />` — always `mr-1.5` not `mr-1` or `mr-2`
- asChild for `<Link>`: `<Button asChild><Link href="...">Label</Link></Button>`

### ❌ Current problem in codebase
```tsx
// dashboard/page.tsx line 107-128
// Two default (primary) buttons + one outline is fine
// But: "Import Clients" is ghost/sm — inconsistent size in same row
// Fix: make all action bar buttons same size (default)
```

---

## 5. Card System

### Standard card structure
```tsx
// ✅ Use shadcn Card primitives directly — never nest Card inside Card
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
    <CardTitle className="flex items-center gap-2 text-base">
      <Icon size={16} />
      Section Title
    </CardTitle>
    <Link href="..." className="text-sm font-medium text-primary hover:underline">
      View All →
    </Link>
  </CardHeader>
  <CardContent className="space-y-2 pt-0">
    {/* content */}
  </CardContent>
</Card>
```

### Card padding rules
| Card type | Padding |
|---|---|
| Standard dashboard card | `CardContent` default (p-6) or `pt-0` after header |
| Stat card | `p-5` in CardContent |
| Compact list item inside card | `p-3` on the item div |
| Settings / large form card | `p-6` |

### Card borders & shadows
- All cards: default `border border-border` from shadcn — no custom border colors
- Shadow: `shadow-sm` only on StatCards — no shadow on regular cards
- Hover on clickable cards: `hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer`

### ❌ Current inconsistency
```
reminders/page.tsx uses inline-styled cards: border-slate-200, rounded-xl, p-5
dashboard/page.tsx uses shadcn <Card> components
→ Both should use shadcn <Card> with consistent classes
```

---

## 6. Badge & Status System

### Invoice status — `<InvoiceBadge status={...} />` from `@/components/ui`
| Status | Colors (via getInvoiceStatusConfig) |
|---|---|
| `draft` | Gray |
| `sent` | Blue/indigo |
| `partial` | Amber |
| `paid` | Green |
| `overdue` | Red |

### Contract status — `<ContractBadge status={...} />` from `@/components/ui`
| Status | Colors |
|---|---|
| `draft` | Gray |
| `sent` | Blue |
| `opened` | Purple |
| `signed` | Green |

### Custom inline badges (when not using InvoiceBadge/ContractBadge)
```tsx
// ✅ Standard pattern
<span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-[#EEF2FF] text-[#4F6AE6] border-[#C7D2FE]">
  Sent
</span>
```

### ❌ Anti-pattern
```tsx
// ❌ Don't mix Badge component with inline span styled differently on same page
```

---

## 7. Page Layout Pattern

### Every dashboard page follows this structure:
```tsx
export default async function SomePage() {
  return (
    <div>
      {/* 1. Page Header — always mb-6 */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Icon size={24} weight="duotone" className="text-primary" />
            Page Title
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            One-line subtitle
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/..."><Icon className="mr-1.5 h-4 w-4" />Action</Link>
        </Button>
      </div>

      {/* 2. Content sections — space-y-5 between them */}
      <div className="space-y-5">
        {/* ... */}
      </div>
    </div>
  )
}
```

**OR** use `<PageHeader>` component from `@/components/ui` which wraps this pattern.

### Content grid rules
| Columns | When |
|---|---|
| `grid-cols-1 sm:grid-cols-3` | 3 primary stat cards |
| `grid-cols-2 sm:grid-cols-4` | 4 secondary stat cards |
| `grid-cols-1 lg:grid-cols-2` | Side-by-side content cards |
| `grid-cols-1 md:grid-cols-3` | Action/feature cards (reminders) |
| `xl:grid-cols-[1fr_300px]` | Main content + sidebar (invoice detail) |

---

## 8. Stat Cards

### Two styles currently in use:

**Primary stats (left-border accent):**
```tsx
<StatCard
  label="Total Invoiced"
  value={formatCurrency(stats.totalInvoiced)}
  subValue="12 pending"
  accent="border-l-[#635BFF]"
  accentPosition="left"   // default
/>
```

**Secondary stats (top-border accent):**
```tsx
<StatCard
  label="Active Clients"
  value="24"
  accent="border-t-[#635BFF]"
  accentPosition="top"
/>
```

### Accent color assignments (consistent — never swap)
| Metric | Color | Hex |
|---|---|---|
| Revenue / Invoiced / Primary | Indigo | `#635BFF` |
| Paid / Positive | Green | `#1DB954` |
| Outstanding / Warning | Amber | `#E6A817` |
| Drafts / Neutral | Gray | `#8898AA` |
| Contracts / Signed | Indigo | `#635BFF` |

---

## 9. Data Tables

### Standard table pattern (used in reminders/page.tsx)
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-border">
        <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Column
        </th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
          <td className="px-6 py-3 text-sm text-foreground">value</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Rules
- Header: always `border-b border-border` (not `border-slate-100`)
- Row hover: `hover:bg-muted/30` (not `hover:bg-slate-50`)
- Cell padding: `px-6 py-3` — consistent everywhere
- Text in cells: `text-sm text-foreground` for data, `text-sm text-muted-foreground` for secondary

---

## 10. Empty States

Use `<EmptyState>` from `@/components/ui`:
```tsx
<EmptyState
  icon={<Bell size={40} weight="duotone" className="text-muted-foreground" />}
  title="No reminders sent yet"
  description="Reminders will appear here once sent"
  action={<Button asChild><Link href="...">Take action</Link></Button>}
/>
```

**Rules:**
- Icon: always `size={40}` weight `"duotone"` color `text-muted-foreground`
- Title: `font-medium text-foreground`
- Description: `text-sm text-muted-foreground`

---

## 11. Interactive States

Every interactive element must have ALL of these:
```
hover:    → visual feedback (background or border change)
focus:    → ring (handled by shadcn by default)
active:   → slightly darker
disabled: → opacity-50 cursor-not-allowed (shadcn default)
```

### Transition rule
All transitions: `transition-colors duration-150` — nothing slower, nothing custom.

---

## 12. Icons

Provider: `@phosphor-icons/react` (dashboard) + `@phosphor-icons/react/dist/ssr` (server components)

### Size standards
| Context | Size |
|---|---|
| Page title icon | `size={24}` |
| Card title icon | `size={16}` |
| Button icon | `h-4 w-4` (className, not size prop) |
| Stat/feature card icon | `size={20}` |
| Activity feed icon | `h-4 w-4` |
| Empty state icon | `size={40}` |
| Sidebar nav icon | `size={18}` |

### Weight rules
| State | Weight |
|---|---|
| Page title / decorative | `weight="duotone"` |
| Sidebar active | `weight="fill"` |
| Sidebar inactive | `weight="regular"` |
| Inside buttons | `weight="regular"` (default) |

---

## 13. Inconsistencies Found (Current Codebase)

### HIGH — Visual inconsistency visible to users

| # | File | Problem | Fix |
|---|---|---|---|
| 1 | `reminders/page.tsx` | Cards use raw `border-slate-200 rounded-xl` instead of `<Card>` shadcn component | Replace with `<Card>` |
| 2 | `dashboard/page.tsx` L106-129 | Button row: two `default` + one `outline` + one `ghost size="sm"` — size mismatch | Make "Import Clients" `variant="ghost"` no size override |
| 3 | `reminders/page.tsx` table | `border-slate-100` / `hover:bg-slate-50` instead of semantic tokens | Use `border-border/50` / `hover:bg-muted/30` |
| 4 | Multiple pages | Links use `text-primary hover:underline` in some places, `text-foreground hover:text-primary` in others | Standardize: `text-primary hover:underline` for all card links |
| 5 | `dashboard/page.tsx` | Recent Invoices link uses `text-primary` but Recent Contracts link uses `text-foreground hover:text-primary` | Both should use `text-primary hover:underline` |

### MEDIUM — Code inconsistency, minor visual impact

| # | File | Problem |
|---|---|---|
| 6 | `ui/index.tsx` | `Button` wrapper has legacy `LegacyButtonVariant` type — code importing this instead of shadcn `Button` directly gets wrong API |
| 7 | Multiple pages | Some use `<PageHeader>` component, others manually write the header HTML |
| 8 | `reminders/page.tsx` | `rounded-xl` on cards, rest of app uses `rounded-lg` (shadcn default) |

### LOW — Nice to fix, not urgent

| # | Problem |
|---|---|
| 9 | No loading skeletons on dashboard stat cards — page shift on hydration |
| 10 | Activity feed uses raw `<div>` wrappers instead of `<EmptyState>` |
| 11 | `dashboard/page.tsx` — trial banner inline styled, not using design token classes |

---

## 14. Improvement Backlog

Ordered by impact vs effort ratio.

### Tier 1 — High impact, low effort
- [ ] **Fix link color inconsistency** — all card-level links to `text-primary hover:underline`
- [ ] **Fix reminders page** — replace raw div cards with `<Card>` + semantic border/hover tokens
- [ ] **Fix button row on dashboard** — remove `size="sm"` from ghost button for visual alignment
- [ ] **Fix table tokens** — `border-slate-100` → `border-border/50`, `hover:bg-slate-50` → `hover:bg-muted/30`

### Tier 2 — High impact, moderate effort
- [ ] **Dashboard quick-action cards** — Add 3 "quick action" cards below stat row: New Invoice, New Contract, View Reminders — each with icon, label, and hover state (like reminders page cards)
- [ ] **Welcome greeting** — Show `Good morning, [name]` at top of dashboard using `profile.fullName`
- [ ] **Dashboard "This month" revenue card** — Replace generic "Total Invoiced" with current month revenue + % change vs last month
- [ ] **Recent activity feed improvement** — Group by day (Today, Yesterday, Earlier), show richer context

### Tier 3 — Polish, lower urgency
- [ ] **Skeleton loaders** — Add `<Skeleton>` to stat cards while loading
- [ ] **Transition on nav hover** — Ensure `transition-colors duration-150` on all nav items (already done in Sidebar)
- [ ] **Consistent empty state component** — Replace all manual empty state HTML with `<EmptyState>`
- [ ] **Consistent PageHeader usage** — All pages use `<PageHeader>` instead of manual heading HTML

---

## Reference: shadcn/ui Components in Use

```
accordion, alert, alert-dialog, avatar, badge, button, card,
checkbox, command, dialog, dropdown-menu, form, input, label,
popover, progress, radio-group, scroll-area, select, separator,
sheet, skeleton, sonner, switch, table, tabs, textarea, tooltip
```

Import pattern: `import { ComponentName } from '@/components/ui/component-name'`

---

*This document is the design reference for FileCurrent. Update when adding new patterns or fixing inconsistencies.*
*Last updated: 2026-06-08*
