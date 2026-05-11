import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User as UserIcon, Camera, Save, Activity, CheckCircle2, Phone, Ruler, Weight, ClipboardList, Target, Calendar } from 'lucide-react';

interface SettingsTabProps {
  user: any;
  settingsForm: any;
  setSettingsForm: (form: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  updateProfile: () => void;
  isUpdating: boolean;
  t: any;
}

export default function SettingsTab({ 
  user, settingsForm, setSettingsForm, fileInputRef, updateProfile, isUpdating, t 
}: SettingsTabProps) {
  
  const calculateAge = (bday: string) => {
    if (!bday) return '--';
    try {
      const birthDate = new Date(bday);
      if (isNaN(birthDate.getTime())) return '--';
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch { return '--'; }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Remove all non-digits except +
    let cleaned = val.replace(/[^\d]/g, '');
    
    // Ensure it starts with 34 (Spain)
    if (!cleaned.startsWith('34')) {
        cleaned = '34' + cleaned;
    }
    
    // Extract numbers after 34
    let main = cleaned.slice(2);
    main = main.slice(0, 9); // Limit to 9 digits for Spain
    
    // Format: +34 123 456 789
    let formatted = '+34';
    if (main.length > 0) {
      const chunks = main.match(/.{1,3}/g);
      if (chunks) formatted += ' ' + chunks.join(' ');
    }
    
    setSettingsForm({...settingsForm, phone: formatted});
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">OPERATOR_PROFILE_V3</div>
          <h2 className="text-4xl font-display font-black uppercase text-white tracking-tighter">{t.panel.settings_title}</h2>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-500 font-mono text-[8px] uppercase tracking-widest">
           <Activity size={12} className="text-primary animate-pulse" /> SYSTEM_ONLINE // {user?.email}
        </div>
      </div>

      <div className="card-cyber p-1 relative overflow-hidden bg-white/2 backdrop-blur-3xl min-h-[500px]">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Settings size={200} />
        </div>

        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 h-full">
          {/* Section 1: Identity & Avatar */}
          <div className="p-10 flex flex-col items-center lg:w-1/4 text-center shrink-0">
            <div className="relative group mb-8">
              <div className="w-44 h-44 p-1 rounded-[2.5rem] bg-gradient-to-tr from-primary/40 to-transparent relative shadow-[0_0_50px_rgba(255,215,0,0.15)] group-hover:shadow-[0_0_60px_rgba(255,215,0,0.3)] transition-all duration-500">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-black flex items-center justify-center relative border border-white/10 group-hover:border-primary transition-colors">
                  {(user?.profile_photo || user?.photo) ? (
                    <img src={user?.profile_photo || user?.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <UserIcon size={64} className="text-gray-800" />
                  )}
                  <div className="absolute inset-0 bg-primary/40 backdrop-blur-md opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer rounded-[2.2rem]" onClick={() => fileInputRef.current?.click()}>
                    <Camera size={28} className="text-black mb-2 animate-bounce" />
                    <span className="text-[7px] font-mono font-black text-black uppercase tracking-widest">Sincronizar_ID</span>
                  </div>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={() => {}} />
            </div>
            
            <div className="space-y-4 w-full">
              <div className="space-y-1">
                 <h4 className="text-2xl font-display font-black text-white uppercase tracking-tighter truncate">{settingsForm.name || 'OPERATOR'}</h4>
                 <p className="text-[10px] font-mono text-primary tracking-widest">{user?.email}</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-mono text-gray-400 uppercase w-full justify-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 NODE_ID: {user?.userId?.toString().padStart(4, '0')}
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Bio-Metrics */}
          <div className="p-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 content-start">
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><UserIcon size={12} /> {t.panel.full_name}</label>
              <input 
                type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><Phone size={12} /> {t.panel.phone}</label>
              <input 
                type="text" value={settingsForm.phone} onChange={handlePhoneChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white"
                placeholder="+34 600 000 000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><Ruler size={12} /> {t.panel.height} (CM)</label>
              <input 
                type="number" value={settingsForm.height} onChange={(e) => setSettingsForm({...settingsForm, height: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><Weight size={12} /> {t.panel.weight} (KG)</label>
              <input 
                type="number" value={settingsForm.weight} onChange={(e) => setSettingsForm({...settingsForm, weight: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center pr-2">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {t.panel.birth_date}</label>
                <span className="text-[9px] font-mono text-primary font-black uppercase tracking-widest">Age_Calc: {calculateAge(settingsForm.birth_date)}</span>
              </div>
              <input 
                type="date" value={settingsForm.birth_date} onChange={(e) => setSettingsForm({...settingsForm, birth_date: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white color-scheme-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><Target size={12} /> {t.panel.target_weight} (KG)</label>
              <input 
                type="number" value={settingsForm.target_weight} onChange={(e) => setSettingsForm({...settingsForm, target_weight: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white"
              />
            </div>
            
            <div className="md:col-span-2 space-y-4 pt-2">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Protocolo Tupper Size</label>
              <div className="flex gap-4">
                {['S', 'M', 'L'].map(size => (
                  <button 
                    key={size} onClick={() => setSettingsForm({...settingsForm, tupper_size: size})}
                    className={`flex-1 py-3 rounded-2xl border font-mono transition-all text-[10px] relative overflow-hidden ${settingsForm.tupper_size === size ? 'bg-primary border-primary text-black font-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/20'}`}
                  >
                    SIZE_{size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Dietary & Actions */}
          <div className="p-10 lg:w-1/3 flex flex-col gap-6 justify-between shrink-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><ClipboardList size={12} /> {t.panel.dietary_notes}</label>
                <textarea 
                  value={settingsForm.dietary_notes} onChange={(e) => setSettingsForm({...settingsForm, dietary_notes: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-primary outline-none transition-all min-h-[140px] resize-none font-mono text-white placeholder:text-gray-800"
                  placeholder="ALERGIAS_RESTRICCIONES..."
                />
              </div>

              <button 
                onClick={() => setSettingsForm({...settingsForm, is_vegetarian: !settingsForm.is_vegetarian})}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group ${settingsForm.is_vegetarian ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${settingsForm.is_vegetarian ? 'bg-green-500 text-black' : 'bg-white/5 border border-white/10'}`}>
                    {settingsForm.is_vegetarian && <CheckCircle2 size={16} />}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{t.panel.is_vegetarian}</span>
                </div>
                <div className={`text-[8px] font-mono uppercase tracking-widest ${settingsForm.is_vegetarian ? 'opacity-100' : 'opacity-0'}`}>Plant_Based_Node</div>
              </button>
            </div>

            <button 
              onClick={updateProfile} disabled={isUpdating}
              className="w-full bg-primary text-black py-5 rounded-2xl text-[10px] font-black tracking-[0.6em] flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(255,215,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isUpdating ? <Activity size={20} className="animate-spin" /> : <Save size={20} />}
              {t.panel.save_settings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
