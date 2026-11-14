import type { CatalogPlayer, Position } from '../../lib/api/client';

export function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase('pt-BR');
}

export function matchPosition(
  player: { fullName: string; currentOverall: number },
  candidates: CatalogPlayer[],
): Position[] | null {
  const name = normalizeName(player.fullName);
  const matches = candidates.filter((candidate) => normalizeName(candidate.fullName) === name);

  if (matches.length === 0) {
    return null;
  }

  const best = matches.reduce((closest, candidate) =>
    Math.abs(candidate.overall - player.currentOverall) <
    Math.abs(closest.overall - player.currentOverall)
      ? candidate
      : closest,
  );

  return best.positions.length > 0 ? best.positions : null;
}
