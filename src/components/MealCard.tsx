import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Zap, ShieldCheck, Activity, Flame } from 'lucide-react';

interface MealCardProps {
  meal: any;
  lang: string;
  isSelected?: boolean;
  onSelect?: () => void;
  isCompact?: boolean;
  sizeMultiplier?: number;
}

export default function MealCard({ meal, lang, isSelected, onSelect, isCompact, sizeMultiplier = 1 }: MealCardProps) {
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
        
        <div className={`relative ${isCompact ? 'h-40' : 'h-64'} overflow-hidden`}>
          <img 
            src={img} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" 
            onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=BIO_LOAD_ERROR'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          {/* Badge Diagonal */}
          <div className="absolute top-4 left-0 bg-primary text-black px-6 py-1 text-[8px] font-mono font-black uppercase tracking-[0.3em] btn-cyber z-20">
            {meal.category?.toUpperCase() || 'CORE_LOAD'}
          </div>

          {/* Premium HUD Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-20">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/50 backdrop-blur-md text-primary text-[8px] font-mono">
               <ShieldCheck size={10} /> BIO_SAFE
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/10 backdrop-blur-md text-white text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
               <Activity size={10} /> SYNC_OK
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
            <div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    size={10} 
                    fill={idx < Math.round(meal.avg_rating || 5) ? "currentColor" : "none"}
                    className={idx < Math.round(meal.avg_rating || 5) ? "text-primary" : "text-white/20"} 
                  />
                ))}
              </div>
              <div className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                VERIFIED_BY_BIO_LAB
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-black text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{price}€</div>
            </div>
          </div>

          {isSelected && (
            <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none z-30" />
          )}
        </div>

        <div className="p-6 space-y-6 bg-gradient-to-b from-white/5 to-transparent flex-1 flex flex-col">
          <h4 className="text-xl font-display font-black uppercase text-white leading-tight group-hover:text-primary transition-colors">
            {name}
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-black/40 p-4 border border-white/5 rounded-xl group-hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={12} className="text-orange-500" />
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Energy_Load</span>
                </div>
                <div className="text-xl font-display font-bold text-white">{kcal} <span className="text-[10px] text-gray-500 font-mono uppercase">kcal</span></div>
             </div>
             <div className="bg-black/40 p-4 border border-white/5 rounded-xl group-hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={12} className="text-primary" />
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Bio_Engine</span>
                </div>
                <div className="text-xl font-display font-bold text-primary">{protein}G <span className="text-[10px] text-gray-500 font-mono uppercase">prot</span></div>
             </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest">
              <span className="text-gray-500">Saline_Index</span>
              <span className="text-white font-black">{meal.avg_salt_rating || 3.0} / 5.0</span>
            </div>
            <div className="h-0.5 bg-white/5 w-full relative">
              <div className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#FFD700]" style={{ width: `${(meal.avg_salt_rating || 3)/5*100}%` }} />
            </div>
          </div>

          <button className="w-full btn-cyber-outline py-3 text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            VIEW_DNA_SPECS
          </button>
        </div>
      </div>
    </motion.div>
  );
}

