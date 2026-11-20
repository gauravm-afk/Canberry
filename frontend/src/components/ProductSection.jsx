import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductSection = ({ id, title, description, products = [] }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id={id} className="py-12 md:py-16 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: Title + Description on Left, Navigation Arrows on Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[48px] text-[#222222] leading-tight">
              {title}
            </h2>
            <p className="content-description text-[#555555] mt-2">
              {description}
            </p>
          </div>

          {/* Carousel Arrows: brown circular buttons matching screenshots */}
          <div className="flex items-center space-x-3 self-end md:self-auto">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-[#684017] hover:bg-[#50310F] text-white flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95"
              aria-label="Previous products"
              title="Previous"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-[#684017] hover:bg-[#50310F] text-white flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95"
              aria-label="Next products"
              title="Next"
            >
              <ArrowRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto hide-scrollbar pb-4 pt-1 scroll-smooth"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                className="w-[180px] sm:w-[262px]"
              />
            ))
          ) : (
            <div className="py-12 text-center w-full text-stone-400 font-sans">
              Loading fresh dairy products...
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ProductSection;
