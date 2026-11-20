import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Check,
  AlertCircle,
  Search,
  ArrowRight,
} from 'lucide-react';
import CustomerLayout from '../../components/CustomerLayout';
import { getOrderById, getMyOrders } from '../../services/customerApi';

const TRACKING_STEPS = [
  { key: 'Pending', label: 'Order Placed', desc: 'We have received your order' },
  { key: 'Confirmed', label: 'Confirmed', desc: 'Order verified by Canberi dairy kitchen' },
  { key: 'Processing', label: 'Processing', desc: 'Fresh churned & packed in chilled condition' },
  { key: 'Shipped', label: 'Shipped', desc: 'Handed over to refrigerated cold-chain courier' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Delivery partner is arriving today' },
  { key: 'Delivered', label: 'Delivered', desc: 'Safely delivered to your doorstep' },
];

export default function CustomerOrderTracking() {
  const { orderId } = useParams();
  const [currentId, setCurrentId] = useState(orderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myOrdersList, setMyOrdersList] = useState([]);

  useEffect(() => {
    // If orderId in params, load it directly
    if (orderId) {
      loadOrder(orderId);
    } else {
      loadMyOrders();
    }
  }, [orderId]);

  const loadMyOrders = async () => {
    try {
      const data = await getMyOrders();
      setMyOrdersList(data || []);
      if (data && data.length > 0) {
        loadOrder(data[0]._id);
      }
    } catch (err) {
      console.warn('Could not load user orders:', err);
    }
  };

  const loadOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await getOrderById(id);
      setOrder(data);
      setCurrentId(id);
    } catch (err) {
      setError(err.message || 'Order not found. Please verify the Order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (currentId.trim()) {
      loadOrder(currentId.trim());
    }
  };

  // Find step index
  const getStepIndex = (status) => {
    const idx = TRACKING_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;
  const isCancelled = order?.orderStatus === 'Cancelled';

  return (
    <CustomerLayout activePage="Order Tracking" title="Live Tracking">
      <div className="space-y-6 font-sans">
        
        {/* Header Search Box */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 shadow-xs">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1C]">
            Track Your Fresh Dairy Delivery
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 mb-4">
            Enter your order reference ID to view real-time cold-chain status.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Paste Order ID (e.g., 6649f...)"
              value={currentId}
              onChange={(e) => setCurrentId(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#684017]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#684017] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {/* Quick Select Buttons from recent orders */}
          {myOrdersList.length > 1 && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">Your recent orders:</span>
              {myOrdersList.slice(0, 4).map((o) => (
                <button
                  key={o._id}
                  onClick={() => loadOrder(o._id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                    order?._id === o._id
                      ? 'bg-[#684017] text-white border-[#684017]'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  #{o._id.substring(o._id.length - 6).toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-[#EFE5D7] rounded-2xl p-12 text-center text-stone-400 text-sm shadow-xs">
            Fetching tracking milestones from the database...
          </div>
        )}

        {order && !loading && (
          <>
            {/* Visual Timeline Card */}
            <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-2">
                <div>
                  <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                    Live Shipment Status
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1C]">
                    Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="self-start sm:self-auto">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    isCancelled ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {isCancelled ? (
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-lg text-red-800">
                    This order has been cancelled
                  </h4>
                  <p className="text-xs text-red-600 mt-1 max-w-sm mx-auto">
                    If this was unexpected, please contact Canberi Customer Support for immediate assistance.
                  </p>
                </div>
              ) : (
                /* 6-Step Stepper Timeline */
                <div className="mt-8">
                  <div className="relative">
                    {/* Stepper Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-2 relative">
                      {TRACKING_STEPS.map((step, idx) => {
                        const isDone = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                            {/* Circle Indicator */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                                isDone
                                  ? 'bg-[#684017] text-white'
                                  : isCurrent
                                  ? 'bg-[#1C1C1C] text-[#FFF98D] ring-4 ring-amber-100'
                                  : 'bg-stone-100 text-stone-400 border border-stone-200'
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                            </div>

                            {/* Label */}
                            <p
                              className={`text-xs font-semibold mt-3 ${
                                isCurrent ? 'text-[#1C1C1C] font-bold text-sm' : isDone ? 'text-stone-800' : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug hidden md:block">
                              {step.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details & Delivery Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Delivery Address & Contact */}
              <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <MapPin className="w-4 h-4 text-[#684017]" />
                  <h4 className="font-serif font-bold text-base text-[#1C1C1C]">
                    Delivery Destination
                  </h4>
                </div>
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-semibold text-stone-900">{order.customerName}</p>
                  <p className="text-stone-600">{order.customerPhone}</p>
                  <p className="text-stone-600">{order.customerEmail}</p>
                  <p className="text-stone-700 pt-2 font-medium">
                    {order.deliveryAddress || 'Standard address on file'}
                  </p>
                </div>
              </div>

              {/* Items in this Order */}
              <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <Package className="w-4 h-4 text-[#684017]" />
                  <h4 className="font-serif font-bold text-base text-[#1C1C1C]">
                    Order Items ({order.items?.length || 0})
                  </h4>
                </div>
                <div className="space-y-2 text-xs sm:text-sm max-h-48 overflow-y-auto">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 border-b border-stone-50 last:border-0">
                      <div>
                        <span className="font-semibold text-stone-800">{it.productName}</span>
                        {it.selectedSize && <span className="text-stone-400 text-xs"> ({it.selectedSize})</span>}
                        <span className="text-stone-500 text-xs block">Qty: {it.quantity}</span>
                      </div>
                      <span className="font-bold text-stone-900">
                        ₹{Number(it.subtotal || it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Amount:</span>
                  <span>₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </CustomerLayout>
  );
}
