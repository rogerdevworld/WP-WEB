import React from 'react';
import { ChefHat, Star, History, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HistoryTabProps {
  mealHistory: any[];
  onViewDetails?: (meal: any) => void;
  onEvaluate?: (feedback: any) => void;
}

export default function HistoryTab({ mealHistory, onViewDetails, onEvaluate }: HistoryTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">OPERATIONAL_LOG_V2.0</div>
          <h3 className="text-4xl font-display font-black uppercase text-white tracking-tighter">Historial de Rendimiento</h3>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <div className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-1">DATA_NODES</div>
            <div className="text-2xl font-display font-black text-primary">{mealHistory.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mealHistory.length === 0 ? (
          <div className="card-cyber p-20 text-center">
             <History size={48} className="mx-auto mb-6 text-gray-800 animate-pulse" />
             <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">No hay registros de consumo sincronizados.</p>
          </div>
        ) : (
          mealHistory.map((item) => {
            const isPending = !item.rating || item.rating === 0;
            return (
              <div key={item.id} className={`card-cyber p-8 flex flex-col md:flex-row justify-between items-center gap-8 group transition-all duration-500 ${isPending ? 'border-yellow-500/30 bg-yellow-500/5' : 'hover:border-primary/50'}`}>
                <div className="flex items-center gap-8 flex-1 w-full md:w-auto">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative z-10">
                      <img 
                        src={item.meal.img_path || item.meal.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        onError={(e:any) => e.target.src = 'https://via.placeholder.com/400x300?text=BIO_LOAD_ERR'}
                      />
                      {isPending && (
                        <div className="absolute inset-0 bg-yellow-500/20 backdrop-blur-[2px] flex items-center justify-center">
                          <AlertCircle size={32} className="text-yellow-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                    {/* Shadow Decor */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">{item.date}</div>
                      {isPending ? (
                        <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-[8px] font-mono text-yellow-500 uppercase animate-pulse">Pending_Eval</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[8px] font-mono text-green-500 uppercase">Synced</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="text-2xl font-display font-black text-white group-hover:text-primary transition-colors truncate">{item.meal.name_es}</h4>
                      <button 
                        onClick={() => onViewDetails?.(item.meal)}
                        className="p-2 text-gray-500 hover:text-primary transition-all bg-white/5 rounded-xl border border-white/10 hover:bg-white/10"
                      >
                        <Info size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      {!isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={item.rating >= s ? "currentColor" : "none"} className={item.rating >= s ? "text-primary" : "text-gray-800"} />)}
                          </div>
                          <span className="text-xs font-mono text-gray-400 italic">"{item.comment}"</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onEvaluate?.(item)}
                          className="px-4 py-2 bg-yellow-500 text-black font-mono font-black text-[10px] uppercase rounded-lg hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <History size={14} /> Iniciar Bio-Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <div className="text-right">
                    <div className="flex gap-[1.5px] justify-end items-end mb-3 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                      {/* Chef Hat Shape Barcode */}
                      {[4, 4, 10, 10, 14, 14, 16, 16, 14, 14, 10, 10, 4, 4].map((h, i) => (
                        <div key={i} className="bg-white" style={{ width: i % 3 === 0 ? '3px' : '1.5px', height: `${h * 1.5}px` }} />
                      ))}
                    </div>
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-tighter mb-4">{item.meal.barcode || 'NO_BARCODE'}</div>
                    <div className="text-2xl font-display font-black text-white">{item.meal.kcal} <span className="text-xs text-primary font-mono ml-1">KCAL</span></div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:border-primary group-hover:text-primary transition-all">
                       {isPending ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
