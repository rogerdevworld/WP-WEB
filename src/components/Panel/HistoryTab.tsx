import React from 'react';
import { ChefHat, Star, History, Info } from 'lucide-react';

interface HistoryTabProps {
  mealHistory: any[];
  onViewDetails?: (meal: any) => void;
}

export default function HistoryTab({ mealHistory, onViewDetails }: HistoryTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">OPERATIONAL_LOG</div>
          <h3 className="text-3xl font-display font-black uppercase text-white">Historial Nutricional</h3>
        </div>
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">TOTAL_CONSUMOS</div>
          <div className="text-xl font-display font-black text-primary">{mealHistory.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mealHistory.length === 0 ? (
          <div className="card-cyber p-12 text-center text-gray-500 font-mono">No hay registros de consumo en la base de datos local.</div>
        ) : (
          mealHistory.map((item) => (
            <div key={item.id} className="card-cyber p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                   {(item.meal.img_path || item.meal.image) ? (
                     <img 
                       src={item.meal.img_path || item.meal.image} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=BIO_LOAD_ERR'}
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-700">
                       <ChefHat size={32} />
                     </div>
                   )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-1">{item.date}</div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-display font-black text-white group-hover:text-primary transition-colors truncate">{item.meal.name_es}</h4>
                    <button 
                      onClick={() => onViewDetails?.(item.meal)}
                      className="p-1.5 text-gray-500 hover:text-primary transition-all bg-white/5 rounded-md border border-white/10"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={item.rating >= s ? "currentColor" : "none"} className={item.rating >= s ? "text-primary" : "text-gray-800"} />)}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter truncate max-w-[200px]">{item.comment || 'BIO_FEEDBACK_PENDING'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">PRODUCT_ID</div>
                  <div className="text-[10px] font-mono text-white/40 mb-3 truncate max-w-[100px]">{item.meal.barcode || 'N/A'}</div>
                  <div className="text-lg font-display font-black text-white">{item.meal.kcal} <span className="text-[10px] text-gray-500 font-mono">KCAL</span></div>
                </div>
                <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary hover:text-primary transition-all group/btn">
                  <History size={18} className="group-hover/btn:rotate-[-45deg] transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
