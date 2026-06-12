// Human-readable URLs without weakening security — the industry-standard
// hybrid used by Notion ("My-Page-8a3f9c…"), Figma, and Stripe-hosted pages:
// a cosmetic slug is prefixed to the unguessable token and IGNORED on lookup.
//
//   /portal/jane-cooper--7c0e4f…      (was /portal/7c0e4f…)
//   /sign/website-design--a1b2c3…     (was /sign/a1b2c3…)
//   /clients/jane-cooper--54fff1…     (was /clients/54fff1…)
//
// The part after the LAST `--` is the real token/id; everything before it is
// display-only. Old plain-token links keep working (no `--` → whole param is
// the token). No schema change, nothing becomes enumerable.

const DELIMITER = '--'

/** URL-safe slug from a display name. Never produces `--` (dashes collapse). */
export function slugifyName(name: string, maxLength = 40): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')   // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')        // non-alphanumerics → single dash
    .replace(/^-+|-+$/g, '')            // trim dashes
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}

/** Build a readable URL param: `jane-cooper--{token}` (or just token if no name). */
export function withSlug(name: string | null | undefined, token: string): string {
  const slug = name ? slugifyName(name) : ''
  return slug ? `${slug}${DELIMITER}${token}` : token
}

/** Extract the real token/id from a (possibly slugged) URL param. */
export function extractToken(param: string): string {
  const decoded = decodeURIComponent(param)
  const idx = decoded.lastIndexOf(DELIMITER)
  return idx === -1 ? decoded : decoded.slice(idx + DELIMITER.length)
}
