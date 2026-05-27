import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthScreen from './AuthScreen.jsx'
import AdminPanel from './AdminPanel.jsx'
import { supabase } from './supabase.js'
import { migrateFromLocalStorage, loadUserData } from './db.js'

function Root() {
  const [state, setState] = useState({ status: 'loading', session: null, userPlan: null, cloudData: null });

  const initUser = async (sess) => {
    if (!sess) {
      setState({ status: 'auth', session: null, userPlan: null, cloudData: null });
      return;
    }

    setState(s => ({ ...s, status: 'loading' }));

    try {
      // 1. Comprobar plan primero (decisión crítica: admin vs usuario normal)
      const { data: planData } = await supabase
        .from('user_plans')
        .select('plan')
        .eq('user_id', sess.user.id)
        .maybeSingle();

      const plan = planData?.plan || 'free';

      // 2. Si es admin → mostrar panel directamente, sin cargar nada más
      if (plan === 'admin') {
        setState({ status: 'admin', session: sess, userPlan: 'admin', cloudData: null });
        return;
      }

      // 3. Usuario normal → migrar y cargar datos
      const timeout = new Promise(resolve => setTimeout(() => resolve({}), 8000));
      await migrateFromLocalStorage(sess.user.id);
      const data = await Promise.race([loadUserData(sess.user.id), timeout]);

      setState({ status: 'app', session: sess, userPlan: plan, cloudData: data || {} });

    } catch(e) {
      console.error('Error iniciando usuario:', e);
      // Si falla, entrar igual como usuario normal
      setState({ status: 'app', session: sess, userPlan: 'free', cloudData: {} });
    }
  };

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      initUser(session);
    });

    // Cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setState({ status: 'auth', session: null, userPlan: null, cloudData: null });
      } else if (event === 'SIGNED_IN') {
        initUser(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Pantalla de carga
  if (state.status === 'loading') {
    return (
      <div style={{ minHeight:"100vh", background:"#0a0d0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#A8FF60" strokeWidth="4" fill="rgba(168,255,61,0.06)" />
          <path d="M70 32 C70 24 60 21 50 21 C39 21 31 27 31 37 C31 46 41 49 50 52 C59 55 69 58 69 68 C69 78 60 81 50 81 C39 81 30 77 30 68"
            stroke="#A8FF60" strokeWidth="7" strokeLinecap="round" fill="none" />
        </svg>
        <div style={{ color:"#666", fontSize:13, letterSpacing:1 }}>Cargando...</div>
      </div>
    );
  }

  if (state.status === 'auth') return <AuthScreen onLogin={() => {}} />;
  if (state.status === 'admin') return <AdminPanel onLogout={handleLogout} />;

  return (
    <App
      userId={state.session.user.id}
      userEmail={state.session.user.email}
      cloudData={state.cloudData}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Root /></React.StrictMode>
)
