import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  API_URL,
  type CatalogPlayer,
  type SquadPlayer,
  type YouthPlayer,
} from '../../lib/api/client';
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
    http.get(`${API_URL}/api/countries`, () =>
      HttpResponse.json([
        { id: 1, name: 'Brasil', code: 'BRA', flag: 'https://flags.example/br.png' },
      ]),
    ),
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

  it('shows an empty academy with the add action', async () => {
    mockYouthWorld([]);

    renderRoute('/careers/7/youth', { token });

    expect(await screen.findByText(/academia vazia/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar o primeiro jovem/i }),
    ).toBeEnabled();
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

  it('adds a youth player from the empty academy', async () => {
    let payload: unknown;
    let dashboardCalls = 0;
    const newYouth: YouthPlayer = {
      ...mateo,
      id: 22,
      fullName: 'Novo Jovem',
      currentOverall: 60,
      potentialOverall: 88,
      age: 18,
      currentMarketValue: 1000000,
    };

    mockYouthWorld([]);
    server.use(
      http.get(`${API_URL}/api/careers/7/dashboard`, () => {
        dashboardCalls += 1;

        return HttpResponse.json({
          careerInfo: career,
          careerSquadId: 42,
          principalSquad: [],
          youthSquad: dashboardCalls === 1 ? [] : [newYouth],
        });
      }),
      http.post(`${API_URL}/api/squad/youth-players`, async ({ request }) => {
        payload = await request.json();
        return HttpResponse.json(newYouth);
      }),
    );

    renderRoute('/careers/7/youth', { token });

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole('button', { name: /adicionar o primeiro jovem/i }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/nome completo/i), 'Novo Jovem');
    await user.type(within(dialog).getByLabelText(/^idade$/i), '18');
    await user.type(within(dialog).getByLabelText(/^overall$/i), '60');
    await user.type(within(dialog).getByLabelText(/^potential$/i), '88');
    await user.click(within(dialog).getByRole('button', { name: /adicionar à academia/i }));

    expect(await screen.findByText('Jovem adicionado à academia.')).toBeInTheDocument();
    expect((await screen.findAllByText('Novo Jovem')).length).toBeGreaterThan(0);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(payload).toMatchObject({
      fullName: 'Novo Jovem',
      age: 18,
      currentOverall: 60,
      potentialOverall: 88,
      careerSquadId: 42,
    });
  });

  it('validates the youth form before submitting', async () => {
    mockYouthWorld([]);
    renderRoute('/careers/7/youth', { token });

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole('button', { name: /adicionar o primeiro jovem/i }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /adicionar à academia/i }));

    expect(await within(dialog).findByText(/informe o nome do jogador/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/informe uma idade entre 14 e 60/i)).toBeInTheDocument();
  });

  it('promotes a youth player after confirmation and shows it in the squad', async () => {
    let promoteCalls = 0;
    let dashboardCalls = 0;
    const promoted: SquadPlayer = {
      id: 20,
      fullName: 'Mateo Valencia',
      image: null,
      age: 16,
      yearJoinedClub: 2025,
      startingOverall: 60,
      currentOverall: 64,
      potentialOverall: 89,
      currentMarketValue: 2000000,
      currentWage: 5000,
      preferredFoot: 'LEFT',
      countryId: 1,
      careerSquadId: 42,
      role: 'PROSPECT',
      kitNumber: 0,
    };

    mockYouthWorld([mateo, lucas]);
    server.use(
      http.get(`${API_URL}/api/careers/7/dashboard`, () => {
        dashboardCalls += 1;

        return HttpResponse.json({
          careerInfo: career,
          careerSquadId: 42,
          principalSquad: dashboardCalls === 1 ? [] : [promoted],
          youthSquad: dashboardCalls === 1 ? [mateo, lucas] : [],
        });
      }),
      http.post(`${API_URL}/api/squad/youth-players/20/promote`, () => {
        promoteCalls += 1;
        return HttpResponse.text('Jogador promovido com sucesso ao elenco principal!');
      }),
    );

    renderRoute('/careers/7/youth', { token });

    const user = userEvent.setup();
    await screen.findByText('Mateo Valencia', { selector: 'h3' });
    const mateoCard = screen.getByText('Mateo Valencia', { selector: 'h3' }).closest('article');
    expect(mateoCard).not.toBeNull();

    await user.click(within(mateoCard as HTMLElement).getByRole('button', { name: /promover/i }));

    let dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText(/promover mateo valencia ao elenco principal/i),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /cancelar/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(promoteCalls).toBe(0);

    await user.click(within(mateoCard as HTMLElement).getByRole('button', { name: /promover/i }));
    dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^promover$/i }));

    expect(await screen.findByText('Jovem promovido ao elenco principal.')).toBeInTheDocument();
    expect(await screen.findByText(/academia vazia/i)).toBeInTheDocument();
    expect(promoteCalls).toBe(1);

    const squadLinks = await screen.findAllByRole('link', { name: /elenco/i });
    await user.click(squadLinks[0]);

    expect(await screen.findByText('Mateo Valencia')).toBeInTheDocument();
  });

  it('keeps the promotion dialog open when the API fails', async () => {
    mockYouthWorld();
    server.use(
      http.post(`${API_URL}/api/squad/youth-players/20/promote`, () =>
        new HttpResponse(null, { status: 500 }),
      ),
    );

    renderRoute('/careers/7/youth', { token });

    const user = userEvent.setup();
    await screen.findByText('Mateo Valencia', { selector: 'h3' });
    const mateoCard = screen.getByText('Mateo Valencia', { selector: 'h3' }).closest('article');

    await user.click(within(mateoCard as HTMLElement).getByRole('button', { name: /promover/i }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^promover$/i }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      /não foi possível promover o jovem/i,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
