/**
 * Root Layout - The outermost layout that wraps every page in the application.
 * 
 * NEXT.JS CONCEPT:
 * The `app/layout.tsx` file defines the root layout. It MUST contain the `<html>` 
 * and `<body>` tags. It allows you to share UI across all routes (like a Header 
 * and Footer) and preserve state during navigation because layouts do not re-render.
 */

import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

// Initialize the Inter font (Google Fonts optimization built into Next.js)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Initialize Fira Code for code blocks
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

/**
 * Metadata API - Next.js automatically generates the `<head>` tags.
 */
export const metadata: Metadata = {
  title: "Next.js Meta-Learning Tutorial",
  description: "Learn Next.js by building a Next.js app",
};

/**
 * The RootLayout component.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The specific page content to render inside the layout.
 * @returns The HTML structure wrapping the application.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={`${inter.className} ${firaCode.variable} min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900`}>
        {/* Shared Header across all routes */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 dark:bg-gray-800 dark:border-gray-700">
          <nav className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
              Next.js Masterclass
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium">
                About
              </Link>
              {user ? (
                <form action={logout}>
                  <button type="submit" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium">
                    Log Out
                  </button>
                </form>
              ) : (
                <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Log In
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content Area where `page.tsx` will be injected */}
        <main className="flex-1 max-w-4xl mx-auto w-full p-6">
          {children}
        </main>

        {/* Shared Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 mt-auto">
          <p>© {new Date().getFullYear()} Next.js Meta-Learning Tutorial</p>
        </footer>
      </body>
    </html>
  );
}
