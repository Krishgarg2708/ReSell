import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  FileText, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Order, OrderStatus } from '../../types';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, cancelOrder, createOrOpenConversation } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return order.status !== 'Delivered' && order.status !== 'Cancelled';
    }
    if (activeTab === 'delivered') {
      return order.status === 'Delivered';
    }
    if (activeTab === 'cancelled') {
      return order.status === 'Cancelled';
    }
    return true;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'Out for Delivery':
      case 'Order Dispatched':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
      case 'Cancelled':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      default:
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    }
  };

  const handleContactSeller = (order: Order) => {
    const convId = createOrOpenConversation(order.productId, order.sellerId);
    navigate(`/customer/messages?convId=${convId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Purchases & Orders
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track courier shipments, access handover receipts, and communicate directly with sellers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'active', label: 'In Transit / Active' },
          { key: 'delivered', label: 'Delivered' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any orders in this category yet. Discover quality pre-owned goods on the marketplace.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">Order #{order.id}</span>
                  <span className="text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Middle: Image, Title, Price, Delivery details */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-2">
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-24 h-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
                    }}
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {order.productCondition} · Seller: {order.sellerName}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {order.productTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span>·</span>
                    <span>Paid via {order.paymentMethod}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Tracking: <span className="font-mono text-slate-600 dark:text-slate-300">{order.trackingNumber}</span> ({order.carrierName})
                  </p>
                </div>

                <div className="sm:col-span-4 flex flex-col sm:items-end justify-center gap-2 pt-2 sm:pt-0">
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Track Shipment
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleContactSeller(order)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contact Seller
                    </button>
                    <button
                      onClick={() => setReceiptOrder(order)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRACKING TIMELINE MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setTrackingOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Live Shipment Tracker
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Order #{trackingOrder.id} · {trackingOrder.carrierName}
                  </p>
                </div>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Summary Card */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-sm mt-0.5">
                    {trackingOrder.status}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Delivery:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {trackingOrder.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-6 pl-2">
                {trackingOrder.timeline.map((step, idx) => {
                  const isDone = step.completed;
                  const isCur = step.current;

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Vertical connector line */}
                      {idx !== trackingOrder.timeline.length - 1 && (
                        <div
                          className={`absolute left-3 top-6 w-0.5 h-12 -ml-px ${
                            isDone ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      )}

                      {/* Dot icon */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white z-10 ${
                          isCur
                            ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950'
                            : isDone
                            ? 'bg-blue-600'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 -mt-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.status}
                          </h4>
                          <span className="text-[11px] text-slate-400 tabular-nums">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Destination Address */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Delivery Destination
                </span>
                <p>
                  {trackingOrder.shippingAddress.fullName} · {trackingOrder.shippingAddress.addressLine}, {trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} - {trackingOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setReceiptOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Transaction Receipt</h3>
                </div>
                <button
                  onClick={() => setReceiptOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-2 space-y-1">
                <span className="text-xs text-slate-400">Total Paid Amount</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ₹{receiptOrder.totalAmount.toLocaleString('en-IN')}
                </div>
                <span className="inline-block text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Payment Status: {receiptOrder.paymentStatus}
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Invoice ID</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">INV-{receiptOrder.id}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Item</span>
                  <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{receiptOrder.productTitle}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Seller</span>
                  <span className="font-medium text-slate-900 dark:text-white">{receiptOrder.sellerName}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Payment Gateway</span>
                  <span className="font-medium text-slate-900 dark:text-white">{receiptOrder.paymentMethod} Simulated</span>
                </div>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Print / Save PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
