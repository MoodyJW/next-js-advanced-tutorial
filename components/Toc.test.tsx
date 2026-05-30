import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import Toc from './Toc';

describe('Toc Component', () => {
  const mockHeadings = [
    { id: '1-introduction', text: '1. Introduction', level: 2 },
    { id: '2-core-concepts', text: '2. Core Concepts', level: 2 },
  ];

  test('renders null when headings list is empty', () => {
    const { container } = render(<Toc headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders closed by default', () => {
    render(<Toc headings={mockHeadings} />);
    
    // The button text should be present
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    
    // The items inside should NOT be visible initially
    expect(screen.queryByText('1. Introduction')).not.toBeInTheDocument();
  });

  test('opens when clicked', () => {
    render(<Toc headings={mockHeadings} />);
    
    const button = screen.getByRole('button');
    
    // Simulate user click
    fireEvent.click(button);
    
    // The items should now be visible
    expect(screen.getByText('1. Introduction')).toBeInTheDocument();
    expect(screen.getByText('2. Core Concepts')).toBeInTheDocument();
  });
});
