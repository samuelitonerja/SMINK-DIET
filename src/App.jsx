import { useState, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// BASE DE DATOS Y LÓGICA — SMINK DIET
// ═══════════════════════════════════════════════════════════════════════════

const FOOD_DB = [
  // HIDRATOS
  { id:"arr1", name:"Arroz blanco", cat:"hidrato", kcal:360, p:7, g:1, c:80 },
  { id:"arr2", name:"Arroz integral", cat:"hidrato", kcal:340, p:8, g:2, c:72 },
  { id:"pas1", name:"Pasta (espaguetis)", cat:"hidrato", kcal:358, p:12, g:1, c:72 },
  { id:"pas2", name:"Pasta integral", cat:"hidrato", kcal:340, p:13, g:2, c:68 },
  { id:"pas3", name:"Macarrones", cat:"hidrato", kcal:358, p:12, g:1, c:72 },
  { id:"gno1", name:"Ñoquis Hacendado", cat:"hidrato", kcal:174, p:4, g:0, c:37 },
  { id:"pat1", name:"Patata cruda", cat:"hidrato", kcal:77, p:2, g:0, c:17 },
  { id:"pat2", name:"Boniato crudo", cat:"hidrato", kcal:86, p:2, g:0, c:20 },
  { id:"tor1", name:"Tortitas maíz Hacendado natural", cat:"hidrato", kcal:367, p:8, g:2, c:80 },
  { id:"tor2", name:"Tortitas maíz sabor jamón", cat:"hidrato", kcal:417, p:8, g:5, c:80 },
  { id:"tor3", name:"Bicentury tomate", cat:"hidrato", kcal:460, p:6, g:14, c:72 },
  { id:"faj1", name:"Fajitas pequeñas Hacendado", cat:"hidrato", kcal:287, p:8, g:5, c:55 },
  { id:"faj2", name:"Fajitas avena 51% Hacendado", cat:"hidrato", kcal:287, p:15, g:6, c:40 },
  { id:"pan1", name:"Pan centeno 51% Mercadona", cat:"hidrato", kcal:262, p:9, g:2, c:50 },
  { id:"pan2", name:"Pan 12 cereales Hacendado", cat:"hidrato", kcal:263, p:10, g:4, c:47 },
  { id:"pan3", name:"Pan de molde integral", cat:"hidrato", kcal:247, p:9, g:3, c:46 },
  { id:"pan4", name:"Pan blanco de molde", cat:"hidrato", kcal:265, p:8, g:3, c:51 },
  { id:"ave1", name:"Avena en copos", cat:"hidrato", kcal:370, p:13, g:7, c:63 },
  { id:"qui1", name:"Quinoa cruda (en seco)", cat:"hidrato", kcal:368, p:14, g:6, c:64 },
  { id:"len1", name:"Lentejas crudas (en seco)", cat:"hidrato", kcal:336, p:24, g:1, c:60 },
  { id:"gar1", name:"Garbanzos crudos (en seco)", cat:"hidrato", kcal:364, p:19, g:6, c:61 },
  { id:"mai1", name:"Maíz dulce (lata escurrido)", cat:"hidrato", kcal:86, p:3, g:1, c:19 },
  { id:"cop1", name:"Copos de maíz (cornflakes)", cat:"hidrato", kcal:357, p:7, g:1, c:80 },
  // PROTEÍNAS
  { id:"pol1", name:"Pechuga de pollo", cat:"proteina", kcal:165, p:31, g:4, c:0 },
  { id:"pol2", name:"Muslo de pollo sin piel", cat:"proteina", kcal:177, p:25, g:8, c:0 },
  { id:"sal1", name:"Salmón fresco", cat:"proteina", kcal:208, p:20, g:13, c:0 },
  { id:"sal2", name:"Salmón ahumado", cat:"proteina", kcal:172, p:25, g:8, c:0 },
  { id:"mer1", name:"Merluza", cat:"proteina", kcal:80, p:17, g:2, c:0 },
  { id:"bac1", name:"Bacalao", cat:"proteina", kcal:82, p:18, g:1, c:0 },
  { id:"atu1", name:"Atún en conserva (agua)", cat:"proteina", kcal:116, p:26, g:1, c:0 },
  { id:"atu2", name:"Atún en aceite", cat:"proteina", kcal:200, p:29, g:9, c:0 },
  { id:"ter1", name:"Ternera molida 5%", cat:"proteina", kcal:137, p:21, g:5, c:0 },
  { id:"ter2", name:"Filete de ternera", cat:"proteina", kcal:150, p:22, g:6, c:0 },
  { id:"pav1", name:"Pechuga de pavo", cat:"proteina", kcal:135, p:29, g:2, c:0 },
  { id:"lom1", name:"Lomo embuchado", cat:"proteina", kcal:175, p:29, g:6, c:0 },
  { id:"emb1", name:"Embutido de pavo 93%", cat:"proteina", kcal:100, p:19, g:2, c:1 },
  { id:"hue1", name:"Huevo entero", cat:"proteina", kcal:155, p:13, g:11, c:1 },
  { id:"cla1", name:"Clara de huevo", cat:"proteina", kcal:52, p:11, g:0, c:1 },
  { id:"que1", name:"Queso cottage", cat:"proteina", kcal:98, p:11, g:4, c:3 },
  { id:"que2", name:"Queso light en lonchas", cat:"proteina", kcal:200, p:25, g:10, c:2 },
  { id:"yog1", name:"Yogur griego 0%", cat:"proteina", kcal:57, p:10, g:0, c:4 },
  { id:"yog2", name:"Yogur griego natural", cat:"proteina", kcal:97, p:9, g:5, c:4 },
  { id:"sar1", name:"Sardinas en conserva", cat:"proteina", kcal:185, p:25, g:10, c:0 },
  { id:"cer1", name:"Cerdo solomillo", cat:"proteina", kcal:143, p:22, g:6, c:0 },
  { id:"gam1", name:"Gambas", cat:"proteina", kcal:85, p:18, g:1, c:0 },
  // GRASAS
  { id:"aov1", name:"Aceite de oliva virgen extra", cat:"grasa", kcal:900, p:0, g:100, c:0 },
  { id:"agu1", name:"Aguacate", cat:"grasa", kcal:160, p:2, g:15, c:9 },
  { id:"nue1", name:"Nueces", cat:"grasa", kcal:654, p:15, g:65, c:14 },
  { id:"alm1", name:"Almendras", cat:"grasa", kcal:579, p:21, g:50, c:22 },
  { id:"cac1", name:"Cacahuetes", cat:"grasa", kcal:567, p:26, g:49, c:16 },
  { id:"man1", name:"Mantequilla de cacahuete", cat:"grasa", kcal:588, p:25, g:50, c:20 },
  { id:"sem1", name:"Semillas de chía", cat:"grasa", kcal:486, p:17, g:31, c:42 },
  { id:"sem2", name:"Semillas de lino", cat:"grasa", kcal:534, p:18, g:42, c:29 },
  { id:"hum1", name:"Hummus", cat:"grasa", kcal:177, p:5, g:10, c:17 },
  { id:"que3", name:"Queso parmesano", cat:"grasa", kcal:431, p:38, g:29, c:4 },
  // VERDURAS
  { id:"tom1", name:"Tomate cherry", cat:"verdura", kcal:18, p:1, g:0, c:4 },
  { id:"tom2", name:"Tomate natural", cat:"verdura", kcal:18, p:1, g:0, c:4 },
  { id:"ceb1", name:"Cebolla", cat:"verdura", kcal:40, p:1, g:0, c:9 },
  { id:"lec1", name:"Lechuga", cat:"verdura", kcal:15, p:1, g:0, c:2 },
  { id:"esp1", name:"Espárragos", cat:"verdura", kcal:20, p:2, g:0, c:4 },
  { id:"cha1", name:"Champiñones", cat:"verdura", kcal:22, p:3, g:0, c:3 },
  { id:"jud1", name:"Judías verdes", cat:"verdura", kcal:31, p:2, g:0, c:7 },
  { id:"bro1", name:"Brócoli", cat:"verdura", kcal:34, p:3, g:0, c:7 },
  { id:"cal1", name:"Calabacín", cat:"verdura", kcal:17, p:1, g:0, c:3 },
  { id:"pip1", name:"Pimiento rojo", cat:"verdura", kcal:31, p:1, g:0, c:6 },
  { id:"pip2", name:"Pimiento verde", cat:"verdura", kcal:20, p:1, g:0, c:4 },
  { id:"zah1", name:"Zanahoria", cat:"verdura", kcal:41, p:1, g:0, c:10 },
  { id:"col1", name:"Coliflor", cat:"verdura", kcal:25, p:2, g:0, c:5 },
  { id:"ber1", name:"Berenjena", cat:"verdura", kcal:24, p:1, g:0, c:6 },
  { id:"ace1", name:"Acelgas", cat:"verdura", kcal:19, p:2, g:0, c:4 },
  { id:"esp2", name:"Espinacas", cat:"verdura", kcal:23, p:3, g:0, c:4 },
  { id:"pep1", name:"Pepino", cat:"verdura", kcal:15, p:1, g:0, c:4 },
  { id:"col2", name:"Col (repollo)", cat:"verdura", kcal:25, p:1, g:0, c:6 },
  // POSTRE
  { id:"ypos1", name:"Yogur griego 0%", cat:"postre", kcal:57, p:10, g:0, c:4 },
  { id:"ypos2", name:"Yogur griego natural", cat:"postre", kcal:97, p:9, g:5, c:4 },
  { id:"ypos3", name:"Yogur natural azucarado", cat:"postre", kcal:75, p:4, g:3, c:9 },
  { id:"ypos4", name:"Yogur proteico", cat:"postre", kcal:60, p:10, g:0, c:5 },
  { id:"lec1p", name:"Leche entera", cat:"postre", kcal:61, p:3, g:3, c:5 },
  { id:"lec2p", name:"Leche semidesnatada", cat:"postre", kcal:46, p:3, g:2, c:5 },
  { id:"lec3p", name:"Leche desnatada", cat:"postre", kcal:35, p:3, g:0, c:5 },
  { id:"lec4p", name:"Leche de avena", cat:"postre", kcal:43, p:1, g:1, c:7 },
  { id:"lec5p", name:"Leche de almendras sin azúcar", cat:"postre", kcal:13, p:0, g:1, c:0 },
  { id:"cor1p", name:"Cornflakes (copos de maíz)", cat:"postre", kcal:357, p:7, g:1, c:80 },
  { id:"cor2p", name:"Cornflakes chocolate", cat:"postre", kcal:380, p:6, g:3, c:78 },
  { id:"ave1p", name:"Avena en copos", cat:"postre", kcal:370, p:13, g:7, c:63 },
  { id:"gra1p", name:"Granola", cat:"postre", kcal:480, p:10, g:20, c:60 },
  { id:"mie1p", name:"Miel", cat:"postre", kcal:304, p:0, g:0, c:82 },
  { id:"sir1p", name:"Sirope de agave", cat:"postre", kcal:310, p:0, g:0, c:76 },
  { id:"pan1p", name:"Pan de molde integral", cat:"postre", kcal:247, p:9, g:3, c:46 },
  { id:"pan2p", name:"Pan blanco", cat:"postre", kcal:265, p:8, g:3, c:51 },
  { id:"crc1p", name:"Crema de cacahuete", cat:"postre", kcal:588, p:25, g:50, c:20 },
  { id:"crc2p", name:"Crema de almendras", cat:"postre", kcal:614, p:21, g:56, c:19 },
  { id:"choc1p", name:"Chocolate negro 85%", cat:"postre", kcal:600, p:8, g:46, c:34 },
  { id:"nue1p", name:"Nueces", cat:"postre", kcal:654, p:15, g:65, c:14 },
  { id:"alm1p", name:"Almendras", cat:"postre", kcal:579, p:21, g:50, c:22 },
  { id:"ana1p", name:"Anacardos", cat:"postre", kcal:553, p:18, g:44, c:30 },
  { id:"pis1p", name:"Pistachos", cat:"postre", kcal:560, p:20, g:45, c:28 },
  { id:"pla1p", name:"Plátano", cat:"postre", kcal:89, p:1, g:0, c:23 },
  { id:"man1p", name:"Manzana", cat:"postre", kcal:52, p:0, g:0, c:14 },
  { id:"fre1p", name:"Fresas", cat:"postre", kcal:32, p:1, g:0, c:8 },
  { id:"aran1p", name:"Arándanos", cat:"postre", kcal:57, p:1, g:0, c:14 },
  { id:"req1p", name:"Requesón light", cat:"postre", kcal:98, p:11, g:4, c:3 },
  { id:"queq1p", name:"Queso quark 0%", cat:"postre", kcal:60, p:11, g:0, c:4 },
];

const ACTIVITY_LEVELS = [
  { id:"sedentario", label:"Sedentario", desc:"Sin ejercicio", factor:1.2 },
  { id:"ligero", label:"Ligero", desc:"1-2 días/semana", factor:1.375 },
  { id:"moderado", label:"Moderado", desc:"3-5 días/semana", factor:1.55 },
  { id:"activo", label:"Muy activo", desc:"6-7 días/semana", factor:1.725 },
];

const GOALS = [
  { id:"perdida", label:"Pérdida de grasa", emoji:"🔥", kcalOffset:-400, proteinMult:2.2, fatPct:0.25 },
  { id:"mantenimiento", label:"Mantenimiento", emoji:"⚖️", kcalOffset:0, proteinMult:1.8, fatPct:0.28 },
  { id:"ganancia", label:"Ganancia muscular", emoji:"💪", kcalOffset:300, proteinMult:2.0, fatPct:0.28 },
];

const BLOCKS = [
  { id:"hidrato", label:"Hidratos", emoji:"🍚", color:{ border:"#ff9800", accent:"#e65100" } },
  { id:"proteina", label:"Proteínas", emoji:"🥩", color:{ border:"#4caf50", accent:"#2e7d32" } },
  { id:"grasa", label:"Grasas", emoji:"🫒", color:{ border:"#e91e63", accent:"#880e4f" } },
  { id:"verdura", label:"Verduras", emoji:"🥦", color:{ border:"#2196f3", accent:"#0d47a1" } },
];

const POSTRE_BLOCK = { id:"postre", label:"Postre", emoji:"🍯", color:{ border:"#9c27b0", accent:"#6a1b9a" } };

// Catálogo de todas las comidas posibles (se usan según el número elegido)
const ALL_MEALS = [
  { id:"desayuno", label:"Desayuno", emoji:"🌅" },
  { id:"mediamanana", label:"Media mañana", emoji:"🥪" },
  { id:"almuerzo", label:"Almuerzo", emoji:"☀️" },
  { id:"merienda", label:"Merienda", emoji:"🍎" },
  { id:"cena", label:"Cena", emoji:"🌙" },
  { id:"recena", label:"Recena", emoji:"🌃" },
];

// Devuelve las comidas según el número elegido (2 a 6), en orden lógico del día
function getMeals(num) {
  const n = Math.max(2, Math.min(6, num || 3));
  const orders = {
    2: ["desayuno","cena"],
    3: ["desayuno","almuerzo","cena"],
    4: ["desayuno","almuerzo","merienda","cena"],
    5: ["desayuno","mediamanana","almuerzo","merienda","cena"],
    6: ["desayuno","mediamanana","almuerzo","merienda","cena","recena"],
  };
  const ids = orders[n];
  return ids.map(id => ALL_MEALS.find(m => m.id === id));
}

// Reparto por defecto: partes iguales según número de comidas
function getDefaultDist(num) {
  const meals = getMeals(num);
  const base = Math.floor(100 / meals.length);
  const dist = {};
  meals.forEach(m => dist[m.id] = base);
  // ajustar el sobrante en la primera
  const sum = meals.length * base;
  dist[meals[0].id] += 100 - sum;
  return dist;
}

const DEFAULT_NUM_MEALS = 3;
const DEFAULT_MEAL_DIST = { desayuno: 33, almuerzo: 34, cena: 33 };


const MEASURES = [
  { id:"peso", label:"Peso", unit:"kg", emoji:"⚖️", primary:true, tip:"Pésate siempre por la mañana, en ayunas, después de ir al baño y sin ropa. Usa la misma báscula y superficie firme." },
  { id:"pecho", label:"Pecho", unit:"cm", emoji:"💪", tip:"Mide rodeando el pecho a la altura de los pezones, con los brazos relajados y al final de una espiración normal. Cinta paralela al suelo." },
  { id:"brazo", label:"Brazo", unit:"cm", emoji:"💪", tip:"Mide el bíceps en su punto más ancho, con el brazo relajado a un lado del cuerpo (o flexionado si quieres ver el pico). Sé constante con el método." },
  { id:"abdomen", label:"Abdomen", unit:"cm", emoji:"📏", tip:"Mide rodeando justo a la altura del ombligo, con el abdomen relajado al final de una espiración. Mantén la cinta horizontal." },
  { id:"cadera", label:"Cadera", unit:"cm", emoji:"📏", tip:"Mide rodeando la parte más ancha de los glúteos, con los pies juntos. La cinta debe quedar paralela al suelo." },
  { id:"cuadriceps", label:"Cuádriceps", unit:"cm", emoji:"🦵", tip:"Mide el muslo en su punto más ancho, normalmente a unos 15-20 cm por encima de la rodilla. De pie y pierna relajada. Mide siempre la misma pierna." },
];

const DAILY_TIPS = [
  "Bebe un vaso de agua nada más despertar: activa tu metabolismo y mejora la digestión.",
  "Prioriza la proteína en cada comida: te sacia más y protege tu masa muscular.",
  "Duerme 7-8h: el descanso es cuando tu cuerpo realmente se recupera y crece.",
  "Camina al menos 8.000 pasos al día. El movimiento constante quema más que una sesión puntual.",
  "Mastica despacio: tu cerebro tarda 20 min en registrar la saciedad.",
  "No bebas tus calorías. Un refresco puede tener las mismas kcal que un plato entero.",
  "Entrena con sobrecarga progresiva: añade peso o reps poco a poco cada semana.",
  "Las verduras llenan el plato con muy pocas calorías. Úsalas a tu favor.",
  "El déficit calórico manda en la pérdida de grasa, pero la proteína decide si pierdes grasa o músculo.",
  "Prepara tus comidas con antelación: lo que no planificas, lo improvisas mal.",
  "Un mal día no arruina tu progreso. La constancia semanal es lo que cuenta.",
  "El café antes de entrenar mejora el rendimiento y la concentración.",
  "Pésate siempre en las mismas condiciones: mañana, en ayunas y tras ir al baño.",
  "La fuerza es la base: más músculo significa más calorías quemadas en reposo.",
  "No le tengas miedo a los carbohidratos: son tu principal fuente de energía para entrenar.",
  "Estírate y calienta antes de entrenar para prevenir lesiones.",
  "El alcohol frena la quema de grasa y arruina la recuperación. Modéralo.",
  "Come fuentes de grasa saludable: aguacate, frutos secos, aceite de oliva y pescado azul.",
  "La motivación se acaba, la disciplina permanece. Cumple aunque no tengas ganas.",
  "Mide tu progreso con fotos y medidas, no solo con la báscula. El músculo pesa.",
  "Descansa entre 48-72h cada grupo muscular para que se recupere bien.",
  "Si tienes hambre entre horas, tira de proteína y fibra antes que de azúcar.",
  "Tu cuerpo se construye en la cocina y se define en el gimnasio.",
  "Pequeños cambios sostenibles superan a las dietas extremas que no aguantas.",
  "Bebe entre 2 y 3 litros de agua al día; más si entrenas fuerte o hace calor.",
  "Apunta lo que comes: lo que se mide, se mejora.",
  "La fibra te sacia y cuida tu digestión. Apuesta por verdura, fruta y legumbre.",
  "Entrena las piernas: es el grupo muscular que más hormonas de crecimiento libera.",
  "No te saltes el desayuno si eso te lleva a atracarte después.",
  "El ayuno intermitente funciona si te ayuda a comer menos, no por magia.",
  "Cuece o asa en vez de freír: ahorras muchísimas calorías de grasa.",
  "Los días de descanso también construyen músculo. No los desprecies.",
  "Tómate fotos cada 2 semanas: el espejo engaña, las fotos no.",
  "La báscula sube y baja por agua, sal y glucógeno. Mira la tendencia, no el día.",
  "Come despacio y sin pantallas: comerás menos y disfrutarás más.",
  "El huevo entero es una de las proteínas más completas y baratas que existen.",
  "Si entrenas por la mañana, deja la ropa preparada la noche antes.",
  "La constancia imperfecta gana siempre a la perfección que abandonas.",
  "Llena medio plato de verdura, un cuarto de proteína y un cuarto de carbohidrato.",
  "Reduce el azúcar añadido: es el que más fácil te saca del déficit sin enterarte.",
  "Camina después de comer: ayuda a controlar el azúcar en sangre.",
  "Entrena con buena técnica antes de subir peso. La forma es la base.",
  "El estrés crónico sube el cortisol y dificulta perder grasa. Aprende a desconectar.",
  "Dormir poco aumenta el hambre y los antojos al día siguiente.",
  "Planifica una comida libre, no un día libre. La diferencia es enorme.",
  "Las proteínas en polvo son cómodas, pero la comida real siempre es prioridad.",
  "Bebe agua antes de cada comida: ayuda a comer la cantidad justa.",
  "Más repeticiones con buena técnica supera a más peso con mala forma.",
  "El progreso no es lineal. Habrá semanas planas; sigue adelante.",
  "Cocina con especias en vez de salsas: sabor sin calorías de más.",
  "El plátano antes de entrenar te da energía rápida y potasio.",
  "Si te aburres de la dieta, cambia alimentos por otros similares, no la abandones.",
  "Entrena el core: te protege la espalda y mejora todos tus levantamientos.",
  "Un buen calentamiento mejora el rendimiento de toda la sesión.",
  "La avena es un carbohidrato de calidad que te mantiene saciado horas.",
  "No compares tu progreso con el de otros. Compite contigo mismo.",
  "Las legumbres dan proteína vegetal, fibra y energía a muy bajo coste.",
  "Deja el móvil fuera del dormitorio: dormirás mejor y más profundo.",
  "Tener hambre puntual no es malo. No tienes que picar a todas horas.",
  "El pescado azul (salmón, sardina, caballa) cuida tu corazón y tus articulaciones.",
  "Entrena aunque sea 20 minutos: hecho es mejor que perfecto.",
  "El agua con gas y limón puede calmar las ganas de refresco.",
  "Cambia el ascensor por las escaleras siempre que puedas.",
  "La cafeína en exceso por la tarde te roba sueño por la noche.",
  "Prepara tuppers el domingo: tu yo de entre semana te lo agradecerá.",
  "Come fruta entera en vez de zumo: más fibra y menos azúcar de golpe.",
  "Respeta tus horas de sueño igual que respetas tus entrenos.",
  "El descanso entre series importa: ajusta según tu objetivo de fuerza o resistencia.",
  "Una buena postura todo el día también es entrenamiento para tu espalda.",
  "Cuando comas fuera, decide el plato antes de tener hambre extrema.",
  "El yogur griego natural es una bomba de proteína para postres y desayunos.",
  "No elimines grupos de alimentos sin motivo: el equilibrio es más sostenible.",
  "Empieza el plato por la verdura y la proteína; los hidratos al final.",
  "Beber suficiente agua mejora tu fuerza y tu concentración en el gym.",
  "Si fallas una comida, la siguiente vuelve al plan. No tires la toalla.",
  "Las nueces y almendras sacian, pero son calóricas: controla la cantidad.",
  "Trabaja tanto los músculos que ves como los que no (espalda, glúteo, femoral).",
  "El boniato es una gran alternativa a la patata, con más fibra.",
  "Dormir bien regula las hormonas del hambre (leptina y grelina).",
  "Tu primera serie debe costarte poco; reserva el esfuerzo para las últimas.",
  "Un puñado de frutos secos es mejor snack que cualquier ultraprocesado.",
  "Define tu porqué: cuando sepas para qué lo haces, cuesta menos cumplir.",
  "La proteína también ayuda a recuperar mejor tras el entrenamiento.",
  "Cocina de más a propósito: tienes la siguiente comida lista sin esfuerzo.",
  "Reduce ultraprocesados: cuanto más natural el alimento, mejor.",
  "Estira al acabar de entrenar para mejorar tu movilidad a largo plazo.",
  "Bebe agua durante el entrenamiento, no solo al terminar.",
  "El arroz y la pasta integrales sacian más por su fibra.",
  "Acuéstate y levántate a la misma hora, también el fin de semana.",
  "La verdura congelada conserva sus nutrientes y te salva en días sin tiempo.",
  "No te peses cada día si te obsesiona. Una o dos veces por semana basta.",
  "Comer proteína en el desayuno reduce los antojos del resto del día.",
  "Aprende a leer etiquetas: mira las kcal y los azúcares por 100g.",
  "Entrenar con un compañero aumenta tu constancia y tu intensidad.",
  "El cuerpo se adapta: cambia tu rutina cada 6-8 semanas para seguir progresando.",
  "La sal esconde calorías líquidas: retiene agua y altera la báscula.",
  "Si vas a picar, ten siempre opciones sanas a mano y las malas lejos.",
  "Calienta las articulaciones antes de cargar peso, sobre todo hombros y rodillas.",
  "El pollo, el pavo y el pescado blanco son proteínas magras ideales en déficit.",
  "Respira profundo entre series: oxigenas el músculo y rindes mejor.",
  "Tener un objetivo claro y medible te mantiene enfocado.",
  "La constancia de meses pesa más que la intensidad de un solo día.",
  "Un batido de proteína con fruta es un buen recuperador post-entreno.",
  "No castigues una comida copiosa saltándote la siguiente. Solo retoma el plan.",
  "El té verde aporta antioxidantes y un pequeño extra de energía.",
  "Entrena con rango completo de movimiento para ganar fuerza real.",
  "Comer suficiente proteína protege tu músculo cuando pierdes peso.",
  "Apaga pantallas una hora antes de dormir: tu descanso lo notará.",
  "La cantidad importa: incluso lo sano engorda si te pasas de calorías.",
  "Si no tienes tiempo de cocinar, ten básicos sanos congelados y en conserva.",
  "Las claras de huevo son proteína casi pura, sin apenas grasa.",
  "El progreso del espejo es lento pero real. Ten paciencia.",
  "Caminar en ayunas no quema más grasa por arte de magia: lo que cuenta es el total.",
  "El queso fresco batido y el requesón son grandes aliados proteicos.",
  "Entrena la respiración y la postura: pequeños detalles, grandes resultados.",
  "Hidrátate bien: la deshidratación se confunde a menudo con hambre.",
  "Si comes fuera, pide salsas aparte y prioriza plancha o horno.",
  "Tu peso fluctúa hasta 1-2 kg en un día. No te asustes, mira la media semanal.",
  "El descanso activo (paseo, estiramientos) ayuda a recuperar mejor.",
  "Cuanto más coloridos tus platos de verdura, más variedad de nutrientes.",
  "La fuerza que ganas hoy es el músculo que defines mañana.",
  "Come consciente: pregúntate si tienes hambre real o solo aburrimiento.",
  "El aceite de oliva es grasa sana, pero muy calórico: mídelo con cuchara.",
  "Cumplir tu plan el 90% del tiempo ya te da resultados excelentes.",
  "La motivación te arranca, el hábito te mantiene.",
  "Varía tus fuentes de proteína para no aburrirte: carne, pescado, huevo, lácteos.",
  "Dormir mal una noche no arruina nada; dormir mal siempre, sí.",
  "Entrena hoy pensando en cómo quieres verte y sentirte en 6 meses.",
  "Los lácteos desnatados te dan proteína y calcio con menos grasa.",
  "Bebe agua en lugar de zumos azucarados: ahorras calorías sin esfuerzo.",
  "Registrar tus comidas unos días te abre los ojos sobre lo que comes de verdad.",
  "El descanso es parte del entreno, no lo contrario.",
  "Si tu objetivo es ganar músculo, necesitas comer un poco por encima de mantenimiento.",
  "Cada entrenamiento cuenta, aunque no sea tu mejor día.",
  "La proteína vegetal también suma: tofu, soja, legumbres y seitán.",
  "No te fíes de los productos light: a veces tienen más azúcar que el normal.",
  "Cuida tus rodillas y espalda con técnica; la salud va antes que el ego.",
  "Comer despacio y sentado te ayuda a no comer de más.",
  "Sé paciente: perder medio kilo de grasa real a la semana ya es un gran ritmo.",
  "La cena no engorda más por ser de noche; lo que cuenta son las calorías del día.",
  "Un buen plan de comidas reduce la tentación de improvisar mal.",
  "Mueve el cuerpo cada día aunque no toque gym: la actividad diaria suma mucho.",
  "Si entrenas duro, mereces dormir bien. Prioriza tu descanso.",
  "Confía en el proceso: los resultados llegan a quien es constante.",
];

function getRandomTip() {
  return DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
}

// Clasifica un alimento según el macro que más calorías aporta
function classifyFood({ p, g, c }) {
  const kcalP = (p||0) * 4;   // proteína: 4 kcal/g
  const kcalG = (g||0) * 9;   // grasa: 9 kcal/g
  const kcalC = (c||0) * 4;   // hidratos: 4 kcal/g
  const max = Math.max(kcalP, kcalG, kcalC);
  if (max === 0) return "verdura"; // sin macros relevantes
  if (max === kcalP) return "proteina";
  if (max === kcalG) return "grasa";
  return "hidrato";
}

function calcMacros(u) {
  const bmr = u.sex === "hombre"
    ? 10*u.weight + 6.25*u.height - 5*u.age + 5
    : 10*u.weight + 6.25*u.height - 5*u.age - 161;
  const act = ACTIVITY_LEVELS.find(a => a.id === u.activity)?.factor || 1.2;
  const goal = GOALS.find(g => g.id === u.goal);
  const tdee = Math.round(bmr * act);
  const targetKcal = Math.round(tdee + goal.kcalOffset);
  const protein = Math.round(u.weight * goal.proteinMult);
  const fat = Math.round((targetKcal * goal.fatPct) / 9);
  const carbs = Math.round((targetKcal - protein*4 - fat*9) / 4);
  return { tdee, targetKcal, protein, fat, carbs };
}

// ── FECHAS ────────────────────────────────────────────────────────────────────
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function formatDateLong(d) {
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}
function formatDateShort(d) {
  return `${d.getDate()}/${d.getMonth()+1}`;
}
function isSameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function addDays(d, n) { const nd = new Date(d); nd.setDate(nd.getDate()+n); return nd; }
function parseKey(k) { const [y,m,d] = k.split("-").map(Number); return new Date(y,m-1,d); }

function equalPct(ids) {
  if (!ids.length) return {};
  const pct = {};
  ids.forEach(id => pct[id] = Math.round(100 / ids.length));
  const sum = Object.values(pct).reduce((s,v)=>s+v,0);
  pct[ids[ids.length-1]] += 100 - sum;
  return pct;
}

function emptyMeal(withPostre) {
  const cats = withPostre ? ["hidrato","proteina","grasa","verdura","postre"] : ["hidrato","proteina","grasa","verdura"];
  const mk = (v) => { const o={}; cats.forEach(c=>o[c]=v()); return o; };
  return {
    foods: mk(()=>[]),
    selected: mk(()=>[]),
    pct: mk(()=>({})),
    splitMode: mk(()=>"igual"),
  };
}

function initMealState(num) {
  const meals = getMeals(num);
  const state = {};
  meals.forEach((m, idx) => {
    // El postre va en la última comida del día
    const isLast = idx === meals.length - 1;
    state[m.id] = emptyMeal(isLast);
  });
  return state;
}

// ── LOGROS ──────────────────────────────────────────────────────────────────
// Calcula racha de días consecutivos con registro (peso o nutrición)
function calcStreak(datesSet, today) {
  let streak = 0;
  let d = new Date(today);
  // Si hoy no está registrado, empezamos a contar desde ayer
  if (!datesSet.has(dateKey(d))) d = addDays(d, -1);
  while (datesSet.has(dateKey(d))) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}

// Genera lista de logros de peso según días totales registrados
function getWeightAchievements(totalDays) {
  const list = [];
  // Semanales (1-4 semanas)
  for (let w = 1; w <= 4; w++) {
    list.push({
      id:`peso_sem_${w}`, tier:"semanal", num:w,
      title:`Control semanal ${w}`,
      desc:`${w*7} días de peso registrados`,
      threshold: w*7, emoji:"📅",
      unlocked: totalDays >= w*7,
    });
  }
  // Mensuales (1-12)
  for (let m = 1; m <= 12; m++) {
    list.push({
      id:`peso_mes_${m}`, tier:"mensual", num:m,
      title:`Control mensual ${m}`,
      desc:`${m} ${m===1?"mes":"meses"} de constancia`,
      threshold: 28 + m*30, emoji:"🗓️",
      unlocked: totalDays >= (28 + m*30),
    });
  }
  // Anual
  list.push({
    id:"peso_anual_1", tier:"anual", num:1,
    title:"Control anual", desc:"1 año de seguimiento de peso",
    threshold: 365, emoji:"🏆",
    unlocked: totalDays >= 365,
  });
  return list;
}

function getNutritionAchievements(totalDays) {
  const list = [];
  for (let w = 1; w <= 4; w++) {
    list.push({
      id:`nut_sem_${w}`, tier:"semanal", num:w,
      title:`Nutrición semanal ${w}`,
      desc:`${w*7} días cumpliendo tu dieta`,
      threshold: w*7, emoji:"🥗",
      unlocked: totalDays >= w*7,
    });
  }
  for (let m = 1; m <= 12; m++) {
    list.push({
      id:`nut_mes_${m}`, tier:"mensual", num:m,
      title:`Nutrición mensual ${m}`,
      desc:`${m} ${m===1?"mes":"meses"} alimentándote bien`,
      threshold: 28 + m*30, emoji:"🍎",
      unlocked: totalDays >= (28 + m*30),
    });
  }
  list.push({
    id:"nut_anual_1", tier:"anual", num:1,
    title:"Nutrición anual", desc:"1 año cuidando tu alimentación",
    threshold: 365, emoji:"👑",
    unlocked: totalDays >= 365,
  });
  return list;
}

// Logros especiales (rachas)
function getStreakAchievements(maxStreak) {
  return [
    { id:"streak_3", title:"En marcha", desc:"3 días seguidos", threshold:3, emoji:"🔥", unlocked:maxStreak>=3 },
    { id:"streak_7", title:"Imparable", desc:"7 días seguidos", threshold:7, emoji:"⚡", unlocked:maxStreak>=7 },
    { id:"streak_15", title:"Disciplina", desc:"15 días seguidos", threshold:15, emoji:"💎", unlocked:maxStreak>=15 },
    { id:"streak_30", title:"Máquina", desc:"30 días seguidos", threshold:30, emoji:"🚀", unlocked:maxStreak>=30 },
    { id:"streak_100", title:"Leyenda", desc:"100 días seguidos", threshold:100, emoji:"🏅", unlocked:maxStreak>=100 },
  ];
}



// ── STORAGE HOOK ──────────────────────────────────────────────────────────────
function useLS(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const set = useCallback(v => { setVal(prev => {
    const nv = typeof v === "function" ? v(prev) : v;
    try { localStorage.setItem(key, JSON.stringify(nv)); } catch {}
    return nv;
  }); }, [key]);
  return [val, set];
}

// ── COMPONENTES BÁSICOS ───────────────────────────────────────────────────────
function MacroCircle({ label, value, target, color }) {
  const pct = Math.min(100, target > 0 ? (value/target)*100 : 0);
  const r = 24; const circ = 2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={58} height={58}>
        <circle cx={29} cy={29} r={r} fill="none" stroke="#1e1e28" strokeWidth={5} />
        <circle cx={29} cy={29} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 29 29)" style={{ transition:"stroke-dasharray 0.4s" }} />
        <text x={29} y={33} textAnchor="middle" fontSize={10} fontWeight={800} fill={color}>{Math.round(value)}g</text>
      </svg>
      <span style={{ fontSize:10, color:"#666", textAlign:"center" }}>{label}<br/><span style={{ color:"#444" }}>/{target}g</span></span>
    </div>
  );
}

