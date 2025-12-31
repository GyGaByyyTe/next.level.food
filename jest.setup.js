// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress React act() warnings for async state updates in tests
// These warnings are expected in tests with transitions and async operations
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to') &&
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Polyfill for TextEncoder which is not available in Node.js environment by default
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
);

// Mock NextAuth
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: {
      GET: jest.fn(),
      POST: jest.fn(),
    },
    signIn: jest.fn(),
    signOut: jest.fn(),
    auth: jest.fn(),
  })),
}));

