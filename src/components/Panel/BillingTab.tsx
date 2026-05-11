import React, { useState } from 'react';
import { Zap, CreditCard, Plus, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BillingTabProps {
  user: any;
  selectedDays: Set<number>;
  cards: any[];
  setCards: (cards: any[]) => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  subscriptions: any[];
  onUpgrade: (planName: string, price: number) => void;
}

export default function BillingTab({ 
  user, selectedDays, cards, setCards, selectedPlan, setSelectedPlan, 
  subscriptions, onUpgrade 
}: BillingTabProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', exp: '', cvc: '' });

  const activeSubscription = subscriptions.find(s => s.is_active);

  const plans = [
    { id: 'BIO_BASIC', name: 'BIO_BASIC', price: 49, features: ['5 Protocolos', 'Tupper M', 'Rastreo Básico'] },
    { id: 'BIO_PRO', name: 'BIO_PRO', price: 99, features: ['15 Protocolos', 'Tupper L', 'Rastreo Premium'] },
    { id: 'PLATINO_VIP', name: 'PLATINO_VIP', price: 199, features: ['Ilimitado', 'Tupper XL', 'Asistente AI'] },
  ];

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCard.number.slice(-4);
    setCards([...cards, { id: Date.now().toString(), last4, exp: newCard.exp, brand: 'VISA' }]);
    setShowAddCard(false);
    setNewCard({ number: '', exp: '', cvc: '' });
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handlePlanUpgrade = (plan: any) => {
    onUpgrade(plan.name, plan.price);
    setSelectedPlan(plan.id);
    setShowChangePlan(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4">SUBSCRIPTION_STATUS</div>
        <h2 className="text-5xl font-display font-black uppercase text-white">Gestión de Suscripción</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan Section */}
        <div className="card-cyber p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
          <div className="flex justify-between items-start mb-8">
            <div className="p-4 bg-primary text-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              <Zap size={32} />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">
                Status: {activeSubscription ? 'Active' : 'No Sub'}
              </div>
              <div className="text-2xl font-display font-black">
                {activeSubscription?.plan_name || selectedPlan}
              </div>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-mono uppercase">Capacidad Tupper</span>
              <span className="text-white font-black">{user?.tupper_size || 'M'} (Bio-Optimized)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-mono uppercase">Protocolos Semanales</span>
              <span className="text-white font-black">{selectedDays.size} Activos</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-mono uppercase">Renovación</span>
              <span className="text-white font-black">
                {activeSubscription ? activeSubscription.end_date : 'N/A'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowChangePlan(true)}
            className="w-full py-4 bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-black uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            Cambiar Plan de Suscripción
          </button>
        </div>

        {/* Payment Methods Section */}
        <div className="card-cyber p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em]">MÉTODO_DE_PAGO</h4>
              <button onClick={() => setShowAddCard(true)} className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-black transition-all">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {cards.map(card => (
                <div key={card.id} className="group flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <CreditCard size={20} className="text-primary" />
                    <div>
                      <div className="text-white font-bold text-sm">{card.brand} •••• {card.last4}</div>
                      <div className="text-[9px] font-mono text-gray-500 uppercase">Expira {card.exp}</div>
                    </div>
                  </div>
                  <button onClick={() => removeCard(card.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            <button className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all">Pausar Bio-Suscripción</button>
          </div>
        </div>
      </div>

      {/* Subscription History */}
      {subscriptions.length > 0 && (
        <div className="card-cyber p-8">
           <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">Historial de Protocolos</h3>
           <div className="space-y-4">
              {subscriptions.map(sub => (
                <div key={sub.id} className="flex justify-between items-center p-4 border border-white/5 rounded-xl bg-white/2">
                   <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${sub.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                      <div className="text-sm font-black text-white">{sub.plan_name}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-mono text-white">{sub.price}€</div>
                      <div className="text-[8px] font-mono text-gray-500">{sub.start_date} - {sub.end_date}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card-cyber p-8 max-w-sm w-full relative">
              <button onClick={() => setShowAddCard(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
              <h3 className="text-xl font-display font-black text-white uppercase mb-6 tracking-widest">Sincronizar Tarjeta</h3>
              <form onSubmit={handleAddCard} className="space-y-4">
                <input type="text" placeholder="NÚMERO DE TARJETA" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-primary outline-none" required value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="EXP (MM/YY)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-primary outline-none" required value={newCard.exp} onChange={e => setNewCard({...newCard, exp: e.target.value})} />
                  <input type="text" placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-primary outline-none" required value={newCard.cvc} onChange={e => setNewCard({...newCard, cvc: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-black rounded-xl font-mono font-black uppercase text-xs tracking-widest shadow-lg">Confirmar Enlace</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Plan Modal */}
      <AnimatePresence>
        {showChangePlan && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="card-cyber p-10 max-w-4xl w-full relative">
              <button onClick={() => setShowChangePlan(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
              <h3 className="text-3xl font-display font-black text-white uppercase mb-12 text-center tracking-widest">Protocolos de Suscripción</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className={`p-8 rounded-3xl border-2 transition-all cursor-pointer ${selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(255,215,0,0.15)]' : 'border-white/10 hover:border-white/20 bg-white/2'}`} onClick={() => handlePlanUpgrade(plan)}>
                    <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-4">{plan.id}</div>
                    <div className="text-4xl font-display font-black text-white mb-2">{plan.price}€<span className="text-xs text-gray-500 font-mono uppercase">/mes</span></div>
                    <div className="space-y-4 mt-8">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-3 text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                          <Check size={12} className="text-primary" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
