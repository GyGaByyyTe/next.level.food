import React from 'react';
import { render, screen } from '@testing-library/react';
import MealsPage from '../meals/page';
import '@testing-library/jest-dom';

describe('Meals Page', () => {
  it('renders the heading', () => {
    render(<MealsPage />);
    
    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Meals List Page');
  });
  
  it('renders the home link', () => {
    render(<MealsPage />);
    
    // Check for the home link
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
  
  it('renders links to individual meal pages', () => {
    render(<MealsPage />);
    
    // Check for meal links
    const meal1Link = screen.getByRole('link', { name: 'Meal1' });
    expect(meal1Link).toBeInTheDocument();
    expect(meal1Link).toHaveAttribute('href', '/meals/1');
    
    const meal2Link = screen.getByRole('link', { name: 'Meal2' });
    expect(meal2Link).toBeInTheDocument();
    expect(meal2Link).toHaveAttribute('href', '/meals/2');
  });
  
  it('renders a link to the share page', () => {
    render(<MealsPage />);
    
    // Check for the share link
    const shareLink = screen.getByRole('link', { name: 'Shared' });
    expect(shareLink).toBeInTheDocument();
    expect(shareLink).toHaveAttribute('href', '/meals/share');
  });
});