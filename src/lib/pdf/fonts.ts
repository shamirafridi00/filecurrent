// Font registration is intentionally disabled.
// @react-pdf/renderer fetches fonts from remote URLs at render time, which
// causes timeouts in Vercel serverless functions. We use the built-in
// Helvetica font (always available, no network fetch required).
export function registerFonts() {}
