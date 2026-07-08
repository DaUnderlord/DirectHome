/** Whether mock data fallback is allowed when the database is empty/unavailable. */
export const allowMockDataFallback =
  import.meta.env.DEV ||
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Supabase project URL — required in production builds. */
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/** Supabase anon key — required in production builds. */
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Mapbox access token for map components. */
export const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
