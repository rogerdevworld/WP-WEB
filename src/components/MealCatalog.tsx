import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function MealCatalog({ meals, lang, limit }: { meals: any[], lang: string, limit?: number }) {
  const visibleMeals = limit ? meals.slice(0, limit) : meals;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {visibleMeals.map((meal) => (
        <motion.div key={meal.id_code} whileHover={{ y: -5 }} className="card-cyber overflow-hidden group">
          <div className="relative h-56 overflow-hidden">
            <img src={meal.img_path} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=IMAGE_NOT_FOUND'} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-mono text-primary uppercase tracking-widest">
              {meal.category}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <div className="flex gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={10} className={idx < Math.round(meal.avg_rating || 5) ? 'text-primary fill-primary' : 'text-gray-700'} />
                  ))}
                </div>
                <div className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                  {meal.total_reviews || 0} bio-evaluaciones
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-display font-black text-white">{meal.price}€</div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h4 className="text-lg font-display font-bold uppercase text-white leading-tight">{lang === 'es' ? meal.name_es : meal.name_en}</h4>
            
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4">
              <div className="text-center"><div className="text-[8px] font-mono text-gray-500 uppercase mb-1">KCAL</div><div className="text-xs font-bold">{meal.kcal}</div></div>
              <div className="text-center"><div className="text-[8px] font-mono text-gray-500 uppercase mb-1">PROT</div><div className="text-xs font-bold text-primary">{meal.protein}G</div></div>
              <div className="text-center"><div className="text-[8px] font-mono text-gray-500 uppercase mb-1">COST</div><div className="text-xs font-bold">{meal.cost}€</div></div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest">
                <span className="text-gray-500">Punto de Sal (Media)</span>
                <span className={(meal.avg_salt_rating || 3) > 3.5 ? 'text-red-500' : 'text-primary'}>LVL_{meal.avg_salt_rating || 3}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${(meal.avg_salt_rating || 3) > 3.5 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${((meal.avg_salt_rating || 3)/5)*100}%` }} />
              </div>
            </div>

            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] hover:bg-primary hover:text-black hover:border-primary transition-all">
              Ver Ficha Técnica
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
