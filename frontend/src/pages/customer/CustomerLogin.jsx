import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginCustomer as loginCustomerApi } from '../../services/customerApi';
import AnnouncementBar from '../../components/AnnouncementBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, loginCustomer } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine where to redirect after login (supports state.from or ?redirect= query param)
  const from =
    location.state?.from ||
    new URLSearchParams(location.search).get('redirect') ||
    '/dashboard';

  const infoNotice =
    location.state?.message ||
    new URLSearchParams(location.search).get('message');

  useEffect(() => {
    if (customer) navigate(from, { replace: true });
  }, [customer, navigate, from]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const json = await loginCustomerApi(form.email, form.password);
      loginCustomer(json.customer || json.data, json.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
          <span className="text-[#1C1C1C] font-semibold">Login</span>
        </nav>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-stone-100">
          <h1 className="font-serif font-bold text-2xl text-[#1C1C1C] mb-1">Welcome Back</h1>
          <p className="font-sans text-sm text-stone-500 mb-6">Sign in to your Canberi account</p>

          {/* Notice for required login actions */}
          {infoNotice && (
            <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-900 font-sans text-xs sm:text-sm rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-[#684017] font-bold text-base leading-none">ⓘ</span>
              <p className="font-medium text-xs sm:text-sm">{infoNotice}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-sans text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-stone-300 rounded-lg px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-[#684017] bg-white transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-sans text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C1C1C] hover:bg-[#684017] text-white font-sans font-medium text-sm py-3 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <p className="font-sans text-sm text-stone-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#684017] hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLogin;
