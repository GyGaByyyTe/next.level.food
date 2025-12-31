import { render, screen } from '@testing-library/react';
import MainHeaderSkeleton from '@/components/MainHeader/MainHeaderSkeleton';
import '@testing-library/jest-dom';

describe('MainHeaderSkeleton Component', () => {
  it('renders the header skeleton', () => {
    render(<MainHeaderSkeleton />);

    expect(screen.getByText('Next.Level Food')).toBeInTheDocument();
  });

  it('renders navigation items with loading state', () => {
    render(<MainHeaderSkeleton />);

    expect(screen.getByText('Browse Meals')).toBeInTheDocument();
    expect(screen.getByText('Foodies Community')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders logo placeholder', () => {
    const { container } = render(<MainHeaderSkeleton />);

    const logoPlaceholder = container.querySelector(
      'div[style*="width: 5rem"]',
    );
    expect(logoPlaceholder).toBeInTheDocument();
    expect(logoPlaceholder).toHaveStyle({ backgroundColor: '#333' });
  });

  it('renders with opacity for loading state', () => {
    const { container } = render(<MainHeaderSkeleton />);

    const loadingElements = container.querySelectorAll('[style*="opacity"]');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders the main header structure', () => {
    const { container } = render(<MainHeaderSkeleton />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});

