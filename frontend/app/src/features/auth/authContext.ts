import { createContext, useContext } from 'react';

import type { LoginCredentials } from '../../lib/api/client';
import type { Session } from './session';

export interface AuthContextValue {
  session: Session | null;
  username: string | null;
  expired: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth precisa estar dentro de AuthProvider');
  }

  return value;
}
