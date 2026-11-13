import { useQuery } from '@tanstack/react-query';

import { getCareerDashboard } from '../../lib/api/client';

export function useCareerDashboard(careerId: string) {
  return useQuery({
    queryKey: ['career', careerId],
    queryFn: () => getCareerDashboard(careerId),
  });
}
