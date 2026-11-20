import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutGrid, List, ChevronDown, Check } from 'lucide-react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import QuickSearchModal from '../components/QuickSearchModal';
import { fetchCategories, fetchProducts } from '../services/api';

const BASE_CATEGORY_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'ice-cream', label: "Ice Cream's", match: ['Ice Cream', 'Dessert', 'Gelato', 'Cone', 'Scoop', 'ice-cream-desserts'] },
  { id: 'dairy-essentials', label: 'Dairy Essentials', match: ['Dairy', 'Milk', 'Paneer', 'Ghee', 'Butter', 'dairy-essentials'] },
  { id: 'traditional-sweets', label: "Traditional Sweet's", match: ['Sweet', 'Peda', 'Shrikhand', 'Gulab', 'Kulfi', 'traditional-sweets'] },
  { id: 'pantry-favourites', label: 'Pantry Favourites', match: ['Pantry', 'Premix', 'Mix', 'Ready', 'ready-mixes', 'pastry-favorites'] },
  { id: 'refreshing-beverages', label: 'Refreshing Beverages', match: ['Beverage', 'Shake', 'Lassi', 'Chaas', 'refreshing-beverages'] },
  { id: 'desserts', label: "Dessert's", match: ['Dessert', 'Pastry', 'Sweet', 'Ice Cream'] },
];

const sortOptions = [
  { id: 'featured', label: 'Sort by: Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name-az', label: 'Name: A to Z' },
];

const slugify = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const ShopPage = ({ products = [] }) => {
  const location = useLocation();
  const [shopProducts, setShopProducts] = useState(products);
  const [apiCategories, setApiCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Read ?category= query param and pre-select on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  useEffect(() => {
    if (products && products.length > 0) {
      setShopProducts(products);
    }
  }, [products]);

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) setShopProducts(data);
    });
    fetchCategories().then((cats) => {
      if (cats && cats.length > 0) setApiCategories(cats);
    });
  }, []);

  // Dynamically compute category options including any new categories created in admin
  const dynamicCategoryOptions = useMemo(() => {
    const list = [...BASE_CATEGORY_OPTIONS];

    // Collect all unique category names from apiCategories and current products
    const collected = new Set();
    apiCategories.forEach((c) => {
      if (c && typeof c === 'string') collected.add(c.trim());
    });
    shopProducts.forEach((p) => {
      if (p.category && typeof p.category === 'string') collected.add(p.category.trim());
    });

    collected.forEach((catName) => {
      const slug = slugify(catName);
      // Check if it's already represented in base options by EXACT id or label match only
      const isAlreadyCovered = list.some((item) => {
        if (item.id === slug) return true;
        if (item.label.toLowerCase() === catName.toLowerCase()) return true;
        return false;
      });

      if (!isAlreadyCovered) {
        list.push({
          id: slug,
          label: catName,
          match: [catName, slug],
        });
      }
    });

    return list;
  }, [apiCategories, shopProducts]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    let result = [...shopProducts];

    if (selectedCategory !== 'all') {
      const activeCat = dynamicCategoryOptions.find((c) => c.id === selectedCategory);
      if (activeCat) {
        result = result.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          const slug = (p.categorySlug || '').toLowerCase();

          // Direct exact match on category name
          if (cat === activeCat.label.toLowerCase()) return true;
          // Direct exact match on category slug or selected id
          if (slug === activeCat.id || slug === selectedCategory) return true;
          // Exact match on selected category id vs category field
          if (cat === selectedCategory) return true;

          // Keyword match — only against category and slug, NOT product name
          if (activeCat.match && Array.isArray(activeCat.match)) {
            return activeCat.match.some((m) => {
              const term = m.toLowerCase();
              return cat.includes(term) || slug.includes(term);
            });
          }

          return false;
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
  }, [shopProducts, selectedCategory, selectedSort, dynamicCategoryOptions]);

  const activeCategoryObj = dynamicCategoryOptions.find((c) => c.id === selectedCategory);
  const pageTitle = activeCategoryObj ? activeCategoryObj.label : 'All Products';

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {/* 1. Header */}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 max-w-[1328px] mx-auto px-3 sm:px-6 lg:px-[80px] py-6 sm:py-8 w-full">
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
                  {dynamicCategoryOptions.map((cat) => {
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
            <div className="pt-6 sm:pt-8">
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid grid-cols-2 ${
                    gridColumns === 4 ? 'sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'
                  } gap-3 sm:gap-6 lg:gap-8 justify-items-center w-full`}
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
        allProducts={shopProducts}
      />
    </div>
  );
};

export default ShopPage;
