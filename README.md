# Canberry Dairy - Single-Page E-Commerce Landing Page (MERN Stack)

A modern, responsive dairy products e-commerce landing page built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js), combining all three design reference sections into **ONE continuous, vertically scrollable page**.

---

## 📸 Section Sequence (11 Continuous Sections)

1. **Announcement Bar**: Brown banner (`#684017`) with promotional highlights and animated marquee for mobile.
2. **Navigation Header**: Sticky navigation with brand crest logo, menu links (`Home`, `Shop`, `Contact Us`, `Bulk Order`), search modal trigger, shopping cart badge counter, and user account icon.
3. **Hero Banner**: Full-width rustic dairy showcase with headline **"PURE, FRESH, AND ESSENTIAL."**, description, and action buttons.
4. **Product Categories**: Six circular category badges aligned horizontally on desktop:
   - Dairy Essentials
   - Traditional Sweets
   - Ready Mixes
   - Pastry Favorites
   - Ice Cream & Desserts
   - Refreshing Beverages
5. **Bestsellers**: Product carousel with functional previous (`←`) and next (`→`) arrows, product cards with discount badges (`-50%`), wishlist buttons, prices, weight/quantities, and interactive *Add to Cart* buttons.
6. **"Make Every Moment Sweeter." Promotional Banner**: Two-column layout with large food photography on the left and warm yellow background (`#FFF98D`) with CTA button on the right.
7. **Traditional Sweets**: Product carousel featuring sweets (Malai Peda, Gulab Jamun Premix, Mango Shrikhand, Buttermilk, etc.).
8. **Wholesale / Business Promotional Banner**: Two-column layout with food & beverage photo grid on the left and **"For retailers and distributors - Your Business Deserves the Best!"** with **#FFF98D** background on the right.
9. **Ice Cream & Desserts**: Dedicated carousel with ice cream cones, scoops, and dessert tubs.
10. **Order / Enquiry Form**: Full-width section with **#FFF98D** background:
    - Left side: Contact details (email, address, phone)
    - Right side: Interactive card form with Name, Phone Number, Category dropdown, Quantity, dynamic **"+ Add more product's"** rows, Message textarea, validation, and real-time MongoDB submission.
11. **Footer**: 3-column footer with brand logo, legal links (Privacy Policy, Terms of Use), social media icons, product navigation, and contact info.

---

## 🖼️ How to Easily Replace Images Later

All images across the entire website are centralized in a single configuration file:
📁 **`frontend/src/config/imageConfig.js`**

To replace any image, simply update the image URL or path in `imageConfig.js`:

```javascript
export const imageConfig = {
  // Replace Logo
  logo: {
    src: "/images/your-actual-logo.png",
    alt: "Canberry Dairy Farm",
  },

  // Replace Hero Banner
  heroBanner: {
    src: "/images/your-hero-banner.jpg",
  },

  // Replace 6 Categories
  categories: {
    dairyEssentials: { src: "..." },
    traditionalSweets: { src: "..." },
    readyMixes: { src: "..." },
    pastryFavorites: { src: "..." },
    iceCreamDesserts: { src: "..." },
    refreshingBeverages: { src: "..." },
  },

  // Replace Promotional Banners
  promoSweeter: { src: "..." },
  promoWholesale: {
    collageTopLeft: "...",
    collageTopRight: "...",
    collageBottomLeft: "...",
    collageBottomRight: "...",
  },
};
```
No HTML, CSS, or layout restructuring is required!

---

## 🔤 Exact Typography Implementation

- **Navigation Menu Text**: `Ancizar Serif`, 700 (Bold), 18px
- **Category / Item Text**: `Ancizar Serif`, 600 (SemiBold), 18px
- **Content Titles**: `Ancizar Serif`, 600 (SemiBold), 48px
- **Content Description**: `Plus Jakarta Sans`, 400 (Regular), 16px
- **Product Names**: `Ancizar Serif`, 600 (SemiBold), 18px

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Start the Backend Server (Express + MongoDB)
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Seed Initial Products (Automatic on startup or manual)
```bash
cd backend
npm run seed
```

### 3. Start the Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```
