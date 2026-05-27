import { useState } from "react";
import { supabase } from "./supabase.js";

// ═══════════════════════════════════════════════════════════
// SMINK FIT — Pantalla de Ajustes
// ═══════════════════════════════════════════════════════════

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ color:"#666", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10, paddingLeft:4 }}>{title}</div>
      <div style={{ background:"#1a1a24", borderRadius:16, border:"1px solid #2a2a3a", overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, sub, right, onClick, danger, last }) {
  return (
    <button onClick={onClick} style={{ width:"100%", padding:"15px 16px", background:"none", border:"none", borderBottom:last?"none":"1px solid #1e1e28", cursor:onClick?"pointer":"default", textAlign:"left", display:"flex", alignItems:"center", gap:12 }}>
      {icon && <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:danger?"#f44336":"white", fontWeight:600, fontSize:15 }}>{label}</div>
        {sub && <div style={{ color:"#555", fontSize:12, marginTop:2 }}>{sub}</div>}
      </div>
      {right && <div style={{ color:"#555", fontSize:13, flexShrink:0 }}>{right}</div>}
      {onClick && !right && <span style={{ color:"#444", fontSize:16 }}>›</span>}
    </button>
  );
}

export default function SettingsScreen({ userData, userId, userEmail, userPlan, onLogout, onEditProfile }) {
  const [section, setSection] = useState(null); // null | "email" | "password" | "feedback"
  const [newEmail, setNewEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [fbType, setFbType] = useState("sugerencia");
  const [fbMsg, setFbMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastOk, setToastOk] = useState(true);

  const showToast = (msg, ok=true) => { setToast(msg); setToastOk(ok); setTimeout(()=>setToast(""), 3000); };

  const handleChangeEmail = async () => {
    if (!newEmail.includes("@")) { showToast("Correo no válido", false); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) showToast(error.message, false);
    else { showToast("Te hemos enviado un correo de confirmación ✓"); setSection(null); setNewEmail(""); }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (newPass.length < 6) { showToast("Mínimo 6 caracteres", false); return; }
    if (newPass !== confirmPass) { showToast("Las contraseñas no coinciden", false); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) showToast(error.message, false);
    else { showToast("Contraseña actualizada ✓"); setSection(null); setNewPass(""); setConfirmPass(""); setCurrentPass(""); }
    setLoading(false);
  };

  const handleFeedback = async () => {
    if (!fbMsg.trim()) { showToast("Escribe algo primero", false); return; }
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: userId, email: userEmail, type: fbType, message: fbMsg.trim(), status: "pendiente"
    });
    if (error) showToast("Error al enviar", false);
    else { showToast("¡Gracias por tu feedback! ✓"); setSection(null); setFbMsg(""); }
    setLoading(false);
  };

  const planLabel = { free:"Plan Gratuito", premium:"Plan Premium ⭐", lifetime:"Lifetime ♾", admin:"Administrador 🔑" };
  const planColor = { free:"#666", premium:"#ffd700", lifetime:"#ff6b35", admin:"#4caf50" };

  const inp = { width:"100%", padding:"13px 14px", borderRadius:12, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:10 };

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui,sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:toastOk?"#4caf50":"#e53935", color:"white", padding:"10px 22px", borderRadius:20, fontWeight:700, fontSize:13, zIndex:999, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding:"16px 18px 0", paddingTop:"calc(16px + env(safe-area-inset-top))", display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
        {section && (
          <button onClick={()=>setSection(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, fontWeight:700, cursor:"pointer", padding:0 }}>← Atrás</button>
        )}
        {!section && <div style={{ fontWeight:900, fontSize:24 }}>Ajustes</div>}
        {section === "email" && <div style={{ fontWeight:900, fontSize:20 }}>Cambiar correo</div>}
        {section === "password" && <div style={{ fontWeight:900, fontSize:20 }}>Cambiar contraseña</div>}
        {section === "feedback" && <div style={{ fontWeight:900, fontSize:20 }}>Soporte y feedback</div>}
      </div>

      <div style={{ padding:"0 16px 80px" }}>

        {/* ── MAIN ───────────────────────────────────────── */}
        {!section && (
          <>
            {/* Perfil card */}
            <div style={{ background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:20, padding:"20px 18px", marginBottom:24, border:"1px solid #2e7d3240", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#4caf50,#2e7d32)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:22, color:"white", flexShrink:0 }}>
                {(userData?.name||userEmail||"?")[0].toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:3 }}>{userData?.name||"Sin nombre"}</div>
                <div style={{ color:"#666", fontSize:13, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userEmail}</div>
                <span style={{ fontSize:10, color:planColor[userPlan||"free"], background:`${planColor[userPlan||"free"]}20`, borderRadius:20, padding:"3px 10px", fontWeight:700 }}>
                  {planLabel[userPlan||"free"]}
                </span>
              </div>
            </div>

            <Section title="Mi perfil">
              <Row icon="👤" label="Editar datos del perfil" sub="Peso, altura, objetivo, actividad..." onClick={onEditProfile} />
              <Row icon="📧" label="Cambiar correo electrónico" sub={userEmail} onClick={()=>setSection("email")} />
              <Row icon="🔒" label="Cambiar contraseña" onClick={()=>setSection("password")} last />
            </Section>

            <Section title="Mi plan">
              <Row icon="⭐" label="Plan actual" sub="Funcionalidades disponibles" right={planLabel[userPlan||"free"]} last />
            </Section>

            <Section title="Soporte">
              <Row icon="💬" label="Enviar feedback o sugerencia" sub="Ayúdanos a mejorar SMINK FIT" onClick={()=>setSection("feedback")} />
              <Row icon="🐛" label="Reportar un error" sub="Dinos qué ha fallado" onClick={()=>{ setFbType("bug"); setSection("feedback"); }} last />
            </Section>

            <Section title="App">
              <Row icon="🌐" label="Idioma" sub="Próximamente" right="Español 🇪🇸" />
              <Row icon="📱" label="Versión" sub="SMINK FIT" right="v1.0" last />
            </Section>

            <Section title="Cuenta">
              <Row icon="🚪" label="Cerrar sesión" onClick={onLogout} danger last />
            </Section>

            <div style={{ color:"#333", fontSize:12, textAlign:"center", marginTop:16, lineHeight:1.6 }}>
              SMINK FIT · Tus datos están protegidos y seguros{"\n"}con cifrado de extremo a extremo.
            </div>
          </>
        )}

        {/* ── CAMBIAR EMAIL ───────────────────────────── */}
        {section === "email" && (
          <div>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              Introduce tu nuevo correo electrónico. Te enviaremos un enlace de confirmación para verificarlo.
            </div>
            <div style={{ color:"#666", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Correo actual</div>
            <div style={{ padding:"13px 14px", borderRadius:12, border:"1px solid #1e1e28", background:"#1a1a24", color:"#555", fontSize:15, marginBottom:16 }}>{userEmail}</div>
            <div style={{ color:"#666", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Nuevo correo</div>
            <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} type="email" placeholder="nuevo@correo.com" style={inp} />
            <button onClick={handleChangeEmail} disabled={loading||!newEmail}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:newEmail?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:newEmail?"white":"#555", fontWeight:800, fontSize:16, cursor:newEmail?"pointer":"default", marginTop:4 }}>
              {loading?"Enviando...":"Cambiar correo"}
            </button>
          </div>
        )}

        {/* ── CAMBIAR CONTRASEÑA ──────────────────────── */}
        {section === "password" && (
          <div>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              Tu nueva contraseña debe tener al menos 6 caracteres.
            </div>
            <div style={{ color:"#666", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Nueva contraseña</div>
            <input value={newPass} onChange={e=>setNewPass(e.target.value)} type="password" placeholder="••••••••" style={inp} />
            <div style={{ color:"#666", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Confirmar contraseña</div>
            <input value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} type="password" placeholder="••••••••" style={inp} />
            <button onClick={handleChangePassword} disabled={loading||!newPass||!confirmPass}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:(newPass&&confirmPass)?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:(newPass&&confirmPass)?"white":"#555", fontWeight:800, fontSize:16, cursor:(newPass&&confirmPass)?"pointer":"default", marginTop:4 }}>
              {loading?"Guardando...":"Cambiar contraseña"}
            </button>
          </div>
        )}

        {/* ── FEEDBACK ───────────────────────────────── */}
        {section === "feedback" && (
          <div>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              Tu opinión nos ayuda a mejorar. Cuéntanos qué piensas, qué falla o qué echas en falta.
            </div>
            <div style={{ color:"#666", fontSize:12, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Tipo</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["sugerencia","💡 Sugerencia"],["queja","😤 Queja"],["bug","🐛 Error"],["otro","💬 Otro"]].map(([id,label]) => (
                <button key={id} onClick={()=>setFbType(id)}
                  style={{ flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${fbType===id?"#4caf50":"#2a2a3a"}`, background:fbType===id?"rgba(76,175,80,0.15)":"transparent", color:fbType===id?"#4caf50":"#555", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ color:"#666", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Mensaje</div>
            <textarea value={fbMsg} onChange={e=>setFbMsg(e.target.value)} placeholder="Cuéntanos con detalle..." rows={5}
              style={{ ...inp, resize:"none", lineHeight:1.5 }} />
            <button onClick={handleFeedback} disabled={loading||!fbMsg.trim()}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:fbMsg.trim()?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:fbMsg.trim()?"white":"#555", fontWeight:800, fontSize:16, cursor:fbMsg.trim()?"pointer":"default", marginTop:4 }}>
              {loading?"Enviando...":"Enviar feedback"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
