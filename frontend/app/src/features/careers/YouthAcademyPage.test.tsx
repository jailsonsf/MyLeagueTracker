import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_URL, type CatalogPlayer, type YouthPlayer } from '../../lib/api/client';
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

const mateo: YouthPlayer = {
  id: 20,
  fullName: 'Mateo Valencia',
  startingOverall: 60,
  currentOverall: 64,
  potentialOverall: 89,
  currentMarketValue: 2000000,
  currentWage: 5000,
  image: null,
  heightCm: 180,
  weightKg: 75,
  age: 16,
  yearJoinedClub: 2025,
  preferredFoot: 'LEFT',
  kitNumber: 45,
  countryId: 1,
  careerSquadId: 42,
  role: 'PROSPECT',
};

const lucas: YouthPlayer = {
  ...mateo,
  id: 21,
  fullName: 'Lucas Silva',
  currentOverall: 58,
  potentialOverall: 81,
  currentMarketValue: 800000,
  age: 17,
  preferredFoot: 'RIGHT',
  kitNumber: 30,
};

const catalog: Record<string, CatalogPlayer> = {
  'mateo valencia': {
    id: 1,
    fullName: 'Mateo Valencia',
    overall: 64,
    potential: 89,
    positions: ['CM'],
  },
  'lucas silva': { id: 2, fullName: 'Lucas Silva', overall: 58, potential: 81, positions: ['ST'] },
};

function mockYouthWorld(youth: YouthPlayer[] = [mateo, lucas]) {
  server.use(
    http.get(`${API_URL}/api/careers/7/dashboard`, () =>
      HttpResponse.json({
        careerInfo: career,
        careerSquadId: 42,
        principalSquad: [],
        youthSquad: youth,
      }),
    ),
    http.get(`${API_URL}/api/catalog/players`, ({ request }) => {
      const name = new URL(request.url).searchParams.get('fullName') ?? '';
      const match = catalog[name.toLocaleLowerCase('pt-BR')];

      return HttpResponse.json({ content: match ? [match] : [] });
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('youth academy', () => {
  it('shows the academy metrics, the featured prospect and the list', async () => {
    mockYouthWorld();

    renderRoute('/careers/7/youth', { token });

    expect(await screen.findByText(/2 jovens na academia/i)).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText(/maior potential/i)).toBeInTheDocument();
    expect(screen.getAllByText('Mateo Valencia').length).toBeGreaterThan(0);
    expect(screen.getByText('Lucas Silva')).toBeInTheDocument();
    expect(await screen.findByText('CM')).toBeInTheDocument();
    expect(await screen.findByText('ST')).toBeInTheDocument();
    expect(screen.getByText(/17 anos/)).toBeInTheDocument();
    expect(screen.getByText(/€\s2\.000\.000/)).toBeInTheDocument();
  });

  it('shows an empty academy without an add action', async () => {
    mockYouthWorld([]);

    renderRoute('/careers/7/youth', { token });

    expect(await screen.findByText(/academia vazia/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /adicionar/i })).not.toBeInTheDocument();
  });

  it('shows the career error and retry when the dashboard fails', async () => {
    server.use(
      http.get(`${API_URL}/api/careers/7/dashboard`, () => new HttpResponse(null, { status: 500 })),
    );

    renderRoute('/careers/7/youth', { token });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível carregar a carreira/i,
    );
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });
});
