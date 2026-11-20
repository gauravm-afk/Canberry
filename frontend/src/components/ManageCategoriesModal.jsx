import React, { useState, useEffect } from 'react';
import { X, Layers, Pencil, Trash2, Check, AlertCircle, Plus, Save } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/adminApi';

export default function ManageCategoriesModal({ isOpen, onClose, onCategoriesChanged }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add new category state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) loadCategories();
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      // fetchCategories returns names array; we need details — use the details from API
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.details || []);
    } catch (err) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccessMsg(msg);
    setTimeout(() => { setError(''); setSuccessMsg(''); }, 2500);
  };

  // --- Add ---
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createCategory({ name: newName.trim(), description: newDesc.trim() });
      setNewName(''); setNewDesc(''); setShowAddForm(false);
      showFeedback(`Category "${newName.trim()}" added!`);
      await loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      showFeedback(err.message || 'Failed to add category.', true);
    } finally {
      setAdding(false);
    }
  };

  // --- Edit ---
  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateCategory(id, { name: editName.trim(), description: editDesc.trim() });
      setEditingId(null);
      showFeedback('Category updated!');
      await loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      showFeedback(err.message || 'Failed to update category.', true);
    } finally {
      setSaving(false);
    }
  };

  // --- Delete ---
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      showFeedback(`Category "${name}" deleted.`);
      await loadCategories();
      if (onCategoriesChanged) onCategoriesChanged();
    } catch (err) {
      showFeedback(err.message || 'Failed to delete category.', true);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col font-sans border border-stone-200 overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#684017] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1C1C]">
              Manage Categories
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">

          {/* Feedback */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" /><span>{successMsg}</span>
            </div>
          )}

          {/* Category List */}
          {loading ? (
            <p className="text-sm text-stone-500 text-center py-6">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-6">No categories yet.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id} className="border border-stone-200 rounded-xl overflow-hidden">
                  {editingId === cat._id ? (
                    /* Edit Row */
                    <div className="p-3 bg-amber-50/50 space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#684017] bg-white"
                        placeholder="Category name"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#684017] bg-white"
                        placeholder="Description (optional)"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(cat._id)}
                          disabled={saving}
                          className="px-3 py-1.5 text-xs bg-[#684017] text-white rounded-lg hover:bg-[#523211] transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Row */
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#684017] hover:bg-amber-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          disabled={deletingId === cat._id}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Add New Category */}
          {showAddForm ? (
            <form onSubmit={handleAdd} className="border border-dashed border-[#684017]/40 rounded-xl p-4 space-y-3 bg-amber-50/30">
              <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">New Category</p>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category name *"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#684017] bg-white"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#684017] bg-white"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewName(''); setNewDesc(''); }}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-1.5 text-xs bg-[#684017] text-white rounded-lg hover:bg-[#523211] transition-colors disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-stone-300 rounded-xl text-sm text-stone-500 hover:border-[#684017] hover:text-[#684017] hover:bg-amber-50/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Category
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-stone-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#684017] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
