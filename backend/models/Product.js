import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Dairy Essentials',
        'Traditional Sweets',
        'Ready Mixes',
        'Pastry Favorites',
        'Ice Cream & Desserts',
        'Refreshing Beverages',
      ],
    },
    categorySlug: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: String,
      default: null,
    },
    unit: {
      type: String,
      default: '100 g',
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isTraditionalSweet: {
      type: Boolean,
      default: false,
    },
    isIceCream: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);
