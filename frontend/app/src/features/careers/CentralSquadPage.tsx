import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Modal } from '../../components/ui/Modal';
import { messages } from '../../i18n/pt-BR';
import type { Country, Position, SquadPlayer } from '../../lib/api/client';
import { formatMoney } from '../../lib/format';
import { AddSquadPlayerForm } from './AddSquadPlayerForm';
import { useCareer } from './careerContext';
import { footLabels, roleLabels } from './labels';
import { useCountries } from './useCountries';
import { useSquadPositions } from './useSquadPositions';

function positionText(positions: Position[] | undefined): string {
  return positions && positions.length > 0
    ? positions.join(' / ')
    : messages.squad.unknown;
}

function barColor(value: number): string {
  if (value > 80) {
    return 'bg-primary';
  }

  if (value >= 60) {
    return 'bg-secondary';
  }

  return 'bg-error';
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        <span>{label}</span>
        <span className="text-on-surface">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className={`h-full rounded-full ${barColor(value)}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-on-surface">{value}</dd>
    </div>
  );
}

function PlayerDetail({
  player,
  positions,
  country,
  onBack,
}: {
  player: SquadPlayer;
  positions?: Position[];
  country?: Country;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface p-6 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary lg:hidden"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          arrow_back
        </span>
        {messages.squad.back}
      </button>

      <div className="rounded-2xl bg-surface-container-low p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {positionText(positions)} · {roleLabels[player.role]}
            </p>
            <h2 className="mt-1 font-headline text-3xl font-black uppercase italic tracking-tight">
              {player.fullName}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {player.age} {messages.squad.years} · {country?.name ?? messages.squad.unknown}
            </p>
          </div>
          {country?.flag ? (
            <img src={country.flag} alt="" className="h-8 w-12 rounded object-cover" />
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <StatBar label={messages.squad.overall} value={player.currentOverall} />
          <StatBar label={messages.squad.potential} value={player.potentialOverall} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4">
          <Stat
            label={messages.squad.nationality}
            value={country?.name ?? messages.squad.unknown}
          />
          <Stat label={messages.squad.foot} value={footLabels[player.preferredFoot]} />
          <Stat label={messages.squad.yearJoined} value={player.yearJoinedClub} />
          <Stat label={messages.squad.marketValue} value={formatMoney(player.currentMarketValue)} />
          <Stat label={messages.squad.wage} value={formatMoney(player.currentWage)} />
          <Stat label={messages.squad.kit} value={player.kitNumber || messages.squad.unknown} />
        </dl>
      </div>
    </div>
  );
}

function EmptySquad({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low px-8 py-20 text-center">
      <span className="material-symbols-outlined text-6xl text-primary" aria-hidden="true">
        groups
      </span>
      <h2 className="mt-6 font-headline text-2xl font-black uppercase tracking-tight">
        {messages.squad.emptyTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">{messages.squad.emptyBody}</p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-8 flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:shadow-[0_0_20px_rgba(188,255,95,0.3)]"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          person_add
        </span>
        {messages.squad.addFirst}
      </button>
    </div>
  );
}

export function CentralSquadPage() {
  const { careerInfo, careerSquadId, principalSquad } = useCareer();
  const positions = useSquadPositions(principalSquad);
  const countries = useCountries();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdded = () => {
    void queryClient.invalidateQueries({ queryKey: ['career', String(careerInfo.id)] });
  };

  const term = search.trim().toLocaleLowerCase('pt-BR');
  const filtered = principalSquad.filter((player) =>
    player.fullName.toLocaleLowerCase('pt-BR').includes(term),
  );
  const selected = principalSquad.find((player) => player.id === selectedId) ?? null;

  return (
    <section className="px-6 pb-10 lg:px-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {messages.squad.eyebrow}
          </span>
          <h1 className="mt-1 font-headline text-4xl font-black uppercase italic tracking-tighter">
            {messages.squad.title}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {principalSquad.length} {messages.squad.countLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:shadow-[0_0_20px_rgba(188,255,95,0.3)]"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">
            person_add
          </span>
          {messages.squad.add}
        </button>
      </header>

      {principalSquad.length === 0 ? (
        <EmptySquad onAdd={() => setIsAdding(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div>
            <div className="relative mb-4">
              <span
                className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant"
                aria-hidden="true"
              >
                search
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={messages.squad.searchPlaceholder}
                aria-label={messages.squad.searchPlaceholder}
                className="w-full rounded-xl border-0 bg-surface-container-low py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-xl bg-surface-container-low px-4 py-8 text-center text-sm text-on-surface-variant">
                {messages.squad.noResults}
              </p>
            ) : (
              <ul className="space-y-2">
                {filtered.map((player) => {
                  const active = player.id === selectedId;

                  return (
                    <li key={player.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(player.id)}
                        aria-pressed={active}
                        className={`flex w-full items-center gap-4 border-l-4 px-4 py-3 text-left transition-colors ${
                          active
                            ? 'border-primary bg-surface-bright'
                            : 'border-transparent bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <span className="w-8 text-center font-headline text-xl font-black text-primary/40">
                          {player.kitNumber || messages.squad.unknown}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-primary">
                            {positionText(positions.get(player.id))}
                          </span>
                          <span className="block truncate font-headline font-bold">
                            {player.fullName}
                          </span>
                          <span className="block text-[10px] text-on-surface-variant">
                            {roleLabels[player.role]}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="flex items-baseline justify-end gap-1">
                            <span className="font-headline text-xl font-black">
                              {player.currentOverall}
                            </span>
                            <span className="text-xs text-on-surface-variant">
                              /{player.potentialOverall}
                            </span>
                          </span>
                          <span className="block text-[10px] text-on-surface-variant">
                            {player.age} {messages.squad.years}
                          </span>
                          <span className="block text-[10px] text-on-surface-variant">
                            {formatMoney(player.currentMarketValue)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {selected ? (
            <PlayerDetail
              player={selected}
              positions={positions.get(selected.id)}
              country={
                selected.countryId === null ? undefined : countries.get(selected.countryId)
              }
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="hidden items-center justify-center rounded-2xl bg-surface-container-low p-10 text-center text-sm text-on-surface-variant lg:flex">
              {messages.squad.selectPlayer}
            </div>
          )}
        </div>
      )}

      <Modal open={isAdding} onClose={() => setIsAdding(false)} title={messages.squad.add}>
        <AddSquadPlayerForm
          careerSquadId={careerSquadId}
          onClose={() => setIsAdding(false)}
          onAdded={handleAdded}
        />
      </Modal>
    </section>
  );
}
