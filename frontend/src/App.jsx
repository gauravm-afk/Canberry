import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminCustomers from './pages/admin/AdminCustomers';

// Customer Pages
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerOrderTracking from './pages/customer/CustomerOrderTracking';
import { useCart } from './context/CartContext';
import { fetchProducts } from './services/api';
import gulabJamunPremixImg from './assets/images/herosection/gulab_jamun_premix.png';

// Initial local fallback products in case backend is loading
const defaultProducts = [
  {
    _id: "p1",
    name: "Classic Vanilla Scoop",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Rich, creamy vanilla bean scoop made from slow-churned pure whole milk and speckled with authentic Madagascar pods.",
    storageInstructions: "Store in a freezer at the temperature specified on the packaging. Avoid repeated thawing and refreezing.",
    shelfLife: "Store in a freezer at the temperature specified on the packaging. Best within 6 months from manufacture.",
    packType: "Tub",
    sizes: ["100gm", "200gm", "500gm"],
    isBestseller: true,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p2",
    name: "Belgian Dark Chocolate",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Decadent dark chocolate gelato paired with crispy waffle bites and roasted cocoa nibs.",
    storageInstructions: "Store in a freezer at the temperature specified on the packaging. Avoid repeated thawing and refreezing.",
    shelfLife: "Store in a freezer at the temperature specified on the packaging. Best within 6 months from manufacture.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: true,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p3",
    name: "Royal Pistachio Gelato",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Creamy pistachio crunch crafted with authentic Persian saffron and churned dairy cream.",
    storageInstructions: "Store in a freezer at the temperature specified on the packaging.",
    shelfLife: "Best within 6 months from manufacture.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: true,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p4",
    name: "Twin Cone Celebration",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop",
    description: "Alphonso mango and berry swirl cones dipped in white chocolate cream.",
    storageInstructions: "Keep frozen at -18°C.",
    shelfLife: "Best within 6 months.",
    packType: "Pack of 2",
    sizes: ["Standard"],
    isBestseller: true,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p5",
    name: "Gulab Jamun Premix",
    category: "Ready Mixes",
    categorySlug: "ready-mixes",
    price: 250.0,
    originalPrice: 400.0,
    discount: "-20%",
    unit: "₹50.2/100 g",
    image: gulabJamunPremixImg,
    images: [
      gulabJamunPremixImg,
      gulabJamunPremixImg,
    ],
    description: "Instant melt-in-mouth gulab jamun mix blended with pure milk solids (khoya). Yields 40+ soft, syrupy jamuns.",
    storageInstructions: "Store in a cool, dry place away from direct sunlight.",
    shelfLife: "Best within 9 months from manufacture.",
    packType: "Box",
    sizes: ["200gm", "500gm", "1kg"],
    isBestseller: true,
    isTraditionalSweet: true,
    isIceCream: false,
  },
  {
    _id: "p6",
    name: "Creamy Malai Peda",
    category: "Traditional Sweets",
    categorySlug: "traditional-sweets",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "100 g",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
    description: "Slow-reduced pure cow milk cooked with cardamom and garnished with sliced pistachios.",
    storageInstructions: "Refrigerate after opening.",
    shelfLife: "Consume within 15 days.",
    packType: "Box",
    sizes: ["250gm", "500gm"],
    isBestseller: false,
    isTraditionalSweet: true,
    isIceCream: false,
  },
  {
    _id: "p7",
    name: "Gulab Jamun Premix Pack",
    category: "Ready Mixes",
    categorySlug: "ready-mixes",
    price: 250.0,
    originalPrice: 400.0,
    discount: "-20%",
    unit: "100 g",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    description: "Festive traditional dessert mix for perfectly golden, soft and juicy jamuns.",
    storageInstructions: "Store in a cool, dry place.",
    shelfLife: "9 months.",
    packType: "Pack",
    sizes: ["200gm", "500gm"],
    isBestseller: false,
    isTraditionalSweet: true,
    isIceCream: false,
  },
  {
    _id: "p8",
    name: "Kesar Mango Shrikhand",
    category: "Traditional Sweets",
    categorySlug: "traditional-sweets",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "100 g",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
    description: "Silky hung curd infused with saffron strands, alphonso mango pulp and cardamom.",
    storageInstructions: "Keep refrigerated between 2°C to 5°C.",
    shelfLife: "15 days from packaging.",
    packType: "Tub",
    sizes: ["200gm", "500gm"],
    isBestseller: false,
    isTraditionalSweet: true,
    isIceCream: false,
  },
  {
    _id: "p9",
    name: "Spiced Masala Buttermilk",
    category: "Refreshing Beverages",
    categorySlug: "refreshing-beverages",
    price: 60.0,
    originalPrice: 100.0,
    discount: "-40%",
    unit: "100 g",
    image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=800&auto=format&fit=crop",
    description: "Cooling traditional churned chaas with roasted cumin, mint and rock salt.",
    storageInstructions: "Keep refrigerated. Shake well before drinking.",
    shelfLife: "5 days.",
    packType: "Bottle",
    sizes: ["250ml", "500ml"],
    isBestseller: false,
    isTraditionalSweet: true,
    isIceCream: false,
  },
  {
    _id: "p10",
    name: "Roasted Almond Fudge Scoop",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "100 g",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
    description: "Caramelized almond crunch folded into silky thick dairy cream.",
    storageInstructions: "Store in a freezer.",
    shelfLife: "6 months.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: false,
    isTraditionalSweet: true,
    isIceCream: true,
  },
  {
    _id: "p11",
    name: "Pure Madagascar Vanilla Scoop",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
    description: "Classic velvety vanilla bean ice cream with authentic speckled pods.",
    storageInstructions: "Store in a freezer.",
    shelfLife: "6 months.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: false,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p12",
    name: "Cocoa Waffle Crunch Scoop",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
    description: "Rich roasted cocoa cream sprinkled with fresh crispy hand-rolled cones.",
    storageInstructions: "Store in a freezer.",
    shelfLife: "6 months.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: false,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p13",
    name: "Pistachio Almond Delight",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=800&auto=format&fit=crop",
    description: "Roasted dry fruits folded into silky cold cream.",
    storageInstructions: "Store in a freezer.",
    shelfLife: "6 months.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: false,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p14",
    name: "Artisan Dual Waffle Cone",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop",
    description: "Crispy waffle cones with strawberry and tropical mango gelato.",
    storageInstructions: "Keep frozen.",
    shelfLife: "6 months.",
    packType: "Pack of 2",
    sizes: ["Standard"],
    isBestseller: false,
    isTraditionalSweet: false,
    isIceCream: true,
  },
  {
    _id: "p15",
    name: "Gulab Jamun Sundae Tub",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 250.0,
    originalPrice: 400.0,
    discount: "-20%",
    unit: "₹50.2/100 g",
    image: gulabJamunPremixImg,
    description: "Warm mini gulab jamuns layered with rich malai kulfi gelato.",
    storageInstructions: "Store in a freezer.",
    shelfLife: "6 months.",
    packType: "Tub",
    sizes: ["200gm", "500gm"],
    isBestseller: false,
    isTraditionalSweet: true,
    isIceCream: true,
  },
  {
    _id: "p16",
    name: "Guava Ice Cream",
    category: "Ice Cream & Desserts",
    categorySlug: "ice-cream-desserts",
    price: 199.0,
    originalPrice: 400.0,
    discount: "-50%",
    unit: "₹50.2/100 g",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Enjoy the delightful taste of tropical guava in every creamy scoop. Guava Ice Cream brings together fruity flavor and a smooth, refreshing texture, making it a delicious treat for sunny afternoons, family gatherings, and everyday sweet cravings.",
    storageInstructions: "Store in a freezer at the temperature specified on the packaging. Avoid repeated thawing and refreezing.",
    shelfLife: "Store in a freezer at the temperature specified on the packaging. Best within 6 months from manufacture.",
    packType: "Tub",
    sizes: ["100gm", "200gm"],
    isBestseller: true,
    isTraditionalSweet: false,
    isIceCream: true,
  },
];

