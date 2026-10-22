import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  MapPin
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setActiveModal,
    deliveryPincode
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  if (!selectedProduct) return null;

  const discountPercent = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setActiveModal('checkout');
  };

  const isOutOfStock = selectedProduct.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Image Showcase */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-center min-h-[340px] relative overflow-hidden group">
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-rose-600 text-white font-extrabold text-xs rounded shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
                {selectedProduct.badge && (
                  <span className="absolute top-4 right-14 px-2.5 py-1 bg-slate-900 text-amber-300 font-bold text-xs rounded shadow-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-300" />
                    {selectedProduct.badge}
                  </span>
                )}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-h-80 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Guarantees Row */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600 pt-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Free Delivery</span>
                  <span className="text-[10px] text-slate-400">Order over ₹499</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">7 Days Return</span>
                  <span className="text-[10px] text-slate-400">Easy replacement</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">1 Yr Warranty</span>
                  <span className="text-[10px] text-slate-400">Brand genuine</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Pricing & Purchase Actions */}
            <div className="space-y-5">
              
              {/* Brand & Title */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  <span className="text-amber-700">{selectedProduct.brand}</span>
                  <span>·</span>
                  <span>{selectedProduct.category}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display leading-snug">
                  {selectedProduct.name}
                </h2>
              </div>

              {/* Ratings & Verified Badges */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-700 text-white text-xs font-bold rounded-md">
                  <span>{selectedProduct.rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-xs text-slate-600 font-medium">
                  {selectedProduct.reviewsCount.toLocaleString()} Verified Customer Ratings
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-amber-600 font-bold">ShopEasy Certified</span>
              </div>

              {/* Price & Deal Banner */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
                    {formatINR(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      M.R.P.: {formatINR(selectedProduct.originalPrice)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-extrabold text-rose-600">
                      Save {discountPercent}% ({formatINR(selectedProduct.originalPrice - selectedProduct.price)})
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Inclusive of all taxes. Free shipping on this item.</p>
              </div>

              {/* Bank & Coupon Offers Box */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Available Offers</h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2 p-2 bg-amber-50/60 border border-amber-200/70 rounded-lg">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Special Offer:</strong> Flat 10% instant discount using code <strong>SHOPEASY10</strong> at checkout.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-emerald-50/60 border border-emerald-200/70 rounded-lg">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Bank Offer:</strong> Up to ₹1,500 discount on Select Credit & Debit Cards.
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Estimation */}
              <div className="flex items-center gap-2 text-xs text-slate-700 p-3 bg-white border border-slate-200 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  Deliver to <strong>Mumbai {deliveryPincode}</strong> — <span className="text-emerald-700 font-bold">Fast Delivery Tomorrow by 11 AM</span>
                </div>
              </div>

              {/* Stock Status & Quantity */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-bold text-sm cursor-pointer disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= selectedProduct.stock}
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                    className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-bold text-sm cursor-pointer disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs">
                  {selectedProduct.stock > 15 ? (
                    <span className="text-emerald-700 font-bold">In Stock</span>
                  ) : selectedProduct.stock > 0 ? (
                    <span className="text-amber-700 font-bold">Only {selectedProduct.stock} units left!</span>
                  ) : (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    addToCart(selectedProduct, quantity);
                    setSelectedProduct(null);
                  }}
                  className={`py-3 px-4 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-950 hover:shadow-md'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`py-3 px-4 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Tabs: Description, Technical Specs & Reviews */}
          <div className="mt-10 pt-6 border-t border-slate-200 space-y-4">
            <div className="flex border-b border-slate-200 gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 text-xs font-bold cursor-pointer transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-slate-950 text-slate-950'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Product Description
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 text-xs font-bold cursor-pointer transition-colors ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-slate-950 text-slate-950'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-xs font-bold cursor-pointer transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-slate-950 text-slate-950'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Customer Reviews ({selectedProduct.reviewsCount})
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="text-xs text-slate-700 leading-relaxed max-w-3xl space-y-3">
                <p>{selectedProduct.description}</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Engineered for optimum performance, premium durability, and daily elegance.</li>
                  <li>Manufactured in compliance with strict international quality and safety benchmarks.</li>
                  <li>Comes with manufacturer warranty card, standard accessory bundle, and quick-start user guide.</li>
                </ul>
              </div>
            )}

            {/* Tab 2: Specs */}
            {activeTab === 'specs' && (
              <div className="max-w-2xl border border-slate-200 rounded-xl overflow-hidden text-xs">
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 ? (
                  <table className="w-full text-left divide-y divide-slate-200">
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(selectedProduct.specs).map(([k, v]) => (
                        <tr key={k} className="hover:bg-slate-50">
                          <td className="p-3 bg-slate-50 font-semibold text-slate-600 w-1/3">{k}</td>
                          <td className="p-3 text-slate-900">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-slate-500">Standard specifications apply for this category item.</div>
                )}
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-2xl text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{selectedProduct.rating.toFixed(1)} out of 5</div>
                    <div className="text-slate-500">Based on {selectedProduct.reviewsCount} customer experiences</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-700 font-bold">96% of customers recommend</div>
                    <div className="text-slate-400">Verified buyers only</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Rohit Verma</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Verified Purchase</span>
                    </div>
                    <div className="text-amber-500">★★★★★</div>
                    <p className="text-slate-600">Exceeded my expectations! Prompt packaging, genuine quality, and flawless build.</p>
                  </div>

                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Sneha Kulkarni</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Verified Purchase</span>
                    </div>
                    <div className="text-amber-500">★★★★★</div>
                    <p className="text-slate-600">Great value for money during the sale. Delivered the next morning in perfect condition.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
