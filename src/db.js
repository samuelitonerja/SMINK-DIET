// ═══════════════════════════════════════════════════════════
// SMINK FIT — Capa de sincronización con Supabase
// Gestiona lectura, escritura y migración de datos
// ═══════════════════════════════════════════════════════════
import { supabase } from './supabase.js';

// ── Leer datos del usuario desde Supabase ──────────────────
export async function loadUserData(userId) {
  try {
    const [
      { data: profile },
      { data: nutrition },
      { data: workouts },
      { data: measures },
      { data: routine },
      { data: race },
      { data: water },
      { data: sleep },
      { data: foods },
      { data: training },
      { data: plan },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('nutrition_history').select('*').eq('user_id', userId),
      supabase.from('workout_log').select('*').eq('user_id', userId),
      supabase.from('measure_log').select('*').eq('user_id', userId),
      supabase.from('saved_routine').select('*').eq('user_id', userId).single(),
      supabase.from('race_plan').select('*').eq('user_id', userId).single(),
      supabase.from('water_log').select('*').eq('user_id', userId),
      supabase.from('sleep_log').select('*').eq('user_id', userId),
      supabase.from('custom_foods').select('*').eq('user_id', userId).single(),
      supabase.from('training_state').select('*').eq('user_id', userId).single(),
      supabase.from('user_plans').select('*').eq('user_id', userId).single(),
    ]);

    // Convertir arrays a objetos clave-valor (como el localStorage)
    const nutritionObj = {};
    (nutrition || []).forEach(r => { nutritionObj[r.date_key] = r.data; });

    const workoutObj = {};
    (workouts || []).forEach(r => { workoutObj[r.log_key] = r.data; });

    const measureObj = {};
    (measures || []).forEach(r => { measureObj[r.date_key] = r.data; });

    const waterObj = {};
    (water || []).forEach(r => { waterObj[r.date_key] = r.amount; });

    const sleepObj = {};
    (sleep || []).forEach(r => { sleepObj[r.date_key] = r.data; });

    return {
      userData: profile || null,
      history: nutritionObj,
      workoutLog: workoutObj,
      measureLog: measureObj,
      savedRoutine: routine?.data || null,
      racePlan: race?.data || null,
      waterLog: waterObj,
      sleepLog: sleepObj,
      customFoods: foods?.data || [],
      trainingState: training?.data || null,
      userPlan: plan?.plan || 'free',
      planExpiresAt: plan?.plan_expires_at || null,
    };
  } catch (e) {
    console.error('Error cargando datos:', e);
    return null;
  }
}

// ── Guardar perfil ─────────────────────────────────────────
export async function saveProfile(userId, data) {
  await supabase.from('profiles').upsert({
    id: userId, ...data, updated_at: new Date().toISOString()
  });
}

// ── Guardar nutrición (un día concreto) ────────────────────
export async function saveNutritionDay(userId, dateKey, data) {
  await supabase.from('nutrition_history').upsert({
    user_id: userId, date_key: dateKey, data
  }, { onConflict: 'user_id,date_key' });
}

// ── Guardar entreno ────────────────────────────────────────
export async function saveWorkout(userId, logKey, data) {
  await supabase.from('workout_log').upsert({
    user_id: userId, log_key: logKey, data
  }, { onConflict: 'user_id,log_key' });
}

// ── Guardar medidas ────────────────────────────────────────
export async function saveMeasure(userId, dateKey, data) {
  await supabase.from('measure_log').upsert({
    user_id: userId, date_key: dateKey, data
  }, { onConflict: 'user_id,date_key' });
}

