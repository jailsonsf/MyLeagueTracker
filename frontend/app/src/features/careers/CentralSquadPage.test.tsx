import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_URL, type CatalogPlayer, type SquadPlayer } from '../../lib/api/client';
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

const vini: SquadPlayer = {
  id: 10,
  fullName: 'Vini Jr',
  image: null,
  age: 24,
  yearJoinedClub: 2024,
  startingOverall: 80,
  currentOverall: 91,
  potentialOverall: 95,
  currentMarketValue: 100000000,
  currentWage: 1000000,
  preferredFoot: 'RIGHT',
  countryId: 1,
  careerSquadId: 42,
  role: 'CRUCIAL',
  kitNumber: 7,
};

const bellingham: SquadPlayer = {
  ...vini,
  id: 11,
  fullName: 'Bellingham',
  age: 21,
  currentOverall: 90,
  potentialOverall: 94,
  currentMarketValue: 180000000,
  currentWage: 1200000,
  countryId: 2,
  role: 'IMPORTANT',
  kitNumber: 5,
};

const countries = [
  { id: 1, name: 'Brasil', code: 'BRA', flag: 'https://flags.example/br.png' },
  { id: 2, name: 'Inglaterra', code: 'ENG', flag: 'https://flags.example/en.png' },
];

const catalog: Record<string, CatalogPlayer> = {
  'vini jr': { id: 1, fullName: 'Vini Jr', overall: 90, potential: 95, positions: ['LW'] },
  bellingham: { id: 2, fullName: 'Bellingham', overall: 90, potential: 94, positions: ['CM'] },
};

