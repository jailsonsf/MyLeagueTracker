import { useEffect, type ReactNode } from 'react';

import { messages } from '../../i18n/pt-BR';

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 lg:items-center lg:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-surface-container-low p-6 lg:w-[640px] lg:rounded-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-headline text-2xl font-black uppercase italic tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={messages.squad.close}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
