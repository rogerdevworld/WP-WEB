import React from 'react';
import { Zap, CreditCard } from 'lucide-react';

interface BillingTabProps {
  user: any;
  selectedDays: Set<number>;
}

export default function BillingTab({ user, selectedDays }: BillingTabProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4">SUBSCRIPTION_STATUS</div>
        <h2 className="text-5xl font-display font-black uppercase text-white">Gestión de Suscripción</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-cyber p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
          <div className="flex justify-between items-start mb-8">
            <div className="p-4 bg-primary text-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              <Zap size={32} />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Status: Active</div>
              <div className="text-2xl font-display font-black">PLATINO_VIP</div>
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
              <span className="text-gray-400 font-mono uppercase">Siguiente Renovación</span>
              <span className="text-white font-black">01 JUN 2026</span>
            </div>
          </div>
          <button className="w-full py-4 bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-black uppercase tracking-widest hover:bg-white/20 transition-all">Cambiar Plan de Suscripción</button>
        </div>

        <div className="card-cyber p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-6">MÉTODO_DE_PAGO</h4>
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-xl border border-white/10">
              <CreditCard size={32} className="text-primary" />
              <div>
                <div className="text-white font-bold">VISA •••• 4412</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase">Expira 12/28</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full py-4 bg-primary text-black rounded-xl text-xs font-mono font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Ver Facturas Recientes</button>
            <button className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all">Pausar Bio-Suscripción</button>
          </div>
        </div>
      </div>
    </div>
  );
}
