import React from 'react';
import { Settings, User as UserIcon, Camera, Save, Activity, CheckCircle2 } from 'lucide-react';

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
  return (
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
                <UserIcon size={48} className="text-gray-500" />
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
  );
}
