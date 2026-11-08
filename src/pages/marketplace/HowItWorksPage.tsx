import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Tag, 
  Truck, 
  CheckCircle, 
  PlusCircle, 
  BadgePercent, 
  HelpCircle,
  FileCheck2,
  Lock
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
          Trust & Platform Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How ReSell Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Second-hand shopping without second-guessing. ReSell brings commercial reliability to peer-to-peer commerce through verified seller authentication and tracked delivery.
        </p>
      </div>

      {/* For Buyers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">The Buyer Experience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Discover & Verify</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore listings filtered by condition (Brand New to Fair), real battery health stats, and verified seller badges.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Negotiate with Confidence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Make an offer directly on any negotiable listing. Discuss terms and counteroffers inside secure in-app chat.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tracked Handover</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose door-to-door courier tracking with OTP verification or meet locally in verified safe exchange hubs.
            </p>
          </div>
        </div>
      </div>

      {/* For Sellers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Tag className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">The Seller Experience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">List in Minutes</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload photos, select condition, set your price and negotiable preference. 100% free with no hidden listing fees.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Review Serious Inquiries</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Filter out low-ballers with automated minimum threshold checks. Accept, decline, or counter with one click.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant Settlement</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pack your item for scheduled courier pickup. Receive funds directly to your UPI VPA or bank account upon delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Seller Verification System Explanation */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-blue-400">
          <FileCheck2 className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Authentication Protocol</span>
        </div>
        <h3 className="text-xl font-bold">Seller Verification Badge (Demo Simulation)</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Sellers with the blue checkmark badge have submitted government ID (Aadhaar or PAN) and verified contact credentials. In this frontend demo environment, you can test the entire verification workflow in the Seller Dashboard and simulate admin approvals!
        </p>
        <div className="pt-2">
          <Link
            to="/seller/verification"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors"
          >
            Explore Seller Verification Workflow
          </Link>
        </div>
      </div>
    </div>
  );
};
