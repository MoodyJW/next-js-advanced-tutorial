"use client";

/**
 * Code Playground Component
 * 
 * NEXT.JS CONCEPT:
 * Third-party interactive libraries (like Sandpack) often require browser APIs
 * or React state. By wrapping them in a component with `"use client"`, we can 
 * safely embed them inside our Server Components (like our dynamic lesson page).
 */

import { useState, useEffect } from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

/**
 * Props for the Code Playground.
 */
interface CodePlaygroundProps {
  /** The initial code to display in the editor */
  code: string;
}

/**
 * Renders an interactive React playground using Sandpack.
 * 
 * @param props - {@link CodePlaygroundProps}
 * @returns A React component containing a live code editor and preview.
 */
export default function CodePlayground({ code }: CodePlaygroundProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Avoid hydration mismatch by only rendering Sandpack after the component has mounted on the client
  if (!isMounted) {
    return <div className="my-8 h-[400px] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm"></div>;
  }

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <Sandpack 
        template="react" 
        theme="auto"
        files={{
          "/App.js": code
        }}
        options={{
          showNavigator: false,
          showLineNumbers: true,
          editorHeight: 400
        }}
      />
    </div>
  );
}
