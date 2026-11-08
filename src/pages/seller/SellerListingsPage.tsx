import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  PlusCircle, 
  Trash2, 
  Eye, 
  PauseCircle, 
  PlayCircle, 
  CheckCircle,
  Tag,
  Search
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SellerListingsPage: React.FC = () => {
  const { products, toggleListingStatus, deleteProduct, updateProduct } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const sellerProducts = products.filter((p) => p.sellerId === 'seller-demo');

  const filtered = sellerProducts.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEditPrice = (id: string, currentPrice: number) => {
    const val = prompt('Enter new asking price in ₹:', String(currentPrice));
    if (val && !isNaN(Number(val)) && Number(val) > 0) {
      updateProduct(id, { price: Number(val) });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Listings ({sellerProducts.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle visibility, update prices, and mark items as sold.
          </p>
        </div>

        <Link
          to="/seller/add-product"
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your listings..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {['all', 'Active', 'Sold', 'Paused'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                filterStatus === st
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Product Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={item.coverImage || item.images[0]}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="truncate max-w-[240px]">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.brand}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.category}</td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{item.condition}</td>
                  <td className="p-3 font-bold tabular-nums text-slate-900 dark:text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'Sold'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/products/${item.id}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View on marketplace"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleEditPrice(item.id, item.price)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Update price"
                      >
                        <Tag className="w-4 h-4" />
                      </button>

                      {item.status === 'Active' ? (
                        <button
                          onClick={() => toggleListingStatus(item.id, 'Paused')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Pause listing"
                        >
                          <PauseCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleListingStatus(item.id, 'Active')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Re-activate listing"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this listing permanently?')) {
                            deleteProduct(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
