import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface OfferModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { makeOffer } = useAppStore();

  const [customPrice, setCustomPrice] = useState<number>(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Set default initial offer when product opens
  React.useEffect(() => {
    if (product) {
      // Suggest 10% lower price by default
      const suggested = Math.round(product.price * 0.9);
      setCustomPrice(suggested);
      setError('');
      setNote('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const discountPercent = Math.round(((product.price - customPrice) / product.price) * 100);

  const handleQuickPercent = (percent: number) => {
    const calculated = Math.round(product.price * (1 - percent / 100));
    setCustomPrice(calculated);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrice || customPrice <= 0) {
      setError('Please specify a valid offer price');
      return;
    }
    if (customPrice >= product.price) {
      setError('Offer price should be lower than listing price. To buy at listing price, use Buy Now.');
      return;
    }
    if (customPrice < product.price * 0.4) {
      setError('Offers below 40% of asking price are not allowed to protect sellers.');
      return;
    }

    try {
      const offer = makeOffer(product.id, customPrice, note);
      onClose();
      // Redirect to conversation with active offer card
      navigate(`/customer/messages?offerId=${offer.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit offer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Make an Offer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct price negotiation with {product.sellerName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Snippet */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <img
              src={product.coverImage || product.images[0]}
              alt={product.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{product.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Condition: <span className="font-medium text-slate-700 dark:text-slate-300">{product.condition}</span>
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                Listing Price: ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Quick buttons */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Quick Offer Suggestions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((pct) => {
                  const val = Math.round(product.price * (1 - pct / 100));
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                        customPrice === val
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">-{pct}%</div>
                      <div className="font-semibold tabular-nums">₹{val.toLocaleString('en-IN')}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Offer Input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Your Proposed Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={customPrice || ''}
                  onChange={(e) => {
                    setCustomPrice(Number(e.target.value));
                    setError('');
                  }}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-bold tabular-nums rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              {customPrice > 0 && customPrice < product.price && (
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>You save ₹{(product.price - customPrice).toLocaleString('en-IN')} ({discountPercent}%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Fair negotiation range</span>
                </div>
              )}
            </div>

            {/* Note to Seller */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Note to Seller (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. Can pick up in Indiranagar tomorrow morning if accepted."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Sellers usually respond within 30 minutes. You can modify or withdraw anytime.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Send Offer
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
