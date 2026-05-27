import { useState, useRef } from "react";
import { supabase } from "./supabase.js";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ color:"#555", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, paddingLeft:4 }}>{title}</div>
      <div style={{ background:"#1a1a24", borderRadius:16, border:"1px solid #2a2a3a", overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, sub, right, onClick, danger, last }) {
  return (
    <button onClick={onClick} style={{ width:"100%", padding:"15px 16px", background:"none", border:"none", borderBottom:last?"none":"1px solid #1e1e28", cursor:onClick?"pointer":"default", textAlign:"left", display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:danger?"#e53935":"white", fontWeight:600, fontSize:15 }}>{label}</div>
        {sub && <div style={{ color:"#555", fontSize:12, marginTop:2 }}>{sub}</div>}
      </div>
      {right && <div style={{ color:"#555", fontSize:13, flexShrink:0 }}>{right}</div>}
      {onClick && !right && <span style={{ color:"#444", fontSize:18 }}>›</span>}
    </button>
  );
}

export default function SettingsScreen({ userData, userId, userEmail, userPlan, onLogout, onEditProfile }) {
  const [section, setSection] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [fbType, setFbType] = useState("sugerencia");
  const [fbMsg, setFbMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastOk, setToastOk] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const showToast = (msg, ok=true) => {
    setToast(msg); setToastOk(ok);
    setTimeout(() => setToast(""), 3000);
  };

  const handleChangeEmail = async () => {
    if (!newEmail.includes("@")) { showToast("Correo no válido", false); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) showToast(error.message, false);
    else { showToast("Correo de confirmación enviado"); setSection(null); setNewEmail(""); }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!currentPass) { showToast("Introduce tu contrasena actual", false); return; }
    if (newPass.length < 6) { showToast("Minimo 6 caracteres", false); return; }
    if (newPass !== confirmPass) { showToast("Las contrasenass no coinciden", false); return; }
    setLoading(true);
    // Verificar contraseña actual re-autenticando
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email, password: currentPass
    });
    if (signInErr) { showToast("La contrasena actual no es correcta", false); setLoading(false); return; }
    // Cambiar contraseña
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) showToast(error.message, false);
    else { showToast("Contrasena actualizada"); setSection(null); setCurrentPass(""); setNewPass(""); setConfirmPass(""); }
    setLoading(false);
  };

  const handleFeedback = async () => {
    if (!fbMsg.trim()) { showToast("Escribe algo primero", false); return; }
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: userId, email: userEmail, type: fbType,
      message: fbMsg.trim(), status: "pendiente"
    });
    if (error) showToast("Error al enviar", false);
    else { showToast("Feedback enviado, gracias"); setSection(null); setFbMsg(""); }
    setLoading(false);
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Preview local inmediato
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
    // Subir a Supabase Storage si está configurado, si no guardar en base64 en perfil
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${userId}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", userId);
        showToast("Foto actualizada");
      } else {
        // Si no hay bucket configurado, guardamos en local de momento
        showToast("Foto guardada localmente");
      }
    } catch { showToast("Foto guardada localmente"); }
    setUploading(false);
  };

  const planLabel = { free:"Gratuito", premium:"Premium", lifetime:"Lifetime", admin:"Administrador" };
  const planColor = { free:"#666", premium:"#ffd700", lifetime:"#ff6b35", admin:"#4caf50" };

  const inp = {
    width:"100%", padding:"13px 14px", borderRadius:12,
    border:"1px solid #2a2a3a", background:"#0f0f14",
    color:"white", fontSize:15, outline:"none",
    boxSizing:"border-box", marginBottom:10
  };

  const initial = (userData?.name || userEmail || "?")[0].toUpperCase();

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui,sans-serif" }}>

      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:toastOk?"#4caf50":"#e53935", color:"white", padding:"10px 22px", borderRadius:20, fontWeight:700, fontSize:13, zIndex:999, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
          {toast}
        </div>
      )}

      <div style={{ padding:"16px 18px 0", paddingTop:"calc(16px + env(safe-area-inset-top))", display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
        {section && (
          <button onClick={()=>setSection(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, fontWeight:700, cursor:"pointer", padding:0 }}>
            Atras
          </button>
        )}
        <div style={{ fontWeight:900, fontSize:section?18:24 }}>
          {!section && "Ajustes"}
          {section === "email" && "Cambiar correo"}
          {section === "password" && "Cambiar contrasena"}
          {section === "feedback" && "Soporte y feedback"}
          {section === "avatar" && "Foto de perfil"}
        </div>
      </div>

      <div style={{ padding:"0 16px 100px" }}>

        {!section && (
          <>
            {/* Perfil card con foto */}
            <div style={{ background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:20, padding:"20px 18px", marginBottom:24, border:"1px solid #2e7d3240" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                {/* Avatar */}
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#4caf50,#2e7d32)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:26, color:"white", overflow:"hidden", border:"2px solid #4caf5060" }}>
                    {avatar ? <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : initial}
                  </div>
                  <button onClick={()=>fileRef.current?.click()}
                    style={{ position:"absolute", bottom:-2, right:-2, width:22, height:22, borderRadius:"50%", background:"#4caf50", border:"2px solid #0f0f14", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:11 }}>
                    +
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display:"none" }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:17, marginBottom:2 }}>{userData?.name || "Sin nombre"}</div>
                  <div style={{ color:"#666", fontSize:13, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userEmail}</div>
                  <span style={{ fontSize:11, color:planColor[userPlan||"free"], background:`${planColor[userPlan||"free"]}20`, borderRadius:20, padding:"3px 10px", fontWeight:700 }}>
                    {planLabel[userPlan||"free"]}
                  </span>
                </div>
              </div>
              {uploading && <div style={{ color:"#666", fontSize:12, textAlign:"center", marginTop:10 }}>Subiendo foto...</div>}
            </div>

            <Section title="Perfil">
              <Row label="Editar datos del perfil" sub="Peso, altura, objetivo, actividad..." onClick={onEditProfile} />
              <Row label="Cambiar correo electronico" sub={userEmail} onClick={()=>setSection("email")} />
              <Row label="Cambiar contrasena" onClick={()=>setSection("password")} last />
            </Section>

            <Section title="Plan actual">
              <Row label={planLabel[userPlan||"free"]} sub="Funcionalidades disponibles" right={userPlan==="free"?"Basico":"Activo"} last />
            </Section>

            <Section title="Soporte">
              <Row label="Enviar sugerencia" sub="Cuentanos como mejorar" onClick={()=>{ setFbType("sugerencia"); setSection("feedback"); }} />
              <Row label="Reportar un error" sub="Dinos que ha fallado" onClick={()=>{ setFbType("bug"); setSection("feedback"); }} last />
            </Section>

            <Section title="Aplicacion">
              <Row label="Idioma" sub="Proximamente disponible" right="Espanol" />
              <Row label="Version" right="SMINK FIT 1.0" last />
            </Section>

            <Section title="Cuenta">
              <Row label="Cerrar sesion" onClick={onLogout} danger last />
            </Section>

            <div style={{ color:"#333", fontSize:12, textAlign:"center", marginTop:16, lineHeight:1.8 }}>
              SMINK FIT · Tus datos estan protegidos y seguros
            </div>
          </>
        )}

        {section === "email" && (
          <div>
            <div style={{ color:"#888", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              Introduce tu nuevo correo. Te enviaremos un enlace de confirmacion para verificarlo.
            </div>
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Correo actual</div>
            <div style={{ padding:"13px 14px", borderRadius:12, border:"1px solid #1e1e28", background:"#1a1a24", color:"#555", fontSize:15, marginBottom:14 }}>{userEmail}</div>
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Nuevo correo</div>
            <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} type="email" placeholder="nuevo@correo.com" style={inp} />
            <button onClick={handleChangeEmail} disabled={loading||!newEmail}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:newEmail?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:newEmail?"white":"#555", fontWeight:800, fontSize:16, cursor:newEmail?"pointer":"default", marginTop:4 }}>
              {loading ? "Enviando..." : "Cambiar correo"}
            </button>
          </div>
        )}

        {section === "password" && (
          <div>
            <div style={{ color:"#888", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              Por seguridad, introduce primero tu contrasena actual.
            </div>
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Contrasena actual</div>
            <input value={currentPass} onChange={e=>setCurrentPass(e.target.value)} type="password" placeholder="••••••••" style={inp} />
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Nueva contrasena</div>
            <input value={newPass} onChange={e=>setNewPass(e.target.value)} type="password" placeholder="••••••••" style={inp} />
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Confirmar contrasena</div>
            <input value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} type="password" placeholder="••••••••" style={inp} />
            <button onClick={handleChangePassword} disabled={loading||!newPass||!confirmPass||!currentPass}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:(newPass&&confirmPass&&currentPass)?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:(newPass&&confirmPass&&currentPass)?"white":"#555", fontWeight:800, fontSize:16, cursor:(newPass&&confirmPass&&currentPass)?"pointer":"default", marginTop:4 }}>
              {loading ? "Verificando..." : "Cambiar contrasena"}
            </button>
          </div>
        )}

        {section === "feedback" && (
          <div>
            <div style={{ color:"#888", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              Tu opinion nos ayuda a mejorar. Cuentanos que piensas, que falla o que echas en falta.
            </div>
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Tipo</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["sugerencia","Sugerencia"],["queja","Queja"],["bug","Error"],["otro","Otro"]].map(([id,label]) => (
                <button key={id} onClick={()=>setFbType(id)}
                  style={{ flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${fbType===id?"#4caf50":"#2a2a3a"}`, background:fbType===id?"rgba(76,175,80,0.15)":"transparent", color:fbType===id?"#4caf50":"#555", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ color:"#555", fontSize:12, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Mensaje</div>
            <textarea value={fbMsg} onChange={e=>setFbMsg(e.target.value)} placeholder="Cuentanos con detalle..." rows={5}
              style={{ ...inp, resize:"none", lineHeight:1.5 }} />
            <button onClick={handleFeedback} disabled={loading||!fbMsg.trim()}
              style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:fbMsg.trim()?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:fbMsg.trim()?"white":"#555", fontWeight:800, fontSize:16, cursor:fbMsg.trim()?"pointer":"default", marginTop:4 }}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
