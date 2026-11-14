import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { messages } from '../../i18n/pt-BR';
import { footLabels, roleLabels } from './labels';
import { useCountryList } from './useCountries';

const currentYear = new Date().getFullYear();

const playerSchema = z
  .object({
    fullName: z.string().trim().min(1, { message: messages.squad.fullNameRequired }),
    age: z
      .number({ message: messages.squad.ageInvalid })
      .int({ message: messages.squad.ageInvalid })
      .min(14, { message: messages.squad.ageInvalid })
      .max(60, { message: messages.squad.ageInvalid }),
    yearJoinedClub: z
      .number({ message: messages.squad.yearInvalid })
      .int({ message: messages.squad.yearInvalid })
      .min(1900, { message: messages.squad.yearInvalid })
      .max(currentYear + 1, { message: messages.squad.yearInvalid }),
    currentOverall: z
      .number({ message: messages.squad.overallInvalid })
      .int({ message: messages.squad.overallInvalid })
      .min(0, { message: messages.squad.overallInvalid })
      .max(99, { message: messages.squad.overallInvalid }),
    potentialOverall: z
      .number({ message: messages.squad.potentialInvalid })
      .int({ message: messages.squad.potentialInvalid })
      .min(0, { message: messages.squad.potentialInvalid })
      .max(99, { message: messages.squad.potentialInvalid }),
    currentMarketValue: z
      .number({ message: messages.squad.marketValueInvalid })
      .min(0, { message: messages.squad.marketValueInvalid }),
    preferredFoot: z.enum(['LEFT', 'RIGHT']),
    role: z.enum(['CRUCIAL', 'IMPORTANT', 'SPORADIC', 'ROTATION', 'PROSPECT']),
    countryId: z.string(),
  })
  .refine((values) => values.potentialOverall >= values.currentOverall, {
    message: messages.squad.potentialBelowOverall,
    path: ['potentialOverall'],
  });

export type PlayerFormValues = z.infer<typeof playerSchema>;

const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant';
const fieldClass =
  'w-full rounded-lg border-0 bg-surface-container-lowest px-4 py-3 text-on-surface transition-all placeholder:text-outline/50 focus:ring-2 focus:ring-primary';

export function PlayerForm({
  submitLabel,
  submittingLabel,
  errorMessage,
  onSave,
}: {
  submitLabel: string;
  submittingLabel: string;
  errorMessage: string;
  onSave: (values: PlayerFormValues) => Promise<void>;
}) {
  const countries = useCountryList();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      fullName: '',
      age: undefined,
      yearJoinedClub: currentYear,
      currentOverall: undefined,
      potentialOverall: undefined,
      currentMarketValue: 0,
      preferredFoot: 'RIGHT',
      role: 'IMPORTANT',
      countryId: '',
    },
  });

  const submit = handleSubmit(async (values) => {
    setError(null);

    try {
      await onSave(values);
    } catch {
      setError(errorMessage);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="playerName" className={labelClass}>
          {messages.squad.fullName}
        </label>
        <input
          id="playerName"
          type="text"
          aria-invalid={Boolean(errors.fullName)}
          className={fieldClass}
          {...register('fullName')}
        />
        {errors.fullName ? (
          <p className="text-xs text-error">{errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="playerAge" className={labelClass}>
            {messages.squad.age}
          </label>
          <input
            id="playerAge"
            type="number"
            min={14}
            max={60}
            aria-invalid={Boolean(errors.age)}
            className={fieldClass}
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age ? <p className="text-xs text-error">{errors.age.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="playerYear" className={labelClass}>
            {messages.squad.yearJoined}
          </label>
          <input
            id="playerYear"
            type="number"
            min={1900}
            max={currentYear + 1}
            aria-invalid={Boolean(errors.yearJoinedClub)}
            className={fieldClass}
            {...register('yearJoinedClub', { valueAsNumber: true })}
          />
          {errors.yearJoinedClub ? (
            <p className="text-xs text-error">{errors.yearJoinedClub.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="playerOverall" className={labelClass}>
            {messages.squad.overall}
          </label>
          <input
            id="playerOverall"
            type="number"
            min={0}
            max={99}
            aria-invalid={Boolean(errors.currentOverall)}
            className={fieldClass}
            {...register('currentOverall', { valueAsNumber: true })}
          />
          {errors.currentOverall ? (
            <p className="text-xs text-error">{errors.currentOverall.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="playerPotential" className={labelClass}>
            {messages.squad.potential}
          </label>
          <input
            id="playerPotential"
            type="number"
            min={0}
            max={99}
            aria-invalid={Boolean(errors.potentialOverall)}
            className={fieldClass}
            {...register('potentialOverall', { valueAsNumber: true })}
          />
          {errors.potentialOverall ? (
            <p className="text-xs text-error">{errors.potentialOverall.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="playerValue" className={labelClass}>
            {messages.squad.marketValue}
          </label>
          <input
            id="playerValue"
            type="number"
            min={0}
            aria-invalid={Boolean(errors.currentMarketValue)}
            className={fieldClass}
            {...register('currentMarketValue', { valueAsNumber: true })}
          />
          {errors.currentMarketValue ? (
            <p className="text-xs text-error">{errors.currentMarketValue.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="playerFoot" className={labelClass}>
            {messages.squad.foot}
          </label>
          <select id="playerFoot" className={fieldClass} {...register('preferredFoot')}>
            {Object.entries(footLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="playerRole" className={labelClass}>
            {messages.squad.roleField}
          </label>
          <select id="playerRole" className={fieldClass} {...register('role')}>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="playerCountry" className={labelClass}>
            {messages.squad.country}
          </label>
          <select id="playerCountry" className={fieldClass} {...register('countryId')}>
            <option value="">{messages.squad.noCountry}</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-4 font-headline text-sm font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:shadow-[0_0_20px_rgba(188,255,95,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
