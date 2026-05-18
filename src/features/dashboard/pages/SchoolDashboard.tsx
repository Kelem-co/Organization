import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SchoolCard from '../components/SchoolCard';
import Modal from '../components/Modal';
import { useSchools } from '@/lib/hooks/useSchools';
import { MediaUploader } from '@/components/MediaUploader';
import { ShieldCheck, School, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { organizationsApi } from '@/lib/services/organizationsApi';
import { branchesApi } from '@/lib/services/branchesApi';
import { featureFlags } from '@/config/featureFlags';
import type { Organization } from '@/lib/types/organizations';
import type { CreateSchoolRequest } from '@/lib/types/schools';

export default function SchoolDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { schools, addSchool, loading: schoolsLoading, error: schoolsError } = useSchools();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [branchCounts, setBranchCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedLogoId, setUploadedLogoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!featureFlags.useRealOnboarding) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await organizationsApi.list();
        console.log('Fetched organizations:', response);
        setOrganizations(response.results);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch organizations:', err);
        
        // Check if it's a 404 error (no organizations exist yet)
        if (err && typeof err === 'object' && 'normalized' in err) {
          const apiError = err as { normalized: { code: string } };
          if (apiError.normalized.code === 'NOT_FOUND') {
            // 404 means no organizations exist yet
            setOrganizations([]);
            setError('No organization found. Please complete onboarding first.');
            setLoading(false);
            return;
          }
        }
        
        setError('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Fetch branch counts for each school
  useEffect(() => {
    const fetchBranchCounts = async () => {
      if (!featureFlags.useRealBranches || schools.length === 0) {
        return;
      }

      try {
        const response = await branchesApi.list();
        const counts: Record<string, number> = {};
        
        // Count branches per school
        response.results.forEach(branch => {
          counts[branch.school] = (counts[branch.school] || 0) + 1;
        });
        
        setBranchCounts(counts);
      } catch (err) {
        console.error('Failed to fetch branch counts:', err);
        // Silently fail - branch counts are not critical
      }
    };

    fetchBranchCounts();
  }, [schools]);

  const handleAddSchool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (organizations.length === 0) {
      setError('No organization found. Please complete onboarding to create an organization first.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    const schoolData: CreateSchoolRequest = {
      organization: organizations[0].id, // Use the first organization
      name: formData.get('name') as string,
      description: formData.get('description') as string || '',
      country: formData.get('country') as string,
      contact_email: formData.get('contact_email') as string,
      contact_phone: formData.get('contact_phone') as string || '',
      website: formData.get('website') as string || '',
      status: 'ACTIVE',
    };

    // Add logo if uploaded
    if (uploadedLogoId) {
      schoolData.logo = uploadedLogoId;
    }

    try {
      setSubmitting(true);
      setError(null);
      await addSchool(schoolData);
      setIsAddModalOpen(false);
      // Reset form and uploaded logo
      (e.target as HTMLFormElement).reset();
      setUploadedLogoId(null);
    } catch (err) {
      console.error('Failed to add school:', err);
      if (err && typeof err === 'object' && 'normalized' in err) {
        const apiError = err as { normalized: { message: string; fieldErrors?: Array<{ field: string; message: string }> } };
        if (apiError.normalized.fieldErrors && apiError.normalized.fieldErrors.length > 0) {
          setError(apiError.normalized.fieldErrors.map(e => `${e.field}: ${e.message}`).join(', '));
        } else {
          setError(apiError.normalized.message);
        }
      } else {
        setError('Failed to add school. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = loading || schoolsLoading;
  
  // Show organization error if it exists and is not a "no schools" scenario
  const shouldShowError = error && error !== 'No organization found. Please complete onboarding first.';
  const displayError = shouldShowError ? error : schoolsError;

  return (
    <Layout 
      title="Educational Institution Management" 
      onAction={() => setIsAddModalOpen(true)}
      actionLabel="Add New School"
    >
      <div className="p-4 lg:p-8 pb-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-navy/20 border-t-primary-navy rounded-full animate-spin" />
          </div>
        ) : displayError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-800 mb-4">{displayError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-primary-navy font-medium hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : schools.length === 0 ? (
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-primary-navy/20 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-primary-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <School className="w-10 h-10 text-primary-navy" />
            </div>
            <h3 className="text-2xl font-bold text-primary-navy mb-3">No Schools Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by adding your first school to the platform. You can manage multiple schools from this dashboard.
            </p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First School
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {schools.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SchoolCard 
                  school={school} 
                  branchCount={branchCounts[school.id] || 0}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setError(null);
          setUploadedLogoId(null);
        }} 
        title="Add New School"
      >
        <form className="space-y-6" onSubmit={handleAddSchool}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <MediaUploader
              imageOnly={true}
              accept="image/*"
              onUploaded={(mediaId) => setUploadedLogoId(mediaId)}
              label="School Logo (Optional)"
              description="Drop school logo here"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/60">School Name *</label>
              <input 
                name="name"
                type="text" 
                required
                placeholder="e.g. St. Andrews Excellence Academy"
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/60">Description</label>
              <textarea 
                name="description"
                placeholder="Briefly describe the school's mission and history..."
                rows={3}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/60">Contact Email *</label>
                <input 
                  name="contact_email"
                  type="email"
                  required
                  placeholder="admin@school.edu"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/60">Website</label>
                <input 
                  name="website"
                  type="url" 
                  placeholder="https://www.school.edu"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/60">Phone Number</label>
                <input 
                  name="contact_phone"
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-navy/60">Country *</label>
                <select 
                  name="country" 
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20 appearance-none"
                >
                  <option value="">Select a country</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="United States">United States</option>
                  <option value="Australia">Australia</option>
                  <option value="Ethiopia">Ethiopia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800 leading-relaxed">
                By adding this school, you confirm that all school data is encrypted and compliant with local educational regulations.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-primary-navy text-white py-4 rounded-lg font-bold text-sm uppercase tracking-[0.1em] hover:opacity-90 transition-opacity mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding School...
                </div>
              ) : (
                'Add School'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
