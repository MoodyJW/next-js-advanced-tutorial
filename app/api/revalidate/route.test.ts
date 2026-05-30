/**
 * Unit Tests for On-Demand Revalidation Route Handler
 */

import { expect, test, describe, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { revalidatePath, revalidateTag } from 'next/cache';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe('On-Demand Revalidation API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns 401 if secret token is invalid or missing', async () => {
    const request = new NextRequest('http://localhost/api/revalidate?secret=wrong');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.message).toBe('Invalid token');
  });

  test('revalidates path when path query parameter is specified with valid secret', async () => {
    const request = new NextRequest('http://localhost/api/revalidate?secret=super-secret-revalidation-key&path=/about');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.revalidated).toBe(true);
    expect(json.path).toBe('/about');
    expect(revalidatePath).toHaveBeenCalledWith('/about');
  });

  test('revalidates tag when tag query parameter is specified with valid secret', async () => {
    const request = new NextRequest('http://localhost/api/revalidate?secret=super-secret-revalidation-key&tag=lessons');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.revalidated).toBe(true);
    expect(json.tag).toBe('lessons');
    expect(revalidateTag).toHaveBeenCalledWith('lessons', 'max');
  });

  test('defaults to revalidating home and dynamic lesson segments if no query parameters are provided', async () => {
    const request = new NextRequest('http://localhost/api/revalidate?secret=super-secret-revalidation-key');
    const response = await POST(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.revalidated).toBe(true);
    expect(json.path).toBe('all');
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/lessons/[slug]');
  });
});
