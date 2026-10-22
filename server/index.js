import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'shopeasy_secret_jwt_token_key_2026';

app.use(cors());
app.use(express.json());

// Persistent File-backed Store setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ----------------------------------------------------
// Initial Rich Catalog & Seed Data
// ----------------------------------------------------
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Titanium OLED Flagship 5G Smartphone (256GB)',
    brand: 'NovaTech',
    category: 'Electronics',
    price: 64999,
    originalPrice: 79999,
    rating: 4.8,
    reviewsCount: 3240,
    stock: 45,
    badge: 'Deal of the Day',
    isTrending: true,
    isFeatured: true,
    isNew: false,
    image: '/src/assets/images/product_flagship_phone_1792691967245.jpg',
    description: 'Next-generation flagship with 6.8-inch Dynamic AMOLED 120Hz display, 200MP pro-grade camera, Snapdragon 8 Gen 3 processor, and 5000mAh all-day battery with 65W fast charging.',
    specs: {
      Display: '6.8" 120Hz LTPO AMOLED',
      Storage: '256GB UFS 4.0',
      RAM: '12GB LPDDR5X',
      Battery: '5000 mAh (65W Charge)',
      Camera: '200MP + 50MP + 12MP'
    }
  },
  {
    id: 'prod-2',
    name: 'Pro Acoustic Wireless Noise-Cancelling Headphones',
    brand: 'AuraSound',
    category: 'Electronics',
    price: 14999,
    originalPrice: 22999,
    rating: 4.9,
    reviewsCount: 1845,
    stock: 32,
    badge: 'Best Seller',
    isTrending: true,
    isFeatured: true,
    isNew: false,
    image: '/src/assets/images/product_overear_headphones_1792683257767.jpg',
    description: 'Industry-leading active noise cancellation with 40mm beryllium drivers, 38-hour battery longevity, multipoint Bluetooth 5.3 connection, and memory foam plush ear cushions.',
    specs: {
      BatteryLife: '38 Hours ANC On',
      Connectivity: 'Bluetooth 5.3 / 3.5mm Aux',
      DriverSize: '40mm Custom Beryllium',
      Weight: '254 grams'
    }
  },
  {
    id: 'prod-3',
    name: 'Smart Touchscreen Digital Air Fryer (5.5L)',
    brand: 'Cozina Home',
    category: 'Home & Kitchen',
    price: 5499,
    originalPrice: 8999,
    rating: 4.7,
    reviewsCount: 920,
    stock: 28,
    badge: 'Super Saver',
    isTrending: true,
    isFeatured: true,
    isNew: true,
    image: '/src/assets/images/product_kitchen_airfryer_1792691967721.jpg',
    description: 'Rapid 360-degree air convection circulation system with 8 pre-programmed culinary presets. Cuts oil usage by up to 85% while retaining crisp texture.',
    specs: {
      Capacity: '5.5 Liters',
      Power: '1700 Watts',
      TemperatureRange: '80°C - 200°C',
      Coating: 'Ceramic Non-Stick BPA-Free'
    }
  },
  {
    id: 'prod-4',
    name: 'Heritage Chronograph Sapphire Leather Watch',
    brand: 'Vanguard Horology',
    category: 'Fashion',
    price: 7999,
    originalPrice: 12499,
    rating: 4.8,
    reviewsCount: 450,
    stock: 18,
    badge: 'Limited Edition',
    isTrending: false,
    isFeatured: true,
    isNew: false,
    image: '/src/assets/images/product_leather_chronograph_1792683259138.jpg',
    description: 'Handcrafted precision wristwatch featuring scratch-resistant sapphire crystal glass, genuine Tuscan leather strap, 316L stainless steel bezel, and 50m water resistance.',
    specs: {
      DialDiameter: '42mm',
      Glass: 'Sapphire Crystal',
      Strap: 'Full Grain Italian Leather',
      Movement: 'Japanese Mecha-Quartz'
    }
  },
  {
    id: 'prod-5',
    name: 'Artisanal Cognac Leather Crossbody Saddle Bag',
    brand: 'UrbanCraft',
    category: 'Fashion',
    price: 3499,
    originalPrice: 5999,
    rating: 4.6,
    reviewsCount: 312,
    stock: 24,
    badge: 'Popular',
    isTrending: true,
    isFeatured: false,
    isNew: true,
    image: '/src/assets/images/product_leather_crossbody_1792683259567.jpg',
    description: 'Full-grain vegetable tanned saddle leather handbag with antique brass buckles, adjustable shoulder strap, and multiple internal compartments for daily essentials.',
    specs: {
      Material: '100% Genuine Full-Grain Leather',
      Dimensions: '24 x 18 x 8 cm',
      Hardware: 'Antique Solid Brass'
    }
  },
  {
    id: 'prod-6',
    name: 'Tailored Unstructured Navy Linen Blazer',
    brand: 'Sartorial Club',
    category: 'Fashion',
    price: 4599,
    originalPrice: 6999,
    rating: 4.7,
    reviewsCount: 280,
    stock: 19,
    badge: 'Trending',
    isTrending: true,
    isFeatured: false,
    isNew: false,
    image: '/src/assets/images/product_tailored_blazer_1792683257504.jpg',
    description: 'Breathable 100% pure European linen weave with natural shoulder construction, patch pockets, and unlined inner drape for smart-casual refinement.',
    specs: {
      Fabric: '100% Pure Linen',
      Fit: 'Slim Tailored',
      Care: 'Dry Clean Recommended'
    }
  },
  {
    id: 'prod-7',
    name: 'Ultra-Fast GaN 65W Multi-Port Wall Charger',
    brand: 'NovaTech',
    category: 'Electronics',
    price: 1899,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 1540,
    stock: 80,
    badge: 'Top Pick',
    isTrending: false,
    isFeatured: false,
    isNew: true,
    image: '/src/assets/images/product_overear_headphones_1792683257767.jpg',
    description: 'Gallium Nitride (GaN III) compact high-efficiency power adapter with 2x USB-C Power Delivery and 1x USB-A ports to charge phones, tablets, and laptops simultaneously.',
    specs: {
      MaxOutput: '65W Power Delivery',
      Ports: '2x Type-C + 1x Type-A',
      Technology: 'GaN III Fast IC'
    }
  },
  {
    id: 'prod-8',
    name: 'Organic Cotton Percale 400TC Queen Bedding Set',
    brand: 'Serene Sanctuary',
    category: 'Home & Kitchen',
    price: 2799,
    originalPrice: 4499,
    rating: 4.6,
    reviewsCount: 610,
    stock: 35,
    badge: 'Bestseller',
    isTrending: false,
    isFeatured: true,
    isNew: false,
    image: '/src/assets/images/hero_shopping_banner_1792683257533.jpg',
    description: 'Crisp, matte-finish luxury bed sheet set woven with 400 thread count long-staple organic cotton. Includes 1 flat sheet, 1 fitted sheet, and 2 pillowcases.',
    specs: {
      Material: '100% GOTS Certified Organic Cotton',
      ThreadCount: '400 TC Percale Weave',
      Size: 'Queen (90 x 102 inches)'
    }
  }
];

