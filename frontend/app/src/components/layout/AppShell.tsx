import { Link, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { useAuth } from '../../features/auth/authContext';
import { messages } from '../../i18n/pt-BR';
import type { CareerDetails } from '../../lib/api/client';
import { AccountMenu } from './AccountMenu';

const disabledItems = [
  { label: messages.nav.transfers, icon: 'swap_horiz' },
  { label: messages.nav.stats, icon: 'leaderboard' },
  { label: messages.nav.settings, icon: 'settings' },
];

function navLinkClass(active: boolean): string {
  return active
    ? 'flex items-center gap-4 border-l-4 border-primary bg-surface-container px-6 py-4 text-primary'
    : 'flex items-center gap-4 border-l-4 border-transparent px-6 py-4 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface';
}

function bottomLinkClass(active: boolean): string {
  return `flex flex-col items-center gap-1 rounded-xl py-2 ${
    active ? 'text-primary' : 'text-on-surface-variant'
  }`;
}

export function AppShell({
  children,
  career,
}: {
  children: ReactNode;
  career?: CareerDetails;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { username } = useAuth();
  const isDashboard = pathname === '/';
  const isSquad = Boolean(career) && pathname.endsWith('/squad');
  const isAcademy = Boolean(career) && pathname.endsWith('/youth');
  const title = career?.teamName ?? (isDashboard ? messages.nav.dashboard : messages.appName);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="fixed inset-x-0 top-0 z-40 h-16 bg-surface lg:pl-64">
        <div className="flex h-full items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary lg:hidden" aria-hidden="true">
              sports_soccer
            </span>
            <span className="font-headline text-lg font-black uppercase italic tracking-tighter lg:hidden">
              {messages.appName}
            </span>
            <span className="hidden text-xs font-bold uppercase tracking-widest text-on-surface-variant lg:block">
              {title}
            </span>
          </div>

          <AccountMenu />
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col bg-surface-container-lowest pb-8 pt-8 lg:flex">
        <div className="px-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-primary" aria-hidden="true">
              sports_soccer
            </span>
            <span className="font-headline text-xl font-black uppercase italic tracking-tighter">
              {messages.appName}
            </span>
          </div>
          <p className="mt-4 truncate text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {messages.account.label}: {username}
          </p>
        </div>

        <nav aria-label={messages.nav.mainNavigation} className="mt-10 flex-1">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                aria-current={isDashboard ? 'page' : undefined}
                className={navLinkClass(isDashboard)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  dashboard
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  {messages.nav.dashboard}
                </span>
              </Link>
            </li>

            {career ? (
              <>
                <li>
                  <Link
                    to="/careers/$careerId/squad"
                    params={{ careerId: String(career.id) }}
                    aria-current={isSquad ? 'page' : undefined}
                    className={navLinkClass(isSquad)}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      groups
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {messages.nav.squad}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers/$careerId/youth"
                    params={{ careerId: String(career.id) }}
                    aria-current={isAcademy ? 'page' : undefined}
                    className={navLinkClass(isAcademy)}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      school
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {messages.nav.academy}
                    </span>
                  </Link>
                </li>
              </>
            ) : null}

            {disabledItems.map((item) => (
              <li key={item.label}>
                <span
                  aria-disabled="true"
                  className="flex items-center gap-4 px-6 py-4 text-on-surface-variant/40"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  <span className="ml-auto rounded-full bg-surface-container-high px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {messages.nav.comingSoon}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-6">
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50"
          >
            {messages.nav.advanceCalendar}
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-[9px]">
              {messages.nav.comingSoon}
            </span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen pb-24 pt-16 lg:pb-0 lg:pl-64">{children}</main>

      <nav
        aria-label={messages.nav.bottomNavigation}
        className="fixed inset-x-0 bottom-0 z-40 bg-surface-container-lowest pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="flex items-center px-2 py-2">
          <li className="flex-1">
            <Link
              to="/"
              aria-current={isDashboard ? 'page' : undefined}
              className={bottomLinkClass(isDashboard)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                dashboard
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {messages.nav.dashboard}
              </span>
            </Link>
          </li>

          {career ? (
            <>
              <li className="flex-1">
                <Link
                  to="/careers/$careerId/squad"
                  params={{ careerId: String(career.id) }}
                  aria-current={isSquad ? 'page' : undefined}
                  className={bottomLinkClass(isSquad)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    groups
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {messages.nav.squad}
                  </span>
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  to="/careers/$careerId/youth"
                  params={{ careerId: String(career.id) }}
                  aria-current={isAcademy ? 'page' : undefined}
                  className={bottomLinkClass(isAcademy)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    school
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {messages.nav.academy}
                  </span>
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
