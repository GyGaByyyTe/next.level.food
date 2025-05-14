import React from 'react';
import { render, screen } from '@testing-library/react';
import NavLink from '../components/NavLink/NavLink';
import '@testing-library/jest-dom';

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

describe('NavLink Component', () => {
  it('renders correctly with the link class', () => {
    // Mock the usePathname hook to return a different path
    (usePathname as jest.Mock).mockReturnValue('/other-path');
    
    render(<NavLink href="/test-path">Test Link</NavLink>);
    
    const link = screen.getByText('Test Link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-path');
    
    // Check that only the link class is applied (not active)
    expect(link.className).toContain('link');
    expect(link.className).not.toContain('active');
  });
  
  it('applies the active class when the current path matches', () => {
    // Mock the usePathname hook to return the same path as the link
    (usePathname as jest.Mock).mockReturnValue('/test-path');
    
    render(<NavLink href="/test-path">Test Link</NavLink>);
    
    const link = screen.getByText('Test Link');
    
    // Check that both link and active classes are applied
    expect(link.className).toContain('link');
    expect(link.className).toContain('active');
  });
  
  it('applies the active class when the current path is a subpath', () => {
    // Mock the usePathname hook to return a subpath
    (usePathname as jest.Mock).mockReturnValue('/test-path/subpath');
    
    render(<NavLink href="/test-path">Test Link</NavLink>);
    
    const link = screen.getByText('Test Link');
    
    // Check that both link and active classes are applied
    expect(link.className).toContain('link');
    expect(link.className).toContain('active');
  });
});