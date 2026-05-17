'use client';

import { useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, CheckCircle2, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '@/lib/services/authApi';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const uid = params.uid as string;
    const token = params.token as string;

    try {
      await authApi.resetPasswordConfirm({
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?reset=true');
      }, 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'normalized' in err) {
        const apiError = err as { normalized: { message: string } };
        setError(apiError.normalized.message);
      } else {
        setError('Failed to reset password. The link may be invalid or expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-grey p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="inline-block p-5 bg-primary-navy/5 rounded-[--radius-school] mb-6">
              <Building2 className="w-10 h-10 text-primary-navy" />
            </div>
            <h1 className="text-4xl font-black text-primary-navy mb-3 tracking-tight">
              Password Reset
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-text-main mb-3">
                Password Reset Successful!
              </h2>

              <p className="text-text-muted mb-6">
                Your password has been changed successfully.
              </p>

              <p className="text-sm text-text-muted">
                Redirecting to login page...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-grey p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-block p-5 bg-primary-navy/5 rounded-[--radius-school] mb-6">
            <Building2 className="w-10 h-10 text-primary-navy" />
          </div>
          <h1 className="text-4xl font-black text-primary-navy mb-3 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs text-primary-navy/40 font-bold uppercase tracking-[0.3em] mb-4">
            Institutional Portal
          </p>
          <p className="text-text-muted text-lg">
            Enter your new password below.
          </p>
        </div>

        <motion.div
          className="card-elevated"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-navy" />
                New Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
                minLength={8}
              />
              <p className="text-xs text-text-muted">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-navy" />
                Confirm New Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
                minLength={8}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-text-muted">
              Secure Institutional Portal. Encrypted with high-grade security protocols.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
