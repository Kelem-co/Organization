'use client';

import { appConfig } from '@/lib/api/config';
import { featureFlags } from '@/config/featureFlags';

export default function DebugEnvPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Environment Variables Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">App Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-4">
              <span className="font-bold w-40">API Base URL:</span>
              <span className="text-blue-600">{appConfig.apiBaseUrl}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold w-40">API Timeout:</span>
              <span className="text-blue-600">{appConfig.apiTimeout}ms</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold w-40">Google Maps Key:</span>
              <span className="text-blue-600">{appConfig.googleMapsKey || '(not set)'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Feature Flags</h2>
          <div className="space-y-2 font-mono text-sm">
            {Object.entries(featureFlags).map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <span className="font-bold w-40">{key}:</span>
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                  {value ? '✓ enabled' : '✗ disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Raw Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-4">
              <span className="font-bold w-60">NEXT_PUBLIC_API_BASE_URL:</span>
              <span className="text-blue-600">{process.env.NEXT_PUBLIC_API_BASE_URL || '(not set)'}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold w-60">NEXT_PUBLIC_FF_REAL_AUTH:</span>
              <span className="text-blue-600">{process.env.NEXT_PUBLIC_FF_REAL_AUTH || '(not set)'}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold w-60">NEXT_PUBLIC_FF_REAL_SCHOOLS:</span>
              <span className="text-blue-600">{process.env.NEXT_PUBLIC_FF_REAL_SCHOOLS || '(not set)'}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold w-60">NEXT_PUBLIC_FF_REAL_ONBOARDING:</span>
              <span className="text-blue-600">{process.env.NEXT_PUBLIC_FF_REAL_ONBOARDING || '(not set)'}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold w-60">NODE_ENV:</span>
              <span className="text-blue-600">{process.env.NODE_ENV || '(not set)'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> If you see default values or "(not set)", you need to:
            <ol className="list-decimal ml-6 mt-2 space-y-1">
              <li>Make sure .env.local exists in the project root</li>
              <li>Restart the development server (npm run dev)</li>
              <li>Clear your browser cache and reload</li>
            </ol>
          </p>
        </div>
      </div>
    </div>
  );
}
