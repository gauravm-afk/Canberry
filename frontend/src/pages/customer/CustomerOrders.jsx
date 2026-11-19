import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, MapPin, Package, ArrowRight, X } from 'lucide-react';
import CustomerLayout from '../../components/CustomerLayout';
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

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.warn('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout activePage="My Orders" title="Order History">
      <div className="space-y-6 font-sans">
        
        {/* Header */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1C]">
              My Orders & Purchase History
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Review details of your past and active orders.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#684017] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs self-start sm:self-auto"
          >
            Order More Treats
          </Link>
        </div>

        {/* Orders List / Table */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-stone-400 text-sm">
                Loading orders...
              </div>
            ) : orders.length > 0 ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Items</th>
                    <th className="px-6 py-3.5">Total Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono font-medium text-stone-800">
                        #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="space-y-0.5">
                          {ord.items?.map((it, idx) => (
                            <p key={idx} className="font-semibold text-stone-900 truncate">
                              {it.productName} <span className="font-normal text-stone-400">× {it.quantity}</span>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-bold text-stone-900">
                        ₹{Number(ord.totalAmount).toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            statusBadgeStyles[ord.orderStatus] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Details
                          </button>
                          <Link
                            to={`/customer/track/${ord._id}`}
                            className="px-3 py-1.5 bg-[#FFF9EF] text-[#684017] hover:bg-[#684017] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Track
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-16 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-stone-800 mb-1">
                  No orders placed yet
                </h4>
                <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6">
                  Ready to taste pure dairy perfection? Check out our freshest arrivals.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] hover:bg-[#684017] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-stone-200 font-sans">
              <div className="px-5 sm:px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1C1C]">
                    Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain">
                {/* Status & Delivery */}
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl">
                  <div>
                    <span className="text-xs text-stone-400 block font-semibold">Status</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-0.5 ${
                        statusBadgeStyles[selectedOrder.orderStatus] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <Link
                    to={`/customer/track/${selectedOrder._id}`}
                    className="text-xs font-bold text-[#684017] hover:underline flex items-center gap-1"
                  >
                    <span>View Tracking Stepper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Purchased Items
                  </h4>
                  <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs sm:text-sm">
                        <div>
                          <p className="font-semibold text-stone-900">{it.productName}</p>
                          <p className="text-stone-500 text-xs">
                            ₹{Number(it.price).toFixed(2)} × {it.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-stone-900">
                          ₹{Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-stone-50 p-3.5 rounded-xl text-xs sm:text-sm space-y-1">
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{Number(selectedOrder.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-stone-200">
                    <span>Total Paid</span>
                    <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
                    <span className="font-semibold text-stone-700 block mb-0.5">Shipping Address:</span>
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </CustomerLayout>
  );
}
