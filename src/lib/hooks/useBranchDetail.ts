'use client';

import { useState, useEffect, useCallback } from 'react';
import { featureFlags } from '@/config/featureFlags';
import { schoolsApi } from '@/lib/services/schoolsApi';
import { branchesApi } from '@/lib/services/branchesApi';
import { organizationsApi } from '@/lib/services/organizationsApi';
import { branchAdminsApi } from '@/lib/services/branchAdminsApi';
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl';
import { getSchoolAvatarUrl } from '@/lib/utils/schoolAvatar';
import { MOCK_SCHOOLS, MOCK_BRANCHES, MOCK_ADMINS } from '@/features/dashboard/constants';
import type { School, Branch, Admin } from '@/features/dashboard/types';
import type { CreateBranchRequest, UpdateBranchRequest } from '@/lib/types/branches';
import type { BranchAdmin } from '@/lib/types/branchAdmins';

export function useBranchDetail(schoolId: string) {
  const [school, setSchool] = useState<School | undefined>(undefined);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [branchAdminsMap, setBranchAdminsMap] = useState<Record<string, BranchAdmin[]>>({});
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;

    let cancelled = false;

    // Fetch school data (use real API if useRealSchools is enabled)
    const fetchSchool = async () => {
      if (featureFlags.useRealSchools) {
        try {
          const apiSchool = await schoolsApi.get(schoolId);
          if (cancelled) return;
          
          // Store organization ID for branch creation
          setOrganizationId(apiSchool.organization);
          
          // Convert API school to dashboard School format
          const convertedSchool: School = {
            id: apiSchool.id,
            name: apiSchool.name,
            logo:
              (await resolveMediaUrl(apiSchool.logo)) ||
              getSchoolAvatarUrl(apiSchool.name),
            logoMediaId: apiSchool.logo,
            location: apiSchool.country,
            studentCount: 0, // TODO: Get from API when available
            staffCount: 0, // TODO: Get from API when available
            description: apiSchool.description,
            website: apiSchool.website,
            organizationId: apiSchool.organization,
            contactEmail: apiSchool.contact_email,
            contactPhone: apiSchool.contact_phone,
            status: apiSchool.status,
          };
          setSchool(convertedSchool);
        } catch (err) {
          console.error('Failed to fetch school:', err);
          if (!cancelled) {
            // Fallback to mock
            setSchool(MOCK_SCHOOLS.find((s) => s.id === schoolId));
          }
        }
      } else {
        setSchool(MOCK_SCHOOLS.find((s) => s.id === schoolId));
      }
    };

    // Fetch branches (use real API if useRealBranches is enabled)
    const fetchBranches = async () => {
      if (featureFlags.useRealBranches) {
        try {
          const branchData = await branchesApi.listBySchool(schoolId);
          if (cancelled) return;
          
          // Convert API branches to dashboard Branch format
          const convertedBranches: Branch[] = branchData.map(apiBranch => ({
            id: apiBranch.id,
            schoolId: apiBranch.school,
            name: apiBranch.name,
            address: apiBranch.address,
            city: apiBranch.city,
            region: apiBranch.region,
            contactPhone: apiBranch.contact_phone,
            contactEmail: apiBranch.contact_email,
            status: apiBranch.status,
            studentCount: 0, // TODO: Get from API
            teacherCount: 0, // TODO: Get from API
            capacity: 1000, // TODO: Get from API
            performance: [], // TODO: Get from API
          }));
          setBranches(convertedBranches);

          // Always fetch real branch admins when using real branches
          const adminsMap: Record<string, BranchAdmin[]> = {};
          
          // Fetch admins for each branch
          await Promise.all(
            convertedBranches.map(async (branch) => {
              try {
                const branchAdmins = await branchAdminsApi.list(branch.id);
                adminsMap[branch.id] = branchAdmins;
                console.log(`Fetched ${branchAdmins.length} admins for branch ${branch.name}`);
              } catch (err) {
                console.error(`Failed to fetch admins for branch ${branch.id}:`, err);
                adminsMap[branch.id] = [];
              }
            })
          );
          
          if (!cancelled) {
            setBranchAdminsMap(adminsMap);
          }
        } catch (err) {
          console.error('Failed to fetch branches:', err);
          if (!cancelled) {
            // Fallback to mock
            setBranches(MOCK_BRANCHES.filter((b) => b.schoolId === schoolId));
            setAdmins(MOCK_ADMINS);
          }
        }
      } else {
        setBranches(MOCK_BRANCHES.filter((b) => b.schoolId === schoolId));
        setAdmins(MOCK_ADMINS);
      }
    };

    // Fetch both in parallel
    Promise.all([fetchSchool(), fetchBranches()])
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [schoolId]);

  const addBranch = useCallback(async (branchData: Omit<CreateBranchRequest, 'organization' | 'school' | 'status'>) => {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (!featureFlags.useRealBranches) {
      // Mock implementation
      const mockBranch: Branch = {
        id: `b${Date.now()}`,
        schoolId: schoolId,
        name: branchData.name,
        address: branchData.address,
        city: branchData.city,
        region: branchData.region,
        contactPhone: branchData.contact_phone,
        contactEmail: branchData.contact_email,
        status: 'ACTIVE',
        studentCount: 0,
        teacherCount: 0,
        capacity: 1000,
        performance: [],
      };
      setBranches(prev => [mockBranch, ...prev]);
      return mockBranch;
    }

    // Get organization ID
    let orgId = organizationId;
    if (!orgId) {
      // Fetch organizations to get the ID
      const orgsResponse = await organizationsApi.list();
      if (orgsResponse.results.length === 0) {
        throw new Error('No organization found. Please complete onboarding first.');
      }
      orgId = orgsResponse.results[0].id;
      setOrganizationId(orgId);
    }

    // Create branch via API
    const createData: CreateBranchRequest = {
      organization: orgId,
      school: schoolId,
      name: branchData.name,
      address: branchData.address,
      city: branchData.city,
      region: branchData.region,
      contact_phone: branchData.contact_phone,
      contact_email: branchData.contact_email,
      status: 'ACTIVE',
    };

    const created = await branchesApi.create(createData);
    
    // Convert to dashboard format
    const newBranch: Branch = {
      id: created.id,
      schoolId: created.school,
      name: created.name,
      address: created.address,
      city: created.city,
      region: created.region,
      contactPhone: created.contact_phone,
      contactEmail: created.contact_email,
      status: created.status,
      studentCount: 0,
      teacherCount: 0,
      capacity: 1000,
      performance: [],
    };
    
    setBranches(prev => [newBranch, ...prev]);
    return newBranch;
  }, [schoolId, organizationId]);

  const updateBranch = useCallback(async (branchId: string, branchData: UpdateBranchRequest) => {
    if (!featureFlags.useRealBranches) {
      setBranches(prev => prev.map(branch => (
        branch.id === branchId
          ? {
              ...branch,
              ...(branchData.name !== undefined ? { name: branchData.name } : {}),
              ...(branchData.address !== undefined ? { address: branchData.address } : {}),
              ...(branchData.city !== undefined ? { city: branchData.city } : {}),
              ...(branchData.region !== undefined ? { region: branchData.region } : {}),
              ...(branchData.contact_phone !== undefined ? { contactPhone: branchData.contact_phone } : {}),
              ...(branchData.contact_email !== undefined ? { contactEmail: branchData.contact_email } : {}),
              ...(branchData.status !== undefined ? { status: branchData.status } : {}),
            }
          : branch
      )));
      return;
    }

    const updated = await branchesApi.update(branchId, branchData);

    setBranches(prev => prev.map(branch => (
      branch.id === branchId
        ? {
            ...branch,
            name: updated.name,
            address: updated.address,
            city: updated.city,
            region: updated.region,
            contactPhone: updated.contact_phone,
            contactEmail: updated.contact_email,
            status: updated.status,
          }
        : branch
    )));
  }, []);

  const refreshBranchAdmins = useCallback(async (branchId: string) => {
    if (!featureFlags.useRealBranches) return;
    
    try {
      const branchAdmins = await branchAdminsApi.list(branchId);
      console.log(`Refreshed ${branchAdmins.length} admins for branch ${branchId}`);
      setBranchAdminsMap(prev => ({
        ...prev,
        [branchId]: branchAdmins,
      }));
    } catch (err) {
      console.error(`Failed to refresh admins for branch ${branchId}:`, err);
    }
  }, []);

  return { 
    school, 
    branches, 
    admins, 
    branchAdminsMap,
    setAdmins, 
    loading, 
    addBranch,
    updateBranch,
    refreshBranchAdmins,
  };
}
