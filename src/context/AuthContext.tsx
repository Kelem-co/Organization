'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { featureFlags } from '@/config/featureFlags';
import { authApi } from '@/lib/services/authApi';
import { tokenManager } from '@/lib/api/tokenManager';
import { cacheManager } from '@/lib/api/cache';

const STORAGE_KEY = 'organization-portal-auth';

export type AuthUser = { email: string; id?: string; name?: string } | null;

export type AuthState = {
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  user: AuthUser;
};

const defaultAuth: AuthState = {
  isAuthenticated: false,
  onboardingComplete: false,
  user: null,
};

// ─── localStorage helpers (kept for mock fallback) ───────────────────────────

function readStoredAuth(): AuthState {
  if (typeof window === 'undefined') return defaultAuth;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAuth;
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      isAuthenticated: Boolean(parsed.isAuthenticated),
      onboardingComplete: Boolean(parsed.onboardingComplete),
      user: parsed.user ?? null,
    };
  } catch {
    return defaultAuth;
  }
}

function writeStoredAuth(state: AuthState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getInitialAuthState(): AuthState {
  if (typeof window === 'undefined') return defaultAuth;

  if (featureFlags.useRealAuth) {
    const session = tokenManager.getSession();
    if (session && !tokenManager.isTokenExpired()) {
      return {
        isAuthenticated: true,
        onboardingComplete: session.onboardingComplete,
        user: { email: session.email, id: session.userId },
      };
    }

    return defaultAuth;
  }

  return readStoredAuth();
}

// ─── Context types ────────────────────────────────────────────────────────────

type AuthContextValue = AuthState & {
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  directLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(getInitialAuthState);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const persist = useCallback((next: AuthState) => {
    setAuth(next);
    if (!featureFlags.useRealAuth) {
      writeStoredAuth(next);
    }
  }, []);

  // ── login (used by onboarding AuthScreen — sets onboardingComplete: false) ──
  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) throw new Error('Email and password are required');

      if (featureFlags.useRealAuth) {
        // Call JWT create endpoint
        const jwtResponse = await authApi.login({ email, password });
        
        // Store tokens
        tokenManager.setAccessToken(jwtResponse.access);
        tokenManager.setRefreshToken(jwtResponse.refresh);
        
        // JWT tokens typically expire in 5 minutes
        const expiresAt = Date.now() + 4 * 60 * 1000;
        
        // Store session
        tokenManager.setSession({
          userId: '',
          email: email,
          name: '',
          expiresAt,
          onboardingComplete: false, // Onboarding flow starts after login
        });
        
        setAuth({
          isAuthenticated: true,
          onboardingComplete: false,
          user: { email, id: '', name: '' },
        });
      } else {
        // Mock: simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        persist({
          isAuthenticated: true,
          onboardingComplete: false,
          user: { email },
        });
      }
    },
    [persist],
  );

  // ── directLogin (used by /login page — sets onboardingComplete: true) ────────
  const directLogin = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) throw new Error('Email and password are required');

      if (featureFlags.useRealAuth) {
        // Call JWT create endpoint
        const jwtResponse = await authApi.login({ email, password });
        
        // Store tokens
        tokenManager.setAccessToken(jwtResponse.access);
        tokenManager.setRefreshToken(jwtResponse.refresh);
        
        // JWT tokens typically expire in 5 minutes, set expiration to 4 min for safety
        const expiresAt = Date.now() + 4 * 60 * 1000;
        
        // Store session - DON'T set onboardingComplete yet, let the login page decide
        tokenManager.setSession({
          userId: '', // We'll get this later if needed
          email: email,
          name: '',
          expiresAt,
          onboardingComplete: false, // Will be set to true after org check
        });
        
        // Update auth state - onboardingComplete is false initially
        setAuth({
          isAuthenticated: true,
          onboardingComplete: false,
          user: { email, id: '', name: '' },
        });
      } else {
        // Mock: simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        persist({
          isAuthenticated: true,
          onboardingComplete: true,
          user: { email },
        });
      }
    },
    [persist],
  );

  const completeOnboarding = useCallback(() => {
    setAuth((prev) => {
      const next: AuthState = {
        ...prev,
        isAuthenticated: true,
        onboardingComplete: true,
      };
      if (!featureFlags.useRealAuth) {
        writeStoredAuth(next);
      } else {
        // Update session metadata
        const session = tokenManager.getSession();
        if (session) {
          tokenManager.setSession({ ...session, onboardingComplete: true });
        }
      }
      return next;
    });
  }, []);

  const logout = useCallback(async () => {
    if (featureFlags.useRealAuth) {
      // JWT logout is client-side only (no backend endpoint needed)
      tokenManager.clearTokens();
      cacheManager.clear();
    } else {
      writeStoredAuth({ ...defaultAuth });
    }
    setAuth({ ...defaultAuth });
  }, []);

  const value = useMemo(
    (): AuthContextValue => ({
      ...auth,
      hydrated,
      login,
      directLogin,
      logout,
      completeOnboarding,
    }),
    [auth, hydrated, login, directLogin, logout, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
