/**
 * MarkCompleteButton Component - Client Component that invokes a Server Action.
 * 
 * NEXT.JS CONCEPT:
 * This component is annotated with `"use client"` because it manages local state
 * (`useState`) and transitions (`useTransition`) in response to direct user clicks.
 * It invokes the Server Action `toggleProgress` asynchronously.
 */

"use client";

import { useState, useTransition } from 'react';
import { toggleProgress } from '@/app/actions/progress';

/**
 * Props for the MarkCompleteButton component.
 */
export interface MarkCompleteButtonProps {
  /** The UUID of the lesson to track progress for */
  lessonId: string;
  /** The initial completion status fetched on the server */
  initialCompleted: boolean;
}

/**
 * Renders a button allowing users to toggle completion status of a lesson.
 * Invokes the toggleProgress Server Action securely.
 * 
 * @param props - {@link MarkCompleteButtonProps}
 * @returns An interactive Client Component button.
 */
export default function MarkCompleteButton({ lessonId, initialCompleted }: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // startTransition allows React to track loading states during async server actions
    startTransition(async () => {
      const res = await toggleProgress(lessonId, completed);
      if (res.success) {
        setCompleted(res.completed!);
      } else {
        alert("Failed to update progress: " + (res.error || 'Unknown error'));
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${
        completed
          ? 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800'
          : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800'
      }`}
    >
      {completed ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {isPending ? 'Updating...' : 'Completed'}
        </>
      ) : (
        <>
          {isPending ? 'Marking...' : 'Mark as Complete'}
        </>
      )}
    </button>
  );
}
