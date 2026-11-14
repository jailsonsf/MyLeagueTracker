import { Link, Outlet, useParams } from '@tanstack/react-router';

import { AppShell } from '../components/layout/AppShell';
import { CareerContext } from '../features/careers/careerContext';
import { useCareerDashboard } from '../features/careers/useCareerDashboard';
import { messages } from '../i18n/pt-BR';
import type { CareerDetails } from '../lib/api/client';
import { formatMoney, initials } from '../lib/format';

function CareerHeader({ career }: { career: CareerDetails }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-surface-container-low p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-surface-container-highest">
          {career.teamLogo ? (
            <img src={career.teamLogo} alt="" className="h-full w-full object-contain p-2" />
          ) : (
            <span className="font-headline text-lg font-black text-primary">
              {initials(career.teamName) || 'FC'}
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {messages.career.label}
          </p>
          <h2 className="font-headline text-2xl font-black uppercase italic tracking-tight">
            {career.teamName}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {messages.career.manager}: {career.manager}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {messages.career.budget}
          </p>
          <p className="font-headline text-lg font-bold">{formatMoney(career.budget)}</p>
        </div>
        <Link
          to="/"
          className="rounded-lg bg-surface-container-high px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-surface-bright"
        >
          {messages.career.switchCareer}
        </Link>
      </div>
    </div>
  );
}

export function CareerLayout() {
  const { careerId } = useParams({ from: '/_authenticated/careers/$careerId' });
  const { data, isPending, isError, refetch } = useCareerDashboard(careerId);

  if (isPending) {
    return (
      <AppShell>
        <div className="px-6 py-8 lg:px-12">
          <div className="h-28 animate-pulse rounded-2xl bg-surface-container-low" />
        </div>
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <div role="alert" className="px-6 py-16 text-center lg:px-12">
          <span className="material-symbols-outlined text-5xl text-error" aria-hidden="true">
            cloud_off
          </span>
          <p className="mt-4 font-bold">{messages.career.error}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-lg bg-error/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-error transition-colors hover:bg-error hover:text-on-error"
          >
            {messages.career.retry}
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <CareerContext.Provider value={data}>
      <AppShell career={data.careerInfo}>
        <div className="px-6 pt-8 lg:px-12">
          <CareerHeader career={data.careerInfo} />
        </div>
        <Outlet />
      </AppShell>
    </CareerContext.Provider>
  );
}
