/**
 * RelatedLessons Component - Server-side component fetching and rendering related lessons.
 * 
 * NEXT.JS CONCEPT:
 * This component fetches data on the server in isolation. By wrapping it in `<Suspense>`
 * in the parent page component, Next.js can stream the main page layout instantly while
 * this component loads its data independently in the background.
 */

import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';

/**
 * Interface defining the props for the RelatedLessons component.
 */
export interface RelatedLessonsProps {
  /** The slug of the current lesson to exclude from the related list */
  currentSlug: string;
}

/**
 * Renders a list of alternative lessons to explore.
 * An async Server Component executing database queries directly.
 */
export default async function RelatedLessons({ currentSlug }: RelatedLessonsProps) {
  let lessons: { slug: string; title: string; phase_number: number }[] = [];

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('lessons')
      .select('slug, title, phase_number')
      .neq('slug', currentSlug)
      .limit(2);

    if (data) {
      lessons = data;
    }
  } catch (err) {
    console.error("Failed to fetch related lessons:", err);
  }

  if (lessons.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        What to Learn Next
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/lessons/${lesson.slug}`}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-400"
          >
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
              Phase {lesson.phase_number}
            </span>
            <h5 className="font-semibold text-gray-900 dark:text-white mt-1">
              {lesson.title}
            </h5>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * A local skeleton loader specifically tailored to RelatedLessons' shape.
 * Exported so the parent page can use it inside the `<Suspense fallback={...}>` block.
 */
export function RelatedLessonsSkeleton() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
