'use client';

import { useState, useEffect, useCallback } from 'react';
import { featureFlags } from '@/config/featureFlags';
import { schoolsApi } from '@/lib/services/schoolsApi';
import { MOCK_SCHOOLS } from '@/features/dashboard/constants';
import type { School } from '@/features/dashboard/types';
import type { ApiSchool, CreateSchoolRequest } from '@/lib/types/schools';

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!featureFlags.useRealSchools) {
      setSchools(MOCK_SCHOOLS);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    
    schoolsApi.list()
      .then((response) => {
        if (!cancelled) {
          // Convert API schools to dashboard School format
          const convertedSchools: School[] = response.results.map((apiSchool: ApiSchool) => ({
            id: apiSchool.id,
            name: apiSchool.name,
            logo: apiSchool.logo || `https://picsum.photos/seed/${apiSchool.id}/800/600`,
            location: apiSchool.country,
            studentCount: 0, // TODO: Get from API when available
            staffCount: 0, // TODO: Get from API when available
            description: apiSchool.description,
            website: apiSchool.website,
          }));
          setSchools(convertedSchools);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to fetch schools:', err);
          
          // Check if it's a 404 error (no schools exist yet)
          if (err && typeof err === 'object' && 'normalized' in err) {
            const apiError = err as { normalized: { code: string } };
            if (apiError.normalized.code === 'NOT_FOUND') {
              // 404 means no schools exist yet, not an error
              setSchools([]);
              setError(null);
              return;
            }
          }
          
          // For other errors, show error message
          setError('Failed to load schools');
          setSchools([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const addSchool = useCallback(async (schoolData: CreateSchoolRequest) => {
    if (!featureFlags.useRealSchools) {
      const mockSchool: School = {
        id: `s${Date.now()}`,
        name: schoolData.name,
        logo: `https://picsum.photos/seed/${Date.now()}/800/600`,
        location: schoolData.country,
        studentCount: 0,
        staffCount: 0,
        description: schoolData.description || '',
        website: schoolData.website || '',
      };
      setSchools((prev) => [mockSchool, ...prev]);
      return mockSchool;
    }

    try {
      const created = await schoolsApi.create(schoolData);
      const newSchool: School = {
        id: created.id,
        name: created.name,
        logo: created.logo || `https://picsum.photos/seed/${created.id}/800/600`,
        location: created.country,
        studentCount: 0,
        staffCount: 0,
        description: created.description,
        website: created.website,
      };
      setSchools((prev) => [newSchool, ...prev]);
      return newSchool;
    } catch (err) {
      console.error('Failed to create school:', err);
      throw err;
    }
  }, []);

  return { schools, setSchools, addSchool, loading, error };
}
