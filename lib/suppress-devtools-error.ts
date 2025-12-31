'use client';

import { useEffect } from 'react';

// Suppress known React DevTools + React 19 Suspense boundary warning
// This is a known issue with React DevTools extension and React 19
// See: https://github.com/facebook/react/issues/28357

export function SuppressDevToolsError() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        const errorMessage = args[0];

        // Suppress specific React DevTools error
        if (
          typeof errorMessage === 'string' &&
          (errorMessage.includes('We are cleaning up async info that was not on the parent Suspense boundary') ||
           errorMessage.includes('React instrumentation encountered an error'))
        ) {
          // This is a React DevTools instrumentation error, not an app error
          return;
        }

        // Log all other errors normally
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return null;
}


