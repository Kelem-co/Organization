'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { organizationsApi } from '@/lib/services/organizationsApi';
import type { Organization } from '@/lib/types/organizations';

type OrganizationContextValue = {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false); // Prevent double-fetch in React Strict Mode

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationsApi.list();
      if (response.results.length > 0) {
        setOrganization(response.results[0]);
      } else {
        setOrganization(null);
      }
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organization');
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent double-fetch in React Strict Mode (development)
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    fetchOrganization();
  }, []); // Only run once on mount

  const value = useMemo(
    (): OrganizationContextValue => ({
      organization,
      loading,
      error,
      refetch: fetchOrganization,
    }),
    [organization, loading, error]
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
