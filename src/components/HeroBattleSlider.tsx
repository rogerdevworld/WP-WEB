import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Flame, Zap, AlertTriangle, Info } from 'lucide-react';
import { comparisonData } from '../data';

export default function HeroBattleSlider() {
  const [activeCompIdx, setActiveCompIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const comp = comparisonData.competitors[activeCompIdx];
  const foodlive = comparisonData.warmfood;

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono text-primary tracking-[0.4em] uppercase mb-4">BIO_BATTLE_STATION</h2>
        <h3 className="text-3xl md:text-5xl font-display font-bold">WARMFOOD vs THE WORLD.</h3>
      </div>

      {/* Tabs Selector */}
      <div className="flex justify-center gap-2 mb-10">
        {comparisonData.competitors.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveCompIdx(i)}
            className={`px-8 py-3 rounded-xl font-mono text-[10px] tracking-widest border transition-all duration-500 ${
              activeCompIdx === i 
                ? 'bg-primary text-black border-primary font-black shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
            }`}
          >
            {c.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Slider Container */}
      <div 
        ref={sliderRef}
        className="relative aspect-video md:aspect-[21/9] w-full bg-black rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {/* Lado Izquierdo (Competidor) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={comp.img} 
            alt={comp.name} 
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
          />
          {/* HUD Competidor */}
          <div className="absolute top-10 left-10 z-20 space-y-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 backdrop-blur-md text-red-500 text-[10px] font-mono">
              <AlertTriangle size={12} /> {comp.name.toUpperCase()}_LOG_ERROR
            </div>
            <div className="p-4 bg-black/60 border border-white/10 backdrop-blur-xl rounded-lg">
              <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">WARNING: {Object.keys(comp.hud)[0]}</div>
              <div className="text-xl font-display font-bold text-white">{Object.values(comp.hud)[0]}</div>
              <div className="mt-2 text-[8px] font-mono text-red-400 uppercase tracking-tighter">STATE: {comp.hud.state}</div>
            </div>
          </div>
        </div>

        {/* Lado Derecho (Warmfood) */}
        <div 
          className="absolute inset-0 z-10"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <img 
            src={foodlive.img} 
            alt="Warmfood" 
            className="w-full h-full object-cover brightness-110 contrast-110"
          />
          {/* HUD Warmfood */}
          <div className="absolute top-10 right-10 z-20 space-y-2 text-right pointer-events-none">
            <div className="flex items-center justify-end gap-2 px-3 py-1 bg-primary/20 border border-primary/50 backdrop-blur-md text-primary text-[10px] font-mono">
              <ShieldCheck size={12} /> OPTIMAL_BIO_LOAD_ACTIVE
            </div>
            <div className="p-4 bg-black/60 border border-primary/30 backdrop-blur-xl rounded-lg text-right">
              <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">CORE_PROTEIN</div>
              <div className="text-xl font-display font-bold text-primary">{foodlive.hud.protein}</div>
              <div className="mt-2 text-[8px] font-mono text-primary uppercase tracking-tighter">FRESHNESS: {foodlive.hud.freshness}</div>
            </div>
          </div>
        </div>

        {/* Divider Handle */}
        <div 
          className="absolute inset-y-0 z-30 w-1 bg-primary shadow-[0_0_20px_#FFD700]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-2xl">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-black/40" />
              <div className="w-0.5 h-4 bg-black/40" />
            </div>
          </div>
        </div>

        {/* Center Comparison Label */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-8 bg-black/80 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl">
           <div className="text-center">
              <div className="text-[8px] font-mono text-gray-500 uppercase">COMPETITOR</div>
              <div className="text-lg font-display font-bold text-white">{comp.price}</div>
           </div>
           <div className="h-8 w-px bg-white/10" />
           <div className="text-center">
              <div className="text-[8px] font-mono text-primary uppercase">WARNFOOD</div>
              <div className="text-lg font-display font-bold text-primary">{foodlive.price}</div>
           </div>
        </div>
      </div>

      {/* Comparison Detail Matrix */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-cyber p-6">
            <div className="text-[8px] font-mono text-gray-500 uppercase mb-2">NUTRIENT_EFFICIENCY</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-primary">{foodlive.protein}</span>
              <span className="text-xs text-gray-400">vs {comp.protein}</span>
            </div>
          </div>
          <div className="card-cyber p-6">
            <div className="text-[8px] font-mono text-gray-500 uppercase mb-2">GLYCEMIC_LOAD</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-primary">{foodlive.kcal}</span>
              <span className="text-xs text-gray-400">vs {comp.kcal}</span>
            </div>
          </div>
          <div className="card-cyber p-6">
            <div className="text-[8px] font-mono text-gray-500 uppercase mb-2">QUALITY_RATING</div>
            <div className="text-sm font-mono text-white leading-relaxed">{foodlive.quality}</div>
          </div>
          <div className="card-cyber p-6 bg-primary/10 border-primary/30">
            <div className="text-[8px] font-mono text-primary uppercase mb-2">MONTHLY_OPTIMIZATION</div>
            <div className="text-xl font-display font-black text-primary">SAVE 610€</div>
            <div className="text-[8px] font-mono text-gray-400 uppercase mt-1">BASED_ON_350€_vs_960€</div>
          </div>
      </div>
    </div>
  );
}
