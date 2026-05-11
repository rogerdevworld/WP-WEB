import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Zap, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  total: number;
  onConfirm: (methodId: string) => void;
  cards: any[];
  lang: string;
}

export default function PaymentModal({ isOpen, onClose, items, total, onConfirm, cards, lang }: PaymentModalProps) {
  const [selectedCard, setSelectedCard] = useState(cards[0]?.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card-cyber max-w-2xl w-full p-8 relative max-h-[90vh] flex flex-col overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white z-50">
          <X size={24} />
        </button>

        <div className="text-center mb-8 shrink-0">
          <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">PAYMENT_GATEWAY_v2</div>
          <h3 className="text-3xl font-display font-black uppercase text-white">Finalizar Protocolo</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-8">
          {/* Items Summary */}
          <div className="space-y-3">
             <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Resumen del Protocolo</div>
             {items.map((item, idx) => (
               <div key={idx} className="flex justify-between items-center py-2">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-primary border border-white/10">{idx + 1}</div>
                    <span className="text-xs font-bold text-white uppercase">{item.name_es}</span>
                 </div>
                 <span className="text-xs font-mono text-gray-400">{parseFloat(item.price).toFixed(2)}€</span>
               </div>
             ))}
             <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Total a Liquidar</span>
                <span className="text-3xl font-display font-black text-primary">{total.toFixed(2)}€</span>
             </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
             <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Seleccionar Nodo de Pago</div>
             <div className="grid grid-cols-1 gap-3">
                {cards.map(card => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedCard === card.id ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <CreditCard size={24} className={selectedCard === card.id ? 'text-primary' : 'text-gray-500'} />
                       <div>
                          <div className="text-xs font-black text-white uppercase">{card.brand} •••• {card.last4}</div>
                          <div className="text-[9px] font-mono text-gray-500 uppercase">Exp: {card.exp}</div>
                       </div>
                    </div>
                    {selectedCard === card.id && <CheckCircle2 size={18} className="text-primary" />}
                  </div>
                ))}
             </div>
          </div>

          <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-4">
             <Lock size={16} className="text-gray-600" />
             <div className="text-[9px] font-mono text-gray-600 uppercase leading-relaxed">
                Toda la comunicación está cifrada bajo el protocolo Bio-Hacker L8. No almacenamos datos sensibles en nodos externos.
             </div>
          </div>
        </div>

        <button 
          onClick={() => onConfirm(selectedCard)}
          className="w-full py-5 bg-primary text-black font-display font-black uppercase text-sm tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,215,0,0.3)] shrink-0"
        >
          <Zap size={20} fill="currentColor" />
          CONFIRMAR Y ACTIVAR PROTOCOLO
        </button>
      </motion.div>
    </div>
  );
}
