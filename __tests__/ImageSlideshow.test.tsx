import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ImageSlideshow from '../components/ImageSlideshow/ImageSlideshow';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: any; alt: string; className?: string }) => {
    return (
      <img 
        src={src as unknown as string} 
        alt={alt} 
        className={className} 
        data-testid="slideshow-image"
      />
    );
  },
}));

// Mock the image imports
jest.mock('@/assets/burger.jpg', () => 'burger.jpg');
jest.mock('@/assets/curry.jpg', () => 'curry.jpg');
jest.mock('@/assets/dumplings.jpg', () => 'dumplings.jpg');
jest.mock('@/assets/macncheese.jpg', () => 'macncheese.jpg');
jest.mock('@/assets/pizza.jpg', () => 'pizza.jpg');
jest.mock('@/assets/schnitzel.jpg', () => 'schnitzel.jpg');
jest.mock('@/assets/tomato-salad.jpg', () => 'tomato-salad.jpg');

describe('ImageSlideshow Component', () => {
  beforeEach(() => {
    // Setup mock for timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Clean up mock timers
    jest.useRealTimers();
  });

  it('renders all images', () => {
    render(<ImageSlideshow />);

    // Check that all 7 images are rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(7);

    // Check alt texts for a few images
    expect(screen.getByAltText('A delicious, juicy burger')).toBeInTheDocument();
    expect(screen.getByAltText('A delicious pizza')).toBeInTheDocument();
    expect(screen.getByAltText('A delicious tomato salad')).toBeInTheDocument();
  });

  it('applies active class to the first image initially', () => {
    render(<ImageSlideshow />);

    // Get all images
    const images = screen.getAllByRole('img');

    // Check that only the first image has the active class
    expect(images[0].className).toContain('active');
    for (let i = 1; i < images.length; i++) {
      expect(images[i].className).not.toContain('active');
    }
  });

  it('changes the active image after the interval', () => {
    render(<ImageSlideshow />);

    // Initially, the first image should be active
    const images = screen.getAllByRole('img');
    expect(images[0].className).toContain('active');

    // Advance timers by 5 seconds (the interval time)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Now the second image should be active
    expect(images[0].className).not.toContain('active');
    expect(images[1].className).toContain('active');
  });

  it('cycles back to the first image after reaching the end', () => {
    render(<ImageSlideshow />);

    const images = screen.getAllByRole('img');

    // Advance through all images (7 images * 5000ms = 35000ms)
    act(() => {
      jest.advanceTimersByTime(35000);
    });

    // After cycling through all images, it should return to the first one
    expect(images[0].className).toContain('active');
  });

  it('cleans up the interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

    const { unmount } = render(<ImageSlideshow />);

    // Unmount the component
    unmount();

    // Check that clearInterval was called
    expect(clearIntervalSpy).toHaveBeenCalled();

    // Clean up the spy
    clearIntervalSpy.mockRestore();
  });
});