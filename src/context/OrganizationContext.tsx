'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import { organizationsApi } from '@/lib/services/organizationsApi';
import type { Organization } from '@/lib/types/organizations';
import { useAuth } from '@/context/AuthContext';

type OrganizationContextValue = {
  organizations: Organization[];
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  setOrganization: (organization: Organization | null) => void;
  refetch: () => Promise<void>;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { hydrated, isAuthenticated, onboardingComplete } = useAuth();
  const canReadOrganizations = hydrated && isAuthenticated && onboardingComplete;
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationsApi.list({ skipCache: true });
      setOrganizations(response.results);
      setOrganization((currentOrganization) => {
        if (response.results.length === 0) {
          return null;
        }

        const matchedOrganization = currentOrganization
          ? response.results.find(({ id }) => id === currentOrganization.id)
          : null;

        return matchedOrganization ?? response.results[0];
      });
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organization');
      setOrganizations([]);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!canReadOrganizations) {
      return;
    }

    queueMicrotask(() => {
      void fetchOrganization();
    });
  }, [canReadOrganizations, fetchOrganization]);

  const value = useMemo(
    (): OrganizationContextValue => ({
      organizations: canReadOrganizations ? organizations : [],
      organization: canReadOrganizations ? organization : null,
      loading: hydrated ? (canReadOrganizations ? loading : false) : true,
      error: canReadOrganizations ? error : null,
      setOrganization,
      refetch: fetchOrganization,
    }),
    [canReadOrganizations, organizations, organization, loading, error, hydrated, fetchOrganization]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganizationContext must be used within OrganizationProvider');
  }
  return context;
}
