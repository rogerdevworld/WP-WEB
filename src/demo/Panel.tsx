import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  LogOut,
  Settings,
  Globe,
  Calendar as CalendarIcon,
  BarChart3,
  ChevronLeft,
  Activity,
  Flame,
  Scale,
  User,
  Camera,
  LayoutDashboard,
  ChefHat,
  History,
  CreditCard,
  ChevronDown,
  CheckCircle2,
  X,
  Plus,
  Timer,
  Droplets,
  Zap
} from 'lucide-react';
import { i18n, mealOptions } from '../data';
// import MealCatalog from '../components/MealCatalog';

const chartData = [
  { name: 'Lun', weight: 79.2, fat: 15.1, water: 2.1 },
  { name: 'Mar', weight: 78.8, fat: 14.8, water: 2.5 },
  { name: 'Mie', weight: 78.5, fat: 14.7, water: 2.8 },
  { name: 'Jue', weight: 78.2, fat: 14.5, water: 2.4 },
  { name: 'Vie', weight: 78.0, fat: 14.2, water: 3.1 },
  { name: 'Sab', weight: 78.3, fat: 14.3, water: 2.2 },
  { name: 'Dom', weight: 78.1, fat: 14.2, water: 2.0 },
];

function Panel({ lang, toggleLang, goTo, user, setUser, selectedDays, setSelectedDays }: any) {
  const t = i18n[lang as 'es' | 'en'];
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const [dailySelections, setDailySelections] = useState<any>({});
  const [catalogMeals, setCatalogMeals] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/meals/list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCatalogMeals(data);
      })
      .catch(err => console.error("API_LOAD_ERROR:", err));
  }, []);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDow = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  const monthName = now.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' });

  const toggleDay = useCallback((day: number) => {
    setSelectedDays((prev: Set<number>) => {
      const n = new Set(prev);
      if (n.has(day)) {
        n.delete(day);
        const newSels = { ...dailySelections };
        delete newSels[day];
        setDailySelections(newSels);
      } else {
        n.add(day);
      }
      return n;
    });
  }, [setSelectedDays, dailySelections]);

  const handleSelection = (day: number, type: string, mealId: string) => {
    setDailySelections((prev: any) => {
      const currentDay = prev[day] || {};
      const currentTypeSelections = currentDay[type] || [];

      let newTypeSelections;
      if (currentTypeSelections.includes(mealId)) {
        newTypeSelections = currentTypeSelections.filter((id: string) => id !== mealId);
      } else {
        newTypeSelections = [...currentTypeSelections, mealId];
      }

      return {
        ...prev,
        [day]: {
          ...currentDay,
          [type]: newTypeSelections
        }
      };
    });
  };

  const savePlan = async (day: number) => {
    if (!user?.userId) return;
    const selection = dailySelections[day] || {};

    if (!selection.lunch || selection.lunch.length === 0) {
      alert(lang === 'es' ? "BIO_ERROR: El Almuerzo es obligatorio para mantener la homeostasis." : "BIO_ERROR: Lunch is mandatory to maintain homeostasis.");
      return;
    }

    try {
      const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
      const response = await fetch(`/api/meals/select/${user.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          selections: selection
        })
      });
      if (response.ok) {
        setEditingDay(null);
      } else {
        const err = await response.json();
        alert("SYNC_ERROR: " + err.error);
      }
    } catch (e) {
      alert("NETWORK_FAILURE: Remote node unreachable.");
    }
  };

  const SelectionModal = () => {
    if (editingDay === null) return null;
    const selection = dailySelections[editingDay] || {};

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-cyber max-w-5xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
        >
          <button onClick={() => setEditingDay(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={24} />
          </button>

          <div className="text-center mb-8 border-b border-white/5 pb-6">
            <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">DEPLOYMENT_CONFIG</div>
            <h3 className="text-4xl font-display font-black uppercase text-white">
              {lang === 'es' ? 'Protocolo Día' : 'Day Protocol'} {editingDay}
            </h3>
          </div>

          <div className="space-y-12">
            {Object.entries(mealOptions).map(([type, typeMeals]: any) => {
              const currentSelections = selection[type] || [];
              const isMultiple = currentSelections.length > 1;

              return (
                <div key={type} className="space-y-6">
                  <div className="flex justify-between items-center bg-white/2 p-2 rounded-lg">
                    <label className="text-xs font-mono text-primary uppercase tracking-[0.3em] font-black ml-4">
                      {(t.panel.meals as any)[type] || type}
                    </label>
                    {isMultiple && (
                      <span className="text-[10px] font-mono text-yellow-500 animate-pulse mr-4">
                        {t.panel.meals.warningMultiple}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {typeMeals.map((meal: any) => (
                      <button
                        key={meal.id}
                        onClick={() => handleSelection(editingDay, type, meal.id)}
                        className={`group rounded-2xl border transition-all relative overflow-hidden flex flex-col text-left ${currentSelections.includes(meal.id)
                          ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(255,215,0,0.15)]'
                          : 'bg-white/2 border-white/10 hover:border-primary/40'
                          }`}
                      >
                        <div className="relative h-32 w-full overflow-hidden">
                          <img src={meal.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="text-xs font-bold mb-1 uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                            {meal.name[lang as 'es' | 'en']}
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div className="text-[10px] font-mono text-gray-500">{meal.kcal} KCAL</div>
                            {currentSelections.includes(meal.id) && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black">
                                <CheckCircle2 size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => savePlan(editingDay)}
            className="w-full btn-cyber-primary py-6 mt-12 text-sm font-black tracking-[0.5em] shadow-[0_0_50px_rgba(255,215,0,0.2)]"
          >
            CONFIRMAR_CARGA_DIARIA
          </button>
        </motion.div>
      </div>
    );
  };

  if (!t) return <div className="bg-black text-primary p-20 font-mono text-center">CRITICAL_ERROR: DATA_LOAD_FAILURE</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black flex">
      <SelectionModal />

      <aside className="w-64 border-r border-white/10 hidden lg:flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="Warnfood" className="w-8 h-8 object-contain" />
            <span className="font-display font-black tracking-widest text-lg text-primary">WARNFOOD</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: t.panel.dashboard },
              { id: 'menu', icon: ChefHat, label: t.nav.menu },
              { id: 'history', icon: History, label: 'Historial' },
              { id: 'billing', icon: CreditCard, label: 'Suscripción' },
              { id: 'settings', icon: Settings, label: t.panel.settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-xs font-mono uppercase tracking-widest ${activeTab === item.id ? 'bg-primary text-black font-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button
            onClick={() => { setUser(null); goTo('demo') }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-xs font-mono uppercase tracking-widest"
          >
            <LogOut size={18} /> {t.panel.logout}
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <nav className="h-20 border-b border-white/10 px-8 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4 text-gray-500">
            <button onClick={() => goTo('demo')} className="text-[10px] font-mono hover:text-primary transition-all flex items-center gap-2">
              <ChevronLeft size={14} /> {t.panel.exit}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={toggleLang} className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1 rounded">
              {lang}
            </button>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-primary transition-all">
                    {user?.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-500" />}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold leading-tight">{user?.name || 'OPERATOR'}</div>
                  <div className="text-[10px] font-mono text-gray-500">BCN_ZONE_01</div>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-56 bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                    <div className="p-4 border-b border-white/5 bg-white/2">
                      <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">Authenticated</div>
                      <div className="text-[10px] font-mono text-primary font-bold truncate">{user?.email || 'user@warnfood.bcn'}</div>
                    </div>
                    <button className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3"><User size={14} /> {t.panel.edit}</button>
                    <button className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3"><Settings size={14} /> {t.panel.settings}</button>
                    <button onClick={() => { setUser(null); goTo('demo') }} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-red-500/5 text-red-500 flex items-center gap-3"><LogOut size={14} /> {t.panel.logout}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        <main className="p-8 max-w-7xl mx-auto space-y-12">
          {/* Top KPI Section (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <button key={day} onClick={() => toggleDay(day)} className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-500 relative group ${isSelected ? 'bg-primary border-primary text-black' : 'bg-white/2 border-white/10 text-gray-500 hover:border-primary/40'}`}>
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

          {/* Deployment Catalog Section */}
          <div className="mt-16 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">DEPLOYMENT CATALOG</div>
                <h3 className="text-3xl font-display font-black uppercase text-white">Menú de la Semana</h3>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">PLATOS_DISPONIBLES</div>
                <div className="text-xl font-display font-black text-primary">{catalogMeals.length}</div>
              </div>
            </div>

            <MealCatalog meals={catalogMeals} lang={lang} limit={6} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Panel;
