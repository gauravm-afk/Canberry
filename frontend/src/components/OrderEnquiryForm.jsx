import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, Phone, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitEnquiry, fetchCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CATEGORIES = [
  'Dairy Essentials',
  'Traditional Sweets',
  'Ready Mixes',
  'Pastry Favorites',
  'Ice Cream & Desserts',
  'Refreshing Beverages',
];

const OrderEnquiryForm = () => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    items: [
      { category: '', quantity: '' }
    ],
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // 1. Restore previously entered form information if returning from login
    try {
      const saved = sessionStorage.getItem('canberry_pending_enquiry');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          name: parsed.name || customer?.fullName || '',
          phoneNumber: parsed.phoneNumber || customer?.phone || '',
        }));
        sessionStorage.removeItem('canberry_pending_enquiry');
      } else if (customer) {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || customer.fullName || '',
          phoneNumber: prev.phoneNumber || customer.phone || '',
        }));
      }
    } catch (e) {
      console.warn('Could not restore enquiry:', e);
    }

    // Load available categories dynamically
    fetchCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });

    // 2. Smoothly scroll to enquiry section if returning with hash
    if (window.location.hash === '#enquiry-section') {
      setTimeout(() => {
        const el = document.getElementById('enquiry-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { category: '', quantity: '' }],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Check if customer is logged in; if guest user, preserve entered data and redirect to login
    if (!customer) {
      try {
        sessionStorage.setItem('canberry_pending_enquiry', JSON.stringify(formData));
      } catch (err) {
        console.warn('Could not cache pending enquiry:', err);
      }
      navigate('/login', {
        state: {
          from: '/#enquiry-section',
          message: 'Please log in to your account before submitting an order or enquiry.',
        },
      });
      return;
    }

    // 2. Validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    for (const item of formData.items) {
      if (!item.category) {
        setErrorMsg('Please select a category for each product item.');
        return;
      }
      if (!item.quantity.trim()) {
        setErrorMsg('Please specify the quantity for each product item.');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await submitEnquiry({
        ...formData,
        email: customer.email,
      });
      setSuccessMsg(res.message || 'Enquiry submitted successfully! We will contact you soon.');
      // Reset form
      setFormData({
        name: customer.fullName || '',
        phoneNumber: customer.phone || '',
        items: [{ category: '', quantity: '' }],
        message: '',
      });
      navigate('/order-success');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enquiry-section" className="w-full bg-[#FFF98D] py-16 md:py-24 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Contact & Information */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[44px] text-[#222222] leading-tight">
              Have an Order or Enquiry?
            </h2>

            <p className="content-description text-[#4A4A4A] max-w-md">
              Get in touch with us for product enquiries, bulk orders, and business partnerships. We're here to help you find the right products for your needs.
            </p>

            <div className="pt-4 space-y-5 text-[#2A2A2A]">
              {/* Email */}
              <div className="flex items-start space-x-3.5 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 text-[#4A2B0C] mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <a href="mailto:example@teamwebflow.com" className="text-sm sm:text-base font-sans hover:underline text-[#222222]">
                    example@teamwebflow.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 text-[#4A2B0C] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-sans text-[#222222]">
                    4074 Ebert Summit Suite 375<br />Lake Leonardchester
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 text-[#4A2B0C] mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <a href="tel:+441236547890" className="text-sm sm:text-base font-sans hover:underline text-[#222222]">
                    +44 123 654 7890
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 sm:p-8 md:p-10">
              
              {/* Feedback Alerts */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <p className="text-sm font-sans font-medium">{successMsg}</p>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <p className="text-sm font-sans font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Lorem Ipsum"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] text-sm font-sans transition-all"
                    required
                  />
                </div>

                {/* Phone Number Input */}
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] text-sm font-sans transition-all"
                    required
                  />
                </div>

                {/* Product Items: Category + Quantity + Dynamic Add */}
                <div className="space-y-3 pt-1">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      {/* Category Dropdown */}
                      <div className="flex-1">
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] text-sm font-sans transition-all"
                          required
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity Input */}
                      <div className="w-1/3">
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          placeholder="Quantity"
                          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] text-sm font-sans transition-all"
                          required
                        />
                      </div>

                      {/* Remove item button if more than 1 row */}
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-2 text-stone-400 hover:text-rose-500 rounded-lg transition-colors"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add more products trigger on the right */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="text-xs text-[#2A2A2A] hover:text-[#684017] font-sans font-medium flex items-center space-x-1 py-1 transition-colors group"
                    >
                      <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Add more product's</span>
                    </button>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="pt-1">
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] text-sm font-sans resize-none transition-all"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1C1C1C] hover:bg-[#383838] text-white font-sans font-medium text-sm px-8 py-3.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OrderEnquiryForm;
