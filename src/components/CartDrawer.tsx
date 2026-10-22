import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromo,
    activeModal,
    setActiveModal,
    setActiveCategory
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (activeModal !== 'cart') return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
    }
  };

  const freeShippingRemaining = Math.max(0, 499 - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right relative">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base tracking-tight font-display">Shopping Cart</h3>
            <span className="text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
              {cartCount} item{cartCount === 1 ? '' : 's'}
            </span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs">
          {freeShippingRemaining > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-amber-900">
                <span>Add <strong>{formatINR(freeShippingRemaining)}</strong> more for FREE Express Shipping</span>
                <span>Threshold: ₹499</span>
              </div>
              <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / 499) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>You've unlocked FREE Express Shipping on this order!</span>
            </div>
          )}
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Your Shopping Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our catalog for the latest electronics, fashion trends, and daily essentials.
              </p>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setActiveCategory('All');
                  const catEl = document.getElementById('product-catalog');
                  if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-18 h-18 object-contain rounded-lg bg-white p-1 border border-slate-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 -mr-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500">{item.brand}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-950 tabular-nums">
                        {formatINR(item.price * item.quantity)}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="text-[10px] text-slate-400 line-through tabular-nums">
                          {formatINR(item.originalPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Order Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo Code (SHOPEASY10)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded-lg focus:outline-slate-900 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span className="font-semibold">Promo code "{appliedPromo}" active</span>
                <span className="font-bold">-{formatINR(cartDiscount)}</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatINR(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount</span>
                  <span className="tabular-nums">-{formatINR(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping & Delivery Fee</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {cartShipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(cartShipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="tabular-nums text-base">{formatINR(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => setActiveModal('checkout')}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe and Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
