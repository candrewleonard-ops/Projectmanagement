// Server-side Supabase client. Use in Server Components,
// Route Handlers, and Server Actions. Reads/writes auth cookies.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore
            // when middleware is also refreshing the session.
          }
        },
      },
    }
  );
}

/**
 * Returns the current user's primary org_id, or null.
 * Use as the first call in any server-side data fetch
 * so you can `eq('org_id', orgId)` on queries.
 */
export async function getCurrentOrgId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('memberships')
    .select('org_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return (data as { org_id: string }).org_id;
}
