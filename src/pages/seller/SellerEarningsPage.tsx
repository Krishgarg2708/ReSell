import React from 'react';
import { 
  Download, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';

export const SellerEarningsPage: React.FC = () => {
  const { orders } = useAppStore();

  const sellerOrders = orders.filter((o) => o.sellerId === 'seller-demo');
  const totalEarned = sellerOrders.reduce((acc, curr) => acc + curr.price, 0) || 165000;
  const avgOrderValue = Math.round(totalEarned / (sellerOrders.length || 1));

  const payoutHistory = [
    { id: 'PAY-8921', date: '04 Nov 2026', amount: 48999, method: 'HDFC Direct UPI', status: 'Settled' },
    { id: 'PAY-8710', date: '28 Oct 2026', amount: 58000, method: 'NEFT Bank Transfer', status: 'Settled' },
    { id: 'PAY-8422', date: '19 Oct 2026', amount: 36000, method: 'HDFC Direct UPI', status: 'Settled' },
    { id: 'PAY-8199', date: '02 Oct 2026', amount: 22000, method: 'HDFC Direct UPI', status: 'Settled' },
  ];

  const earningsChartData = [
    { month: 'Jun', amount: 34000 },
    { month: 'Jul', amount: 52000 },
    { month: 'Aug', amount: 44000 },
    { month: 'Sep', amount: 76000 },
    { month: 'Oct', amount: 98000 },
    { month: 'Nov', amount: 115000 },
  ];

  const handleExportCSV = () => {
    const csvRows = [
      ['Payout ID', 'Date', 'Amount (INR)', 'Payment Channel', 'Settlement Status'],
      ...payoutHistory.map((p) => [p.id, p.date, String(p.amount), p.method, p.status]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ReSell_Payout_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Earnings & Payout Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track settled sales proceeds and export financial tax summaries.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-4 h-4 text-blue-600" />
          Download CSV Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Net Payouts</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{totalEarned.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% disbursed to bank</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Average Selling Price</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Across verified categories</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Upcoming Settlement</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹0
          </div>
          <span className="text-[11px] text-slate-400">All current orders cleared</span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Monthly Payout Disbursals (₹)
        </h3>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Disbursed']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Settlement History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Reference ID</th>
                <th className="p-3">Disbursal Date</th>
                <th className="p-3">Transfer Channel</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payoutHistory.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-medium text-slate-900 dark:text-white">{p.id}</td>
                  <td className="p-3 text-slate-500">{p.date}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.method}</td>
                  <td className="p-3 font-bold tabular-nums text-slate-900 dark:text-white">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {p.status}
                    </span>
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
