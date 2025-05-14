import React from 'react';
import { render, screen } from '@testing-library/react';
import MainHeader from '../components/MainHeader/MainHeader';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    return <img src={src as unknown as string} alt={alt} className={className} data-testid="mock-image" />;
  },
}));

// Mock the MainHeaderBackground component
jest.mock('../components/MainHeader/MainHeaderBackground', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header-background" />,
}));

// Mock the NavLink component
jest.mock('../components/NavLink', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-nav-link">
      {children}
    </a>
  ),
}));

describe('MainHeader Component', () => {
  it('renders the logo with correct link', () => {
    render(<MainHeader />);

    const logoLink = screen.getByText('Next.Level Food');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders the logo image', () => {
    render(<MainHeader />);

    const logoImage = screen.getByTestId('mock-image');
    expect(logoImage).toBeInTheDocument();
  });

  it('renders the MainHeaderBackground component', () => {
    render(<MainHeader />);

    const background = screen.getByTestId('mock-header-background');
    expect(background).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<MainHeader />);

    const navLinks = screen.getAllByTestId('mock-nav-link');
    expect(navLinks).toHaveLength(2);

    // Check the "Browse Meals" link
    const mealsLink = navLinks.find(link => link.textContent === 'Browse Meals');
    expect(mealsLink).toBeInTheDocument();
    expect(mealsLink).toHaveAttribute('href', '/meals');

    // Check the "Community" link
    const communityLink = navLinks.find(link => link.textContent === 'Community Foodies Community');
    expect(communityLink).toBeInTheDocument();
    expect(communityLink).toHaveAttribute('href', '/community');
  });
});