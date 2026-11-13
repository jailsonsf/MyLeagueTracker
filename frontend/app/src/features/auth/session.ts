export const TOKEN_STORAGE_KEY = 'myleaguetracker.token';

export interface Session {
  token: string;
  username: string;
  expiresAt: number;
}

interface SessionState {
  session: Session | null;
  expired: boolean;
}

export function decodeSession(token: string): Session {
  const payload = token.split('.')[1];

  if (!payload) {
    throw new Error('Token inválido');
  }

  const padded =
    payload.replaceAll('-', '+').replaceAll('_', '/') +
    '='.repeat((4 - (payload.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const data = JSON.parse(new TextDecoder().decode(bytes)) as { sub?: unknown; exp?: unknown };

  if (typeof data.sub !== 'string' || typeof data.exp !== 'number') {
    throw new Error('Token inválido');
  }

  return { token, username: data.sub, expiresAt: data.exp * 1000 };
}

export function loadSession(storage: Storage = localStorage): SessionState {
  const token = storage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    return { session: null, expired: false };
  }

  try {
    const session = decodeSession(token);

    if (session.expiresAt <= Date.now()) {
      return { session: null, expired: true };
    }

    return { session, expired: false };
  } catch {
    return { session: null, expired: false };
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
