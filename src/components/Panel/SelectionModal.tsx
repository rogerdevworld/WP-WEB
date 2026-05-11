import React from 'react';
import { motion } from 'framer-motion';
import { X, Save, Zap } from 'lucide-react';
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
  if (editingDay === null) return null;
  const selection = dailySelections[editingDay] || {};

  const sourceData = catalogMeals.length > 0 ? catalogMeals : 
    Object.entries(mealOptions).flatMap(([cat, meals]: any) => 
      meals.map((m: any) => ({ ...m, id_code: m.id, category: cat, name_es: m.name.es, name_en: m.name.en, price: 5.5, protein: 25, cost: 1.2 }))
    );

  const categorizedMeals = sourceData.reduce((acc: any, meal: any) => {
    const cat = meal.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(meal);
    return acc;
  }, {});

  const totalPrice = Object.entries(selection).reduce((total: number, [type, ids]: any) => {
    const typePrice = ids.reduce((typeTotal: number, id: string) => {
      const meal = sourceData.find((m: any) => m.id_code === id);
      return typeTotal + (meal ? parseFloat(meal.price) : 0);
    }, 0);
    return total + typePrice;
  }, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-cyber max-w-6xl w-full p-8 relative max-h-[90vh] flex flex-col"
      >
        <button onClick={() => setEditingDay(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-8 border-b border-white/5 pb-6">
          <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">DEPLOYMENT_CONFIG</div>
          <h3 className="text-4xl font-display font-black uppercase text-white">
            {lang === 'es' ? 'Protocolo Día' : 'Day Protocol'} {editingDay}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-12 pr-4">
          {Object.entries(categorizedMeals).map(([type, typeMeals]: any) => {
            const currentSelections = selection[type] || [];
            const isMultiple = currentSelections.length > 1;

            return (
              <div key={type} className="space-y-6">
                <div className="flex justify-between items-center bg-white/2 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <label className="text-xs font-mono text-primary uppercase tracking-[0.3em] font-black">
                      {(t.panel.meals as any)[type] || type}
                    </label>
                  </div>
                  {isMultiple && (
                    <span className="text-[10px] font-mono text-yellow-500 animate-pulse">
                      {t.panel.meals.warningMultiple}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeMeals.map((meal: any) => {
                    const userSizeMultiplier = user?.tupper_size === 'S' ? 0.8 : user?.tupper_size === 'L' ? 1.3 : 1;
                    return (
                      <MealCard
                        key={meal.id_code}
                        meal={meal}
                        lang={lang}
                        isCompact={true}
                        isSelected={currentSelections.includes(meal.id_code)}
                        onSelect={() => handleSelection(editingDay, type, meal.id_code)}
                        onViewDetails={onViewDetails}
                        sizeMultiplier={userSizeMultiplier}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
          <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10">
             <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">MONTO_DIARIO_ESTIMADO</div>
             <div className="text-2xl font-display font-black text-primary">{totalPrice.toFixed(2)}€</div>
          </div>
          <button 
            onClick={() => savePlan(editingDay)}
            className="px-10 py-4 bg-primary text-black font-display font-black uppercase text-sm tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
          >
            <Save size={18} />
            {lang === 'es' ? 'CONFIRMAR CARGA DIARIA' : 'CONFIRM DAILY LOAD'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
