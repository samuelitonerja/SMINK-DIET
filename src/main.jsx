import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthScreen from './AuthScreen.jsx'
import { supabase } from './supabase.js'
import { migrateFromLocalStorage, loadUserData } from './db.js'

function Root() {
  const [session, setSession] = useState(undefined)
  const [cloudData, setCloudData] = useState(null)
  const [migrating, setMigrating] = useState(false)

  const initUser = async (sess) => {
    if (!sess) { setSession(null); return; }
    setMigrating(true);
    // 1. Migrar datos locales si los hay (silencioso)
    await migrateFromLocalStorage(sess.user.id);
    // 2. Cargar datos desde Supabase
    const data = await loadUserData(sess.user.id);
    setCloudData(data);
    setSession(sess);
    setMigrating(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      initUser(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      initUser(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Cargando / migrando
  if (session === undefined || migrating) {
    return (
      <div style={{ minHeight:"100vh", background:"#0a0d0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
        <div style={{ width:44, height:44, border:"3px solid #2a2a3a", borderTop:"3px solid #4caf50", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <div style={{ color:"#666", fontSize:13 }}>{migrating ? "Sincronizando tus datos..." : "Cargando..."}</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onLogin={() => {}} />;
  }

  return (
    <App
      userId={session.user.id}
      userEmail={session.user.email}
      cloudData={cloudData}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
