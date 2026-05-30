/**
 * Dynamic Lesson Page
 * 
 * NEXT.JS CONCEPT:
 * The folder name `[slug]` creates a Dynamic Route Segment. 
 * Next.js will pass the actual value of the URL segment into the page component via the `params` prop.
 * E.g., navigating to `/lessons/react-fundamentals` means `params.slug` will be `'react-fundamentals'`.
 * Since Next.js 15+, `params` and `searchParams` are Promises and must be awaited.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Toc, { TocHeading } from '@/components/Toc';
import CodePlayground from '@/components/CodePlayground';
import { createClient } from '@/lib/supabase/server';

/**
 * Rich detailed lesson section content mapped by slug.
 * Used to enrich database entries with dynamic headings and deep curricular material.
 */
const richContentMap: Record<string, string> = {
  'react-fundamentals': `## Introduction
React is a popular UI library for building component-based interfaces. Next.js is a React framework, meaning it extends React with features like routing, caching, and Server Components.

## Core Concepts
To master Next.js, you must first master these essential React patterns:
- Component Composition: Splitting large layouts into small, encapsulated components.
- Dynamic Props: Passing functions and data down the component tree.
- State Management: Using useState and useReducer for interactivity.
- Side Effects: Handling client-side operations inside useEffect.

## Interactive Example
Use the Sandpack playground below to experiment with component state. Notice how modifications instantly hot-reload in the preview frame!`,

  'routing-and-layouts': `## Introduction
Next.js App Router uses file-based routing where folders define paths and files define the user interfaces. This structure maps directly to clean, readable URLs.

## Core Concepts
Mastering App Router routing involves three primary structures:
- Dynamic Routing: Using folder names like [slug] to capture wildcard parameters.
- Nested Layouts: Utilizing layout.tsx files to share components across pages.
- Loading & Error Segments: Adding local loading.tsx and error.tsx handlers to recover from failures.

## Interactive Example
Try editing the routes and nested structures inside the playground. Experiment with different layout configurations to see how subpages inherit their shared elements.`,

  'server-components': `## Introduction
React Server Components (RSC) represent a paradigm shift in how we build React applications. In Next.js, components are Server Components by default.

## Core Concepts
Understanding the division between client and server boundaries is critical:
- Server Execution: Server Components execute only on the server, sending zero JavaScript to the browser.
- Client Opt-In: Adding the "use client" directive at the top of a file imports interactivity (hooks, event listeners) to the client.
- Optimal Composition: Fetching data on the server, and injecting client interactive modules lower in the render tree.

## Interactive Example
Experiment with the server-vs-client layout in the Sandpack playground below. Observe how state behaves when the boundary is placed strategically.`
};

/**
 * Simple markdown helper to render basic structured tutorial content in Server Components.
 * 
 * @param content - The raw markdown text content.
 * @returns React elements mapping the parsed markdown structure.
 */
function renderMarkdown(content: string) {
  return content.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h3 key={idx} id={id} className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-200">
          {text}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h2 key={idx} id={id} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">
          {text}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      const text = trimmed.substring(2).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h1 key={idx} id={id} className="text-3xl font-extrabold mt-10 mb-6 text-gray-900 dark:text-white">
          {text}
        </h1>
      );
    }
    if (trimmed.startsWith('- ')) {
      const text = trimmed.substring(2).trim();
      return (
        <li key={idx} className="ml-6 list-disc text-gray-700 dark:text-gray-300 mb-1">
          {text}
        </li>
      );
    }
    if (trimmed === '') {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {line}
      </p>
    );
  });
}

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
      let contentMarkdown = data.content_markdown;

      // Enrich database entries with rich subheadings if not already present
      if (!contentMarkdown.includes('##') && richContentMap[data.slug]) {
        contentMarkdown = `${contentMarkdown}\n\n${richContentMap[data.slug]}`;
      }

      lesson = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: contentMarkdown.split('\n')[0].replace(/[#*`_\-]/g, '').trim().substring(0, 150) || 'Click to start this lesson.',
        content_markdown: contentMarkdown,
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

  // 4. Parse headings for the dynamic Table of Contents
  const headings: TocHeading[] = lesson.content_markdown
    .split('\n')
    .filter(line => line.startsWith('## ') || line.startsWith('### '))
    .map(line => {
      const isSub = line.startsWith('### ');
      const text = line.replace(isSub ? '### ' : '## ', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { id, text, level: isSub ? 3 : 2 };
    });

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

      {/* Dynamic Client Component Table of Contents */}
      <Toc headings={headings} />

      {/* Beautiful dynamic semantic markdown renderer */}
      <div className="prose dark:prose-invert prose-blue max-w-none mb-10">
        {renderMarkdown(lesson.content_markdown)}
      </div>

      {/* Interactive Sandpack Playground Client Component */}
      <CodePlayground code={`export default function Demo() {\n  return (\n    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>\n      <h1>Hello from ${lesson.title}</h1>\n      <p>Try editing me!</p>\n    </div>\n  );\n}`} />
    </article>
  );
}
