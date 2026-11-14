import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { messages } from '../../i18n/pt-BR';
import { getCareers, type CareerDetails } from '../../lib/api/client';
import { formatDate, formatMoney, gameLabel, initials } from '../../lib/format';

function CareerCard({ career }: { career: CareerDetails }) {
  return (
    <Link
      to="/careers/$careerId/squad"
      params={{ careerId: String(career.id) }}
      className="group relative flex h-[420px] flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low p-8 transition-all duration-300 hover:-translate-y-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(175,141,254,0.16),transparent_50%),linear-gradient(to_top,rgba(0,0,0,0.8),transparent_60%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-surface-container-highest">
          {career.teamLogo ? (
            <img src={career.teamLogo} alt="" className="h-full w-full object-contain p-2" />
          ) : (
            <span className="font-headline text-xl font-black text-primary">
              {initials(career.teamName) || 'FC'}
            </span>
          )}
        </div>
        <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-on-primary">
          {gameLabel(career.game)}
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-headline text-3xl font-black uppercase italic tracking-tighter">
          {career.teamName}
        </h2>
        <p className="mt-1 text-sm font-bold uppercase tracking-widest text-primary">
          {career.manager}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-xs">
          <div>
            <dt className="font-bold uppercase tracking-widest text-on-surface-variant">
              {messages.dashboard.startDate}
            </dt>
            <dd className="mt-1 font-semibold text-on-surface">{formatDate(career.startDate)}</dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-widest text-on-surface-variant">
              {messages.dashboard.budget}
            </dt>
            <dd className="mt-1 font-semibold text-on-surface">{formatMoney(career.budget)}</dd>
          </div>
        </dl>

        <span className="mt-6 flex w-full items-center justify-center rounded-lg bg-white/10 py-3 text-xs font-bold uppercase tracking-widest text-on-surface backdrop-blur-md transition-colors group-hover:bg-primary group-hover:text-on-primary">
          {messages.dashboard.continue}
        </span>
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[420px] animate-pulse rounded-xl bg-surface-container-low p-8"
        >
          <div className="h-16 w-16 rounded-xl bg-surface-container-highest" />
          <div className="mt-32 h-8 w-3/4 rounded bg-surface-container-highest" />
          <div className="mt-3 h-4 w-1/2 rounded bg-surface-container-high" />
          <div className="mt-8 h-12 w-full rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

function DashboardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low px-8 py-20 text-center">
      <span className="material-symbols-outlined text-6xl text-primary" aria-hidden="true">
        stadium
      </span>
      <h2 className="mt-6 font-headline text-2xl font-black uppercase tracking-tight">
        {messages.dashboard.emptyTitle}
      </h2>
      <p className="mt-2 text-sm font-medium text-on-surface-variant">
        {messages.dashboard.emptyBody}
      </p>
      <Link
        to="/careers/new"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-on-primary transition-all hover:shadow-[0_0_20px_rgba(188,255,95,0.3)]"
      >
        {messages.dashboard.emptyCta}
      </Link>
    </div>
  );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-xl bg-error/10 px-8 py-16 text-center">
      <span className="material-symbols-outlined text-5xl text-error" aria-hidden="true">
        cloud_off
      </span>
      <h2 className="mt-4 font-headline text-xl font-bold">{messages.dashboard.error}</h2>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-lg bg-error/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-error transition-colors hover:bg-error hover:text-on-error"
      >
        {messages.dashboard.retry}
      </button>
    </div>
  );
}

export function DashboardPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['careers'],
    queryFn: getCareers,
  });

  return (
    <section className="px-6 py-10 lg:px-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {messages.dashboard.eyebrow}
          </span>
          <h1 className="mt-2 font-headline text-5xl font-black uppercase italic tracking-tighter">
            {messages.dashboard.title}
          </h1>
          <p className="mt-2 font-medium text-on-surface-variant">{messages.dashboard.subtitle}</p>
        </div>

        <Link
          to="/careers/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:shadow-[0_0_20px_rgba(188,255,95,0.3)]"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">
            add
          </span>
          {messages.dashboard.create}
        </Link>
      </header>

      {isPending ? <DashboardSkeleton /> : null}
      {isError ? <DashboardError onRetry={() => void refetch()} /> : null}
      {data && data.length === 0 ? <DashboardEmpty /> : null}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {data.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
