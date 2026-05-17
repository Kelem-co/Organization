'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '@/lib/services/authApi';
import { tokenManager } from '@/lib/api/tokenManager';

export default function ActivatePage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activate = async () => {
      const uid = params.uid as string;
      const token = params.token as string;

      if (!uid || !token) {
        setStatus('error');
        setError('Invalid activation link');
        return;
      }

      try {
        // Activate the account
        await authApi.activate({ uid, token });
        setStatus('success');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login?activated=true');
        }, 2000);
      } catch (err: unknown) {
        setStatus('error');
        if (err && typeof err === 'object' && 'normalized' in err) {
          const apiError = err as { normalized: { message: string } };
          setError(apiError.normalized.message);
        } else {
          setError('Activation failed. The link may be invalid or expired.');
        }
      }
    };

    activate();
  }, [params.uid, params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-grey p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-block p-5 bg-primary-navy/5 rounded-[--radius-school] mb-6">
            <Building2 className="w-10 h-10 text-primary-navy" />
          </div>
          <h1 className="text-4xl font-black text-primary-navy mb-3 tracking-tight">
            Account Activation
          </h1>
          <p className="text-xs text-primary-navy/40 font-bold uppercase tracking-[0.3em] mb-4">
            Institutional Portal
          </p>
        </div>

        <motion.div
          className="card-elevated"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center py-8">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-primary-navy mx-auto mb-6 animate-spin" />
                <h2 className="text-2xl font-bold text-text-main mb-3">
                  Activating Your Account
                </h2>
                <p className="text-text-muted">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-3">
                  Account Activated!
                </h2>
                <p className="text-text-muted mb-6">
                  Your email has been verified successfully.
                </p>
                <p className="text-sm text-text-muted">
                  Redirecting to login page...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-3">
                  Activation Failed
                </h2>
                <p className="text-text-muted mb-6">
                  {error || 'Unable to activate your account.'}
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="btn-primary"
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
