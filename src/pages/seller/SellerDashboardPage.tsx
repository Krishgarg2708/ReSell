import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  PlusCircle, 
  DollarSign, 
  Star, 
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';

export const SellerDashboardPage: React.FC = () => {
  const { products, orders, conversations, sellers, currentRole } = useAppStore();

  const sellerProducts = products.filter((p) => p.sellerId === 'seller-demo');
  const activeCount = sellerProducts.filter((p) => p.status === 'Active').length;
  const soldCount = sellerProducts.filter((p) => p.status === 'Sold').length;

  const totalSalesAmount = orders
    .filter((o) => o.sellerId === 'seller-demo' && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.price, 0);

  const demoSeller = sellers.find((s) => s.id === 'seller-demo');

  // Chart Mock Datasets
  const monthlyRevenueData = [
    { month: 'Jun', sales: 48000, orders: 3 },
    { month: 'Jul', sales: 72000, orders: 5 },
    { month: 'Aug', sales: 61000, orders: 4 },
    { month: 'Sep', sales: 94000, orders: 7 },
    { month: 'Oct', sales: 125000, orders: 8 },
    { month: 'Nov', sales: 115000, orders: 6 },
  ];

  const categoryPerformanceData = [
    { name: 'Smartphones', value: 14 },
    { name: 'Laptops', value: 8 },
    { name: 'Audio', value: 12 },
    { name: 'Cameras', value: 6 },
    { name: 'Watches', value: 5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Seller Hub: {demoSeller?.name || 'Arjun Mehta'}
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Seller
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your pre-owned inventory, incoming buyer offers, fulfillment, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seller/verification"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Verification Status
          </Link>
          <Link
            to="/seller/add-product"
            className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Listing
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{(totalSalesAmount || 184500).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            +18% from last month
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Listings</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {activeCount || 5}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {soldCount || 3} items sold
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Buyer Inquiries</span>
            <MessageSquare className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {conversations.length}
          </div>
          <div className="text-[11px] text-teal-600 font-medium">
            &lt; 10 min response avg
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Seller Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {demoSeller?.rating || 4.9} / 5.0
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Based on {demoSeller?.reviewCount || 42} verified reviews
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Sales & Revenue (₹)
              </h3>
              <p className="text-xs text-slate-400">Historical performance over 6 months</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown bar chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Category Volume
            </h3>
            <p className="text-xs text-slate-400">Units listed and sold</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [val, 'Listings']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Your Listings Preview Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Your Managed Listings ({sellerProducts.length})
            </h3>
            <p className="text-xs text-slate-400">Products assigned to your demo seller profile</p>
          </div>
          <Link
            to="/seller/listings"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Price</th>
                <th className="p-3">Views</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sellerProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.coverImage || p.images[0]}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="truncate max-w-[220px]">
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{p.category}</span>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{p.condition}</td>
                  <td className="p-3 font-bold tabular-nums text-slate-900 dark:text-white">
                    ₹{p.price.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 tabular-nums text-slate-500">{p.views || 0}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : p.status === 'Sold'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/products/${p.id}`}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
