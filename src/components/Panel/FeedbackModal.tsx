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
  
  const mealImg = currentFeedback.meal.img_path || currentFeedback.meal.image;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="card-cyber max-w-xl w-full relative overflow-hidden flex flex-col"
      >
        <button 
          onClick={() => setCurrentFeedback(null)} 
          className="absolute top-6 right-6 text-white/50 hover:text-white z-50 bg-black/50 p-2 rounded-full backdrop-blur-md transition-all"
        >
          <X size={20} />
        </button>
        
        {/* Header Section with Integrated Meal Image */}
        <div className="relative pt-12 pb-8 px-8 text-center border-b border-white/5 overflow-hidden">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src={mealImg} 
              className="w-full h-full object-cover opacity-40 brightness-[0.4]" 
              alt="" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">BIO_FEEDBACK_REQUIRED</div>
            <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter drop-shadow-2xl">
              {currentFeedback.meal.name_es}
            </h3>
            <div className="text-[10px] font-mono text-gray-400 mt-1 flex items-center justify-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               {currentFeedback.date}
            </div>

            {/* Stars Calificación inside the Image Section */}
            <div className="pt-6 space-y-3">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Bio-Calificación</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                    className={`transition-all hover:scale-110 active:scale-90 ${feedbackForm.rating >= star ? 'text-primary' : 'text-white/10'}`}
                  >
                    <Star 
                      size={36} 
                      fill={feedbackForm.rating >= star ? "currentColor" : "none"} 
                      className={feedbackForm.rating >= star ? 'drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]' : ''}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section (Rest of the Form) */}
        <div className="p-8 space-y-8 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Sal', key: 'salt_rating' },
              { label: 'Pimienta', key: 'pepper_rating' },
              { label: 'Azúcar', key: 'sugar_rating' }
            ].map(stat => (
              <div key={stat.key} className="space-y-3">
                <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block text-center">{stat.label}</label>
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((feedbackForm as any)[stat.key] / 5) * 100}%` }}
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(255,215,0,0.4)]"
                  />
                  <input 
                    type="range" min="1" max="5" 
                    value={(feedbackForm as any)[stat.key]}
                    onChange={(e) => setFeedbackForm({...feedbackForm, [stat.key]: parseInt(e.target.value)})}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] font-mono text-center text-primary font-black tracking-widest uppercase">LVL_{ (feedbackForm as any)[stat.key] }</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Observaciones Bio-Hacker</label>
            <textarea 
              value={feedbackForm.comment}
              onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-primary outline-none transition-all min-h-[100px] resize-none placeholder:text-gray-700"
              placeholder="Sabor, textura, efectos post-ingesta..."
            />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Evidencia Visual (Opcional)</label>
             <input type="file" ref={feedbackPhotoRef} hidden accept="image/*" />
             <button 
              onClick={() => feedbackPhotoRef.current?.click()}
              className="w-full py-5 bg-white/5 border border-dashed border-white/20 rounded-2xl text-gray-500 text-[10px] font-mono uppercase hover:border-primary hover:text-white transition-all flex items-center justify-center gap-3 group"
             >
               <Camera size={18} className="group-hover:text-primary transition-colors" /> 
               {feedbackPhotoRef.current?.files?.[0] ? feedbackPhotoRef.current.files[0].name : 'Sincronizar captura del plato'}
             </button>
          </div>

          <button 
            onClick={submitFeedback}
            className="w-full btn-cyber-primary py-5 text-sm font-black tracking-[0.5em] flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
          >
            <CheckCircle2 size={20} /> ENVIAR BIO-FEEDBACK
          </button>
        </div>
      </motion.div>
    </div>
  );
}
