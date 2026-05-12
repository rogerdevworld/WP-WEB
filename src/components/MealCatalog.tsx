import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Zap, CheckCircle2 } from 'lucide-react';
import MealCard from './MealCard';

export default function MealCatalog({ 
  meals, lang, limit, sizeMultiplier = 1, onViewDetails, onPurchase, user 
}: { 
  meals: any[], lang: string, limit?: number, sizeMultiplier?: number, 
  onViewDetails?: (meal: any) => void, onPurchase?: (selected: any[]) => void, user?: any 
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selections, setSelections] = useState<any[]>([]);

  const categories = [
    { id: 'ALL', label: lang === 'es' ? 'TODO' : 'ALL' },
    { id: 'breakfast', label: lang === 'es' ? 'DESAYUNO' : 'BREAKFAST' },
    { id: 'lunch', label: lang === 'es' ? 'ALMUERZO' : 'LUNCH' },
    { id: 'dinner', label: lang === 'es' ? 'CENA' : 'DINNER' },
    { id: 'snack', label: lang === 'es' ? 'SNACK' : 'SNACK' },
    { id: 'juices', label: lang === 'es' ? 'JUGOS' : 'JUICES' },
  ];

  const toggleSelection = (meal: any) => {
    if (selections.find(m => m.id_code === meal.id_code)) {
      setSelections(selections.filter(m => m.id_code !== meal.id_code));
    } else {
      setSelections([...selections, { ...meal, price: meal.price * sizeMultiplier }]);
    }
  };

  const totalPrice = selections.reduce((acc, m) => acc + parseFloat(m.price), 0);

  const checkIsRecommended = (meal: any) => {
    if (!user) return false;
    const kcal = parseFloat(meal.kcal || 0);
    const protein = parseFloat(meal.protein || 0);
    const isLoss = (parseFloat(user.weight) || 0) > (parseFloat(user.target_weight) || 0);
    const isGain = (parseFloat(user.weight) || 0) < (parseFloat(user.target_weight) || 0);

    if (isLoss && kcal < 500) return true;
    if (isGain && kcal > 600) return true;
    if (protein > 35) return true;
    return false;
  };

  const filteredMeals = selectedCategory === 'ALL' 
    ? meals 
    : meals.filter(m => m.category?.toLowerCase() === selectedCategory.toLowerCase());

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
    <div className="space-y-12 relative pb-32">
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
              <motion.div key={meal.id_code} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <div onClick={() => toggleSelection(meal)} className="cursor-pointer relative">
                   <MealCard 
                    meal={meal} 
                    lang={lang} 
                    sizeMultiplier={sizeMultiplier}
                    onViewDetails={onViewDetails}
                    isRecommended={checkIsRecommended(meal)}
                    isSelected={!!selections.find(m => m.id_code === meal.id_code)}
                  />
                  {selections.find(m => m.id_code === meal.id_code) && (
                    <div className="absolute top-4 right-4 text-primary animate-bounce">
                      <CheckCircle2 size={24} fill="black" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Purchase Button */}
      <AnimatePresence>
        {selections.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 right-12 z-50"
          >
            <button 
              onClick={() => { onPurchase?.(selections); setSelections([]); }}
              className="bg-primary text-black px-8 py-5 rounded-2xl shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center gap-6 group hover:scale-105 transition-all"
            >
              <div className="flex flex-col text-left border-r border-black/10 pr-6">
                <span className="text-[10px] font-mono font-bold uppercase opacity-60">Total Protocolo</span>
                <span className="text-2xl font-display font-black">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex items-center gap-3 font-black text-sm uppercase italic">
                <Zap size={18} fill="currentColor" />
                PROTOCOLAR Y PAGAR
                <CreditCard size={18} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
