/**
 * About Page - Maps to the `/about` route.
 * 
 * NEXT.JS CONCEPT:
 * Creating a folder named `about` with a `page.tsx` file inside it 
 * automatically creates the `/about` route. This is called File-Based Routing.
 */

import Link from "next/link";

/**
 * Renders the About page.
 * 
 * @returns The about page React element.
 */
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About This Project</h1>
      
      <div className="prose dark:prose-invert prose-blue">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          This is a <strong>meta-learning project</strong>. It&apos;s a web application built with Next.js App Router, 
          designed to teach Next.js concepts.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800 dark:text-gray-200">How it works</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          As we build out features (like this very page), we explore the underlying Next.js mechanisms that make it possible.
          For example, this page exists because we created an <code>app/about/page.tsx</code> file. 
        </p>
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
            ← Back to Lessons
          </Link>
        </div>
      </div>
    </div>
  );
}
