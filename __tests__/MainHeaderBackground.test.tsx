import React from 'react';
import { render, screen } from '@testing-library/react';
import MainHeaderBackground from '../components/MainHeader/MainHeaderBackground';
import '@testing-library/jest-dom';

describe('MainHeaderBackground Component', () => {
  it('renders the background div with correct class', () => {
    render(<MainHeaderBackground />);

    // Get the main div element by class name
    const backgroundDiv = document.querySelector('.headerBackground');
    expect(backgroundDiv).toBeInTheDocument();
  });

  it('renders an SVG element', () => {
    render(<MainHeaderBackground />);

    // Check that an SVG is rendered
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('contains a linearGradient definition', () => {
    render(<MainHeaderBackground />);

    // Check for the gradient definition
    const gradient = document.querySelector('linearGradient');
    expect(gradient).toBeInTheDocument();
    expect(gradient).toHaveAttribute('id', 'gradient');
  });

  it('contains stop colors for the gradient', () => {
    render(<MainHeaderBackground />);

    // Check for the stop elements
    const stops = document.querySelectorAll('stop');
    expect(stops.length).toBe(2);

    // Check the first stop color
    expect(stops[0]).toHaveAttribute('offset', '0%');
    expect(stops[0]).toHaveAttribute('style');

    // Check the second stop color
    expect(stops[1]).toHaveAttribute('offset', '100%');
    expect(stops[1]).toHaveAttribute('style');
  });

  it('contains a path element with the gradient fill', () => {
    render(<MainHeaderBackground />);

    // Check for the path element
    const path = document.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill', 'url(#gradient)');
  });
});