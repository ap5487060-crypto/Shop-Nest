import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CategoryHighlightsProps {
  onSelectCategory: (catId: string, subId?: string) => void;
}

export const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({ onSelectCategory }) => {
  const { categories } = useStore();

  const curatedShortcuts = [
    {
      name: 'Kurtis',
      sub: 'kurtis',
      catId: 'womens-fashion',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
      badge: 'Bestseller',
    },
    {
      name: 'Kurti Sets',
      sub: 'kurti-sets',
      catId: 'womens-fashion',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&auto=format&fit=crop&q=80',
      badge: 'Trending',
    },
    {
      name: 'Sarees',
      sub: 'sarees',
      catId: 'womens-fashion',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80',
      badge: 'Organza & Silk',
    },
    {
      name: 'Dresses',
      sub: 'dresses',
      catId: 'womens-fashion',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop&q=80',
      badge: 'Floral Maxis',
    },
    {
      name: 'Short Kurtis',
      sub: 'tops',
      catId: 'womens-fashion',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80',
      badge: 'Denim Pair',
    },
    {
      name: 'Jewellery',
      sub: 'earrings',
      catId: 'jewellery-accessories',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
      badge: 'Jhumkas',
    },
    {
      name: 'Bags & Totes',
      sub: 'handbags',
      catId: 'bags-footwear',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
      badge: 'Embroidered',
    },
    {
      name: 'Home Finds',
      sub: 'decor',
      catId: 'home-decor',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&auto=format&fit=crop&q=80',
      badge: 'Aesthetic',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Shop by Popular Style</span>
            <Sparkles className="w-4 h-4 text-pink-600" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Explore our most-loved handpicked fashion categories</p>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {curatedShortcuts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectCategory(item.catId, item.sub)}
            className="group flex flex-col items-center text-center p-2 rounded-2xl hover:bg-pink-50/60 transition-all cursor-pointer"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <span className="mt-2 text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">
              {item.name}
            </span>
            <span className="text-[10px] text-pink-600 font-semibold bg-pink-100/70 px-1.5 py-0.2 rounded-full mt-0.5">
              {item.badge}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