// Hash initial passwords for secure persistent accounts
const HASHED_USER_PASS = bcrypt.hashSync('password123', 10);
const HASHED_ADMIN_PASS = bcrypt.hashSync('admin123', 10);

const DEFAULT_USERS = [
  {
    id: 'usr-customer-1',
    name: 'Aarav Sharma',
    email: 'user@shopeasy.com',
    password: HASHED_USER_PASS,
    phone: '+91 98765 43210',
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Aarav Sharma',
        phone: '+91 98765 43210',
        street: 'Flat 402, Skyline Towers, Linking Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        isDefault: true,
        type: 'Home'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-admin-1',
    name: 'ShopEasy Admin',
    email: 'admin@shopeasy.com',
    password: HASHED_ADMIN_PASS,
    phone: '+91 98111 22334',
    role: 'admin',
    addresses: [],
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'OD-7829103948',
    userId: 'usr-customer-1',
    customerName: 'Aarav Sharma',
    customerEmail: 'user@shopeasy.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Skyline Towers, Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      type: 'Home'
    },
    items: [
      {
        id: 'prod-2',
        name: 'Pro Acoustic Wireless Noise-Cancelling Headphones',
        price: 14999,
        quantity: 1,
        image: '/src/assets/images/product_overear_headphones_1792683257767.jpg'
      }
    ],
    subtotal: 14999,
    discount: 1000,
    shippingFee: 0,
    total: 13999,
    paymentMethod: 'UPI (Google Pay / PhonePe)',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    trackingSteps: [
      { status: 'Ordered', time: 'Yesterday, 10:30 AM', completed: true },
      { status: 'Packed', time: 'Yesterday, 04:15 PM', completed: true },
      { status: 'Shipped', time: 'Today, 08:00 AM', completed: true },
      { status: 'Out for Delivery', time: 'Expected Tomorrow', completed: false },
      { status: 'Delivered', time: 'Expected by 5 PM Tomorrow', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Initialize or Load from DB_FILE
let store = {
  products: [...DEFAULT_PRODUCTS],
  users: [...DEFAULT_USERS],
  orders: [...DEFAULT_ORDERS],
  carts: {}
};

function loadStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      store = {
        products: parsed.products && parsed.products.length ? parsed.products : DEFAULT_PRODUCTS,
        users: parsed.users && parsed.users.length ? parsed.users : DEFAULT_USERS,
        orders: parsed.orders || DEFAULT_ORDERS,
        carts: parsed.carts || {}
      };
      console.log('✅ Loaded persistent database from server/data/store.json');
    } else {
      saveStore();
      console.log('📦 Created initial persistent database at server/data/store.json');
    }
  } catch (err) {
    console.error('Error loading store, using defaults:', err.message);
    store = {
      products: DEFAULT_PRODUCTS,
      users: DEFAULT_USERS,
      orders: DEFAULT_ORDERS,
      carts: {}
    };
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store to file:', err.message);
  }
}

