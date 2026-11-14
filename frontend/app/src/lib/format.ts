import type { GameTitle } from './api/client';

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function formatMoney(value: number | null | undefined): string {
  return value == null ? '—' : money.format(value);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function gameLabel(game: GameTitle): string {
  return game.replace('EA_FC_', 'EA FC ');
}

export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return '—';
  }

  const [year, month, day] = isoDate.split('-').map(Number);

  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day));
}
