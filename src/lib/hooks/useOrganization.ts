import { useOrganizationContext } from '@/context/OrganizationContext';
import { organizationsApi } from '@/lib/services/organizationsApi';
import type { Organization, UpdateOrganizationRequest } from '@/lib/types/organizations';

export function useOrganization() {
  const { organization, loading, error, refetch, setOrganization } = useOrganizationContext();

  const updateOrganization = async (data: UpdateOrganizationRequest): Promise<Organization> => {
    if (!organization) {
      throw new Error('No organization found');
    }

    const updated = await organizationsApi.update(organization.id, data);
    // Update shared state immediately so media and other fields refresh without
    // waiting on a follow-up list request.
    setOrganization(updated);
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
