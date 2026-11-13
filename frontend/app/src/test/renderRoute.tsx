import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { render } from '@testing-library/react';

import { ToastProvider } from '../components/ui/ToastProvider';
import { AuthProvider } from '../features/auth/AuthProvider';
import { TOKEN_STORAGE_KEY } from '../features/auth/session';
import { createAppRouter } from '../router';

interface RenderRouteOptions {
  token?: string;
}

export function renderRoute(path = '/', options: RenderRouteOptions = {}) {
  if (options.token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, options.token);
  }

  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }));
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  );
}
