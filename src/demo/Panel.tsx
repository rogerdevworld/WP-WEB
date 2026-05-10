import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Plus
} from 'lucide-react';
import { i18n, mealOptions } from '../data';

export default function Panel({ lang, toggleLang, goTo, user, setUser, selectedDays, setSelectedDays }: any) {
  const t = i18n[lang as 'es'|'en'];
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  
  // State for daily selections: { [day]: { breakfast: id, lunch: id, dinner: id, juice: id } }
  const [dailySelections, setDailySelections] = useState<any>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calendar Logic
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
    setDailySelections((prev: any) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [type]: mealId
      }
    }));
  };

  const SelectionModal = () => {
    if (editingDay === null) return null;
    const selection = dailySelections[editingDay] || {};

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-cyber max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
        >
          <button onClick={() => setEditingDay(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={24} />
          </button>
          
          <h3 className="text-2xl font-display font-black uppercase mb-8 text-primary">
            {lang === 'es' ? 'Configurar Día' : 'Configure Day'} {editingDay}
          </h3>

          <div className="space-y-8">
            {Object.entries(mealOptions).map(([type, meals]: [string, any]) => (
              <div key={type} className="space-y-3">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">{type}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {meals.map((meal: any) => (
                    <button
                      key={meal.id}
                      onClick={() => handleSelection(editingDay, type, meal.id)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selection[type] === meal.id 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/30'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">{meal.name[lang as 'es'|'en']}</div>
                      <div className="text-[8px] font-mono opacity-50">{meal.kcal} KCAL</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setEditingDay(null)}
            className="w-full btn-cyber-primary py-4 mt-10 text-xs font-black"
          >
            GUARDAR_CONFIGURACION
          </button>
        </motion.div>
      </div>
    );
  };

  if (!t) return <div className="bg-black text-primary p-20 font-mono text-center">CRITICAL_ERROR: DATA_LOAD_FAILURE</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black flex">
      <SelectionModal />
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 hidden lg:flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="Warnfood" className="w-8 h-8 object-contain" />
            <span className="font-display font-black tracking-widest text-lg">WARNFOOD</span>
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
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-xs font-mono uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-primary text-black font-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button 
            onClick={() => {setUser(null); goTo('demo')}}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-xs font-mono uppercase tracking-widest"
          >
            <LogOut size={18} /> {t.panel.logout}
          </button>
        </div>
      </aside>

      <div className="flex-1">
        {/* Top Navbar */}
        <nav className="h-20 border-b border-white/10 px-8 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4 text-gray-500">
             <button onClick={() => goTo('demo')} className="text-[10px] font-mono hover:text-primary transition-all flex items-center gap-2">
              <ChevronLeft size={14} /> {t.panel.exit}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={toggleLang} className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest">
              {lang}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-4 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-primary transition-all">
                    {user?.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-500" />}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold leading-tight">{user?.name || 'OPERATOR'}</div>
                  <div className="text-[10px] font-mono text-gray-500">BCN_CORE_V1</div>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-4 w-56 bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/5"
                  >
                    <div className="p-4 border-b border-white/5 bg-white/2">
                      <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">Authenticated as</div>
                      <div className="text-[10px] font-mono text-primary font-bold truncate">{user?.email || 'user@warnfood.bcn'}</div>
                    </div>
                    <button className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3">
                      <User size={14} /> {t.panel.edit}
                    </button>
                    <button className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3">
                      <Settings size={14} /> {t.panel.settings}
                    </button>
                    <div className="h-px bg-white/5" />
                    <button onClick={() => {setUser(null); goTo('demo')}} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-red-500/5 text-red-500 flex items-center gap-3">
                      <LogOut size={14} /> {t.panel.logout}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        <main className="p-8 max-w-7xl mx-auto space-y-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-xs font-mono text-primary tracking-[0.5em] uppercase mb-4">Operational Center</h1>
              <h2 className="text-4xl font-display font-black uppercase">
                {lang === 'es' ? `Bienvenido, ${user?.name?.split(' ')[0] || 'Operador'}` : `Welcome, ${user?.name?.split(' ')[0] || 'Operator'}`}
              </h2>
            </div>
            
            <div className="flex gap-4">
              <div className="card-cyber px-6 py-4 flex items-center gap-4 bg-primary/5">
                <Flame size={20} className="text-primary" />
                <div>
                  <div className="text-[8px] font-mono text-gray-500 uppercase">Streak</div>
                  <div className="text-xl font-display font-bold">12 DÍAS</div>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Stats */}
            <div className="lg:col-span-4 space-y-8">
              <div className="card-cyber p-8 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase">Bio-Status</h3>
                  <div className="px-2 py-1 bg-green-500/20 rounded text-[8px] font-mono text-green-500">NORMAL</div>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center text-primary border border-primary/20"><Scale size={18}/></div>
                      <div>
                        <div className="text-[8px] font-mono text-gray-500 uppercase">Weight</div>
                        <div className="text-2xl font-display font-black">{user?.weight || '78.5'}<span className="text-[10px] ml-1 opacity-50 uppercase">kg</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center text-primary border border-primary/20"><Activity size={18}/></div>
                      <div>
                        <div className="text-[8px] font-mono text-gray-500 uppercase">Body Fat</div>
                        <div className="text-2xl font-display font-black">14.2<span className="text-[10px] ml-1 opacity-50 uppercase">%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-cyber p-8">
                <h3 className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-6">Plan Deployment</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-[10px] font-mono mb-2 uppercase tracking-widest">
                      <span>Progreso del Plan</span>
                      <span className="text-primary">{Math.round((selectedDays.size / 15) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-primary" style={{ width: `${(selectedDays.size / 15) * 100}%` }} />
                    </div>
                  </div>
                  <button className="w-full btn-cyber-primary py-4 text-[10px] font-black uppercase tracking-widest">
                    ACTIVATE_FULL_CYCLE
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Calendar & Meal Picker */}
            <div className="lg:col-span-8 space-y-8">
              <div className="card-cyber p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-[10px] font-mono text-primary tracking-widest uppercase mb-2">Manual Deployment Selector</h3>
                    <h4 className="text-2xl font-display font-bold uppercase">{monthName}</h4>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-mono text-primary">
                    <CalendarIcon size={12} /> {selectedDays.size} SELECCIONADOS
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3 mb-10">
                  {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => (
                    <div key={d} className="text-center text-[9px] font-mono text-gray-600 font-black">{d}</div>
                  ))}
                  {Array.from({ length: firstDow }).map((_, i) => (
                    <div key={`e-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDays.has(day);
                    const isConfigured = dailySelections[day] && Object.keys(dailySelections[day]).length >= 3;
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all duration-300 relative group ${
                          isSelected 
                            ? 'bg-primary border-primary text-black' 
                            : 'bg-white/2 border-white/5 text-gray-500 hover:border-primary/40'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold">{day}</span>
                        {isSelected && isConfigured && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle2 size={10} className="text-black" />
                          </div>
                        )}
                        {isSelected && (
                          <div 
                            onClick={(e) => { e.stopPropagation(); setEditingDay(day); }}
                            className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Plus size={10} className="text-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedDays.size > 0 && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Resumen de Configuración</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from(selectedDays).sort((a,b) => a-b).slice(0, 4).map(day => (
                        <div key={day} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-mono text-xs font-black">{day}</div>
                            <div className="text-xs font-mono uppercase tracking-tighter">
                              {dailySelections[day] ? (
                                <span className="text-primary">Configurado ({Object.keys(dailySelections[day]).length}/4)</span>
                              ) : (
                                <span className="text-gray-500">Pendiente de Configuración</span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => setEditingDay(day)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-all text-primary"
                          >
                            <Settings size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
