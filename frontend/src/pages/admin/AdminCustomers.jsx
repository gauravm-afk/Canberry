import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { fetchAdminCustomers } from '../../services/adminApi';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.warn('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    return (
      (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout currentPage="Customers">
      <div className="space-y-6 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1C]">
              Registered Customers
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Directory of verified customers registered with Canberry Dairy.
            </p>
          </div>
          <button
            onClick={loadCustomers}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Customers</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-4 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#684017] bg-stone-50/50"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Total: {customers.length} customer{customers.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Delivery Address</th>
                  <th className="px-5 py-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-stone-400">
                      Loading registered customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#684017]/10 text-[#684017] flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                            {cust.fullName ? cust.fullName.charAt(0) : 'C'}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{cust.fullName}</p>
                            <span className="text-[10px] text-stone-400 font-mono">ID: #{cust._id.substring(cust._id.length - 6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-stone-700 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cust.email}</span>
                        </p>
                        <p className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cust.phone}</span>
                        </p>
                      </td>

                      {/* Address */}
                      <td className="px-5 py-4 text-stone-600 max-w-xs">
                        {cust.address ? (
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                            <span>
                              {cust.address}
                              {cust.city ? `, ${cust.city}` : ''}
                              {cust.pincode ? ` - ${cust.pincode}` : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-300 italic text-xs">No address saved</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-stone-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {new Date(cust.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-stone-400">
                      No customers found matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