// Gráfica de líneas simple SVG
function LineChart({ data, color = "#4caf50", height = 160, unit = "kg", goal }) {
  if (!data || data.length === 0) {
    return <div style={{ height, display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:13 }}>Sin datos aún</div>;
  }
  if (data.length === 1) {
    return (
      <div style={{ height, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
        <div style={{ fontSize:36, fontWeight:900, color }}>{data[0].value}<span style={{ fontSize:16, color:"#666" }}>{unit}</span></div>
        <div style={{ color:"#555", fontSize:12 }}>Registra más días para ver tu evolución</div>
      </div>
    );
  }

  const W = 320, H = height, pad = 30;
  const values = data.map(d => d.value);
  let min = Math.min(...values), max = Math.max(...values);
  if (goal !== undefined) { min = Math.min(min, goal); max = Math.max(max, goal); }
  const range = max - min || 1;
  const padding = range * 0.15;
  min -= padding; max += padding;
  const xStep = (W - pad*2) / (data.length - 1);
  const yScale = v => H - pad - ((v - min) / (max - min)) * (H - pad*2);
  const points = data.map((d, i) => ({ x: pad + i*xStep, y: yScale(d.value), ...d }));
  const path = points.map((p, i) => `${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${path} L ${points[points.length-1].x} ${H-pad} L ${pad} ${H-pad} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {goal !== undefined && (
        <line x1={pad} y1={yScale(goal)} x2={W-pad} y2={yScale(goal)} stroke="#ffd54f" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      )}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#0f0f14" strokeWidth="2" />
          {(i === 0 || i === points.length-1 || data.length <= 7) && (
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill="#999" fontWeight="700">{p.value}</text>
          )}
          {(i === 0 || i === points.length-1) && (
            <text x={p.x} y={H-pad+16} textAnchor="middle" fontSize="8" fill="#555">{p.label}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPLASH
// ═══════════════════════════════════════════════════════════════════════════
function SplashScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at center, #14160F 0%, #0A0B07 70%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", animation:"splashFade 0.5s ease", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap');
        @keyframes splashFade { from { opacity:0; } to { opacity:1; } }
        @keyframes markDraw { 0% { opacity:0; transform:scale(0.6) rotate(-12deg); } 60% { opacity:1; transform:scale(1.08) rotate(0deg); } 100% { opacity:1; transform:scale(1) rotate(0deg); } }
        @keyframes textRise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes lineGrow { from { width:0; opacity:0; } to { width:180px; opacity:1; } }
        @keyframes glowPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.9; } }
      `}</style>
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(168,255,96,0.12) 0%, transparent 70%)", animation:"glowPulse 2.5s ease infinite" }} />
      <div style={{ animation:"markDraw 0.9s cubic-bezier(0.34,1.56,0.64,1)", marginBottom:28, zIndex:2 }}>
        <svg width="96" height="96" viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="smGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#C6FF4D" />
              <stop offset="100%" stopColor="#5FBF00" />
            </linearGradient>
          </defs>
          {/* Círculo limpio */}
          <circle cx="50" cy="50" r="44" stroke="url(#smGrad)" strokeWidth="3.5" fill="rgba(168,255,61,0.05)" />
          {/* S simple y elegante */}
          <path d="M64 34 C64 28 57 26 50 26 C42 26 36 30 36 37 C36 44 43 46 50 48 C57 50 64 52 64 60 C64 68 57 72 50 72 C42 72 35 69 35 63"
            stroke="url(#smGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div style={{ textAlign:"center", zIndex:2 }}>
        <div style={{ animation:"textRise 0.7s ease 0.3s both", fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:42, color:"#F5F7F0", letterSpacing:6, lineHeight:1 }}>SMINK</div>
        <div style={{ animation:"textRise 0.7s ease 0.5s both", fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:15, letterSpacing:14, marginTop:8, marginLeft:14, color:"#A8FF60" }}>DIET</div>
        <div style={{ height:2, background:"linear-gradient(90deg, transparent, #A8FF60, transparent)", borderRadius:2, margin:"22px auto 0", animation:"lineGrow 1s ease 0.7s both" }} />
      </div>
      <div style={{ position:"absolute", bottom:46, color:"#4A5240", fontSize:11, letterSpacing:4, textTransform:"uppercase", fontWeight:600, zIndex:2, animation:"textRise 0.7s ease 0.9s both" }}>Nutrición inteligente</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFIL
// ═══════════════════════════════════════════════════════════════════════════
function ProfileScreen({ initial, onSave }) {
  const [form, setForm] = useState(initial ? { numMeals:3, ...initial } : { name:"", weight:"", height:"", age:"", sex:"", activity:"", goal:"", numMeals:3 });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const valid = Object.values(form).every(v => v !== "");
  const inp = { width:"100%", padding:"12px 14px", borderRadius:12, border:"2px solid #2a2a3a", background:"#1a1a24", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"block" };

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", padding:"30px 18px 60px" }}>
      <div style={{ fontWeight:900, fontSize:28, color:"white", marginBottom:4 }}>🍽️ Tu perfil</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:28 }}>Introduce tus datos para calcular tus macros personalizados</div>

      <div style={{ marginBottom:14 }}><label style={lbl}>Nombre</label><input style={inp} type="text" placeholder="Tu nombre" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <div><label style={lbl}>Peso (kg)</label><input style={inp} type="number" placeholder="75" value={form.weight} onChange={e=>set("weight",e.target.value)} /></div>
        <div><label style={lbl}>Altura (cm)</label><input style={inp} type="number" placeholder="175" value={form.height} onChange={e=>set("height",e.target.value)} /></div>
      </div>
      <div style={{ marginBottom:14 }}><label style={lbl}>Edad</label><input style={inp} type="number" placeholder="25" value={form.age} onChange={e=>set("age",e.target.value)} /></div>

      <div style={{ marginBottom:14 }}>
        <label style={lbl}>Sexo</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {["hombre","mujer"].map(s => (
            <button key={s} onClick={()=>set("sex",s)} style={{ padding:"12px", borderRadius:12, border:`2px solid ${form.sex===s?"#4caf50":"#2a2a3a"}`, background:form.sex===s?"#1a3a1a":"#1a1a24", color:form.sex===s?"#4caf50":"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>{s==="hombre"?"👨 Hombre":"👩 Mujer"}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:14 }}>
        <label style={lbl}>Actividad física</label>
        {ACTIVITY_LEVELS.map(a => (
          <button key={a.id} onClick={()=>set("activity",a.id)} style={{ width:"100%", marginBottom:8, padding:"12px 14px", borderRadius:12, border:`2px solid ${form.activity===a.id?"#ff9800":"#2a2a3a"}`, background:form.activity===a.id?"#1e1400":"#1a1a24", color:"white", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:700, color:form.activity===a.id?"#ff9800":"#ccc" }}>{a.label}</span>
            <span style={{ fontSize:12, color:"#666" }}>{a.desc}</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom:28 }}>
        <label style={lbl}>Objetivo</label>
        {GOALS.map(g => (
          <button key={g.id} onClick={()=>set("goal",g.id)} style={{ width:"100%", marginBottom:8, padding:"14px", borderRadius:12, border:`2px solid ${form.goal===g.id?"#e91e63":"#2a2a3a"}`, background:form.goal===g.id?"#1a0010":"#1a1a24", color:form.goal===g.id?"#e91e63":"#ccc", cursor:"pointer", textAlign:"left", fontWeight:800, fontSize:15 }}>{g.emoji} {g.label}</button>
        ))}
      </div>

      <div style={{ marginBottom:28 }}>
        <label style={lbl}>Número de comidas al día</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8 }}>
          {[2,3,4,5,6].map(n => (
            <button key={n} onClick={()=>set("numMeals",n)} style={{ padding:"14px 0", borderRadius:12, border:`2px solid ${form.numMeals===n?"#4caf50":"#2a2a3a"}`, background:form.numMeals===n?"#1a3a1a":"#1a1a24", color:form.numMeals===n?"#4caf50":"#888", fontWeight:900, fontSize:18, cursor:"pointer" }}>{n}</button>
          ))}
        </div>
        <div style={{ color:"#666", fontSize:11.5, marginTop:8, lineHeight:1.4 }}>
          {getMeals(form.numMeals).map(m=>m.label).join(" · ")}
        </div>
      </div>

      <button onClick={()=>valid&&onSave(form)} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:valid?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:valid?"white":"#555", fontWeight:900, fontSize:16, cursor:valid?"pointer":"default" }}>{valid?"Guardar y continuar →":"Rellena todos los campos"}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BUSCADOR DE ALIMENTOS
// ═══════════════════════════════════════════════════════════════════════════
function SearchScreen({ block, existingIds, customFoods, onAdd, onCreateFood, onDeleteFood, onUpdateFoodCat, onBack }) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [nf, setNf] = useState({ name:"", kcal:"", p:"", g:"", c:"" });

  // Alimentos propios de esta categoría
  const myFoods = (customFoods||[]).filter(f => f.cat === block.id);
  const all = [...FOOD_DB.filter(f => f.cat === block.id), ...myFoods];
  const results = query.length < 2 ? all : all.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  // Previsualización de categoría automática mientras crea
  const previewCat = (nf.p||nf.g||nf.c) ? classifyFood({ p:parseFloat(nf.p)||0, g:parseFloat(nf.g)||0, c:parseFloat(nf.c)||0 }) : null;
  const previewBlock = previewCat ? [...BLOCKS, POSTRE_BLOCK].find(b=>b.id===previewCat) : null;
  const canCreate = nf.name.trim() && nf.kcal && (nf.p!==""||nf.g!==""||nf.c!=="");

  const inp = { width:"100%", padding:"11px 12px", borderRadius:10, border:"2px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:11, color:"#888", fontWeight:700, marginBottom:5, display:"block" };

  if (creating) {
    return (
      <div style={{ minHeight:"100vh", background:"#0f0f14", paddingBottom:60 }}>
        <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid #1e1e28" }}>
          <button onClick={()=>setCreating(false)} style={{ display:"flex", alignItems:"center", gap:10, background:"#1a1a24", border:"2px solid #4caf50", borderRadius:14, padding:"14px 20px", cursor:"pointer", color:"#4caf50", fontWeight:800, fontSize:16, width:"100%", marginBottom:16 }}>← Volver</button>
          <div style={{ fontWeight:800, fontSize:18, color:"white" }}>➕ Crear alimento</div>
          <div style={{ color:"#666", fontSize:12, marginTop:4 }}>Copia los valores de la etiqueta (por 100g)</div>
        </div>
        <div style={{ padding:"16px" }}>
          <div style={{ marginBottom:14 }}><label style={lbl}>Nombre del producto</label><input style={inp} value={nf.name} onChange={e=>setNf({...nf,name:e.target.value})} placeholder="Ej: Atún Calvo en aceite" /></div>
          <div style={{ marginBottom:14 }}><label style={lbl}>Calorías (kcal por 100g)</label><input style={inp} type="number" inputMode="decimal" value={nf.kcal} onChange={e=>setNf({...nf,kcal:e.target.value})} placeholder="Ej: 200" /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
            <div><label style={lbl}>Proteína (g)</label><input style={inp} type="number" inputMode="decimal" value={nf.p} onChange={e=>setNf({...nf,p:e.target.value})} placeholder="0" /></div>
            <div><label style={lbl}>Grasa (g)</label><input style={inp} type="number" inputMode="decimal" value={nf.g} onChange={e=>setNf({...nf,g:e.target.value})} placeholder="0" /></div>
            <div><label style={lbl}>Hidratos (g)</label><input style={inp} type="number" inputMode="decimal" value={nf.c} onChange={e=>setNf({...nf,c:e.target.value})} placeholder="0" /></div>
          </div>
          {previewBlock && (
            <div style={{ background:"#15201a", border:`1px solid ${previewBlock.color.border}`, borderRadius:12, padding:"12px 14px", marginBottom:18 }}>
              <div style={{ color:"#888", fontSize:11, marginBottom:3 }}>Se clasificará automáticamente como:</div>
              <div style={{ color:previewBlock.color.border, fontWeight:800, fontSize:15 }}>{previewBlock.emoji} {previewBlock.label}</div>
              <div style={{ color:"#666", fontSize:11, marginTop:4 }}>Podrás cambiarlo después si quieres</div>
            </div>
          )}
          <button onClick={()=>{
            if(!canCreate) return;
            const cat = classifyFood({ p:parseFloat(nf.p)||0, g:parseFloat(nf.g)||0, c:parseFloat(nf.c)||0 });
            const food = { id:"custom_"+Date.now(), name:nf.name.trim(), kcal:Math.round(parseFloat(nf.kcal))||0, p:parseFloat(nf.p)||0, g:parseFloat(nf.g)||0, c:parseFloat(nf.c)||0, cat, custom:true };
            onCreateFood(food);
            setNf({ name:"", kcal:"", p:"", g:"", c:"" });
            setCreating(false);
          }} style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:canCreate?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:canCreate?"white":"#555", fontWeight:900, fontSize:15, cursor:canCreate?"pointer":"default" }}>{canCreate?"Crear alimento":"Rellena nombre, kcal y macros"}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", paddingBottom:60 }}>
      <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid #1e1e28" }}>
        <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:10, background:"#1a1a24", border:`2px solid ${block.color.border}`, borderRadius:14, padding:"14px 20px", cursor:"pointer", color:block.color.border, fontWeight:800, fontSize:16, width:"100%", marginBottom:16 }}>← Volver</button>
        <div style={{ fontWeight:800, fontSize:18, color:"white", marginBottom:12 }}>{block.emoji} Añadir {block.label}</div>
        <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Filtrar ${block.label.toLowerCase()}...`} style={{ width:"100%", padding:"14px", borderRadius:12, border:`2px solid ${block.color.border}`, background:"#1a1a24", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" }} />
      </div>
      <div style={{ padding:"12px 16px" }}>
        <button onClick={()=>setCreating(true)} style={{ width:"100%", background:"transparent", border:"2px dashed #4caf50", borderRadius:12, padding:"14px", marginBottom:14, cursor:"pointer", color:"#4caf50", fontWeight:800, fontSize:14 }}>➕ Crear alimento nuevo</button>
        {results.map(item => {
          const already = existingIds.includes(item.id);
          const isCustom = item.custom;
          return (
            <div key={item.id} style={{ width:"100%", background:already?"#1e2a1e":"#1a1a24", border:`1px solid ${already?block.color.border:"#2a2a3a"}`, borderRadius:12, padding:"12px 14px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", opacity:already?0.7:1 }}>
              <button onClick={()=>{ if(!already){ onAdd(item); onBack(); } }} style={{ flex:1, minWidth:0, marginRight:10, background:"none", border:"none", textAlign:"left", cursor:already?"default":"pointer", padding:0 }}>
                <div style={{ color:"white", fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:6 }}>{item.name} {isCustom && <span style={{ fontSize:9, background:"#2e7d32", color:"white", borderRadius:6, padding:"1px 6px", fontWeight:700, letterSpacing:0.5 }}>PERSONALIZADO</span>}</div>
                <div style={{ color:"#888", fontSize:11, marginTop:3 }}>P:{item.p}g · HC:{item.c}g · G:{item.g}g por 100g</div>
              </button>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <div style={{ background:block.color.accent, color:"white", borderRadius:20, padding:"4px 10px", fontSize:12, fontWeight:800 }}>{item.kcal} kcal</div>
                {already && <span style={{ fontSize:10, color:block.color.border }}>✓ Añadido</span>}
                {isCustom && !already && <button onClick={()=>onDeleteFood(item.id)} style={{ background:"none", border:"none", color:"#a44", fontSize:11, cursor:"pointer", padding:0 }}>🗑 Borrar</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL REPARTO
// ═══════════════════════════════════════════════════════════════════════════
function MealDistModal({ dist, meals, numMeals, onChange, onClose }) {
  const handleChange = (mealId, newPct) => {
    const others = meals.filter(m => m.id !== mealId);
    const remaining = 100 - newPct;
    const total = others.reduce((s,m) => s + dist[m.id], 0);
    const updated = { [mealId]: newPct };
    others.forEach(m => { updated[m.id] = total > 0 ? Math.round((dist[m.id]/total)*remaining) : Math.round(remaining/others.length); });
    const sum = Object.values(updated).reduce((s,v)=>s+v,0);
    if (sum !== 100) updated[others[others.length-1].id] += 100 - sum;
    onChange(updated);
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a24", borderTopLeftRadius:24, borderTopRightRadius:24, padding:"24px 20px 32px", width:"100%", maxWidth:500, maxHeight:"80vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontWeight:900, fontSize:18, color:"white" }}>📊 Reparto de calorías</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#666", fontSize:22, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ color:"#666", fontSize:12, marginBottom:20 }}>Ajusta cuántas kcal van a cada comida</div>
        {meals.map(m => (
          <div key={m.id} style={{ marginBottom:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:"#ccc", fontWeight:700, fontSize:14 }}>{m.emoji} {m.label}</span>
              <span style={{ color:"#4caf50", fontWeight:900, fontSize:16 }}>{dist[m.id]}%</span>
            </div>
            <input type="range" min={5} max={70} value={dist[m.id]||0} onChange={e=>handleChange(m.id, parseInt(e.target.value))} style={{ width:"100%", accentColor:"#4caf50" }} />
          </div>
        ))}
        <button onClick={()=>onChange(getDefaultDist(numMeals))} style={{ width:"100%", padding:"12px", marginTop:8, marginBottom:8, borderRadius:12, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontSize:13, fontWeight:600, cursor:"pointer" }}>↺ Repartir por igual</button>
        <button onClick={onClose} style={{ width:"100%", padding:"14px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontSize:15, fontWeight:800, cursor:"pointer" }}>Listo</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: NUTRICIÓN
// ═══════════════════════════════════════════════════════════════════════════
function NutritionTab({ macros, numMeals, history, setHistory, mealDist, setMealDist, currentDate, setCurrentDate, customFoods, onCreateFood, onDeleteFood, onGoProfile }) {
  const mealList = getMeals(numMeals);
  const lastMealId = mealList[mealList.length - 1].id;
  const [searching, setSearching] = useState(null);
  const [activeTab, setActiveTab] = useState(mealList[0].id);
  const [showDistModal, setShowDistModal] = useState(false);
  const [showMealInfo, setShowMealInfo] = useState(false);

  const dKey = dateKey(currentDate);
  const meals = history[dKey] || initMealState(numMeals);
  const today = new Date();
  const isToday = isSameDay(currentDate, today);

  // Si la pestaña activa ya no existe (cambió el nº de comidas), volver a la primera
  if (!mealList.find(m => m.id === activeTab)) {
    // se corrige en render: usamos la primera
  }
  const safeActiveTab = mealList.find(m => m.id === activeTab) ? activeTab : mealList[0].id;

  const setMeals = (newMeals) => setHistory(h => ({ ...h, [dKey]: typeof newMeals === "function" ? newMeals(h[dKey] || initMealState(numMeals)) : newMeals }));
  const updateMeal = (mealId, updater) => setMeals(prev => ({ ...prev, [mealId]: updater(prev[mealId] || emptyMeal(mealId===lastMealId)) }));
  const addFood = (mealId, blockId, food) => updateMeal(mealId, m => ({ ...m, foods:{...m.foods,[blockId]:[...(m.foods[blockId]||[]).filter(f=>f.id!==food.id),food]} }));
  const removeFood = (mealId, blockId, foodId) => updateMeal(mealId, m => {
    const nf = (m.foods[blockId]||[]).filter(f=>f.id!==foodId);
    const ns = (m.selected[blockId]||[]).filter(id=>id!==foodId);
    return { ...m, foods:{...m.foods,[blockId]:nf}, selected:{...m.selected,[blockId]:ns}, pct:{...m.pct,[blockId]:equalPct(ns)} };
  });
  const toggleSelect = (mealId, blockId, foodId) => updateMeal(mealId, m => {
    const cur = m.selected[blockId]||[];
    const next = cur.includes(foodId) ? cur.filter(id=>id!==foodId) : [...cur, foodId];
    return { ...m, selected:{...m.selected,[blockId]:next}, pct:{...m.pct,[blockId]:equalPct(next)} };
  });
  const updatePct = (mealId, blockId, items) => { const pct = {}; items.forEach(i=>pct[i.id]=i.pct); updateMeal(mealId, m => ({ ...m, pct:{...m.pct,[blockId]:pct} })); };
  const setSplitMode = (mealId, blockId, mode) => updateMeal(mealId, m => {
    const nm = { ...m, splitMode:{...m.splitMode,[blockId]:mode} };
    if (mode==="igual") nm.pct = {...m.pct,[blockId]:equalPct(m.selected[blockId]||[])};
    return nm;
  });

  const hasPostre = ((meals[lastMealId]?.selected?.postre) || []).length > 0;
  const getMealKcal = (mealId) => macros.targetKcal * ((mealDist[mealId]||0)/100);

  const calcMealTotals = (mealId) => {
    const md = history[dKey]?.[mealId] || emptyMeal(mealId===lastMealId);
    const mealKcal = getMealKcal(mealId);
    const blocksToUse = mealId===lastMealId && ((md.selected.postre)||[]).length>0 ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
    let kcal=0,p=0,g=0,c=0;
    blocksToUse.forEach(block => {
      const selIds = md.selected[block.id] || [];
      selIds.forEach(id => {
        const food = (md.foods[block.id]||[]).find(f=>f.id===id);
        if (!food||!food.kcal) return;
        const pct = (md.pct[block.id]?.[id] || Math.round(100/selIds.length))/100;
        const kcalT = (mealKcal/blocksToUse.length)*pct;
        const gr = (kcalT/food.kcal)*100;
        kcal+=(food.kcal*gr)/100; p+=(food.p*gr)/100; g+=(food.g*gr)/100; c+=(food.c*gr)/100;
      });
    });
    return { kcal:Math.round(kcal), p:Math.round(p), g:Math.round(g), c:Math.round(c) };
  };

  const totals = {};
  mealList.forEach(m => { totals[m.id] = calcMealTotals(m.id); });
  const overallKcal = mealList.reduce((s,m)=>s+totals[m.id].kcal,0);
  const overallP = mealList.reduce((s,m)=>s+totals[m.id].p,0);
  const overallG = mealList.reduce((s,m)=>s+totals[m.id].g,0);
  const overallC = mealList.reduce((s,m)=>s+totals[m.id].c,0);
  const barColor = Math.abs(overallKcal-macros.targetKcal)<150?"#4caf50":Math.abs(overallKcal-macros.targetKcal)<300?"#ff9800":"#f44336";

  if (searching) {
    const block = searching.blockId==="postre" ? POSTRE_BLOCK : BLOCKS.find(b=>b.id===searching.blockId);
    const existingIds = ((meals[searching.mealId]?.foods[searching.blockId])||[]).map(f=>f.id);
    return <SearchScreen block={block} existingIds={existingIds} customFoods={customFoods}
      onAdd={food=>addFood(searching.mealId,searching.blockId,food)}
      onCreateFood={onCreateFood} onDeleteFood={onDeleteFood}
      onBack={()=>setSearching(null)} />;
  }

  const activeBlocks = safeActiveTab===lastMealId ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;

  return (
    <div style={{ paddingBottom:20 }}>
      {showDistModal && <MealDistModal dist={mealDist} meals={mealList} numMeals={numMeals} onChange={setMealDist} onClose={()=>setShowDistModal(false)} />}

      <div style={{ background:"#0f0f14", padding:"16px 18px 14px", borderBottom:"1px solid #1e1e28" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontWeight:900, fontSize:28, color:barColor }}>{overallKcal}</span>
          <span style={{ color:"#444", fontSize:13 }}>/ {macros.targetKcal} kcal</span>
        </div>
        <div style={{ background:"#1e1e28", borderRadius:8, height:8, overflow:"hidden", marginBottom:12 }}>
          <div style={{ width:`${Math.min(100,(overallKcal/macros.targetKcal)*100)}%`, height:"100%", background:barColor, borderRadius:8, transition:"all 0.4s" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-around", marginBottom:12 }}>
          <MacroCircle label="Proteína" value={overallP} target={macros.protein} color="#4caf50" />
          <MacroCircle label="Grasa" value={overallG} target={macros.fat} color="#e91e63" />
          <MacroCircle label="Hidratos" value={overallC} target={macros.carbs} color="#ff9800" />
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <button onClick={()=>setShowDistModal(true)} style={{ flex:1, background:"linear-gradient(135deg,#1a1a24,#1f1f2e)", border:"1px solid #2a2a3a", borderRadius:12, padding:"10px 14px", cursor:"pointer", color:"#ccc", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span>📊 Reparto por comida</span>
            <span style={{ color:"#888", fontSize:11 }}>{numMeals} comidas →</span>
          </button>
          <button onClick={()=>setShowMealInfo(!showMealInfo)} style={{ width:42, borderRadius:12, border:`1px solid ${showMealInfo?"#4caf50":"#2a2a3a"}`, background:showMealInfo?"#1a3a1a":"linear-gradient(135deg,#1a1a24,#1f1f2e)", color:showMealInfo?"#4caf50":"#888", fontSize:15, fontWeight:800, cursor:"pointer", fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
        </div>
        {showMealInfo && (
          <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ color:"#cde", fontSize:12.5, lineHeight:1.5 }}>Tienes <b style={{color:"#4caf50"}}>{numMeals} comidas</b> al día. Puedes cambiar el número de comidas cuando quieras desde el botón <b>✏️</b> de arriba a la derecha (editar perfil). Tus datos registrados no se borran.</div>
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:12, padding:"8px 6px" }}>
          <button onClick={()=>setCurrentDate(addDays(currentDate,-1))} style={{ background:"none", border:"none", color:"#4caf50", fontSize:20, cursor:"pointer", padding:"4px 14px" }}>‹</button>
          <div style={{ textAlign:"center", flex:1 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{isToday?"📍 Hoy":formatDateLong(currentDate)}</div>
            {!isToday && <div onClick={()=>setCurrentDate(new Date())} style={{ color:"#4caf50", fontSize:11, cursor:"pointer", marginTop:1 }}>Volver a hoy</div>}
          </div>
          <button onClick={()=>!isToday && setCurrentDate(addDays(currentDate,1))} disabled={isToday} style={{ background:"none", border:"none", color:isToday?"#333":"#4caf50", fontSize:20, cursor:isToday?"default":"pointer", padding:"4px 14px" }}>›</button>
        </div>
      </div>

      <div style={{ display:"flex", borderBottom:"1px solid #1e1e28", background:"#0f0f14", overflowX:"auto" }}>
        {mealList.map(m => (
          <button key={m.id} onClick={()=>setActiveTab(m.id)} style={{ flex:mealList.length<=4?1:"none", minWidth:mealList.length>4?72:0, padding:"12px 8px", border:"none", background:"none", borderBottom:`3px solid ${safeActiveTab===m.id?"#4caf50":"transparent"}`, color:safeActiveTab===m.id?"#4caf50":"#555", fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
            {m.emoji} {m.label}
            <div style={{ fontSize:10, color:safeActiveTab===m.id?"#4caf50":"#444", marginTop:2 }}>{Math.round(getMealKcal(m.id))}kcal · {mealDist[m.id]||0}%</div>
          </button>
        ))}
      </div>

      {mealList.filter(m=>m.id===safeActiveTab).map(meal => {
        const mealData = meals[meal.id] || emptyMeal(meal.id===lastMealId);
        const mt = totals[meal.id];
        const mealKcalTarget = Math.round(getMealKcal(meal.id));
        return (
          <div key={meal.id} style={{ padding:"14px 14px 0" }}>
            <div style={{ background:"#1a1a24", borderRadius:14, padding:"12px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
              <span style={{ color:"#888", fontSize:13 }}>Total {meal.label}</span>
              <span style={{ color:"white", fontWeight:800, fontSize:13 }}>{mt.kcal} / {mealKcalTarget} kcal</span>
            </div>
            {activeBlocks.map(block => {
              const foods = mealData.foods[block.id] || [];
              const selIds = mealData.selected[block.id] || [];
              const splitMode = (mealData.splitMode && mealData.splitMode[block.id]) || "igual";
              const sliderItems = selIds.map(id => { const food = foods.find(f=>f.id===id); return { id, name:food?.name||id, pct:mealData.pct[block.id]?.[id]||Math.round(100/selIds.length) }; });
              const isPostre = block.id==="postre";
              return (
                <div key={block.id} style={{ background:isPostre?"linear-gradient(135deg,#1a1024,#1a1a24)":"#1a1a24", borderRadius:16, marginBottom:14, border:isPostre?"1px solid #4a2050":"1px solid #2a2a3a", overflow:"hidden" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:isPostre?"1px solid #4a2050":"1px solid #2a2a3a" }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:15, color:block.color.border }}>{block.emoji} {block.label}</div>
                      {isPostre && <div style={{ fontSize:10, color:"#777", marginTop:2 }}>Opcional · si no añades, las kcal van a otros bloques</div>}
                    </div>
                    <button onClick={()=>setSearching({ mealId:meal.id, blockId:block.id })} style={{ background:block.color.accent, color:"white", border:"none", borderRadius:20, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Añadir</button>
                  </div>
                  <div style={{ padding:"10px 14px" }}>
                    {foods.length===0 && <div style={{ color:"#444", fontSize:13, textAlign:"center", padding:"10px 0" }}>Pulsa "+ Añadir"</div>}
                    {foods.map(food => {
                      const isSel = selIds.includes(food.id);
                      const pct = mealData.pct[block.id]?.[food.id] || 0;
                      const blocksCount = activeBlocks.length===5 && !hasPostre ? 4 : activeBlocks.length;
                      const kcalT = isSel ? (mealKcalTarget/blocksCount)*(pct/100) : 0;
                      const gr = kcalT>0&&food.kcal ? Math.round((kcalT/food.kcal)*100) : 0;
                      return (
                        <div key={food.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #1e1e28" }}>
                          <button onClick={()=>toggleSelect(meal.id,block.id,food.id)} style={{ width:28, height:28, borderRadius:8, border:`2px solid ${isSel?block.color.border:"#3a3a4a"}`, background:isSel?block.color.accent:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{isSel && <span style={{ color:"white", fontSize:16, fontWeight:900 }}>✓</span>}</button>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ color:isSel?"white":"#888", fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{food.name}</div>
                            <div style={{ color:"#555", fontSize:11 }}>{food.kcal}kcal/100g · P:{food.p} HC:{food.c} G:{food.g}</div>
                            {isSel&&gr>0 && <div style={{ color:block.color.border, fontSize:12, fontWeight:700, marginTop:2 }}>→ {gr}g · {Math.round(kcalT)}kcal ({pct}%)</div>}
                          </div>
                          <button onClick={()=>removeFood(meal.id,block.id,food.id)} style={{ background:"none", border:"none", color:"#444", fontSize:20, cursor:"pointer", padding:"4px 8px", flexShrink:0 }}>✕</button>
                        </div>
                      );
                    })}
                    {selIds.length>1 && (
                      <div style={{ marginTop:10 }}>
                        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                          {["igual","manual"].map(mode => (
                            <button key={mode} onClick={()=>setSplitMode(meal.id,block.id,mode)} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${splitMode===mode?block.color.border:"#3a3a4a"}`, background:"transparent", color:splitMode===mode?block.color.border:"#666", fontSize:12, fontWeight:700, cursor:"pointer" }}>{mode==="igual"?"⚖️ Igual":"🎚️ Manual"}</button>
                          ))}
                        </div>
                        {splitMode==="manual" && sliderItems.map(item => (
                          <div key={item.id} style={{ marginBottom:10 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                              <span style={{ color:"#ccc", fontWeight:600 }}>{item.name.slice(0,28)}</span>
                              <span style={{ color:"white", fontWeight:800 }}>{item.pct}%</span>
                            </div>
                            <input type="range" min={5} max={95} value={item.pct} style={{ width:"100%", accentColor:block.color.border }} onChange={e => {
                              const newPct = parseInt(e.target.value);
                              const others = sliderItems.filter(i=>i.id!==item.id);
                              const remaining = 100-newPct;
                              const total = others.reduce((s,i)=>s+i.pct,0);
                              const updated = sliderItems.map(i => { if(i.id===item.id) return {...i,pct:newPct}; return {...i,pct:total>0?Math.round((i.pct/total)*remaining):Math.round(remaining/others.length)}; });
                              const sum = updated.reduce((s,i)=>s+i.pct,0);
                              if(sum!==100) updated[updated.length-1].pct += 100-sum;
                              updatePct(meal.id,block.id,updated);
                            }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: PESO Y MEDIDAS
// ═══════════════════════════════════════════════════════════════════════════
function MeasuresTab({ measureLog, setMeasureLog }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeMeasure, setActiveMeasure] = useState("peso");
  const [tipOpen, setTipOpen] = useState(null);
  const dKey = dateKey(currentDate);
  const isToday = isSameDay(currentDate, today);
  const dayData = measureLog[dKey] || {};

  const setMeasure = (measureId, value) => {
    setMeasureLog(prev => ({ ...prev, [dKey]: { ...(prev[dKey]||{}), [measureId]: value } }));
  };

  // Datos para la gráfica de la medida activa
  const chartData = Object.keys(measureLog).sort().filter(k => measureLog[k][activeMeasure] != null && measureLog[k][activeMeasure] !== "").map(k => ({ label: formatDateShort(parseKey(k)), value: parseFloat(measureLog[k][activeMeasure]) }));
  const activeMeasureObj = MEASURES.find(m=>m.id===activeMeasure);

  return (
    <div style={{ padding:"16px 16px 30px" }}>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>📊 Peso y medidas</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>Registra tu progreso corporal</div>

      {/* Navegación fecha */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:12, padding:"8px 6px", marginBottom:18 }}>
        <button onClick={()=>setCurrentDate(addDays(currentDate,-1))} style={{ background:"none", border:"none", color:"#4caf50", fontSize:20, cursor:"pointer", padding:"4px 14px" }}>‹</button>
        <div style={{ textAlign:"center", flex:1 }}>
          <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{isToday?"📍 Hoy":formatDateLong(currentDate)}</div>
          {!isToday && <div onClick={()=>setCurrentDate(new Date())} style={{ color:"#4caf50", fontSize:11, cursor:"pointer" }}>Volver a hoy</div>}
        </div>
        <button onClick={()=>!isToday && setCurrentDate(addDays(currentDate,1))} disabled={isToday} style={{ background:"none", border:"none", color:isToday?"#333":"#4caf50", fontSize:20, cursor:isToday?"default":"pointer", padding:"4px 14px" }}>›</button>
      </div>

      {/* Inputs de medidas */}
      <div style={{ background:"#1a1a24", borderRadius:16, padding:"16px", marginBottom:18, border:"1px solid #2a2a3a" }}>
        <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:14, textTransform:"uppercase", letterSpacing:1 }}>Registro del día</div>
        {MEASURES.map(m => (
          <div key={m.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ color:m.primary?"#4caf50":"#ccc", fontSize:14, fontWeight:m.primary?800:600 }}>{m.emoji} {m.label}</span>
                <button onClick={()=>setTipOpen(tipOpen===m.id?null:m.id)} style={{ width:18, height:18, borderRadius:"50%", border:`1px solid ${tipOpen===m.id?"#4caf50":"#444"}`, background:tipOpen===m.id?"#1a3a1a":"transparent", color:tipOpen===m.id?"#4caf50":"#666", fontSize:11, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, lineHeight:1, fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input type="number" inputMode="decimal" placeholder="—" value={dayData[m.id]||""} onChange={e=>setMeasure(m.id, e.target.value)} style={{ width:80, padding:"8px 10px", borderRadius:10, border:`2px solid ${m.primary?"#4caf50":"#2a2a3a"}`, background:"#0f0f14", color:"white", fontSize:15, textAlign:"right", outline:"none" }} />
                <span style={{ color:"#666", fontSize:13, width:24 }}>{m.unit}</span>
              </div>
            </div>
            {tipOpen===m.id && (
              <div style={{ position:"relative", marginTop:8, marginBottom:4 }}>
                <div style={{ position:"absolute", top:-6, left:24, width:12, height:12, background:"#0d2818", borderLeft:"1px solid #2e7d32", borderTop:"1px solid #2e7d32", transform:"rotate(45deg)" }} />
                <div style={{ background:"#0d2818", border:"1px solid #2e7d32", borderRadius:12, padding:"12px 14px", position:"relative" }}>
                  <div style={{ color:"#8bc34a", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>📐 Cómo medir</div>
                  <div style={{ color:"#cde", fontSize:12.5, lineHeight:1.5 }}>{m.tip}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selector de medida para gráfica */}
      <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Evolución</div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:14, paddingBottom:4 }}>
        {MEASURES.map(m => (
          <button key={m.id} onClick={()=>setActiveMeasure(m.id)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:20, border:`1px solid ${activeMeasure===m.id?"#4caf50":"#2a2a3a"}`, background:activeMeasure===m.id?"#1a3a1a":"transparent", color:activeMeasure===m.id?"#4caf50":"#888", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{m.emoji} {m.label}</button>
        ))}
      </div>

      <div style={{ background:"#1a1a24", borderRadius:16, padding:"16px 8px 8px", border:"1px solid #2a2a3a" }}>
        <div style={{ paddingLeft:8, marginBottom:8, color:"#ccc", fontWeight:700, fontSize:14 }}>{activeMeasureObj.emoji} {activeMeasureObj.label} ({activeMeasureObj.unit})</div>
        <LineChart data={chartData} unit={activeMeasureObj.unit} color="#4caf50" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: LOGROS
// ═══════════════════════════════════════════════════════════════════════════
function AchievementsTab({ measureLog, history }) {
  const [showInfo, setShowInfo] = useState(false);
  // Días con registro de peso
  const weightDays = Object.keys(measureLog).filter(k => measureLog[k].peso != null && measureLog[k].peso !== "");
  // Días con nutrición registrada (al menos un alimento)
  const nutritionDays = Object.keys(history).filter(k => {
    const d = history[k];
    return ALL_MEALS.some(m => BLOCKS.some(b => (d[m.id]?.selected[b.id]||[]).length > 0));
  });

  const today = new Date();
  const currentStreak = calcStreak(new Set(nutritionDays), today);

  const weightAch = getWeightAchievements(weightDays.length);
  const nutAch = getNutritionAchievements(nutritionDays.length);
  const streakAch = getStreakAchievements(currentStreak);

  const allAch = [...streakAch, ...weightAch, ...nutAch];
  const unlockedCount = allAch.filter(a=>a.unlocked).length;

  const Section = ({ title, items }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>{title}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {items.map(a => (
          <div key={a.id} style={{ background:a.unlocked?"linear-gradient(135deg,#1a2e1a,#1a1a24)":"#15151c", borderRadius:14, padding:"14px 12px", border:`1px solid ${a.unlocked?"#4caf50":"#222"}`, textAlign:"center", opacity:a.unlocked?1:0.55, position:"relative" }}>
            <div style={{ fontSize:32, marginBottom:6, filter:a.unlocked?"none":"grayscale(1)" }}>{a.emoji}</div>
            <div style={{ color:a.unlocked?"white":"#666", fontWeight:800, fontSize:13, marginBottom:3 }}>{a.title}</div>
            <div style={{ color:"#666", fontSize:10.5, lineHeight:1.3 }}>{a.desc}</div>
            {a.unlocked && <div style={{ position:"absolute", top:8, right:8, color:"#4caf50", fontSize:14 }}>✓</div>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding:"16px 16px 30px" }}>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>🏆 Logros</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>{unlockedCount} de {allAch.length} desbloqueados</div>

      {/* Racha actual destacada */}
      <div style={{ background:"linear-gradient(135deg,#2a1a00,#1a1a24)", borderRadius:16, padding:"18px", marginBottom: showInfo?12:24, border:"1px solid #ff9800", display:"flex", alignItems:"center", gap:16, position:"relative" }}>
        <div style={{ fontSize:44 }}>🔥</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#ff9800", fontWeight:900, fontSize:28, lineHeight:1 }}>{currentStreak} {currentStreak===1?"día":"días"}</div>
          <div style={{ color:"#aaa", fontSize:13, marginTop:4 }}>Racha actual de constancia</div>
        </div>
        <button onClick={()=>setShowInfo(!showInfo)} style={{ position:"absolute", top:12, right:12, width:24, height:24, borderRadius:"50%", border:`1px solid ${showInfo?"#ff9800":"#5a4a2a"}`, background:showInfo?"#3a2800":"transparent", color:showInfo?"#ff9800":"#a88", fontSize:13, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
      </div>

      {/* Popup explicación logros */}
      {showInfo && (
        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:16, padding:"16px 18px", marginBottom:24 }}>
          <div style={{ color:"#8bc34a", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>¿Cómo conseguir logros?</div>
          <div style={{ color:"#cde", fontSize:13, lineHeight:1.6 }}>
            <div style={{ marginBottom:8 }}><b style={{ color:"#ff9800" }}>🔥 Rachas:</b> registra tu comida cada día sin saltarte ninguno. Si fallas un día, la racha vuelve a empezar. Encadena 3, 7, 15, 30 y 100 días.</div>
            <div style={{ marginBottom:8 }}><b style={{ color:"#4caf50" }}>⚖️ Control de peso:</b> apunta tu peso en el apartado de Medidas. Cada cierto número de días registrados desbloqueas un nuevo nivel (semanal, mensual y anual).</div>
            <div><b style={{ color:"#8bc34a" }}>🥗 Nutrición:</b> añade tus comidas cada día. Cuantos más días acumules registrando tu dieta, más logros de nutrición desbloqueas.</div>
          </div>
        </div>
      )}

      <Section title="🔥 Rachas" items={streakAch} />
      <Section title="⚖️ Control de peso" items={weightAch} />
      <Section title="🥗 Nutrición" items={nutAch} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: DASHBOARD (INICIO)
// ═══════════════════════════════════════════════════════════════════════════
function DashboardTab({ userData, macros, measureLog, history, onGoTo }) {
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [showWeightInfo, setShowWeightInfo] = useState(false);
  const [tip] = useState(() => getRandomTip());
  const today = new Date();
  const weightKeys = Object.keys(measureLog).filter(k => measureLog[k].peso != null && measureLog[k].peso !== "").sort();
  const weightData = weightKeys.map(k => ({ label: formatDateShort(parseKey(k)), value: parseFloat(measureLog[k].peso) }));

  // El peso inicial es el primer registro real; si no hay registros, el del perfil
  const startWeight = weightData.length > 0 ? weightData[0].value : parseFloat(userData.weight);
  const currentWeight = weightData.length > 0 ? weightData[weightData.length-1].value : parseFloat(userData.weight);
  const weightChange = currentWeight - startWeight;

  // Días activos y racha
  const weightDays = weightKeys;
  const nutritionDays = Object.keys(history).filter(k => { const d = history[k]; return ALL_MEALS.some(m => BLOCKS.some(b => (d[m.id]?.selected[b.id]||[]).length>0)); });
  const nutritionSet = new Set(nutritionDays);
  const streak = calcStreak(nutritionSet, today);

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  })();

  return (
    <div style={{ padding:"20px 16px 30px" }}>
      <div style={{ color:"#888", fontSize:14, marginBottom:2 }}>{greeting},</div>
      <div style={{ fontWeight:900, fontSize:26, color:"white", marginBottom:18 }}>{userData.name} 👋</div>

      {/* Consejo del día */}
      <div style={{ background:"linear-gradient(135deg,#0d2818,#15201a)", borderRadius:16, padding:"14px 16px", marginBottom:16, border:"1px solid #2e7d32", display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{ fontSize:26, flexShrink:0 }}>💡</div>
        <div>
          <div style={{ color:"#8bc34a", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>Consejo</div>
          <div style={{ color:"#dfe", fontSize:13.5, lineHeight:1.45 }}>{tip}</div>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: (showStreakInfo||showWeightInfo)?12:16 }}>
        <div style={{ background:"linear-gradient(135deg,#2a1a00,#1a1a24)", borderRadius:16, padding:"16px", border:"1px solid #3a2a1a", position:"relative" }}>
          <button onClick={()=>{setShowStreakInfo(!showStreakInfo); setShowWeightInfo(false);}} style={{ position:"absolute", top:10, right:10, width:22, height:22, borderRadius:"50%", border:`1px solid ${showStreakInfo?"#ff9800":"#5a4a2a"}`, background:showStreakInfo?"#3a2800":"transparent", color:showStreakInfo?"#ff9800":"#a88", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
          <div style={{ fontSize:28, marginBottom:4 }}>🔥</div>
          <div style={{ color:"#ff9800", fontWeight:900, fontSize:24, lineHeight:1 }}>{streak}</div>
          <div style={{ color:"#888", fontSize:12, marginTop:2 }}>días de racha</div>
        </div>
        <div style={{ background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:16, padding:"16px", border:"1px solid #2a3a2a", position:"relative" }}>
          <button onClick={()=>{setShowWeightInfo(!showWeightInfo); setShowStreakInfo(false);}} style={{ position:"absolute", top:10, right:10, width:22, height:22, borderRadius:"50%", border:`1px solid ${showWeightInfo?"#4caf50":"#2a4a2a"}`, background:showWeightInfo?"#0d2818":"transparent", color:showWeightInfo?"#4caf50":"#8a8", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
          <div style={{ fontSize:28, marginBottom:4 }}>{weightChange<=0?"📉":"📈"}</div>
          <div style={{ color:weightChange<=0?"#4caf50":"#ff9800", fontWeight:900, fontSize:24, lineHeight:1 }}>{weightChange>0?"+":""}{weightChange.toFixed(1)}<span style={{ fontSize:13 }}>kg</span></div>
          <div style={{ color:"#888", fontSize:12, marginTop:2 }}>desde el inicio</div>
        </div>
      </div>

      {/* Popup explicación racha/logros */}
      {showStreakInfo && (
        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:16, padding:"16px 18px", marginBottom:16 }}>
          <div style={{ color:"#8bc34a", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>¿Cómo funciona la racha?</div>
          <div style={{ color:"#cde", fontSize:13, lineHeight:1.6 }}>
            <div style={{ marginBottom:8 }}>Tu racha sube <b style={{ color:"#ff9800" }}>cada día que registras tu comida</b>. Si te saltas un día, vuelve a empezar desde cero.</div>
            <div>Mantenla activa para desbloquear logros: 3, 7, 15, 30 y 100 días seguidos. Consulta todos tus logros en la pestaña 🏆.</div>
          </div>
        </div>
      )}

      {/* Popup explicación cambio de peso */}
      {showWeightInfo && (
        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:16, padding:"16px 18px", marginBottom:16 }}>
          <div style={{ color:"#8bc34a", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Cambio de peso</div>
          <div style={{ color:"#cde", fontSize:13, lineHeight:1.6 }}>
            <div style={{ marginBottom:8 }}>Muestra los kilos que has <b style={{ color:"#4caf50" }}>ganado o perdido</b> desde tu primer registro de peso hasta el último.</div>
            <div>📉 en verde si bajas, 📈 en naranja si subes. Apunta tu peso en la pestaña 📊 Medidas para mantenerlo actualizado.</div>
          </div>
        </div>
      )}

      {/* Gráfica de peso */}
      <div style={{ background:"#1a1a24", borderRadius:18, padding:"16px 8px 12px", marginBottom:16, border:"1px solid #2a2a3a" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:8, paddingRight:8, marginBottom:8 }}>
          <span style={{ color:"#ccc", fontWeight:800, fontSize:15 }}>⚖️ Evolución del peso</span>
          <span style={{ color:"#4caf50", fontSize:13, fontWeight:700 }}>{currentWeight.toFixed(1)} kg</span>
        </div>
        <LineChart data={weightData.length?weightData:[{label:"inicio",value:startWeight}]} unit="kg" color="#4caf50" />
      </div>

      {/* Accesos rápidos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <button onClick={()=>onGoTo("nutricion")} style={{ background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", border:"1px solid #2a3a2a", borderRadius:16, padding:"18px", cursor:"pointer", textAlign:"left" }}>
          <div style={{ fontSize:26, marginBottom:6 }}>🍽️</div>
          <div style={{ color:"white", fontWeight:800, fontSize:14 }}>Registrar comida</div>
          <div style={{ color:"#888", fontSize:11, marginTop:2 }}>{macros.targetKcal} kcal objetivo</div>
        </button>
        <button onClick={()=>onGoTo("medidas")} style={{ background:"linear-gradient(135deg,#1a1a2e,#1a1a24)", border:"1px solid #2a2a3a", borderRadius:16, padding:"18px", cursor:"pointer", textAlign:"left" }}>
          <div style={{ fontSize:26, marginBottom:6 }}>📊</div>
          <div style={{ color:"white", fontWeight:800, fontSize:14 }}>Anotar peso</div>
          <div style={{ color:"#888", fontSize:11, marginTop:2 }}>Mide tu progreso</div>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVEGACIÓN INFERIOR
// ═══════════════════════════════════════════════════════════════════════════
function BottomNav({ active, onChange }) {
  const tabs = [
    { id:"inicio", label:"Inicio", icon:"🏠" },
    { id:"nutricion", label:"Nutrición", icon:"🍽️" },
    { id:"medidas", label:"Medidas", icon:"📊" },
    { id:"logros", label:"Logros", icon:"🏆" },
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#15151c", borderTop:"1px solid #2a2a3a", display:"flex", zIndex:150, paddingBottom:"env(safe-area-inset-bottom)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)} style={{ flex:1, padding:"10px 4px 12px", border:"none", background:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <span style={{ fontSize:22, filter:active===t.id?"none":"grayscale(0.6)", opacity:active===t.id?1:0.5 }}>{t.icon}</span>
          <span style={{ fontSize:10, fontWeight:700, color:active===t.id?"#4caf50":"#666" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [userData, setUserData] = useLS("userData_v10", null);
  const [history, setHistory] = useLS("history_v10", {});
  const [measureLog, setMeasureLog] = useLS("measureLog_v10", {});
  const [mealDist, setMealDist] = useLS("mealDist_v10", DEFAULT_MEAL_DIST);
  const [customFoods, setCustomFoods] = useLS("customFoods_v10", []);
  const [editing, setEditing] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState("inicio");
  const [nutritionDate, setNutritionDate] = useState(new Date());

  useEffect(() => { const t = setTimeout(()=>setShowSplash(false), 3000); return ()=>clearTimeout(t); }, []);

  const macros = userData ? calcMacros(userData) : null;
  const numMeals = userData?.numMeals || DEFAULT_NUM_MEALS;

  // Asegurar que el reparto cuadra con las comidas actuales (auto-reparación)
  useEffect(() => {
    if (!userData) return;
    const expectedIds = getMeals(numMeals).map(m=>m.id);
    const distIds = Object.keys(mealDist);
    const matches = expectedIds.length === distIds.length && expectedIds.every(id => distIds.includes(id));
    if (!matches) setMealDist(getDefaultDist(numMeals));
  }, [numMeals, userData]);

  const handleCreateFood = (food) => setCustomFoods(prev => [...prev, food]);
  const handleDeleteFood = (id) => setCustomFoods(prev => prev.filter(f => f.id !== id));

  const handleSaveProfile = (data) => {
    const prevNum = userData?.numMeals || DEFAULT_NUM_MEALS;
    setUserData(data);
    setEditing(false);
    if (!userData || data.numMeals !== prevNum) {
      setMealDist(getDefaultDist(data.numMeals));
    }
  };

  if (showSplash) return <SplashScreen />;
  if (!userData || editing) return <ProfileScreen initial={editing?userData:null} onSave={handleSaveProfile} />;

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", paddingBottom:74 }}>
      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:120, background:"#0f0f14", borderBottom:"1px solid #1e1e28", padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontWeight:900, fontSize:18, color:"white", letterSpacing:1 }}>
          <span style={{ color:"#A8FF60" }}>SMINK</span> <span style={{ color:"#fff" }}>DIET</span>
        </div>
        <button onClick={()=>setEditing(true)} style={{ background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:10, color:"#888", fontSize:12, padding:"6px 12px", cursor:"pointer" }}>✏️ {userData.name}</button>
      </div>

      {tab === "inicio" && <DashboardTab userData={userData} macros={macros} measureLog={measureLog} history={history} onGoTo={setTab} />}
      {tab === "nutricion" && <NutritionTab macros={macros} numMeals={numMeals} history={history} setHistory={setHistory} mealDist={mealDist} setMealDist={setMealDist} currentDate={nutritionDate} setCurrentDate={setNutritionDate} customFoods={customFoods} onCreateFood={handleCreateFood} onDeleteFood={handleDeleteFood} />}
      {tab === "medidas" && <MeasuresTab measureLog={measureLog} setMeasureLog={setMeasureLog} />}
      {tab === "logros" && <AchievementsTab measureLog={measureLog} history={history} />}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
