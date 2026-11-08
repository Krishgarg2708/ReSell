import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useAppStore();
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = subtotal > 4000 || subtotal === 0 ? 0 : 149;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo('WELCOME10 (10% Off)');
      setPromoCode('');
    } else if (code === 'RESELL500') {
      const discount = Math.min(500, subtotal);
      setDiscountAmount(discount);
      setAppliedPromo('RESELL500 (₹500 Off)');
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon. Try "WELCOME10" or "RESELL500"');
    }
  };

  const handleProceed = () => {
    onClose();
    navigate('/checkout', { state: { discount: discountAmount, promoCode: appliedPromo } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Shopping Cart ({cart.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Your cart is empty</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Discover quality pre-owned verified listings from certified sellers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/explore');
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              <>
                {/* Unique listing notice */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>
                    Each pre-owned item is a unique single listing. Items are reserved exclusively for you during active checkout.
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <img
                        src={item.coverImage || item.images[0]}
                        alt={item.title}
                        className="w-18 h-18 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {item.condition} · {item.category}
                        </span>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Seller: {item.sellerName}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon code (e.g. WELCOME10)"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-500 mt-1">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      Applied: {appliedPromo} (-₹{discountAmount.toLocaleString('en-IN')})
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="tabular-nums font-medium text-slate-900 dark:text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount</span>
                  <span className="tabular-nums text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
