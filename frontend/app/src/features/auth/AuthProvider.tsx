import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { setAuthToken, setUnauthorizedHandler } from '../../lib/api/authBridge';
import { login as loginRequest, type LoginCredentials } from '../../lib/api/client';
import { AuthContext } from './authContext';
import { clearSession, decodeSession, loadSession, saveSession, type Session } from './session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => loadSession());
  const [session, setSession] = useState<Session | null>(initial.session);
  const [expired, setExpired] = useState(initial.expired);

  const expire = useCallback(() => {
    clearSession();
    setSession(null);
    setExpired(true);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setExpired(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { token } = await loginRequest(credentials);
    const next = decodeSession(token);

    saveSession(next);
    setSession(next);
    setExpired(false);
  }, []);

  useEffect(() => {
    setAuthToken(session?.token ?? null);
  }, [session]);

  useEffect(() => {
    setUnauthorizedHandler(expire);

    return () => setUnauthorizedHandler(null);
  }, [expire]);

  useEffect(() => {
    if (!initial.session) {
      clearSession();
    }
  }, [initial.session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const timer = window.setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));

    return () => window.clearTimeout(timer);
  }, [session, expire]);

  const value = useMemo(
    () => ({
      session,
      username: session?.username ?? null,
      expired,
      login,
      logout,
    }),
    [session, expired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