loadStore();

// ----------------------------------------------------
// Authentication Helpers & Middleware
// ----------------------------------------------------
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token.' });
  }
}

// ----------------------------------------------------
// Routes: System Health
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storeName: 'ShopEasy Store',
    productCount: store.products.length,
    userCount: store.users.length,
    orderCount: store.orders.length,
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Routes: Authentication & User Profile
// ----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = store.users.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);
    saveStore();

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = store.users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Welcome back to ShopEasy!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses || []
    }
  });
});

app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { name, phone, addresses } = req.body;
  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (addresses && Array.isArray(addresses)) user.addresses = addresses;

  saveStore();
  res.json({
    message: 'Profile updated successfully.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses
    }
  });
});

// ----------------------------------------------------
// Routes: Products
// ----------------------------------------------------
app.get('/api/products', (req, res) => {
  let list = [...store.products];
  const { category, search, sort, minPrice, maxPrice, minRating, badge, featured } = req.query;

  if (category && category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (badge) {
    list = list.filter((p) => p.badge && p.badge.toLowerCase().includes(badge.toLowerCase()));
  }

  if (featured === 'true') {
    list = list.filter((p) => p.isFeatured || p.isTrending);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);
  }

  if (minRating) {
    const r = parseFloat(minRating);
    if (!isNaN(r)) list = list.filter((p) => p.rating >= r);
  }

  if (sort) {
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'reviews') list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    else if (sort === 'newest') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  res.json({
    products: list,
    total: list.length,
    categories: ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Grooming', 'Sports & Fitness']
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = store.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const related = store.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({ product, related });
});

// Admin Add Product
app.post('/api/products', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required.' });
  }

  const { name, brand, category, price, originalPrice, stock, description, image, specs } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required.' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    brand: brand ? brand.trim() : 'ShopEasy Select',
    category: category.trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.3),
    rating: 4.8,
    reviewsCount: 1,
    stock: stock !== undefined ? Number(stock) : 20,
    badge: 'New Arrival',
    isTrending: false,
    isFeatured: true,
    isNew: true,
    image: image || '/src/assets/images/product_flagship_phone_1792691967245.jpg',
    description: description || 'Premium quality curated merchandise from ShopEasy Store.',
    specs: specs || {}
  };

  store.products.unshift(newProduct);
  saveStore();
  res.status(201).json({ message: 'Product added to catalog.', product: newProduct });
});

