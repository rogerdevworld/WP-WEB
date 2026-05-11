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
import MealCard from '../components/MealCard';
import MealCatalog from '../components/MealCatalog';
import { 
  X, CheckCircle2, Plus, Calendar as CalendarIcon, 
  Timer, CreditCard, Droplets, Zap, Activity, Scale, 
  User, Settings, LogOut, Camera, Save, Globe, ChefHat, History, ChevronLeft, ChevronDown,
  LayoutDashboard, Star, Bell
} from 'lucide-react';
import { i18n, mealOptions } from '../data';

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
  const [pendingFeedbacks, setPendingFeedbacks] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [mealHistory, setMealHistory] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    salt_rating: 3,
    pepper_rating: 3,
    sugar_rating: 3,
    comment: '',
    is_reported: false,
    issue_details: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedbackPhotoRef = useRef<HTMLInputElement>(null);

  const [settingsForm, setSettingsForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    height: user?.height || '',
    weight: user?.weight || '',
    tupper_size: user?.tupper_size || 'M',
    dietary_notes: user?.dietary_notes || '',
    is_vegetarian: user?.is_vegetarian || false
  });

  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (user) {
      setSettingsForm({
        name: user.name || '',
        phone: user.phone || '',
        height: user.height || '',
        weight: user.weight || '',
        tupper_size: user.tupper_size || 'M',
        dietary_notes: user.dietary_notes || '',
        is_vegetarian: user.is_vegetarian || false
      });
    }
  }, [user]);

  React.useEffect(() => {
    fetch('/api/meals/list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCatalogMeals(data);
      })
      .catch(err => console.error("API_LOAD_ERROR:", err));

    if (user?.userId) {
      fetch(`/api/meals/pending/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPendingFeedbacks(data);
        })
        .catch(err => console.error("FEEDBACK_LOAD_ERROR:", err));

      fetch(`/api/meals/history/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMealHistory(data);
        })
        .catch(err => console.error("HISTORY_LOAD_ERROR:", err));

      fetch(`/api/meals/plans/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMealPlans(data);
        })
        .catch(err => console.error("PLANS_LOAD_ERROR:", err));
    }
  }, [user?.userId]);

  const submitFeedback = async () => {
    if (!currentFeedback || !user?.userId) return;
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('history_id', currentFeedback.id.toString());
    formData.append('rating', feedbackForm.rating.toString());
    formData.append('salt_rating', feedbackForm.salt_rating.toString());
    formData.append('pepper_rating', feedbackForm.pepper_rating.toString());
    formData.append('sugar_rating', feedbackForm.sugar_rating.toString());
    formData.append('comment', feedbackForm.comment);
    formData.append('is_reported', feedbackForm.is_reported.toString());
    formData.append('issue_details', feedbackForm.issue_details);

    if (feedbackPhotoRef.current?.files?.[0]) {
      formData.append('meal_photo', feedbackPhotoRef.current.files[0]);
    }

    try {
      const response = await fetch('/api/meals/feedback', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setPendingFeedbacks(prev => prev.filter(f => f.id !== currentFeedback.id));
        setShowFeedbackModal(false);
        setCurrentFeedback(null);
        alert(lang === 'es' ? "¡Gracias por tu bio-feedback!" : "Thank you for your bio-feedback!");
      }
    } catch (e) {
      alert("NETWORK_FAILURE: Protocol interrupted.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateProfile = async () => {
    if (!user?.userId) return;
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('name', settingsForm.name);
    formData.append('phone', settingsForm.phone);
    formData.append('height', settingsForm.height.toString());
    formData.append('weight', settingsForm.weight.toString());
    formData.append('tupper_size', settingsForm.tupper_size);
    formData.append('dietary_notes', settingsForm.dietary_notes);
    formData.append('is_vegetarian', settingsForm.is_vegetarian.toString());

    if (fileInputRef.current?.files?.[0]) {
      formData.append('photo', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch(`/api/profile/update/${user.userId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert(lang === 'es' ? "Perfil actualizado correctamente." : "Profile updated successfully.");
      } else {
        const err = await response.json();
        alert("UPDATE_ERROR: " + err.error);
      }
    } catch (e) {
      alert("NETWORK_FAILURE: Remote node unreachable.");
    } finally {
      setIsUpdating(false);
    }
  };

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

    // Usar datos estáticos como fallback si la API falla
    const sourceData = catalogMeals.length > 0 ? catalogMeals : 
      Object.entries(mealOptions).flatMap(([cat, meals]: any) => 
        meals.map((m: any) => ({ ...m, id_code: m.id, category: cat, name_es: m.name.es, name_en: m.name.en, price: 5.5, protein: 25, cost: 1.2 }))
      );

    const categorizedMeals = sourceData.reduce((acc: any, meal: any) => {
      const cat = meal.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(meal);
      return acc;
    }, {});

    const totalPrice = Object.entries(selection).reduce((total: number, [type, ids]: any) => {
      const typePrice = ids.reduce((typeTotal: number, id: string) => {
        const meal = sourceData.find((m: any) => m.id_code === id);
        return typeTotal + (meal ? parseFloat(meal.price) : 0);
      }, 0);
      return total + typePrice;
    }, 0);

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-cyber max-w-6xl w-full p-8 relative max-h-[90vh] flex flex-col"
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

          <div className="flex-1 overflow-y-auto space-y-12 pr-4">
            {Object.entries(categorizedMeals).map(([type, typeMeals]: any) => {
              const currentSelections = selection[type] || [];
              const isMultiple = currentSelections.length > 1;

              return (
                <div key={type} className="space-y-6">
                  <div className="flex justify-between items-center bg-white/2 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       <label className="text-xs font-mono text-primary uppercase tracking-[0.3em] font-black">
                        {(t.panel.meals as any)[type] || type}
                      </label>
                    </div>
                    {isMultiple && (
                      <span className="text-[10px] font-mono text-yellow-500 animate-pulse">
                        {t.panel.meals.warningMultiple}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeMeals.map((meal: any) => {
                      const userSizeMultiplier = user?.tupper_size === 'S' ? 0.8 : user?.tupper_size === 'L' ? 1.3 : 1;
                      return (
                        <MealCard
                          key={meal.id_code}
                          meal={meal}
                          lang={lang}
                          isCompact={true}
                          isSelected={currentSelections.includes(meal.id_code)}
                          onSelect={() => handleSelection(editingDay, type, meal.id_code)}
                          sizeMultiplier={userSizeMultiplier}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10">
               <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">MONTO_DIARIO_ESTIMADO</div>
               <div className="text-2xl font-display font-black text-primary">{totalPrice.toFixed(2)}€</div>
            </div>
            <button 
              onClick={() => savePlan(editingDay)}
              className="px-10 py-4 bg-primary text-black font-display font-black uppercase text-sm tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              <Save size={18} />
              {lang === 'es' ? 'CONFIRMAR CARGA DIARIA' : 'CONFIRM DAILY LOAD'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const FeedbackModal = () => {
    if (!currentFeedback) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-cyber max-w-xl w-full p-8 space-y-8 relative">
          <button onClick={() => setCurrentFeedback(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
          
          <div className="text-center">
            <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">BIO_FEEDBACK_REQUIRED</div>
            <h3 className="text-2xl font-display font-black text-white uppercase">{currentFeedback.meal.name_es}</h3>
            <div className="text-[10px] font-mono text-gray-500 mt-1">{currentFeedback.date}</div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center block">Bio-Calificación</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                    className={`transition-all ${feedbackForm.rating >= star ? 'text-primary' : 'text-gray-800 hover:text-primary/40'}`}
                  >
                    <Star size={32} fill={feedbackForm.rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
              {[
                { label: 'Sal', key: 'salt_rating' },
                { label: 'Pimienta', key: 'pepper_rating' },
                { label: 'Azúcar', key: 'sugar_rating' }
              ].map(stat => (
                <div key={stat.key} className="space-y-2">
                  <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block text-center">{stat.label}</label>
                  <input 
                    type="range" min="1" max="5" 
                    value={(feedbackForm as any)[stat.key]}
                    onChange={(e) => setFeedbackForm({...feedbackForm, [stat.key]: parseInt(e.target.value)})}
                    className="w-full accent-primary bg-white/10"
                  />
                  <div className="text-[10px] font-mono text-center text-primary font-black">LVL_{ (feedbackForm as any)[stat.key] }</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Observaciones Bio-Hacker</label>
              <textarea 
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all min-h-[80px] resize-none"
                placeholder="Sabor, textura, efectos post-ingesta..."
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Evidencia Visual (Opcional)</label>
               <input type="file" ref={feedbackPhotoRef} hidden accept="image/*" />
               <button 
                onClick={() => feedbackPhotoRef.current?.click()}
                className="w-full py-4 bg-white/5 border border-dashed border-white/20 rounded-xl text-gray-500 text-[10px] font-mono uppercase hover:border-primary hover:text-white transition-all flex items-center justify-center gap-3"
               >
                 <Camera size={14} /> Subir Foto del Plato
               </button>
            </div>
          </div>

          <button 
            onClick={submitFeedback}
            className="w-full btn-cyber-primary py-4 text-xs font-black tracking-[0.4em] flex items-center justify-center gap-3"
          >
            <CheckCircle2 size={16} /> ENVIAR BIO-FEEDBACK
          </button>
        </motion.div>
      </div>
    );
  };

  if (!t) return <div className="bg-black text-primary p-20 font-mono text-center">CRITICAL_ERROR: DATA_LOAD_FAILURE</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black flex">
      <SelectionModal />
      <FeedbackModal />

      <aside className="w-64 border-r border-white/10 hidden lg:flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="Warnfood" className="w-8 h-8 object-contain" />
            <span className="font-display font-black tracking-widest text-lg text-primary">WARNFOOD</span>
          </div>

          <nav className="space-y-2">
            { [
              { id: 'dashboard', icon: LayoutDashboard, label: t.panel.dashboard },
              { id: 'menu', icon: ChefHat, label: t.nav.menu },
              { id: 'history', icon: History, label: 'Historial' },
              { id: 'billing', icon: CreditCard, label: 'Suscripción' },
              { id: 'settings', icon: Settings, label: t.panel.settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all text-xs font-mono uppercase tracking-[0.2em] relative group ${
                  activeTab === item.id 
                    ? 'text-black font-black z-10' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary btn-cyber shadow-[0_0_20px_rgba(255,215,0,0.3)] -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {! (activeTab === item.id) && (
                   <div className="absolute inset-0 border border-white/5 btn-cyber opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                )}
                <item.icon size={18} className={activeTab === item.id ? 'text-black' : 'group-hover:text-primary transition-colors'} />
                <span>{item.label}</span>
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
            <div className="relative">
              <button 
                onClick={() => setShowFeedbackModal(!showFeedbackModal)}
                className="relative p-2 text-gray-500 hover:text-primary transition-all"
              >
                <Bell size={20} />
                {pendingFeedbacks.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-black text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {pendingFeedbacks.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showFeedbackModal && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-4 space-y-4"
                  >
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest border-b border-white/5 pb-2">PENDING_BIO_EVALUATIONS</div>
                    {pendingFeedbacks.length === 0 ? (
                      <div className="text-[10px] font-mono text-gray-500 py-4 text-center">Protocolo al día. Sin alertas.</div>
                    ) : (
                      <div className="space-y-3">
                        {pendingFeedbacks.map(f => (
                          <div 
                            key={f.id}
                            onClick={() => { setCurrentFeedback(f); setShowFeedbackModal(false); }}
                            className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-white group-hover:text-primary transition-colors">{f.meal.name_es}</span>
                              <span className="text-[8px] font-mono text-gray-500">{f.date}</span>
                            </div>
                            <div className="text-[8px] font-mono text-gray-500 uppercase">Click para evaluar</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleLang} className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1 rounded">
              {lang}
            </button>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-primary transition-all">
                    {(user?.profile_photo || user?.photo) ? <img src={user?.profile_photo || user?.photo} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-500" />}
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-56 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                    <div className="p-4 border-b border-white/5 bg-white/2">
                      <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">Authenticated</div>
                      <div className="text-[10px] font-mono text-primary font-bold truncate">{user?.email || 'user@warnfood.bcn'}</div>
                    </div>
                    <button onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3"><User size={14} /> {t.panel.edit}</button>
                    <button onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3"><Settings size={14} /> {t.panel.settings}</button>
                    <button onClick={() => { setUser(null); goTo('demo') }} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-red-500/5 text-red-500 flex items-center gap-3"><LogOut size={14} /> {t.panel.logout}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        <main className="p-8 max-w-7xl mx-auto space-y-12">
          <>
            {activeTab === 'dashboard' && (
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
          )}

          {activeTab === 'menu' && (
            <div className="space-y-12">
              <div className="text-center">
                <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4">BIO_CATALOG_SYNC</div>
                <h2 className="text-5xl font-display font-black uppercase text-white">Catálogo de Alto Rendimiento</h2>
              </div>
              <MealCatalog 
                meals={catalogMeals} 
                lang={lang} 
                sizeMultiplier={user?.tupper_size === 'S' ? 0.8 : user?.tupper_size === 'L' ? 1.3 : 1}
              />
            </div>
          )}

          {activeTab === 'history' && (
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
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                           {item.meal.image ? <img src={item.meal.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700"><ChefHat size={32} /></div>}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">{item.date}</div>
                          <h4 className="text-xl font-display font-black text-white group-hover:text-primary transition-colors">{item.meal.name_es}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={item.rating >= s ? "currentColor" : "none"} className={item.rating >= s ? "text-primary" : "text-gray-800"} />)}
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 uppercase">{item.comment}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">CALORÍAS_EXP</div>
                          <div className="text-lg font-display font-black text-white">{item.meal.kcal} <span className="text-[10px] text-gray-500">KCAL</span></div>
                        </div>
                        <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary hover:text-primary transition-all">
                          <History size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
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
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4">BIO_CORE_SETTINGS</div>
                <h2 className="text-5xl font-display font-black uppercase text-white">{t.panel.settings_title}</h2>
              </div>

              <div className="card-cyber p-10 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Settings size={120} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 border-b border-white/5 pb-10">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-xl border-2 border-primary/30 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-primary transition-all relative shadow-2xl">
                      {(user?.profile_photo || user?.photo) ? (
                        <img src={user?.profile_photo || user?.photo} className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-gray-500" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Camera size={24} className="text-primary" />
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={() => {}} />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl font-display font-black text-white uppercase mb-1">{user?.name || 'OPERATOR'}</h4>
                    <p className="text-xs font-mono text-primary tracking-widest mb-4">{user?.email}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-mono text-gray-500 uppercase">
                      User_ID: {user?.userId?.toString().padStart(4, '0')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.panel.full_name}</label>
                    <input 
                      type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.panel.phone}</label>
                    <input 
                      type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.panel.height} (CM)</label>
                    <input 
                      type="number" value={settingsForm.height} onChange={(e) => setSettingsForm({...settingsForm, height: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.panel.weight} (KG)</label>
                    <input 
                      type="number" value={settingsForm.weight} onChange={(e) => setSettingsForm({...settingsForm, weight: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.panel.tupper_size}</label>
                  <div className="flex gap-4">
                    {['S', 'M', 'L'].map(size => (
                      <button 
                        key={size} onClick={() => setSettingsForm({...settingsForm, tupper_size: size})}
                        className={`flex-1 py-4 rounded-xl border font-mono transition-all text-xs ${settingsForm.tupper_size === size ? 'bg-primary border-primary text-black font-black shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                      >
                        SIZE_{size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.panel.dietary_notes}</label>
                  <textarea 
                    value={settingsForm.dietary_notes} onChange={(e) => setSettingsForm({...settingsForm, dietary_notes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-primary outline-none transition-all min-h-[120px] resize-none font-mono"
                    placeholder="ALERGIAS_RESTRICCIONES..."
                  />
                </div>

                <label className="flex items-center gap-4 cursor-pointer group bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all">
                  <div 
                    onClick={() => setSettingsForm({...settingsForm, is_vegetarian: !settingsForm.is_vegetarian})}
                    className={`w-6 h-6 rounded border transition-all flex items-center justify-center ${settingsForm.is_vegetarian ? 'bg-primary border-primary' : 'bg-white/5 border-white/20'}`}
                  >
                    {settingsForm.is_vegetarian && <CheckCircle2 size={16} className="text-black" />}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">{t.panel.is_vegetarian}</span>
                </label>

                <button 
                  onClick={updateProfile} disabled={isUpdating}
                  className="w-full btn-cyber-primary py-5 text-xs font-black tracking-[0.5em] flex items-center justify-center gap-4 shadow-xl"
                >
                  {isUpdating ? <Activity size={18} className="animate-spin" /> : <Save size={18} />}
                  {t.panel.save_settings}
                </button>
              </div>
            </div>
          )}
          </>
        </main>
      </div>
    </div>
  );
}

export default Panel;
