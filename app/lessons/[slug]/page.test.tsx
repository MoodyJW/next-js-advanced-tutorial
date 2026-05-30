/**
 * Unit Tests for Dynamic Lesson Page
 */

import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import LessonPage, { generateStaticParams } from './page';

// Mock Next.js navigation notFound function
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock the Supabase server client utility
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
  createPublicClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
}));

describe('LessonPage Dynamic Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the lesson from Supabase when found in the database', async () => {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const mockSupabaseLesson = {
      id: 'db-1',
      slug: 'react-fundamentals',
      title: 'React Fundamentals from Supabase',
      content_markdown: '# DB Content Header\n\nDB Content Body',
      phase_number: 1,
    };
    
    vi.mocked(createPublicClient).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockSupabaseLesson, error: null }),
    } as any);

    const params = Promise.resolve({ slug: 'react-fundamentals' });
    const ui = await LessonPage({ params });
    render(ui);

    expect(screen.getByText('React Fundamentals from Supabase')).toBeInTheDocument();
    expect(screen.getAllByText('DB Content Header').length).toBeGreaterThan(0);
    expect(screen.getByText(/DB Content Body/)).toBeInTheDocument();
  });

  test('calls notFound when the lesson is not found in the database', async () => {
    const { notFound } = await import('next/navigation');
    const params = Promise.resolve({ slug: 'invalid-slug-does-not-exist' });
    
    await LessonPage({ params });
    expect(notFound).toHaveBeenCalled();
  });

  test('generateStaticParams fetches and maps slugs correctly', async () => {
    const { createPublicClient } = await import('@/lib/supabase/server');
    const mockSlugs = [
      { slug: 'react-fundamentals' },
      { slug: 'routing-and-layouts' },
    ];

    vi.mocked(createPublicClient).mockReturnValueOnce({
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: mockSlugs, error: null }),
    } as any);

    const params = await generateStaticParams();
    
    expect(params).toEqual([
      { slug: 'react-fundamentals' },
      { slug: 'routing-and-layouts' },
    ]);
  });
});
