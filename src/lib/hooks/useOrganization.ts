import { useState, useEffect } from 'react';
import { organizationsApi } from '@/lib/services/organizationsApi';
import { featureFlags } from '@/config/featureFlags';
import type { Organization, UpdateOrganizationRequest } from '@/lib/types/organizations';

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    if (!featureFlags.useRealOnboarding) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await organizationsApi.list();
      if (response.results.length > 0) {
        setOrganization(response.results[0]);
        setError(null);
      } else {
        setOrganization(null);
        setError('No organization found. Please complete onboarding first.');
      }
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      setError('Failed to load organization details');
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  const updateOrganization = async (data: UpdateOrganizationRequest): Promise<Organization> => {
    if (!organization) {
      throw new Error('No organization found');
    }

    const updated = await organizationsApi.update(organization.id, data);
    setOrganization(updated);
    return updated;
  };

  const refreshOrganization = () => {
    fetchOrganization();
  };

  return {
    organization,
    loading,
    error,
    updateOrganization,
    refreshOrganization,
  };
}
