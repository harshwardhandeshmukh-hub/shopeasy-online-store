import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  MapPin,
  ChevronDown,
  Menu,
  ShieldCheck,
  Package,
  LogOut,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    cartCount,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setActiveModal,
    deliveryPincode,
    setDeliveryPincode
  } = useShop();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPincodePrompt, setShowPincodePrompt] = useState(false);
  const [newPin, setNewPin] = useState(deliveryPincode);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCatFilter !== 'All') {
      setActiveCategory(selectedCatFilter);
    }
    setSearchQuery(localSearch);
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePincodeSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length === 6) {
      setDeliveryPincode(newPin.trim());
      setShowPincodePrompt(false);
    }
  };

  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Grooming',
    'Sports & Fitness'
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-3">
        <span>🎉 <strong>ShopEasy Super Saver Days</strong>: Instant 10% off with coupon <strong>SHOPEASY10</strong></span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="hidden sm:inline">Free Express Delivery on orders over ₹499</span>
        <span className="hidden md:inline text-slate-600">|</span>
        <span className="hidden md:inline text-emerald-400 font-medium">⚡ 100% Genuine Certified Goods</span>
      </div>

      {/* Main Amazon/Flipkart inspired Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setLocalSearch('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
                ShopEasy<span className="text-amber-400">.</span>
              </span>
              <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase -mt-1 flex items-center gap-1">
                Explore <span className="italic font-bold">Plus</span>
              </span>
            </div>
          </button>

          {/* Delivery Location Selector */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 text-xs relative">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <button
              onClick={() => setShowPincodePrompt(!showPincodePrompt)}
              className="text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 leading-tight">Deliver to</div>
              <div className="font-bold text-white flex items-center gap-0.5">
                <span>Mumbai {deliveryPincode}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </button>

            {/* Pincode Popover */}
            {showPincodePrompt && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl p-4 z-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900">Choose your location</h4>
                  <button onClick={() => setShowPincodePrompt(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">Enter an Indian 6-digit PIN code to check delivery availability and speeds.</p>
                <form onSubmit={handlePincodeSave} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 400001"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-slate-900 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Central Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
          <div className="flex rounded-lg overflow-hidden border border-transparent focus-within:ring-2 focus-within:ring-amber-400 bg-white">
            {/* Category Dropdown */}
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-slate-100 text-slate-700 text-xs px-3 py-2 border-r border-slate-200 outline-none cursor-pointer hidden md:block hover:bg-slate-200 transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {/* Input field */}
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search smartphones, laptops, fashion, kitchen appliances..."
              className="w-full px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none"
            />

            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="px-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Actions Bar */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  setActiveModal('auth');
                } else {
                  setShowUserMenu(!showUserMenu);
                }
              }}
              className="flex items-center gap-1.5 text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-slate-400 leading-tight">
                  {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, Sign in'}
                </span>
                <span className="font-bold text-xs text-white flex items-center gap-0.5">
                  Account & Lists
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {/* Account Popover Menu */}
            {showUserMenu && user && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl py-2 z-50 border border-slate-200 animate-fade-in"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold uppercase">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveModal('orders');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-slate-400" />
                  Your Orders & Returns
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveModal('admin');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Admin Control Center
                  </button>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveModal('auth');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Orders Fast Link */}
          <button
            onClick={() => {
              if (!user) setActiveModal('auth');
              else setActiveModal('orders');
            }}
            className="hidden sm:flex flex-col text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-400 leading-tight">Returns</span>
            <span className="font-bold text-xs text-white">& Orders</span>
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setActiveModal('cart')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer relative group"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-bold text-xs hidden md:inline">Cart</span>
          </button>
        </div>

      </div>

      {/* Secondary Category Ribbon */}
      <div className="bg-slate-800 text-slate-300 border-t border-slate-700/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 overflow-x-auto">
          
          <div className="flex items-center gap-5 shrink-0">
            <button
              onClick={() => setActiveCategory('All')}
              className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                activeCategory === 'All' ? 'text-amber-400' : 'text-white hover:text-amber-300'
              }`}
            >
              <Menu className="w-4 h-4" />
              <span>All Products</span>
            </button>

            {categories.filter((c) => c !== 'All').map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const catalogEl = document.getElementById('product-catalog');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`whitespace-nowrap hover:text-white transition-colors cursor-pointer ${
                  activeCategory === cat ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : 'text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="hidden lg:flex items-center gap-4 text-slate-400 text-[11px] shrink-0">
            <button onClick={() => setActiveModal('orders')} className="hover:text-amber-300 cursor-pointer">
              📦 Track Package
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('admin')} className="hover:text-amber-300 cursor-pointer text-amber-400/90 font-medium">
              ⚙️ Admin Portal
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
