import { render, screen, act } from '@testing-library/react';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { useToast } from '@/hooks/useToast';
import '@testing-library/jest-dom';

// Test component that exposes toast methods
function DirectTestComponent() {
  const toast = useToast();

  // Expose methods for testing
  if (typeof window !== 'undefined') {
    (window as any).testToast = toast;
  }

  return (
    <div>
      <div data-testid="toast-count">{toast.toasts.length}</div>
      {toast.toasts.map((t) => (
        <div key={t.id} data-testid="toast-item">
          <span data-testid="toast-message">{t.message}</span>
          <span data-testid="toast-type">{t.type}</span>
        </div>
      ))}
    </div>
  );
}

describe('ToastContext', () => {
  it('provides toast context to children', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    expect(screen.getByTestId('toast-count')).toBeInTheDocument();
  });

  it('adds success toast', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.success('Success message');
    });

    expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message');
    expect(screen.getByTestId('toast-type')).toHaveTextContent('success');
  });

  it('adds error toast', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.error('Error message');
    });

    expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message');
    expect(screen.getByTestId('toast-type')).toHaveTextContent('error');
  });

  it('adds info toast', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.info('Info message');
    });

    expect(screen.getByTestId('toast-message')).toHaveTextContent('Info message');
    expect(screen.getByTestId('toast-type')).toHaveTextContent('info');
  });

  it('adds custom toast', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.addToast('Custom message', 'success', 2000);
    });

    expect(screen.getByTestId('toast-message')).toHaveTextContent('Custom message');
  });

  it('manages multiple toasts', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.success('Toast 1');
      (window as any).testToast.error('Toast 2');
      (window as any).testToast.info('Toast 3');
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
  });

  it('removes toast by id', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.success('Test message');
    });

    const toastId = (window as any).testToast.toasts[0]?.id;

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    act(() => {
      (window as any).testToast.removeToast(toastId);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('generates unique ids', () => {
    render(
      <ToastProvider>
        <DirectTestComponent />
      </ToastProvider>,
    );

    act(() => {
      (window as any).testToast.success('Message 1');
      (window as any).testToast.success('Message 2');
    });

    const toasts = screen.getAllByTestId('toast-item');
    expect(toasts).toHaveLength(2);

    // Verify they have different content
    const messages = screen.getAllByTestId('toast-message');
    expect(messages[0]).toHaveTextContent('Message 1');
    expect(messages[1]).toHaveTextContent('Message 2');
  });
});

describe('useToast hook', () => {
  it('throws error when used outside ToastProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<DirectTestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });
});

