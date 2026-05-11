import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Camera, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  currentFeedback: any;
  setCurrentFeedback: (f: any) => void;
  feedbackForm: any;
  setFeedbackForm: (form: any) => void;
  feedbackPhotoRef: React.RefObject<HTMLInputElement>;
  submitFeedback: () => void;
}

export default function FeedbackModal({
  currentFeedback, setCurrentFeedback, feedbackForm, setFeedbackForm, 
  feedbackPhotoRef, submitFeedback
}: FeedbackModalProps) {
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
}
