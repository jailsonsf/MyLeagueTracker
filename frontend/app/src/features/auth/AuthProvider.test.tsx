import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { notifyUnauthorized } from '../../lib/api/authBridge';
import { makeToken } from '../../test/jwt';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './authContext';
import { TOKEN_STORAGE_KEY } from './session';

function SessionProbe() {
  const { session } = useAuth();

  return <span>{session ? `logado:${session.username}` : 'sem sessão'}</span>;
}

describe('auth provider', () => {
  it('clears the session when the API reports 401/403', async () => {
    const token = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText('logado:boss')).toBeInTheDocument();

    act(() => notifyUnauthorized());

    expect(screen.getByText('sem sessão')).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
