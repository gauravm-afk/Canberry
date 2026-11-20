import { Product } from '../models/Product.js';
import { initialProducts } from '../seeds/seedData.js';

// Get all products or filter by category / tag
export const getProducts = async (req, res) => {
  try {
    const { category, isBestseller, isTraditionalSweet, isIceCream } = req.query;
    const filter = {};

    if (category) filter.categorySlug = category;
    if (isBestseller === 'true') filter.isBestseller = true;
    if (isTraditionalSweet === 'true') filter.isTraditionalSweet = true;
    if (isIceCream === 'true') filter.isIceCream = true;

    let products = [];
    try {
      products = await Product.find(filter).sort({ createdAt: -1 });
    } catch (dbErr) {
      console.warn('DB query failed, serving static data fallback:', dbErr.message);
    }

    // Fallback to static seed data if DB is empty or disconnected
    if (!products || products.length === 0) {
      let filtered = [...initialProducts];
      if (category) filtered = filtered.filter(p => p.categorySlug === category);
      if (isBestseller === 'true') filtered = filtered.filter(p => p.isBestseller);
      if (isTraditionalSweet === 'true') filtered = filtered.filter(p => p.isTraditionalSweet);
      if (isIceCream === 'true') filtered = filtered.filter(p => p.isIceCream);
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    let id = req.params.id;
    if (id && id.startsWith('p')) {
      const num = parseInt(id.replace('p', ''), 10);
      if (!isNaN(num)) {
        id = '6650010000000000000000' + num.toString().padStart(2, '0');
      }
    }

    let product = null;
    try {
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
    } catch (dbErr) {
      console.warn('DB query failed, checking seed data:', dbErr.message);
    }

    if (!product) {
      product = initialProducts.find(
        (p) => (p._id || p.id).toString() === id || (p._id || p.id).toString() === req.params.id
      );
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed initial products into DB
export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(initialProducts);
    res.json({ success: true, message: `Successfully seeded ${inserted.length} products!`, data: inserted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/products - create product (protectAdmin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      discount,
      unit,
      category,
      categorySlug,
      image,
      isBestseller,
      isTraditionalSweet,
      isIceCream,
      inStock,
      sizes,
    } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Product name is required.' });
    if (price === undefined || price < 0) return res.status(400).json({ success: false, message: 'Valid price is required.' });

    const resolvedCategory = category?.trim() || 'Dairy Essentials';
    const resolvedSlug = categorySlug?.trim() || resolvedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: discount?.trim() || null,
      unit: unit?.trim() || '100 g',
      category: resolvedCategory,
      categorySlug: resolvedSlug,
      image: image?.trim() || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop',
      isBestseller: !!isBestseller,
      isTraditionalSweet: !!isTraditionalSweet,
      isIceCream: !!isIceCream,
      inStock: inStock !== undefined ? !!inStock : true,
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : [unit?.trim() || '100 g'],
    });

    res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/products/:id - update product (protectAdmin)
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/products/:id - delete product (protectAdmin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/products/:id/status - toggle product status (protectAdmin)
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    product.inStock = !product.inStock;
    await product.save();

    res.json({ success: true, message: `Product is now ${product.inStock ? 'in stock' : 'out of stock'}.`, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
