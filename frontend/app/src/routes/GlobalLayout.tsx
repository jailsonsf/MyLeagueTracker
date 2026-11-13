import { Outlet } from '@tanstack/react-router';

import { AppShell } from '../components/layout/AppShell';

export function GlobalLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
