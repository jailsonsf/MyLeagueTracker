import { beforeEach, describe, expect, it } from 'vitest';

import { makeToken } from '../../test/jwt';
import {
  TOKEN_STORAGE_KEY,
  clearSession,
  decodeSession,
  loadSession,
  saveSession,
} from './session';

const futureExp = 1_800_000_000;

beforeEach(() => {
  localStorage.clear();
});

describe('session', () => {
  it('reads the username and expiry from the token', () => {
    const token = makeToken({ sub: 'boss', exp: futureExp });

    expect(decodeSession(token)).toEqual({
      token,
      username: 'boss',
      expiresAt: futureExp * 1000,
    });
  });

  it('keeps a valid session across reloads', () => {
    const token = makeToken({ sub: 'boss', exp: futureExp });
    saveSession(decodeSession(token));

    expect(loadSession()).toEqual({
      session: { token, username: 'boss', expiresAt: futureExp * 1000 },
      expired: false,
    });
  });

  it('reports an expired session', () => {
    const token = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) - 1 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    expect(loadSession()).toEqual({ session: null, expired: true });
  });

  it('ignores a malformed token', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'not-a-jwt');

    expect(loadSession()).toEqual({ session: null, expired: false });
  });

  it('clears a stored session on sign out', () => {
    saveSession(decodeSession(makeToken({ sub: 'boss', exp: futureExp })));

    clearSession();

    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
