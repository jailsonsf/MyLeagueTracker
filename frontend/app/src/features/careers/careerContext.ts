import { createContext, useContext } from 'react';

import type { CareerDashboard } from '../../lib/api/client';

export const CareerContext = createContext<CareerDashboard | null>(null);

export function useCareer(): CareerDashboard {
  const value = useContext(CareerContext);

  if (!value) {
    throw new Error('useCareer precisa estar dentro de CareerLayout');
  }

  return value;
}
