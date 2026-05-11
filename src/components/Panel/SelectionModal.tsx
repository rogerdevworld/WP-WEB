import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Zap, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import MealCard from '../MealCard';

interface SelectionModalProps {
  editingDay: number | null;
  setEditingDay: (day: number | null) => void;
  dailySelections: any;
  catalogMeals: any[];
  mealOptions: any;
  user: any;
  lang: string;
  handleSelection: (day: number, type: string, mealId: string) => void;
  savePlan: (day: number) => void;
  t: any;
  onViewDetails?: (meal: any) => void;
}

export default function SelectionModal({
  editingDay, setEditingDay, dailySelections, catalogMeals, 
  mealOptions, user, lang, handleSelection, savePlan, t, onViewDetails
}: SelectionModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('desayuno');

  if (editingDay === null) return null;
  const selection = dailySelections[editingDay] || {};

  const sourceData = catalogMeals.length > 0 ? catalogMeals : 
    Object.entries(mealOptions).flatMap(([cat, meals]: any) => 
      meals.map((m: any) => ({ ...m, id_code: m.id, category: cat, name_es: m.name.es, name_en: m.name.en, price: 5.5, protein: 25, cost: 1.2 }))
    );

  // Mapping categories for the UI
  const categories = [
    { id: 'desayuno', backendId: 'breakfast', label: lang === 'es' ? 'DESAYUNO' : 'BREAKFAST' },
    { id: 'almuerzo', backendId: 'lunch', label: lang === 'es' ? 'ALMUERZO' : 'LUNCH' },
    { id: 'cena', backendId: 'dinner', label: lang === 'es' ? 'CENA' : 'DINNER' },
    { id: 'snack', backendId: 'snack', label: lang === 'es' ? 'SNACK' : 'SNACK' },
    { id: 'jugos', backendId: 'juices', label: lang === 'es' ? 'JUGOS' : 'JUICES' },
  ];

  const currentCat = categories.find(c => c.id === activeCategory);
  const filteredMeals = sourceData.filter(m => 
    m.category?.toLowerCase() === currentCat?.backendId?.toLowerCase()
  );

  const totalPrice = Object.entries(selection).reduce((total: number, [type, ids]: any) => {
    const typePrice = ids.reduce((typeTotal: number, id: string) => {
      const meal = sourceData.find((m: any) => m.id_code === id);
      return typeTotal + (meal ? parseFloat(meal.price) : 0);
    }, 0);
    return total + typePrice;
  }, 0);

  const nextCategory = () => {
    const currentIndex = categories.findIndex(c => c.id === activeCategory);
    if (currentIndex < categories.length - 1) {
      setActiveCategory(categories[currentIndex + 1].id);
    }
  };

  const prevCategory = () => {
    const currentIndex = categories.findIndex(c => c.id === activeCategory);
    if (currentIndex > 0) {
      setActiveCategory(categories[currentIndex - 1].id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card-cyber max-w-6xl w-full p-8 relative h-[90vh] flex flex-col overflow-hidden"
      >
        <button onClick={() => setEditingDay(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white z-50">
          <X size={24} />
        </button>

        {/* Header Section */}
        <div className="text-center mb-8 shrink-0">
          <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">DEPLOYMENT_CONFIG</div>
          <h3 className="text-4xl font-display font-black uppercase text-white">
            {lang === 'es' ? 'Protocolo Día' : 'Day Protocol'} {editingDay}
          </h3>
        </div>

        {/* Navigation Filter Bar */}
        <div className="flex justify-center mb-10 shrink-0">
          <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl relative overflow-hidden">
            {categories.map((cat) => {
              const hasSelection = selection[cat.id]?.length > 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-8 py-3 rounded-xl text-[10px] font-mono font-black transition-all duration-300 uppercase tracking-widest flex items-center gap-2 ${
                    activeCategory === cat.id ? 'text-black' : (hasSelection ? 'text-primary' : 'text-gray-500 hover:text-white')
                  }`}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeSelectionTab"
                      className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                  {hasSelection && activeCategory !== cat.id && (
                    <CheckCircle2 size={12} className="relative z-10 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMeals.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
                   <p className="text-gray-500 font-mono text-sm tracking-widest animate-pulse">CARGANDO_OPCIONES_DE_{activeCategory.toUpperCase()}...</p>
                </div>
              ) : filteredMeals.map((meal: any) => {
                const userSizeMultiplier = user?.tupper_size === 'S' ? 0.8 : user?.tupper_size === 'L' ? 1.3 : 1;
                const isSelected = selection[activeCategory]?.includes(meal.id_code);
                
                return (
                  <MealCard
                    key={meal.id_code}
                    meal={meal}
                    lang={lang}
                    isCompact={true}
                    isSelected={isSelected}
                    onSelect={() => handleSelection(editingDay, activeCategory, meal.id_code)}
                    onViewDetails={onViewDetails}
                    sizeMultiplier={userSizeMultiplier}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Action Footer */}
        <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center shrink-0">
          <div className="flex gap-4">
            <button 
              onClick={prevCategory}
              disabled={activeCategory === categories[0].id}
              className="p-4 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-20 hover:bg-primary/20 hover:text-primary transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextCategory}
              disabled={activeCategory === categories[categories.length - 1].id}
              className="p-4 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-20 hover:bg-primary/20 hover:text-primary transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-white/5 px-8 py-3 rounded-xl border border-white/10 text-right">
               <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">TOTAL_DIARIO_PROTOCOLO</div>
               <div className="text-2xl font-display font-black text-primary">{totalPrice.toFixed(2)}€</div>
            </div>
            <button 
              onClick={() => savePlan(editingDay)}
              className="px-12 py-5 bg-primary text-black font-display font-black uppercase text-sm tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              <Save size={20} />
              {lang === 'es' ? 'FINALIZAR CARGA' : 'FINALIZE LOAD'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
