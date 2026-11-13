import {
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import type { RouterHistory } from '@tanstack/react-router';

import { CentralSquadPage } from './features/careers/CentralSquadPage';
import { DashboardPage } from './features/careers/DashboardPage';
import { NewCareerPage } from './features/careers/NewCareerPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { AuthenticatedLayout } from './routes/AuthenticatedLayout';
import { CareerLayout } from './routes/CareerLayout';
import { GlobalLayout } from './routes/GlobalLayout';

import { NotFoundPage } from './routes/NotFoundPage';
import { YouthPlaceholderPage } from './routes/YouthPlaceholderPage';

const rootRoute = createRootRoute({ notFoundComponent: NotFoundPage });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  component: AuthenticatedLayout,
});

const globalRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  id: '_global',
  component: GlobalLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => globalRoute,
  path: '/',
  component: DashboardPage,
});

const newCareerRoute = createRoute({
  getParentRoute: () => globalRoute,
  path: '/careers/new',
  component: NewCareerPage,
});

const careerRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/careers/$careerId',
  component: CareerLayout,
});

const squadRoute = createRoute({
  getParentRoute: () => careerRoute,
  path: '/squad',
  component: CentralSquadPage,
});

const youthRoute = createRoute({
  getParentRoute: () => careerRoute,
  path: '/youth',
  component: YouthPlaceholderPage,
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  authenticatedRoute.addChildren([
    globalRoute.addChildren([dashboardRoute, newCareerRoute]),
    careerRoute.addChildren([squadRoute, youthRoute]),
  ]),
]);

export function createAppRouter(history: RouterHistory = createBrowserHistory()) {
  return createRouter({ routeTree, history });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
