/**
 * Not Found Page
 * 
 * NEXT.JS CONCEPT:
 * The `not-found.tsx` file is a special Next.js convention.
 * It renders when the `notFound()` function is thrown from a route segment, 
 * or when a URL doesn't match any routes.
 * 
 * Since this is placed in `app/lessons/[slug]`, it specifically handles 
 * 404s for the lessons route (e.g., when a lesson slug doesn't exist).
 */

import Link from 'next/link';

/**
 * Renders the custom 404 UI for lessons.
 * 
 * @returns The Not Found React element.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Lesson Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        We couldn&apos;t find the lesson you were looking for. It may have been moved, deleted, or you might have mistyped the URL.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Return to Lessons
      </Link>
    </div>
  );
}
