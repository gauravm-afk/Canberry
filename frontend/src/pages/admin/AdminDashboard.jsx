import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Plus,
  Layers,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ManageCategoriesModal from '../../components/ManageCategoriesModal';
import { fetchDashboardStats } from '../../services/adminApi';

const statusBadgeStyles = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-purple-50 text-purple-700 border border-purple-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Out for Delivery': 'bg-teal-50 text-teal-700 border border-teal-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEnquiries: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Dashboard stats error:', err);
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-amber-800', bg: 'bg-amber-50', link: '/admin/products' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-800', bg: 'bg-blue-50', link: '/admin/orders' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-indigo-800', bg: 'bg-indigo-50', link: '/admin/customers' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/orders' },
    { label: 'Completed Orders', value: stats.completedOrders, icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50', link: '/admin/orders' },
    { label: 'Bulk Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'text-purple-700', bg: 'bg-purple-50', link: '/admin/enquiries' },
  ];

  return (
    <AdminLayout currentPage="Dashboard">
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#684017] to-[#8B5A2B] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-amber-200 text-xs font-semibold uppercase tracking-wider block mb-1">
              Store Management
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Welcome to Canberi Admin
            </h2>
            <p className="text-white/80 text-sm mt-1 max-w-xl">
              Monitor live sales, update product inventory, track customer orders, and manage bulk enquiries in real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-medium text-xs sm:text-sm transition-colors shadow-sm font-sans flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-200" />
              <span>Manage Categories</span>
            </button>
            <Link
              to="/admin/products"
              className="px-4 py-2.5 bg-white text-[#684017] rounded-xl font-medium text-xs sm:text-sm hover:bg-amber-50 transition-colors shadow-sm font-sans flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#684017]" />
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* 6 Overview Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white border border-[#EFE5D7] rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#684017] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1C1C]">
                    {loading ? '...' : card.value}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    {card.label}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EFE5D7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#684017]" />
              <h3 className="font-serif font-bold text-lg text-[#1C1C1C]">
                Recent Customer Orders
              </h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#684017] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-stone-400 text-sm">
                Loading orders...
              </div>
            ) : stats.recentOrders && stats.recentOrders.length > 0 ? (
              <table className="w-full text-left font-sans text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Total Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-stone-700">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-900">{order.customerName}</p>
                        <p className="text-xs text-stone-400">{order.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-stone-900">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusBadgeStyles[order.orderStatus] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/admin/orders"
                          className="px-3 py-1.5 bg-stone-100 hover:bg-[#684017] hover:text-white text-stone-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-stone-400 text-sm">
                No orders placed yet. Customer orders will appear here automatically.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Manage Categories Modal */}
      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </AdminLayout>
  );
}
