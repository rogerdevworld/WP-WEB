import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat, ScrollText, ListChecks, Flame, Zap, Droplets } from 'lucide-react';

interface MealDetailModalProps {
  meal: any;
  onClose: () => void;
  lang: string;
}

export default function MealDetailModal({ meal, onClose, lang }: MealDetailModalProps) {
  const name = lang === 'es' ? (meal.name_es || meal.name?.es) : (meal.name_en || meal.name?.en);
  const description = lang === 'es' ? meal.description_es : meal.description_en;

  // Safe ingredients parsing
  const ingredientsList = Array.isArray(meal.ingredients) 
    ? meal.ingredients 
    : (typeof meal.ingredients === 'string' ? meal.ingredients.split(',') : []);

  return (
    <div className="fixed inset-0 z-[150] flex justify-end pointer-events-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      {/* Side Panel */}
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl bg-black border-l border-white/10 h-full overflow-hidden flex flex-col pointer-events-auto shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 p-2 bg-white/5 text-gray-500 hover:text-primary rounded-full border border-white/10 transition-all hover:scale-110"
        >
          <X size={20} />
        </button>

        {/* Media Section */}
        <div className="relative h-72 shrink-0">
          <img 
            src={meal.img_path || meal.img} 
            className="w-full h-full object-cover"
            alt={name}
            onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=IMAGE_NOT_FOUND'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          <div className="absolute bottom-6 left-8 right-8">
            <div className="inline-block px-3 py-1 bg-primary text-black text-[10px] font-mono font-black rounded-full uppercase tracking-widest mb-3">
              {meal.category || 'GENERIC_CORE'}
            </div>
            <h3 className="text-4xl font-display font-black text-white uppercase leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {name}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar space-y-12">
            {/* Quick Macros */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-orange-500">
                  <Flame size={14} />
                  <span className="text-[8px] font-mono uppercase tracking-widest">Energy</span>
                </div>
                <div className="text-xl font-display font-bold text-white">{meal.kcal} <span className="text-[10px] text-gray-500 font-mono">KCAL</span></div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <Zap size={14} />
                  <span className="text-[8px] font-mono uppercase tracking-widest">Proteína</span>
                </div>
                <div className="text-xl font-display font-bold text-white">{meal.protein}G</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-blue-500">
                  <Droplets size={14} />
                  <span className="text-[8px] font-mono uppercase tracking-widest">Agua</span>
                </div>
                <div className="text-xl font-display font-bold text-white">LOW</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <ScrollText size={18} />
                <h4 className="text-xs font-mono font-black uppercase tracking-[0.3em]">Resumen_Ejecutivo</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed font-light italic">
                "{description || 'Sin descripción disponible en los archivos del Bio-Lab.'}"
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <ListChecks size={18} />
                <h4 className="text-xs font-mono font-black uppercase tracking-[0.3em]">Componentes_Activos</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ingredientsList.length > 0 ? ingredientsList.map((ing: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-300 bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                    {typeof ing === 'string' ? ing.trim() : JSON.stringify(ing)}
                  </div>
                )) : (
                  <div className="text-xs text-gray-500 italic">No hay ingredientes detallados.</div>
                )}
              </div>
            </div>

            {/* Preparation */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <ChefHat size={18} />
                <h4 className="text-xs font-mono font-black uppercase tracking-[0.3em]">Protocolo_de_Preparación</h4>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <p className="text-xs text-gray-400 leading-loose whitespace-pre-line font-mono">
                  {meal.recipe || meal.preparation || 'Protocolo estándar de cocción a baja temperatura para preservar bio-disponibilidad.'}
                </p>
              </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
