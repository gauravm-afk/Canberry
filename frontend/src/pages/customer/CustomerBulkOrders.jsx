import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, ShoppingBag, Eye, X, Phone, Mail, Clock, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import CustomerLayout from '../../components/CustomerLayout';
import { getMyEnquiries } from '../../services/customerApi';

const statusBadgeStyles = {
  New: 'bg-amber-50 text-amber-700 border border-amber-200',
  'In Review': 'bg-blue-50 text-blue-700 border border-blue-200',
  Contacted: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'In Progress': 'bg-purple-50 text-purple-700 border border-purple-200',
  Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
  Rejected: 'bg-red-50 text-red-700 border border-red-200',
};

export default function CustomerBulkOrders() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getMyEnquiries();
      setEnquiries(data || []);
    } catch (err) {
      console.warn('Failed to load my bulk orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEnquiry = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('enquiry-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <CustomerLayout activePage="Bulk Orders" title="Bulk Orders">
      <div className="space-y-6 font-sans">
        
        {/* Header */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1C]">
              My Bulk Orders & Wholesale Enquiries
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Review details and status of your commercial dairy requests and bulk bookings.
            </p>
          </div>
          <button
            onClick={handleNewEnquiry}
            className="px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#684017] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs self-start sm:self-auto flex items-center gap-2 cursor-pointer"
          >
            <Boxes className="w-4 h-4" />
            <span>+ New Bulk Order</span>
          </button>
        </div>

        {/* Navigation Tabs between Regular Orders & Bulk Orders */}
        <div className="flex border-b border-stone-200 gap-6 text-sm font-medium">
          <Link
            to="/customer/orders"
            className="pb-3 text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Regular Orders</span>
          </Link>
          <div className="pb-3 text-[#684017] border-b-2 border-[#684017] font-bold flex items-center gap-2">
            <Boxes className="w-4 h-4" />
            <span>Bulk Orders</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-[#684017]">
              {enquiries.length}
            </span>
          </div>
        </div>

        {/* Bulk Orders Table / List */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-stone-400 text-sm">
                Loading your bulk orders...
              </div>
            ) : enquiries.length > 0 ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-3.5">Enquiry ID</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Requested Categories</th>
                    <th className="px-6 py-3.5">Quantity / Items</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {enquiries.map((enq) => {
                    const status = enq.status || 'New';
                    const idShort = enq._id.substring(enq._id.length - 8).toUpperCase();
                    return (
                      <tr key={enq._id} className="hover:bg-stone-50/60 transition-colors">
                        {/* ID */}
                        <td className="px-6 py-4 font-mono font-medium text-stone-800">
                          #{idShort}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-stone-500 text-xs">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Categories */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {enq.items?.map((it, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[#FFF9EF] border border-[#EFE5D7] text-[#684017] rounded-md text-[11px] font-medium"
                              >
                                {it.category}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-6 py-4 text-stone-700">
                          {enq.items?.map((it, idx) => (
                            <span key={idx} className="block text-xs">
                              {it.quantity}
                            </span>
                          ))}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              statusBadgeStyles[status] || 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9EF] text-[#684017] hover:bg-[#684017] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-16 px-4 text-center">
                <div className="w-16 h-16 bg-amber-50 text-[#684017] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Boxes className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
                  No Bulk Orders Yet
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  Planning an event, catering, or need wholesale supplies of pure dairy treats? Submit a bulk enquiry and our team will get back to you with custom pricing.
                </p>
                <button
                  onClick={handleNewEnquiry}
                  className="px-5 py-2.5 bg-[#684017] hover:bg-[#4A2B0C] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Boxes className="w-4 h-4" />
                  <span>Submit Bulk Order Enquiry</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overscroll-contain animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C1C1C]">
                  Bulk Order #{selectedEnquiry._id.substring(selectedEnquiry._id.length - 8).toUpperCase()}
                </h3>
                <p className="text-xs text-stone-500">
                  Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Current Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    statusBadgeStyles[selectedEnquiry.status || 'New'] || 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {selectedEnquiry.status || 'New'}
                </span>
              </div>

              {/* Items Requested */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Requested Items & Quantities
                </h4>
                <div className="space-y-2">
                  {selectedEnquiry.items?.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FFF9EF] rounded-xl border border-[#EFE5D7] flex items-center justify-between"
                    >
                      <div className="font-semibold text-stone-900">
                        {it.category}
                      </div>
                      <div className="text-xs font-bold text-[#684017] bg-white px-2.5 py-1 rounded-lg border border-[#EFE5D7]">
                        Qty: {it.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Contact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Contact Information
                </h4>
                <div className="p-3.5 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-700">
                  <p><span className="font-semibold">Contact Name:</span> {selectedEnquiry.name}</p>
                  <p><span className="font-semibold">Phone:</span> {selectedEnquiry.phoneNumber}</p>
                  {selectedEnquiry.email && (
                    <p><span className="font-semibold">Email:</span> {selectedEnquiry.email}</p>
                  )}
                </div>
              </div>

              {/* Customer Message / Notes */}
              {selectedEnquiry.message && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Additional Instructions / Message
                  </h4>
                  <div className="p-3.5 bg-stone-50 rounded-xl text-xs text-stone-700 whitespace-pre-line border border-stone-100">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}

              {/* Notice */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2.5 text-xs text-stone-600">
                <AlertCircle className="w-4 h-4 text-[#684017] flex-shrink-0 mt-0.5" />
                <p>
                  Our commercial sales representative will review your requested quantities and contact you at {selectedEnquiry.phoneNumber} with custom pricing and delivery timelines.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
