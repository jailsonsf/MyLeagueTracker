import type { ReactNode } from 'react';

import { messages } from '../../i18n/pt-BR';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-surface-dim">
      <section className="relative hidden w-3/5 items-end overflow-hidden bg-surface-container-low p-12 lg:flex xl:w-2/3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(175,141,254,0.18),transparent_45%),radial-gradient(circle_at_75%_80%,rgba(188,255,95,0.12),transparent_40%)]" />
        <span
          className="material-symbols-outlined absolute left-12 top-12 text-[200px] text-on-surface/5"
          aria-hidden="true"
        >
          strategy
        </span>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-primary" aria-hidden="true">
              sports_soccer
            </span>
            <h1 className="font-headline text-5xl font-black uppercase italic tracking-tighter">
              {messages.appName}
            </h1>
          </div>

          <p className="mt-8 font-headline text-2xl font-bold leading-tight text-on-surface-variant">
            Domine a beira do campo.
            <br />
            <span className="text-on-surface">Construa seu legado.</span>
          </p>

          <div className="mt-8 flex gap-4">
            <div className="h-1 w-12 bg-primary" />
            <div className="h-1 w-12 bg-surface-container-highest" />
            <div className="h-1 w-12 bg-surface-container-highest" />
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col justify-center bg-surface-dim px-6 py-12 sm:px-12 lg:w-2/5 lg:px-16 xl:w-1/3">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="material-symbols-outlined text-4xl text-primary" aria-hidden="true">
              sports_soccer
            </span>
            <span className="font-headline text-2xl font-black uppercase italic tracking-tighter">
              {messages.appName}
            </span>
          </div>

          <h2 className="font-headline text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm font-medium text-on-surface-variant">{subtitle}</p>

          {children}
        </div>
      </section>
    </main>
  );
}
