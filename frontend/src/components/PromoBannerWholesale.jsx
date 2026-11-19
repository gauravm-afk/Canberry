import React from 'react';
import { imageConfig } from '../config/imageConfig';

const PromoBannerWholesale = () => {
  const scrollToEnquiry = () => {
    const el = document.getElementById('enquiry-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[380px] lg:min-h-[460px]">
        
        {/* Left Column: Food and Beverage Image Grid / Collage matching Screenshot 2 */}
        <div className="grid grid-cols-2 gap-1 bg-stone-200 overflow-hidden h-[340px] md:h-full">
          <div className="relative w-full h-full overflow-hidden bg-stone-100 group">
            <img
              src={imageConfig.promoWholesale.collageTopLeft}
              alt="Dairy Delights"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative w-full h-full overflow-hidden bg-stone-100 group">
            <img
              src={imageConfig.promoWholesale.collageTopRight}
              alt="Traditional Sweets Platter"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative w-full h-full overflow-hidden bg-stone-100 group">
            <img
              src={imageConfig.promoWholesale.collageBottomLeft}
              alt="Beverages and Milkshakes"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative w-full h-full overflow-hidden bg-stone-100 group">
            <img
              src={imageConfig.promoWholesale.collageBottomRight}
              alt="Ice Cream Assortment"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Column: Wholesale Business Content with Background #FFF98D */}
        <div className="bg-[#FFF98D] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-xl">
            <span className="font-serif font-medium text-lg sm:text-xl text-[#523A16] block mb-1">
              For retailers and distributors
            </span>
            
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[44px] text-[#222222] leading-tight">
              Your Business Deserves the Best!
            </h2>
            
            <p className="content-description text-[#4A4A4A] mt-4 max-w-md">
              Quality dairy products, sweets, and beverages in bulk to keep your customers coming back.
            </p>

            <div className="mt-8">
              <button
                onClick={scrollToEnquiry}
                className="bg-[#1C1C1C] hover:bg-[#333333] text-white font-sans font-medium text-sm md:text-base px-7 py-3 rounded-button shadow-sm hover:shadow transition-all duration-200 active:scale-95"
              >
                Enquire for Bulk Orders
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PromoBannerWholesale;
