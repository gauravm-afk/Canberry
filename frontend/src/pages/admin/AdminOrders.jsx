import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  X,
  CreditCard,
  MapPin,
  Calendar,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import {
  fetchAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../../services/adminApi';

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const statusBadgeStyles = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-purple-50 text-purple-700 border border-purple-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Out for Delivery': 'bg-teal-50 text-teal-700 border border-teal-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const paymentBadgeStyles = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Failed: 'bg-red-50 text-red-700 border border-red-200',
  Refunded: 'bg-stone-100 text-stone-700 border border-stone-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrders();
      setOrders(data || []);
    } catch (err) {
      console.warn('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus || 'Pending');
    setNewPaymentStatus(order.paymentStatus || 'Pending');
    setStatusNote('');
    setMessage('');
    setOrderModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      if (newOrderStatus !== selectedOrder.orderStatus) {
        await updateOrderStatus(selectedOrder._id, newOrderStatus);
      }
      if (newPaymentStatus !== selectedOrder.paymentStatus) {
        await updatePaymentStatus(selectedOrder._id, newPaymentStatus);
      }
      setMessage('Order status updated successfully!');
      loadOrders();
      setTimeout(() => {
        setOrderModalOpen(false);
      }, 1000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Filter logic
  const now = new Date();
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerPhone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order._id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

    let matchesDate = true;
    if (dateFilter !== 'All') {
      const orderDate = new Date(order.createdAt);
      const diffDays = (now - orderDate) / (1000 * 3600 * 24);
      if (dateFilter === 'Today') {
        matchesDate = orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7Days') {
        matchesDate = diffDays <= 7;
      } else if (dateFilter === '30Days') {
        matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  return (
    <AdminLayout currentPage="Orders">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1C]">
              Customer Orders & Sales History
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              Manage fulfillment lifecycle, track customer shipments, and update order statuses.
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 transition-colors shadow-2xs self-start sm:self-auto font-sans"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-center justify-between font-sans">
          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#684017] bg-stone-50/50"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm bg-white text-stone-700 focus:outline-none focus:border-[#684017]"
            >
              <option value="All">All Order Statuses</option>
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm bg-white text-stone-700 focus:outline-none focus:border-[#684017]"
            >
              <option value="All">All Payments</option>
              {PAYMENT_STATUSES.map((ps) => (
                <option key={ps} value={ps}>{ps}</option>
              ))}
            </select>

            {/* Date Preset Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm bg-white text-stone-700 focus:outline-none focus:border-[#684017]"
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="7Days">Last 7 Days</option>
              <option value="30Days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Order ID */}
                      <td className="px-5 py-3.5 font-mono font-medium text-stone-800">
                        #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-stone-900">{ord.customerName}</p>
                        <p className="text-xs text-stone-400">{ord.customerPhone}</p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-stone-500 text-xs">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Items count */}
                      <td className="px-5 py-3.5 text-stone-600 font-medium">
                        {ord.items?.length || 0} product{ord.items?.length !== 1 ? 's' : ''}
                      </td>

                      {/* Total */}
                      <td className="px-5 py-3.5 font-bold text-stone-900">
                        ₹{Number(ord.totalAmount).toFixed(2)}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                            paymentBadgeStyles[ord.paymentStatus] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ord.paymentStatus || 'Pending'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusBadgeStyles[ord.orderStatus] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenOrder(ord)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-[#684017] hover:text-white text-stone-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      No orders found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View & Manage Order Details Modal */}
        {orderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col font-sans border border-stone-200 overflow-hidden">
              
              {/* Modal Header (Fixed at top of modal) */}
              <div className="px-5 sm:px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1C1C]">
                    Order Details #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content (Scrolls independently while box stays completely fixed) */}
              <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto overscroll-contain">
                {message && (
                  <div
                    className={`p-3 rounded-xl text-xs sm:text-sm ${
                      message.startsWith('Error')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Customer Info Card */}
                <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-stone-400 uppercase text-[10px] font-bold block mb-0.5">
                      Customer Details
                    </span>
                    <p className="font-semibold text-stone-900">{selectedOrder.customerName}</p>
                    <p className="text-stone-600">{selectedOrder.customerEmail}</p>
                    <p className="text-stone-600">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase text-[10px] font-bold block mb-0.5">
                      Delivery Address
                    </span>
                    <p className="text-stone-700">
                      {selectedOrder.deliveryAddress || 'Standard delivery address on file'}
                    </p>
                    <span className="text-stone-400 uppercase text-[10px] font-bold block mt-2 mb-0.5">
                      Payment Method
                    </span>
                    <p className="text-stone-700 font-medium">{selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                  </div>
                </div>

                {/* Products Ordered */}
                <div>
                  <h4 className="font-semibold text-sm text-stone-800 mb-2">
                    Products ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-3">
                          {it.productImage && (
                            <img
                              src={it.productImage}
                              alt={it.productName}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-stone-900">{it.productName}</p>
                            {it.selectedSize && (
                              <p className="text-stone-400 text-xs">Size: {it.selectedSize}</p>
                            )}
                            <p className="text-stone-500 text-xs">
                              ₹{Number(it.price).toFixed(2)} × {it.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900">
                          ₹{Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-stone-50 rounded-xl p-4 text-xs sm:text-sm space-y-1.5 font-sans border border-stone-100">
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({selectedOrder.couponCode || 'Promo'})</span>
                      <span>-₹{Number(selectedOrder.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-stone-900 text-sm sm:text-base pt-1">
                    <span>Total Order Amount</span>
                    <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Update Controls */}
                <div className="bg-[#FFF9EF] p-4 rounded-xl border border-[#EFE5D7] space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#684017]">
                    Update Order & Payment Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Order Status
                      </label>
                      <select
                        value={newOrderStatus}
                        onChange={(e) => setNewOrderStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs sm:text-sm bg-white"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Payment Status
                      </label>
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs sm:text-sm bg-white"
                      >
                        {PAYMENT_STATUSES.map((ps) => (
                          <option key={ps} value={ps}>{ps}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="w-full py-2.5 bg-[#684017] hover:bg-[#523211] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Saving Status...' : 'Apply Status Update'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
