import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, User, Order, Address } from '../types';

interface ShopContextType {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  selectedBadge: string;
  setSelectedBadge: (badge: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => boolean;
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  orders: Order[];
  fetchOrders: () => Promise<void>;
  placeOrder: (shippingAddress: Address, paymentMethod: string) => Promise<Order>;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  deliveryPincode: string;
  setDeliveryPincode: (pin: string) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  refreshProducts: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const API_BASE = '/api';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [deliveryPincode, setDeliveryPincode] = useState<string>('400050');

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopeasy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    return localStorage.getItem('shopeasy_promo') || null;
  });

  // User & Auth
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('shopeasy_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('shopeasy_token') || null;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3200);
  }, []);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('shopeasy_cart', JSON.stringify(cart));
  }, [cart]);

  // Load products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory && activeCategory !== 'All') params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedBadge) params.append('badge', selectedBadge);
      if (selectedSort !== 'featured') params.append('sort', selectedSort);

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      showToast('Could not fetch catalog products.', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, selectedBadge, selectedSort, showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Check auth session
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('shopeasy_user', JSON.stringify(data.user));
        } else {
          logout();
        }
      })
      .catch(() => logout());
  }, [token]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx > -1) {
        const item = prev[idx];
        const newQty = item.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[idx] = { ...item, quantity: newQty };
        showToast(`Updated "${product.name}" quantity to ${newQty}.`, 'success');
        return updated;
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`, 'error');
          return prev;
        }
        showToast(`Added "${product.name}" to cart.`, 'success');
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            stock: product.stock,
            quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stock) {
              showToast(`Only ${item.stock} units available in stock.`, 'error');
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    localStorage.removeItem('shopeasy_promo');
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SHOPEASY10' || clean === 'WELCOME500') {
      setAppliedPromo(clean);
      localStorage.setItem('shopeasy_promo', clean);
      showToast(`Promo ${clean} applied successfully!`, 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "SHOPEASY10" or "WELCOME500".', 'error');
      return false;
    }
  };

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedPromo === 'SHOPEASY10') {
    cartDiscount = Math.round(cartSubtotal * 0.1);
  } else if (appliedPromo === 'WELCOME500') {
    cartDiscount = Math.min(500, cartSubtotal);
  }

  const cartShipping = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  // Authentication
  const login = async (email: string, pass: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed.');

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shopeasy_user', JSON.stringify(data.user));
    localStorage.setItem('shopeasy_token', data.token);
    showToast(`Welcome back, ${data.user.name}!`, 'success');
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed.');

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shopeasy_user', JSON.stringify(data.user));
    localStorage.setItem('shopeasy_token', data.token);
    showToast(`Account created! Welcome to ShopEasy, ${data.user.name}.`, 'success');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopeasy_user');
    localStorage.removeItem('shopeasy_token');
    showToast('Signed out successfully.', 'info');
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!token) throw new Error('Not signed in.');
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Profile update failed.');

    setUser(json.user);
    localStorage.setItem('shopeasy_user', JSON.stringify(json.user));
    showToast('Profile information updated.', 'success');
  };

  // Orders
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, [token]);

  const placeOrder = async (shippingAddress: Address, paymentMethod: string): Promise<Order> => {
    if (!token) throw new Error('Please sign in to complete your order.');
    if (cart.length === 0) throw new Error('Your shopping cart is empty.');

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        shippingAddress,
        paymentMethod,
        discount: cartDiscount
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order.');

    clearCart();
    fetchOrders();
    fetchProducts();
    showToast('Order confirmed! Tracking initiated.', 'success');
    return data.order;
  };

  // Filter products by price and rating
  const filteredProducts = products.filter((p) => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    return true;
  });

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        loading,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedSort,
        setSelectedSort,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        selectedBadge,
        setSelectedBadge,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        appliedPromo,
        applyPromo,
        user,
        token,
        login,
        register,
        logout,
        updateUserProfile,
        orders,
        fetchOrders,
        placeOrder,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        deliveryPincode,
        setDeliveryPincode,
        toastMessage,
        showToast,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
