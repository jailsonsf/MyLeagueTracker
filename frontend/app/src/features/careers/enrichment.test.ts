import { describe, expect, it } from 'vitest';

import type { CatalogPlayer } from '../../lib/api/client';
import { matchPosition } from './enrichment';

function catalogPlayer(overrides: Partial<CatalogPlayer> = {}): CatalogPlayer {
  return {
    id: 1,
    fullName: 'Vini Jr',
    overall: 90,
    potential: 95,
    positions: ['LW'],
    ...overrides,
  };
}

describe('position enrichment', () => {
  it('matches the catalog by name, ignoring case and surrounding spaces', () => {
    expect(
      matchPosition({ fullName: '  VINI JR ', currentOverall: 91 }, [catalogPlayer()]),
    ).toEqual(['LW']);
  });

  it('picks the candidate whose overall is closest to the squad player', () => {
    const candidates = [
      catalogPlayer({ id: 1, overall: 80, positions: ['ST'] }),
      catalogPlayer({ id: 2, overall: 92, positions: ['LW'] }),
    ];

    expect(matchPosition({ fullName: 'Vini Jr', currentOverall: 91 }, candidates)).toEqual(['LW']);
  });

  it('returns nothing when the catalog has no player with that name', () => {
    expect(
      matchPosition({ fullName: 'Unknown Player', currentOverall: 70 }, [catalogPlayer()]),
    ).toBeNull();
  });

  it('returns nothing when the catalog player has no positions', () => {
    expect(matchPosition({ fullName: 'Vini Jr', currentOverall: 91 }, [catalogPlayer({ positions: [] })])).toBeNull();
  });
});
