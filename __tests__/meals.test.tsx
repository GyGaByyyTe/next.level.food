import React from 'react';
import { render, screen } from '@testing-library/react';
import MealsPage from '../app/meals/page';
import '@testing-library/jest-dom';

// Mock the MealsGrid component
jest.mock('../components/Meals/MealsGrid', () => ({
  __esModule: true,
  default: ({ meals }: { meals: any[] }) => <div data-testid="meals-grid">{meals.length} meals</div>,
}));

describe('Meals Page', () => {
  it('renders the heading with correct text', () => {
    render(<MealsPage />);

    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Delicious meals, created by you');
  });

  it('renders the description text', () => {
    render(<MealsPage />);

    const description = screen.getByText('Choose your favorite recipe and cook it yourself. It is easy and fun!');
    expect(description).toBeInTheDocument();
  });

  it('renders a link to the share page with correct text', () => {
    render(<MealsPage />);

    // Check for the share link
    const shareLink = screen.getByRole('link', { name: 'Share Your Favorite Recipe' });
    expect(shareLink).toBeInTheDocument();
    expect(shareLink).toHaveAttribute('href', '/meals/share');
  });

  it('renders the MealsGrid component', () => {
    render(<MealsPage />);

    const mealsGrid = screen.getByTestId('meals-grid');
    expect(mealsGrid).toBeInTheDocument();
    expect(mealsGrid).toHaveTextContent('0 meals');
  });
});