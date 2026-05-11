import React from 'react';
import { motion } from 'framer-motion';
import { Timer, CreditCard, Droplets, Zap, Calendar as CalendarIcon, CheckCircle2, Plus, Activity, Scale, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import RadarChart from './RadarChart';
import { Target } from 'lucide-react';

interface DashboardTabProps {
  selectedDays: Set<number>;
  monthName: string;
  daysInMonth: number;
  firstDow: number;
  dailySelections: any;
  toggleDay: (day: number) => void;
  setEditingDay: (day: number) => void;
  chartData: any[];
  user: any;
  catalogMeals: any[];
}

export default function DashboardTab({ 
  selectedDays, monthName, daysInMonth, firstDow, dailySelections, 
  toggleDay, setEditingDay, chartData, user, catalogMeals 
}: DashboardTabProps) {
  
  const today = new Date().getDate();

  const calculateDayPrice = (daySelections: any) => {
    let total = 0;
    Object.values(daySelections).forEach((ids: any) => {
      ids.forEach((id: string) => {
        const meal = catalogMeals.find(m => m.id_code === id);
        if (meal) total += parseFloat(meal.price);
      });
    });
    return total;
  };

  const getTodayMacros = () => {
    let protein = 0;
    let carbs = 0;
    const todaySelections = dailySelections[today] || {};
    Object.values(todaySelections).forEach((ids: any) => {
      ids.forEach((id: string) => {
        const meal = catalogMeals.find(m => m.id_code === id);
        if (meal) {
          protein += parseFloat(meal.protein || 0);
          carbs += parseFloat(meal.carbs || 0);
        }
      });
    });
    return { protein, carbs };
  };

  const macros = getTodayMacros();
  const proteinGoal = 120;
  const carbsGoal = 250;

  return (
    <div className="space-y-12">
      {/* Top KPI Section (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Card 1: Time & Capital */}
        <div className="card-cyber p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest font-black">Bio-Optimization</div>
            <div className="flex gap-2">
              <Timer size={14} className="text-primary" />
              <CreditCard size={14} className="text-primary" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">{Math.round(selectedDays.size * 1.5)}h</span>
            <span className="text-gray-600 font-mono text-xs">/</span>
            <span className="text-xl font-display font-black text-primary">{Math.round(selectedDays.size * 3 * 9)}€</span>
          </div>
          <div className="text-[9px] font-mono text-gray-500 uppercase mt-2 tracking-tighter">Tiempo + Capital ahorrado este mes</div>
        </div>

        {/* Card 2: Hydration */}
        <div className="card-cyber p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black">Nivel de Hidratación</div>
            <Droplets size={16} className="text-blue-400 animate-bounce" />
          </div>
          <div className="text-3xl font-display font-black text-white">85%</div>
          <div className="text-[9px] font-mono text-blue-400/60 uppercase mt-2">Estado: Metabólicamente Óptimo</div>
        </div>

        {/* Card 3: Carbs */}
        <div className="card-cyber p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-black">Carbohidratos</div>
            <Zap size={16} className="text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">{Math.round(macros.carbs)}g</span>
            <span className="text-gray-600 font-mono text-xs">/ {carbsGoal}g</span>
          </div>
          <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
             <motion.div initial={{width:0}} animate={{width: `${Math.min(100, (macros.carbs/carbsGoal)*100)}%`}} className="h-full bg-orange-400" />
          </div>
        </div>

        {/* Card 4: Proteins + Recommendation */}
        <div className={`card-cyber p-6 bg-gradient-to-br border-2 transition-all duration-500 ${macros.protein < proteinGoal ? 'from-red-500/10 to-transparent border-red-500/30' : 'from-green-500/10 to-transparent border-green-500/30'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono uppercase tracking-widest font-black text-white">Proteínas Diarias</div>
            <Activity size={16} className={macros.protein < proteinGoal ? 'text-red-500' : 'text-green-500'} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">{Math.round(macros.protein)}g</span>
            <span className="text-gray-600 font-mono text-xs">/ {proteinGoal}g</span>
          </div>
          
          {macros.protein < proteinGoal ? (
            <div className="mt-4 p-2 bg-red-500/20 border border-red-500/40 rounded-lg text-[8px] font-mono text-red-500 animate-pulse flex items-center gap-2">
              <Plus size={10} /> DÉFICIT DETECTADO: ¿Añadir Bio-Snack XL?
            </div>
          ) : (
            <div className="mt-4 p-2 bg-green-500/20 border border-green-500/40 rounded-lg text-[8px] font-mono text-green-500 flex items-center gap-2">
              <CheckCircle2 size={10} /> OBJETIVO BIOLÓGICO ALCANZADO
            </div>
          )}
        </div>
      </div>

      {/* BIO-LOGISTICS TRACKER */}
      <div className="card-cyber p-8 bg-black/40 backdrop-blur-xl border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase mb-1">Logistics_Protocol_v4</div>
            <h3 className="text-xl font-display font-black text-white uppercase italic">Estado de Despliegue Bio-Hacker</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[9px] font-mono text-primary uppercase font-black">En Tránsito</span>
            </div>
            <div className="text-[9px] font-mono text-gray-500 uppercase border-l border-white/10 pl-4">ETA: 08:45 AM</div>
          </div>
        </div>

        <div className="relative pt-4 pb-8 px-4">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
          
          {/* Active Progress Fill */}
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '75%' }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary to-green-500 -translate-y-1/2 shadow-[0_0_15px_#FFD700]"
          />

          <div className="relative flex justify-between">
            {[
              { id: 1, label: 'PREPARACIÓN', icon: <Activity size={16} />, status: 'completed' },
              { id: 2, label: 'EMPAQUETADO', icon: <Zap size={16} />, status: 'completed' },
              { id: 3, label: 'CALIDAD_CHECK', icon: <ShieldCheck size={16} />, status: 'active' },
              { id: 4, label: 'EN_CAMINO', icon: <CreditCard size={16} />, status: 'pending' },
              { id: 5, label: 'ENTREGADO', icon: <CheckCircle2 size={16} />, status: 'pending' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                    step.status === 'completed' ? 'bg-primary text-black border-primary shadow-[0_0_20px_#FFD700]' : 
                    step.status === 'active' ? 'bg-black border-primary text-primary animate-pulse shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 
                    'bg-black border-white/10 text-gray-700'
                  }`}
                >
                  {step.icon}
                </motion.div>
                <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${step.status === 'pending' ? 'text-gray-700' : 'text-white'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative scanline */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Calendar (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="card-cyber p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase mb-2">Deployment Calendar</h3>
                <h4 className="text-3xl font-display font-bold uppercase">{monthName}</h4>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-xs font-mono text-primary font-black">
                <CalendarIcon size={14} /> {selectedDays.size} ACTIVADOS
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-6 flex-1 content-start">
              {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => (
                <div key={d} className="text-center text-[10px] font-mono text-gray-500 font-black">{d}</div>
              ))}
              {Array.from({ length: firstDow }).map((_, i) => (<div key={`e-${i}`} className="aspect-square" />))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDays.has(day);
                const isConfigured = dailySelections[day] && Object.keys(dailySelections[day]).length > 0;
                const isPast = day < today;
                const isToday = day === today;
                const dayPrice = isConfigured ? calculateDayPrice(dailySelections[day]) : 0;

                return (
                  <button 
                    key={day} 
                    disabled={isPast}
                    onClick={() => toggleDay(day)} 
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all duration-500 relative group overflow-hidden ${
                      isPast 
                        ? 'bg-black/40 border-white/5 text-gray-700 cursor-not-allowed opacity-50' 
                        : isSelected 
                          ? 'bg-primary border-primary text-black' 
                          : isToday 
                            ? 'bg-white/5 border-primary/60 text-white shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                            : 'bg-white/2 border-white/10 text-gray-500 hover:border-primary/40'
                    }`}
                  >
                    {isSelected && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="absolute inset-0 bg-white/20 -z-10"
                      />
                    )}

                    <span className={`text-sm font-mono font-bold ${isToday ? 'text-primary' : ''}`}>{day}</span>
                    
                    {!isPast && isSelected && (
                      <div 
                        onClick={(e) => { e.stopPropagation(); setEditingDay(day); }} 
                        className="mt-2 p-1.5 bg-black/20 rounded-lg hover:bg-black/40 transition-colors flex items-center gap-1"
                      >
                        {isConfigured ? (
                          <span className="text-[8px] font-black font-mono">{dayPrice.toFixed(1)}€</span>
                        ) : (
                          <Plus size={12} className="text-black" />
                        )}
                      </div>
                    )}

                    {isSelected && isConfigured && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 size={12} className={isSelected ? 'text-black' : 'text-primary'} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* PAYMENT_GATEWAY_SECTION */}
            {selectedDays.size > 0 && (
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total Acumulado</div>
                    <div className="text-2xl font-display font-black text-white">
                      {Array.from(selectedDays).reduce((acc, day) => acc + calculateDayPrice(dailySelections[day] || {}), 0).toFixed(2)}€
                    </div>
                  </div>
                </div>
                
                <button className="btn-cyber-primary py-4 px-10 flex items-center gap-3 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3">
                    <Zap size={16} fill="currentColor" />
                    PAGAR Y ACTIVAR PLAN
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bio-Chart & Radar (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Top: Weight/Fat Tracking */}
          <div className="card-cyber p-8 bg-black/40 backdrop-blur-xl border border-white/5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase flex items-center gap-2">
                <Activity size={14} /> Bio-Status
              </h3>
              <div className="px-2 py-0.5 bg-green-500/10 rounded text-[7px] font-mono text-green-500 uppercase border border-green-500/20">Sync_Active</div>
            </div>

            <div className="flex-1 min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#444" fontSize={8} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', borderRadius: '8px' }} itemStyle={{ color: '#FFD700' }} />
                  <Area type="monotone" dataKey="weight" stroke="#FFD700" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] font-mono uppercase text-gray-500">Peso Actual</span>
                <span className="text-sm font-bold text-white">{user?.weight || '78.5'} KG</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] font-mono uppercase text-gray-500">Objetivo</span>
                <span className="text-sm font-bold text-primary">{user?.target_weight || '75.0'} KG</span>
              </div>
            </div>
          </div>

          {/* Bottom: Nutritional Radar Chart */}
          <div className="card-cyber p-8 bg-black/40 backdrop-blur-xl border border-white/5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase flex items-center gap-2">
                <Target size={14} /> Bio-Compliance
              </h3>
              <div className="text-[8px] font-mono text-gray-500 uppercase">Analysis_V2.0</div>
            </div>

            <div className="flex-1 flex items-center justify-center py-4 min-h-[200px]">
              <RadarChart data={[
                { label: 'Proteína', actual: 85, target: 90 },
                { label: 'Carbo', actual: 60, target: 70 },
                { label: 'Grasas', actual: 40, target: 50 },
                { label: 'Vitaminas', actual: 95, target: 80 },
                { label: 'Fibra', actual: 70, target: 85 },
                { label: 'Calorías', actual: 80, target: 95 },
              ]} />
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#FFD700]" />
                 <span className="text-[8px] font-mono text-gray-400 uppercase">Status: Óptimo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
