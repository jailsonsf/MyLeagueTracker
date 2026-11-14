import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_URL } from '../../lib/api/client';
import { makeToken } from '../../test/jwt';
import { server } from '../../test/msw/server';
import { renderRoute } from '../../test/renderRoute';

const token = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) + 3600 });

const career = {
  id: 7,
  game: 'EA_FC_25' as const,
  manager: 'Ana',
  teamName: 'FC Test',
  teamLogo: null,
  startDate: '2026-09-15',
  budget: 1000000,
};

beforeEach(() => {
  localStorage.clear();
});

describe('dashboard', () => {
  it('lists the careers with their details', async () => {
    server.use(http.get(`${API_URL}/api/careers`, () => HttpResponse.json([career])));

    renderRoute('/', { token });

    expect(await screen.findByText('FC Test')).toBeInTheDocument();
    expect(screen.getByText('EA FC 25')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('15/09/2026')).toBeInTheDocument();
    expect(screen.getByText(/1\.000\.000/)).toBeInTheDocument();
    expect(screen.getByText('FT')).toBeInTheDocument();
  });

  it('shows an empty state with a create action', async () => {
    server.use(http.get(`${API_URL}/api/careers`, () => HttpResponse.json([])));

    renderRoute('/', { token });

    expect(await screen.findByText(/nenhuma carreira ainda/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /criar carreira/i })).toBeInTheDocument();
  });

  it('offers a retry when the list fails', async () => {
    let calls = 0;

    server.use(
      http.get(`${API_URL}/api/careers`, () => {
        calls += 1;

        return calls === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json([career]);
      }),
    );

    renderRoute('/', { token });

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /tentar novamente/i }));

    expect(await screen.findByText('FC Test')).toBeInTheDocument();
  });

  it('opens the career when a card is selected', async () => {
    server.use(
      http.get(`${API_URL}/api/careers`, () => HttpResponse.json([career])),
      http.get(`${API_URL}/api/careers/7/dashboard`, () =>
        HttpResponse.json({
          careerInfo: career,
          careerSquadId: 42,
          principalSquad: [],
          youthSquad: [],
        }),
      ),
      http.get(`${API_URL}/api/countries`, () => HttpResponse.json([])),
    );

    renderRoute('/', { token });

    const user = userEvent.setup();
    await user.click(await screen.findByRole('link', { name: /fc test/i }));

    expect(await screen.findByRole('heading', { name: /central squad/i })).toBeInTheDocument();
  });
});
