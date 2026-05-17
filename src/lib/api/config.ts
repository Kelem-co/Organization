/**
 * Environment configuration validation.
 * Reads from environment variables with fallback defaults for development.
 * 
 * IMPORTANT: In Next.js, NEXT_PUBLIC_* variables are embedded at BUILD TIME.
 * They are replaced inline by Next.js during the build process.
 */

export interface AppConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  googleMapsKey: string;
}

// Next.js replaces process.env.NEXT_PUBLIC_* at build time
// These are NOT runtime values - they're compile-time constants
export const appConfig: AppConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_KEY || '',
};

// Validate required config
if (!appConfig.apiBaseUrl || appConfig.apiBaseUrl === 'http://localhost:8000') {
  console.warn('⚠️  NEXT_PUBLIC_API_BASE_URL is not set or using default. Check your .env.local file.');
}

// Log config in development (but hide sensitive data)
if (process.env.NODE_ENV === 'development') {
  console.log('📋 App Configuration:', {
    apiBaseUrl: appConfig.apiBaseUrl,
    apiTimeout: appConfig.apiTimeout,
    googleMapsKey: appConfig.googleMapsKey ? '***configured***' : 'not set',
    nodeEnv: process.env.NODE_ENV,
  });
}
