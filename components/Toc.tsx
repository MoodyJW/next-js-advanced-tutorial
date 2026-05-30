"use client";

/**
 * Table of Contents (Toc) Component
 * 
 * NEXT.JS CONCEPT:
 * The `"use client"` directive tells Next.js that this component (and its children)
 * should be hydrated on the client. We need this because we are using React state
 * (`useState`) and event listeners (`onClick`), which cannot run on the server.
 */

import { useState } from 'react';

/**
 * Interface representing a single Table of Contents heading entry.
 */
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Interface defining the expected props for the Toc component.
 */
export interface TocProps {
  /** A list of headings parsed from the lesson content */
  headings: TocHeading[];
}

/**
 * Renders a collapsible, dynamic Table of Contents for a lesson.
 * 
 * @param props - {@link TocProps}
 * @returns A Client Component with dynamic interactivity.
 */
export default function Toc({ headings }: TocProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 dark:bg-gray-800 dark:border-gray-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-gray-200"
      >
        <span>Table of Contents</span>
        <span className="text-xs transition-transform duration-200">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>

      {isOpen && (
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-150 pt-3 dark:border-gray-700">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <a href={`#${heading.id}`} className="block py-0.5">
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
