/**
 * Unit Tests for HomePage Component
 */

import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import HomePage from './page';

// Mock the Supabase server client utility
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
}));

describe('HomePage Root Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the page frame with an empty lesson list when Supabase returns empty', async () => {
    const ui = await HomePage();
    render(ui);

    expect(screen.getByText('Welcome to the Next.js Meta-Tutorial')).toBeInTheDocument();
    expect(screen.queryByText('React Fundamentals for Next.js')).not.toBeInTheDocument();
  });

  test('renders the list of lessons from Supabase when found in the database', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const mockSupabaseLessons = [
      {
        slug: 'db-lesson-1',
        title: 'Database Lesson One',
        content_markdown: 'First DB Lesson Description',
        phase_number: 1,
      },
      {
        slug: 'db-lesson-2',
        title: 'Database Lesson Two',
        content_markdown: 'Second DB Lesson Description',
        phase_number: 2,
      },
    ];

    vi.mocked(createClient).mockResolvedValueOnce({
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockSupabaseLessons, error: null }),
    } as any);

    const ui = await HomePage();
    render(ui);

    expect(screen.getByText('Database Lesson One')).toBeInTheDocument();
    expect(screen.getByText('First DB Lesson Description')).toBeInTheDocument();
    expect(screen.getByText('Database Lesson Two')).toBeInTheDocument();
    expect(screen.getByText('Second DB Lesson Description')).toBeInTheDocument();
  });
});
