import { render, screen, waitFor, act } from '@testing-library/react';
import MealActions from '@/components/Meals/MealActions/MealActions';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useRouter } from 'next/navigation';
import { deleteMealHandler } from '../lib/actions';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../hooks/useAuth');
jest.mock('../hooks/useToast');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../lib/actions', () => ({
  deleteMealHandler: jest.fn(),
}));

describe('MealActions Component', () => {
  const mockPush = jest.fn();
  const mockSuccess = jest.fn();
  const mockError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({
      success: mockSuccess,
      error: mockError,
    });
  });

  it('renders nothing when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: null,
      isAdmin: false,
      isLoading: true,
    });

    const { container } = render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when user cannot modify', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'other@example.com',
      isAdmin: false,
      isLoading: false,
    });

    const { container } = render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders actions when user is creator', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'creator@example.com',
      isAdmin: false,
      isLoading: false,
    });

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders actions when user is admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'admin@example.com',
      isAdmin: true,
      isLoading: false,
    });

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('navigates to edit page when Edit is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'creator@example.com',
      isAdmin: false,
      isLoading: false,
    });

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    const editButton = screen.getByText('Edit');
    editButton.click();

    expect(mockPush).toHaveBeenCalledWith('/meals/test-meal/edit');
  });

  it('does not delete when user cancels confirmation', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'creator@example.com',
      isAdmin: false,
      isLoading: false,
    });

    // Mock window.confirm to return false
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    const deleteButton = screen.getByText('Delete');
    deleteButton.click();

    expect(deleteMealHandler).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('deletes meal when user confirms', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'creator@example.com',
      isAdmin: false,
      isLoading: false,
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    (deleteMealHandler as jest.Mock).mockResolvedValue(undefined);

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    const deleteButton = screen.getByText('Delete');
    deleteButton.click();

    await waitFor(() => {
      expect(deleteMealHandler).toHaveBeenCalledWith('test-meal');
    });

    confirmSpy.mockRestore();
  });

  it('shows error message when delete fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'creator@example.com',
      isAdmin: false,
      isLoading: false,
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const error = new Error('Delete failed');
    (deleteMealHandler as jest.Mock).mockRejectedValue(error);

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    const deleteButton = screen.getByText('Delete');
    deleteButton.click();

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('Delete failed');
    });

    confirmSpy.mockRestore();
  });


  it('disables buttons when deleting', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userEmail: 'creator@example.com',
      isAdmin: false,
      isLoading: false,
    });

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    (deleteMealHandler as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(
      <MealActions slug="test-meal" creatorEmail="creator@example.com" />,
    );

    const deleteButton = screen.getByText('Delete');
    deleteButton.click();

    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});

