import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth, clearAuthCache } from '../hooks/useAuth';

// Mock fetch globally
global.fetch = jest.fn();

describe('useAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the module cache to reset the session cache
    clearAuthCache();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns initial loading state', async () => {
    // Re-import after reset
    

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: null }),
      }),
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('fetches session successfully', async () => {
    const mockSession = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
        image: 'test.jpg',
        id: '123',
        isAdmin: false,
      },
      expires: '2025-12-31',
    };

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSession),
      }),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.userEmail).toBe('test@example.com');
  });

  it('handles admin user correctly', async () => {
    

    const mockAdminSession = {
      user: {
        email: 'admin@example.com',
        name: 'Admin User',
        image: 'admin.jpg',
        id: '456',
        isAdmin: true,
      },
      expires: '2025-12-31',
    };

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAdminSession),
      }),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles unauthenticated state', async () => {
    

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: null }),
      }),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.userEmail).toBeUndefined();
  });

  it('handles fetch error', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Network error')),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // After fetch error, session should be null (not {user: null})
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('handles non-ok response', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('refreshSession forces a new fetch', async () => {
    

    const mockSession = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
      expires: '2025-12-31',
    };

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSession),
      }),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialFetchCount = (global.fetch as jest.Mock).mock.calls.length;

    // Call refreshSession wrapped in act
    await act(async () => {
      await result.current.refreshSession();
    });

    // Should have made another fetch call
    expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(
      initialFetchCount,
    );
  });

  it('provides userEmail from session', async () => {
    

    const mockSession = {
      user: {
        email: 'user@example.com',
        name: 'User',
      },
      expires: '2025-12-31',
    };

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSession),
      }),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userEmail).toBe('user@example.com');
  });
});

