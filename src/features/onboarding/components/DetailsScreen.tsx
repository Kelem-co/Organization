
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Building2, User, ChevronRight, Briefcase, FileUp } from 'lucide-react';
import { OrganizationDetails } from '../types';
import { organizationsApi } from '@/lib/services/organizationsApi';
import { MediaUploader } from '@/components/MediaUploader';

interface DetailsScreenProps {
  onSubmit: (data: OrganizationDetails) => void;
}

export default function DetailsScreen({ onSubmit }: DetailsScreenProps) {
  const [formData, setFormData] = useState({
    tradeName: '',
    licenseNumber: '',
    taxId: '',
    displayName: '',
    ownerName: '',
    adminEmail: '',
    phoneNumber: '',
    address: '',
  });

  const [businessLicenseImageId, setBusinessLicenseImageId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map frontend fields to backend API format
      const organizationData = {
        name: formData.displayName,
        trade_name: formData.tradeName,
        tin_number: formData.taxId,
        license_no: formData.licenseNumber,
        client_full_name: formData.ownerName,
        business_address: formData.address,
        business_phone_number: formData.phoneNumber,
        client_phone_number: formData.phoneNumber,
        business_license_image: businessLicenseImageId,
      };

      console.log('Creating organization:', organizationData);
      const createdOrg = await organizationsApi.create(organizationData);
      console.log('Organization created successfully:', createdOrg);

      // Pass the created organization data to parent component
      onSubmit({
        ...formData,
        verificationStatus: createdOrg.verification_status,
        organizationName: createdOrg.name,
      } as any);
    } catch (err: unknown) {
      console.error('Failed to create organization:', err);
      if (err && typeof err === 'object' && 'normalized' in err) {
        const apiError = err as { normalized: { message: string; fieldErrors?: Array<{ field: string; message: string }> } };
        if (apiError.normalized.fieldErrors && apiError.normalized.fieldErrors.length > 0) {
          setError(apiError.normalized.fieldErrors.map(e => `${e.field}: ${e.message}`).join(', '));
        } else {
          setError(apiError.normalized.message);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create organization');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary-navy">Institutional Details</h2>
        <p className="text-text-muted">Provide the official identity and contact information for your school.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Business Identity */}
        <div className="card-elevated space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="p-3 bg-blue-50 rounded-[--radius-school]">
              <Briefcase className="w-6 h-6 text-primary-navy" />
            </div>
            <h3 className="text-xl font-bold text-primary-navy">Business Identity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Trade Name</label>
              <input 
                className="input-field" 
                required 
                value={formData.tradeName}
                onChange={updateField('tradeName')}
                placeholder="e.g. Addis Ababa Academy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">License Number</label>
              <input 
                className="input-field" 
                required 
                value={formData.licenseNumber}
                onChange={updateField('licenseNumber')}
                placeholder="REG-2024-XXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Display Name</label>
              <input 
                className="input-field" 
                required 
                value={formData.displayName}
                onChange={updateField('displayName')}
                placeholder="Alternative name for app UI"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Tax Identification Number (TIN)</label>
              <input 
                className="input-field" 
                required 
                value={formData.taxId}
                onChange={updateField('taxId')}
                placeholder="10-digit TIN"
              />
            </div>
          </div>
        </div>

        {/* Business Verification */}
        <div className="card-elevated space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="p-3 bg-blue-50 rounded-[--radius-school]">
              <FileUp className="w-6 h-6 text-primary-navy" />
            </div>
            <h3 className="text-xl font-bold text-primary-navy">Business Verification</h3>
          </div>
          
          <MediaUploader
            accept="image/*,application/pdf"
            onUploaded={(mediaId) => {
              console.log('License uploaded:', mediaId);
              setBusinessLicenseImageId(mediaId);
            }}
            label="Business License Document"
            description="Click or drag license photo here (PNG, JPG or PDF)"
          />
        </div>

        {/* Contact Information */}
        <div className="card-elevated space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="p-3 bg-blue-50 rounded-[--radius-school]">
              <User className="w-6 h-6 text-primary-navy" />
            </div>
            <h3 className="text-xl font-bold text-primary-navy">Contact Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Owner Name</label>
              <input 
                className="input-field" 
                required 
                value={formData.ownerName}
                onChange={updateField('ownerName')}
                placeholder="Full legal name of owner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Official Email Address</label>
              <input 
                type="email"
                className="input-field" 
                required 
                value={formData.adminEmail}
                onChange={updateField('adminEmail')}
                placeholder="info@school.edu"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Business Address</label>
              <input 
                className="input-field" 
                required 
                value={formData.address}
                onChange={updateField('address')}
                placeholder="Full business address"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Contact Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">+251</span>
                <input 
                  type="tel"
                  className="input-field pl-16" 
                  required 
                  value={formData.phoneNumber}
                  onChange={updateField('phoneNumber')}
                  placeholder="9XXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="btn-primary px-10">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating organization...
              </div>
            ) : (
              <>
                Submit Details
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
