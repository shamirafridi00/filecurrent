export function hasSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return Boolean(
    url &&
      anonKey &&
      url !== 'your_supabase_url' &&
      anonKey !== 'your_supabase_anon_key' &&
      URL.canParse(url)
  )
}
