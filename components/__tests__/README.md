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

## Test Coverage

The project includes tests for the following components and pages:

### Components
- **NavLink**: Tests for correct rendering and active state based on the current path
- **MainHeader**: Tests for logo, navigation links, and background rendering
- **ImageSlideshow**: Tests for image rendering, automatic cycling, and cleanup
- **MainHeaderBackground**: Tests for SVG gradient background rendering

### Pages
- **Home Page**: Tests for heading, description, call-to-action links, and content sections
- **Community Page**: Tests for heading, description, and community perks sections
- **Meals Page**: Tests for heading and navigation links

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

### Page Tests

Page tests should be placed in the `app/__tests__` directory. The naming convention is `pageName.test.tsx`.

### Mocking Components and Modules

When testing components that use other components or Next.js features, you'll need to mock them:

```tsx
// Mock a component
jest.mock('../path/to/Component', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-component" />
}));

// Mock the Next.js hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  // Add other hooks as needed
}));

import { usePathname } from 'next/navigation';

// In your test
(usePathname as jest.Mock).mockReturnValue('/your-path');
```

### Mocking Images and Static Assets

For images and other static assets, create simple string mocks:

```tsx
// Mock image imports
jest.mock('../../assets/image.jpg', () => 'mock-image-path.jpg');

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="mock-image" />
}));
```

## Best Practices

1. Test component behavior, not implementation details
2. Use screen queries that resemble how users interact with your app
3. Keep tests simple and focused on one aspect of functionality
4. Use descriptive test names that explain what is being tested
5. When testing components with timers or animations, use Jest's timer mocks
6. For components that render multiple similar elements, use specific selectors or test IDs
7. Use relative import paths in tests instead of alias paths (e.g., '../Component' instead of '@/components/Component')
