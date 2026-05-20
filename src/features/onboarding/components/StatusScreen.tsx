import { Clock, CheckCircle2, ChevronRight, FileText, HelpCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

type VerificationStatus = 'verified' | 'pending_manual_review' | 'verification_unavailable';

interface StatusScreenProps {
  onProceed?: () => void;
  verificationStatus: VerificationStatus;
  organizationName?: string;
}

export default function StatusScreen({ onProceed, verificationStatus, organizationName }: StatusScreenProps) {
  const referenceId = 'EDU-PENDING';

  // Verified - can proceed to billing
  if (verificationStatus === 'verified') {
    return (
      <div className="w-full max-w-2xl px-4">
        <motion.div 
          className="card-elevated text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-primary-navy mb-4">Verification Successful!</h2>
          <p className="text-sm text-green-600 font-semibold mb-2">✓ ማረጋገጫ ተሳክቷል</p>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Your organization <strong>{organizationName}</strong> has been successfully verified. 
            You can now proceed to select your subscription plan.
          </p>

          <div className="bg-green-50 rounded-[--radius-school] p-6 mb-10 border border-green-200">
            <div className="flex items-center gap-4 justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-bold text-green-900">All documents verified</p>
                <p className="text-xs text-green-700">Your business license and TIN have been confirmed</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={onProceed}
              className="btn-primary px-10 group"
            >
              Continue to Subscription Plans
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pending Manual Review
  if (verificationStatus === 'pending_manual_review') {
    return (
      <div className="w-full max-w-2xl px-4">
        <motion.div 
          className="card-elevated text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div 
                className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-10 h-10" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary-navy mb-4">Manual Verification Required</h2>
          <p className="text-sm text-yellow-600 font-semibold mb-2">በእጅ ማረጋገጫ ያስፈልጋል</p>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Your application requires manual review by our verification team. This typically takes 24-48 hours.
          </p>

          <div className="bg-yellow-50 rounded-[--radius-school] p-6 mb-10 border border-yellow-200">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-bold text-yellow-900">Verification in Progress</p>
                <p className="text-xs text-yellow-700">Our team will review your documents and contact you via email</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-grey rounded-[--radius-school] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-zinc-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <FileText className="w-6 h-6 text-primary-navy" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">Reference ID</p>
                <p className="font-mono text-lg text-primary-navy font-black">{referenceId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-text-main">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary-navy/10 text-primary-navy text-xs font-black rounded-xl flex items-center justify-center shrink-0">1</div>
                <div>
                  <p className="text-sm font-bold text-primary-navy">Document Review (24-48h)</p>
                  <p className="text-xs text-text-muted">Our team will verify your business license and TIN</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 text-text-muted text-xs font-black rounded-xl flex items-center justify-center shrink-0">2</div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Email Notification</p>
                  <p className="text-xs text-text-muted">You&rsquo;ll receive an email once verification is complete</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 text-text-muted text-xs font-black rounded-xl flex items-center justify-center shrink-0">3</div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Select Subscription</p>
                  <p className="text-xs text-text-muted">Choose your plan and activate your account</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="btn-secondary px-10 group">
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Verification Unavailable
  return (
    <div className="w-full max-w-2xl px-4">
      <motion.div 
        className="card-elevated text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-primary-navy mb-4">Verification Service Unavailable</h2>
        <p className="text-sm text-orange-600 font-semibold mb-2">የማረጋገጫ አገልግሎት አይገኝም</p>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          The automated verification service is temporarily unavailable. Your application will be manually reviewed by our team.
        </p>

        <div className="bg-orange-50 rounded-[--radius-school] p-6 mb-10 border border-orange-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-bold text-orange-900 mb-2">Manual Review Required</p>
              <p className="text-xs text-orange-700 leading-relaxed">
                Don&rsquo;t worry! Your application has been submitted successfully. Our team will manually verify 
                your documents and contact you within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-grey rounded-[--radius-school] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <FileText className="w-6 h-6 text-primary-navy" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">Reference ID</p>
              <p className="font-mono text-lg text-primary-navy font-black">{referenceId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-left border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-text-main">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary-navy/10 text-primary-navy text-xs font-black rounded-xl flex items-center justify-center shrink-0">1</div>
              <div>
                <p className="text-sm font-bold text-primary-navy">Manual Document Review</p>
                <p className="text-xs text-text-muted">Our team will verify your information manually (24-48h)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 text-text-muted text-xs font-black rounded-xl flex items-center justify-center shrink-0">2</div>
              <div>
                <p className="text-sm font-bold text-gray-500">Email Confirmation</p>
                <p className="text-xs text-text-muted">You&rsquo;ll receive verification results via email</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 text-text-muted text-xs font-black rounded-xl flex items-center justify-center shrink-0">3</div>
              <div>
                <p className="text-sm font-bold text-gray-500">Account Activation</p>
                <p className="text-xs text-text-muted">Complete subscription and start using the platform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-secondary px-10 group">
            <HelpCircle className="w-5 h-5" />
            Contact Support
          </button>
        </div>
      </motion.div>

      <p className="text-center mt-8 text-xs text-text-muted">
        We apologize for the inconvenience. Your application is safe and will be processed manually.
      </p>
    </div>
  );
}