function App() {
  const [products, setProducts] = useState(defaultProducts);
  const { toastMessage } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        const sanitized = data.map((item) => {
          if (item.image && (item.image.includes('photo-1541781774459-bb2af2f05b55') || item.image.includes('gulab_jamun_premix'))) {
            return { ...item, image: gulabJamunPremixImg };
          }
          return item;
        });
        setProducts(sanitized);
      }
    };
    loadProducts();
  }, []);

  return (
    <>
      <ScrollToTop />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1C1C] text-[#FFF98D] px-5 py-3 rounded-xl shadow-2xl font-sans text-sm font-medium border border-white/10 flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Application Routing */}
      <Routes>
        {/* Public Storefront */}
        <Route path="/" element={<LandingPage products={products} />} />
        <Route path="/shop" element={<ShopPage products={products} />} />
        <Route path="/cart" element={<CartPage allProducts={products} />} />
        <Route path="/order-success" element={<OrderSuccessPage allProducts={products} />} />
        <Route path="/product/:id" element={<ProductDetailsPage allProducts={products} />} />

        {/* Customer Authentication & Dashboard */}
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/track" element={<CustomerOrderTracking />} />
        <Route path="/customer/track/:orderId" element={<CustomerOrderTracking />} />
        <Route path="/track/:orderId" element={<CustomerOrderTracking />} />

        {/* Admin Management Panel */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />

        <Route path="*" element={<LandingPage products={products} />} />
      </Routes>
    </>
  );
}

export default App;
