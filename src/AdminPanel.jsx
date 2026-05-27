import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

// ═══════════════════════════════════════════════════════════
// SMINK FIT — Panel de Administración
// ═══════════════════════════════════════════════════════════

const PLANS = ["free", "premium", "lifetime", "admin"];
const PLAN_COLOR = { free:"#666", premium:"#ffd700", lifetime:"#ff6b35", admin:"#4caf50" };
const PLAN_BG = { free:"#2a2a3a", premium:"rgba(255,215,0,0.12)", lifetime:"rgba(255,107,53,0.12)", admin:"rgba(76,175,80,0.12)" };

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day:"2-digit", month:"short", year:"numeric" });
}

function fmtDaysLeft(iso) {
  if (!iso) return null;
  const diff = Math.ceil((new Date(iso) - new Date()) / 86400000);
  if (diff <= 0) return "Expirado";
  return `${diff} días restantes`;
}

// ── Mini barra de progreso ─────────────────────────────────
function Bar({ label, value, total, color="#4caf50", icon="" }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {icon && <span style={{ fontSize:14 }}>{icon}</span>}
          <span style={{ color:"#ccc", fontSize:13, fontWeight:600 }}>{label}</span>
        </div>
        <span style={{ color, fontWeight:700, fontSize:13 }}>{value} <span style={{ color:"#555", fontWeight:400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height:7, background:"#2a2a3a", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:4, transition:"width 0.8s ease" }} />
      </div>
    </div>
  );
}

