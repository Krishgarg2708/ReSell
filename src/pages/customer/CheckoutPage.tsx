import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Truck, 
  Building2, 
  Lock, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/useAppStore';
import { PaymentMethod } from '../../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, placeOrder, currentUser } = useAppStore();

  const stateDiscount = (location.state as any)?.discount || 0;
  const statePromo = (location.state as any)?.promoCode || '';

  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('krish@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  // Form Fields
  const [address, setAddress] = useState({
    fullName: currentUser.name || 'Krish Garg',
    phone: currentUser.phone || '+91 98451 90218',
    addressLine: '#402, Green Glen Layout, Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
  });

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add an available verified item from the marketplace to proceed.</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  // Pre-owned items are bought item-by-item or as cart
  // Primary checkout item:
  const primaryItem = cart[0];
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = deliveryType === 'Pickup' ? 0 : subtotal > 4000 ? 0 : 149;
  const finalDiscount = stateDiscount;
  const totalAmount = Math.max(0, subtotal + deliveryFee - finalDiscount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate safe processing
    setTimeout(() => {
      const order = placeOrder({
        productId: primaryItem.id,
        productTitle: primaryItem.title,
        productImage: primaryItem.coverImage || primaryItem.images[0],
        productCondition: primaryItem.condition,
        sellerId: primaryItem.sellerId,
        sellerName: primaryItem.sellerName,
        buyerId: currentUser.id,
        buyerName: address.fullName,
        price: primaryItem.price,
        deliveryFee,
        discount: finalDiscount,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        deliveryType,
        shippingAddress: address,
        status: 'Order Placed',
        estimatedDelivery: deliveryType === 'Pickup' ? 'Arrange with Seller' : '2-3 Business Days',
      });

      setIsProcessing(false);
      setOrderComplete(order);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
            Payment Verified & Reserved
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Order #{orderComplete.id} Placed!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your payment of ₹{orderComplete.totalAmount.toLocaleString('en-IN')} has been safely placed. The seller has been notified to pack your listing.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Tracking Number:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">{orderComplete.trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Delivery:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{orderComplete.estimatedDelivery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Courier Partner:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{orderComplete.carrierName}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/customer/orders"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Track Order Progress
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Simulated escrow checkout with verified buyer protection and courier tracking.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery or Pickup Toggle */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Fulfillment Preference
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('Delivery')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  deliveryType === 'Delivery'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">Doorstep Courier Delivery</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Delhivery / BlueDart with OTP verification
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('Pickup')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  deliveryType === 'Pickup'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">Direct In-Person Pickup</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Meet in {primaryItem?.sellerCity || 'metro hub'} · Inspect before taking
                </div>
              </button>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              {deliveryType === 'Delivery' ? 'Delivery Address' : 'Buyer Contact Details'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Flat, House no., Building, Street
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Simulated Payment Method
            </span>

            <div className="space-y-2">
              {/* UPI */}
              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      UPI (Google Pay, PhonePe, Paytm, BHIM)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Instant reservation via simulated VPA</span>
                  </div>
                </div>
              </label>

              {paymentMethod === 'UPI' && (
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1.5 text-xs">
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400">Your UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {/* Card */}
              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'Card'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                      Credit / Debit Card Simulation
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Visa, Mastercard, RuPay</span>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pay on Delivery / Meetup
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Inspect product prior to releasing cash</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                Demonstration Simulation Notice: No actual funds or credit card credentials will be charged.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Order Summary ({cart.length} item)
            </h3>

            {/* Item Card */}
            <div className="flex gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img
                src={primaryItem?.coverImage || primaryItem?.images[0]}
                alt={primaryItem?.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {primaryItem?.condition}
                </span>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {primaryItem?.title}
                </h4>
                <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                  ₹{primaryItem?.price.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Seller: {primaryItem?.sellerName}
                </p>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount {statePromo && `(${statePromo})`}</span>
                  <span className="tabular-nums">-₹{finalDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="tabular-nums text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
