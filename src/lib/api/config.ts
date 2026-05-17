/**
 * Environment configuration validation.
 * 
 * HARDCODED FOR TESTING - env variables not loading properly
 */

export interface AppConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  googleMapsKey: string;
}

export const appConfig: AppConfig = {
  apiBaseUrl: 'https://customers-bye-bunch-stationery.trycloudflare.com',
  apiTimeout: 30000,
  googleMapsKey: '',
};
