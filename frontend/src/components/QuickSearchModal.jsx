import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const QuickSearchModal = ({ isOpen, onClose, allProducts = [] }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const filtered = query.trim()
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 self-start mt-12">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200">
          <Search className="w-5 h-5 text-stone-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search milk, paneer, shrikhand, ice cream..."
            className="w-full text-stone-800 placeholder-stone-400 font-sans text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-stone-400 text-xs font-sans">
              Type a product name or category (e.g., "Vanilla", "Shrikhand", "Premix")
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs font-sans">
              No products found matching "{query}"
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <div
                  key={item._id || item.id}
                  onClick={() => {
                    navigate(`/product/${item._id || item.id}`);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-150 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                    />
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-stone-800">
                        {item.name}
                      </h4>
                      <p className="font-sans text-xs text-stone-500">
                        {item.category} • ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, 1);
                      onClose();
                    }}
                    className="bg-[#1C1C1C] hover:bg-[#684017] text-white text-xs font-sans px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSearchModal;
