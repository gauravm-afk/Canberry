import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import QuickSearchModal from './QuickSearchModal';

const navItems = [
  { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/customer/profile', icon: User },
  { label: 'My Orders', path: '/customer/orders', icon: ShoppingBag },
  { label: 'Order Tracking', path: '/customer/track', icon: MapPin },
];

export default function CustomerLayout({ children, activePage, title }) {
  const { customer, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logoutCustomer();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9EF] antialiased">
      {/* 1. Header */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1328px] mx-auto px-4 sm:px-6 lg:px-[80px] py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-sans text-stone-500 mb-6 select-none">
          <Link to="/" className="hover:text-[#684017] transition-colors">Home</Link>
          <span className="text-stone-300 font-bold">&gt;</span>
          <Link to="/dashboard" className="hover:text-[#684017] transition-colors">My Account</Link>
          {title && (
            <>
              <span className="text-stone-300 font-bold">&gt;</span>
              <span className="text-[#1C1C1C] font-semibold">{title}</span>
            </>
          )}
        </nav>

        {/* 2-Column Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Customer Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[#EFE5D7] rounded-2xl p-5 shadow-xs lg:sticky lg:top-28 font-sans">
              
              {/* Customer Card Header */}
              <div className="pb-4 border-b border-stone-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#684017] text-[#FFF98D] flex items-center justify-center font-serif font-bold text-lg uppercase flex-shrink-0">
                  {customer.fullName ? customer.fullName.charAt(0) : 'C'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900 truncate text-sm">
                    {customer.fullName}
                  </p>
                  <p className="text-xs text-stone-400 truncate">
                    {customer.email}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="py-3 space-y-1">
                {navItems.map(({ label, path, icon: Icon }) => {
                  const isActive = location.pathname === path || activePage === label;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#FFF9EF] text-[#684017] font-bold shadow-2xs'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#684017]' : 'text-stone-300'}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="pt-3 border-t border-stone-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          </aside>

          {/* Right Main Content Area */}
          <div className="flex-1 w-full">
            {children}
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allProducts={[]}
      />
    </div>
  );
}
