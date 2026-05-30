/**
 * Specialized Dynamic Lesson Page Loading Boundary
 * 
 * NEXT.JS CONCEPT:
 * Placing `loading.tsx` inside a dynamic route segment `/lessons/[slug]/`
 * provides a custom styled skeleton matching the exact structural layout
 * of the dynamic page, delivering clean page transitions.
 */

export default function LessonLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-pulse">
      {/* Back Link Skeleton */}
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />

      {/* Header Info Skeleton */}
      <header className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
        <div className="border-l-4 border-gray-200 pl-4 space-y-2 dark:border-gray-700">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </header>

      {/* Collapsible TOC Box Skeleton */}
      <div className="h-14 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700" />

      {/* Structured Content Skeleton */}
      <div className="space-y-6">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 border-b pb-2 dark:border-gray-700" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 border-b pb-2 dark:border-gray-700" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
        </div>
      </div>

      {/* Sandpack Playground Box Skeleton */}
      <div className="h-[400px] bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700" />
    </div>
  );
}
