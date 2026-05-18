/**
 * Feature flags for incremental backend migration.
 * Reads from environment variables with fallback to false for safety.
 * 
 * IMPORTANT: In Next.js, NEXT_PUBLIC_* variables are embedded at BUILD TIME.
 * They are replaced inline by Next.js during the build process.
 */

// Helper to parse boolean from string
function parseBool(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

// Next.js replaces process.env.NEXT_PUBLIC_* at build time
export const featureFlags = {
  useRealAuth: parseBool(process.env.NEXT_PUBLIC_FF_REAL_AUTH),
  useRealSchools: parseBool(process.env.NEXT_PUBLIC_FF_REAL_SCHOOLS),
  useRealBranches: parseBool(process.env.NEXT_PUBLIC_FF_REAL_BRANCHES),
  useRealBranchAdmins: parseBool(process.env.NEXT_PUBLIC_FF_REAL_BRANCH_ADMINS),
  useRealAnalytics: parseBool(process.env.NEXT_PUBLIC_FF_REAL_ANALYTICS),
  useRealBilling: parseBool(process.env.NEXT_PUBLIC_FF_REAL_BILLING),
  useRealSettings: parseBool(process.env.NEXT_PUBLIC_FF_REAL_SETTINGS),
  useRealOnboarding: parseBool(process.env.NEXT_PUBLIC_FF_REAL_ONBOARDING),
};

// Log feature flags in development
if (process.env.NODE_ENV === 'development') {
  console.log('🚩 Feature Flags:', featureFlags);
}
