import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Package, 
  Users, 
  Store, 
  AlertTriangle,
  RotateCcw,
  Eye,
  Check
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    sellers, 
    orders, 
    verifications, 
    updateVerificationStatus, 
    reports, 
    resolveReport, 
    deleteProduct,
    resetAllDemoData 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'listings' | 'sellers'>('verifications');

  const verifiedSellersCount = sellers.filter((s) => s.isVerified).length;
  const activeListingsCount = products.filter((p) => p.status === 'Active').length;
  const totalVolume = orders.reduce((sum, o) => sum + o.price, 0);

  const pendingVerifications = verifications.filter((v) => v.status === 'Pending');
  const pendingReports = reports.filter((r) => r.status === 'Pending Review');

  const handleApproveVerification = (id: string) => {
    updateVerificationStatus(id, 'Approved', 'Approved in Admin Moderation Console.');
  };

  const handleRejectVerification = (id: string) => {
    updateVerificationStatus(id, 'Rejected', 'Rejected due to insufficient documentation.');
  };

  const handleResolveReport = (id: string, action: 'dismiss' | 'remove', targetId?: string) => {
    resolveReport(id, action);
    if (action === 'remove' && targetId) {
      deleteProduct(targetId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ReSell Super Admin Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platform governance, seller authentication approvals, content moderation, and fraud prevention.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo state to fresh mock data?')) {
              resetAllDemoData();
            }
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Verified Sellers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {verifiedSellersCount} / {sellers.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {pendingVerifications.length} pending review
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Listings</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {activeListingsCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Across 12 categories
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Flagged Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {pendingReports.length}
          </div>
          <div className="text-[11px] text-rose-600 font-medium">
            Requires moderation
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Platform Volume (GMV)</span>
            <span className="text-xs font-bold text-slate-400">INR</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {orders.length} completed orders
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[
          { key: 'verifications', label: `Seller Verifications (${pendingVerifications.length})` },
          { key: 'reports', label: `Flagged Reports (${pendingReports.length})` },
          { key: 'listings', label: `All Listings (${products.length})` },
          { key: 'sellers', label: `Registered Sellers (${sellers.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Seller Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Seller Identity Authentication Queue
              </h3>
              <p className="text-xs text-slate-400">Review submitted government documents and grant Verified Badges</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {verifications.map((req) => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {req.sellerName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : req.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span>{req.documentType}: </span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{req.documentNumber}</span>
                    <span> · Phone: {req.phone}</span>
                  </div>
                  {req.notes && (
                    <p className="text-[11px] text-slate-400 italic">Notes: {req.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveVerification(req.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Badge
                      </button>
                      <button
                        onClick={() => handleRejectVerification(req.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">Processed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Flagged Content & Reports */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Reported Listings & Users
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((rep) => (
              <div key={rep.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Target: {rep.targetTitle}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {rep.targetType}
                    </span>
                    <span className="text-[10px] text-slate-400">{rep.status}</span>
                  </div>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    Reason: {rep.reason}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    "{rep.details}" — Reported by {rep.reporterName}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === 'Pending Review' ? (
                    <>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'remove', rep.targetId)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                      >
                        Remove Listing
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Dismiss Flag
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">{rep.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: All Listings Overview */}
      {activeTab === 'listings' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Marketplace Catalog Overview ({products.length} Items)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.slice(0, 15).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{p.title}</td>
                    <td className="p-3 text-slate-500">{p.category}</td>
                    <td className="p-3 font-bold tabular-nums">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{p.sellerName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <a href={`/products/${p.id}`} className="text-blue-600 hover:underline">
                        Inspect
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Registered Sellers */}
      {activeTab === 'sellers' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Registered Seller Registry ({sellers.length} Curators)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellers.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">{s.name}</span>
                    {s.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                  <span className="text-slate-400 block">{s.city} · {s.rating}★ ({s.completedSales} sales)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
