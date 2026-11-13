import type { Position, PreferredFoot, PlayerRole } from '../../lib/api/client';
import { messages } from '../../i18n/pt-BR';

export const roleLabels: Record<PlayerRole, string> = {
  CRUCIAL: 'Crucial',
  IMPORTANT: 'Importante',
  SPORADIC: 'Esporádico',
  ROTATION: 'Rotação',
  PROSPECT: 'Promessa',
};

export const footLabels: Record<PreferredFoot, string> = {
  LEFT: messages.squad.leftFoot,
  RIGHT: messages.squad.rightFoot,
};

export function positionText(positions: Position[] | undefined): string {
  return positions && positions.length > 0
    ? positions.join(' / ')
    : messages.squad.unknown;
}
