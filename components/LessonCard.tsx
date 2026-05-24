/**
 * LessonCard component - Displays a summary of a single lesson.
 * 
 * NEXT.JS CONCEPT: 
 * This is a standard React component. In Next.js App Router, components inside 
 * the `app/` directory or imported into it are Server Components by default 
 * unless they use the `"use client"` directive. This means this component will
 * be rendered on the server, sending only pure HTML to the browser.
 */

import Link from 'next/link';

/**
 * Interface defining the expected props for the LessonCard component.
 * We use explicit types instead of `any` for strict type safety.
 */
export interface LessonCardProps {
  /** The unique slug of the lesson, used for the URL (e.g., 'react-fundamentals') */
  slug: string;
  /** The title of the lesson */
  title: string;
  /** A brief description of what the lesson covers */
  description: string;
  /** The chronological phase number of the lesson */
  phaseNumber: number;
}

/**
 * Renders a card linking to a specific lesson.
 * 
 * @param props - {@link LessonCardProps}
 * @returns A React element representing the lesson card.
 * 
 * @example
 * ```tsx
 * <LessonCard 
 *   slug="react-fundamentals" 
 *   title="React Basics" 
 *   description="Learn React." 
 *   phaseNumber={1} 
 * />
 * ```
 */
export default function LessonCard({ slug, title, description, phaseNumber }: LessonCardProps) {
  return (
    // Link from next/link is used for client-side navigation between pages
    <Link 
      href={`/lessons/${slug}`} 
      className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold dark:bg-blue-900 dark:text-blue-300">
          {phaseNumber}
        </span>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
      
      <div className="mt-4 text-blue-600 font-medium text-sm hover:underline dark:text-blue-400">
        Start Lesson →
      </div>
    </Link>
  );
}
