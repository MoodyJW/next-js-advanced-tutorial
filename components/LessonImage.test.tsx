import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import LessonImage from './LessonImage';

describe('LessonImage Component', () => {
  test('renders the image with the provided alt text', () => {
    render(<LessonImage altText="Custom Test Banner" />);
    // Note: next/image stubs out src in unit test environments, but alt text persists
    const image = screen.getByAltText('Custom Test Banner');
    expect(image).toBeInTheDocument();
  });
});
