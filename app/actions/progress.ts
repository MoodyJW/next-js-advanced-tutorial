/**
 * Server Action for Progress Tracking
 * 
 * NEXT.JS CONCEPT:
 * Server Actions are asynchronous server-side functions that can be invoked
 * directly from Client Components or forms. They are annotated with `"use server"`
 * at the top of the file or function block. Next.js manages generating the POST
 * endpoints and performing CSRF verification under the hood.
 */

"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Toggles the completion status of a lesson for the current authenticated user.
 * 
 * @param lessonId - The UUID of the lesson.
 * @param currentStatus - The current completed state (true = completed, false = incomplete).
 * @returns A promise resolving to a payload indicating success or failure.
 */
export async function toggleProgress(lessonId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient();

    // Fetch the current user from auth session
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fall back to a default mock user UUID for Phase 7 prior to authentication setup
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';

    if (currentStatus) {
      // If currently complete, toggle to incomplete by deleting the progress entry
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('lesson_id', lessonId);

      if (error) throw error;
    } else {
      // If currently incomplete, toggle to complete by inserting a new progress entry
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    // Revalidate paths to clear cache boundaries and refresh active components
    revalidatePath('/');
    revalidatePath(`/lessons/[slug]`);

    return { success: true, completed: !currentStatus };
  } catch (err: unknown) {
    console.error("Failed to mutate lesson progress:", err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown server error occurred' };
  }
}
