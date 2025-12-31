'use client';

import { useEffect, useState, useCallback } from 'react';

interface User {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  id?: string;
  isAdmin?: boolean;
}

interface Session {
  user?: User;
  expires?: string;
}

// In-memory cache to avoid repeated API calls during the same app session
let sessionCache: Session | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for accessing current user session and auth status
 * Uses in-memory caching to avoid repeated API calls
 *
 * @returns {Object} Auth state object
 * @returns {Session | null} session - Current user session
 * @returns {boolean} isAuthenticated - Whether user is authenticated
 * @returns {boolean} isAdmin - Whether user is an admin
 * @returns {boolean} isLoading - Whether session is being loaded
 * @returns {Function} refreshSession - Force refresh session from server
 *
 * @example
 * const { session, isAuthenticated, isAdmin, isLoading } = useAuth();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (!isAuthenticated) return <div>Please sign in</div>;
 * if (isAdmin) return <AdminPanel />;
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(sessionCache);
  const [isLoading, setIsLoading] = useState(!sessionCache);

  const fetchSession = useCallback(async () => {
    // Use cache if it's still fresh
    const now = Date.now();
    if (sessionCache && now - cacheTimestamp < CACHE_DURATION) {
      setSession(sessionCache);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/session');

      if (!res.ok) {
        console.error('Failed to fetch session:', res.status);
        sessionCache = null;
        setSession(null);
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      // Update cache
      sessionCache = data;
      cacheTimestamp = Date.now();

      setSession(data);
    } catch (error) {
      console.error('Error fetching session:', error);
      sessionCache = null;
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    // Force refresh by clearing cache
    sessionCache = null;
    cacheTimestamp = 0;
    setIsLoading(true);
    await fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    isAuthenticated: !!session?.user?.email,
    isAdmin: session?.user?.isAdmin || false,
    userEmail: session?.user?.email,
    userName: session?.user?.name,
    isLoading,
    refreshSession,
  };
}

/**
 * Clear the session cache (useful after sign out)
 */
export function clearAuthCache() {
  sessionCache = null;
  cacheTimestamp = 0;
}

