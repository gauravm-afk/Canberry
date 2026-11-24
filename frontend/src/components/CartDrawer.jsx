import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#684017]" />
              <h3 className="font-serif font-bold text-xl text-[#222222]">
                Your Cart
              </h3>
              <span className="bg-[#FFF98D] text-[#684017] text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount} items
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-4">
                <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300" />
                <p className="font-serif text-lg text-stone-600">Your cart is currently empty</p>
                <p className="font-sans text-xs max-w-xs text-stone-400">
                  Explore our farm-fresh dairy products, traditional sweets, and ice creams!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1C1C1C] text-white text-xs font-sans font-medium px-5 py-2.5 rounded-lg hover:bg-[#684017] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemId = item.cartItemId || item._id || item.id;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-4 p-3 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-sm text-stone-800 truncate">
                        {item.name}
                      </h4>
                      <p className="font-sans text-xs text-stone-500">
                        ₹{Number(item.price).toFixed(2)} / {item.selectedSize || item.unit || 'unit'}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(itemId, -1)}
                          className="w-6 h-6 rounded bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-sans text-xs font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemId, 1)}
                          className="w-6 h-6 rounded bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex flex-col items-end justify-between space-y-2">
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="font-sans font-bold text-sm text-stone-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-sans text-stone-500">Subtotal</span>
                <span className="font-sans font-bold text-lg text-stone-900">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              <p className="font-sans text-[11px] text-stone-400">
                Taxes and delivery calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={clearCart}
                  className="w-full py-3 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-white text-xs font-sans font-semibold transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-[#684017] hover:bg-[#523211] text-[#FFF98D] text-xs font-sans font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <span>View Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
