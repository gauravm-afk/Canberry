import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Eye,
  Check,
  X,
  Phone,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import {
  fetchAdminEnquiries,
  updateEnquiryStatus,
} from '../../services/adminApi';

const ENQUIRY_STATUSES = ['New', 'Contacted', 'In Progress', 'Completed', 'Rejected'];

const statusBadgeStyles = {
  New: 'bg-amber-50 text-amber-700 border border-amber-200',
  Contacted: 'bg-blue-50 text-blue-700 border border-blue-200',
  'In Progress': 'bg-purple-50 text-purple-700 border border-purple-200',
  Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border border-red-200',
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminEnquiries();
      setEnquiries(data || []);
    } catch (err) {
      console.warn('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenView = (enq) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status || 'New');
    setMessage('');
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnquiry) return;
    try {
      setSaving(true);
      await updateEnquiryStatus(selectedEnquiry._id, newStatus);
      setMessage('Status updated successfully!');
      loadEnquiries();
      setTimeout(() => setModalOpen(false), 900);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      (enq.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enq.phoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enq.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout currentPage="Enquiries">
      <div className="space-y-6 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1C]">
              Bulk Order & Wholesale Enquiries
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Manage commercial customer requests submitted via the website's bulk enquiry form.
            </p>
          </div>
          <button
            onClick={loadEnquiries}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Enquiries</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#684017] bg-stone-50/50"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm bg-white text-stone-700 focus:outline-none focus:border-[#684017]"
            >
              <option value="All">All Statuses</option>
              {ENQUIRY_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5">Customer Name</th>
                  <th className="px-5 py-3.5">Phone Number</th>
                  <th className="px-5 py-3.5">Requested Items</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      Loading enquiries...
                    </td>
                  </tr>
                ) : filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-stone-900">
                        {enq.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={`tel:${enq.phoneNumber}`}
                          className="text-[#684017] hover:underline flex items-center gap-1 font-mono text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{enq.phoneNumber}</span>
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {enq.items?.map((it, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-xs"
                            >
                              {it.category} ({it.quantity})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-xs">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            statusBadgeStyles[enq.status] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {enq.status || 'New'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenView(enq)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-[#684017] hover:text-white text-stone-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      No bulk order enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Enquiry Details Modal */}
        {modalOpen && selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
              <div className="px-5 sm:px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1C1C]">
                    Bulk Order Enquiry Details
                  </h3>
                  <p className="text-xs text-stone-400">
                    Received on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain">
                {message && (
                  <div className="p-3 rounded-xl text-xs sm:text-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {message}
                  </div>
                )}

                {/* Customer Info */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1">
                  <p className="text-xs text-stone-400 uppercase font-semibold">Contact Person</p>
                  <p className="font-semibold text-stone-900 text-base">{selectedEnquiry.name}</p>
                  <p className="text-stone-600 text-sm">
                    Phone: <a href={`tel:${selectedEnquiry.phoneNumber}`} className="text-[#684017] underline font-mono">{selectedEnquiry.phoneNumber}</a>
                  </p>
                  {selectedEnquiry.email && (
                    <p className="text-stone-600 text-sm">
                      Email: <a href={`mailto:${selectedEnquiry.email}`} className="text-[#684017] underline">{selectedEnquiry.email}</a>
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-stone-400 uppercase font-semibold mb-2">Requested Product Categories</p>
                  <div className="space-y-1.5 border border-stone-200 rounded-xl p-3">
                    {selectedEnquiry.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                        <span className="font-medium text-stone-800">{it.category}</span>
                        <span className="font-mono text-stone-600 font-semibold">{it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                {selectedEnquiry.message && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-semibold mb-1">Customer Note / Message</p>
                    <p className="text-sm bg-stone-50 p-3 rounded-xl text-stone-700 italic border border-stone-100">
                      "{selectedEnquiry.message}"
                    </p>
                  </div>
                )}

                {/* Status Update */}
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <label className="block text-xs font-semibold text-stone-700 uppercase">
                    Update Enquiry Status
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                    >
                      {ENQUIRY_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={saving}
                      className="px-5 py-2 bg-[#684017] hover:bg-[#523211] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Updating...' : 'Save Status'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
