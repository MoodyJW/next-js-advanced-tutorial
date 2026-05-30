/**
 * Unit Tests for Supabase Server Client Utility
 */

import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createClient } from './server';
import { createServerClient } from '@supabase/ssr';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn().mockImplementation(() => ({
    from: vi.fn(),
  })),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockImplementation(async () => ({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  })),
}));

describe('Supabase Server Client Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  test('successfully initializes the Supabase client when environment variables are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'example-anon-key';

    const client = await createClient();
    
    expect(createServerClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'example-anon-key',
      expect.any(Object)
    );
    expect(client).toBeDefined();
  });

  test('throws an error when environment variables are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(createClient()).rejects.toThrow(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  });
});
