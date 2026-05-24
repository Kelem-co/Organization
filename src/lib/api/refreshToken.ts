import { tokenManager } from './tokenManager';
import { appConfig } from './config';

let refreshRequest: Promise<string | null> | null = null;

function buildRefreshUrl(): string {
  const base = appConfig.apiBaseUrl.replace(/\/$/, '');
  return `${base}/auth/jwt/refresh/`;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    tokenManager.clearTokens();
    return null;
  }

  if (refreshRequest) {
    return refreshRequest;
  }

  refreshRequest = (async () => {
    try {
      const response = await fetch(buildRefreshUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        tokenManager.clearTokens();
        return null;
      }

      const data = await response.json() as { access?: string };
      if (!data.access) {
        tokenManager.clearTokens();
        return null;
      }

      tokenManager.setAccessToken(data.access);
      return data.access;
    } catch {
      tokenManager.clearTokens();
      return null;
    } finally {
      refreshRequest = null;
    }
  })();

  return refreshRequest;
}
