import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import LessonCard from './LessonCard';

describe('LessonCard Component', () => {
  const mockProps = {
    slug: 'test-lesson',
    title: 'Test Title',
    description: 'This is a test description.',
    phaseNumber: 1
  };

  test('renders the lesson title and description', () => {
    render(<LessonCard {...mockProps} />);
    
    // Assert that the title is in the document
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Assert that the description is in the document
    expect(screen.getByText('This is a test description.')).toBeInTheDocument();
  });

  test('contains a link to the correct lesson slug', () => {
    render(<LessonCard {...mockProps} />);
    
    // Find the link element (the card itself acts as the link)
    // We get it by its role which Next.js <Link> maps to an <a> tag
    const linkElement = screen.getByRole('link');
    
    // Assert the href attribute matches the slug pattern
    expect(linkElement).toHaveAttribute('href', '/lessons/test-lesson');
  });
});
