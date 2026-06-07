"use client";

import { useActionState } from 'react';
import { postComment } from '@/app/actions/comments';

/**
 * Client Component for submitting a comment.
 * 
 * NEXT.JS CONCEPT:
 * We use a Client Component here so we can leverage `useActionState` (or `useFormStatus`)
 * to show a loading state and handle form reset upon successful submission.
 */
export default function CommentForm({ lessonId }: { lessonId: string }) {
  // Bind the lessonId to the Server Action
  const submitWithId = postComment.bind(null, lessonId);
  const [state, formAction, isPending] = useActionState(submitWithId, null);

  return (
    <form action={formAction} className="mt-6">
      <textarea
        name="content"
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        rows={3}
        placeholder="Add a comment..."
        required
      />
      
      {state?.error && (
        <p className="text-red-600 text-sm mt-2">{state.error}</p>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-3 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isPending ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
