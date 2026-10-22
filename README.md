# ShopEasy Store - Premium Full-Stack E-Commerce Platform

A modern, responsive full-stack online shopping website inspired by Amazon and Flipkart, built with React, HTML5, CSS3, Tailwind CSS, Node.js, Express, and persistent database storage.

---

## 🌟 Key Features

### 1. Home Page & Discovery
- **Top Navigation Bar**:
  - Logo with "ShopEasy Plus" badge.
  - Delivery location PIN code selector (`Mumbai 400050` with interactive PIN checker).
  - Search bar with department category dropdown, keyword debounce, and search button.
  - Account & Lists menu, Returns & Orders quick link, and Cart with live count badge.
- **Category Ribbon & Navigation**:
  - Quick department filters: Electronics, Fashion, Home & Kitchen, Beauty & Grooming, Sports & Fitness.
  - Quick links for Track Package and Admin Operations.
- **Promotional Carousel & Hero Banners**:
  - Multi-slide carousel showcasing Mega Electronics Sale, Festive Luxury Wardrobe, and Smart Living.
  - Auto-play with pause-on-hover and responsive dot indicators.
- **Trust Highlights Bar**:
  - Free Shipping above ₹499, 7-Day Easy Return, 100% Certified Genuine, and 24/7 Priority Support.
- **Spotlight Deal of the Day**:
  - Flash deals with countdown timer and instant claim button.
- **Footer**:
  - Back to Top smooth scroll, 4-column navigation, certified payment method badges, and copyright.

### 2. Product Catalog & Details (PDP)
- **Product Cards**:
  - High-resolution studio photography with hover zoom.
  - Brand and category kickers.
  - Verified star ratings (`★ 4.8`) and review counts.
  - Deal badges (`24% OFF`, `Deal of the Day`, `Best Seller`).
  - Price in Indian Rupees (`₹` INR) with strike-through original M.R.P. and savings indicator.
  - Prime delivery badge ("Get it by Tomorrow").
  - Low stock urgency warnings ("Only 3 left in stock").
- **Search, Filters & Sorting**:
  - Real-time search across title, brand, category, and descriptions.
  - Filter by department, price budget slider (₹500 to ₹1,00,000), and star ratings (4★ & above, 3★ & above).
  - Sort by Featured Deals, Price: Low to High, Price: High to Low, Rating, and Most Reviewed.
- **Individual Product Details Modal (PDP)**:
  - High-res product showcase and guarantees.
  - Bank offers and promo coupon tags.
  - Technical specifications table.
  - Quantity selector, "Add to Cart", and instant "Buy Now".
  - Verified customer reviews.

### 3. Shopping Cart
- Slide-over cart drawer with animated transition.
- Quantity stepper with real-time stock validation and item removal.
- Free delivery progress threshold bar ("Add ₹X more for FREE delivery").
- Promo coupon code box (`SHOPEASY10` for 10% off, `WELCOME500` for ₹500 off).
- Price breakdown: Subtotal, Savings, Delivery, and Grand Total.
- LocalStorage and server synchronization.
- Empty cart message with "Start Shopping" CTA.

### 4. Checkout & Simulated Payment
- Step 1: Delivery Address (Full name, phone, street, city, state, PIN code).
- Step 2: Simulated Payment Selection:
  - UPI Instant Pay (Google Pay, PhonePe, Paytm, BHIM)
  - Credit / Debit Cards (Visa, MasterCard, RuPay)
  - Cash on Delivery (COD)
- Form validation and clear sandbox test environment notice.
- Order Confirmation screen with generated Order ID, delivery timeline, and receipt.

### 5. Customer Order History
- Real-time visual tracking progress: `Ordered` ➔ `Packed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`.
- Itemized lists with thumbnails, quantities, prices, and shipping addresses.

### 6. User Authentication & Profile
- Registration and Login forms with client-side and server-side validation.
- Password encryption using `bcryptjs` salt rounds and JWT bearer token sessions.
- 1-Click Fast Demo Credentials:
  - **Customer**: `user@shopeasy.com` / `password123`
  - **Admin**: `admin@shopeasy.com` / `admin123`
- Profile view to inspect account details and order records.

### 7. Admin Operations Portal
- Role-protected access (`admin@shopeasy.com`).
- Live metrics: Total Gross Sales (₹), Total Orders, Average Order Value (AOV), and Registered Users.
- Order status manager: Update order state (`Ordered`, `Packed`, `Shipped`, `Out for Delivery`, `Delivered`).
- Product Inventory: Add new items with title, brand, category, price, and stock count.
- Persistent file database backed by `server/data/store.json`.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, JSX |
| **Styling** | Tailwind CSS v4, Custom CSS, Google Fonts (`Outfit` & `Plus Jakarta Sans`) |
| **Icons** | Lucide React |
| **Backend Server** | Node.js, Express.js |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Database** | Persistent JSON store (`server/data/store.json`) with MongoDB Atlas compatibility |
| **Build Tooling** | Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite` |

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Run Dev Server

```bash
npm run dev
```

The application runs on [http://localhost:3000](http://localhost:3000) with both the React frontend and Express backend unified through Vite middlewares.

---

## 🔑 Demo Test Accounts

| Role | Email | Password | Access |
|---|---|---|---|
| **Customer** | `user@shopeasy.com` | `password123` | Browsing, Cart, Checkout, Order Tracking |
| **Admin** | `admin@shopeasy.com` | `admin123` | Full Admin Portal, Sales KPIs, Order Status, Inventory Management |
