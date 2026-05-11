import React, { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, LogOut, User as UserIcon, Settings as SettingsIcon, ChefHat, History as HistoryIcon, 
  CreditCard, LayoutDashboard, Bell, ChevronDown, ChevronLeft, AlertTriangle, UserCircle, Users, Copy, Truck, Zap, ScrollText, Printer, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { i18n, mealOptions } from '../data';

// Import Modular Components
import DashboardTab from '../components/Panel/DashboardTab';
import HistoryTab from '../components/Panel/HistoryTab';
import BillingTab from '../components/Panel/BillingTab';
import SettingsTab from '../components/Panel/SettingsTab';
import MealCatalog from '../components/MealCatalog';
import SelectionModal from '../components/Panel/SelectionModal';
import FeedbackModal from '../components/Panel/FeedbackModal';
import MealDetailModal from '../components/Panel/MealDetailModal';
import PaymentModal from '../components/Panel/PaymentModal';

const chartData = [
  { name: 'Lun', weight: 79.2, fat: 15.1, water: 2.1 },
  { name: 'Mar', weight: 78.8, fat: 14.8, water: 2.5 },
  { name: 'Mie', weight: 78.5, fat: 14.7, water: 2.8 },
  { name: 'Jue', weight: 78.2, fat: 14.5, water: 2.4 },
  { name: 'Vie', weight: 78.0, fat: 14.2, water: 3.1 },
  { name: 'Sab', weight: 78.3, fat: 14.3, water: 2.2 },
  { name: 'Dom', weight: 78.1, fat: 14.2, water: 2.0 },
];

function Panel({ lang, toggleLang, goTo, user, setUser, selectedDays, setSelectedDays, onLogout }: any) {
  const t = i18n[lang as 'es' | 'en'];
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [selectedMealForDetails, setSelectedMealForDetails] = useState<any>(null);

  const [dailySelections, setDailySelections] = useState<any>({});
  const [catalogMeals, setCatalogMeals] = useState<any[]>([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState<any[]>([]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [mealHistory, setMealHistory] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([
    { id: '1', last4: '4412', exp: '12/28', brand: 'VISA' }
  ]);
  const [selectedPlan, setSelectedPlan] = useState('PLATINO_VIP');
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [showDailyDiet, setShowDailyDiet] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPurchaseItems, setPendingPurchaseItems] = useState<any[]>([]);
  
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5, salt_rating: 3, pepper_rating: 3, sugar_rating: 3,
    comment: '', is_reported: false, issue_details: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedbackPhotoRef = useRef<HTMLInputElement>(null);

  const [settingsForm, setSettingsForm] = useState({
    name: user?.name || '', phone: user?.phone || '', height: user?.height || '',
    weight: user?.weight || '', target_weight: user?.target_weight || '', 
    age: user?.age || '', birth_date: user?.birth_date || '', tupper_size: user?.tupper_size || 'M',
    dietary_notes: user?.dietary_notes || '', is_vegetarian: user?.is_vegetarian || false
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Sync settings when user changes
  React.useEffect(() => {
    if (user) {
      setSettingsForm({
        name: user.name || '', phone: user.phone || '', height: user.height || '',
        weight: user.weight || '', target_weight: user.target_weight || '', 
        age: user.age || '', birth_date: user.birth_date || '', tupper_size: user.tupper_size || 'M',
        dietary_notes: user.dietary_notes || '', is_vegetarian: user.is_vegetarian || false
      });
    }
  }, [user]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const triggerNotify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 5000);
  };

  const refreshData = () => {
    if (!user?.userId) return;
    fetch(`/api/meals/pending/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setPendingFeedbacks(data); });
    fetch(`/api/meals/history/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setMealHistory(data); });
    fetch(`/api/meals/plans/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setMealPlans(data); });
    fetch(`/api/invoices/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setInvoices(data); });
    fetch(`/api/subscriptions/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setSubscriptions(data); });
  };

  // Initial Data Fetch
  React.useEffect(() => {
    fetch('/api/meals/list')
      .then(res => res.json())
      .then(data => { 
        console.log("Catálogo recibido:", data);
        if (Array.isArray(data)) setCatalogMeals(data); 
      })
      .catch(err => console.error("API_LOAD_ERROR:", err));

    if (user?.userId) {
      fetch(`/api/meals/pending/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setPendingFeedbacks(data); });
      fetch(`/api/meals/history/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setMealHistory(data); });
      fetch(`/api/meals/plans/${user.userId}`).then(res => res.json()).then(data => { if (Array.isArray(data)) setMealPlans(data); });

      // Trigger shipping alert for demo
      setTimeout(() => {
        triggerNotify('success', lang === 'es' ? "BIO_LOGISTICS_UPDATE: Entrega en curso (BCN_ZONE_01)" : "BIO_LOGISTICS_UPDATE: Delivery in progress (BCN_ZONE_01)");
      }, 1500);
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
    if (feedbackPhotoRef.current?.files?.[0]) formData.append('meal_photo', feedbackPhotoRef.current.files[0]);

    try {
      const response = await fetch('/api/meals/feedback', { method: 'POST', body: formData });
      if (response.ok) {
        setPendingFeedbacks(prev => prev.filter(f => f.id !== currentFeedback.id));
        setCurrentFeedback(null);
        triggerNotify('success', lang === 'es' ? "Bio-Feedback sincronizado correctamente." : "Bio-Feedback synced successfully.");
        refreshData();
      }
    } catch (e) { triggerNotify('error', "NETWORK_FAILURE: Protocol interrupted."); } finally { setIsUpdating(false); }
  };

  const updateProfile = async () => {
    if (!user?.userId) return;
    setIsUpdating(true);
    const formData = new FormData();
    Object.entries(settingsForm).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v.toString());
    });
    if (fileInputRef.current?.files?.[0]) formData.append('photo', fileInputRef.current.files[0]);

    try {
      const response = await fetch(`/api/profile/update/${user.userId}`, { method: 'PATCH', body: formData });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        triggerNotify('success', lang === 'es' ? "Perfil actualizado correctamente." : "Profile updated successfully.");
      }
    } catch (e) { triggerNotify('error', "NETWORK_FAILURE: Remote node unreachable."); } finally { setIsUpdating(false); }
  };

  const onPaymentSuccess = async () => {
    const totalItemsCount = selectedDays.size + cart.length;
    const newOrder = {
      id: Date.now(),
      status: 'PREPARANDO',
      date: new Date().toLocaleDateString(),
      items: totalItemsCount
    };
    setActiveOrders([newOrder, ...activeOrders]);
    triggerNotify('success', lang === 'es' ? "¡Pago exitoso! Protocolo de envío activado." : "Payment successful! Shipping protocol activated.");
    
    // Procesa checkout del calendario si hay días seleccionados
    if (selectedDays.size > 0) {
      const calendarItems: any[] = [];
      selectedDays.forEach(day => {
        const daySels = dailySelections[day] || {};
        Object.values(daySels).forEach((ids: any) => {
          ids.forEach((id: string) => {
            const meal = catalogMeals.find(m => m.id_code === id);
            if (meal) calendarItems.push({ ...meal, price: meal.price * (user?.tupper_size === 'S' ? 0.8 : user?.tupper_size === 'L' ? 1.3 : 1) });
          });
        });
      });
      
      if (calendarItems.length > 0) {
        await handleCheckoutProcess(calendarItems);
        setSelectedDays(new Set());
      }
    }

    refreshData();
  };

  const handleCheckoutProcess = async (items: any[]) => {
    if (!user?.userId) return;
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.userId,
          total: items.reduce((acc, item) => acc + parseFloat(item.price), 0),
          items: items
        })
      });
      if (response.ok) {
        await fetch(`/api/cart/clear?user_id=${user.userId}`, { method: 'POST' });
      }
      return response.ok;
    } catch (e) { console.error("CHECKOUT_ERROR:", e); return false; }
  };
  const removeFromCart = async (mealIdCode: string, idx: number) => {
    if (!user?.userId) return;
    try {
      await fetch(`/api/cart/remove?user_id=${user.userId}&meal_id_code=${mealIdCode}`, { method: 'POST' });
      setCart(cart.filter((_, i) => i !== idx));
    } catch (e) { console.error("REMOVE_CART_ERROR:", e); }
  };

  const handlePurchaseFromCatalog = (selectedItems: any[]) => {
    if (!user?.userId) return;
    setPendingPurchaseItems(selectedItems);
    setShowPaymentModal(true);
  };

  const confirmPurchaseFromCatalog = async (methodId: string) => {
    if (!user?.userId) return;
    const success = await handleCheckoutProcess(pendingPurchaseItems);
    if (success) {
      triggerNotify('success', lang === 'es' ? "Protocolo de compra activado." : "Purchase protocol activated.");
      setShowPaymentModal(false);
      setPendingPurchaseItems([]);
      refreshData();
    }
  };

  const handleUpgradeSubscription = async (planName: string, price: number) => {
    if (!user?.userId) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/subscriptions/upgrade?user_id=${user.userId}&plan_name=${planName}&price=${price}`, { method: 'POST' });
      if (response.ok) {
        triggerNotify('success', lang === 'es' ? `Protocolo ${planName} activado.` : `${planName} protocol activated.`);
        refreshData();
      }
    } catch (e) { triggerNotify('error', "SUBSCRIPTION_FAILURE: Remote node unreachable."); }
    finally { setIsUpdating(false); }
  };

  const toggleDay = useCallback((day: number) => {
    setSelectedDays((prev: Set<number>) => {
      const n = new Set(prev);
      if (n.has(day)) { n.delete(day); const newSels = { ...dailySelections }; delete newSels[day]; setDailySelections(newSels); } 
      else { n.add(day); }
      return n;
    });
  }, [setSelectedDays, dailySelections]);

  const handleSelection = (day: number, type: string, mealId: string) => {
    setDailySelections((prev: any) => {
      const currentDay = prev[day] || {};
      const currentTypeSelections = currentDay[type] || [];
      const newTypeSelections = currentTypeSelections.includes(mealId) 
        ? currentTypeSelections.filter((id: string) => id !== mealId) 
        : [...currentTypeSelections, mealId];
      return { ...prev, [day]: { ...currentDay, [type]: newTypeSelections } };
    });
  };

  const savePlan = async (day: number) => {
    if (!user?.userId) return;
    const selection = dailySelections[day] || {};
    
    // Updated validation with correct keys
    if (!selection.almuerzo || selection.almuerzo.length === 0) {
      triggerNotify('error', lang === 'es' ? "BIO_ERROR: El Almuerzo es obligatorio para estabilizar macros." : "BIO_ERROR: Lunch is mandatory to stabilize macros.");
      return;
    }
    
    try {
      const response = await fetch(`/api/meals/select/${user.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: `2026-05-${day.toString().padStart(2, '0')}`, selections: selection })
      });
      if (response.ok) {
        setEditingDay(null);
        triggerNotify('success', lang === 'es' ? "Plan operativo guardado." : "Operational plan saved.");
        refreshData();
      }
    } catch (e) { triggerNotify('error', "NETWORK_FAILURE: Remote node unreachable."); }
  };

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDow = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  const monthName = now.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' });

  if (!t) return <div className="bg-black text-primary p-20 font-mono text-center">CRITICAL_ERROR: DATA_LOAD_FAILURE</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black flex">
      <SelectionModal 
        editingDay={editingDay} setEditingDay={setEditingDay} dailySelections={dailySelections} 
        catalogMeals={catalogMeals} mealOptions={mealOptions} user={user} lang={lang} 
        handleSelection={handleSelection} savePlan={savePlan} t={t}
        onViewDetails={setSelectedMealForDetails}
      />

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-10 right-10 z-[300] w-full max-w-sm"
          >
            <div className={`backdrop-blur-2xl p-5 rounded-2xl flex items-center gap-5 shadow-2xl border-2 transition-all ${
              notification.type === 'success' 
                ? 'bg-green-600 border-green-400 shadow-[0_0_50px_rgba(34,197,94,0.5)]' 
                : 'bg-red-600 border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.5)]'
            }`}>
              <div className={`p-3 rounded-xl text-black animate-pulse bg-white`}>
                <AlertTriangle size={26} />
              </div>
              <div className="flex-1">
                <div className={`text-[10px] font-mono font-black uppercase tracking-widest mb-1 ${
                  notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {notification.type === 'success' ? 'BIO_SYNC_OK' : 'CRITICAL_BIO_ERROR'}
                </div>
                <div className="text-sm font-display font-bold text-white leading-tight">{notification.msg}</div>
              </div>
              <button onClick={() => setNotification(null)} className="p-2 text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <FeedbackModal 
        currentFeedback={currentFeedback} setCurrentFeedback={setCurrentFeedback} 
        feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm} 
        feedbackPhotoRef={feedbackPhotoRef} submitFeedback={submitFeedback}
      />

      <AnimatePresence>
        {showDailyDiet && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card-cyber p-8 max-w-2xl w-full relative max-h-[80vh] overflow-hidden flex flex-col">
              <button onClick={() => setShowDailyDiet(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
              <div className="text-center mb-8">
                 <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">DAILY_DIET_HUD</div>
                 <h3 className="text-3xl font-display font-black text-white uppercase">Protocolo 12 Mayo</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                {(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const plan = mealPlans.find(p => p.date === today);
                  if (!plan) return <div className="text-center py-20 text-gray-500 font-mono text-xs uppercase tracking-widest">Sin raciones programadas para hoy.</div>;
                  
                  const dailyItems: any[] = [];
                  Object.entries(plan.selections).forEach(([type, ids]: [any, any]) => {
                    ids.forEach((id_code: string) => {
                      const meal = catalogMeals.find(m => m.id_code === id_code);
                      if (meal) dailyItems.push({ ...meal, type });
                    });
                  });

                  return dailyItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                       <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img src={item.img_path} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <div className="text-[8px] font-mono text-primary uppercase mb-1">{item.type}</div>
                          <div className="text-sm font-black text-white uppercase">{item.name_es}</div>
                          <div className="flex gap-3 mt-2">
                             <div className="text-[7px] font-mono text-gray-500">{item.kcal} KCAL</div>
                             <div className="text-[7px] font-mono text-gray-500">{item.protein}G P</div>
                             <div className="text-[7px] font-mono text-gray-500">{item.carbs}G C</div>
                          </div>
                       </div>
                       <div className="text-primary opacity-30 group-hover:opacity-100 transition-all">
                          <CheckCircle2 size={20} />
                       </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMealForDetails && (
          <MealDetailModal 
            meal={selectedMealForDetails} 
            onClose={() => setSelectedMealForDetails(null)} 
            lang={lang} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal 
            isOpen={showPaymentModal} 
            onClose={() => setShowPaymentModal(false)} 
            items={pendingPurchaseItems} 
            total={pendingPurchaseItems.reduce((acc, m) => acc + (parseFloat(m.price) || 0), 0)} 
            onConfirm={confirmPurchaseFromCatalog} 
            cards={cards} 
            lang={lang} 
          />
        )}
      </AnimatePresence>

      <aside className="w-64 border-r border-white/10 hidden lg:flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12" onClick={() => goTo('demo')}>
            <img src="/logo.png" alt="Warnfood" className="w-8 h-8 object-contain" />
            <span className="font-display font-black tracking-widest text-lg text-primary">WARNFOOD</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: UserCircle, label: 'Perfil' },
              { id: 'menu', icon: ChefHat, label: t.nav.menu },
              { id: 'history', icon: HistoryIcon, label: 'Historial' },
              { id: 'billing', icon: CreditCard, label: 'Suscripción' },
              { id: 'invoices', icon: ScrollText, label: 'Facturación' },
              { id: 'settings', icon: SettingsIcon, label: t.panel.settings }
            ].map(item => (
              <button
                key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all text-xs font-mono uppercase tracking-[0.2em] relative group ${activeTab === item.id ? 'text-black font-black z-10' : 'text-gray-500 hover:text-white'}`}
              >
                {activeTab === item.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary btn-cyber shadow-[0_0_20px_rgba(255,215,0,0.3)] -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                <item.icon size={18} className={activeTab === item.id ? 'text-black' : 'group-hover:text-primary transition-colors'} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-xs font-mono uppercase tracking-widest">
            <LogOut size={18} /> {t.panel.logout}
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <nav className="h-20 border-b border-white/10 px-8 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <button onClick={() => goTo('demo')} className="text-[10px] font-mono text-gray-500 hover:text-primary transition-all flex items-center gap-2">
            <ChevronLeft size={14} /> {t.panel.exit}
          </button>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button onClick={() => setShowDailyDiet(true)} className="relative p-2 text-gray-500 hover:text-primary transition-all group">
                <ChefHat size={20} className="group-hover:rotate-12 transition-transform" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setShowNotificationMenu(!showNotificationMenu)} className="relative p-2 text-gray-500 hover:text-primary transition-all">
                <Bell size={20} />
                {(pendingFeedbacks.length + activeOrders.length) > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-black text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {pendingFeedbacks.length + activeOrders.length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotificationMenu && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-80 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-4 space-y-6 max-h-[500px] overflow-y-auto">
                    {activeOrders.length > 0 && (
                      <div className="space-y-4">
                        <div className="text-[10px] font-mono text-green-500 uppercase tracking-widest border-b border-green-500/10 pb-2 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                           ACTIVE_LOGISTICS_PROTOCOLS
                        </div>
                        <div className="space-y-3">
                          {activeOrders.map(order => (
                            <div key={order.id} className="p-3 bg-green-500/5 rounded-xl border border-green-500/20 flex gap-4 items-center">
                              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                <Truck size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-black text-white uppercase truncate">Pedido #{order.id.toString().slice(-6)}</div>
                                <div className="text-[8px] font-mono text-gray-500">{order.items} Protocolos Activados</div>
                              </div>
                              <div className="text-[7px] font-mono bg-green-500 text-black px-2 py-0.5 rounded font-black uppercase">En Camino</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="text-[10px] font-mono text-primary uppercase tracking-widest border-b border-white/5 pb-2">PENDING_BIO_EVALUATIONS</div>
                      {pendingFeedbacks.length === 0 ? <div className="text-[10px] font-mono text-gray-500 py-4 text-center">Protocolo al día. Sin alertas.</div> : (
                        <div className="space-y-3">
                          {pendingFeedbacks.map(f => (
                            <div key={f.id} onClick={() => { setCurrentFeedback(f); setShowNotificationMenu(false); }} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group flex gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                <img src={f.meal.img_path} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-white group-hover:text-primary transition-colors truncate">{f.meal.name_es}</span>
                                  <span className="text-[8px] font-mono text-gray-500 shrink-0 ml-2">{f.date}</span>
                                </div>
                                <div className="text-[8px] font-mono text-gray-500 uppercase">Click para evaluar</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleLang} className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1 rounded">{lang}</button>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-primary transition-all">
                    {(user?.profile_photo || user?.photo) ? <img src={user?.profile_photo || user?.photo} className="w-full h-full object-cover" /> : <UserIcon size={20} className="text-gray-500" />}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold leading-tight">{user?.name || 'OPERATOR'}</div>
                  <div className="text-[10px] font-mono text-primary flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    {user?.credits || 100} CR
                  </div>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-56 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                    <div className="p-4 border-b border-white/5 bg-white/2"><div className="text-[8px] font-mono text-gray-500 uppercase mb-1">Authenticated</div><div className="text-[10px] font-mono text-primary font-bold truncate">{user?.email}</div></div>
                    <button onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-white/5 flex items-center gap-3"><UserIcon size={14} /> {t.panel.edit}</button>
                    <button onClick={() => { setUser(null); goTo('demo') }} className="w-full px-6 py-4 text-left text-xs font-mono hover:bg-red-500/5 text-red-500 flex items-center gap-3"><LogOut size={14} /> {t.panel.logout}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        <main className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div>
              <DashboardTab 
                selectedDays={selectedDays} monthName={monthName} daysInMonth={daysInMonth} 
                firstDow={firstDow} dailySelections={dailySelections} toggleDay={toggleDay} 
                setEditingDay={setEditingDay} chartData={chartData} user={user} 
                catalogMeals={catalogMeals} onSwitchTab={setActiveTab}
                cards={cards}
                onPaymentSuccess={onPaymentSuccess}
              />
              
              {/* REFERRAL_PROGRAM_BAR */}
              <div className="card-cyber p-6 bg-gradient-to-r from-primary/10 to-transparent border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6 mt-12 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                     <Users size={24} />
                  </div>
                  <div>
                     <h4 className="text-lg font-display font-black text-white uppercase italic">Bio-Referral Program</h4>
                     <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Invita a otros Hackers y recibe créditos para canjear por comida</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 pr-4 group-hover:border-primary/50 transition-all relative z-10">
                  <span className="text-xs font-mono text-primary font-black uppercase ml-2 tracking-widest">
                    FOODLIVE-USER-{user?.id || user?.userId || '0000'}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`FOODLIVE-USER-${user?.id || user?.userId || '0000'}`);
                    }}
                    className="p-2 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-lg transition-all"
                  >
                     <Copy size={14} />
                  </button>
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
                user={user}
                onPurchase={handlePurchaseFromCatalog}
                sizeMultiplier={user?.tupper_size === 'S' ? 0.8 : user?.tupper_size === 'L' ? 1.3 : 1} 
                onViewDetails={setSelectedMealForDetails} 
              />
            </div>
          )}
          {activeTab === 'history' && <HistoryTab mealHistory={mealHistory} onViewDetails={setSelectedMealForDetails} onEvaluate={setCurrentFeedback} />}
          {activeTab === 'billing' && (
            <BillingTab 
              user={user} 
              selectedDays={selectedDays} 
              cards={cards} 
              setCards={setCards}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              subscriptions={subscriptions}
              onUpgrade={handleUpgradeSubscription}
            />
          )}
          {activeTab === 'settings' && <SettingsTab user={user} settingsForm={settingsForm} setSettingsForm={setSettingsForm} fileInputRef={fileInputRef} updateProfile={updateProfile} isUpdating={isUpdating} t={t} />}
          
          {activeTab === 'invoices' && (
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="text-center">
                <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4">BILLING_ARCHIVE</div>
                <h2 className="text-5xl font-display font-black uppercase text-white">Historial de Facturación</h2>
              </div>

              <div className="space-y-4">
                {invoices.length === 0 ? (
                  <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/2 text-gray-500 font-mono text-xs uppercase tracking-widest">No se han generado facturas aún.</div>
                ) : (
                  invoices.map(inv => (
                    <div key={inv.id} onClick={() => setSelectedInvoice(inv)} className="card-cyber p-6 flex justify-between items-center group cursor-pointer hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-primary font-black uppercase">{inv.invoice_number}</div>
                          <div className="text-[9px] font-mono text-gray-500 uppercase">{inv.created_at} • {inv.items_count} Ítems</div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-8">
                        <div>
                          <div className="text-xl font-display font-black text-white">{inv.total_amount}€</div>
                          <div className="text-[7px] font-mono text-green-500 uppercase tracking-widest">Protocolo: PAGADO</div>
                        </div>
                        <ChevronLeft size={16} className="text-gray-700 rotate-180 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'cart' && (
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="text-center">
                <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-4">SHOPPING_CART</div>
                <h2 className="text-5xl font-display font-black uppercase text-white">Tu Carrito Bio-Hacker</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/2 text-gray-500 font-mono text-xs uppercase tracking-widest">
                  El carrito está vacío. Explora el catálogo para añadir raciones.
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="card-cyber p-6 flex justify-between items-center group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all">
                          <img src={item.img_path} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase">{item.name_es}</div>
                          <div className="text-[9px] font-mono text-gray-500 uppercase">{item.category} • Protocolo Activo</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-xl font-display font-black text-white">{parseFloat(item.price).toFixed(2)}€</div>
                        <button onClick={() => removeFromCart(item.id_code, idx)} className="p-2 text-gray-700 hover:text-red-500 transition-all"><X size={16} /></button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-12 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                     <div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Total a Pagar</div>
                        <div className="text-4xl font-display font-black text-white">
                          {cart.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2)}€
                        </div>
                     </div>
                     <button 
                        onClick={onPaymentSuccess}
                        className="btn-cyber-primary py-4 px-12 flex items-center gap-4 text-sm font-black italic group"
                     >
                        <Zap size={18} fill="currentColor" />
                        PAGAR Y ACTIVAR PEDIDO
                        <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-black border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <div>
                  <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-1">Electronic_Invoice_v2</div>
                  <h3 className="text-2xl font-display font-black text-white uppercase italic">Factura {selectedInvoice.invoice_number}</h3>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={20} /></button>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-8 border-b border-white/5 pb-8">
                  <div>
                    <div className="text-[8px] font-mono text-gray-500 uppercase mb-2">Emisor</div>
                    <div className="text-xs font-bold text-white uppercase">FoodLive Bio-Tech S.A.</div>
                    <div className="text-[9px] font-mono text-gray-500">Node_ID: WARNFOOD-SPAIN-01</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-mono text-gray-500 uppercase mb-2">Fecha de Emisión</div>
                    <div className="text-xs font-bold text-white">{selectedInvoice.created_at}</div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4">Items_Protocol</div>
                  {selectedInvoice.items_data.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-white uppercase">{item.name}</div>
                        <div className="text-[8px] font-mono text-gray-500 mt-1">{item.category} • ID: {item.id_code}</div>
                        <div className="mt-3 flex gap-1 h-4">
                           {/* Mock Barcode per item */}
                           {Array.from({length: 15}).map((_, j) => (
                             <div key={j} className="bg-white/20" style={{ width: j%4==0?'3px':'1.5px', height: '100%' }} />
                           ))}
                           <span className="text-[7px] font-mono text-primary/40 ml-2">{item.barcode}</span>
                        </div>
                      </div>
                      <div className="text-lg font-display font-black text-white ml-6">{item.price.toFixed(2)}€</div>
                    </div>
                  ))}
                </div>

                {/* Footer Totals */}
                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                   <div className="flex flex-col gap-2">
                      <div className="text-[8px] font-mono text-gray-500 uppercase">Firma Digital</div>
                      <div className="text-[9px] font-mono text-primary/30 truncate max-w-[200px]">SHA256: {Math.random().toString(36).substring(2, 34).toUpperCase()}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Importe Total</div>
                      <div className="text-4xl font-display font-black text-primary">{parseFloat(selectedInvoice.total_amount).toFixed(2)}€</div>
                   </div>
                </div>
              </div>

              <div className="p-8 bg-white/2 border-t border-white/5 flex gap-4">
                 <button onClick={() => window.print()} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono font-black uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Printer size={16} /> Imprimir PDF
                 </button>
                 <button onClick={() => setSelectedInvoice(null)} className="flex-1 py-4 bg-primary text-black rounded-2xl text-[10px] font-mono font-black uppercase hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all">
                    Cerrar Protocolo
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Panel;
