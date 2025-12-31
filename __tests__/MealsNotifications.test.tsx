import { render, waitFor } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import MealsNotifications from '../components/Meals/MealsNotifications';
import { useToast } from '../hooks/useToast';

// Mock the hooks
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useToast', () => ({
  useToast: jest.fn(),
}));

describe('MealsNotifications', () => {
  const mockSuccess = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({
      success: mockSuccess,
    });
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('should show success notification only once when success=created parameter is present', async () => {
    const mockSearchParams = {
      get: jest.fn((key: string) => (key === 'success' ? 'created' : null)),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { rerender } = render(<MealsNotifications />);

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
      expect(mockSuccess).toHaveBeenCalledWith('Recipe created successfully!');
      expect(mockReplace).toHaveBeenCalledWith('/meals');
    });

    // Force re-render with same props
    rerender(<MealsNotifications />);

    // Should still be called only once
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should show success notification only once when success=updated parameter is present', async () => {
    const mockSearchParams = {
      get: jest.fn((key: string) => (key === 'success' ? 'updated' : null)),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const { rerender } = render(<MealsNotifications />);

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
      expect(mockSuccess).toHaveBeenCalledWith('Recipe updated successfully!');
      expect(mockReplace).toHaveBeenCalledWith('/meals');
    });

    // Force re-render with same props
    rerender(<MealsNotifications />);

    // Should still be called only once
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should not show notification when no success parameter is present', () => {
    const mockSearchParams = {
      get: jest.fn(() => null),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<MealsNotifications />);

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

