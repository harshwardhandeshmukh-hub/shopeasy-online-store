import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, RotateCcw, Truck, Clock } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  category: string;
  image: string;
  discountText: string;
  themeColor: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Blockbuster Electronics Sale',
    subtitle: 'Flagship OLED Smartphones, Beryllium Headphones, and High-Performance Laptops',
    badge: 'Limited Time Deal',
    ctaText: 'Shop Electronics Deals',
    category: 'Electronics',
    image: '/src/assets/images/banner_electronics_sale_1792691966081.jpg',
    discountText: 'Up to 45% OFF + Extra 10% with SHOPEASY10',
    themeColor: 'from-slate-950 via-slate-900/90 to-transparent'
  },
  {
    id: 2,
    title: 'Festive Luxury Wardrobe',
    subtitle: 'Tailored European Linen Blazers, Cashmere Sweaters & Handcrafted Saddle Bags',
    badge: 'Trending Collection',
    ctaText: 'Explore Fashion Trends',
    category: 'Fashion',
    image: '/src/assets/images/hero_shopping_banner_1792683257533.jpg',
    discountText: 'Starting at ₹2,499 | Flat 40% OFF',
    themeColor: 'from-stone-950 via-stone-900/85 to-transparent'
  },
  {
    id: 3,
    title: 'Modern Smart Living & Kitchen',
    subtitle: 'Digital Rapid Convection Air Fryers, 400TC Organic Percale Cotton Bedding Sets',
    badge: 'Mega Home Festival',
    ctaText: 'Upgrade Your Home',
    category: 'Home & Kitchen',
    image: '/src/assets/images/product_kitchen_airfryer_1792691967721.jpg',
    discountText: 'Special Weekend Price: From ₹899',
    themeColor: 'from-zinc-950 via-zinc-900/85 to-transparent'
  }
];

export const HeroBanner: React.FC = () => {
  const { setActiveCategory } = useShop();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentIdx];

  const handleCtaClick = (cat: string) => {
    setActiveCategory(cat);
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Main Banner Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[340px] sm:min-h-[400px] lg:min-h-[460px] flex items-center shadow-lg group">
        
        {/* Background image */}
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out scale-102"
        />

        {/* Ambient Gradient Scrim */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.themeColor} z-10`}></div>

        {/* Slide Content */}
        <div className="relative z-20 max-w-2xl px-6 sm:px-12 lg:px-16 py-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-md shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display drop-shadow-sm">
            {slide.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed font-normal">
            {slide.subtitle}
          </p>

          <div className="text-amber-300 font-bold text-sm sm:text-base flex items-center gap-2">
            <span>{slide.discountText}</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCtaClick(slide.category)}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md hover:shadow-xl cursor-pointer"
            >
              {slide.ctaText} &rarr;
            </button>
            <button
              onClick={() => handleCtaClick('All')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-lg border border-white/20 transition-colors backdrop-blur-sm cursor-pointer"
            >
              View All Deals
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentIdx((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIdx === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Free Shipping</h4>
            <p className="text-[11px] text-slate-500">On all orders above ₹499</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">7-Day Easy Return</h4>
            <p className="text-[11px] text-slate-500">Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine</h4>
            <p className="text-[11px] text-slate-500">Direct from certified brands</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">24/7 Assistance</h4>
            <p className="text-[11px] text-slate-500">Instant dedicated support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
