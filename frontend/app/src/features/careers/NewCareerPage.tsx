import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '../../components/ui/toastContext';
import { messages } from '../../i18n/pt-BR';
import {
  ApiError,
  createCareer,
  getClubs,
  type Club,
  type GameTitle,
} from '../../lib/api/client';
import { gameLabel, initials } from '../../lib/format';

const games: GameTitle[] = ['EA_FC_24', 'EA_FC_25', 'EA_FC_26'];

const careerSchema = z.object({
  game: z.enum(['EA_FC_24', 'EA_FC_25', 'EA_FC_26']),
  manager: z.string().trim().min(1, { message: messages.newCareer.managerRequired }),
  budget: z.string().trim().refine(
    (value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0),
    { message: messages.newCareer.budgetInvalid },
  ),
});

type CareerFormValues = z.infer<typeof careerSchema>;

const labelClass = 'block text-xs font-bold uppercase tracking-widest text-on-surface-variant';
const fieldClass =
  'w-full rounded-lg border-0 bg-surface-container-lowest px-4 py-4 text-on-surface transition-all placeholder:text-outline/50 focus:ring-2 focus:ring-primary';

function ClubLogo({ club }: { club: Club }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-surface-container-highest">
      {club.logo ? (
        <img src={club.logo} alt="" className="h-full w-full object-contain p-1" />
      ) : (
        <span className="font-headline text-xs font-black text-primary">
          {initials(club.name)}
        </span>
      )}
    </span>
  );
}

