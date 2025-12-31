import { render } from '@testing-library/react';
import MealDetailsNotifications from '@/components/Meals/MealDetailsNotifications';
import { useToast } from '../hooks/useToast';
import { useSearchParams, useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../hooks/useToast');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('MealDetailsNotifications Component', () => {
  const mockSuccess = jest.fn();
  const mockReplace = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({
      success: mockSuccess,
    });
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it('renders nothing', () => {
    mockGet.mockReturnValue(null);

    const { container } = render(<MealDetailsNotifications />);

    expect(container.firstChild).toBeNull();
  });

  it('shows success notification when success parameter is present', () => {
    mockGet.mockReturnValue('updated');

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/meals/test-meal' },
      writable: true,
    });

    render(<MealDetailsNotifications />);

    expect(mockSuccess).toHaveBeenCalledWith('Recipe updated successfully!');
    expect(mockReplace).toHaveBeenCalledWith('/meals/test-meal');
  });

  it('does not show notification when success parameter is different', () => {
    mockGet.mockReturnValue('created');

    render(<MealDetailsNotifications />);

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not show notification twice', () => {
    mockGet.mockReturnValue('updated');

    Object.defineProperty(window, 'location', {
      value: { pathname: '/meals/test-meal' },
      writable: true,
    });

    const { rerender } = render(<MealDetailsNotifications />);

    expect(mockSuccess).toHaveBeenCalledTimes(1);

    // Rerender component
    rerender(<MealDetailsNotifications />);

    // Should still be called only once
    expect(mockSuccess).toHaveBeenCalledTimes(1);
  });

  it('removes success parameter from URL', () => {
    mockGet.mockReturnValue('updated');

    Object.defineProperty(window, 'location', {
      value: { pathname: '/meals/test-meal' },
      writable: true,
    });

    render(<MealDetailsNotifications />);

    expect(mockReplace).toHaveBeenCalledWith('/meals/test-meal');
  });
});

