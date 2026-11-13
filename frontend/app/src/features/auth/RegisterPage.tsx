import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { messages } from '../../i18n/pt-BR';
import { ApiError, registerAccount } from '../../lib/api/client';
import { useAuth } from './authContext';
import { AuthLayout } from './AuthLayout';
import { authIconClass, authInputClass, authLabelClass, authSubmitClass } from './formStyles';

const registerSchema = z.object({
  username: z.string().trim().min(3, { message: messages.auth.register.usernameMin }),
  email: z.string().trim().email({ message: messages.auth.register.emailInvalid }),
  password: z.string().min(6, { message: messages.auth.register.passwordMin }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setRetryable(false);

    try {
      await registerAccount(values);
      await login({ login: values.username, password: values.password });
      void navigate({ to: '/' });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 400) {
        setError(messages.auth.register.duplicate);
        return;
      }

      setError(messages.auth.register.unavailable);
      setRetryable(true);
    }
  });

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title={messages.auth.register.title}
      subtitle={messages.auth.register.subtitle}
    >
      <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <label className={authLabelClass} htmlFor="username">
            {messages.auth.register.usernameLabel}
          </label>
          <div className="group relative">
            <span className={authIconClass} aria-hidden="true">
              person
            </span>
            <input
              id="username"
              type="text"
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              className={authInputClass}
              placeholder={messages.auth.register.usernamePlaceholder}
              {...register('username')}
            />
          </div>
          {errors.username ? (
            <p className="ml-1 text-xs text-error">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className={authLabelClass} htmlFor="email">
            {messages.auth.register.emailLabel}
          </label>
          <div className="group relative">
            <span className={authIconClass} aria-hidden="true">
              alternate_email
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={authInputClass}
              placeholder={messages.auth.register.emailPlaceholder}
              {...register('email')}
            />
          </div>
          {errors.email ? <p className="ml-1 text-xs text-error">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className={authLabelClass} htmlFor="password">
            {messages.auth.register.passwordLabel}
          </label>
          <div className="group relative">
            <span className={authIconClass} aria-hidden="true">
              lock
            </span>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              className={authInputClass}
              placeholder={messages.auth.register.passwordPlaceholder}
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
          {isSubmitting ? messages.auth.register.submitting : messages.auth.register.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        {messages.auth.register.haveAccount}{' '}
        <Link to="/login" className="font-bold text-primary transition-colors hover:text-primary-dim">
          {messages.auth.register.signInLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
