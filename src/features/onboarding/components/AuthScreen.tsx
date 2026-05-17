import { useState, type FormEvent } from 'react';
import { Mail, Lock, CheckCircle2, Building2, User, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/services/authApi';
import { featureFlags } from '@/config/featureFlags';

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const phoneNumber = String(formData.get('phoneNumber') ?? '');
    const address = String(formData.get('address') ?? '');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      if (featureFlags.useRealAuth) {
        console.log('🔵 Using real auth API');
        console.log('🔵 Backend URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
        
        // Register user
        await authApi.register({
          email,
          password,
          name,
          father_name: fatherName,
          grandfather_name: grandfatherName,
          phone_number: phoneNumber || undefined,
          address: address || undefined,
        });
        
        // Redirect to check email page
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
      } else {
        console.log('🟡 Using mock auth');
        // Mock flow - skip email verification
        onSuccess();
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'normalized' in err) {
        const apiError = err as { normalized: { message: string; fieldErrors?: Array<{ field: string; message: string }> } };
        if (apiError.normalized.fieldErrors && apiError.normalized.fieldErrors.length > 0) {
          setError(apiError.normalized.fieldErrors.map(e => `${e.field}: ${e.message}`).join(', '));
        } else {
          setError(apiError.normalized.message);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <div className="inline-block p-5 bg-primary-navy/5 rounded-[--radius-school] mb-6">
          <Building2 className="w-10 h-10 text-primary-navy" />
        </div>
        <h1 className="text-4xl font-black text-primary-navy mb-3 tracking-tight">School Administration</h1>
        <p className="text-xs text-primary-navy/40 font-bold uppercase tracking-[0.3em] mb-4">Institutional Portal</p>
        <p className="text-text-muted text-lg">Create your account to begin onboarding.</p>
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
              <User className="w-4 h-4 text-primary-navy" />
              Full Name *
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="John"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <User className="w-4 h-4 text-primary-navy" />
              Father Name *
            </label>
            <input
              name="fatherName"
              type="text"
              required
              placeholder="Richard"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <User className="w-4 h-4 text-primary-navy" />
              Grandfather Name *
            </label>
            <input
              name="grandfatherName"
              type="text"
              required
              placeholder="William"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-navy" />
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@school.edu"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-navy" />
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="+1234567890"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-navy" />
              Address
            </label>
            <input
              name="address"
              type="text"
              placeholder="123 Main Street"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-navy" />
              Password *
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-navy" />
              Confirm Password *
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account & Continue
                <CheckCircle2 className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login"
            className="text-sm text-primary-navy font-medium hover:underline"
          >
            Already have an account? Login instead
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-text-muted">
            Secure Institutional Portal. Encrypted with high-grade security protocols.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
