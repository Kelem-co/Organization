'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'organization-portal-auth';

export type AuthUser = { email: string } | null;

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

type AuthContextValue = AuthState & {
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  directLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAuth(readStoredAuth());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AuthState) => {
    setAuth(next);
    writeStoredAuth(next);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      persist({
        isAuthenticated: true,
        onboardingComplete: false,
        user: { email },
      });
    },
    [persist],
  );

  const directLogin = useCallback(
    async (email: string, password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      persist({
        isAuthenticated: true,
        onboardingComplete: true,
        user: { email },
      });
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
      writeStoredAuth(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    persist({ ...defaultAuth });
  }, [persist]);

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
