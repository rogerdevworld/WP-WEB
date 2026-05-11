import React from 'react';
import { Timer, CreditCard, Droplets, Zap, Calendar as CalendarIcon, CheckCircle2, Plus, Activity, Scale } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

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
}

export default function DashboardTab({ 
  selectedDays, monthName, daysInMonth, firstDow, dailySelections, 
  toggleDay, setEditingDay, chartData, user 
}: DashboardTabProps) {
  return (
    <div className="space-y-12">
      {/* Top KPI Section (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card-cyber p-6 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest">Tiempo Ahorrado</div>
            <Timer size={16} className="text-primary" />
          </div>
          <div className="text-3xl font-display font-black">{Math.round(selectedDays.size * 1.5)}h</div>
          <div className="text-[9px] font-mono text-gray-500 uppercase mt-1">+12% vs semana anterior</div>
        </div>
        <div className="card-cyber p-6 bg-gradient-to-br from-green-500/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Capital Optimizado</div>
            <CreditCard size={16} className="text-green-500" />
          </div>
          <div className="text-3xl font-display font-black">{Math.round(selectedDays.size * 3 * 9)}€</div>
          <div className="text-[9px] font-mono text-gray-500 uppercase mt-1">Ahorro en restauración BCN</div>
        </div>
        <div className="card-cyber p-6 bg-gradient-to-br from-blue-500/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">Nivel de Hidratación</div>
            <Droplets size={16} className="text-blue-500" />
          </div>
          <div className="text-3xl font-display font-black">85%</div>
          <div className="text-[9px] font-mono text-gray-500 uppercase mt-1">Óptimo para metabolismo</div>
        </div>
        <div className="card-cyber p-6 bg-gradient-to-br from-orange-500/5 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">Siguiente Entrega</div>
            <Zap size={16} className="text-orange-500" />
          </div>
          <div className="text-3xl font-display font-black">12 MAY</div>
          <div className="text-[9px] font-mono text-gray-500 uppercase mt-1">BCN_CORE_STATION_A</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Calendar (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="card-cyber p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase mb-2">Deployment Calendar</h3>
                <h4 className="text-3xl font-display font-bold uppercase">{monthName}</h4>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-xs font-mono text-primary font-black">
                <CalendarIcon size={14} /> {selectedDays.size} ACTIVADOS
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-10">
              {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => (
                <div key={d} className="text-center text-[10px] font-mono text-gray-500 font-black">{d}</div>
              ))}
              {Array.from({ length: firstDow }).map((_, i) => (<div key={`e-${i}`} className="aspect-square" />))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDays.has(day);
                const isConfigured = dailySelections[day] && Object.keys(dailySelections[day]).length >= 3;
                return (
                  <button key={day} onClick={() => toggleDay(day)} className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all duration-500 relative group ${isSelected ? 'bg-primary border-primary text-black' : 'bg-white/2 border-white/10 text-gray-500 hover:border-primary/40'}`}>
                    <span className="text-sm font-mono font-bold">{day}</span>
                    {isSelected && isConfigured && <div className="absolute top-2 right-2"><CheckCircle2 size={12} className="text-black" /></div>}
                    {isSelected && <div onClick={(e) => { e.stopPropagation(); setEditingDay(day); }} className="mt-2 p-1.5 bg-black/20 rounded-lg hover:bg-black/40 transition-colors"><Plus size={12} className="text-black" /></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Bio-Chart (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card-cyber p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase flex items-center gap-2">
                <Activity size={14} /> Bio-Status Tracking
              </h3>
              <div className="px-2 py-1 bg-green-500/20 rounded text-[8px] font-mono text-green-500 uppercase">Sync_Active</div>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', borderRadius: '8px' }} itemStyle={{ color: '#FFD700' }} />
                  <Area type="monotone" dataKey="weight" stroke="#FFD700" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                  <Area type="monotone" dataKey="fat" stroke="#00FF00" fillOpacity={0.1} fill="#00FF00" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Scale size={14} className="text-primary" />
                  <span className="text-[10px] font-mono uppercase text-gray-400">Peso Promedio</span>
                </div>
                <span className="text-sm font-bold">{user?.weight || '78.5'} kg</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity size={14} className="text-green-500" />
                  <span className="text-[10px] font-mono uppercase text-gray-400">Grasa Corporal</span>
                </div>
                <span className="text-sm font-bold">14.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
