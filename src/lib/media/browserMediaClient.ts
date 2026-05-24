import { appConfig } from '@/lib/api/config';
import { tokenManager } from '@/lib/api/tokenManager';
import { createMediaClient } from '@/lib/media/mediaClient';

export function createBrowserMediaClient() {
  return createMediaClient({
    baseUrl: appConfig.apiBaseUrl,
    getAuthHeaders: () => {
      const token = tokenManager.getAccessToken();
      return token ? { Authorization: `Bearer ${token}` } : ({} as HeadersInit);
    },
  });
}
