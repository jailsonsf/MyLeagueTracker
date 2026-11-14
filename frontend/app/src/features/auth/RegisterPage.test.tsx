import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_URL } from '../../lib/api/client';
import { makeToken } from '../../test/jwt';
import { server } from '../../test/msw/server';
import { renderRoute } from '../../test/renderRoute';
import { TOKEN_STORAGE_KEY } from './session';

const token = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) + 3600 });

beforeEach(() => {
  localStorage.clear();
});

async function fillRegistration(
  username = 'boss',
  email = 'boss@example.com',
  password = 'secret',
) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText(/^username$/i), username);
  await user.type(await screen.findByLabelText(/^email$/i), email);
  await user.type(await screen.findByLabelText(/^senha$/i), password);
  await user.click(await screen.findByRole('button', { name: /^criar conta$/i }));
}

describe('registration', () => {
  it('creates the account and signs in automatically', async () => {
    server.use(
      http.post(`${API_URL}/auth/register`, () =>
        HttpResponse.text('Usuário registrado com sucesso!'),
      ),
      http.post(`${API_URL}/auth/login`, () => HttpResponse.json({ token })),
    );

    renderRoute('/register');
    await fillRegistration();

    expect(
      await screen.findByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('boss')).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(token);
  });

  it('shows a clear message when the account already exists', async () => {
    server.use(
      http.post(`${API_URL}/auth/register`, () =>
        new HttpResponse('Erro: Username ou email já estão em uso', { status: 400 }),
      ),
    );

    renderRoute('/register');
    await fillRegistration();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /username ou email já estão em uso/i,
    );
  });

  it('validates the fields before submitting', async () => {
    renderRoute('/register');

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /^criar conta$/i }));

    expect(await screen.findByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/email válido/i)).toBeInTheDocument();
    expect(screen.getByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
  });

  it('links between login and registration', async () => {
    renderRoute('/login');

    const user = userEvent.setup();
    await user.click(await screen.findByRole('link', { name: /criar conta/i }));

    expect(await screen.findByRole('heading', { name: /criar conta/i })).toBeInTheDocument();

    await user.click(await screen.findByRole('link', { name: /^entrar$/i }));

    expect(
      await screen.findByRole('heading', { name: /acesso do manager/i }),
    ).toBeInTheDocument();
  });
});
