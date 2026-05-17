'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SchoolDashboard from '@/features/dashboard/pages/SchoolDashboard';

export default function RootPage() {
  const { hydrated, isAuthenticated, onboardingComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    // If not authenticated or no verified org, show landing page
    if (!isAuthenticated || !onboardingComplete) {
      router.replace('/landing');
    }
  }, [hydrated, isAuthenticated, onboardingComplete, router]);

  // Show loading while checking auth
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-grey">
        <div className="w-10 h-10 border-4 border-primary-navy/20 border-t-primary-navy rounded-full animate-spin" />
      </div>
    );
  }

  // If authenticated with verified org, show dashboard
  if (isAuthenticated && onboardingComplete) {
    return <SchoolDashboard />;
  }

  // Otherwise show nothing while redirecting
  return null;
}
