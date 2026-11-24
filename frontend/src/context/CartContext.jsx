import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('canberry_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('canberry_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('canberry_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('canberry_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const sizeKey = product.selectedSize || product.unit || '';
      const cartItemId = product.cartItemId || `${product._id || product.id}${sizeKey ? `-${sizeKey}` : ''}`;

      const existingIndex = prev.findIndex(
        (item) => (item.cartItemId || `${item._id || item.id}${item.selectedSize || item.unit ? `-${item.selectedSize || item.unit}` : ''}`) === cartItemId
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, cartItemId, quantity: qty }];
    });
    showToast(`Added "${product.name}" to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || item._id || item.id) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.cartItemId || item._id || item.id) === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('canberry_cart');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter((item) => item !== id);
      } else {
        showToast(`Added "${product.name}" to wishlist!`);
        return [...prev, id];
      }
    });
  };

  const isWishlisted = (id) => wishlist.includes(id);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        cartCount,
        cartTotal,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
