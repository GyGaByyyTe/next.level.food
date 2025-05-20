import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MealShareFormSubmitButton from '../components/Meals/MealShareFormSubmitButton/MealShareFormSubmitButton';

// Mock the useFormStatus hook from react-dom
jest.mock('react-dom', () => {
  return {
    ...jest.requireActual('react-dom'),
    useFormStatus: jest.fn()
  };
});

describe('MealShareFormSubmitButton Component', () => {
  it('renders with default state (not pending)', () => {
    // Mock the useFormStatus hook to return not pending
    const { useFormStatus } = require('react-dom');
    useFormStatus.mockReturnValue({ pending: false });

    render(<MealShareFormSubmitButton />);

    // Check if the button renders with the correct text
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Share Meal');
    expect(button).not.toBeDisabled();
  });

  it('renders with pending state', () => {
    // Mock the useFormStatus hook to return pending
    const { useFormStatus } = require('react-dom');
    useFormStatus.mockReturnValue({ pending: true });

    render(<MealShareFormSubmitButton />);

    // Check if the button renders with the correct text and is disabled
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Submitting...');
    expect(button).toBeDisabled();
  });
});
