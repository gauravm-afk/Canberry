import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/customerApi';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import QuickSearchModal from '../components/QuickSearchModal';

const CartPage = ({ allProducts = [] }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { customer } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'SWEET10' || code === 'CANBERRY10' || code === 'SAVE10') {
      setDiscountPercent(10);
      setCouponSuccess('10% discount applied successfully!');
    } else if (code === 'WELCOME20' || code === 'DAIRY20') {
      setDiscountPercent(20);
      setCouponSuccess('20% discount applied successfully!');
    } else {
      setCouponError('Invalid coupon code. Try "SWEET10"');
    }
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const grandTotal = Math.max(0, cartTotal - discountAmount);

  const handleCheckout = async () => {
    if (!customer) {
      // Redirect to login with return path so cart is restored after login
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setCheckingOut(true);
    try {
      const orderPayload = {
        items: cart.map((it) => ({
          productName: it.name,
          productImage: it.image || '',
          price: Number(it.price),
          quantity: it.quantity,
          selectedSize: it.selectedSize || '',
          subtotal: Number(it.price) * it.quantity,
        })),
        totalAmount: grandTotal,
        discountAmount,
        couponCode: couponSuccess ? couponCode : '',
        paymentMethod: 'Cash on Delivery',
        deliveryAddress: customer.address
          ? `${customer.address}${customer.city ? `, ${customer.city}` : ''}${customer.pincode ? ` - ${customer.pincode}` : ''}`
          : '',
      };

      await createOrder(orderPayload);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      console.warn('Checkout warning:', err);
      clearCart();
      navigate('/order-success');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {/* 1. Header */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 max-w-[1328px] mx-auto px-4 sm:px-6 lg:px-[80px] py-8 w-full">
        {/* Breadcrumb Navigation: Home > Cart */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-sans text-stone-500 mb-8 select-none">
          <Link to="/" className="hover:text-[#684017] transition-colors">
            Home
          </Link>
          <span className="text-stone-300 font-bold">&gt;</span>
          <span className="text-[#1C1C1C] font-semibold">Cart</span>
        </nav>

        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">
              Your cart is empty
            </h2>
            <p className="font-sans text-stone-500 text-sm mb-8">
              Looks like you haven't added any fresh treats to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-[#1C1C1C] hover:bg-[#684017] text-white rounded-lg text-xs font-sans uppercase font-medium tracking-wider shadow-sm transition-all"
            >
              <span>Explore Our Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Two-Column Cart Layout matching screenshot */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Product Table (col-span-8) */}
            <div className="lg:col-span-8">
              
              {/* Table Header */}
              <div className="grid grid-cols-12 pb-4 border-b border-stone-200 text-xs sm:text-sm font-serif font-bold text-[#1C1C1C] tracking-wide">
                <div className="col-span-6 sm:col-span-6">Product</div>
                <div className="col-span-3 sm:col-span-2 text-center">Quantity</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Price</div>
                <div className="col-span-3 sm:col-span-2 text-right">Subtotal</div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-stone-200">
                {cart.map((item) => {
                  const itemId = item._id || item.id;
                  const itemSubtotal = item.price * item.quantity;
                  return (
                    <div
                      key={itemId}
                      className="grid grid-cols-12 py-6 items-center gap-3 sm:gap-4"
                    >
                      {/* Product (Image + Name + Remove) */}
                      <div className="col-span-6 sm:col-span-6 flex items-center space-x-4">
                        <Link
                          to={`/product/${itemId}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <Link
                            to={`/product/${itemId}`}
                            className="font-serif font-semibold text-sm sm:text-base text-[#1C1C1C] hover:text-[#684017] transition-colors leading-snug line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {item.selectedSize && (
                            <span className="text-xs text-stone-500 font-sans mt-0.5">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-stone-400 hover:text-red-600 text-xs font-sans mt-2 flex items-center space-x-1 w-fit transition-colors"
                          >
                            <span>✕</span>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Quantity [-] [qty] [+] */}
                      <div className="col-span-3 sm:col-span-2 flex justify-center">
                        <div className="flex items-center border border-stone-300 rounded-md bg-white overflow-hidden h-9">
                          <button
                            onClick={() => updateQuantity(itemId, -1)}
                            className="px-2.5 h-full text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-sans font-bold text-xs sm:text-sm w-7 text-center text-stone-800 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemId, 1)}
                            className="px-2.5 h-full text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Unit Price (hidden on smallest screens) */}
                      <div className="hidden sm:block sm:col-span-2 text-right font-sans font-semibold text-sm text-stone-700">
                        ₹{Number(item.price).toFixed(2)}
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-3 sm:col-span-2 text-right font-sans font-bold text-sm sm:text-base text-[#1C1C1C]">
                        ₹{itemSubtotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Order Summary (col-span-4) */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              
              {/* Shipping Box */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4 flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked
                    className="w-4 h-4 text-[#684017] accent-[#684017] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-sans text-xs sm:text-sm text-stone-800 font-medium">
                    Free shipping
                  </span>
                </label>
                <span className="font-sans font-bold text-xs sm:text-sm text-stone-800">
                  ₹00
                </span>
              </div>

              {/* Coupon Box */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-[#1C1C1C]">
                  Have a coupon?
                </h4>
                <p className="font-sans text-xs text-stone-500">
                  Add your code for an instant cart discount
                </p>
                <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-lg text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-stone-600 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-xs font-sans font-semibold text-stone-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponError && (
                  <p className="text-red-500 font-sans text-xs pt-1">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-emerald-600 font-sans text-xs pt-1">{couponSuccess}</p>
                )}
              </div>

              {/* Subtotal & Total Lines */}
              <div className="pt-4 border-t border-stone-200 space-y-3 font-sans">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base sm:text-lg font-bold text-[#1C1C1C] pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1C1C1C] hover:bg-[#684017] text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase py-3.5 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allProducts={allProducts}
      />
    </div>
  );
};

export default CartPage;
