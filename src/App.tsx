import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { i18n } from './data'
import Demo from './demo/Demo'
import Panel from './demo/Panel'

export default function App() {
  const [lang, setLang] = useState('es')
  const [page, setPage] = useState('demo')
  const [showLogin, setShowLogin] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Auth state
  const [user, setUser] = useState<any>(null)
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  // Form Fields State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  // Persistence (Safe loading + Re-fetch)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('warnfood_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.userId) {
            setUser(parsed);
            setPage('panel');

            const res = await fetch(`/api/profile/me/${parsed.userId}`);
            if (res.ok) {
              const freshData = await res.json();
              const updatedUser = { ...parsed, ...freshData };
              setUser(updatedUser);
              localStorage.setItem('warnfood_user', JSON.stringify(updatedUser));
            }
          }
        }
      } catch (e) {
        localStorage.removeItem('warnfood_user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const toggleLang = () => setLang((l) => l === 'es' ? 'en' : 'es')
  
  const handleLogout = () => {
    localStorage.removeItem('warnfood_user')
    setUser(null)
    setPage('demo')
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isRegistering ? '/api/register' : '/api/login'
    const payload = isRegistering ? { email, password, name, phone, height: height || null, weight: weight || null } : { email, password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (response.ok) {
        setUser(data)
        localStorage.setItem('warnfood_user', JSON.stringify(data))
        setShowLogin(false)
        setPassword('')
        setPage('panel')
      } else {
        alert("CRITICAL_ERROR: " + (data.error || "INVALID_CREDENTIALS"))
      }
    } catch (error) {
      alert("NETWORK_FAILURE: Check backend status.")
    }
  }

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center font-mono text-primary animate-pulse">
      INITIALIZING_BIO_PROTOCOL...
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-primary selection:text-black">
      <main>
        {page === 'demo' ? (
          <Demo 
            key="demo"
            lang={lang} 
            toggleLang={toggleLang} 
            goTo={setPage} 
            user={user} 
            onLogout={handleLogout}
            setShowLogin={setShowLogin}
            setIsRegistering={setIsRegistering}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        ) : (
          <Panel 
            key="panel"
            lang={lang} 
            toggleLang={toggleLang} 
            goTo={setPage} 
            user={user} 
            setUser={setUser}
            onLogout={handleLogout}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        )}
      </main>

      <div className="fixed bottom-4 left-4 z-50 pointer-events-none opacity-20 hidden md:block">
        <div className="text-[10px] font-mono tracking-tighter">
          SYSTEM_STATUS: ACTIVE<br/>
          LOCATION: BCN_ZONE_01<br/>
          ENCRYPTION: BIO_SECURE
        </div>
      </div>

      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md" onClick={() => setShowLogin(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              className="card-cyber max-w-md w-full p-10 relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary" />

              <div className="text-center mb-8">
                <div className="text-[10px] font-mono text-primary tracking-[0.5em] uppercase mb-2">ACCESS_PROTOCOL</div>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  {isRegistering ? (lang==='es'?'Registro Warnfood':'BIO_REGISTRATION') : (lang==='es'?'Acceso Clientes':'OPERATOR_LOGIN')}
                </h2>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                {isRegistering && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-gray-500 uppercase ml-2">Full Name</label>
                      <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white" placeholder="NAME_INPUT" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-gray-500 uppercase ml-2">Phone Number (International)</label>
                      <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white" placeholder="+34 600 000 000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-gray-500 uppercase ml-2">Height (CM)</label>
                        <input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white" placeholder="CM" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-gray-500 uppercase ml-2">Weight (KG)</label>
                        <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white" placeholder="KG" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-gray-500 uppercase ml-2">Email Address</label>
                  <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white" placeholder="USER_ID@DOMAIN.COM" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-gray-500 uppercase ml-2">Access Key</label>
                  <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all font-mono text-white" placeholder="••••••••" />
                </div>
                
                <button type="submit" className="w-full btn-cyber-primary py-4 mt-6 flex items-center justify-center gap-2">
                  <Zap size={16} /> {isRegistering ? (lang==='es'?'INICIAR PROTOCOLO':'INITIALIZE_PROTOCOL') : (lang==='es'?'ENTRAR':'EXECUTE_LOGIN')}
                </button>
              </form>
              
              <div className="mt-8 text-center text-[10px] font-mono text-gray-500">
                {isRegistering ? (
                  <>{lang==='es'?'¿Ya tienes cuenta?':'ALREADY_ENROLLED?'} <span onClick={()=>setIsRegistering(false)} className="text-primary cursor-pointer hover:underline">LOGIN_HERE</span></>
                ) : (
                  <>{lang==='es'?'¿No eres miembro todavía?':'NO_BIO_RECORD?'} <span onClick={()=>setIsRegistering(true)} className="text-primary cursor-pointer hover:underline">CREATE_ACCOUNT</span></>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
