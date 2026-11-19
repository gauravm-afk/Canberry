import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Phone, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import QuickSearchModal from '../components/QuickSearchModal';
import { imageConfig } from '../config/imageConfig';

const OrderSuccessPage = ({ allProducts = [] }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Clear cart and remove badge when reaching checkout success
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {/* 1. Header */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* Yellow Banner Section matching reference screenshot */}
        <div className="bg-[#FFF5A5] w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-12 border-b border-[#EFE288]">
          <div className="max-w-[1248px] mx-auto">
            
            {/* Breadcrumb Navigation: Home > Enquiry received */}
            <nav className="flex items-center space-x-2 text-xs sm:text-sm font-sans text-stone-600 mb-8 select-none">
              <Link to="/" className="hover:text-[#684017] transition-colors">
                Home
              </Link>
              <span className="text-stone-400 font-bold">&gt;</span>
              <span className="text-[#1C1C1C] font-semibold">Enquiry received</span>
            </nav>

            {/* Two Column Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Confirmation Text & Actions (col-span-7) */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                
                {/* Status Badge */}
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#523A1B] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#1C1C1C]">
                    Enquiry Sent Successfully
                  </span>
                </div>

                {/* Main Heading - Ancizar Serif */}
                <h1 className="font-serif font-semibold text-3xl sm:text-5xl text-[#1C1C1C] leading-[1.15]">
                  Thank you for <br className="hidden sm:inline" />getting in touch.
                </h1>

                {/* Subtitle */}
                <p className="font-sans text-stone-700 text-sm sm:text-base leading-relaxed max-w-xl">
                  We've received your message. Thank you for considering Saurabh Food Product for your order or enquiry.
                </p>

                {/* Divider Line */}
                <div className="border-t border-stone-800/15 pt-6"></div>

                {/* What Happens Next Box */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5 text-[#1C1C1C]">
                    <Phone className="w-4 h-4 text-[#684017]" />
                    <h3 className="font-serif font-bold text-lg">
                      What happens next?
                    </h3>
                  </div>
                  <p className="font-sans text-stone-700 text-sm leading-relaxed max-w-lg">
                    Our team will review your enquiry and get in touch using the phone number you supplied.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center space-x-2 bg-[#1C1C1C] hover:bg-[#684017] text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase py-3.5 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
                  >
                    <span>Continue shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center space-x-2 bg-transparent hover:bg-white/60 text-[#1C1C1C] border border-[#1C1C1C] font-sans font-medium text-xs sm:text-sm tracking-wider uppercase py-3.5 px-6 rounded-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    <span>Return home</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Imagery Card (col-span-5) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden shadow-md border border-amber-200/60 bg-white">
                  <img
                    src={imageConfig.promoSweeter.src}
                    alt={imageConfig.promoSweeter.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-serif italic text-stone-800 text-sm sm:text-base text-center mt-3">
                  A little taste of tradition in every bite.
                </p>
              </div>

            </div>

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
        allProducts={allProducts}
      />
    </div>
  );
};

export default OrderSuccessPage;
