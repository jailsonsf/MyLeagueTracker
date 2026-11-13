import { Link } from '@tanstack/react-router';

import { messages } from '../i18n/pt-BR';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <span className="material-symbols-outlined text-6xl text-primary" aria-hidden="true">
        sports_soccer
      </span>
      <h1 className="mt-6 font-headline text-4xl font-black uppercase italic tracking-tighter">
        404
      </h1>
      <p className="mt-2 text-on-surface-variant">{messages.notFound.title}</p>
      <Link
        to="/"
        className="mt-6 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-dim"
      >
        {messages.notFound.back}
      </Link>
    </main>
  );
}
