import React from 'react';
import { imageConfig } from '../config/imageConfig';

const ProductCategories = ({ onSelectCategory }) => {
  const categoryList = [
    imageConfig.categories.dairyEssentials,
    imageConfig.categories.traditionalSweets,
    imageConfig.categories.readyMixes,
    imageConfig.categories.pastryFavorites,
    imageConfig.categories.iceCreamDesserts,
    imageConfig.categories.refreshingBeverages,
  ];

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat.id);
    }
    // Smooth scroll to relevant section
    if (cat.id === 'traditional-sweets') {
      const el = document.getElementById('traditional-sweets');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat.id === 'ice-cream-desserts') {
      const el = document.getElementById('ice-cream-desserts');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-12 md:py-16 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal row of 6 circular categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6 lg:gap-4 justify-items-center items-start">
          {categoryList.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="group flex flex-col items-center cursor-pointer text-center w-full"
            >
              {/* Circular image wrapper with subtle shadow and border */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden p-1 bg-stone-50 border border-stone-200 shadow-sm group-hover:shadow-md group-hover:border-[#684017] transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.src}
                    alt={cat.alt}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=300&auto=format&fit=crop";
                    }}
                  />
                </div>
              </div>

              {/* Category Name - Single line with whitespace-nowrap */}
              <h3 className="category-item-text text-[#232323] group-hover:text-[#684017] mt-3.5 transition-colors duration-200 whitespace-nowrap">
                {cat.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductCategories;
