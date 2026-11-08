import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, RefreshCw, HeartHandshake, Leaf } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Footer: React.FC = () => {
  const { resetAllDemoData } = useAppStore();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Sellers</h4>
              <p className="text-xs text-slate-400 mt-1">
                Aadhaar and PAN authenticated seller profiles with verified ratings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Price Offers</h4>
              <p className="text-xs text-slate-400 mt-1">
                Transparent negotiations with counteroffers and in-app agreement lock.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Safe Handover</h4>
              <p className="text-xs text-slate-400 mt-1">
                Verified doorstep delivery with tracking or secure local meetup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Circular Economy</h4>
              <p className="text-xs text-slate-400 mt-1">
                Extending product lifespans and reducing electronic and material waste.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              ReSell is India’s premier second-hand commerce ecosystem. Giving premium electronics, furniture, designer fashion, and audio equipment a deserving second life.
            </p>
            <div className="text-xs text-slate-500">
              <span>Bengaluru · Mumbai · Delhi NCR · Hyderabad · Pune</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore?cat=Smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/explore?cat=Laptops+%26+Computers" className="hover:text-white transition-colors">Laptops & PCs</Link></li>
              <li><Link to="/explore?cat=Electronics" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/explore?cat=Furniture" className="hover:text-white transition-colors">Ergonomic Furniture</Link></li>
              <li><Link to="/explore?cat=DSLR+%26+Photography" className="hover:text-white transition-colors">Cameras & Optics</Link></li>
              <li><Link to="/explore?cat=Collectibles+%26+Watches" className="hover:text-white transition-colors">Luxury Watches</Link></li>
            </ul>
          </div>

          {/* Seller & Platform */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Selling</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/seller/add-product" className="hover:text-white transition-colors">List an Item</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/seller/verification" className="hover:text-white transition-colors">Get Verified Badge</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Seller Protection</Link></li>
              <li><Link to="/seller/earnings" className="hover:text-white transition-colors">Pricing & Payouts</Link></li>
            </ul>
          </div>

          {/* Super Admin & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Administration</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Super Admin Portal</Link></li>
              <li><Link to="/admin/verifications" className="hover:text-white transition-colors">Verification Queue</Link></li>
              <li><Link to="/admin/reports" className="hover:text-white transition-colors">Content Moderation</Link></li>
              <li>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all demo state to fresh mock data?')) {
                      resetAllDemoData();
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 text-left transition-colors"
                >
                  Reset Demo Data
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ReSell Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/how-it-works" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/how-it-works" className="hover:text-slate-400 transition-colors">Safety Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
