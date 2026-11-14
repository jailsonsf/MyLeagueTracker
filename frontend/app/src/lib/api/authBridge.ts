let token: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(next: string | null): void {
  token = next;
}

export function getAuthToken(): string | null {
  return token;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
