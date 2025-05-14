import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import '@testing-library/jest-dom';

// Mock the ImageSlideshow component
jest.mock('../components/ImageSlideshow/ImageSlideshow', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-slideshow" />,
}));

describe('Home Page', () => {
  it('renders the heading and description', () => {
    render(<Home />);

    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('NextLevel Food for NextLevel Foodies');

    // Check for the description
    const description = screen.getByText('Taste & share food from all over the world.');
    expect(description).toBeInTheDocument();
  });

  it('renders the ImageSlideshow component', () => {
    render(<Home />);

    const slideshow = screen.getByTestId('mock-slideshow');
    expect(slideshow).toBeInTheDocument();
  });

  it('renders the call-to-action links', () => {
    render(<Home />);

    // Check for the "Join the Community" link
    const communityLink = screen.getByRole('link', { name: 'Join the Community' });
    expect(communityLink).toBeInTheDocument();
    expect(communityLink).toHaveAttribute('href', '/community');

    // Check for the "Explore Meals" link
    const mealsLink = screen.getByRole('link', { name: 'Explore Meals' });
    expect(mealsLink).toBeInTheDocument();
    expect(mealsLink).toHaveAttribute('href', '/meals');
  });

  it('renders the "How it works" section', () => {
    render(<Home />);

    // Check for the section heading
    const sectionHeading = screen.getByRole('heading', { name: 'How it works' });
    expect(sectionHeading).toBeInTheDocument();

    // Check for the section content
    const sectionContents = screen.getAllByText(/NextLevel Food is a platform for foodies to share their favorite recipes with the world/);
    expect(sectionContents.length).toBeGreaterThan(0);
  });

  it('renders the "Why NextLevel Food?" section', () => {
    render(<Home />);

    // Check for the section heading
    const sectionHeading = screen.getByRole('heading', { name: 'Why NextLevel Food?' });
    expect(sectionHeading).toBeInTheDocument();
  });
});