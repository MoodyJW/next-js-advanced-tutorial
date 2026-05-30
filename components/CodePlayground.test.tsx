import { render } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import CodePlayground from './CodePlayground';

// Sandpack renders an iframe and complex inner elements which can be heavy to test directly
// We'll mock it for a simple unit test ensuring it gets the right props.
vi.mock('@codesandbox/sandpack-react', () => ({
  Sandpack: ({ files }: { files: Record<string, string> }) => (
    <div data-testid="mock-sandpack">
      {files['/App.js']}
    </div>
  ),
}));

describe('CodePlayground Component', () => {
  test('renders the Sandpack component with the provided code', () => {
    const testCode = 'export default function App() { return <p>Hello</p>; }';
    
    const { getByTestId, getByText } = render(<CodePlayground code={testCode} />);
    
    // Verify the mock sandpack is rendered
    expect(getByTestId('mock-sandpack')).toBeInTheDocument();
    
    // Verify the code was passed down correctly
    expect(getByText(testCode)).toBeInTheDocument();
  });
});
