import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden flex flex-col group hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative">
      
      {/* Badge Tags on Card Top */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.badge && (
          <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-bold text-[10px] rounded shadow-xs flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-amber-300" />
            {product.badge}
          </span>
        )}
      </div>

      {/* Image Container with Quick View overlay */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative h-60 bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/banner_electronics_sale_1792691966081.jpg';
          }}
        />

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600 uppercase tracking-wider">{product.brand}</span>
            <span className="text-slate-400">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-600 line-clamp-2 leading-snug cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-700 text-white text-[11px] font-bold rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-slate-500">
              ({product.reviewsCount.toLocaleString()} ratings)
            </span>
          </div>

          {/* Pricing & Savings */}
          <div className="pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-950 tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-emerald-600 font-semibold">
                Save {formatINR(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Prime / Fast Delivery note */}
          <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-0.5">
            <span className="font-bold text-amber-600">Prime</span>
            <span>· Get it by Tomorrow</span>
          </div>

          {/* Low Stock Warning */}
          {isLowStock && (
            <p className="text-[11px] text-amber-700 font-medium">
              Only {product.stock} units left in stock!
            </p>
          )}
          {isOutOfStock && (
            <p className="text-[11px] text-rose-600 font-bold">
              Currently Out of Stock
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
