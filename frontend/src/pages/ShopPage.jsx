import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutGrid, List, ChevronDown, Check } from 'lucide-react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import QuickSearchModal from '../components/QuickSearchModal';

const categoryOptions = [
  { id: 'all', label: 'All' },
  { id: 'ice-cream', label: "Ice Cream's", match: ['Ice Cream', 'Dessert', 'Gelato', 'Cone', 'Scoop'] },
  { id: 'dairy-essentials', label: 'Dairy Essentials', match: ['Dairy', 'Milk', 'Paneer', 'Ghee', 'Butter'] },
  { id: 'traditional-sweets', label: "Traditional Sweet's", match: ['Sweet', 'Peda', 'Shrikhand', 'Gulab', 'Kulfi'] },
  { id: 'pantry-favourites', label: 'Pantry Favourites', match: ['Pantry', 'Premix', 'Mix', 'Ready'] },
  { id: 'refreshing-beverages', label: 'Refreshing Beverages', match: ['Beverage', 'Shake', 'Lassi', 'Chaas'] },
  { id: 'desserts', label: "Dessert's", match: ['Dessert', 'Pastry', 'Sweet', 'Ice Cream'] },
];

const sortOptions = [
  { id: 'featured', label: 'Sort by: Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name-az', label: 'Name: A to Z' },
];

const ShopPage = ({ products = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('ice-cream');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      const activeCat = categoryOptions.find((c) => c.id === selectedCategory);
      if (activeCat && activeCat.match) {
        result = result.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          return activeCat.match.some((m) => {
            const term = m.toLowerCase();
            return cat.includes(term) || name.includes(term);
          });
        });
      }
    }

    // Sort products
    if (selectedSort === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedSort === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (selectedSort === 'name-az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, selectedSort]);

  const activeCategoryObj = categoryOptions.find((c) => c.id === selectedCategory);
  const pageTitle = activeCategoryObj ? activeCategoryObj.label : "Ice Cream's";

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {/* 1. Header */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 max-w-[1328px] mx-auto px-4 sm:px-6 lg:px-[80px] py-8 w-full">
        {/* Breadcrumb Navigation: Home > Shop */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-sans text-stone-500 mb-8 select-none">
          <Link to="/" className="hover:text-[#684017] transition-colors">
            Home
          </Link>
          <span className="text-stone-300 font-bold">&gt;</span>
          <span className="text-[#1C1C1C] font-semibold">Shop</span>
          {selectedCategory !== 'all' && (
            <>
              <span className="text-stone-300 font-bold">&gt;</span>
              <span className="text-stone-500">{pageTitle}</span>
            </>
          )}
        </nav>

        {/* Layout: Sidebar Filter on Left + Products on Right */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Sidebar Filter (matching reference screenshot) */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="border border-stone-200 rounded-2xl p-6 bg-white shadow-sm sticky top-28">
              {/* Filter Title */}
              <div className="flex items-center space-x-2.5 pb-4 border-b border-stone-100 text-[#1C1C1C]">
                <SlidersHorizontal className="w-4 h-4 text-[#684017]" />
                <h3 className="font-serif font-bold text-lg tracking-tight">Filter</h3>
              </div>

              {/* Categories Label */}
              <div className="pt-4">
                <span className="font-sans font-semibold text-xs text-stone-400 uppercase tracking-wider block mb-3">
                  Categories
                </span>

                {/* Categories List */}
                <ul className="space-y-1.5 font-sans text-sm">
                  {categoryOptions.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FFF9EF] font-bold text-[#684017] shadow-xs'
                              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                          }`}
                        >
                          <span>{cat.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#684017]" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            
            {/* Top Toolbar: Category Heading & Sort / Layout toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-[#1C1C1C]">
                {pageTitle}
              </h1>

              {/* Controls: Sort Dropdown & View Mode */}
              <div className="flex items-center space-x-4 self-end sm:self-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-stone-200 text-xs sm:text-sm font-sans text-stone-700 hover:border-stone-400 bg-white shadow-2xs transition-all"
                  >
                    <span>{sortOptions.find((s) => s.id === selectedSort)?.label || 'Sort by'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-20 font-sans text-xs sm:text-sm">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSelectedSort(opt.id);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-stone-50 transition-colors ${
                            selectedSort === opt.id ? 'font-bold text-[#684017] bg-[#FFF9EF]' : 'text-stone-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Icons (matching screenshot) */}
                <div className="hidden sm:flex items-center space-x-1 border border-stone-200 rounded-lg p-0.5 bg-stone-50/50">
                  <button
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 rounded ${gridColumns === 3 ? 'bg-white shadow-xs text-stone-900' : 'text-stone-400 hover:text-stone-700'}`}
                    title="3 Columns Grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 rounded ${gridColumns === 4 ? 'bg-white shadow-xs text-stone-900' : 'text-stone-400 hover:text-stone-700'}`}
                    title="4 Columns Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="pt-8">
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    gridColumns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                  } gap-6 sm:gap-8 justify-items-center`}
                >
                  {filteredProducts.map((prod) => (
                    <ProductCard key={prod._id || prod.id} product={prod} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="font-serif text-xl text-stone-600">No products found in this category.</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-5 py-2.5 bg-[#1C1C1C] text-white rounded-lg text-xs font-sans uppercase tracking-wider hover:bg-[#684017] transition-all"
                  >
                    View All Products
                  </button>
                </div>
              )}
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
        allProducts={products}
      />
    </div>
  );
};

export default ShopPage;
