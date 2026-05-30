import { useState } from "react";
import { supabase } from "./supabase.js";

// ── Helpers ────────────────────────────────────────────────
const inp = {
  width:"100%", padding:"13px 14px", borderRadius:10,
  border:"1px solid #1e1f2a", background:"#0d0e12",
  color:"#eeeef2", fontSize:15, outline:"none",
  boxSizing:"border-box", fontFamily:"inherit", marginBottom:10,
};

const Label = ({ text }) => (
  <div style={{ color:"#3a3a4a", fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>{text}</div>
);

const ErrorBox = ({ msg }) => msg ? (
  <div style={{ background:"rgba(255,68,68,0.08)", border:"1px solid rgba(255,68,68,0.2)", borderRadius:8, padding:"10px 12px", color:"#ff8080", fontSize:13, marginBottom:14, lineHeight:1.5 }}>{msg}</div>
) : null;

const SuccessBox = ({ msg }) => msg ? (
  <div style={{ background:"rgba(200,251,110,0.08)", border:"1px solid rgba(200,251,110,0.2)", borderRadius:8, padding:"10px 12px", color:"#c8fb6e", fontSize:13, marginBottom:14, lineHeight:1.5 }}>{msg}</div>
) : null;

const Logo = ({ size = 52 }) => (
  <div style={{ textAlign:"center", marginBottom:32 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ marginBottom:12, display:"block", margin:"0 auto 12px" }}>
      <circle cx="50" cy="50" r="46" stroke="#c8fb6e" strokeWidth="2" fill="rgba(200,251,110,0.04)" />
      <path d="M70 32 C70 24 60 21 50 21 C39 21 31 27 31 37 C31 46 41 49 50 52 C59 55 69 58 69 68 C69 78 60 81 50 81 C39 81 30 77 30 68"
        stroke="#c8fb6e" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
    <div style={{ fontWeight:900, fontSize:20, letterSpacing:4, color:"#eeeef2", fontFamily:"system-ui" }}>
      <span style={{ color:"#c8fb6e" }}>S</span>MINK TRAIN
    </div>
    <div style={{ color:"#303042", fontSize:10, letterSpacing:3, marginTop:4 }}>ENTRENA · COME · PROGRESA</div>
  </div>
);

const BtnPrimary = ({ label, onClick, loading, disabled }) => (
  <button onClick={onClick} disabled={loading || disabled} style={{
    width:"100%", padding:"14px", borderRadius:10, border:"none",
    background: (loading || disabled) ? "#1e1f2a" : "linear-gradient(135deg,#c8fb6e,#a8d94e)",
    color: (loading || disabled) ? "#3a3a4a" : "#08090c",
    fontWeight:800, fontSize:15, cursor:(loading || disabled) ? "default" : "pointer", letterSpacing:0.3,
  }}>{loading ? "..." : label}</button>
);

// ── PANTALLA PRINCIPAL: selector de rol ────────────────────
function RoleSelector({ onSelect, onLogin }) {
  return (
    <div style={{ width:"100%", maxWidth:360 }}>
      <Logo />
      <div style={{ color:"#3a3a4a", fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", textAlign:"center", marginBottom:20 }}>
        ¿Cómo quieres entrar?
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {/* Entrenador */}
        <button onClick={()=>onSelect("trainer")} style={{
          background:"#0d0e12", border:"1px solid #1e1f2a", borderRadius:16,
          padding:"24px 12px", cursor:"pointer", display:"flex", flexDirection:"column",
          alignItems:"center", gap:12, transition:"border-color 0.2s",
        }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(200,251,110,0.06)", border:"1px solid rgba(200,251,110,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8fb6e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <div style={{ color:"#eeeef2", fontSize:14, fontWeight:700, marginBottom:3 }}>Entrenador</div>
            <div style={{ color:"#3a3a4a", fontSize:11 }}>Gestiona atletas</div>
          </div>
        </button>

        {/* Atleta */}
        <button onClick={()=>onSelect("athlete")} style={{
          background:"#0d0e12", border:"1px solid #1e1f2a", borderRadius:16,
          padding:"24px 12px", cursor:"pointer", display:"flex", flexDirection:"column",
          alignItems:"center", gap:12,
        }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(91,156,246,0.06)", border:"1px solid rgba(91,156,246,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b9cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
            </svg>
          </div>
          <div>
            <div style={{ color:"#eeeef2", fontSize:14, fontWeight:700, marginBottom:3 }}>Atleta</div>
            <div style={{ color:"#3a3a4a", fontSize:11 }}>Sigue tu plan</div>
          </div>
        </button>
      </div>

      <div style={{ textAlign:"center" }}>
        <span style={{ color:"#3a3a4a", fontSize:13 }}>¿Ya tienes cuenta? </span>
        <button onClick={onLogin} style={{ background:"none", border:"none", color:"#c8fb6e", fontSize:13, fontWeight:700, cursor:"pointer", padding:0 }}>
          Entrar
        </button>
      </div>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────
function LoginScreen({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Rellena todos los campos."); return; }
    setLoading(true);
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) setError(e.message.includes("Invalid") ? "Correo o contraseña incorrectos." : e.message);
    setLoading(false);
  };

  const handleForgot = async () => {
    setError("");
    if (!email) { setError("Escribe tu correo primero."); return; }
    setLoading(true);
    const { error: e } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (e) setError(e.message);
    else setSuccess("Correo de recuperación enviado.");
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
  };

  return (
    <div style={{ width:"100%", maxWidth:380 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#c8fb6e", fontSize:13, fontWeight:700, cursor:"pointer", padding:0, marginBottom:20 }}>← Atrás</button>
      <Logo size={44} />
      <div style={{ background:"#0d0e12", borderRadius:18, padding:"24px 20px", border:"1px solid #1e1f2a" }}>
        {!forgot ? (
          <>
            <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:20 }}>Entrar</div>
            <Label text="Correo" />
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" style={inp} />
            <Label text="Contraseña" />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{ ...inp, marginBottom:6 }} />
            <button onClick={()=>setForgot(true)} style={{ background:"none", border:"none", color:"#3a3a4a", fontSize:12, cursor:"pointer", padding:0, marginBottom:16, fontWeight:600 }}>
              ¿Olvidaste tu contraseña?
            </button>
            <ErrorBox msg={error} />
            <BtnPrimary label="Entrar" onClick={handleLogin} loading={loading} />
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
              <div style={{ flex:1, height:1, background:"#1e1f2a" }} /><span style={{ color:"#303042", fontSize:11 }}>o</span><div style={{ flex:1, height:1, background:"#1e1f2a" }} />
            </div>
            <button onClick={handleGoogle} style={{ width:"100%", padding:"13px", borderRadius:10, border:"1px solid #1e1f2a", background:"#12131a", color:"#eeeef2", fontWeight:600, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continuar con Google
            </button>
          </>
        ) : (
          <>
            <button onClick={()=>{ setForgot(false); setError(""); setSuccess(""); }} style={{ background:"none", border:"none", color:"#c8fb6e", fontSize:13, fontWeight:700, cursor:"pointer", padding:0, marginBottom:16 }}>← Atrás</button>
            <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:6 }}>Recuperar contraseña</div>
            <div style={{ color:"#6a6a80", fontSize:13, marginBottom:18, lineHeight:1.5 }}>Te enviaremos un enlace para restablecerla.</div>
            <Label text="Correo" />
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" style={inp} />
            <ErrorBox msg={error} /><SuccessBox msg={success} />
            <BtnPrimary label="Enviar correo" onClick={handleForgot} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}

// ── REGISTRO ENTRENADOR ────────────────────────────────────
function TrainerRegister({ onBack }) {
  const [step, setStep] = useState(1); // 1=datos, 2=pago(pendiente)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!name.trim()) { setError("Escribe tu nombre."); return; }
    if (!email.includes("@")) { setError("Correo no válido."); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (password !== password2) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { data, error: e } = await supabase.auth.signUp({ email, password, options: { data: { name, role:"trainer" } } });
    if (e) { setError(e.message); setLoading(false); return; }
    if (data?.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, email, name, role:"trainer" });
      await supabase.from("user_plans").upsert({ user_id: data.user.id, plan:"trainer" });
    }
    setLoading(false);
    // Aquí iría Stripe — de momento entra directamente
  };

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" onClick={toggle} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#3a3a4a", padding:0 }}>
      {show
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <div style={{ width:"100%", maxWidth:380 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#c8fb6e", fontSize:13, fontWeight:700, cursor:"pointer", padding:0, marginBottom:20 }}>← Atrás</button>
      <Logo size={44} />

      {/* Aviso de pago */}
      <div style={{ background:"rgba(200,251,110,0.05)", border:"1px solid rgba(200,251,110,0.15)", borderRadius:12, padding:"12px 14px", marginBottom:20 }}>
        <div style={{ color:"#c8fb6e", fontSize:12, fontWeight:700, marginBottom:4 }}>Plataforma profesional</div>
        <div style={{ color:"#6a6a80", fontSize:12, lineHeight:1.6 }}>El acceso como entrenador requiere suscripción. Al completar el registro serás redirigido al proceso de pago.</div>
      </div>

      <div style={{ background:"#0d0e12", borderRadius:18, padding:"24px 20px", border:"1px solid #1e1f2a" }}>
        <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:20 }}>Registro de entrenador</div>

        <Label text="Nombre completo" />
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" style={inp} />

        <Label text="Correo profesional" />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" style={inp} />

        <Label text="Contraseña" />
        <div style={{ position:"relative", marginBottom:10 }}>
          <input type={showP1?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" style={{ ...inp, marginBottom:0, paddingRight:44 }} />
          <EyeIcon show={showP1} toggle={()=>setShowP1(v=>!v)} />
        </div>

        <Label text="Repetir contraseña" />
        <div style={{ position:"relative", marginBottom:16 }}>
          <input type={showP2?"text":"password"} value={password2} onChange={e=>setPassword2(e.target.value)} placeholder="Repite la contraseña" style={{ ...inp, marginBottom:0, paddingRight:44 }} />
          <EyeIcon show={showP2} toggle={()=>setShowP2(v=>!v)} />
        </div>

        {/* Indicador de fortaleza */}
        {password.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", gap:4, marginBottom:4 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex:1, height:2, borderRadius:1, background: password.length >= i*2+4 ? (i<2?"#ff4444":i<3?"#ff9800":"#c8fb6e") : "#1e1f2a" }} />
              ))}
            </div>
            <div style={{ color:"#3a3a4a", fontSize:10 }}>
              {password.length < 8 ? "Muy corta" : password.length < 10 ? "Aceptable" : password.length < 12 ? "Buena" : "Excelente"}
            </div>
          </div>
        )}

        <ErrorBox msg={error} />
        <BtnPrimary label="Continuar al pago →" onClick={handleRegister} loading={loading} />
      </div>
    </div>
  );
}

// ── REGISTRO ATLETA (con código de invitación) ─────────────
const ATHLETE_STEPS = ["codigo", "datos", "preferencias", "password"];

function AthleteRegister({ onBack }) {
  const [step, setStep] = useState(0);
  const [inviteData, setInviteData] = useState(null); // datos del invite de Supabase
  const [code, setCode] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Datos del formulario
  const [form, setForm] = useState({
    // Datos físicos
    weight:"", height:"", age:"", sex:"",
    // Objetivo
    goal:"",
    // Lesiones
    injuries:"",
    injuryDetails:"",
    // Alimentación
    dislikes:"",
    allergies:"",
    favFoods:"",
    diet:"", // omnivoro, vegetariano, vegano, sin gluten, sin lactosa
    // Actividad
    activityLevel:"",
    weeklyAvailability:"",
    // Sueño
    sleepHours:"",
    // Contraseña
    password:"",
    password2:"",
  });
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // PASO 0: verificar código
  const handleVerifyCode = async () => {
    setError("");
    if (!emailInput.includes("@")) { setError("Correo no válido."); return; }
    if (!code.trim()) { setError("Introduce el código de invitación."); return; }
    setLoading(true);
    const { data, error: e } = await supabase
      .from("athlete_invites")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("athlete_email", emailInput.toLowerCase().trim())
      .eq("used", false)
      .single();
    if (e || !data) { setError("Código o correo incorrecto. Comprueba que coincide exactamente con el que te dio tu entrenador."); setLoading(false); return; }
    if (new Date(data.expires_at) < new Date()) { setError("Este código ha expirado. Pide uno nuevo a tu entrenador."); setLoading(false); return; }
    setInviteData(data);
    setStep(1);
    setLoading(false);
  };

  // PASO FINAL: crear cuenta
  const handleCreateAccount = async () => {
    setError("");
    if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (form.password !== form.password2) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { data, error: e } = await supabase.auth.signUp({
      email: inviteData.athlete_email,
      password: form.password,
      options: { data: { name: inviteData.athlete_name, role:"athlete" } }
    });
    if (e) { setError(e.message); setLoading(false); return; }
    if (data?.user) {
      const uid = data.user.id;
      await Promise.all([
        supabase.from("profiles").upsert({
          id: uid,
          email: inviteData.athlete_email,
          name: inviteData.athlete_name,
          role: "athlete",
          trainer_id: inviteData.trainer_id,
          weight: parseFloat(form.weight)||null,
          height: parseFloat(form.height)||null,
          age: parseInt(form.age)||null,
          sex: form.sex||null,
          goal: form.goal||null,
          activity: form.activityLevel||null,
        }),
        supabase.from("user_plans").upsert({ user_id: uid, plan:"athlete" }),
        supabase.from("trainer_athletes").upsert({ trainer_id: inviteData.trainer_id, athlete_id: uid }),
        // Guardar preferencias alimentarias y médicas
        supabase.from("nutrition_history").upsert({
          user_id: uid,
          date_key: "preferences",
          data: {
            dislikes: form.dislikes,
            allergies: form.allergies,
            favFoods: form.favFoods,
            diet: form.diet,
            injuries: form.injuries,
            injuryDetails: form.injuryDetails,
            weeklyAvailability: form.weeklyAvailability,
            sleepHours: form.sleepHours,
          }
        }),
        // Invalidar el código
        supabase.from("athlete_invites").update({ used: true }).eq("id", inviteData.id),
      ]);
    }
    setLoading(false);
    // La sesión se abre automáticamente via onAuthStateChange
  };

  const nextStep = () => { setError(""); setStep(s => s+1); };
  const prevStep = () => { setError(""); setStep(s => s-1); };

  const ProgressBar = () => (
    <div style={{ display:"flex", gap:4, marginBottom:24 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ flex:1, height:2, borderRadius:1, background: i <= step ? "#c8fb6e" : "#1e1f2a", transition:"background 0.3s" }} />
      ))}
    </div>
  );

  const OptionBtn = ({ value, label, selected, onSelect, color="#c8fb6e" }) => (
    <button onClick={()=>onSelect(value)} style={{
      padding:"11px 14px", borderRadius:10, border:`1.5px solid ${selected?color:"#1e1f2a"}`,
      background: selected ? `${color}10` : "#0d0e12",
      color: selected ? color : "#6a6a80",
      fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left", transition:"all 0.15s",
    }}>{label}</button>
  );

  return (
    <div style={{ width:"100%", maxWidth:380 }}>
      {step === 0
        ? <button onClick={onBack} style={{ background:"none", border:"none", color:"#c8fb6e", fontSize:13, fontWeight:700, cursor:"pointer", padding:0, marginBottom:20 }}>← Atrás</button>
        : <button onClick={prevStep} style={{ background:"none", border:"none", color:"#c8fb6e", fontSize:13, fontWeight:700, cursor:"pointer", padding:0, marginBottom:20 }}>← Atrás</button>
      }
      <Logo size={40} />

      <div style={{ background:"#0d0e12", borderRadius:18, padding:"24px 20px", border:"1px solid #1e1f2a" }}>

        {/* ── PASO 0: Código de invitación ── */}
        {step === 0 && (
          <>
            <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:6 }}>Acceso para atletas</div>
            <div style={{ color:"#6a6a80", fontSize:13, lineHeight:1.6, marginBottom:20 }}>Para registrarte necesitas el código de invitación que te ha proporcionado tu entrenador.</div>
            <Label text="Tu correo electrónico" />
            <input type="email" value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="tu@correo.com" style={inp} />
            <Label text="Código de invitación" />
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Ej: SF-A8K2P"
              style={{ ...inp, letterSpacing:3, textTransform:"uppercase", fontWeight:700 }}
              onKeyDown={e=>e.key==="Enter"&&handleVerifyCode()} />
            <ErrorBox msg={error} />
            <BtnPrimary label="Verificar código" onClick={handleVerifyCode} loading={loading} />
          </>
        )}

        {/* ── PASO 1: Datos físicos ── */}
        {step === 1 && (
          <>
            <ProgressBar />
            <div style={{ color:"#c8fb6e", fontSize:10, fontWeight:700, letterSpacing:2, marginBottom:4 }}>PASO 1 DE 3</div>
            <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:4 }}>Hola, {inviteData?.athlete_name}</div>
            <div style={{ color:"#6a6a80", fontSize:13, lineHeight:1.5, marginBottom:20 }}>Cuéntanos sobre ti para que tu entrenador pueda personalizar tu programa.</div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div>
                <Label text="Peso (kg)" />
                <input type="number" value={form.weight} onChange={e=>set("weight",e.target.value)} placeholder="75" style={{ ...inp, marginBottom:0 }} />
              </div>
              <div>
                <Label text="Altura (cm)" />
                <input type="number" value={form.height} onChange={e=>set("height",e.target.value)} placeholder="175" style={{ ...inp, marginBottom:0 }} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <div>
                <Label text="Edad" />
                <input type="number" value={form.age} onChange={e=>set("age",e.target.value)} placeholder="25" style={{ ...inp, marginBottom:0 }} />
              </div>
              <div>
                <Label text="Sexo" />
                <select value={form.sex} onChange={e=>set("sex",e.target.value)} style={{ ...inp, marginBottom:0, appearance:"none" }}>
                  <option value="">Seleccionar</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                </select>
              </div>
            </div>

            <Label text="Objetivo principal" />
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {[
                ["perder_grasa","Perder grasa corporal"],
                ["ganar_musculo","Ganar masa muscular"],
                ["rendimiento","Mejorar rendimiento deportivo"],
                ["salud","Mejorar salud general"],
                ["definicion","Definición y tonificación"],
              ].map(([v,l]) => <OptionBtn key={v} value={v} label={l} selected={form.goal===v} onSelect={v=>set("goal",v)} />)}
            </div>

            <Label text="Nivel de actividad actual" />
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {[
                ["sedentario","Sedentario — trabajo de oficina, poco movimiento"],
                ["ligero","Ligero — algo de actividad 1-2 días/semana"],
                ["moderado","Moderado — entreno 3-4 días/semana"],
                ["activo","Activo — entreno 5+ días/semana"],
              ].map(([v,l]) => <OptionBtn key={v} value={v} label={l} selected={form.activityLevel===v} onSelect={v=>set("activityLevel",v)} />)}
            </div>

            <Label text="Días disponibles para entrenar por semana" />
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {[2,3,4,5,6].map(n => (
                <button key={n} onClick={()=>set("weeklyAvailability",n)}
                  style={{ flex:1, padding:"11px 0", borderRadius:10, border:`1.5px solid ${form.weeklyAvailability===n?"#c8fb6e":"#1e1f2a"}`, background:form.weeklyAvailability===n?"rgba(200,251,110,0.1)":"#0d0e12", color:form.weeklyAvailability===n?"#c8fb6e":"#6a6a80", fontSize:15, fontWeight:800, cursor:"pointer" }}>
                  {n}
                </button>
              ))}
            </div>

            <ErrorBox msg={error} />
            <BtnPrimary label="Continuar →" onClick={()=>{ if(!form.goal||!form.weight||!form.height||!form.age||!form.sex||!form.activityLevel||!form.weeklyAvailability){setError("Rellena todos los campos antes de continuar.");return;} nextStep(); }} />
          </>
        )}

        {/* ── PASO 2: Salud y alimentación ── */}
        {step === 2 && (
          <>
            <ProgressBar />
            <div style={{ color:"#c8fb6e", fontSize:10, fontWeight:700, letterSpacing:2, marginBottom:4 }}>PASO 2 DE 3</div>
            <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:4 }}>Salud y alimentación</div>
            <div style={{ color:"#6a6a80", fontSize:13, lineHeight:1.5, marginBottom:20 }}>Esta información es confidencial y solo la verá tu entrenador.</div>

            <Label text="¿Tienes alguna lesión o limitación física?" />
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              {[["no","No"],["si","Sí, tengo una lesión"],["pasada","Tuve una lesión pasada"]].map(([v,l]) => (
                <OptionBtn key={v} value={v} label={l} selected={form.injuries===v} onSelect={v=>set("injuries",v)} />
              ))}
            </div>
            {(form.injuries==="si"||form.injuries==="pasada") && (
              <>
                <Label text="Descríbela brevemente" />
                <textarea value={form.injuryDetails} onChange={e=>set("injuryDetails",e.target.value)}
                  placeholder="Ej: Tendinitis en la rodilla derecha desde 2023..." rows={3}
                  style={{ ...inp, resize:"none", lineHeight:1.5 }} />
              </>
            )}

            <Label text="Tipo de dieta" />
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
              {[["omnivoro","Sin restricciones (omnívoro)"],["vegetariano","Vegetariano"],["vegano","Vegano"],["sin_gluten","Sin gluten"],["sin_lactosa","Sin lactosa"]].map(([v,l]) => (
                <OptionBtn key={v} value={v} label={l} selected={form.diet===v} onSelect={v=>set("diet",v)} />
              ))}
            </div>

            <Label text="Alimentos que no te gustan o no comes" />
            <textarea value={form.dislikes} onChange={e=>set("dislikes",e.target.value)}
              placeholder="Ej: espinacas, pescado azul, hígado..." rows={2}
              style={{ ...inp, resize:"none", lineHeight:1.5 }} />

            <Label text="Alergias alimentarias" />
            <textarea value={form.allergies} onChange={e=>set("allergies",e.target.value)}
              placeholder="Ej: frutos secos, marisco... (deja vacío si no tienes)" rows={2}
              style={{ ...inp, resize:"none", lineHeight:1.5 }} />

            <Label text="Alimentos o comidas que más te gustan" />
            <textarea value={form.favFoods} onChange={e=>set("favFoods",e.target.value)}
              placeholder="Ej: pollo a la plancha, pasta, arroz, fruta..." rows={2}
              style={{ ...inp, resize:"none", lineHeight:1.5 }} />

            <Label text="Horas de sueño habituales" />
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {["< 5h","5-6h","6-7h","7-8h","8h+"].map(h => (
                <button key={h} onClick={()=>set("sleepHours",h)}
                  style={{ flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${form.sleepHours===h?"#c8fb6e":"#1e1f2a"}`, background:form.sleepHours===h?"rgba(200,251,110,0.1)":"#0d0e12", color:form.sleepHours===h?"#c8fb6e":"#6a6a80", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  {h}
                </button>
              ))}
            </div>

            <ErrorBox msg={error} />
            <BtnPrimary label="Continuar →" onClick={()=>{ if(!form.diet||!form.injuries||!form.sleepHours){setError("Rellena los campos obligatorios.");return;} nextStep(); }} />
          </>
        )}

        {/* ── PASO 3: Contraseña ── */}
        {step === 3 && (
          <>
            <ProgressBar />
            <div style={{ color:"#c8fb6e", fontSize:10, fontWeight:700, letterSpacing:2, marginBottom:4 }}>ÚLTIMO PASO</div>
            <div style={{ color:"#eeeef2", fontWeight:800, fontSize:18, marginBottom:4 }}>Crea tu contraseña</div>
            <div style={{ color:"#6a6a80", fontSize:13, lineHeight:1.5, marginBottom:20 }}>Esta será tu contraseña para acceder a SMINK TRAIN. Mínimo 6 caracteres.</div>

            <div style={{ background:"rgba(91,156,246,0.06)", border:"1px solid rgba(91,156,246,0.15)", borderRadius:10, padding:"10px 12px", marginBottom:18 }}>
              <div style={{ color:"#5b9cf6", fontSize:12, lineHeight:1.5 }}>Entrarás con el correo <strong style={{ color:"#eeeef2" }}>{inviteData?.athlete_email}</strong></div>
            </div>

            <Label text="Nueva contraseña" />
            <div style={{ position:"relative", marginBottom:10 }}>
              <input type={showP1?"text":"password"} value={form.password} onChange={e=>set("password",e.target.value)}
                placeholder="Mínimo 6 caracteres" style={{ ...inp, marginBottom:0, paddingRight:44 }} />
              <button type="button" onClick={()=>setShowP1(v=>!v)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#3a3a4a", padding:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>

            <Label text="Repetir contraseña" />
            <div style={{ position:"relative", marginBottom:16 }}>
              <input type={showP2?"text":"password"} value={form.password2} onChange={e=>set("password2",e.target.value)}
                placeholder="Repite la contraseña" style={{ ...inp, marginBottom:0, paddingRight:44 }} />
              <button type="button" onClick={()=>setShowP2(v=>!v)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#3a3a4a", padding:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>

            {/* Verificación visual */}
            {form.password.length > 0 && form.password2.length > 0 && (
              <div style={{ marginBottom:14, fontSize:12, color: form.password===form.password2 ? "#c8fb6e" : "#ff4444" }}>
                {form.password===form.password2 ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              </div>
            )}

            <ErrorBox msg={error} />
            <BtnPrimary label="Crear mi cuenta" onClick={handleCreateAccount} loading={loading} />

            <div style={{ color:"#3a3a4a", fontSize:11, textAlign:"center", marginTop:14, lineHeight:1.6 }}>
              Al crear tu cuenta aceptas los términos de uso de SMINK TRAIN. El código de invitación quedará invalidado.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────────
export default function AuthScreen() {
  const [screen, setScreen] = useState("home"); // home | login | trainer | athlete

  const wrap = {
    minHeight:"100vh",
    background:"radial-gradient(ellipse at 50% 0%, #0f1020 0%, #08090c 60%)",
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    padding:"24px 20px",
    fontFamily:"system-ui, -apple-system, sans-serif",
  };

  return (
    <div style={wrap}>
      {screen === "home"    && <RoleSelector onSelect={r=>setScreen(r==="trainer"?"trainer":"athlete")} onLogin={()=>setScreen("login")} />}
      {screen === "login"   && <LoginScreen onBack={()=>setScreen("home")} />}
      {screen === "trainer" && <TrainerRegister onBack={()=>setScreen("home")} />}
      {screen === "athlete" && <AthleteRegister onBack={()=>setScreen("home")} />}
    </div>
  );
}
