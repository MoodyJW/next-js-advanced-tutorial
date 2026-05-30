/**
 * Home Page - The root route of the application ('/').
 * 
 * NEXT.JS CONCEPT:
 * In the App Router, `page.tsx` is the UI unique to a route. 
 * This file maps to the `/` URL path. By default, it's a Server Component.
 */

import LessonCard from "@/components/LessonCard";
import { createClient } from "@/lib/supabase/server";

/**
 * Renders the home page displaying a list of lessons.
 * 
 * @returns The home page React element.
 */
export default async function HomePage() {
  let upcomingLessons: {
    slug: string;
    title: string;
    description: string;
    phaseNumber: number;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('slug, title, content_markdown, phase_number')
      .order('phase_number', { ascending: true });

    if (error) {
      console.error("Supabase returned an error fetching lessons:", error);
    } else if (data) {
      upcomingLessons = data.map(l => ({
        slug: l.slug,
        title: l.title,
        description: l.content_markdown.split('\n')[0].replace(/[#*`_\-]/g, '').trim().substring(0, 150) || 'Click to start this lesson.',
        phaseNumber: l.phase_number
      }));
    }
  } catch (err) {
    console.error("Failed to fetch lessons from Supabase:", err);
  }

  return (
    <div className="space-y-8">
      <section className="py-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to the Next.js Meta-Tutorial
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          You are looking at a Next.js app that teaches Next.js. 
          Select a lesson below to begin.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Upcoming Lessons
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Map over our data and render a LessonCard for each */}
          {upcomingLessons.map((lesson) => (
            <LessonCard 
              key={lesson.slug}
              slug={lesson.slug}
              title={lesson.title}
              description={lesson.description}
              phaseNumber={lesson.phaseNumber}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
