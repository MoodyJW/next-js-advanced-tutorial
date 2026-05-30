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
 * Renders a collapsible Table of Contents for a lesson.
 * 
 * @returns A Client Component with interactivity.
 */
export default function Toc() {
  // useState is only available in Client Components
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 dark:bg-gray-800 dark:border-gray-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-gray-200"
      >
        <span>Table of Contents</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            1. Introduction
          </li>
          <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            2. Core Concepts
          </li>
          <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            3. Interactive Example
          </li>
        </ul>
      )}
    </div>
  );
}
