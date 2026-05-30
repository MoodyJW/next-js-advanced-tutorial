/**
 * Supabase Server Client Utility
 * 
 * NEXT.JS CONCEPT:
 * To interact with Supabase securely in Next.js Server Components, Server Actions,
 * and Route Handlers, we must instantiate a client that can read/write cookies.
 * We use `@supabase/ssr` to configure cookie-based session tracking.
 * Since Next.js 15+, cookies must be awaited as they are returned inside a Promise.
 */

import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

/**
 * Creates an authenticated Supabase client for use on the server side.
 * It automatically reads and configures browser cookies for the user session.
 * 
 * @returns A promise resolving to the typed Supabase server client.
 * @example
 * ```ts
 * const supabase = await createClient();
 * const { data: lessons } = await supabase.from('lessons').select('*');
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  // Validate environment variables are present
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Creates a public, cookie-free Supabase client.
 * This is ideal for static generation, generateStaticParams, and public content fetching
 * because it does not read headers or cookies and will not force routes into dynamic rendering.
 * 
 * @returns The typed Supabase public client.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
