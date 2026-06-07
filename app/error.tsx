"use client";

/**
 * Global Error Boundary
 * 
 * NEXT.JS CONCEPT:
 * `error.tsx` files must be Client Components (`"use client"`). They automatically
 * wrap a route segment and its nested children in a React Error Boundary. 
 * If any component inside throws an error during rendering or hydration, 
 * this UI replaces the crashed segment.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-red-100 dark:border-red-900/50 p-8 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Oops, something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We encountered an unexpected error while trying to load this page. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
