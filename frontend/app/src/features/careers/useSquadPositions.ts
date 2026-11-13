import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  searchCatalogPlayers,
  type Position,
  type SquadPlayer,
} from '../../lib/api/client';
import { matchPosition, normalizeName } from './enrichment';

const MAX_CONCURRENT = 4;

let active = 0;
const queue: Array<() => void> = [];

function withSlot<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      active += 1;
      task()
        .then(resolve, reject)
        .finally(() => {
          active -= 1;
          queue.shift()?.();
        });
    };

    if (active < MAX_CONCURRENT) {
      run();
    } else {
      queue.push(run);
    }
  });
}

export function useSquadPositions(players: SquadPlayer[]): Map<number, Position[]> {
  const queries = useQueries({
    queries: players.map((player) => ({
      queryKey: ['catalog-position', normalizeName(player.fullName)],
      queryFn: () => withSlot(() => searchCatalogPlayers(player.fullName)),
      staleTime: 5 * 60_000,
      retry: false,
    })),
  });

  return useMemo(() => {
    const positions = new Map<number, Position[]>();

    players.forEach((player, index) => {
      const data = queries[index]?.data;
      const matched = data ? matchPosition(player, data.content) : null;

      if (matched) {
        positions.set(player.id, matched);
      }
    });

    return positions;
  }, [players, queries]);
}
