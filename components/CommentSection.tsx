import { getComments } from '@/lib/data';
import CommentForm from './CommentForm';
import { createClient } from '@/lib/supabase/server';

/**
 * Server Component displaying the comment section.
 * 
 * NEXT.JS CONCEPT:
 * This component fetches data directly on the server.
 * It renders a list of comments, and embeds a Client Component (`CommentForm`) 
 * for the interactive submission process.
 */
export default async function CommentSection({ lessonId }: { lessonId: string }) {
  const comments = await getComments(lessonId);
  
  // Check if the user is authenticated to decide whether to show the form
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Discussion
      </h3>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map((comment: { id: string, content: string, created_at: string }) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  User
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {user ? (
        <CommentForm lessonId={lessonId} />
      ) : (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
          <p className="text-blue-800 dark:text-blue-300">
            You must be logged in to post a comment.
          </p>
        </div>
      )}
    </div>
  );
}
