import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LayoutDashboard, LogIn, ShieldCheck, LogOut, Boxes } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { imageConfig } from '../config/imageConfig';

const Navbar = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { customer, admin, logoutCustomer, logoutAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setAccountDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      className="sticky top-0 z-40 border-b border-[#EFE5D7] transition-all duration-300 shadow-sm"
      style={{ backgroundColor: '#FFF9EF' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on Left */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="/" 
              onClick={handleHomeClick}
              className="flex items-center group py-1"
              aria-label="Canberi Home"
            >
              <img
                src={imageConfig.logo.src}
                alt={imageConfig.logo.alt}
                className="h-14 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: 'multiply' }}
              />
            </a>
          </div>

          {/* Center Navigation Links - Typography: Ancizar Serif, 700, 18px */}
          <nav className="hidden md:flex items-center space-x-10">
            <button
              onClick={handleHomeClick}
              className="nav-menu-text text-[#1C1C1C] hover:text-[#684017] transition-colors relative py-1 group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#684017] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/shop'); }}
              className="nav-menu-text text-[#1C1C1C] hover:text-[#684017] transition-colors relative py-1 group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#684017] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
            <button
              onClick={() => scrollToSection('enquiry-section')}
              className="nav-menu-text text-[#1C1C1C] hover:text-[#684017] transition-colors relative py-1 group"
            >
              Contact Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#684017] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
            <button
              onClick={() => scrollToSection('enquiry-section')}
              className="nav-menu-text text-[#1C1C1C] hover:text-[#684017] transition-colors relative py-1 group"
            >
              Bulk Order
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#684017] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
          </nav>

          {/* Right Action Icons: Search, Cart, Account */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#684017] hover:text-[#4A2B0C] hover:bg-black/5 rounded-full transition-all"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Shopping Cart Icon with Counter Badge (hidden during checkout & after login) */}
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-[#684017] hover:text-[#4A2B0C] hover:bg-black/5 rounded-full transition-all relative"
              aria-label="Open Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {cartCount > 0 && !customer && !admin && location.pathname !== '/cart' && location.pathname !== '/order-success' && (
                <span className="absolute -top-1 -right-1 bg-[#684017] text-[#FFF98D] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FFF9EF] animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen((v) => !v)}
                className="p-1 sm:p-1.5 text-[#684017] hover:text-[#4A2B0C] hover:bg-black/5 rounded-full transition-all relative flex items-center justify-center focus:outline-none"
                aria-label="User Account"
                title={
                  admin
                    ? `Admin (${admin.username || admin.email || 'Admin'})`
                    : customer
                    ? (customer.fullName || 'My Account')
                    : 'Account'
                }
              >
                {admin ? (
                  admin.profileImage || admin.avatar ? (
                    <img
                      src={admin.profileImage || admin.avatar}
                      alt="Admin"
                      className="w-8 h-8 rounded-full object-cover border border-[#684017]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#684017] text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {(admin.username || admin.email || 'A').charAt(0)}
                    </div>
                  )
                ) : customer ? (
                  customer.profileImage || customer.avatar ? (
                    <img
                      src={customer.profileImage || customer.avatar}
                      alt={customer.fullName || 'Customer'}
                      className="w-8 h-8 rounded-full object-cover border border-[#684017]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#684017] text-[#FFF98D] flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {(customer.fullName || customer.name || customer.email || 'C').charAt(0)}
                    </div>
                  )
                ) : (
                  <div className="p-1">
                    <User className="w-5 h-5 stroke-[2]" />
                  </div>
                )}
              </button>

              {/* Role-Specific Dropdown Menu */}
              {accountDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn"
                  style={{ minWidth: '220px' }}
                >
                  {/* ADMIN ROLE */}
                  {admin ? (
                    <div className="p-2">
                      <div className="px-3 py-2 bg-stone-50 rounded-lg mb-1">
                        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#684017]">
                          Admin Panel
                        </p>
                        <p className="text-xs font-sans font-bold text-[#1C1C1C] truncate">
                          {admin.username || 'Admin'}
                        </p>
                        <p className="text-[11px] font-sans text-stone-500 truncate">
                          {admin.email || ''}
                        </p>
                      </div>

                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/admin/dashboard'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">Admin Dashboard</span>
                      </button>

                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/admin/dashboard'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <User className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">Profile</span>
                      </button>

                      <div className="border-t border-stone-100 my-1" />

                      <button
                        onClick={() => { setAccountDropdownOpen(false); logoutAdmin(); navigate('/'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : customer ? (
                    /* CUSTOMER ROLE */
                    <div className="p-2">
                      <div className="px-3 py-2 bg-stone-50 rounded-lg mb-1">
                        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#684017]">
                          Customer
                        </p>
                        <p className="text-xs font-sans font-bold text-[#1C1C1C] truncate">
                          {customer.fullName || 'Valued Customer'}
                        </p>
                        <p className="text-[11px] font-sans text-stone-500 truncate">
                          {customer.email}
                        </p>
                      </div>

                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/dashboard'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">My Dashboard</span>
                      </button>

                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/customer/orders'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">My Orders</span>
                      </button>

                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/customer/bulk-orders'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <Boxes className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">Bulk Orders</span>
                      </button>

                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/customer/profile'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <User className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">My Profile</span>
                      </button>

                      <div className="border-t border-stone-100 my-1" />

                      <button
                        onClick={() => { setAccountDropdownOpen(false); logoutCustomer(); navigate('/'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    /* GUEST ROLE */
                    <div className="p-2 space-y-1">
                      <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-stone-400 px-3 pt-1">
                        Sign In
                      </p>
                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/login'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <LogIn className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">Customer Login</span>
                      </button>
                      <button
                        onClick={() => { setAccountDropdownOpen(false); navigate('/admin/login'); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-sans text-stone-700 hover:bg-[#FFF9EF] hover:text-[#684017] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#684017]" />
                        <span className="font-medium">Admin Login</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#684017] hover:bg-black/5 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t border-[#EFE5D7] shadow-lg animate-fadeIn"
            style={{ backgroundColor: '#FFF9EF' }}
          >
            <div className="flex flex-col space-y-3 px-2">
              <button
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/shop'); }}
                className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg"
              >
                Shop
              </button>
              <button
                onClick={() => scrollToSection('enquiry-section')}
                className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg"
              >
                Contact Us
              </button>
              <button
                onClick={() => scrollToSection('enquiry-section')}
                className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg"
              >
                Bulk Order
              </button>
              
              {/* Role-based mobile menu links */}
              {admin ? (
                <>
                  <div className="border-t border-stone-200/50 mt-1 pt-3 px-3">
                    <p className="text-xs font-bold text-[#684017]">Admin ({admin.username || admin.email})</p>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin/dashboard'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin/products'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin/orders'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin/enquiries'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    Enquiries
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin/customers'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    Customers
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logoutAdmin(); navigate('/'); }}
                    className="nav-menu-text text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : customer ? (
                <>
                  <div className="border-t border-stone-200/50 mt-1 pt-3 px-3">
                    <p className="text-xs font-bold text-[#684017]">Hello, {customer.fullName}</p>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/customer/orders'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/customer/profile'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#1C1C1C] hover:bg-black/5 rounded-lg font-medium"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logoutCustomer(); navigate('/'); }}
                    className="nav-menu-text text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="nav-menu-text text-left px-3 py-2 text-[#684017] hover:bg-black/5 rounded-lg font-bold border-t border-stone-200/50 mt-1 pt-3"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin/login'); }}
                    className="nav-menu-text text-left px-3 py-2 text-stone-500 hover:bg-black/5 rounded-lg"
                  >
                    Admin Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
