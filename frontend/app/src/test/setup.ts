import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { setAuthToken, setUnauthorizedHandler } from '../lib/api/authBridge';
import { server } from './msw/server';

beforeAll(() => {
  window.scrollTo = () => {};
  window.HTMLElement.prototype.hasPointerCapture = () => false;
  window.HTMLElement.prototype.releasePointerCapture = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  setAuthToken(null);
  setUnauthorizedHandler(null);
  server.resetHandlers();
});

afterAll(() => server.close());
