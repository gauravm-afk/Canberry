import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../../services/adminApi';

const CATEGORIES = [
  'Dairy Essentials',
  'Traditional Sweets',
  'Ready Mixes',
  'Pastry Favorites',
  'Ice Cream & Desserts',
  'Refreshing Beverages',
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Dairy Essentials',
    price: '',
    originalPrice: '',
    discount: '',
    unit: '100 g',
    image: '',
    inStock: true,
    isBestseller: false,
    isTraditionalSweet: false,
    isIceCream: false,
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data || []);
    } catch (err) {
      console.warn('Load products error:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to fetch products.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Dairy Essentials',
      price: '',
      originalPrice: '',
      discount: '',
      unit: '100 g',
      image: '',
      inStock: true,
      isBestseller: false,
      isTraditionalSweet: false,
      isIceCream: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      category: prod.category || 'Dairy Essentials',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      discount: prod.discount || '',
      unit: prod.unit || '100 g',
      image: prod.image || '',
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      isBestseller: !!prod.isBestseller,
      isTraditionalSweet: !!prod.isTraditionalSweet,
      isIceCream: !!prod.isIceCream,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteAdminProduct(id);
      setFeedback({ type: 'success', message: `"${name}" was deleted successfully.` });
      loadProducts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete product.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      };

      if (editingProduct) {
        await updateAdminProduct(editingProduct._id || editingProduct.id, payload);
        setFeedback({ type: 'success', message: 'Product updated successfully!' });
      } else {
        await createAdminProduct(payload);
        setFeedback({ type: 'success', message: 'Product added successfully!' });
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save product.' });
    } finally {
      setSaving(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'All'
      ? true
      : stockFilter === 'In Stock' ? (p.inStock !== false) : (p.inStock === false);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <AdminLayout currentPage="Products">
      <div className="space-y-6">
        
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1C]">
              Product Inventory
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              Add, update, or remove dairy products displayed across the store.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#684017] hover:bg-[#523211] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Feedback message */}
        {feedback.message && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-sm ${
              feedback.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback({ type: '', message: '' })} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between font-sans">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#684017] bg-stone-50/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm bg-white text-stone-700 focus:outline-none focus:border-[#684017]"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm bg-white text-stone-700 focus:outline-none focus:border-[#684017]"
            >
              <option value="All">All Availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <button
              onClick={loadProducts}
              title="Refresh"
              className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50 text-stone-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#EFE5D7] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5">Image</th>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Tags</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod._id || prod.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Image */}
                      <td className="px-5 py-3.5">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=400";
                            }}
                          />
                        </div>
                      </td>

                      {/* Name & Unit */}
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-stone-900 line-clamp-1">{prod.name}</p>
                        <p className="text-xs text-stone-400">{prod.unit || '100 g'}</p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 text-stone-600">
                        <span className="px-2.5 py-1 bg-stone-100 rounded-md text-xs font-medium">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-stone-900">₹{Number(prod.price).toFixed(2)}</span>
                          {prod.originalPrice && (
                            <span className="text-stone-400 line-through text-xs">
                              ₹{Number(prod.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {prod.discount && (
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            {prod.discount}
                          </span>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            prod.inStock !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Badges / Tags */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {prod.isBestseller && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                              Bestseller
                            </span>
                          )}
                          {prod.isTraditionalSweet && (
                            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-semibold">
                              Sweets
                            </span>
                          )}
                          {prod.isIceCream && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                              Ice Cream
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 text-stone-600 hover:text-[#684017] hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id || prod.id, prod.name)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No products match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col font-sans border border-stone-200 overflow-hidden">
              {/* Modal Header (Fixed at top of modal) */}
              <div className="px-5 sm:px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1C1C]">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form (Scrolls independently while box stays fixed) */}
              <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Pure Gir Cow Ghee"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017]"
                  />
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017] bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Weight / Unit (e.g. 500g, 1L)
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="100 g"
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017]"
                    />
                  </div>
                </div>

                {/* Price, Original Price, Discount */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="199.00"
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="250.00"
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Discount Badge
                    </label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="-20%"
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017]"
                    />
                  </div>
                </div>

                {/* Product Image File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Upload Product Image (Choose File)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="product-image-file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData((prev) => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-stone-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#684017] file:text-white hover:file:bg-[#4A2B0C] file:cursor-pointer file:transition-colors border border-stone-300 rounded-xl bg-stone-50 cursor-pointer"
                    />
                    {formData.image && (
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-stone-300 bg-stone-100 group">
                        <img
                          src={formData.image}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: '' }));
                            const input = document.getElementById('product-image-file');
                            if (input) input.value = '';
                          }}
                          className="absolute inset-0 bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  {formData.image && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      ✓ Image chosen successfully
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Rich and authentic taste made from pure milk..."
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#684017]"
                  />
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded accent-[#684017] w-4 h-4"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded accent-[#684017] w-4 h-4"
                    />
                    <span>Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.isTraditionalSweet}
                      onChange={(e) => setFormData({ ...formData, isTraditionalSweet: e.target.checked })}
                      className="rounded accent-[#684017] w-4 h-4"
                    />
                    <span>Sweets Section</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.isIceCream}
                      onChange={(e) => setFormData({ ...formData, isIceCream: e.target.checked })}
                      className="rounded accent-[#684017] w-4 h-4"
                    />
                    <span>Ice Cream Section</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-[#684017] hover:bg-[#523211] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
