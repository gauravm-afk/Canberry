import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/adminApi';

export default function AdminLogin() {
  const { admin, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) navigate('/admin/dashboard', { replace: true });
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      loginAdmin(data.admin, data.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left brand panel */}
        <div
          className="md:w-5/12 p-10 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #684017 0%, #8B5A2B 60%, #A67C52 100%)' }}
        >
          <div>
            {/* Logo mark */}
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6">
              <span className="text-white font-bold text-2xl font-serif">C</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-serif leading-tight mb-2">
              Canberry
            </h1>
            <p className="text-amber-200/80 text-sm font-medium tracking-wide uppercase mb-6">
              Admin Portal
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              Manage your dairy e-commerce store — products, orders, enquiries, and customers all in one place.
            </p>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-2 gap-3">
              {['Products', 'Orders', 'Enquiries', 'Customers'].map((item) => (
                <div key={item} className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 text-xs text-white/80 font-medium text-center">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="md:w-7/12 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-1">Welcome back</h2>
            <p className="text-stone-500 text-sm">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Username or Email Address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin or admin@canberry.com"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-[#1C1C1C] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#684017]/30 focus:border-[#684017] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#684017] hover:bg-[#4f2f0f] text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-[#684017] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to main site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
