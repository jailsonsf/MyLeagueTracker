import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCountries, type Country } from '../../lib/api/client';

export function useCountries(): Map<number, Country> {
  const { data } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: 60 * 60_000,
  });

  return useMemo(() => new Map((data ?? []).map((country) => [country.id, country])), [data]);
}

export function useCountryList(): Country[] {
  const { data } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: 60 * 60_000,
  });

  return data ?? [];
}
