"use client";

import { useState } from 'react';
import { login, signup } from '@/app/actions/auth';

/**
 * Login Page
 * 
 * NEXT.JS CONCEPT:
 * We use a Client Component here so we can manage state to display
 * any errors returned from our Server Actions (like "Invalid password" 
 * or "Email already registered").
 */
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Wrappers to handle the result of the Server Actions
  async function handleLogin(formData: FormData) {
    setIsPending(true);
    setError(null);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    }
    setIsPending(false);
  }

  async function handleSignup(formData: FormData) {
    setIsPending(true);
    setError(null);
    const res = await signup(formData);
    if (res?.error) {
      setError(res.error);
    }
    setIsPending(false);
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Sign In / Sign Up
      </h1>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input 
            type="email" 
            name="email" 
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input 
            type="password" 
            name="password" 
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button 
            formAction={handleLogin}
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isPending ? 'Processing...' : 'Log In'}
          </button>
          <button 
            formAction={handleSignup}
            disabled={isPending}
            className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
          >
            {isPending ? 'Processing...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
}
