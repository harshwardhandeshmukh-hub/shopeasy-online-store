import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  SlidersHorizontal,
  Star,
  RotateCcw,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

const ShopEasyApp: React.FC = () => {
  const {
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
    toastMessage
  } = useShop();

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Electronics', icon: Smartphone },
    { name: 'Fashion', icon: Shirt },
    { name: 'Home & Kitchen', icon: Home },
    { name: 'Beauty & Grooming', icon: Sparkles },
    { name: 'Sports & Fitness', icon: Dumbbell }
  ];

  // Deal of the Day items
  const dealOfTheDay = products.find((p) => p.badge === 'Deal of the Day') || products[0];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        
        {/* Hero Banner Carousel & Guarantees */}
        <HeroBanner />

        {/* Quick Category Icons Bar (Amazon/Flipkart category strip) */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;

              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    const catalogEl = document.getElementById('product-catalog');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex flex-col items-center gap-2 p-2.5 rounded-xl transition-all min-w-[90px] cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 font-bold scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Spotlight: Deal of the Day Banner */}
        {dealOfTheDay && (
          <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-slate-950 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="space-y-2 max-w-xl z-10">
              <div className="inline-block px-2.5 py-0.5 bg-slate-950 text-amber-400 text-[11px] font-black rounded uppercase tracking-wider">
                ⚡ Flash Deal of the Day
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                {dealOfTheDay.name}
              </h3>
              <p className="text-xs text-amber-100 line-clamp-2">
                {dealOfTheDay.description}
              </p>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-white tabular-nums">
                  {formatINR(dealOfTheDay.price)}
                </span>
                <span className="text-xs text-amber-200 line-through tabular-nums">
                  {formatINR(dealOfTheDay.originalPrice)}
                </span>
                <span className="text-xs font-bold text-slate-950 bg-white px-2 py-0.5 rounded">
                  Flat 20% OFF
                </span>
              </div>
            </div>

            <div className="shrink-0 z-10 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={dealOfTheDay.image}
                alt={dealOfTheDay.name}
                className="w-36 h-36 object-contain bg-white/90 p-2 rounded-2xl shadow-lg"
              />
              <button
                onClick={() => {
                  const catalogEl = document.getElementById('product-catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Claim This Deal &rarr;
              </button>
            </div>
          </section>
        )}

        {/* Main Product Catalog Section */}
        <section id="product-catalog" className="space-y-6 pt-2">
          
          {/* Header Row: Title & Sorting */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                <span>ShopEasy Catalog</span>
                <span>·</span>
                <span>Category: <strong className="text-slate-900">{activeCategory}</strong></span>
                {searchQuery && (
                  <>
                    <span>·</span>
                    <span>Search: "<strong className="text-amber-600">{searchQuery}</strong>"</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-display">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${activeCategory} Collection`}
              </h2>
            </div>

            {/* Controls: Count & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 whitespace-nowrap">
                Showing <strong>{filteredProducts.length}</strong> products
              </span>

              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-slate-900 cursor-pointer shadow-2xs outline-none"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-xs">▼</div>
              </div>
            </div>
          </div>

          {/* Catalog Layout: Sidebar Filters + Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar Filters */}
            <aside className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </h4>
                <button
                  onClick={() => {
                    setPriceRange([0, 100000]);
                    setMinRating(0);
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Department</h5>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setActiveCategory(c.name)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        activeCategory === c.name
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c.name}</span>
                      {activeCategory === c.name && <span className="text-amber-600 font-bold">•</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase text-[11px]">Price Limit</span>
                  <span className="font-bold text-slate-950 tabular-nums">Up to {formatINR(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹500</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Customer Rating</h5>
                <div className="space-y-1">
                  {[4, 3, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === r ? 0 : r)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                        minRating === r ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex text-amber-500">
                        {Array(r).fill(0).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span>& Above</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prime Delivery Tag */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <span>ShopEasy Prime Eligible</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  All catalog items qualify for next-day dispatch and delivery.
                </p>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden p-4 space-y-3 animate-pulse">
                      <div className="h-48 bg-slate-100 rounded-lg"></div>
                      <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <SlidersHorizontal className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No Matching Products Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your filters, clearing your search query, or switching departments.
                  </p>
                  <button
                    onClick={() => {
                      setPriceRange([0, 100000]);
                      setMinRating(0);
                      setActiveCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <OrdersModal />
      <AuthModal />
      <AdminModal />

      {/* Global Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in pointer-events-none">
          <div
            className={`px-4 py-3 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2.5 text-white ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 border border-emerald-700'
                : toastMessage.type === 'error'
                ? 'bg-rose-900 border border-rose-700'
                : 'bg-slate-900 border border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopEasyApp />
    </ShopProvider>
  );
}
