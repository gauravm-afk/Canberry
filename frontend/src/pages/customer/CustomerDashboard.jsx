import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle2, ArrowRight, Package } from 'lucide-react';
import CustomerLayout from '../../components/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../services/customerApi';

const statusBadgeStyles = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-purple-50 text-purple-700 border border-purple-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Out for Delivery': 'bg-teal-50 text-teal-700 border border-teal-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

export default function CustomerDashboard() {
  const { customer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.warn('Failed to load my orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <CustomerLayout activePage="My Dashboard" title="Dashboard">
      <div className="space-y-6 font-sans">
        
        {/* Welcome Banner */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 sm:p-8 shadow-xs">
          <span className="text-[#684017] text-xs font-semibold uppercase tracking-wider block mb-1">
            Account Overview
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1C1C1C]">
            Welcome back, {customer?.fullName || 'Customer'}!
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            From your personal dashboard you can easily track your shipments, view purchase history, and update your delivery profile.
          </p>
        </div>

        {/* 3 Metric Cards - arranged in one single row on mobile and desktop */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Total Orders */}
          <div className="bg-white border border-[#EFE5D7] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-50 text-[#684017] flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-2xl font-bold text-[#1C1C1C] leading-none">
                {loading ? '...' : totalOrders}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight mt-1 sm:mt-0.5 truncate sm:whitespace-normal">
                Total Orders
              </p>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white border border-[#EFE5D7] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-2xl font-bold text-[#1C1C1C] leading-none">
                {loading ? '...' : pendingOrders}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight mt-1 sm:mt-0.5 truncate sm:whitespace-normal">
                Active Orders
              </p>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white border border-[#EFE5D7] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-2xl font-bold text-[#1C1C1C] leading-none">
                {loading ? '...' : deliveredOrders}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight mt-1 sm:mt-0.5 truncate sm:whitespace-normal">
                Delivered
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EFE5D7] flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#1C1C1C]">
              Recent Orders
            </h3>
            {orders.length > 0 && (
              <Link
                to="/customer/orders"
                className="text-xs font-semibold text-[#684017] hover:underline flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-stone-400 text-sm">
                Loading your orders...
              </div>
            ) : recentOrders.length > 0 ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Products</th>
                    <th className="px-6 py-3.5">Total Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-stone-800">
                        #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-stone-700">
                        {ord.items?.map((it) => it.productName).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-bold text-stone-900">
                        ₹{Number(ord.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusBadgeStyles[ord.orderStatus] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/customer/track/${ord._id}`}
                          className="px-3 py-1.5 bg-[#FFF9EF] text-[#684017] hover:bg-[#684017] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-14 text-center px-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-7 h-7" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-800 mb-1">
                  You haven't placed any orders yet
                </h4>
                <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto mb-5">
                  Browse our artisanal dairy treats, ice creams, and sweets to place your first order.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] hover:bg-[#684017] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </CustomerLayout>
  );
}
