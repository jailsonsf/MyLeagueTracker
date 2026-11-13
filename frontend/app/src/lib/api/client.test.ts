import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../test/msw/server';
import { setAuthToken, setUnauthorizedHandler } from './authBridge';
import {
  API_URL,
  addYouthPlayer,
  createCareer,
  getCareers,
  getClubs,
  login,
  promoteYouthPlayer,
  registerAccount,
} from './client';

const career = {
  id: 1,
  game: 'EA_FC_25' as const,
  manager: 'Ana',
  teamName: 'FC Test',
  teamLogo: null,
  startDate: '2026-01-01',
  budget: 1000,
};

afterEach(() => {
  setAuthToken(null);
  setUnauthorizedHandler(null);
});

describe('api client', () => {
  it('fetches the user careers as JSON', async () => {
    server.use(
      http.get(`${API_URL}/api/careers`, ({ request }) => {
        expect(request.headers.get('accept')).toBe('application/json');
        return HttpResponse.json([career]);
      }),
    );

    await expect(getCareers()).resolves.toEqual([career]);
  });

  it('surfaces the status when the API rejects the request', async () => {
    server.use(http.get(`${API_URL}/api/careers`, () => new HttpResponse(null, { status: 403 })));

    await expect(getCareers()).rejects.toMatchObject({ status: 403 });
  });

  it('sends the bearer token on authenticated requests', async () => {
    setAuthToken('token-123');

    server.use(
      http.get(`${API_URL}/api/careers`, ({ request }) => {
        expect(request.headers.get('authorization')).toBe('Bearer token-123');
        return HttpResponse.json([]);
      }),
    );

    await expect(getCareers()).resolves.toEqual([]);
  });

  it('posts the credentials and returns the token', async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, async ({ request }) => {
        expect(await request.json()).toEqual({ login: 'boss', password: 'secret' });
        return HttpResponse.json({ token: 'jwt' });
      }),
    );

    await expect(login({ login: 'boss', password: 'secret' })).resolves.toEqual({ token: 'jwt' });
  });

  it('lists the club catalog', async () => {
    const club = { id: 1, name: 'Real Madrid', logo: 'https://logo.example/rm.png', clubRating: 5 };

    server.use(http.get(`${API_URL}/api/clubs`, () => HttpResponse.json([club])));

    await expect(getClubs()).resolves.toEqual([club]);
  });

  it('creates a career with the selected club', async () => {
    server.use(
      http.post(`${API_URL}/api/careers`, async ({ request }) => {
        expect(await request.json()).toEqual({
          game: 'EA_FC_25',
          manager: 'Ana',
          teamName: 'Real Madrid',
          clubId: 1,
          budget: 1000,
        });
        return HttpResponse.json(career, { status: 201 });
      }),
    );

    await expect(
      createCareer({
        game: 'EA_FC_25',
        manager: 'Ana',
        teamName: 'Real Madrid',
        clubId: 1,
        budget: 1000,
      }),
    ).resolves.toEqual(career);
  });

  it('adds a youth player', async () => {
    const youth = {
      id: 20,
      fullName: 'Novo Jovem',
      startingOverall: 0,
      currentOverall: 60,
      potentialOverall: 88,
      currentMarketValue: 0,
      currentWage: 0,
      image: null,
      heightCm: 0,
      weightKg: 0,
      age: 18,
      yearJoinedClub: 2026,
      preferredFoot: 'RIGHT',
      kitNumber: 0,
      countryId: null,
      careerSquadId: 42,
      role: 'PROSPECT',
    };

    server.use(
      http.post(`${API_URL}/api/squad/youth-players`, async ({ request }) => {
        expect(await request.json()).toMatchObject({
          fullName: 'Novo Jovem',
          careerSquadId: 42,
          countryId: null,
        });
        return HttpResponse.json(youth);
      }),
    );

    await expect(
      addYouthPlayer({
        fullName: 'Novo Jovem',
        age: 18,
        yearJoinedClub: 2026,
        currentOverall: 60,
        potentialOverall: 88,
        currentMarketValue: 0,
        preferredFoot: 'RIGHT',
        countryId: null,
        careerSquadId: 42,
        role: 'PROSPECT',
      }),
    ).resolves.toEqual(youth);
  });

  it('promotes a youth player', async () => {
    server.use(
      http.post(`${API_URL}/api/squad/youth-players/20/promote`, () =>
        HttpResponse.text('Jogador promovido com sucesso ao elenco principal!'),
      ),
    );

    await expect(promoteYouthPlayer(20)).resolves.toBe(
      'Jogador promovido com sucesso ao elenco principal!',
    );
  });

  it('registers an account and returns the API message', async () => {
    server.use(
      http.post(`${API_URL}/auth/register`, async ({ request }) => {
        expect(await request.json()).toEqual({
          username: 'boss',
          email: 'boss@example.com',
          password: 'secret',
        });
        return HttpResponse.text('Usuário registrado com sucesso!');
      }),
    );

    await expect(
      registerAccount({ username: 'boss', email: 'boss@example.com', password: 'secret' }),
    ).resolves.toBe('Usuário registrado com sucesso!');
  });

  it('surfaces a duplicate account rejection', async () => {
    server.use(
      http.post(`${API_URL}/auth/register`, () =>
        new HttpResponse('Erro: Username ou email já estão em uso', { status: 400 }),
      ),
    );

    await expect(
      registerAccount({ username: 'boss', email: 'boss@example.com', password: 'secret' }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('notifies the app when an authenticated request is rejected', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);

    server.use(http.get(`${API_URL}/api/careers`, () => new HttpResponse(null, { status: 401 })));

    await expect(getCareers()).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('does not treat a rejected login as an expired session', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);

    server.use(
      http.post(`${API_URL}/auth/login`, () => new HttpResponse(null, { status: 403 })),
    );

    await expect(login({ login: 'boss', password: 'wrong' })).rejects.toMatchObject({
      status: 403,
    });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