// ----------------------------------------------------
// Routes: Cart Persistence
// ----------------------------------------------------
app.get('/api/cart', authMiddleware, (req, res) => {
  const cart = store.carts[req.user.id] || [];
  res.json({ cart });
});

app.post('/api/cart', authMiddleware, (req, res) => {
  const { cart } = req.body;
  if (Array.isArray(cart)) {
    store.carts[req.user.id] = cart;
    saveStore();
  }
  res.json({ message: 'Cart synchronized.' });
});

// ----------------------------------------------------
// Routes: Customer Orders & Checkout
// ----------------------------------------------------
app.post('/api/orders', authMiddleware, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, discount = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Shopping cart is empty.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.pincode) {
      return res.status(400).json({ error: 'Please provide complete delivery details.' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = store.products.find((p) => p.id === item.id);
      if (!prod) {
        return res.status(400).json({ error: `Product ${item.name || item.id} is no longer available.` });
      }

      if (prod.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${prod.name}". Only ${prod.stock} units remaining.`
        });
      }

      // Decrement inventory stock
      prod.stock = Math.max(0, prod.stock - item.quantity);
      subtotal += prod.price * item.quantity;

      validatedItems.push({
        id: prod.id,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        quantity: item.quantity,
        image: prod.image
      });
    }

    const shippingFee = subtotal >= 499 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const newOrder = {
      id: `OD-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      userId: req.user.id,
      customerName: shippingAddress.fullName || req.user.name,
      customerEmail: req.user.email,
      customerPhone: shippingAddress.phone || '+91 98765 00000',
      shippingAddress,
      items: validatedItems,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod: paymentMethod || 'Simulated UPI',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid (Simulated)',
      orderStatus: 'Ordered',
      trackingSteps: [
        { status: 'Ordered', time: 'Just now', completed: true },
        { status: 'Packed', time: 'Processing in warehouse', completed: false },
        { status: 'Shipped', time: 'Pending courier dispatch', completed: false },
        { status: 'Out for Delivery', time: 'Estimated in 2-3 days', completed: false },
        { status: 'Delivered', time: 'Estimated in 3 days', completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    store.orders.unshift(newOrder);

    // Clear user cart in store
    delete store.carts[req.user.id];

    saveStore();

    res.status(201).json({
      message: 'Order placed successfully! Delivery tracking initiated.',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Checkout failed.' });
  }
});

app.get('/api/orders/my-orders', authMiddleware, (req, res) => {
  const userOrders = store.orders.filter((o) => o.userId === req.user.id);
  res.json({ orders: userOrders });
});

app.get('/api/orders/:id', authMiddleware, (req, res) => {
  const order = store.orders.find((o) => o.id === req.params.id && (o.userId === req.user.id || req.user.role === 'admin'));
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ order });
});

// Admin All Orders
app.get('/api/admin/orders', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  res.json({ orders: store.orders, total: store.orders.length });
});

app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const { status } = req.body;
  const order = store.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.orderStatus = status;
  // Update tracking steps completion
  const stepIdx = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].indexOf(status);
  if (stepIdx !== -1 && order.trackingSteps) {
    order.trackingSteps.forEach((step, i) => {
      step.completed = i <= stepIdx;
      if (i === stepIdx) step.time = 'Updated just now';
    });
  }

  saveStore();
  res.json({ message: 'Order status updated.', order });
});

// Admin Stats
app.get('/api/admin/stats', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const totalSales = store.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = store.orders.length;
  const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const pendingShipments = store.orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  res.json({
    totalSales,
    totalOrders,
    averageOrderValue: aov,
    pendingShipments,
    totalProducts: store.products.length,
    totalUsers: store.users.length
  });
});

// Fallback for API
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.originalUrl} not found.` });
});

export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.RUNNING_IN_VITE) {
  const isDirect = process.argv[1]?.includes('server/index.js');
  if (isDirect) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🛒 ShopEasy Express API listening on http://localhost:${PORT}`);
    });
  }
}
