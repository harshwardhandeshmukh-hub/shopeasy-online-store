import React from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronUp, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveModal, setActiveCategory } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 bg-slate-900 text-slate-300 text-xs">
      {/* Back to top banner */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 font-bold cursor-pointer border-b border-slate-700/60"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Back to Top</span>
      </button>

      {/* 4 Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Column 1 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-tight font-display">Get to Know Us</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#about" onClick={(e) => e.preventDefault()} className="hover:text-white">About ShopEasy</a></li>
            <li><a href="#careers" onClick={(e) => e.preventDefault()} className="hover:text-white">Careers at ShopEasy</a></li>
            <li><a href="#press" onClick={(e) => e.preventDefault()} className="hover:text-white">Press Releases</a></li>
            <li><a href="#sustainability" onClick={(e) => e.preventDefault()} className="hover:text-white">Eco & Sustainable Packaging</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-tight font-display">Shop Categories</h4>
          <ul className="space-y-2 text-slate-400">
            <li><button onClick={() => setActiveCategory('Electronics')} className="hover:text-white cursor-pointer">Electronics & Gadgets</button></li>
            <li><button onClick={() => setActiveCategory('Fashion')} className="hover:text-white cursor-pointer">Men & Women Fashion</button></li>
            <li><button onClick={() => setActiveCategory('Home & Kitchen')} className="hover:text-white cursor-pointer">Home & Smart Kitchen</button></li>
            <li><button onClick={() => setActiveCategory('Beauty & Grooming')} className="hover:text-white cursor-pointer">Beauty & Wellness</button></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-tight font-display">Demo Credentials</h4>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-[11px] space-y-1.5 text-slate-300 font-mono">
            <div>
              <span className="text-amber-400 font-bold block">Customer Account:</span>
              <span>user@shopeasy.com / password123</span>
            </div>
            <div className="pt-1 border-t border-slate-700">
              <span className="text-amber-400 font-bold block">Admin Account:</span>
              <span>admin@shopeasy.com / admin123</span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('admin')}
            className="text-[11px] text-amber-400 font-semibold hover:underline cursor-pointer block"
          >
            Launch Admin Operations &rarr;
          </button>
        </div>

        {/* Column 4 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-tight font-display">Help & Customer Care</h4>
          <ul className="space-y-2 text-slate-400">
            <li><button onClick={() => setActiveModal('orders')} className="hover:text-white cursor-pointer">Your Orders & Returns</button></li>
            <li><button onClick={() => setActiveModal('cart')} className="hover:text-white cursor-pointer">Shipping Rates & Policies</button></li>
            <li><a href="#help" onClick={(e) => e.preventDefault()} className="hover:text-white">100% Purchase Protection</a></li>
            <li><a href="#assistant" onClick={(e) => e.preventDefault()} className="hover:text-white">ShopEasy Help Assistant</a></li>
          </ul>
        </div>

      </div>

      {/* Payment partners & certifications */}
      <div className="border-t border-slate-800 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
              S
            </div>
            <span className="font-bold text-white text-sm">ShopEasy Store</span>
            <span className="text-slate-600">|</span>
            <span>India's Premium Shopping Destination</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span className="px-2 py-0.5 bg-slate-800 rounded font-semibold text-slate-200">UPI Instant</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded font-semibold text-slate-200">RuPay</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded font-semibold text-slate-200">Visa / Mastercard</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded font-semibold text-slate-200">Cash on Delivery</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-slate-900 text-center text-slate-500 text-[10px]">
          &copy; {new Date().getFullYear()} ShopEasy Store Inc. Built with React, Tailwind CSS, Node.js and Express. Simulated sandbox payment environment for demonstration purposes.
        </div>
      </div>
    </footer>
  );
};
