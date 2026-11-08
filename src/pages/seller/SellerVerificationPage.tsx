import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Phone, 
  Mail, 
  FileCheck, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SellerVerificationPage: React.FC = () => {
  const { sellers, submitVerification } = useAppStore();
  const demoSeller = sellers.find((s) => s.id === 'seller-demo');

  const [docType, setDocType] = useState<'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID'>('Aadhaar Card');
  const [docNumber, setDocNumber] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const verificationStatus = demoSeller?.verificationStatus || 'Verified';

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp === '1234' || otp.length === 4) {
      setPhoneVerified(true);
      setOtpSent(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerification({
      sellerId: 'seller-demo',
      sellerName: demoSeller?.name || 'Arjun Mehta',
      sellerEmail: demoSeller?.email || 'arjun.seller@resell.in',
      documentType: docType,
      documentNumber: docNumber || 'XXXX-XXXX-4910',
      documentImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      phone,
    });
    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          Seller Trust & Verification Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Government-level authentication simulation to earn the ReSell Verified Seller trust badge.
        </p>
      </div>

      {/* Demo Disclaimer Box (Mandatory per Section 10) */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-bold block">Frontend Demonstration Notice:</span>
          This interface is a simulated proof-of-concept verification pipeline. No actual government databases or real identity verification services are accessed.
        </div>
      </div>

      {/* Current Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Your Profile Verification Status
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{verificationStatus}</h2>
            {verificationStatus === 'Verified' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : verificationStatus === 'Verification Pending' ? (
              <Clock className="w-5 h-5 text-amber-500" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {verificationStatus === 'Verified'
              ? 'Your profile proudly displays the Blue Verified Checkmark across all listings and chat channels.'
              : 'Submit verification documents below to display the Verified Seller badge.'}
          </p>
        </div>

        {/* Badge Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3 shrink-0">
          <img
            src={demoSeller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt="Seller Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              {demoSeller?.name || 'Arjun Mehta'}
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Verified Curator</span>
          </div>
        </div>
      </div>

      {/* Verification Simulation Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Step-by-Step Identity Submission
        </h3>

        {submittedSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verification request submitted for admin review! You can approve it instantly in the Super Admin dashboard.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Government Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
              <option value="PAN Card">PAN Card (Income Tax Dept)</option>
              <option value="Passport">Indian Passport</option>
              <option value="Voter ID">Election Voter ID</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Document Identification Number
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="e.g. XXXX-XXXX-4910"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Upload Scan */}
        <div>
          <label className="block text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Upload Document Photo / Scan
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center space-y-1 bg-slate-50 dark:bg-slate-800/40">
            <Upload className="w-6 h-6 mx-auto text-blue-600" />
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Drag and drop ID front & back
            </p>
            <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Phone Verification with simulated OTP */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="block text-xs text-slate-700 dark:text-slate-300 font-semibold">
            Registered Mobile OTP Verification
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-700 rounded-xl hover:bg-slate-700"
            >
              Send OTP (1234)
            </button>
          </div>

          {otpSent && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-32 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
              >
                Confirm OTP
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </div>
  );
};
