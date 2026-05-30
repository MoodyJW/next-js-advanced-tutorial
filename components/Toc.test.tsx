import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import Toc from './Toc';

describe('Toc Component', () => {
  test('renders closed by default', () => {
    render(<Toc />);
    
    // The button text should be present
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    
    // The items inside should NOT be visible initially
    expect(screen.queryByText('1. Introduction')).not.toBeInTheDocument();
  });

  test('opens when clicked', () => {
    render(<Toc />);
    
    const button = screen.getByRole('button');
    
    // Simulate user click
    fireEvent.click(button);
    
    // The items should now be visible
    expect(screen.getByText('1. Introduction')).toBeInTheDocument();
  });
});
