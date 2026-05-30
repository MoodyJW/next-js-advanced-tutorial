/**
 * On-Demand Revalidation Route Handler
 * 
 * NEXT.JS CONCEPT:
 * In the App Router, Route Handlers (`route.ts` files inside API directories)
 * are used to build custom request handlers for a given route using the Web Request
 * and Response APIs. They replace standard API Routes from the Pages Router.
 * 
 * This handler enables Incremental Static Regeneration (ISR) on demand by programmatically
 * clearing the server caching layer for path-based or tag-based assets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Handles incoming revalidation requests.
 * Accepts tag, path, and secret parameters via search queries.
 * 
 * @param request - The incoming NextRequest.
 * @returns A JSON NextResponse reflecting revalidation status.
 */
async function handleRevalidation(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get('tag');
    const path = request.nextUrl.searchParams.get('path');
    const secret = request.nextUrl.searchParams.get('secret');

    // Secure the revalidation endpoint using an environment token
    const expectedSecret = process.env.REVALIDATION_SECRET || 'super-secret-revalidation-key';
    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (tag) {
      revalidateTag(tag, 'max');
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Default: Revalidate home page and lesson page templates
    revalidatePath('/');
    revalidatePath('/lessons/[slug]');
    return NextResponse.json({ revalidated: true, path: 'all', now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

/**
 * Handles GET requests to clear caching dynamically via browser or curl triggers.
 */
export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

/**
 * Handles POST requests to support database webhook integration (e.g. Supabase DB hooks).
 */
export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}
