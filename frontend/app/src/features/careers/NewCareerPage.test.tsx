import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_URL } from '../../lib/api/client';
import { makeToken } from '../../test/jwt';
import { server } from '../../test/msw/server';
import { renderRoute } from '../../test/renderRoute';

const token = makeToken({ sub: 'boss', exp: Math.floor(Date.now() / 1000) + 3600 });

const clubs = [
  { id: 1, name: 'Real Madrid', logo: 'https://logo.example/rm.png', clubRating: 5 },
  { id: 2, name: 'Arsenal', logo: null, clubRating: 4 },
];

const createdCareer = {
  id: 9,
  game: 'EA_FC_25' as const,
  manager: 'Ana',
  teamName: 'Real Madrid',
  teamLogo: 'https://logo.example/rm.png',
  startDate: '2026-09-15',
  budget: 1000,
};

function mockNewCareerWorld(clubList = clubs) {
  server.use(
    http.get(`${API_URL}/api/clubs`, () => HttpResponse.json(clubList)),
    http.get(`${API_URL}/api/countries`, () => HttpResponse.json([])),
    http.get(`${API_URL}/api/careers/9/dashboard`, () =>
      HttpResponse.json({
        careerInfo: createdCareer,
        careerSquadId: 99,
        principalSquad: [],
        youthSquad: [],
      }),
    ),
  );
}

async function fillManagerAndBudget(manager = 'Ana', budget = '') {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText(/^manager$/i), manager);

  if (budget) {
    await user.type(screen.getByLabelText(/orçamento/i), budget);
  }

  return user;
}

beforeEach(() => {
  localStorage.clear();
});

describe('new career', () => {
  it('creates the career with the selected club and opens the squad', async () => {
    let payload: unknown;
    mockNewCareerWorld();
    server.use(
      http.post(`${API_URL}/api/careers`, async ({ request }) => {
        payload = await request.json();
        return HttpResponse.json(createdCareer, { status: 201 });
      }),
    );

    renderRoute('/careers/new', { token });

    const user = await fillManagerAndBudget();
    await user.type(screen.getByPlaceholderText(/buscar clube/i), 'real');
    await user.click(await screen.findByRole('button', { name: /real madrid/i }));
    await user.type(screen.getByLabelText(/orçamento/i), '1000');
    await user.click(screen.getByRole('radio', { name: /ea fc 25/i }));
    await user.click(screen.getByRole('button', { name: /iniciar carreira/i }));

    expect(await screen.findByText('Carreira criada com sucesso.')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /central squad/i })).toBeInTheDocument();
    expect(payload).toEqual({
      game: 'EA_FC_25',
      manager: 'Ana',
      teamName: 'Real Madrid',
      clubId: 1,
      budget: 1000,
    });
  });

  it('filters the club catalog by name', async () => {
    mockNewCareerWorld();
    renderRoute('/careers/new', { token });

    const user = userEvent.setup();
    await user.type(await screen.findByPlaceholderText(/buscar clube/i), 'ars');

    expect(await screen.findByRole('button', { name: /arsenal/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /real madrid/i })).not.toBeInTheDocument();
  });

  it('accepts a free-text team name when the club catalog is empty', async () => {
    let payload: unknown;
    mockNewCareerWorld([]);
    server.use(
      http.post(`${API_URL}/api/careers`, async ({ request }) => {
        payload = await request.json();
        return HttpResponse.json({ ...createdCareer, teamName: 'FC Livre', teamLogo: null }, { status: 201 });
      }),
    );

    renderRoute('/careers/new', { token });

    const user = await fillManagerAndBudget();
    expect(await screen.findByText(/nenhum clube disponível/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /não encontro meu clube/i }));
    await user.type(await screen.findByLabelText(/nome do time/i), 'FC Livre');
    await user.click(screen.getByRole('button', { name: /iniciar carreira/i }));

    expect(await screen.findByText('Carreira criada com sucesso.')).toBeInTheDocument();
    expect(payload).toMatchObject({ teamName: 'FC Livre', clubId: null });
  });

  it('validates the manager and the team before submitting', async () => {
    mockNewCareerWorld();
    renderRoute('/careers/new', { token });

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /iniciar carreira/i }));

    expect(await screen.findByText(/informe o nome do manager/i)).toBeInTheDocument();
    expect(screen.getByText(/escolha um clube ou informe o nome do time/i)).toBeInTheDocument();
  });

  it('rejects an invalid budget', async () => {
    mockNewCareerWorld();
    renderRoute('/careers/new', { token });

    const user = await fillManagerAndBudget('Ana', 'abc');
    await user.click(screen.getByRole('button', { name: /não encontro meu clube/i }));
    await user.type(screen.getByLabelText(/nome do time/i), 'FC Livre');
    await user.click(screen.getByRole('button', { name: /iniciar carreira/i }));

    expect(await screen.findByText(/informe um orçamento válido/i)).toBeInTheDocument();
  });

  it('offers a retry when the API fails', async () => {
    mockNewCareerWorld();
    server.use(
      http.post(`${API_URL}/api/careers`, () => new HttpResponse(null, { status: 500 })),
    );

    renderRoute('/careers/new', { token });

    const user = await fillManagerAndBudget();
    await user.type(screen.getByPlaceholderText(/buscar clube/i), 'real');
    await user.click(await screen.findByRole('button', { name: /real madrid/i }));
    await user.click(screen.getByRole('button', { name: /iniciar carreira/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível criar a carreira/i,
    );
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });
});
