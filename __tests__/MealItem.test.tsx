import { render, screen } from '@testing-library/react';
import MealItem from '../components/Meals/MealItem/MealItem';
import { MealItemProps } from '@/types/meals';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('MealItem', () => {
  const mockMealProps: MealItemProps = {
    title: 'Test Meal',
    slug: 'test-meal',
    image: '/test-image.jpg',
    summary: 'This is a test meal summary',
    creator: 'Test Creator',
  };

  it('renders the meal item with correct content', () => {
    render(<MealItem {...mockMealProps} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Meal')).toBeInTheDocument();
    
    // Check if creator is rendered
    expect(screen.getByText(/by Test Creator/i)).toBeInTheDocument();
    
    // Check if summary is rendered
    expect(screen.getByText('This is a test meal summary')).toBeInTheDocument();
    
    // Check if link is rendered with correct href
    const link = screen.getByText('View Details');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/meals/test-meal');
    
    // Check if image is rendered with correct attributes
    const image = screen.getByAltText('Test Meal');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });
});