/**
 * Dynamic Lesson Page
 * 
 * NEXT.JS CONCEPT:
 * The folder name `[slug]` creates a Dynamic Route Segment. 
 * Next.js will pass the actual value of the URL segment into the page component via the `params` prop.
 * E.g., navigating to `/lessons/react-fundamentals` means `params.slug` will be `'react-fundamentals'`.
 * 
 * Since Next.js 15, `params` and `searchParams` are Promises and must be awaited.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Toc from '@/components/Toc';
import CodePlayground from '@/components/CodePlayground';
import { createClient } from '@/lib/supabase/server';

/**
 * Props for the dynamic page. 
 * In Next.js App Router, dynamic params are passed as a Promise.
 */
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Renders an individual lesson page.
 * This is an async Server Component, meaning we can fetch data directly inside it.
 * 
 * @param props - The page props containing the dynamic route params.
 * @returns The lesson page React element.
 */
export default async function LessonPage({ params }: PageProps) {
  // 1. Await the params Promise
  const resolvedParams = await params;
  
  // 2. Fetch data directly from Supabase
  let lesson = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('slug', resolvedParams.slug)
      .maybeSingle();

    if (!error && data) {
      lesson = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.content_markdown.split('\n')[0].replace(/[#*`_\-]/g, '').trim().substring(0, 150) || 'Click to start this lesson.',
        content_markdown: data.content_markdown,
        phase_number: data.phase_number
      };
    } else if (error) {
      console.error("Supabase returned an error fetching lesson:", error);
    }
  } catch (err) {
    console.error("Failed to fetch lesson from Supabase:", err);
  }

  // 3. Handle 404 automatically
  if (!lesson) {
    // Calling notFound() throws a special error that Next.js catches
    // and automatically renders the nearest `not-found.tsx` file.
    notFound();
    return null;
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
          ← Back to all lessons
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wide dark:bg-blue-900 dark:text-blue-300">
            Phase {lesson.phase_number}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {lesson.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 border-l-4 border-blue-500 pl-4">
          {lesson.description}
        </p>
      </header>

      {/* Client Component injected inside a Server Component */}
      <Toc />

      <div className="prose dark:prose-invert prose-blue max-w-none whitespace-pre-wrap">
        {lesson.content_markdown}
      </div>

      {/* Another Client Component for interactive playground */}
      <CodePlayground code={`export default function Demo() {\n  return (\n    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>\n      <h1>Hello from ${lesson.title}</h1>\n      <p>Try editing me!</p>\n    </div>\n  );\n}`} />
    </article>
  );
}
