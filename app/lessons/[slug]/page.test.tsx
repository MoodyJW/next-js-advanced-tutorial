import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import LessonPage from './page';

// Mock the next/navigation notFound function
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('LessonPage Dynamic Route', () => {
  test('renders the lesson when a valid slug is provided', async () => {
    // 1. Arrange: Create the Promise that Next.js would pass in for params
    const params = Promise.resolve({ slug: 'react-fundamentals' });
    
    // 2. Act: Await the Server Component execution (since it's an async function returning JSX)
    const ui = await LessonPage({ params });
    render(ui);

    // 3. Assert: Verify the lesson title is rendered
    expect(screen.getByText('React Fundamentals for Next.js')).toBeInTheDocument();
  });

  test('calls notFound when an invalid slug is provided', async () => {
    const { notFound } = await import('next/navigation');
    const params = Promise.resolve({ slug: 'invalid-slug-does-not-exist' });
    
    // Act & Assert
    // When the component calls notFound(), the mock function will be triggered.
    await LessonPage({ params });
    expect(notFound).toHaveBeenCalled();
  });
});
