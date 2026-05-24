/**
 * Mock Data for Lessons
 * 
 * NEXT.JS CONCEPT:
 * In a real app, this data would come from a database (like Supabase, which we will use in Phase 4).
 * We are using a mock array here to demonstrate Server Component data fetching. 
 * Server Components can safely execute async code and read from databases or file systems directly.
 */

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_markdown: string;
  phase_number: number;
}

export const mockLessons: Lesson[] = [
  {
    id: '1',
    slug: 'react-fundamentals',
    title: 'React Fundamentals for Next.js',
    description: 'Review the React concepts necessary for modern Next.js development.',
    content_markdown: 'Welcome to the fundamentals! \n\nBefore diving deep into Next.js, you must understand React. Next.js is built on top of React. \n\nKey concepts include:\n- Components\n- Props\n- State (useState)\n- Effects (useEffect)',
    phase_number: 1
  },
  {
    id: '2',
    slug: 'routing-and-layouts',
    title: 'Routing and Layouts',
    description: 'Learn how file-based routing works in the App Router.',
    content_markdown: 'Next.js App Router uses file-based routing. \n\n- Folders define routes.\n- `page.tsx` defines the UI for that route.\n- `layout.tsx` defines UI that is shared across multiple pages.',
    phase_number: 2
  },
  {
    id: '3',
    slug: 'server-components',
    title: 'Server Components Demystified',
    description: 'Understand the difference between Server and Client Components.',
    content_markdown: 'React Server Components (RSC) are the default in Next.js App Router. \n\nThey render entirely on the server and send zero JavaScript to the client by default. If you need interactivity (like `onClick`), you must add `"use client"` at the top of the file to opt-in to Client Components.',
    phase_number: 3
  }
];

/**
 * Simulates a database fetch for a single lesson by its slug.
 * 
 * @param slug - The unique slug of the lesson.
 * @returns A promise resolving to the Lesson object, or null if not found.
 */
export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  // Simulate network delay to make it feel like a real DB fetch
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lesson = mockLessons.find(l => l.slug === slug);
  return lesson || null;
}
