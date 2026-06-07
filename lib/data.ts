/**
 * Data Fetching Utilities
 * 
 * NEXT.JS CONCEPT:
 * Centralizing data access functions keeps Server Components clean and makes them easier to unit test.
 * These functions securely query Supabase on the server.
 */

import { createPublicClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

type LessonRow = Database['public']['Tables']['lessons']['Row'];

/**
 * Fetches all published lessons, ordered by phase number.
 */
export async function getLessons(): Promise<LessonRow[]> {
  // Use createPublicClient if the data is public and we don't want to opt into dynamic rendering
  // Use createClient if RLS requires an authenticated user's cookies.
  // Our lessons table allows public read access for published lessons, 
  // so we'll use createPublicClient to keep the route cacheable by default.
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('is_published', true)
    .order('phase_number', { ascending: true });

  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetches a single published lesson by its slug.
 */
export async function getLessonBySlug(slug: string): Promise<LessonRow | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error(`Error fetching lesson ${slug}:`, error);
    return null;
  }

  return data;
}

/**
 * Fetches all comments for a given lesson.
 */
export async function getComments(lessonId: string) {
  // Use public client since anyone can read comments
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}
