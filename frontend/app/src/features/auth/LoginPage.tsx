import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { messages } from '../../i18n/pt-BR';
import { ApiError } from '../../lib/api/client';
import { useAuth } from './authContext';
import { AuthLayout } from './AuthLayout';
import { authIconClass, authInputClass, authLabelClass, authSubmitClass } from './formStyles';

const loginSchema = z.object({
  login: z.string().trim().min(1, { message: messages.auth.loginRequired }),
  password: z.string().min(1, { message: messages.auth.passwordRequired }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { session, expired, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setRetryable(false);

    try {
      await login(values);
      void navigate({ to: '/' });
    } catch (cause) {
      if (cause instanceof ApiError && [400, 401, 403].includes(cause.status)) {
        setError(messages.auth.invalidCredentials);
        return;
      }

      setError(messages.auth.unavailable);
      setRetryable(true);
    }
  });

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout title={messages.auth.title} subtitle={messages.auth.subtitle}>
      {expired ? (
        <div
          role="status"
          className="mt-6 rounded-lg bg-secondary/10 px-4 py-3 text-sm text-secondary"
        >
          {messages.auth.expired}
        </div>
      ) : null}

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <label className={authLabelClass} htmlFor="login">
            {messages.auth.loginLabel}
          </label>
          <div className="group relative">
            <span className={authIconClass} aria-hidden="true">
              alternate_email
            </span>
            <input
              id="login"
              type="text"
              autoComplete="username"
              aria-invalid={Boolean(errors.login)}
              className={authInputClass}
              placeholder={messages.auth.loginPlaceholder}
              {...register('login')}
            />
          </div>
          {errors.login ? <p className="ml-1 text-xs text-error">{errors.login.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className={authLabelClass} htmlFor="password">
            {messages.auth.passwordLabel}
          </label>
          <div className="group relative">
            <span className={authIconClass} aria-hidden="true">
              lock
            </span>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className={authInputClass}
              placeholder={messages.auth.passwordPlaceholder}
              {...register('password')}
            />
          </div>
          {errors.password ? (
            <p className="ml-1 text-xs text-error">{errors.password.message}</p>
          ) : null}
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
                {messages.auth.retry}
              </button>
            ) : null}
          </div>
        ) : null}

        <button type="submit" disabled={isSubmitting} className={authSubmitClass}>
          {isSubmitting ? messages.auth.submitting : messages.auth.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        {messages.auth.createAccountPrompt}{' '}
        <Link
          to="/register"
          className="font-bold text-primary transition-colors hover:text-primary-dim"
        >
          {messages.auth.createAccountLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
