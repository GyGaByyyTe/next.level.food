import { render, screen, waitFor } from '@testing-library/react';
import ToastContainer from '@/components/Toast/ToastContainer';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { useToast } from '@/hooks/useToast';
import '@testing-library/jest-dom';

// Test component to trigger toasts
function ToastTrigger() {
  const { success, error, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Success toast')}>Success</button>
      <button onClick={() => error('Error toast')}>Error</button>
      <button onClick={() => info('Info toast')}>Info</button>
    </div>
  );
}

describe('ToastContainer Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders empty container when no toasts', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>,
    );

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders toasts from context', async () => {
    render(
      <ToastProvider>
        <ToastContainer />
        <ToastTrigger />
      </ToastProvider>,
    );

    const successButton = screen.getByText('Success');
    successButton.click();

    await waitFor(() => {
      expect(screen.getByText('Success toast')).toBeInTheDocument();
    });
  });

  it('renders multiple toasts', async () => {
    render(
      <ToastProvider>
        <ToastContainer />
        <ToastTrigger />
      </ToastProvider>,
    );

    const successButton = screen.getByText('Success');
    const errorButton = screen.getByText('Error');

    successButton.click();
    errorButton.click();

    await waitFor(() => {
      expect(screen.getByText('Success toast')).toBeInTheDocument();
      expect(screen.getByText('Error toast')).toBeInTheDocument();
    });
  });

  it('removes toast after duration', async () => {
    render(
      <ToastProvider>
        <ToastContainer />
        <ToastTrigger />
      </ToastProvider>,
    );

    const successButton = screen.getByText('Success');
    successButton.click();

    await waitFor(() => {
      expect(screen.getByText('Success toast')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(screen.queryByText('Success toast')).not.toBeInTheDocument();
    });
  });
});

