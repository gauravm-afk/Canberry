/**
 * Canberry Dairy E-Commerce Landing Page - Image Configuration
 * 
 * =========================================================================
 * HOW TO REPLACE IMAGES LATER:
 * To replace any image on the website, simply update the URL or local file path
 * in this single configuration file. No code or layout changes are needed!
 * 
 * You can provide:
 * 1. An external image URL: 'https://your-domain.com/image.jpg'
 * 2. A local asset reference: '/src/assets/images/my-image.jpg'
 * 3. A public directory asset: '/images/my-image.jpg'
 * =========================================================================
 */

import bannerDairy from '../assets/images/banner-1-dairy.jpg';
import bannerSweets from '../assets/images/banner-2-sweets.jpg';
import bannerIcecream from '../assets/images/banner-3-icecream.jpg';
import bannerReadymix from '../assets/images/banner-4-readymix.jpg';
import logoImg from '../assets/images/canberry-logo-new.jpg';
import dairyEssentials from '../assets/images/herosection/dairy-essentials.png';
import traditionalSweets from '../assets/images/herosection/traditional-sweets.png';
import readyMixes from '../assets/images/herosection/ready-mixes.png';
import pastryFavorites from '../assets/images/herosection/pastry-favorites.png';
import iceCreamDesserts from '../assets/images/herosection/ice-cream-desserts.png';
import refreshingBeverages from '../assets/images/herosection/refreshing-beverages.png';
import mango from '../assets/images/herosection/mango.png';
import shrikhand from '../assets/images/herosection/shrikhand.png';
import gulab from '../assets/images/herosection/gulab_jamun_premix.png';
export const imageConfig = {
  // Brand & Logo
  logo: {


    src: logoImg,
    alt: "Canberi Dairy, Agri & Education",
    title: "Canberi Logo",
    badgeLabel: "CANBERI",
  },

  // 1. Hero Image Slider (4 Full-Width Promotional Banners)
  heroBanners: [
    {
      id: "dairy-banner",
      src: bannerDairy,
      alt: "PURE, FRESH, AND ESSENTIAL. Nourishing dairy products made from farm-fresh milk, delivered naturally every day.",
      title: "Dairy Products - Pure, Fresh, and Essential",
    },
    {
      id: "sweets-banner",
      src: bannerSweets,
      alt: "RICH, SWEET, AND CELEBRATED. Authentic, festive flavors prepared in minutes with our premium sweet mixes.",
      title: "Traditional Sweets - Rich, Sweet, and Celebrated",
    },
    {
      id: "icecream-banner",
      src: bannerIcecream,
      alt: "CRUNCHY, CREAMY, CRAFTED. Artisanal ice cream made with 100% natural ingredients, loved by generations.",
      title: "Ice Cream Products - Crunchy, Creamy, Crafted",
    },
    {
      id: "readymix-banner",
      src: bannerReadymix,
      alt: "QUICK, EASY, AND DELICIOUS. Authentic, wholesome meals prepared in minutes with our premium ready mixes.",
      title: "Ready Mix Products - Quick, Easy, and Delicious",
    },
  ],

  // 2. Product Categories (6 Circular Images)
  categories: {
    dairyEssentials: {
      id: "dairy-essentials",
      title: "Dairy Essentials",
      src: dairyEssentials,
      alt: "Dairy Essentials - Pure Milk, Paneer, Butter & Ghee",
    },
    traditionalSweets: {
      id: "traditional-sweets",
      title: "Traditional Sweets",
      src: traditionalSweets,
      alt: "Traditional Sweets - Shrikhand, Peda, Kulfi",
    },
    readyMixes: {
      id: "ready-mixes",
      title: "Ready Mixes",
      src: readyMixes,
      alt: "Ready Mixes - Gulab Jamun & Dessert Premixes",
    },
    pastryFavorites: {
      id: "pastry-favorites",
      title: "Pastry Favorites",
      src: pastryFavorites,
      alt: "Pastry Favorites - Fresh Baked Delights & Cream Treats",
    },
    iceCreamDesserts: {
      id: "ice-cream-desserts",
      title: "Ice Cream & Desserts",
      src: iceCreamDesserts,
      alt: "Ice Cream & Desserts - Scoops, Cones & Sundaes",
    },
    refreshingBeverages: {
      id: "refreshing-beverages",
      title: "Refreshing Beverages",
      src: refreshingBeverages,
      alt: "Refreshing Beverages - Cold Milkshakes, Lassi & Chaas",
    },
  },

  // 3. Make Every Moment Sweeter Banner (Two-column Promo)
  promoSweeter: {
    src: mango,
    alt: "Delicious traditional mango shrikhand and festive sweets",
    dimensions: "900x700 recommended",
  },

  // 4. Wholesale / Business Promotional Banner (Two-column Promo Collage)
  promoWholesale: {
    collageTopLeft: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop",
    collageTopRight: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop",
    collageBottomLeft: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=600&auto=format&fit=crop",
    collageBottomRight: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=600&auto=format&fit=crop",
    alt: "Bulk dairy products, sweets, and beverages wholesale supply",
  },

  // 5. Products
  gulabJamunPremix: gulab,
  shrikhand: shrikhand,
  mango: mango,
  productFallback: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
};

export default imageConfig;
