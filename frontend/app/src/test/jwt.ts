function encode(value: unknown): string {
  return btoa(JSON.stringify(value)).replaceAll('=', '').replaceAll('+', '-').replaceAll('/', '_');
}

export function makeToken(payload: { sub: string; exp: number }): string {
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
}
