import React from 'react';
import { render, screen } from '@testing-library/react';
import CommunityPage from '../app/community/page';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src as unknown as string} alt={alt} data-testid="mock-image" />
  ),
}));

// Mock the image imports
jest.mock('../assets/icons/meal.png', () => 'meal-icon.png');
jest.mock('../assets/icons/community.png', () => 'community-icon.png');
jest.mock('../assets/icons/events.png', () => 'events-icon.png');

describe('Community Page', () => {
  it('renders the heading with highlight', () => {
    render(<CommunityPage />);

    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('One shared passion: Food');

    // Check for the highlighted text
    const highlight = screen.getByText('Food');
    expect(highlight).toHaveClass('highlight');
  });

  it('renders the description', () => {
    render(<CommunityPage />);

    const description = screen.getByText('Join our community and share your favorite recipes!');
    expect(description).toBeInTheDocument();
  });

  it('renders the "Community Perks" section', () => {
    render(<CommunityPage />);

    // Check for the section heading
    const sectionHeading = screen.getByRole('heading', { name: 'Community Perks' });
    expect(sectionHeading).toBeInTheDocument();
  });

  it('renders the perks list with three items', () => {
    render(<CommunityPage />);

    // Check for the list
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('renders all perk icons with correct alt text', () => {
    render(<CommunityPage />);

    // Check for all images
    const images = screen.getAllByTestId('mock-image');
    expect(images).toHaveLength(3);

    // Check alt texts
    expect(screen.getByAltText('A delicious meal')).toBeInTheDocument();
    expect(screen.getByAltText('A crowd of people, cooking')).toBeInTheDocument();
    expect(screen.getByAltText('A crowd of people at a cooking event')).toBeInTheDocument();
  });

  it('renders all perk descriptions', () => {
    render(<CommunityPage />);

    // Check for perk descriptions
    expect(screen.getByText('Share & discover recipes')).toBeInTheDocument();
    expect(screen.getByText('Find new friends & like-minded people')).toBeInTheDocument();
    expect(screen.getByText('Participate in exclusive events')).toBeInTheDocument();
  });
});