function mockCareerWorld(squad: SquadPlayer[] = [vini, bellingham]) {
  server.use(
    http.get(`${API_URL}/api/careers/7/dashboard`, () =>
      HttpResponse.json({
        careerInfo: career,
        careerSquadId: 42,
        principalSquad: squad,
        youthSquad: [],
      }),
    ),
    http.get(`${API_URL}/api/countries`, () => HttpResponse.json(countries)),
    http.get(`${API_URL}/api/catalog/players`, ({ request }) => {
      const name = new URL(request.url).searchParams.get('fullName') ?? '';
      const match = catalog[name.toLocaleLowerCase('pt-BR')];

      return HttpResponse.json({ content: match ? [match] : [] });
    }),
    http.get(`${API_URL}/api/careers`, () => HttpResponse.json([])),
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('central squad', () => {
  it('lists the squad with positions and the career context', async () => {
    mockCareerWorld();

    renderRoute('/careers/7/squad', { token });

    expect(await screen.findByText('Vini Jr')).toBeInTheDocument();
    expect(await screen.findByText('LW')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'FC Test' })).toBeInTheDocument();
    expect(screen.getByText(/Manager: Ana/)).toBeInTheDocument();

    const row = screen.getByRole('button', { name: /vini jr/i });
    expect(within(row).getByText('91')).toBeInTheDocument();
    expect(within(row).getByText('/95')).toBeInTheDocument();
    expect(within(row).getByText('24 anos')).toBeInTheDocument();
    expect(within(row).getByText('Crucial')).toBeInTheDocument();
    expect(within(row).getByText(/€\s100\.000\.000/)).toBeInTheDocument();
  });

  it('filters the squad by name', async () => {
    mockCareerWorld();

    renderRoute('/careers/7/squad', { token });
    await screen.findByText('Vini Jr');

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/buscar jogador/i), 'belling');

    expect(screen.queryByText('Vini Jr')).not.toBeInTheDocument();
    expect(screen.getByText('Bellingham')).toBeInTheDocument();
  });

  it('opens the player detail with nationality and preferred foot', async () => {
    mockCareerWorld();

    renderRoute('/careers/7/squad', { token });
    await screen.findByText('Vini Jr');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /vini jr/i }));

    expect(await screen.findByText('Brasil')).toBeInTheDocument();
    expect(screen.getByText('Pé preferido')).toBeInTheDocument();
    expect(screen.getByText('Direito')).toBeInTheDocument();
    expect(screen.getByText('Valor de mercado')).toBeInTheDocument();
  });

  it('shows a dash when the catalog has no position for the player', async () => {
    mockCareerWorld([{ ...vini, fullName: 'Unknown Player' }]);

    renderRoute('/careers/7/squad', { token });

    const row = await screen.findByRole('button', { name: /unknown player/i });
    expect(await within(row).findByText('—')).toBeInTheDocument();
  });

  it('shows an empty squad with the add player call to action', async () => {
    mockCareerWorld([]);

    renderRoute('/careers/7/squad', { token });

    expect(await screen.findByText(/elenco vazio/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar o primeiro jogador/i }),
    ).toBeEnabled();
  });

  it('adds a player from the empty squad call to action', async () => {
    let payload: unknown;
    let dashboardCalls = 0;
    const newPlayer: SquadPlayer = {
      ...vini,
      id: 12,
      fullName: 'Novo Jogador',
      age: 22,
      currentOverall: 75,
      potentialOverall: 85,
      currentMarketValue: 5000000,
      countryId: 1,
      kitNumber: 0,
    };

    mockCareerWorld([]);
    server.use(
      http.get(`${API_URL}/api/careers/7/dashboard`, () => {
        dashboardCalls += 1;

        return HttpResponse.json({
          careerInfo: career,
          careerSquadId: 42,
          principalSquad: dashboardCalls === 1 ? [] : [newPlayer],
          youthSquad: [],
        });
      }),
      http.post(`${API_URL}/api/squad/players`, async ({ request }) => {
        payload = await request.json();
        return HttpResponse.json(newPlayer);
      }),
    );

    renderRoute('/careers/7/squad', { token });

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole('button', { name: /adicionar o primeiro jogador/i }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/nome completo/i), 'Novo Jogador');
    await user.type(within(dialog).getByLabelText(/^idade$/i), '22');
    await user.type(within(dialog).getByLabelText(/^overall$/i), '75');
    await user.type(within(dialog).getByLabelText(/^potential$/i), '85');
    await user.selectOptions(within(dialog).getByLabelText(/país/i), '1');
    await user.click(within(dialog).getByRole('button', { name: /adicionar ao elenco/i }));

    expect(await screen.findByText('Jogador adicionado ao elenco.')).toBeInTheDocument();
    expect(await screen.findByText('Novo Jogador')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(payload).toMatchObject({
      fullName: 'Novo Jogador',
      age: 22,
      currentOverall: 75,
      potentialOverall: 85,
      careerSquadId: 42,
      countryId: 1,
    });
  });

  it('opens the add form from the header when the squad already has players', async () => {
    mockCareerWorld();
    renderRoute('/careers/7/squad', { token });
    await screen.findByText('Vini Jr');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /^adicionar jogador$/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('validates the player form before submitting', async () => {
    mockCareerWorld([]);
    renderRoute('/careers/7/squad', { token });

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole('button', { name: /adicionar o primeiro jogador/i }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /adicionar ao elenco/i }));

    expect(await within(dialog).findByText(/informe o nome do jogador/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/informe uma idade entre 14 e 60/i)).toBeInTheDocument();
  });

  it('keeps the form open and shows an error when the API fails', async () => {
    mockCareerWorld([]);
    server.use(
      http.post(`${API_URL}/api/squad/players`, () => new HttpResponse(null, { status: 500 })),
    );

    renderRoute('/careers/7/squad', { token });

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole('button', { name: /adicionar o primeiro jogador/i }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/nome completo/i), 'Novo Jogador');
    await user.type(within(dialog).getByLabelText(/^idade$/i), '22');
    await user.type(within(dialog).getByLabelText(/^overall$/i), '75');
    await user.type(within(dialog).getByLabelText(/^potential$/i), '85');
    await user.click(within(dialog).getByRole('button', { name: /adicionar ao elenco/i }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      /não foi possível adicionar o jogador/i,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('navigates to the youth academy and back to the dashboard', async () => {
    mockCareerWorld();

    renderRoute('/careers/7/squad', { token });
    await screen.findByText('Vini Jr');

    const user = userEvent.setup();
    const academyLinks = await screen.findAllByRole('link', { name: /academia/i });
    await user.click(academyLinks[0]);

    expect(await screen.findByRole('heading', { name: /youth academy/i })).toBeInTheDocument();

    await user.click(await screen.findByRole('link', { name: /trocar carreira/i }));

    expect(await screen.findByRole('heading', { name: /minhas carreiras/i })).toBeInTheDocument();
  });
});
