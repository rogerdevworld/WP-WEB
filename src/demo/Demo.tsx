import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Timer,
  ShoppingBag,
  Sparkles,
  Globe,
  User,
  Flame,
  Droplets,
  Trash2,
  Ticket
} from 'lucide-react';
import { i18n, weeklyMenu, sizes } from '../data';
import HeroBattleSlider from '../components/HeroBattleSlider';
import MealCatalog from '../components/MealCatalog';

export default function Demo({ lang, toggleLang, goTo, user, setUser, setShowLogin, setIsRegistering, selectedDays, setSelectedDays }: any) {
  const t = i18n[lang as 'es'|'en'];
  const [activeSize, setActiveSize] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [meals, setMeals] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('lunch');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    fetch('http://localhost:8000/api/meals/list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMeals(data);
      })
      .catch(err => console.error("API_LOAD_ERROR:", err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'breakfast', es: 'DESAYUNO', en: 'BREAKFAST' },
    { id: 'lunch', es: 'ALMUERZO', en: 'LUNCH' },
    { id: 'dinner', es: 'CENA', en: 'DINNER' },
    { id: 'snacks', es: 'SNACKS', en: 'SNACKS' },
    { id: 'juices', es: 'JUGOS', en: 'JUICES' }
  ];

  const filteredMeals = Array.isArray(meals) ? meals.filter(m => {
    if (activeCategory === 'snacks') return m.category === 'snack1' || m.category === 'snack2';
    return m.category === activeCategory;
  }) : [];

  const visibleMeals = showAll ? filteredMeals : filteredMeals.slice(0, 4);

  if (!t) return <div className="bg-black text-primary p-20 font-mono">CRITICAL_ERROR: DATA_LOAD_FAILURE</div>;

  return (
    <div className="relative overflow-hidden bg-black text-white selection:bg-primary selection:text-black">
      {/* HUD Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center ${scrollY > 50 ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Warnfood" className="w-10 h-10 object-contain" />
          <span className="font-display font-black tracking-[0.2em] text-xl">WARNFOOD</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase">
          <a href="#menu" className="hover:text-primary transition-colors">{t.nav.menu}</a>
          <a href="#savings" className="hover:text-primary transition-colors">{t.nav.savings}</a>
          <button onClick={() => {setIsRegistering(true); setShowLogin(true)}} className="hover:text-primary transition-colors">{t.nav.register}</button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 transition-all text-xs font-mono">
            {lang.toUpperCase()}
          </button>
          {user ? (
            <button onClick={() => goTo('panel')} className="btn-cyber-primary py-2 px-5 text-xs flex items-center gap-2">
              <User size={14} /> {user.name?.split(' ')[0] || 'OPERATOR'}
            </button>
          ) : (
            <button onClick={() => {setIsRegistering(false); setShowLogin(true)}} className="btn-cyber-primary py-2 px-5 text-xs">
              ACCESS_SYSTEM
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section: Oferta Irresistible */}
      <section className="relative pt-40 pb-20 px-6 text-center max-w-7xl mx-auto overflow-visible">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-mono tracking-[0.3em] mb-8">
            <Sparkles size={12} className="animate-pulse" /> {t.hero.tag}
          </div>
          
          <h1 className="text-6xl md:text-9xl font-display font-black mb-8 leading-[0.85] tracking-tighter">
            {t.hero.title.split(' ')[0]} <span className="text-primary glitch-text relative inline-block" data-text={t.hero.title.split(' ').slice(1).join(' ')}>{t.hero.title.split(' ').slice(1).join(' ')}</span>
          </h1>

          {/* Precio y Oferta */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="relative">
              <span className="text-3xl md:text-5xl text-gray-600 line-through font-display opacity-50">{t.hero.priceOld}</span>
              <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 -rotate-12" />
            </div>
            <ArrowRight size={40} className="text-primary animate-bounce-x" />
            <div className="bg-primary text-black px-8 py-4 rounded-lg rotate-2 shadow-[0_0_30px_#FFD700]">
              <span className="text-5xl md:text-7xl font-display font-black">{t.hero.priceNew}</span>
              <div className="text-[10px] font-black uppercase tracking-widest mt-1">Lanzamiento_Beta</div>
            </div>
          </div>
          
          <p className="max-w-3xl mx-auto text-gray-400 font-sans text-lg md:text-xl mb-12 leading-relaxed">
            {t.hero.desc}
          </p>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => {setIsRegistering(true); setShowLogin(true)}}
              className="btn-cyber-primary text-md px-16 py-6 group relative overflow-hidden"
            >
               <span className="relative z-10 flex items-center gap-3">
                {t.hero.cta} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20" />
            </button>

            {/* Urgencia y Cupón */}
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                  <span>{t.hero.urgency}</span>
                  <span className="text-primary">60%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-primary shadow-[0_0_10px_#FFD700]" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-[10px] font-mono text-primary animate-pulse">
                <Ticket size={14} /> {t.hero.coupon}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Battle Slider (Warmfood vs Súper) */}
      <HeroBattleSlider />

      {/* B. El Cuadro de "Ahorro Invisible" */}
      <section id="savings" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-xs font-mono text-primary tracking-[0.5em] uppercase mb-4">{t.savings.title}</h2>
          <h3 className="text-4xl md:text-6xl font-display font-bold uppercase">{t.savings.subtitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.savings.items.map((item: any, i: number) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="card-cyber p-8 text-center flex flex-col items-center group bg-gradient-to-b from-white/5 to-transparent"
            >
              <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:border-primary transition-all">
                {i === 0 && <Timer size={32} />}
                {i === 1 && <Flame size={32} />}
                {i === 2 && <Droplets size={32} />}
                {i === 3 && <Trash2 size={32} />}
              </div>
              <div className="text-4xl font-display font-black mb-2 text-white">{item.value}</div>
              <div className="text-[10px] font-mono text-primary tracking-widest uppercase mb-4">{item.title}</div>
              <p className="text-xs text-gray-500 leading-relaxed font-mono uppercase">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* C. Menú de la Semana (Catálogo) */}
      <section id="menu" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-xs font-mono text-primary tracking-[0.5em] uppercase mb-4">DEPLOYMENT_CATALOG</h2>
            <h3 className="text-5xl md:text-7xl font-display font-bold uppercase">{t.menu.title}</h3>
          </div>
          
          <div className="space-y-4 text-right">
             <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => {setActiveCategory(cat.id); setShowAll(false)}}
                  className={`px-6 py-2.5 rounded-lg font-mono text-[10px] tracking-widest transition-all ${activeCategory === cat.id ? 'bg-primary text-black font-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'text-gray-400 hover:text-white'}`}
                >
                  {lang === 'es' ? cat.es : cat.en}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit ml-auto">
              {sizes.map((s, i) => (
                <button key={i} onClick={() => setActiveSize(i)} className={`px-8 py-2 rounded-lg font-mono text-[10px] transition-all ${activeSize === i ? 'bg-white/10 text-primary font-black border border-primary/30' : 'text-gray-500 hover:text-white'}`}>
                  {s.letter} ({s.grams})
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <MealCatalog meals={visibleMeals} lang={lang} />
          </motion.div>
        </AnimatePresence>

        {filteredMeals.length > 4 && (
          <div className="mt-12 text-center">
            <button onClick={() => setShowAll(!showAll)} className="px-10 py-4 border border-white/10 rounded-full font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/5 hover:border-primary/50 transition-all text-gray-400 hover:text-primary">
              {showAll ? 'MOSTRAR_MENOS' : `VER_TODO_EL_CATÁLOGO (${filteredMeals.length})`}
            </button>
          </div>
        )}
      </section>

      {/* Footer e Información de Barrio */}
      <footer className="py-20 px-6 border-t border-white/10 bg-white/2 overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Warnfood" className="w-10 h-10 object-contain" />
              <span className="font-display font-black tracking-[0.3em] text-xl">WARNFOOD BCN</span>
            </div>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest leading-loose">
              {t.footer.location}<br/>
              © 2026 {t.footer.brand}
            </p>
          </div>
          
          <div className="flex md:justify-end gap-8 text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy_Protocol</a>
            <a href="#" className="hover:text-primary transition-colors">Term_Log</a>
            <a href="#" className="hover:text-primary transition-colors underline decoration-primary underline-offset-8">Support_HUD</a>
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
      </footer >

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: black;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-2px, -2px);
          opacity: 0.8;
          animation: glitch 2s infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}
