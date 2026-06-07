"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Posts a new comment to a lesson.
 * 
 * @param lessonId - The UUID of the lesson.
 * @param state - The previous state from useActionState.
 * @param formData - The submitted form data.
 */
export async function postComment(lessonId: string, state: unknown, formData: FormData) {
  const content = formData.get('content') as string;

  if (!content || content.trim() === '') {
    return { error: 'Comment cannot be empty.' };
  }

  const supabase = await createClient();

  // Get the currently authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be logged in to post a comment.' };
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      lesson_id: lessonId,
      user_id: user.id,
      content: content.trim(),
    });

  if (error) {
    console.error('Error posting comment:', error);
    return { error: 'Failed to post comment. Please try again.' };
  }

  // Revalidate the lesson page so the new comment appears instantly
  revalidatePath('/lessons/[slug]', 'page');
  return { success: true };
}
