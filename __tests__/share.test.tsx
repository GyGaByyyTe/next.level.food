import { render, screen } from '@testing-library/react';
import MealsSharePage from '../app/meals/share/page';
import '@testing-library/jest-dom';

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('MealsSharePage', () => {
  it('renders the heading with correct text', () => {
    render(<MealsSharePage />);
    
    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Meals Share Page');
    
    // Check for the style attributes
    expect(heading).toHaveStyle({
      color: 'white',
      textAlign: 'center',
    });
  });

  it('renders links to home and back to meals', () => {
    render(<MealsSharePage />);
    
    // Check for the home link
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Check for the back link
    const backLink = screen.getByRole('link', { name: 'Back' });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/meals');
  });
});