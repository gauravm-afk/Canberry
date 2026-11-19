import React, { useState } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import ProductCategories from '../components/ProductCategories';
import ProductSection from '../components/ProductSection';
import PromoBannerSweeter from '../components/PromoBannerSweeter';
import PromoBannerWholesale from '../components/PromoBannerWholesale';
import OrderEnquiryForm from '../components/OrderEnquiryForm';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import QuickSearchModal from '../components/QuickSearchModal';

const LandingPage = ({ products = [] }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter products for the three carousel sections
  const bestsellers = products.filter((p) => p.isBestseller);
  const traditionalSweets = products.filter((p) => p.isTraditionalSweet);
  const iceCreamDesserts = products.filter((p) => p.isIceCream);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navigation Header */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 3. Hero Banner */}
      <HeroBanner />

      {/* 4. Product Categories */}
      <ProductCategories />

      {/* 5. Bestsellers */}
      <ProductSection
        id="bestsellers"
        title="Bestsellers"
        description="Discover the favorites that bring a little extra joy to everyday meals, family gatherings, and sweet celebrations."
        products={bestsellers}
      />

      {/* 6. Make Every Moment Sweeter Promotional Banner */}
      <PromoBannerSweeter />

      {/* 7. Traditional Sweets */}
      <ProductSection
        id="traditional-sweets"
        title="Traditional Sweet's"
        description="Celebrate every moment with traditional delights."
        products={traditionalSweets}
      />

      {/* 8. Wholesale / Business Promotional Banner */}
      <PromoBannerWholesale />

      {/* 9. Ice Cream & Desserts */}
      <ProductSection
        id="ice-cream-desserts"
        title="Ice Cream & Dessert's"
        description="Sweeten your day with every delicious scoop"
        products={iceCreamDesserts}
      />

      {/* 10. Order / Enquiry Form */}
      <OrderEnquiryForm />

      {/* 11. Footer */}
      <Footer />

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allProducts={products}
      />
    </div>
  );
};

export default LandingPage;
