import React, { useState } from 'react';
import MealCard from './MealCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function MealCatalog({ meals, lang, limit, sizeMultiplier, onViewDetails }: { meals: any[], lang: string, limit?: number, sizeMultiplier?: number, onViewDetails?: (meal: any) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: lang === 'es' ? 'TODO' : 'ALL' },
    { id: 'breakfast', label: lang === 'es' ? 'DESAYUNO' : 'BREAKFAST' },
    { id: 'main', label: lang === 'es' ? 'ALMUERZO/CENA' : 'LUNCH/DINNER' },
    { id: 'snack', label: lang === 'es' ? 'SNACK' : 'SNACK' },
    { id: 'juices', label: lang === 'es' ? 'JUGOS' : 'JUICES' },
  ];

  const filteredMeals = selectedCategory === 'ALL' 
    ? meals 
    : meals.filter(m => {
        const cat = m.category?.toLowerCase();
        if (selectedCategory === 'main') return cat === 'lunch' || cat === 'dinner';
        return cat === selectedCategory.toLowerCase();
      });

  const visibleMeals = limit ? filteredMeals.slice(0, limit) : filteredMeals;

  if (!meals || meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-gray-500 font-mono text-sm tracking-widest uppercase animate-pulse">Sincronizando_Bio_Cargas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Category Filter Bar */}
      {!limit && (
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-6 py-2.5 rounded-xl text-[10px] font-mono font-black transition-all duration-300 uppercase tracking-widest ${
                  selectedCategory === cat.id ? 'text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {selectedCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {visibleMeals.length === 0 ? (
        <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/2 text-gray-500 font-mono text-xs uppercase tracking-widest">
          No se han encontrado bio-cargas para esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleMeals.map((meal) => (
              <motion.div
                key={meal.id_code}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <MealCard 
                  meal={meal} 
                  lang={lang} 
                  sizeMultiplier={sizeMultiplier}
                  onViewDetails={onViewDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
