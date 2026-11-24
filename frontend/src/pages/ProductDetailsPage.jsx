import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Check, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import QuickSearchModal from '../components/QuickSearchModal';
import { useCart } from '../context/CartContext';
import { fetchProductById, fetchProducts } from '../services/api';

const getCleanUnitSize = (unitStr) => {
  if (!unitStr) return '100 g';
  const trimmed = unitStr.trim();
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    return parts[parts.length - 1].trim();
  }
  return trimmed;
};

const ProductDetailsPage = ({ allProducts = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState({
    storage: true,
    shelfLife: false,
    packType: false,
    ingredients: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fetch or find product whenever id changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setSelectedImageIndex(0);
    setQuantity(1);

    const loadProduct = async () => {
      // First check local/prop products
      let found = allProducts.find((p) => (p._id || p.id).toString() === id);

      if (!found) {
        // Fetch from API
        const apiProduct = await fetchProductById(id);
        if (apiProduct) {
          found = apiProduct;
        }
      }

      if (isMounted) {
        if (found) {
          setProduct(found);
          const firstSize = (found.variations && Array.isArray(found.variations) && found.variations.length > 0)
            ? found.variations[0].size
            : (found.sizes && Array.isArray(found.sizes) && found.sizes.length > 0)
            ? found.sizes[0]
            : getCleanUnitSize(found.unit);
          setSelectedSize(firstSize);
        } else {
          setProduct(null);
        }
        setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AnnouncementBar />
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center font-sans">
            <div className="w-10 h-10 border-4 border-[#684017] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-500 text-sm">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AnnouncementBar />
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center font-sans">
          <h2 className="font-serif text-3xl text-stone-800 mb-3">Product Not Found</h2>
          <p className="text-stone-500 text-sm max-w-md mb-6">
            The product you're looking for might have been moved or is currently unavailable.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#1C1C1C] hover:bg-[#684017] text-white text-sm font-medium px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Build images gallery (main image + complementary serving/angle views)
  const productImages = product.images && product.images.length > 0
    ? product.images
    : [
        product.image,
        product.image,
        product.image,
      ];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const wishlisted = isWishlisted(product._id || product.id);

  // Normalized variations array (supports multiple variations and backwards compatibility)
  const variations = (product.variations && Array.isArray(product.variations) && product.variations.length > 0)
    ? product.variations
    : (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0)
    ? product.sizes.map((s, idx) => ({
        size: s,
        price: idx === 0 ? product.price : product.price,
        originalPrice: idx === 0 ? product.originalPrice : null,
        discount: product.discount,
      }))
    : [
        {
          size: getCleanUnitSize(product.unit),
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
        },
      ];

  const availableSizes = variations.map((v) => v.size);

  // Active variation based on selectedSize (defaults to first variation)
  const activeVariation = variations.find((v) => v.size === selectedSize) || variations[0];
  const currentSellingPrice = activeVariation ? activeVariation.price : product.price;
  const currentOriginalPrice = activeVariation?.originalPrice ?? product.originalPrice;

  // Calculate dynamic discount percentage based on selected size's prices
  let dynamicDiscount = null;
  if (currentOriginalPrice && currentOriginalPrice > currentSellingPrice) {
    const pct = Math.round(((currentOriginalPrice - currentSellingPrice) / currentOriginalPrice) * 100);
    if (pct > 0) {
      dynamicDiscount = `${pct}%`;
    }
  }
  const displayDiscount = dynamicDiscount || activeVariation?.discount || product.discount;

  // Related products from same category or catalog, excluding current product
  const relatedProducts = allProducts
    .filter((p) => (p._id || p.id).toString() !== (product._id || product.id).toString())
    .slice(0, 5);

  const handleAddToCart = () => {
    const currentSize = activeVariation?.size || selectedSize || (availableSizes.length > 0 ? availableSizes[0] : '100 g');
    const productWithVariant = {
      ...product,
      price: Number(currentSellingPrice),
      originalPrice: currentOriginalPrice ? Number(currentOriginalPrice) : null,
      unit: currentSize,
      selectedSize: currentSize,
      name: `${product.name} (${currentSize})`,
    };
    addToCart(productWithVariant, quantity);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {/* 1. Header */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 max-w-[1328px] mx-auto px-4 sm:px-6 lg:px-[80px] py-8 w-full">
        
        {/* Breadcrumb Navigation matching screenshot: Home > Shop > Category/Product */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-sans text-stone-500 mb-8 select-none">
          <Link to="/" className="hover:text-[#684017] transition-colors">
            Home
          </Link>
          <span className="text-stone-300 font-bold">&gt;</span>
          <Link to="/shop" className="hover:text-[#684017] transition-colors">
            Shop
          </Link>
          <span className="text-stone-300 font-bold">&gt;</span>
          <span className="text-[#1C1C1C] font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Two-Column Product Overview Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-[111px] w-full">
          
          {/* Left Column: Product Images Frame (549px, gap: 24px) */}
          <div className="w-full lg:w-[549px] flex flex-col gap-[24px]">
            
            {/* Main Image Container */}
            <div className="relative w-full lg:w-[549px] aspect-square bg-[#F7F7F7] rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm group">
              <img
                src={productImages[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Discount Badge (Top-Left) */}
              {displayDiscount && (
                <div className="absolute top-4 left-4 bg-[#00D084] text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">
                  {displayDiscount}
                </div>
              )}

              {/* Left / Right Chevron Arrows for image carousel */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {productImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-stone-50 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#1C1C1C] shadow-sm scale-[0.98]'
                      : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Product Details Frame (508px, gap: 28px) */}
          <div className="w-full lg:w-[508px] flex flex-col gap-[28px] justify-start">
            
            {/* Title & Description */}
            <div>
              {/* Title - Ancizar Serif, 600, 36-44px */}
              <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-[#1C1C1C] leading-tight">
                {product.name}
              </h1>

              {/* Description - Plus Jakarta Sans, 400, 15px */}
              <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed mt-3">
                {product.description ||
                  "Enjoy the delightful taste of authentic, farm-fresh dairy and dessert crafted with 100% natural ingredients, wholesome rich flavors, and time-honored traditional perfection."}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-3">
              <span className="font-sans font-bold text-2xl sm:text-3xl text-[#1C1C1C]">
                ₹{Number(currentSellingPrice).toFixed(2)}
              </span>
              {currentOriginalPrice && (
                <span className="font-sans text-base text-stone-400 line-through">
                  ₹{Number(currentOriginalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Choose Size Variant Selection */}
            <div>
              <span className="font-sans font-semibold text-xs text-stone-800 uppercase tracking-wider block mb-2.5">
                Choose Size
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-md font-sans text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C1C1C] text-white shadow-sm'
                          : 'bg-white text-stone-700 border border-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Wishlist Button Row */}
            <div className="flex items-center space-x-4">
              
              {/* Quantity [-] [count] [+] */}
              <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden h-11">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 h-full text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-sans font-bold text-sm w-9 text-center text-stone-800 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3.5 h-full text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-1 flex items-center justify-center space-x-2 border rounded-lg h-11 px-5 font-sans font-medium text-xs tracking-wider uppercase transition-all ${
                  wishlisted
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-stone-300 hover:border-stone-700 text-stone-800 hover:bg-stone-50'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    wishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'
                  }`}
                />
                <span>{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>

            </div>

            {/* Add to Cart Button (Full Width) */}
            <div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1C1C1C] hover:bg-[#684017] text-white font-sans font-medium text-xs tracking-wider uppercase py-3.5 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.99]"
              >
                Add to Cart
              </button>
            </div>

            {/* Expandable Information Sections (Accordions matching screenshot) */}
            <div className="border-t border-stone-200 divide-y divide-stone-200">
              
              {/* 1. Storage Instructions */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('storage')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-base text-[#1C1C1C] hover:text-[#684017] transition-colors"
                >
                  <span>Storage Instructions</span>
                  <span className="text-stone-500 text-lg">
                    {openAccordions.storage ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.storage && (
                  <p className="mt-2 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed animate-fadeIn">
                    {product.storageInstructions ||
                      "Store in a freezer at the temperature specified on the packaging. Avoid repeated thawing and refreezing."}
                  </p>
                )}
              </div>

              {/* 2. Shelf Life */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('shelfLife')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-base text-[#1C1C1C] hover:text-[#684017] transition-colors"
                >
                  <span>Shelf Life</span>
                  <span className="text-stone-500 text-lg">
                    {openAccordions.shelfLife ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.shelfLife && (
                  <p className="mt-2 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed animate-fadeIn">
                    {product.shelfLife ||
                      "Best within 6 months from manufacture date when stored in recommended freezer conditions."}
                  </p>
                )}
              </div>

              {/* 3. Pack Type */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('packType')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-base text-[#1C1C1C] hover:text-[#684017] transition-colors"
                >
                  <span>Pack Type</span>
                  <span className="text-stone-500 text-lg">
                    {openAccordions.packType ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.packType && (
                  <p className="mt-2 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed animate-fadeIn">
                    {product.packType || (product.isIceCream ? "Tub" : "Sealed Moisture-Proof Pack")}
                  </p>
                )}
              </div>

              {/* 4. Ingredients / Product Information (if available) */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full flex items-center justify-between text-left font-serif font-semibold text-base text-[#1C1C1C] hover:text-[#684017] transition-colors"
                >
                  <span>Ingredients & Quality</span>
                  <span className="text-stone-500 text-lg">
                    {openAccordions.ingredients ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.ingredients && (
                  <p className="mt-2 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed animate-fadeIn">
                    {product.ingredients ||
                      "Made with 100% pure farm milk, fresh churned dairy cream, cane sugar, and natural flavors. No artificial adulterants."}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* 2. Related Products Section */}
        <section className="mt-10 pt-8 border-t border-stone-200">
          <div className="mb-8">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-[#1C1C1C]">
              Related Products
            </h2>
            <p className="font-sans text-sm text-stone-500 mt-2">
              Sweeten your day with every delicious scoop
            </p>
          </div>

          {/* Horizontal Grid / Carousel */}
          <div className="flex space-x-6 overflow-x-auto hide-scrollbar pb-6 pt-1">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct._id || relProduct.id}
                product={relProduct}
                className="w-[180px] sm:w-[262px]"
              />
            ))}
          </div>
        </section>

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

export default ProductDetailsPage;