interface ClubPickerProps {
  clubs: Club[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  selected: Club | null;
  onSelect: (club: Club) => void;
  onClear: () => void;
  freeText: boolean;
  onFreeTextChange: (value: boolean) => void;
  teamName: string;
  onTeamNameChange: (value: string) => void;
  error?: string;
}

function ClubPicker({
  clubs,
  isPending,
  isError,
  onRetry,
  selected,
  onSelect,
  onClear,
  freeText,
  onFreeTextChange,
  teamName,
  onTeamNameChange,
  error,
}: ClubPickerProps) {
  const [search, setSearch] = useState('');
  const term = search.trim().toLocaleLowerCase('pt-BR');
  const filtered = clubs
    .filter((club) => club.name.toLocaleLowerCase('pt-BR').includes(term))
    .slice(0, 8);

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-4">
        <div className="flex items-center gap-3">
          <ClubLogo club={selected} />
          <div>
            <p className="font-bold">{selected.name}</p>
            <p className="text-xs text-on-surface-variant">Rating {selected.clubRating}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-bold uppercase tracking-widest text-primary"
        >
          {messages.newCareer.changeClub}
        </button>
      </div>
    );
  }

  if (freeText) {
    return (
      <div className="space-y-3">
        <input
          value={teamName}
          onChange={(event) => onTeamNameChange(event.target.value)}
          aria-label={messages.newCareer.teamName}
          placeholder={messages.newCareer.teamNamePlaceholder}
          className={fieldClass}
        />
        <button
          type="button"
          onClick={() => onFreeTextChange(false)}
          className="text-xs font-bold uppercase tracking-widest text-primary"
        >
          {messages.newCareer.useClubSearch}
        </button>
        {error ? <p className="text-xs text-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <span
          className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant"
          aria-hidden="true"
        >
          search
        </span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={messages.newCareer.clubSearch}
          aria-label={messages.newCareer.clubSearch}
          className={`${fieldClass} pl-12`}
        />
      </div>

      {isPending ? (
        <p className="px-1 text-sm text-on-surface-variant">{messages.newCareer.loadingClubs}</p>
      ) : null}

      {isError ? (
        <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          <p>{messages.newCareer.clubError}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-bold uppercase tracking-widest underline underline-offset-4"
          >
            {messages.newCareer.clubRetry}
          </button>
        </div>
      ) : null}

      {!isPending && !isError ? (
        clubs.length === 0 ? (
          <p className="px-1 text-sm text-on-surface-variant">{messages.newCareer.clubEmpty}</p>
        ) : filtered.length === 0 ? (
          <p className="px-1 text-sm text-on-surface-variant">
            {messages.newCareer.clubNoResults}
          </p>
        ) : (
          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {filtered.map((club) => (
              <li key={club.id}>
                <button
                  type="button"
                  onClick={() => onSelect(club)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-primary/10"
                >
                  <ClubLogo club={club} />
                  <span className="flex-1 font-bold">{club.name}</span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {club.clubRating}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : null}

      <button
        type="button"
        onClick={() => onFreeTextChange(true)}
        className="text-xs font-bold uppercase tracking-widest text-primary"
      >
        {messages.newCareer.useFreeText}
      </button>

      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
}

export function NewCareerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [club, setClub] = useState<Club | null>(null);
  const [freeText, setFreeText] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamError, setTeamError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);

  const clubsQuery = useQuery({
    queryKey: ['clubs'],
    queryFn: getClubs,
    staleTime: 60 * 60_000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CareerFormValues>({
    resolver: zodResolver(careerSchema),
    defaultValues: { game: 'EA_FC_26', manager: '', budget: '' },
  });

  const resolveTeamName = () => club?.name ?? (freeText ? teamName.trim() : '');

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setRetryable(false);

    const resolvedTeamName = resolveTeamName();

    if (!resolvedTeamName) {
      setTeamError(messages.newCareer.teamRequired);
      return;
    }

    setTeamError(null);

    try {
      const created = await createCareer({
        game: values.game,
        manager: values.manager,
        teamName: resolvedTeamName,
        clubId: club?.id ?? null,
        budget: values.budget === '' ? null : Number(values.budget),
      });

      showToast(messages.newCareer.success);
      void navigate({
        to: '/careers/$careerId/squad',
        params: { careerId: String(created.id) },
      });
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(messages.newCareer.error);
        setRetryable(true);
      }
    }
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!resolveTeamName()) {
      setTeamError(messages.newCareer.teamRequired);
    }

    void onSubmit(event);
  };

  const handleSelectClub = (selected: Club) => {
    setClub(selected);
    setFreeText(false);
    setTeamError(null);
  };

  const handleFreeText = (value: boolean) => {
    setFreeText(value);
    setClub(null);
    setTeamError(null);
  };

  return (
    <section className="px-6 py-10 lg:px-12">
      <div className="mb-8">
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-dim"
        >
          {messages.newCareer.back}
        </Link>
        <h1 className="mt-2 font-headline text-5xl font-black uppercase italic tracking-tighter">
          {messages.newCareer.title}
        </h1>
        <p className="mt-2 font-medium text-on-surface-variant">{messages.newCareer.subtitle}</p>
      </div>

      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="max-w-3xl space-y-8 rounded-2xl bg-surface-container-low p-6 lg:p-8"
      >
        <div className="space-y-2">
          <span className={labelClass}>{messages.newCareer.game}</span>
          <div className="flex rounded-xl bg-surface-container-lowest p-1">
            {games.map((game) => (
              <label key={game} className="flex-1 cursor-pointer">
                <input type="radio" value={game} className="peer sr-only" {...register('game')} />
                <span className="block rounded-lg py-3 text-center text-[10px] font-black uppercase tracking-widest text-outline transition-all peer-checked:bg-primary peer-checked:text-on-primary-fixed">
                  {gameLabel(game)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="manager" className={labelClass}>
            {messages.newCareer.manager}
          </label>
          <input
            id="manager"
            type="text"
            aria-invalid={Boolean(errors.manager)}
            className={fieldClass}
            placeholder={messages.newCareer.managerPlaceholder}
            {...register('manager')}
          />
          {errors.manager ? (
            <p className="text-xs text-error">{errors.manager.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <span className={labelClass}>{messages.newCareer.club}</span>
          <ClubPicker
            clubs={clubsQuery.data ?? []}
            isPending={clubsQuery.isPending}
            isError={clubsQuery.isError}
            onRetry={() => void clubsQuery.refetch()}
            selected={club}
            onSelect={handleSelectClub}
            onClear={() => setClub(null)}
            freeText={freeText}
            onFreeTextChange={handleFreeText}
            teamName={teamName}
            onTeamNameChange={setTeamName}
            error={teamError ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="budget" className={labelClass}>
            {messages.newCareer.budget}
          </label>
          <input
            id="budget"
            type="text"
            inputMode="decimal"
            aria-invalid={Boolean(errors.budget)}
            className={fieldClass}
            placeholder={messages.newCareer.budgetPlaceholder}
            {...register('budget')}
          />
          {errors.budget ? <p className="text-xs text-error">{errors.budget.message}</p> : null}
        </div>

        {error ? (
          <div role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
            <p>{error}</p>
            {retryable ? (
              <button
                type="button"
                onClick={() => void onSubmit()}
                className="mt-2 text-xs font-bold uppercase tracking-widest underline decoration-error/40 underline-offset-4 transition-colors hover:text-on-surface"
              >
                {messages.newCareer.retry}
              </button>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-br from-primary to-primary-container px-6 py-4 font-headline text-sm font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:shadow-[0_0_20px_rgba(188,255,95,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? messages.newCareer.submitting : messages.newCareer.submit}
        </button>
      </form>
    </section>
  );
}
