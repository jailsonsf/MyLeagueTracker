import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { ToastContext } from './toastContext';

interface Toast {
  id: number;
  message: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  const showToast = useCallback((message: string) => {
    const id = nextId.current + 1;
    nextId.current = id;

    setToasts((current) => [...current, { id, message }]);

    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);

    timers.current.push(timer);
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-[100] flex flex-col gap-2 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center gap-3 rounded-xl bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface shadow-2xl"
          >
            <span className="material-symbols-outlined text-primary" aria-hidden="true">
              check_circle
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
