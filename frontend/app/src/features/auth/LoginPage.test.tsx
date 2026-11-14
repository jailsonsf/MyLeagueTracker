import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_URL } from '../../lib/api/client';
import { makeToken } from '../../test/jwt';
import { server } from '../../test/msw/server';
import { renderRoute } from '../../test/renderRoute';
import { TOKEN_STORAGE_KEY } from './session';

const validToken = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) + 3600 });

beforeEach(() => {
  localStorage.clear();
});

async function submitLogin(login = 'boss', password = 'secret') {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText(/login ou email/i), login);
  await user.type(await screen.findByLabelText(/^senha$/i), password);
  await user.click(await screen.findByRole('button', { name: /^entrar$/i }));
}

describe('login', () => {
  it('signs in and shows the authenticated shell', async () => {
    server.use(http.post(`${API_URL}/auth/login`, () => HttpResponse.json({ token: validToken })));

    renderRoute('/login');
    await submitLogin();

    expect(
      await screen.findByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('boss')).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(validToken);
  });

  it('shows a clear message for invalid credentials', async () => {
    server.use(http.post(`${API_URL}/auth/login`, () => new HttpResponse(null, { status: 403 })));

    renderRoute('/login');
    await submitLogin('boss', 'wrong');

    expect(await screen.findByRole('alert')).toHaveTextContent(/login ou senha inválidos/i);
    expect(
      screen.queryByRole('navigation', { name: /navegação principal/i }),
    ).not.toBeInTheDocument();
  });

  it('offers a retry when the API is unavailable', async () => {
    server.use(http.post(`${API_URL}/auth/login`, () => new HttpResponse(null, { status: 500 })));

    renderRoute('/login');
    await submitLogin();

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível entrar/i);
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('redirects a visitor without a session to login', async () => {
    renderRoute('/');

    expect(await screen.findByLabelText(/^senha$/i)).toBeInTheDocument();
  });

  it('restores the session after a reload', async () => {
    renderRoute('/', { token: validToken });

    expect(
      await screen.findByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('boss')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /navegação inferior/i })).toBeInTheDocument();
    expect(screen.getByText(/transferências/i)).toBeInTheDocument();
    expect(screen.getAllByText(/em breve/i).length).toBeGreaterThan(0);
  });

  it('redirects an expired session to login with a notice', async () => {
    const expiredToken = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) - 1 });

    renderRoute('/', { token: expiredToken });

    expect(await screen.findByText(/sua sessão expirou/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('signs out from the account menu', async () => {
    renderRoute('/', { token: validToken });

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /conta/i }));
    await user.click(await screen.findByRole('menuitem', { name: /sair/i }));

    expect(await screen.findByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
