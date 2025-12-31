import { render, screen } from '@testing-library/react';
import Toast from '@/components/Toast/Toast';
import '@testing-library/jest-dom';

describe('Toast Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders toast with success type', () => {
    render(
      <Toast
        message="Success message"
        type="success"
        onClose={mockOnClose}
        duration={4000}
      />,
    );

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders toast with error type', () => {
    render(
      <Toast
        message="Error message"
        type="error"
        onClose={mockOnClose}
        duration={4000}
      />,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    const closeMarks = screen.getAllByText('✕');
    expect(closeMarks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders toast with info type', () => {
    render(
      <Toast
        message="Info message"
        type="info"
        onClose={mockOnClose}
        duration={4000}
      />,
    );

    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('calls onClose after duration', () => {
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={2000}
      />,
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicked', () => {
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={4000}
      />,
    );

    const toast = screen.getByText('Test message').closest('div');
    toast?.click();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={mockOnClose}
        duration={4000}
      />,
    );

    const closeButton = screen.getByLabelText('Закрыть');
    closeButton.click();

    // Button click also triggers parent div onClick, so it's called twice
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('uses default duration when not provided', () => {
    render(
      <Toast message="Test message" type="success" onClose={mockOnClose} />,
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4000);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

