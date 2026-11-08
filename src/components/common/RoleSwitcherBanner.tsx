import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Store, ShieldAlert, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RoleSwitcherBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setCurrentRole, resetAllDemoData } = useAppStore();

  const handleRoleChange = (newRole: 'customer' | 'seller' | 'admin') => {
    setCurrentRole(newRole);
    if (newRole === 'customer') {
      if (location.pathname.startsWith('/seller') || location.pathname.startsWith('/admin')) {
        navigate('/');
      }
    } else if (newRole === 'seller') {
      navigate('/seller/dashboard');
    } else if (newRole === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (products, orders, chats, verifications) back to seed state?')) {
      resetAllDemoData();
      navigate('/');
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 py-1.5 flex items-center justify-between z-40 select-none">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-slate-400 font-medium hidden sm:inline whitespace-nowrap">
          Interactive Demo Role:
        </span>
        <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
          <button
            onClick={() => handleRoleChange('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-colors whitespace-nowrap ${
              currentRole === 'customer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Customer
          </button>
          <button
            onClick={() => handleRoleChange('seller')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-colors whitespace-nowrap ${
              currentRole === 'seller'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Seller Dashboard
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-colors whitespace-nowrap ${
              currentRole === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Super Admin
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset sample products, orders, and messages"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden md:inline">Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
