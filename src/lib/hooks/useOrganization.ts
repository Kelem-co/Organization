import { useOrganizationContext } from '@/context/OrganizationContext';
import { organizationsApi } from '@/lib/services/organizationsApi';
import type { Organization, UpdateOrganizationRequest } from '@/lib/types/organizations';

export function useOrganization() {
  const { organization, loading, error, refetch } = useOrganizationContext();

  const updateOrganization = async (data: UpdateOrganizationRequest): Promise<Organization> => {
    if (!organization) {
      throw new Error('No organization found');
    }

    const updated = await organizationsApi.update(organization.id, data);
    // Refetch to update the shared context
    await refetch();
    return updated;
  };

  return {
    organization,
    loading,
    error,
    updateOrganization,
    refreshOrganization: refetch,
  };
}
