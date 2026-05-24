'use client';

import { useState, useEffect, useCallback } from 'react';
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl';
import { getSchoolAvatarUrl } from '@/lib/utils/schoolAvatar';
import { schoolsApi } from '@/lib/services/schoolsApi';
import type { School } from '@/features/dashboard/types';
import type { ApiSchool, CreateSchoolRequest, UpdateSchoolRequest } from '@/lib/types/schools';

async function mapApiSchoolToSchool(apiSchool: ApiSchool): Promise<School> {
  return {
    id: apiSchool.id,
    name: apiSchool.name,
    logo:
      (await resolveMediaUrl(apiSchool.logo)) ||
      getSchoolAvatarUrl(apiSchool.name),
    logoMediaId: apiSchool.logo,
    location: apiSchool.country,
    studentCount: 0,
    staffCount: 0,
    description: apiSchool.description,
    website: apiSchool.website,
    organizationId: apiSchool.organization,
    contactEmail: apiSchool.contact_email,
    contactPhone: apiSchool.contact_phone,
    status: apiSchool.status,
  };
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    let cancelled = false;

    const loadSchools = async () => {
      try {
        const response = await schoolsApi.list();
        if (cancelled) return;

        const convertedSchools: School[] = await Promise.all(
          response.results.map(mapApiSchoolToSchool)
        );

        if (cancelled) return;
        setSchools(convertedSchools);
        setError(null);
      } catch (err) {
        if (cancelled) return;

        console.error('Failed to fetch schools:', err);
        if (err && typeof err === 'object' && 'normalized' in err) {
          const apiError = err as { normalized: { code: string } };
          if (apiError.normalized.code === 'NOT_FOUND') {
            setSchools([]);
            setError(null);
            setLoading(false);
            return;
          }
        }

        setError('Failed to load schools');
        setSchools([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSchools();

    return () => { cancelled = true; };
  }, []);

  const addSchool = useCallback(async (schoolData: CreateSchoolRequest) => {

    try {
      const created = await schoolsApi.create(schoolData);
      const newSchool = await mapApiSchoolToSchool(created);
      setSchools((prev) => [newSchool, ...prev]);
      return newSchool;
    } catch (err) {
      console.error('Failed to create school:', err);
      throw err;
    }
  }, []);

  const updateSchool = useCallback(async (schoolId: string, schoolData: UpdateSchoolRequest) => {

    try {
      const updated = await schoolsApi.update(schoolId, schoolData);
      const nextSchool = await mapApiSchoolToSchool(updated);

      setSchools((prev) => prev.map((school) => (
        school.id === schoolId ? nextSchool : school
      )));

      return nextSchool;
    } catch (err) {
      console.error('Failed to update school:', err);
      throw err;
    }
  }, []);

  return { schools, setSchools, addSchool, updateSchool, loading, error };
}
