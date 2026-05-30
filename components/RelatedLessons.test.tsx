/**
 * Unit Tests for RelatedLessons Component
 */

import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import RelatedLessons, { RelatedLessonsSkeleton } from './RelatedLessons';

vi.mock('@/lib/supabase/server', () => ({
  createPublicClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({
      data: [
        { slug: 'routing-and-layouts', title: 'Routing and Layouts', phase_number: 2 },
        { slug: 'server-components', title: 'Server Components Demystified', phase_number: 3 },
      ],
      error: null,
    }),
  }),
}));

describe('RelatedLessons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders skeleton correctly', () => {
    render(<RelatedLessonsSkeleton />);
    // The skeleton does not render text, but has placeholders. Let's make sure it mounts.
    const placeholders = screen.getAllByRole('generic');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  test('renders related lessons queried from database', async () => {
    const ui = await RelatedLessons({ currentSlug: 'react-fundamentals' });
    render(ui);

    expect(screen.getByText('What to Learn Next')).toBeInTheDocument();
    expect(screen.getByText('Routing and Layouts')).toBeInTheDocument();
    expect(screen.getByText('Server Components Demystified')).toBeInTheDocument();
  });
});
