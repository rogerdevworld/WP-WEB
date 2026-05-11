import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Zap, ShieldCheck, Activity, Flame, Info } from 'lucide-react';

interface MealCardProps {
  meal: any;
  lang: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewDetails?: (meal: any) => void;
  isCompact?: boolean;
  sizeMultiplier?: number;
  isRecommended?: boolean;
}

export default function MealCard({ 
  meal, lang, isSelected, onSelect, onViewDetails, isCompact, 
  sizeMultiplier = 1, isRecommended 
}: MealCardProps) {
  if (!meal) return null;

  const name = lang === 'es' ? (meal.name_es || meal.name?.es || 'BIO_FUEL') : (meal.name_en || meal.name?.en || 'BIO_FUEL');
  const img = meal.img_path || meal.img;
  
  const basePrice = parseFloat(meal.price) || 12.5;
  const multiplier = sizeMultiplier === 0.8 ? 0.8 : sizeMultiplier === 1.3 ? 1.2 : 1;
  const price = (basePrice * multiplier).toFixed(2);
  
  const kcal = Math.round((parseFloat(meal.kcal) || 0) * sizeMultiplier);
  const protein = Math.round((parseFloat(meal.protein) || 25) * sizeMultiplier);
  
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      onClick={onSelect}
      className={`relative group cursor-pointer transition-all duration-500 ${
        isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      <div className={`card-cyber relative overflow-hidden flex flex-col h-full border-t-2 ${isSelected ? 'border-primary' : 'border-white/10'}`}>
        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-transparent to-primary/50 opacity-30" />
        
        <div className={`relative ${isCompact ? 'h-64' : 'h-80'} overflow-hidden rounded-t-2xl`}>
          <motion.img 
            src={img} 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100" 
            onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=BIO_LOAD_ERROR'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
          
          {/* Badge Diagonal */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/50 backdrop-blur-md text-primary text-[8px] font-mono rounded-full z-20 uppercase tracking-[0.2em]">
             <Zap size={10} className="animate-pulse" /> {meal.category || 'CORE_LOAD'}
          </div>

          {/* Premium HUD Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-20">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/50 backdrop-blur-md text-primary text-[8px] font-mono rounded-full uppercase tracking-widest">
               <ShieldCheck size={10} /> BIO_SAFE
            </div>
            {isRecommended && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 backdrop-blur-md text-green-500 text-[8px] font-mono rounded-full uppercase tracking-widest animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                 <CheckCircle2 size={10} /> RECOMENDADO PARA MÍ
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/10 backdrop-blur-md text-white text-[8px] font-mono rounded-full opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
               <Activity size={10} /> SYNC_OK
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-display font-black text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{price}€</div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    size={10} 
                    fill={idx < Math.round(meal.avg_rating || 5) ? "currentColor" : "none"}
                    className={`${idx < Math.round(meal.avg_rating || 5) ? "text-primary" : "text-white/10"}`} 
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-[1.5px] justify-end items-end mb-2 h-8 opacity-60">
                {/* Chef Hat Shape Barcode */}
                {[4, 4, 10, 10, 14, 14, 16, 16, 14, 14, 10, 10, 4, 4].map((h, i) => (
                  <div key={i} className="bg-white" style={{ width: i % 3 === 0 ? '3px' : '1.5px', height: `${h * 2}px` }} />
                ))}
              </div>
              <div className="text-[9px] font-mono text-white/40 tracking-tighter truncate max-w-[100px] uppercase">
                {meal.barcode || 'NO_CODE'}
              </div>
            </div>
          </div>

          {isSelected && (
            <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none z-30" />
          )}
        </div>

        <div className="p-4 space-y-4 bg-gradient-to-b from-white/5 to-transparent flex-1 flex flex-col">
          <div className="flex justify-between items-center gap-4">
            <h4 className="text-lg font-display font-black uppercase text-white leading-tight group-hover:text-primary transition-colors truncate">
              {name}
            </h4>
            <button 
              onClick={(e) => { e.stopPropagation(); onViewDetails?.(meal); }}
              className="shrink-0 p-2 text-gray-500 hover:text-primary transition-all bg-white/5 rounded-lg border border-white/10 hover:bg-primary/10"
            >
              <Info size={14} />
            </button>
          </div>
          
          <div className="bg-black/40 p-3 border border-white/5 rounded-xl group-hover:border-primary/20 transition-all flex items-center justify-between divide-x divide-white/10">
             <div className="flex-1 text-center px-1">
                <div className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mb-1">Energy</div>
                <div className="text-base font-display font-bold text-white">{kcal}<span className="text-[8px] ml-0.5 opacity-50 text-gray-400">K</span></div>
             </div>
             <div className="flex-1 text-center px-1">
                <div className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mb-1">Protein</div>
                <div className="text-base font-display font-bold text-primary">{protein}<span className="text-[8px] ml-0.5 opacity-50 text-primary/50">G</span></div>
             </div>
             <div className="flex-1 text-center px-1">
                <div className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mb-1">Carbs</div>
                <div className="text-base font-display font-bold text-white">{Math.round((meal.carbs || 30) * sizeMultiplier)}<span className="text-[8px] ml-0.5 opacity-50 text-gray-400">G</span></div>
             </div>
          </div>

          <div className="mt-auto" />
        </div>
      </div>
    </motion.div>
  );
}
