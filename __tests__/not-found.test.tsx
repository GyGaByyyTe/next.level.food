import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../app/not-found';
import '@testing-library/jest-dom';

describe('Not Found Page', () => {
  it('renders the heading with correct text', () => {
    render(<NotFound />);

    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('404 - Page Not Found');
  });

  it('renders the error message text', () => {
    render(<NotFound />);

    const errorMessage = screen.getByText('The page you are looking for does not exist.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders the main element with not-found class', () => {
    render(<NotFound />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('not-found');
  });
});