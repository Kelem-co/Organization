import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { Mail, Lock, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/services/authApi';
import { featureFlags } from '@/config/featureFlags';
import { PhoneNumberField } from '@/components/PhoneNumberField';
import { LegalModal, TermsOfService, PrivacyPolicy } from '@/components/LegalModal';
import { normalizeOptionalPhoneNumber } from '@/lib/utils/contactValidation';
import { formatAuthError, validatePassword } from '@/lib/utils/errorMessages';

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');
    const name = String(formData.get('name') ?? '');
    const fatherName = String(formData.get('fatherName') ?? '');
    const grandfatherName = String(formData.get('grandfatherName') ?? '');
    const address = String(formData.get('address') ?? '');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are identical.');
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors.join('. '));
      setLoading(false);
      return;
    }

    try {
      const normalizedPhoneNumber = normalizeOptionalPhoneNumber(phoneNumber, 'Phone number');

      if (featureFlags.useRealAuth) {
        // Register user with ORGANIZATION role
        await authApi.register({
          email,
          password,
          name,
          father_name: fatherName,
          grandfather_name: grandfatherName,
          phone_number: normalizedPhoneNumber || undefined,
          address: address || undefined,
          role: 'ORGANIZATION', // Add role for organization owners
        });
        
        // Redirect to check email page
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
      } else {
        // Mock flow - skip email verification
        onSuccess();
      }
    } catch (err: unknown) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=1200&fit=crop&q=80"
            alt="Education"
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Create an account</h2>
          <p className="max-w-md text-base text-slate-300 md:text-lg">
            Enter your details below to create your account or{' '}
            <Link href="/login" className="underline hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
            <span>Photo by</span>
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
              Unsplash
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-navy mb-2">Create an account</h1>
              <p className="text-slate-600">
                Enter your details below to create your account or{' '}
                <Link href="/login" className="text-primary-navy font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Robi"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="fatherName" className="text-sm font-medium text-slate-700">
                    Father Name *
                  </label>
                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    required
                    placeholder="Rnez"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="grandfatherName" className="text-sm font-medium text-slate-700">
                  Grandfather Name *
                </label>
                <input
                  id="grandfatherName"
                  name="grandfatherName"
                  type="text"
                  required
                  placeholder="William"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="robi@robi.work"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <PhoneNumberField
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="+1234567890"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary-navy"
                    inputClassName="text-sm text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main St"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-11 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-11 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-navy focus:ring-primary-navy"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary-navy hover:underline font-medium"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-primary-navy hover:underline font-medium"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create account
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-600">
              By clicking continue, you agree to our{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="underline hover:text-slate-900 font-medium"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="underline hover:text-slate-900 font-medium"
              >
                Privacy Policy
              </button>
              .
            </p>
          </motion.div>
        </div>
      </div>

      {/* Legal Modals */}
      <LegalModal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <TermsOfService />
      </LegalModal>

      <LegalModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <PrivacyPolicy />
      </LegalModal>
    </div>
  );
}