// ── Tarjeta de stat ────────────────────────────────────────
function StatCard({ label, value, sub, color="#4caf50", icon="" }) {
  return (
    <div style={{ background:"#1a1a24", borderRadius:14, padding:"14px 16px", border:`1px solid ${color}25` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ color:"#555", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{label}</div>
          <div style={{ color:"white", fontWeight:900, fontSize:26 }}>{value}</div>
          {sub && <div style={{ color:color, fontSize:11, marginTop:3, fontWeight:600 }}>{sub}</div>}
        </div>
        {icon && <span style={{ fontSize:22, opacity:0.6 }}>{icon}</span>}
      </div>
    </div>
  );
}

// ── Gráfica de dona simple ─────────────────────────────────
function DonutChart({ data, size=120 }) {
  const total = data.reduce((s,d) => s+d.value, 0);
  let angle = -90;
  const r = 45; const cx = 60; const cy = 60;
  const arcs = data.map(d => {
    const pct = total > 0 ? d.value/total : 0;
    const a = pct * 360;
    const start = angle;
    angle += a;
    const rad = (deg) => deg * Math.PI / 180;
    const x1 = cx + r * Math.cos(rad(start));
    const y1 = cy + r * Math.sin(rad(start));
    const x2 = cx + r * Math.cos(rad(start+a));
    const y2 = cy + r * Math.sin(rad(start+a));
    const large = a > 180 ? 1 : 0;
    return { ...d, path: a > 0.5 ? `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` : null };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="#1a1a24" />
      {arcs.map((a,i) => a.path && <path key={i} d={a.path} fill={a.color} opacity={0.85} />)}
      <circle cx={cx} cy={cy} r={28} fill="#0f0f14" />
      <text x={cx} y={cy+2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="900">{total}</text>
      <text x={cx} y={cy+16} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="8">usuarios</text>
    </svg>
  );
}

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newPlan, setNewPlan] = useState("free");
  const [giftMonths, setGiftMonths] = useState(1);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("todos");

  useEffect(() => { loadAll(); }, []);

  const showToast = (msg, ok=true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(""), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [
        { data: plans },
        { data: profiles },
        { data: fb },
        { data: nutrition },
        { data: workouts },
        { data: routines },
        { data: racePlans },
        { data: measures },
        { data: waterLogs },
        { data: sleepLogs },
      ] = await Promise.all([
        supabase.from("user_plans").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("feedback").select("*").order("created_at", { ascending:false }),
        supabase.from("nutrition_history").select("user_id"),
        supabase.from("workout_log").select("user_id"),
        supabase.from("saved_routine").select("user_id,data"),
        supabase.from("race_plan").select("user_id,data"),
        supabase.from("measure_log").select("user_id"),
        supabase.from("water_log").select("user_id"),
        supabase.from("sleep_log").select("user_id"),
      ]);

      // Combinar usuarios
      const combined = (plans||[]).map(p => {
        const prof = (profiles||[]).find(pr => pr.id === p.user_id) || {};
        return {
          id: p.user_id,
          email: prof.email || "—",
          name: prof.name || "Sin nombre",
          plan: p.plan || "free",
          plan_expires_at: p.plan_expires_at,
          granted_by: p.granted_by,
          created_at: p.created_at,
          weight: prof.weight, height: prof.height, age: prof.age,
          goal: prof.goal, activity: prof.activity,
        };
      });
      setUsers(combined);
      setFeedback(fb||[]);

      // Stats de uso
      const uniq = (arr) => new Set((arr||[]).map(r=>r.user_id)).size;
      const total = combined.length;

      // Rutinas
      const routineUsers = (routines||[]);
      const hybridCount = routineUsers.filter(r => r.data?.hybrid).length;
      const weeklyCount = routineUsers.filter(r => r.data && !r.data.hybrid && !r.data.cardio).length;
      const cardioCount = routineUsers.filter(r => r.data?.cardio).length;

      setStats({
        total,
        premium: combined.filter(u=>u.plan==="premium"||u.plan==="lifetime").length,
        free: combined.filter(u=>u.plan==="free").length,
        admin: combined.filter(u=>u.plan==="admin").length,
        pendingFeedback: (fb||[]).filter(f=>f.status==="pendiente").length,
        // Uso de features
        nutrition: uniq(nutrition),
        workout: uniq(workouts),
        routine: routineUsers.length,
        hybridRoutine: hybridCount,
        weeklyRoutine: weeklyCount,
        cardioRoutine: cardioCount,
        racePlan: (racePlans||[]).length,
        measures: uniq(measures),
        water: uniq(waterLogs),
        sleep: uniq(sleepLogs),
      });
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const updatePlan = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const updates = { plan: newPlan, updated_at: new Date().toISOString() };
      if (newPlan === "premium" && giftMonths > 0) {
        const exp = new Date();
        exp.setMonth(exp.getMonth() + giftMonths);
        updates.plan_expires_at = exp.toISOString();
        updates.granted_by = "admin";
      } else if (newPlan === "lifetime" || newPlan === "admin") {
        updates.plan_expires_at = null;
        updates.granted_by = "admin";
      } else if (newPlan === "free") {
        updates.plan_expires_at = null;
        updates.granted_by = null;
      }
      const { error } = await supabase.from("user_plans").update(updates).eq("user_id", editingUser.id);
      if (error) throw error;
      showToast(`Plan de ${editingUser.name} actualizado a ${newPlan} ✓`);
      setEditingUser(null);
      loadAll();
    } catch(e) { showToast("Error al actualizar ✗", false); }
    setSaving(false);
  };

  const addMonths = async (userId, months) => {
    setSaving(true);
    try {
      const { data: current } = await supabase.from("user_plans").select("plan_expires_at").eq("user_id", userId).maybeSingle();
      const base = current?.plan_expires_at && new Date(current.plan_expires_at) > new Date()
        ? new Date(current.plan_expires_at) : new Date();
      base.setMonth(base.getMonth() + months);
      await supabase.from("user_plans").update({ plan:"premium", plan_expires_at: base.toISOString(), granted_by:"admin" }).eq("user_id", userId);
      showToast(`+${months} mes${months>1?"es":""} añadidos ✓`);
      loadAll();
    } catch(e) { showToast("Error ✗", false); }
    setSaving(false);
  };

  const markFeedback = async (id, status) => {
    await supabase.from("feedback").update({ status }).eq("id", id);
    setFeedback(prev => prev.map(f => f.id===id ? {...f,status} : f));
    showToast("Estado actualizado ✓");
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFb = feedbackFilter === "todos" ? feedback : feedback.filter(f => f.status === feedbackFilter);

  const TABS = [
    { id:"overview", label:"📊 Overview" },
    { id:"usuarios", label:"👥 Usuarios" },
    { id:"feedback", label:"💬 Feedback" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui,sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:toast.ok?"#4caf50":"#e53935", color:"white", padding:"10px 22px", borderRadius:20, fontWeight:700, fontSize:13, zIndex:999, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", whiteSpace:"nowrap", animation:"fadeIn 0.3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background:"rgba(10,10,14,0.97)", borderBottom:"1px solid #1e1e28", padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(12px)" }}>
        <div>
          <div style={{ color:"#4caf50", fontSize:9, fontWeight:700, letterSpacing:3, textTransform:"uppercase" }}>SMINK FIT</div>
          <div style={{ fontWeight:900, fontSize:17, letterSpacing:0.3 }}>Admin Panel</div>
        </div>
        <button onClick={onLogout} style={{ background:"none", border:"1px solid #2a2a3a", borderRadius:10, color:"#666", padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
          Salir
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#0f0f14", borderBottom:"1px solid #1e1e28", padding:"0 16px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"12px 14px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?"#4caf50":"transparent"}`, color:tab===t.id?"#4caf50":"#555", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"18px 16px 80px" }}>

        {loading ? (
          <div style={{ textAlign:"center", color:"#666", padding:60 }}>
            <div style={{ fontSize:30, marginBottom:12 }}>⟳</div>
            Cargando datos...
          </div>
        ) : (

        <>
        {/* ── OVERVIEW ──────────────────────────────────── */}
        {tab === "overview" && stats && (
          <>
            {/* Stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
              <StatCard label="Usuarios totales" value={stats.total} icon="👥" color="#4caf50" />
              <StatCard label="Premium / Lifetime" value={stats.premium} sub={`${stats.total>0?Math.round(stats.premium/stats.total*100):0}% del total`} icon="⭐" color="#ffd700" />
              <StatCard label="Plan gratuito" value={stats.free} icon="🆓" color="#888" />
              <StatCard label="Feedback pendiente" value={stats.pendingFeedback} icon="💬" color="#ff6b35" />
            </div>

            {/* Donut de planes */}
            <div style={{ background:"#1a1a24", borderRadius:18, padding:"18px 16px", marginBottom:16, border:"1px solid #2a2a3a" }}>
              <div style={{ color:"#888", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Distribución de planes</div>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                <DonutChart data={[
                  { value:stats.free, color:"#3a3a4a" },
                  { value:stats.premium, color:"#ffd700" },
                  { value:stats.admin, color:"#4caf50" },
                ]} />
                <div style={{ flex:1 }}>
                  {[["Free", stats.free, "#888"], ["Premium", stats.premium, "#ffd700"], ["Admin", stats.admin, "#4caf50"]].map(([label, val, color]) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:color }} />
                        <span style={{ color:"#aaa", fontSize:13 }}>{label}</span>
                      </div>
                      <span style={{ color:"white", fontWeight:700, fontSize:13 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Uso de features */}
            <div style={{ background:"#1a1a24", borderRadius:18, padding:"18px 16px", marginBottom:16, border:"1px solid #2a2a3a" }}>
              <div style={{ color:"#888", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Uso de funcionalidades</div>
              <Bar label="Nutrición" value={stats.nutrition} total={stats.total} color="#ff9800" icon="🥗" />
              <Bar label="Entrenos registrados" value={stats.workout} total={stats.total} color="#f44336" icon="💪" />
              <Bar label="Rutina semanal" value={stats.weeklyRoutine} total={stats.total} color="#4caf50" icon="📅" />
              <Bar label="Rutina híbrida" value={stats.hybridRoutine} total={stats.total} color="#00bcd4" icon="🔀" />
              <Bar label="Plan de carrera" value={stats.racePlan} total={stats.total} color="#ff6b35" icon="🏃" />
              <Bar label="Medidas corporales" value={stats.measures} total={stats.total} color="#9c27b0" icon="📏" />
              <Bar label="Hidratación" value={stats.water} total={stats.total} color="#2196f3" icon="💧" />
              <Bar label="Registro de sueño" value={stats.sleep} total={stats.total} color="#7c4dff" icon="😴" />
            </div>

            {/* Botón refresh */}
            <button onClick={loadAll} style={{ width:"100%", padding:"13px", borderRadius:12, border:"1px solid #2a2a3a", background:"transparent", color:"#666", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              ↻ Actualizar datos
            </button>
          </>
        )}

        {/* ── USUARIOS ──────────────────────────────────── */}
        {tab === "usuarios" && (
          <>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Buscar por nombre o correo..."
              style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid #2a2a3a", background:"#1a1a24", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:14 }} />

            <div style={{ color:"#555", fontSize:12, marginBottom:12, fontWeight:600 }}>{filtered.length} usuarios encontrados</div>

            {filtered.map(u => {
              const isEditing = editingUser?.id === u.id;
              const daysLeft = fmtDaysLeft(u.plan_expires_at);
              return (
                <div key={u.id} style={{ background:"#1a1a24", borderRadius:16, marginBottom:10, border:`1px solid ${isEditing?"#4caf5040":"#2a2a3a"}`, overflow:"hidden", transition:"border 0.2s" }}>
                  <div style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:800, fontSize:15, marginBottom:2, display:"flex", alignItems:"center", gap:8 }}>
                          {u.name}
                          {u.plan === "admin" && <span style={{ fontSize:9, background:"rgba(76,175,80,0.2)", color:"#4caf50", borderRadius:20, padding:"2px 7px", fontWeight:700 }}>ADMIN</span>}
                        </div>
                        <div style={{ color:"#666", fontSize:12, marginBottom:8 }}>{u.email}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                          <span style={{ fontSize:10, background:PLAN_BG[u.plan], color:PLAN_COLOR[u.plan], borderRadius:20, padding:"3px 10px", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{u.plan}</span>
                          {daysLeft && u.plan==="premium" && <span style={{ color:daysLeft==="Expirado"?"#f44336":"#ffd700", fontSize:11, fontWeight:600 }}>{daysLeft}</span>}
                          {u.plan_expires_at && u.plan==="premium" && <span style={{ color:"#555", fontSize:10 }}>hasta {fmtDate(u.plan_expires_at)}</span>}
                          <span style={{ color:"#444", fontSize:10 }}>Registro: {fmtDate(u.created_at)}</span>
                        </div>
                        {(u.weight||u.age||u.goal) && (
                          <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                            {u.weight && <span style={{ color:"#555", fontSize:11 }}>⚖ {u.weight}kg</span>}
                            {u.age && <span style={{ color:"#555", fontSize:11 }}>🎂 {u.age}a</span>}
                            {u.goal && <span style={{ color:"#555", fontSize:11 }}>🎯 {u.goal}</span>}
                          </div>
                        )}
                      </div>
                      <button onClick={()=>{ setEditingUser(isEditing?null:u); setNewPlan(u.plan); setGiftMonths(1); }}
                        style={{ background:isEditing?"#4caf5020":"#2a2a3a", border:`1px solid ${isEditing?"#4caf5060":"#3a3a4a"}`, borderRadius:10, color:isEditing?"#4caf50":"#aaa", padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, transition:"all 0.2s" }}>
                        {isEditing?"Cerrar":"Gestionar"}
                      </button>
                    </div>
                  </div>

                  {/* Panel gestión */}
                  {isEditing && (
                    <div style={{ padding:"16px", borderTop:"1px solid #2a2a3a", background:"#15151c" }}>
                      <div style={{ color:"#666", fontSize:11, fontWeight:700, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Cambiar plan</div>

                      {/* Selector de plan */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                        {PLANS.map(p => (
                          <button key={p} onClick={()=>setNewPlan(p)}
                            style={{ padding:"12px", borderRadius:12, border:`2px solid ${newPlan===p?PLAN_COLOR[p]:"#2a2a3a"}`, background:newPlan===p?PLAN_BG[p]:"transparent", color:newPlan===p?PLAN_COLOR[p]:"#555", fontWeight:700, fontSize:13, cursor:"pointer", textTransform:"uppercase", letterSpacing:0.5, transition:"all 0.2s" }}>
                            {p === "premium" ? "⭐ Premium" : p === "lifetime" ? "♾ Lifetime" : p === "admin" ? "🔑 Admin" : "🆓 Free"}
                          </button>
                        ))}
                      </div>

                      {/* Meses de regalo (solo premium) */}
                      {newPlan === "premium" && (
                        <div style={{ marginBottom:16 }}>
                          <div style={{ color:"#666", fontSize:11, fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Meses de acceso</div>
                          <div style={{ display:"flex", gap:8 }}>
                            {[1,2,3,6,12].map(m => (
                              <button key={m} onClick={()=>setGiftMonths(m)}
                                style={{ flex:1, padding:"10px 0", borderRadius:10, border:`1.5px solid ${giftMonths===m?"#ffd700":"#2a2a3a"}`, background:giftMonths===m?"rgba(255,215,0,0.1)":"transparent", color:giftMonths===m?"#ffd700":"#555", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}>
                                {m === 12 ? "1 año" : `${m}m`}
                              </button>
                            ))}
                          </div>
                          <div style={{ color:"#555", fontSize:11, marginTop:8, textAlign:"center" }}>
                            Expira el {(() => { const d=new Date(); d.setMonth(d.getMonth()+giftMonths); return fmtDate(d.toISOString()); })()}
                          </div>
                        </div>
                      )}

                      {/* Añadir meses extra (si ya es premium) */}
                      {u.plan === "premium" && u.plan_expires_at && (
                        <div style={{ marginBottom:16, padding:"12px", background:"rgba(255,215,0,0.05)", border:"1px solid rgba(255,215,0,0.2)", borderRadius:12 }}>
                          <div style={{ color:"#ffd700", fontSize:12, fontWeight:700, marginBottom:10 }}>➕ Añadir meses extra al plan actual</div>
                          <div style={{ display:"flex", gap:6 }}>
                            {[1,2,3,6].map(m => (
                              <button key={m} onClick={()=>addMonths(u.id,m)} disabled={saving}
                                style={{ flex:1, padding:"8px 0", borderRadius:8, border:"1px solid rgba(255,215,0,0.3)", background:"transparent", color:"#ffd700", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                                +{m}m
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={updatePlan} disabled={saving}
                          style={{ flex:1, padding:"13px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", opacity:saving?0.7:1 }}>
                          {saving?"Guardando...":"Guardar cambios"}
                        </button>
                        <button onClick={()=>setEditingUser(null)}
                          style={{ padding:"13px 16px", borderRadius:12, border:"1px solid #2a2a3a", background:"transparent", color:"#666", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── FEEDBACK ──────────────────────────────────── */}
        {tab === "feedback" && (
          <>
            {/* Filtros */}
            <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
              {["todos","pendiente","leido","resuelto"].map(f => (
                <button key={f} onClick={()=>setFeedbackFilter(f)}
                  style={{ padding:"8px 14px", borderRadius:20, border:`1px solid ${feedbackFilter===f?"#4caf50":"#2a2a3a"}`, background:feedbackFilter===f?"rgba(76,175,80,0.15)":"transparent", color:feedbackFilter===f?"#4caf50":"#555", fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap", textTransform:"capitalize" }}>
                  {f} {f==="todos"?`(${feedback.length})`:f==="pendiente"?`(${feedback.filter(x=>x.status===f).length})`:f==="leido"?`(${feedback.filter(x=>x.status===f).length})`:`(${feedback.filter(x=>x.status===f).length})`}
                </button>
              ))}
            </div>

            {filteredFb.length === 0 ? (
              <div style={{ textAlign:"center", color:"#555", padding:50 }}>
                <div style={{ fontSize:30, marginBottom:10 }}>💬</div>
                No hay feedback {feedbackFilter !== "todos" ? `"${feedbackFilter}"` : "todavía"}
              </div>
            ) : filteredFb.map(f => (
              <div key={f.id} style={{ background:"#1a1a24", borderRadius:16, marginBottom:10, border:`1px solid ${f.status==="pendiente"?"rgba(255,107,53,0.3)":"#2a2a3a"}`, overflow:"hidden" }}>
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:6 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:10, background:f.type==="bug"?"rgba(244,67,54,0.2)":f.type==="sugerencia"?"rgba(76,175,80,0.15)":"rgba(255,152,0,0.15)", color:f.type==="bug"?"#f44336":f.type==="sugerencia"?"#8bc34a":"#ff9800", borderRadius:20, padding:"3px 10px", fontWeight:700, textTransform:"uppercase" }}>{f.type||"otro"}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:f.status==="pendiente"?"#ff6b35":f.status==="leido"?"#ffd700":"#4caf50", textTransform:"uppercase", letterSpacing:0.5 }}>● {f.status}</span>
                    </div>
                    <span style={{ color:"#444", fontSize:11 }}>{fmtDate(f.created_at)}</span>
                  </div>
                  {f.email && <div style={{ color:"#666", fontSize:12, marginBottom:6 }}>✉ {f.email}</div>}
                  <div style={{ color:"#ddd", fontSize:14, lineHeight:1.6 }}>{f.message}</div>
                  <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
                    {["pendiente","leido","resuelto"].map(s => (
                      <button key={s} onClick={()=>markFeedback(f.id,s)}
                        style={{ padding:"6px 12px", borderRadius:8, border:"1px solid #2a2a3a", background:f.status===s?"#2a2a3a":"transparent", color:f.status===s?"white":"#555", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:0.5 }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        </>
      )}
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
