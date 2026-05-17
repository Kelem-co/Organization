'use client';

import { useState, useEffect } from 'react';
import { featureFlags } from '@/config/featureFlags';
import { schoolsApi } from '@/lib/services/schoolsApi';
import { branchesApi } from '@/lib/services/branchesApi';
import { MOCK_SCHOOLS, MOCK_BRANCHES, MOCK_ADMINS } from '@/features/dashboard/constants';
import type { School, Branch, Admin } from '@/features/dashboard/types';
import type { ApiSchool } from '@/lib/types/schools';

export function useBranchDetail(schoolId: string) {
  const [school, setSchool] = useState<School | undefined>(undefined);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    let cancelled = false;
    setLoading(true);

    // Fetch school data (use real API if useRealSchools is enabled)
    const fetchSchool = async () => {
      if (featureFlags.useRealSchools) {
        try {
          const apiSchool = await schoolsApi.get(schoolId);
          if (cancelled) return;
          
          // Convert API school to dashboard School format
          const convertedSchool: School = {
            id: apiSchool.id,
            name: apiSchool.name,
            logo: apiSchool.logo || `https://picsum.photos/seed/${apiSchool.id}/800/600`,
            location: apiSchool.country,
            studentCount: 0, // TODO: Get from API when available
            staffCount: 0, // TODO: Get from API when available
            description: apiSchool.description,
            website: apiSchool.website,
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
          setBranches(branchData);

          // Load admins for all branches
          const branchIds = branchData.map((b) => b.id);
          const adminArrays = await Promise.all(
            branchIds.map((id) => branchesApi.listAdmins(id))
          );
          if (!cancelled) {
            setAdmins(adminArrays.flat());
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

  return { school, branches, admins, setAdmins, loading };
}
