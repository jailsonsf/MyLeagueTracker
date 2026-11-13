import type { Position, YouthPlayer } from '../../lib/api/client';
import { messages } from '../../i18n/pt-BR';
import { formatMoney } from '../../lib/format';
import { useCareer } from './careerContext';
import { positionText, roleLabels } from './labels';
import { useSquadPositions } from './useSquadPositions';

function averagePotential(players: YouthPlayer[]): number {
  if (players.length === 0) {
    return 0;
  }

  return Math.round(
    players.reduce((total, player) => total + player.potentialOverall, 0) / players.length,
  );
}

function featuredPlayer(players: YouthPlayer[]): YouthPlayer {
  return players.reduce((best, player) =>
    player.potentialOverall > best.potentialOverall ? player : best,
  );
}

function FeaturedProspect({
  player,
  positions,
}: {
  player: YouthPlayer;
  positions?: Position[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-8">
      <span
        className="pointer-events-none absolute -right-6 -top-10 select-none font-headline text-[140px] font-black italic leading-none text-primary/5"
        aria-hidden="true"
      >
        {player.potentialOverall}
      </span>

      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
        {messages.youth.featured}
      </p>
      <h2 className="mt-2 font-headline text-3xl font-black uppercase italic tracking-tight">
        {player.fullName}
      </h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        {positionText(positions)} · {player.age} {messages.squad.years} ·{' '}
        {roleLabels[player.role]}
      </p>

      <div className="mt-6 flex items-end gap-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {messages.squad.overall}
          </p>
          <p className="font-headline text-3xl font-black">{player.currentOverall}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {messages.squad.potential}
          </p>
          <p className="font-headline text-3xl font-black text-tertiary">
            {player.potentialOverall}
          </p>
        </div>
      </div>
    </div>
  );
}

function YouthCard({ player, positions }: { player: YouthPlayer; positions?: Position[] }) {
  return (
    <article className="rounded-2xl bg-surface-container-low p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
        {positionText(positions)}
      </p>
      <h3 className="mt-1 font-headline text-lg font-bold">{player.fullName}</h3>
      <p className="text-xs text-on-surface-variant">
        {player.age} {messages.squad.years} · {roleLabels[player.role]}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-1">
          <span className="font-headline text-2xl font-black">{player.currentOverall}</span>
          <span className="text-xs text-on-surface-variant">/{player.potentialOverall}</span>
        </div>
        <span className="text-xs font-semibold text-on-surface-variant">
          {formatMoney(player.currentMarketValue)}
        </span>
      </div>
    </article>
  );
}

function EmptyAcademy() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low px-8 py-20 text-center">
      <span className="material-symbols-outlined text-6xl text-primary" aria-hidden="true">
        school
      </span>
      <h2 className="mt-6 font-headline text-2xl font-black uppercase tracking-tight">
        {messages.youth.emptyTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">{messages.youth.emptyBody}</p>
    </div>
  );
}

export function YouthAcademyPage() {
  const { youthSquad } = useCareer();
  const positions = useSquadPositions(youthSquad);

  return (
    <section className="px-6 pb-10 pt-2 lg:px-12">
      <header className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {messages.youth.eyebrow}
        </span>
        <h1 className="mt-1 font-headline text-4xl font-black uppercase italic tracking-tighter">
          {messages.youth.title}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          {youthSquad.length} {messages.youth.countLabel}
        </p>
      </header>

      {youthSquad.length === 0 ? (
        <EmptyAcademy />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="rounded-2xl bg-surface-container-low p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {messages.youth.total}
              </p>
              <p className="mt-1 font-headline text-4xl font-black">{youthSquad.length}</p>

              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {messages.youth.averagePotential}
                </p>
                <p className="mt-1 font-headline text-4xl font-black text-tertiary">
                  {averagePotential(youthSquad)}
                </p>
              </div>
            </div>

            <FeaturedProspect
              player={featuredPlayer(youthSquad)}
              positions={positions.get(featuredPlayer(youthSquad).id)}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {youthSquad.map((player) => (
              <YouthCard key={player.id} player={player} positions={positions.get(player.id)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
