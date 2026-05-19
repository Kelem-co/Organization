'use client';

import { useState, type FormEvent } from 'react';
import { Mail, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/services/authApi';
import { formatAuthError } from '@/lib/utils/errorMessages';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const emailValue = String(formData.get('email') ?? '');
    setEmail(emailValue);

    try {
      await authApi.resetPassword({ email: emailValue });
      setSuccess(true);
    } catch (err: unknown) {
      setError(formatAuthError(err));
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
              Check Your Email
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

              <h2 className="text-2xl font-bold text-text-main mb-4">
                Reset Link Sent!
              </h2>

              <p className="text-text-muted mb-2">
                We've sent a password reset link to:
              </p>
              <p className="text-primary-navy font-semibold mb-6">
                {email}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the reset link in the email</li>
                  <li>Enter your new password</li>
                  <li>Login with your new password</li>
                </ol>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="btn-primary w-full"
              >
                Back to Login
              </button>

              <p className="text-xs text-text-muted mt-6">
                Didn't receive the email? Check your spam folder.
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
            Forgot Password?
          </h1>
          <p className="text-xs text-primary-navy/40 font-bold uppercase tracking-[0.3em] mb-4">
            Institutional Portal
          </p>
          <p className="text-text-muted text-lg">
            Enter your email and we'll send you a reset link.
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
                <Mail className="w-4 h-4 text-primary-navy" />
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@school.edu"
                className="input-field"
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
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary-navy font-medium hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-text-muted">
              Remember your password?{' '}
              <Link href="/login" className="text-primary-navy font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
