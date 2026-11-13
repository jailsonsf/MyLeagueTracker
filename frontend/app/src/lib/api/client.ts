import { getAuthToken, notifyUnauthorized } from './authBridge';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`A API respondeu com status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, auth = true, ...init } = options;
  const token = auth ? getAuthToken() : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const payload = text.length === 0 ? null : parseBody(text);

  if (!response.ok) {
    if (auth && (response.status === 401 || response.status === 403)) {
      notifyUnauthorized();
    }

    throw new ApiError(response.status, payload);
  }

  return payload as T;
}

function parseBody(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export type GameTitle = 'EA_FC_24' | 'EA_FC_25' | 'EA_FC_26';

export interface CareerDetails {
  id: number;
  game: GameTitle;
  manager: string;
  teamName: string;
  teamLogo: string | null;
  startDate: string;
  budget: number | null;
}

export type PreferredFoot = 'LEFT' | 'RIGHT';
export type PlayerRole = 'CRUCIAL' | 'IMPORTANT' | 'SPORADIC' | 'ROTATION' | 'PROSPECT';
export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LM'
  | 'RM'
  | 'ST'
  | 'LW'
  | 'RW'
  | 'CF';

export interface SquadPlayer {
  id: number;
  fullName: string;
  image: string | null;
  age: number;
  yearJoinedClub: number;
  startingOverall: number;
  currentOverall: number;
  potentialOverall: number;
  currentMarketValue: number;
  currentWage: number;
  preferredFoot: PreferredFoot;
  countryId: number | null;
  careerSquadId: number;
  role: PlayerRole;
  kitNumber: number;
}

export interface YouthPlayer {
  id: number;
  fullName: string;
  startingOverall: number;
  currentOverall: number;
  potentialOverall: number;
  currentMarketValue: number;
  currentWage: number;
  image: string | null;
  heightCm: number;
  weightKg: number;
  age: number;
  yearJoinedClub: number;
  preferredFoot: PreferredFoot;
  kitNumber: number;
  countryId: number | null;
  careerSquadId: number;
  role: PlayerRole;
}

export interface CareerDashboard {
  careerInfo: CareerDetails;
  careerSquadId: number;
  principalSquad: SquadPlayer[];
  youthSquad: YouthPlayer[];
}

export interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface Club {
  id: number;
  name: string;
  logo: string | null;
  clubRating: number;
}

export interface CreateCareer {
  game: GameTitle;
  manager: string;
  teamName: string;
  clubId: number | null;
  budget: number | null;
}

export interface AddSquadPlayerInput {
  fullName: string;
  age: number;
  yearJoinedClub: number;
  currentOverall: number;
  potentialOverall: number;
  currentMarketValue: number;
  preferredFoot: PreferredFoot;
  countryId: number | null;
  careerSquadId: number;
  role: PlayerRole;
}

export interface CatalogPlayer {
  id: number;
  fullName: string;
  overall: number;
  potential: number;
  positions: Position[];
}

export interface PageResponse<T> {
  content: T[];
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterAccount {
  username: string;
  email: string;
  password: string;
}

export function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  });
}

export function registerAccount(account: RegisterAccount): Promise<string> {
  return request<string>('/auth/register', {
    method: 'POST',
    body: account,
    auth: false,
  });
}

export function getCareers(): Promise<CareerDetails[]> {
  return request<CareerDetails[]>('/api/careers');
}

export function getClubs(): Promise<Club[]> {
  return request<Club[]>('/api/clubs');
}

export function createCareer(career: CreateCareer): Promise<CareerDetails> {
  return request<CareerDetails>('/api/careers', { method: 'POST', body: career });
}

export function getCareerDashboard(careerId: string | number): Promise<CareerDashboard> {
  return request<CareerDashboard>(`/api/careers/${careerId}/dashboard`);
}

export function getCountries(): Promise<Country[]> {
  return request<Country[]>('/api/countries');
}

export function addSquadPlayer(player: AddSquadPlayerInput): Promise<SquadPlayer> {
  return request<SquadPlayer>('/api/squad/players', {
    method: 'POST',
    body: {
      ...player,
      image: null,
      startingOverall: 0,
      currentWage: 0,
      kitNumber: 0,
    },
  });
}

export function searchCatalogPlayers(fullName: string): Promise<PageResponse<CatalogPlayer>> {
  const params = new URLSearchParams({ fullName, size: '20' });

  return request<PageResponse<CatalogPlayer>>(`/api/catalog/players?${params.toString()}`);
}
