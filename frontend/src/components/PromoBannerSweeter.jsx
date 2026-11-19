import React from 'react';
import { imageConfig } from '../config/imageConfig';

const PromoBannerSweeter = () => {
  const scrollToTraditionalSweets = () => {
    const el = document.getElementById('traditional-sweets');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[380px] lg:min-h-[460px]">
        
        {/* Left Column: Large Promotional Food Image */}
        <div className="relative w-full h-[320px] md:h-full overflow-hidden bg-stone-100 group">
          <img
            src={imageConfig.promoSweeter.src}
            alt={imageConfig.promoSweeter.alt}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Right Column: Promotional Content with Background #FFF98D */}
        <div className="bg-[#FFF98D] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-xl">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[44px] text-[#222222] leading-tight">
              Make Every Moment Sweeter.
            </h2>
            
            <p className="content-description text-[#4A4A4A] mt-4 max-w-md">
              Bring home creamy delights and traditional favorites for your next family meal or celebration.
            </p>

            <div className="mt-8">
              <button
                onClick={scrollToTraditionalSweets}
                className="bg-[#1C1C1C] hover:bg-[#333333] text-white font-sans font-medium text-sm md:text-base px-7 py-3 rounded-button shadow-sm hover:shadow transition-all duration-200 active:scale-95"
              >
                Discover Sweet Treats
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PromoBannerSweeter;
