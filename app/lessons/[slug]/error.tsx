"use client";

/**
 * Localized Error Boundary for Dynamic Lesson Pages
 * 
 * NEXT.JS CONCEPT:
 * Error boundaries are scoped to their route segment. If an error occurs inside
 * `app/lessons/[slug]/page.tsx` (e.g. Supabase is down), this localized UI is rendered
 * *inside* the main layout. The navigation header and sidebar remain fully interactive,
 * allowing the user to seamlessly recover or navigate away without a full page crash.
 */

import { useEffect } from "react";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Lesson loading failed:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
          Failed to load lesson content
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300 mb-8 max-w-md mx-auto">
          We couldn&apos;t retrieve the lesson data from our database. This could be a temporary network issue.
        </p>
        <button
          onClick={() => reset()}
          className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/40 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold py-2 px-6 rounded-lg transition-colors border border-yellow-300 dark:border-yellow-700"
        >
          Reload Lesson
        </button>
      </div>
    </div>
  );
}
