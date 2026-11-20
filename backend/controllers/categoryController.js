import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

export const DEFAULT_CATEGORIES = [
  'Dairy Essentials',
  'Traditional Sweets',
  'Ready Mixes',
  'Pastry Favorites',
  'Ice Cream & Desserts',
  'Refreshing Beverages',
];

// Helper to slugify category name
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Auto-seed default categories if empty
export const autoSeedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const items = DEFAULT_CATEGORIES.map((name) => ({
        name,
        slug: slugify(name),
      }));
      await Category.insertMany(items);
      console.log('Default categories initialized successfully.');
    }
  } catch (err) {
    console.warn('Category seed notice:', err.message);
  }
};

// GET /api/categories - get all categories
export const getCategories = async (req, res) => {
  try {
    await autoSeedCategories();

    const dbCategories = await Category.find().sort({ name: 1 });
    const allCategories = dbCategories.map((c) => c.name);

    res.json({
      success: true,
      count: allCategories.length,
      data: allCategories.length > 0 ? allCategories : DEFAULT_CATEGORIES,
      details: dbCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id - update a category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    // Check duplicate (excluding self)
    const existing = await Category.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } },
        { slug },
      ],
    });
    if (existing) {
      return res.status(409).json({ success: false, message: `Category "${trimmedName}" already exists.` });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const oldName = category.name;
    category.name = trimmedName;
    category.slug = slug;
    category.description = description?.trim() || '';
    await category.save();

    // If renamed, keep product categories in sync
    if (oldName !== trimmedName) {
      await Product.updateMany({ category: oldName }, { category: trimmedName });
    }

    res.json({ success: true, message: `Category updated successfully!`, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating category.' });
  }
};

// DELETE /api/categories/:id - delete a category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Update any products using this deleted category to default
    await Product.updateMany({ category: category.name }, { category: 'Dairy Essentials' });

    res.json({ success: true, message: `Category "${category.name}" deleted successfully!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error deleting category.' });
  }
};

// POST /api/categories - add a new category (admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    const existing = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } },
        { slug },
      ],
    });

    if (existing) {
      return res.status(409).json({ success: false, message: `Category "${trimmedName}" already exists.` });
    }

    const category = await Category.create({
      name: trimmedName,
      slug,
      description: description?.trim() || '',
    });

    res.status(201).json({
      success: true,
      message: `Category "${trimmedName}" created successfully!`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error creating category.' });
  }
};
