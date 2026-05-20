'use client';

import { appConfig } from '@/lib/api/config';
import { featureFlags } from '@/config/featureFlags';

export default function DebugEnvPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Variables Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">App Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">API Base URL:</span>
              <span className="font-bold text-blue-600">{appConfig.apiBaseUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Timeout:</span>
              <span className="font-bold">{appConfig.apiTimeout}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Google Maps Key:</span>
              <span className="font-bold">{appConfig.googleMapsKey ? '***configured***' : 'not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Flags</h2>
          <div className="space-y-2 font-mono text-sm">
            {Object.entries(featureFlags).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}:</span>
                <span className={`font-bold ${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Raw Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">NEXT_PUBLIC_API_BASE_URL:</span>
              <span className="font-bold">{process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NEXT_PUBLIC_FF_REAL_AUTH:</span>
              <span className="font-bold">{process.env.NEXT_PUBLIC_FF_REAL_AUTH || 'undefined'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NEXT_PUBLIC_FF_REAL_SCHOOLS:</span>
              <span className="font-bold">{process.env.NEXT_PUBLIC_FF_REAL_SCHOOLS || 'undefined'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NEXT_PUBLIC_FF_REAL_ONBOARDING:</span>
              <span className="font-bold">{process.env.NEXT_PUBLIC_FF_REAL_ONBOARDING || 'undefined'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NODE_ENV:</span>
              <span className="font-bold">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> If values show as &quot;undefined&quot;, you need to:
            <br />
            1. Make sure .env.local exists in the project root
            <br />
            2. Restart the Next.js development server (stop and run `npm run dev` again)
            <br />
            3. Environment variables are embedded at BUILD TIME, not runtime
          </p>
        </div>
      </div>
    </div>
  );
}
