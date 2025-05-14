# Testing Documentation

## Setup

This project uses Jest and React Testing Library for testing React components. The setup includes:

- Jest as the test runner
- React Testing Library for rendering and interacting with components
- jest-dom for additional DOM matchers

## Running Tests

To run tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch
```

## Writing Tests

### Component Tests

Component tests should be placed in the `components/__tests__` directory. The naming convention is `ComponentName.test.tsx`.

Example:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import YourComponent from '../path/to/YourComponent';
import '@testing-library/jest-dom';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Mocking Next.js Features

When testing components that use Next.js features like `usePathname`, `useRouter`, etc., you'll need to mock these hooks:

```tsx
// Mock the Next.js hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  // Add other hooks as needed
}));

import { usePathname } from 'next/navigation';

// In your test
(usePathname as jest.Mock).mockReturnValue('/your-path');
```

## Best Practices

1. Test component behavior, not implementation details
2. Use screen queries that resemble how users interact with your app
3. Keep tests simple and focused on one aspect of functionality
4. Use descriptive test names that explain what is being tested