import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import QuickSearchModal from './QuickSearchModal';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Customers', path: '/admin/customers', icon: Users },
];

export default function AdminLayout({ children, currentPage }) {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFF9EF] font-sans overflow-hidden">
      {/* Landing Navbar */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Mobile Admin Navigation Bar (horizontally scrollable pills on mobile) */}
      <div 
        className="md:hidden bg-white border-b border-[#EFE5D7] px-3 py-2.5 overflow-x-auto flex items-center gap-2 flex-shrink-0 shadow-xs"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path || currentPage === label;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                isActive
                  ? 'bg-[#684017] text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Icon size={13} className="flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-red-600 bg-red-50 hover:bg-red-100 whitespace-nowrap transition-colors flex-shrink-0"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </div>

      {/* Admin body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile, visible on md and up) */}
        <aside className="hidden md:flex w-60 flex-shrink-0 bg-white border-r border-[#EFE5D7] flex-col overflow-y-auto">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-[#EFE5D7]">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#684017] flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <div>
                <p className="text-sm font-bold text-[#1C1C1C] font-serif leading-tight">Canberry</p>
                <p className="text-xs text-stone-400 leading-tight">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path || currentPage === label;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#684017] text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Divider + Logout */}
          <div className="px-3 py-4 border-t border-[#EFE5D7]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 w-full overflow-y-auto">
          {/* Page content */}
          <div className="p-4 sm:p-6 max-w-full">{children}</div>
        </main>
      </div>{/* end flex body */}

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allProducts={[]}
      />
    </div>
  );
}