// ── Guardar rutina ─────────────────────────────────────────
export async function saveRoutine(userId, data) {
  await supabase.from('saved_routine').upsert({
    user_id: userId, data, updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
}

// ── Guardar plan de carrera ────────────────────────────────
export async function saveRacePlan(userId, data) {
  await supabase.from('race_plan').upsert({
    user_id: userId, data, updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
}

// ── Guardar agua ───────────────────────────────────────────
export async function saveWater(userId, dateKey, amount) {
  await supabase.from('water_log').upsert({
    user_id: userId, date_key: dateKey, amount
  }, { onConflict: 'user_id,date_key' });
}

// ── Guardar sueño ──────────────────────────────────────────
export async function saveSleep(userId, dateKey, data) {
  await supabase.from('sleep_log').upsert({
    user_id: userId, date_key: dateKey, data
  }, { onConflict: 'user_id,date_key' });
}

// ── Guardar alimentos personalizados ──────────────────────
export async function saveCustomFoods(userId, data) {
  await supabase.from('custom_foods').upsert({
    user_id: userId, data, updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
}

// ── Guardar estado de entrenamiento ───────────────────────
export async function saveTrainingState(userId, data) {
  await supabase.from('training_state').upsert({
    user_id: userId, data, updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
}

// ── MIGRACIÓN: subir localStorage a Supabase ───────────────
// Se ejecuta una sola vez cuando el usuario hace login por primera vez.
// Detecta si hay datos en localStorage y los sube a Supabase automáticamente.
export async function migrateFromLocalStorage(userId) {
  const migrationKey = `sminkfit_migrated_${userId}`;
  if (localStorage.getItem(migrationKey)) return; // ya migrado

  console.log('🔄 Migrando datos locales a Supabase...');
  const promises = [];

  // Perfil
  const raw = localStorage.getItem('userData_v10');
  if (raw) {
    try {
      const ud = JSON.parse(raw);
      promises.push(saveProfile(userId, {
        name: ud.name, weight: ud.weight, height: ud.height,
        age: ud.age, sex: ud.sex, activity: ud.activity,
        goal: ud.goal, num_meals: ud.numMeals, kcal_adjust: ud.kcalAdjust,
      }));
    } catch(e) {}
  }

  // Nutrición
  const hist = localStorage.getItem('history_v10');
  if (hist) {
    try {
      const h = JSON.parse(hist);
      Object.entries(h).forEach(([k, v]) => {
        promises.push(saveNutritionDay(userId, k, v));
      });
    } catch(e) {}
  }

  // Entrenos
  const wlog = localStorage.getItem('workoutLog_v10');
  if (wlog) {
    try {
      const w = JSON.parse(wlog);
      Object.entries(w).forEach(([k, v]) => {
        promises.push(saveWorkout(userId, k, v));
      });
    } catch(e) {}
  }

  // Medidas
  const mlog = localStorage.getItem('measureLog_v10');
  if (mlog) {
    try {
      const m = JSON.parse(mlog);
      Object.entries(m).forEach(([k, v]) => {
        promises.push(saveMeasure(userId, k, v));
      });
    } catch(e) {}
  }

  // Rutina
  const rout = localStorage.getItem('savedRoutine_v10');
  if (rout) {
    try { promises.push(saveRoutine(userId, JSON.parse(rout))); } catch(e) {}
  }

  // Plan de carrera
  const race = localStorage.getItem('racePlan_v10');
  if (race) {
    try { promises.push(saveRacePlan(userId, JSON.parse(race))); } catch(e) {}
  }

  // Agua
  const water = localStorage.getItem('waterLog_v10');
  if (water) {
    try {
      const w = JSON.parse(water);
      Object.entries(w).forEach(([k, v]) => {
        promises.push(saveWater(userId, k, v));
      });
    } catch(e) {}
  }

  // Sueño
  const sleep = localStorage.getItem('sleepLog_v10');
  if (sleep) {
    try {
      const s = JSON.parse(sleep);
      Object.entries(s).forEach(([k, v]) => {
        promises.push(saveSleep(userId, k, v));
      });
    } catch(e) {}
  }

  // Alimentos personalizados
  const foods = localStorage.getItem('customFoods_v10');
  if (foods) {
    try { promises.push(saveCustomFoods(userId, JSON.parse(foods))); } catch(e) {}
  }

  // Ejecutar todo en paralelo
  await Promise.allSettled(promises);

  // Marcar como migrado (no borrar localStorage por seguridad, solo marcar)
  localStorage.setItem(migrationKey, 'true');
  console.log('✅ Migración completada');
}
