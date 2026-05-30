/**
 * Unit Tests for MarkCompleteButton Component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import MarkCompleteButton from './MarkCompleteButton';
import { toggleProgress } from '@/app/actions/progress';

vi.mock('@/app/actions/progress', () => ({
  toggleProgress: vi.fn(),
}));

describe('MarkCompleteButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders incomplete state initially', () => {
    render(<MarkCompleteButton lessonId="lesson-1" initialCompleted={false} />);
    
    expect(screen.getByText('Mark as Complete')).toBeInTheDocument();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });

  test('renders completed state initially', () => {
    render(<MarkCompleteButton lessonId="lesson-1" initialCompleted={true} />);
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.queryByText('Mark as Complete')).not.toBeInTheDocument();
  });

  test('successfully toggles completion state on user click', async () => {
    vi.mocked(toggleProgress).mockResolvedValueOnce({ success: true, completed: true });
    
    render(<MarkCompleteButton lessonId="lesson-1" initialCompleted={false} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(toggleProgress).toHaveBeenCalledWith('lesson-1', false);
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });
});
