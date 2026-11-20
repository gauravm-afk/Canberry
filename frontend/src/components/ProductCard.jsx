import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product._id || product.id);

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`flex-shrink-0 w-full max-w-[262px] bg-white rounded-xl overflow-hidden flex flex-col gap-2 sm:gap-[12px] group border border-transparent hover:border-stone-200 transition-all duration-300 cursor-pointer ${className}`}
    >
      
      {/* Product Image Container: Responsive aspect ratio */}
      <div className="relative w-full aspect-[262/349] bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=600&auto=format&fit=crop";
          }}
        />

        {/* Discount Badge (Top-Left) */}
        {product.discount && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#00D084] text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
            {product.discount}
          </div>
        )}

        {/* Wishlist Button (Top-Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-red-500 shadow-sm transition-all duration-200 hover:scale-110 z-10"
          aria-label="Add to wishlist"
          title="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              wishlisted ? 'fill-red-500 text-red-500' : 'text-stone-600'
            }`}
          />
        </button>
      </div>

      {/* Product Details Container */}
      <div className="flex flex-col flex-grow justify-between pb-1 px-0.5">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {/* Product Name */}
          <h4 className="product-name-text text-xs sm:text-base text-[#1A1A1A] line-clamp-1 group-hover:text-[#684017] transition-colors font-serif font-semibold">
            {product.name}
          </h4>

          {/* Price & Original Price */}
          <div className="flex items-baseline space-x-1 sm:space-x-2">
            <span className="font-sans font-bold text-xs sm:text-base text-[#111111]">
              ₹{Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-[10px] sm:text-xs text-stone-400 line-through">
                ₹{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Unit / Weight specification */}
          <p className="font-sans text-[10px] sm:text-xs text-stone-500">
            {product.unit || '100 g'}
          </p>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-2 sm:mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-full bg-[#1C1C1C] hover:bg-[#684017] text-white font-sans font-medium text-[10px] sm:text-xs tracking-wider uppercase py-2 sm:py-2.5 px-1 sm:px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
          >
            Add to cart
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
