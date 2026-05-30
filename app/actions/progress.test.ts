/**
 * Unit Tests for Progress Server Action
 */

import { expect, test, describe, vi, beforeEach } from 'vitest';
import { toggleProgress } from './progress';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
  createPublicClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Progress Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('successfully toggles progress to complete (inserts entry)', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: vi.fn().mockReturnValue({
        insert: mockInsert,
      }),
    } as any);

    const result = await toggleProgress('lesson-456', false);
    
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-123',
      lesson_id: 'lesson-456',
      completed_at: expect.any(String),
    });
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/lessons/[slug]');
    expect(result).toEqual({ success: true, completed: true });
  });

  test('successfully toggles progress to incomplete (deletes entry)', async () => {
    const mockEq1 = vi.fn().mockReturnThis();
    const mockEq2 = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({
      eq: mockEq1,
    });
    mockEq1.mockReturnValue({
      eq: mockEq2,
    });

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }), // Fallback mock user id
      },
      from: vi.fn().mockReturnValue({
        delete: mockDelete,
      }),
    } as any);

    const result = await toggleProgress('lesson-456', true);

    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq1).toHaveBeenCalledWith('user_id', '00000000-0000-0000-0000-000000000000');
    expect(mockEq2).toHaveBeenCalledWith('lesson_id', 'lesson-456');
    expect(revalidatePath).toHaveBeenCalled();
    expect(result).toEqual({ success: true, completed: false });
  });
});
