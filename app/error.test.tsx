import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import GlobalError from './error';

describe('Global Error Boundary', () => {
  test('renders error message and calls reset on button click', () => {
    const mockError = new Error('Test global error');
    const mockReset = vi.fn();
    
    // Suppress console.error in tests to avoid noisy output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
    
    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
