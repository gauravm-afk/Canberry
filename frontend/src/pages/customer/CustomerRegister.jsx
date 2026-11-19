import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { registerCustomer as registerCustomerApi } from '../../services/customerApi';
import AnnouncementBar from '../../components/AnnouncementBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) navigate('/dashboard', { replace: true });
  }, [customer, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerCustomerApi({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        password: form.password,
      });

      setSuccess('Account created successfully! Please log in to continue.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9EF]">
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-sans text-stone-500 mb-6 self-start max-w-md w-full mx-auto">
          <Link to="/" className="hover:text-[#684017] transition-colors">Home</Link>
          <span className="text-stone-300 font-bold">&gt;</span>
          <span className="text-[#1C1C1C] font-semibold">Register</span>
        </nav>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-stone-100">
          <h1 className="font-serif font-bold text-2xl text-[#1C1C1C] mb-1">Create Account</h1>
          <p className="font-sans text-sm text-stone-500 mb-6">Join Canberry to order fresh farm dairy treats</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Ramesh Patil"
                required
                className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ramesh@example.com"
                required
                className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 123 MG Road, Apartment 4B"
                className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
              />
            </div>

            {/* City & Pincode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 400001"
                  maxLength={6}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className="w-full border border-stone-300 rounded-lg px-4 py-2.5 pr-11 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-sans text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full border border-stone-300 rounded-lg px-4 py-2.5 pr-11 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 font-sans text-xs rounded-lg px-3.5 py-2.5">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-xs rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C1C1C] hover:bg-[#684017] text-white font-sans font-medium text-sm py-3 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Login link */}
          <p className="font-sans text-sm text-stone-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#684017] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
