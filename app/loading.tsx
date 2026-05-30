/**
 * Root Loading Boundary - Renders a skeleton loader during navigation.
 * 
 * NEXT.JS CONCEPT:
 * The `loading.tsx` file convention automatically wraps the route page segment
 * inside a React `<Suspense>` boundary. The server immediately streams this fallback
 * UI to the client, improving perceived load performance.
 */

export default function RootLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <section className="py-10 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
      </section>

      {/* Grid of Card Skeletons */}
      <section className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="p-6 bg-white border border-gray-100 rounded-xl space-y-4 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 pt-2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
