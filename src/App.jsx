import { useState, useCallback, useEffect } from "react";
import { saveProfile, saveNutritionDay, saveWorkout, saveMeasure, saveRoutine, saveRacePlan, saveWater, saveSleep, saveCustomFoods } from "./db.js";
import SettingsScreen from "./SettingsScreen.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// BASE DE DATOS Y LÓGICA — SMINK FIT
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
  // Alimentos de las recetas
  { id:"rec_quesofresco", name:"Queso fresco batido", cat:"proteina", kcal:60, p:11, g:0, c:4 },
  { id:"rec_requeson", name:"Requesón", cat:"proteina", kcal:98, p:11, g:4, c:3 },
  { id:"rec_quesobatido", name:"Queso batido 0%", cat:"proteina", kcal:60, p:11, g:0, c:4 },
  { id:"rec_kefir", name:"Kéfir", cat:"proteina", kcal:60, p:3, g:3, c:4 },
  { id:"rec_leche", name:"Leche semidesnatada", cat:"proteina", kcal:46, p:3, g:2, c:5 },
  { id:"rec_kiwi", name:"Kiwi", cat:"verdura", kcal:61, p:1, g:1, c:15 },
  { id:"rec_quinoa_seca", name:"Quinoa (en seco)", cat:"hidrato", kcal:368, p:14, g:6, c:64 },
  { id:"rec_cuscus", name:"Cuscús (en seco)", cat:"hidrato", kcal:376, p:12, g:1, c:77 },
  { id:"rec_tortilla_trigo", name:"Tortilla de trigo (wrap)", cat:"hidrato", kcal:287, p:8, g:5, c:55 },
  { id:"rec_tofu", name:"Tofu", cat:"proteina", kcal:76, p:8, g:5, c:2 },
  { id:"rec_sardinas", name:"Sardinas", cat:"proteina", kcal:185, p:25, g:10, c:0 },
  { id:"rec_panint", name:"Pan integral", cat:"hidrato", kcal:247, p:9, g:3, c:46 },

  // ═══ AMPLIACIÓN — alimentos genéricos verificados (valores por 100g en crudo/seco salvo indicación) ═══
  // ── HIDRATOS ──
  { id:"hd01", name:"Arroz basmati", cat:"hidrato", kcal:356, p:8, g:1, c:78 },
  { id:"hd02", name:"Cuscús (seco)", cat:"hidrato", kcal:376, p:13, g:1, c:77 },
  { id:"hd03", name:"Bulgur (seco)", cat:"hidrato", kcal:342, p:12, g:1, c:76 },
  { id:"hd04", name:"Polenta / sémola de maíz", cat:"hidrato", kcal:362, p:8, g:2, c:79 },
  { id:"hd05", name:"Avena en copos", cat:"hidrato", kcal:389, p:17, g:7, c:66 },
  { id:"hd06", name:"Pan blanco", cat:"hidrato", kcal:265, p:9, g:3, c:49 },
  { id:"hd07", name:"Pan de centeno", cat:"hidrato", kcal:259, p:9, g:3, c:48 },
  { id:"hd08", name:"Pan de molde blanco", cat:"hidrato", kcal:266, p:8, g:4, c:49 },
  { id:"hd09", name:"Pan de molde integral", cat:"hidrato", kcal:248, p:9, g:4, c:42 },
  { id:"hd10", name:"Picos / regañás", cat:"hidrato", kcal:412, p:11, g:9, c:71 },
  { id:"hd11", name:"Tostadas de pan", cat:"hidrato", kcal:380, p:12, g:5, c:71 },
  { id:"hd12", name:"Tortitas de arroz", cat:"hidrato", kcal:387, p:8, g:3, c:81 },
  { id:"hd13", name:"Tortitas de maíz", cat:"hidrato", kcal:385, p:7, g:3, c:82 },
  { id:"hd14", name:"Cereales de maíz (cornflakes)", cat:"hidrato", kcal:357, p:7, g:1, c:84 },
  { id:"hd15", name:"Muesli", cat:"hidrato", kcal:367, p:10, g:6, c:66 },
  { id:"hd16", name:"Granola", cat:"hidrato", kcal:471, p:10, g:20, c:64 },
  { id:"hd17", name:"Boniato / batata", cat:"hidrato", kcal:86, p:2, g:0, c:20 },
  { id:"hd18", name:"Patata cocida", cat:"hidrato", kcal:87, p:2, g:0, c:20 },
  { id:"hd19", name:"Yuca", cat:"hidrato", kcal:160, p:1, g:0, c:38 },
  { id:"hd20", name:"Maíz dulce (lata)", cat:"hidrato", kcal:86, p:3, g:1, c:19 },
  { id:"hd21", name:"Castañas", cat:"hidrato", kcal:213, p:3, g:2, c:46 },
  { id:"hd22", name:"Quinoa (seca)", cat:"hidrato", kcal:368, p:14, g:6, c:64 },
  { id:"hd23", name:"Trigo sarraceno (seco)", cat:"hidrato", kcal:343, p:13, g:3, c:72 },
  { id:"hd24", name:"Fideos / noodles (secos)", cat:"hidrato", kcal:348, p:11, g:1, c:71 },
  { id:"hd25", name:"Pan de hamburguesa", cat:"hidrato", kcal:280, p:9, g:5, c:48 },
  { id:"hd26", name:"Pan pita", cat:"hidrato", kcal:275, p:9, g:1, c:55 },
  { id:"hd27", name:"Harina de trigo", cat:"hidrato", kcal:364, p:10, g:1, c:76 },
  { id:"hd28", name:"Harina de avena", cat:"hidrato", kcal:389, p:17, g:7, c:66 },
  // ── PROTEÍNAS ──
  { id:"pr01", name:"Pechuga de pollo", cat:"proteina", kcal:165, p:31, g:4, c:0 },
  { id:"pr02", name:"Muslo de pollo (sin piel)", cat:"proteina", kcal:177, p:24, g:9, c:0 },
  { id:"pr03", name:"Pechuga de pavo", cat:"proteina", kcal:135, p:29, g:1, c:0 },
  { id:"pr04", name:"Ternera magra", cat:"proteina", kcal:158, p:26, g:6, c:0 },
  { id:"pr05", name:"Solomillo de cerdo", cat:"proteina", kcal:143, p:26, g:4, c:0 },
  { id:"pr06", name:"Lomo de cerdo", cat:"proteina", kcal:208, p:27, g:11, c:0 },
  { id:"pr07", name:"Carne picada mixta", cat:"proteina", kcal:215, p:19, g:15, c:0 },
  { id:"pr08", name:"Conejo", cat:"proteina", kcal:173, p:33, g:4, c:0 },
  { id:"pr09", name:"Huevo entero", cat:"proteina", kcal:155, p:13, g:11, c:1 },
  { id:"pr10", name:"Clara de huevo", cat:"proteina", kcal:52, p:11, g:0, c:1 },
  { id:"pr11", name:"Atún al natural (lata)", cat:"proteina", kcal:116, p:26, g:1, c:0 },
  { id:"pr12", name:"Atún en aceite (escurrido)", cat:"proteina", kcal:200, p:26, g:10, c:0 },
  { id:"pr13", name:"Salmón", cat:"proteina", kcal:208, p:20, g:13, c:0 },
  { id:"pr14", name:"Merluza", cat:"proteina", kcal:90, p:18, g:2, c:0 },
  { id:"pr15", name:"Bacalao fresco", cat:"proteina", kcal:82, p:18, g:1, c:0 },
  { id:"pr16", name:"Dorada", cat:"proteina", kcal:96, p:20, g:2, c:0 },
  { id:"pr17", name:"Lubina", cat:"proteina", kcal:97, p:18, g:3, c:0 },
  { id:"pr18", name:"Gambas / langostinos", cat:"proteina", kcal:99, p:21, g:1, c:0 },
  { id:"pr19", name:"Mejillones", cat:"proteina", kcal:86, p:12, g:2, c:4 },
  { id:"pr20", name:"Calamar", cat:"proteina", kcal:92, p:16, g:1, c:3 },
  { id:"pr21", name:"Pulpo", cat:"proteina", kcal:82, p:15, g:1, c:2 },
  { id:"pr22", name:"Boquerones / anchoa fresca", cat:"proteina", kcal:131, p:20, g:5, c:0 },
  { id:"pr23", name:"Caballa", cat:"proteina", kcal:205, p:19, g:14, c:0 },
  { id:"pr24", name:"Trucha", cat:"proteina", kcal:119, p:20, g:4, c:0 },
  { id:"pr25", name:"Jamón serrano", cat:"proteina", kcal:241, p:31, g:13, c:0 },
  { id:"pr26", name:"Jamón cocido / york", cat:"proteina", kcal:107, p:18, g:4, c:1 },
  { id:"pr27", name:"Pavo en lonchas", cat:"proteina", kcal:104, p:18, g:3, c:1 },
  { id:"pr28", name:"Lacón", cat:"proteina", kcal:120, p:20, g:4, c:0 },
  { id:"pr29", name:"Queso fresco batido 0%", cat:"proteina", kcal:47, p:8, g:0, c:4 },
  { id:"pr30", name:"Requesón", cat:"proteina", kcal:97, p:11, g:4, c:3 },
  { id:"pr31", name:"Queso cottage", cat:"proteina", kcal:98, p:11, g:4, c:3 },
  { id:"pr32", name:"Seitán", cat:"proteina", kcal:121, p:21, g:2, c:4 },
  { id:"pr33", name:"Tempeh", cat:"proteina", kcal:193, p:19, g:11, c:9 },
  { id:"pr34", name:"Soja texturizada (seca)", cat:"proteina", kcal:345, p:52, g:1, c:30 },
  { id:"pr35", name:"Proteína whey (polvo)", cat:"proteina", kcal:400, p:80, g:7, c:8 },
  { id:"pr36", name:"Lentejas (cocidas)", cat:"proteina", kcal:116, p:9, g:0, c:20 },
  { id:"pr37", name:"Garbanzos (cocidos)", cat:"proteina", kcal:139, p:8, g:3, c:21 },
  { id:"pr38", name:"Alubias / judías (cocidas)", cat:"proteina", kcal:127, p:9, g:1, c:23 },
  { id:"pr39", name:"Guisantes", cat:"proteina", kcal:81, p:5, g:0, c:14 },
  { id:"pr40", name:"Edamame", cat:"proteina", kcal:121, p:12, g:5, c:9 },
  // ── GRASAS ──
  { id:"gr01", name:"Aceite de oliva virgen extra", cat:"grasa", kcal:899, p:0, g:100, c:0 },
  { id:"gr02", name:"Aceite de girasol", cat:"grasa", kcal:899, p:0, g:100, c:0 },
  { id:"gr03", name:"Mantequilla", cat:"grasa", kcal:717, p:1, g:81, c:1 },
  { id:"gr04", name:"Aguacate", cat:"grasa", kcal:160, p:2, g:15, c:9 },
  { id:"gr05", name:"Almendras", cat:"grasa", kcal:579, p:21, g:50, c:22 },
  { id:"gr06", name:"Nueces", cat:"grasa", kcal:654, p:15, g:65, c:14 },
  { id:"gr07", name:"Avellanas", cat:"grasa", kcal:628, p:15, g:61, c:17 },
  { id:"gr08", name:"Anacardos", cat:"grasa", kcal:553, p:18, g:44, c:30 },
  { id:"gr09", name:"Pistachos", cat:"grasa", kcal:562, p:20, g:45, c:28 },
  { id:"gr10", name:"Cacahuetes", cat:"grasa", kcal:567, p:26, g:49, c:16 },
  { id:"gr11", name:"Crema de cacahuete", cat:"grasa", kcal:588, p:25, g:50, c:20 },
  { id:"gr12", name:"Semillas de chía", cat:"grasa", kcal:486, p:17, g:31, c:42 },
  { id:"gr13", name:"Semillas de lino", cat:"grasa", kcal:534, p:18, g:42, c:29 },
  { id:"gr14", name:"Semillas de girasol", cat:"grasa", kcal:584, p:21, g:51, c:20 },
  { id:"gr15", name:"Semillas de calabaza", cat:"grasa", kcal:559, p:30, g:49, c:11 },
  { id:"gr16", name:"Aceitunas", cat:"grasa", kcal:145, p:1, g:15, c:4 },
  { id:"gr17", name:"Coco rallado", cat:"grasa", kcal:660, p:7, g:65, c:14 },
  { id:"gr18", name:"Tahini (pasta de sésamo)", cat:"grasa", kcal:595, p:17, g:54, c:21 },
  // ── VERDURAS ──
  { id:"vd01", name:"Tomate", cat:"verdura", kcal:18, p:1, g:0, c:4 },
  { id:"vd02", name:"Lechuga", cat:"verdura", kcal:15, p:1, g:0, c:3 },
  { id:"vd03", name:"Pepino", cat:"verdura", kcal:16, p:1, g:0, c:4 },
  { id:"vd04", name:"Pimiento rojo", cat:"verdura", kcal:31, p:1, g:0, c:6 },
  { id:"vd05", name:"Pimiento verde", cat:"verdura", kcal:20, p:1, g:0, c:5 },
  { id:"vd06", name:"Calabacín", cat:"verdura", kcal:17, p:1, g:0, c:3 },
  { id:"vd07", name:"Berenjena", cat:"verdura", kcal:25, p:1, g:0, c:6 },
  { id:"vd08", name:"Zanahoria", cat:"verdura", kcal:41, p:1, g:0, c:10 },
  { id:"vd09", name:"Cebolla", cat:"verdura", kcal:40, p:1, g:0, c:9 },
  { id:"vd10", name:"Brócoli", cat:"verdura", kcal:34, p:3, g:0, c:7 },
  { id:"vd11", name:"Coliflor", cat:"verdura", kcal:25, p:2, g:0, c:5 },
  { id:"vd12", name:"Espinacas", cat:"verdura", kcal:23, p:3, g:0, c:4 },
  { id:"vd13", name:"Acelga", cat:"verdura", kcal:19, p:2, g:0, c:4 },
  { id:"vd14", name:"Judías verdes", cat:"verdura", kcal:31, p:2, g:0, c:7 },
  { id:"vd15", name:"Champiñones", cat:"verdura", kcal:22, p:3, g:0, c:3 },
  { id:"vd16", name:"Setas", cat:"verdura", kcal:26, p:3, g:0, c:4 },
  { id:"vd17", name:"Espárragos", cat:"verdura", kcal:20, p:2, g:0, c:4 },
  { id:"vd18", name:"Alcachofa", cat:"verdura", kcal:47, p:3, g:0, c:11 },
  { id:"vd19", name:"Col / repollo", cat:"verdura", kcal:25, p:1, g:0, c:6 },
  { id:"vd20", name:"Coles de Bruselas", cat:"verdura", kcal:43, p:3, g:0, c:9 },
  { id:"vd21", name:"Puerro", cat:"verdura", kcal:61, p:1, g:0, c:14 },
  { id:"vd22", name:"Apio", cat:"verdura", kcal:16, p:1, g:0, c:3 },
  { id:"vd23", name:"Rúcula", cat:"verdura", kcal:25, p:3, g:1, c:4 },
  { id:"vd24", name:"Canónigos", cat:"verdura", kcal:21, p:2, g:0, c:4 },
  { id:"vd25", name:"Tomate cherry", cat:"verdura", kcal:18, p:1, g:0, c:4 },
  { id:"vd26", name:"Remolacha", cat:"verdura", kcal:43, p:2, g:0, c:10 },
  { id:"vd27", name:"Rábano", cat:"verdura", kcal:16, p:1, g:0, c:3 },
  { id:"vd28", name:"Calabaza", cat:"verdura", kcal:26, p:1, g:0, c:7 },
  { id:"vd29", name:"Setas shiitake", cat:"verdura", kcal:34, p:2, g:0, c:7 },
  { id:"vd30", name:"Endivia", cat:"verdura", kcal:17, p:1, g:0, c:3 },
  // ── FRUTAS (postre/snack) ──
  { id:"fr01", name:"Plátano", cat:"postre", kcal:89, p:1, g:0, c:23 },
  { id:"fr02", name:"Manzana", cat:"postre", kcal:52, p:0, g:0, c:14 },
  { id:"fr03", name:"Pera", cat:"postre", kcal:57, p:0, g:0, c:15 },
  { id:"fr04", name:"Naranja", cat:"postre", kcal:47, p:1, g:0, c:12 },
  { id:"fr05", name:"Mandarina", cat:"postre", kcal:53, p:1, g:0, c:13 },
  { id:"fr06", name:"Fresas", cat:"postre", kcal:32, p:1, g:0, c:8 },
  { id:"fr07", name:"Arándanos", cat:"postre", kcal:57, p:1, g:0, c:14 },
  { id:"fr08", name:"Frambuesas", cat:"postre", kcal:52, p:1, g:1, c:12 },
  { id:"fr09", name:"Uvas", cat:"postre", kcal:69, p:1, g:0, c:18 },
  { id:"fr10", name:"Melón", cat:"postre", kcal:34, p:1, g:0, c:8 },
  { id:"fr11", name:"Sandía", cat:"postre", kcal:30, p:1, g:0, c:8 },
  { id:"fr12", name:"Piña", cat:"postre", kcal:50, p:1, g:0, c:13 },
  { id:"fr13", name:"Mango", cat:"postre", kcal:60, p:1, g:0, c:15 },
  { id:"fr14", name:"Kiwi", cat:"postre", kcal:61, p:1, g:1, c:15 },
  { id:"fr15", name:"Melocotón", cat:"postre", kcal:39, p:1, g:0, c:10 },
  { id:"fr16", name:"Cerezas", cat:"postre", kcal:63, p:1, g:0, c:16 },
  { id:"fr17", name:"Ciruela", cat:"postre", kcal:46, p:1, g:0, c:11 },
  { id:"fr18", name:"Higos", cat:"postre", kcal:74, p:1, g:0, c:19 },
  { id:"fr19", name:"Granada", cat:"postre", kcal:83, p:2, g:1, c:19 },
  { id:"fr20", name:"Dátiles", cat:"postre", kcal:282, p:2, g:0, c:75 },
  { id:"fr21", name:"Pasas", cat:"postre", kcal:299, p:3, g:0, c:79 },
  { id:"fr22", name:"Orejones (albaricoque seco)", cat:"postre", kcal:241, p:3, g:1, c:63 },
  // ── LÁCTEOS / POSTRES ──
  { id:"lc01", name:"Leche entera", cat:"postre", kcal:61, p:3, g:3, c:5 },
  { id:"lc02", name:"Leche semidesnatada", cat:"postre", kcal:46, p:3, g:2, c:5 },
  { id:"lc03", name:"Leche desnatada", cat:"postre", kcal:34, p:3, g:0, c:5 },
  { id:"lc04", name:"Bebida de avena", cat:"postre", kcal:46, p:1, g:1, c:8 },
  { id:"lc05", name:"Bebida de almendra", cat:"postre", kcal:24, p:1, g:1, c:3 },
  { id:"lc06", name:"Bebida de soja", cat:"postre", kcal:42, p:3, g:2, c:3 },
  { id:"lc07", name:"Yogur natural", cat:"postre", kcal:61, p:4, g:3, c:5 },
  { id:"lc08", name:"Yogur griego natural", cat:"postre", kcal:97, p:9, g:5, c:4 },
  { id:"lc09", name:"Yogur desnatado", cat:"postre", kcal:42, p:4, g:0, c:6 },
  { id:"lc10", name:"Yogur proteico (skyr)", cat:"postre", kcal:63, p:11, g:0, c:4 },
  { id:"lc11", name:"Kéfir", cat:"postre", kcal:55, p:3, g:3, c:4 },
  { id:"lc12", name:"Cuajada", cat:"postre", kcal:90, p:5, g:5, c:6 },
  { id:"lc13", name:"Natillas", cat:"postre", kcal:118, p:4, g:3, c:18 },
  { id:"lc14", name:"Flan de huevo", cat:"postre", kcal:126, p:4, g:3, c:20 },
  { id:"lc15", name:"Helado de vainilla", cat:"postre", kcal:207, p:4, g:11, c:24 },
  // ── QUESOS (grasa/proteína) ──
  { id:"qs01", name:"Queso curado", cat:"grasa", kcal:387, p:27, g:31, c:1 },
  { id:"qs02", name:"Queso semicurado", cat:"grasa", kcal:357, p:25, g:28, c:1 },
  { id:"qs03", name:"Queso fresco", cat:"proteina", kcal:174, p:13, g:13, c:3 },
  { id:"qs04", name:"Queso mozzarella", cat:"grasa", kcal:280, p:22, g:21, c:2 },
  { id:"qs05", name:"Queso de cabra", cat:"grasa", kcal:364, p:22, g:30, c:2 },
  { id:"qs06", name:"Queso parmesano", cat:"grasa", kcal:431, p:38, g:29, c:4 },
  { id:"qs07", name:"Queso crema (tipo Philadelphia)", cat:"grasa", kcal:255, p:6, g:25, c:4 },
  { id:"qs08", name:"Queso en lonchas", cat:"grasa", kcal:300, p:18, g:24, c:3 },
  // ── SNACKS / OTROS ──
  { id:"sn01", name:"Chocolate negro 85%", cat:"postre", kcal:592, p:10, g:46, c:30 },
  { id:"sn02", name:"Chocolate con leche", cat:"postre", kcal:535, p:8, g:30, c:59 },
  { id:"sn03", name:"Galletas tipo María", cat:"postre", kcal:436, p:7, g:11, c:75 },
  { id:"sn04", name:"Miel", cat:"postre", kcal:304, p:0, g:0, c:82 },
  { id:"sn05", name:"Mermelada", cat:"postre", kcal:250, p:0, g:0, c:62 },
  { id:"sn06", name:"Tomate frito", cat:"verdura", kcal:82, p:2, g:4, c:9 },
  { id:"sn07", name:"Hummus", cat:"grasa", kcal:177, p:8, g:10, c:14 },
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

// Ideas de comidas predefinidas. Cada una define ingredientes con su alimento (id del FOOD_DB
// o macros propios) y un "peso base". La app escala las cantidades para cuadrar con el
// objetivo de kcal de cada comida del usuario.
const MEAL_IDEAS = [
  { id:"dm_avena", name:"Bowl de avena proteico", grupo:"desayuno_merienda", emoji:"🥣", desc:"Pon la avena en un cazo con agua o leche y cuécela a fuego medio 3-4 minutos removiendo hasta que espese. Pásala a un bol y deja templar un par de minutos. Añade el yogur griego por encima, coloca el plátano cortado en rodajas y termina con un hilo de crema de cacahuete. Remueve ligeramente antes de comer para integrar los sabores.",
    ingredients:[{ name:"Avena en copos", kcal:370, p:13, g:7, c:63, base:60 },{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:150 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 },{ name:"Crema de cacahuete", kcal:588, p:25, g:50, c:20, base:15 }] },
  { id:"dm_tostadas_pavo", name:"Tostadas de pavo y aguacate", grupo:"desayuno_merienda", emoji:"🥑", desc:"Tuesta las rebanadas de pan hasta que estén doradas y crujientes. Mientras, machaca el aguacate en un bol con un poco de sal y unas gotas de limón hasta lograr una crema. Extiende el aguacate sobre las tostadas, coloca encima las lonchas de pavo y remata con el tomate en rodajas finas. Un toque de pimienta negra y listo para comer.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:80 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:50 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:50 }] },
  { id:"dm_huevos", name:"Huevos revueltos con tostada", grupo:"desayuno_merienda", emoji:"🍳", desc:"Casca los huevos en un bol junto con las claras y bátelos bien con una pizca de sal. Calienta una sartén antiadherente a fuego medio con unas gotas de aceite y vierte el huevo. Remueve constantemente con una espátula para que quede cremoso y no se reseque, retirándolo cuando aún esté algo jugoso. Acompaña con el pan tostado.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Clara de huevo", kcal:52, p:11, g:0, c:1, base:100 },{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 }] },
  { id:"dm_yogur_granola", name:"Yogur con granola y fruta", grupo:"desayuno_merienda", emoji:"🥛", desc:"Vierte el yogur en un bol amplio. Añade la granola por encima repartida de forma uniforme para que quede crujiente. Lava y corta las fresas en cuartos y repártelas junto con los arándanos. Si quieres un toque dulce extra, añade un hilo de miel. Come inmediatamente para que la granola no se reblandezca.",
    ingredients:[{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:200 },{ name:"Granola", kcal:480, p:10, g:20, c:60, base:40 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:40 }] },
  { id:"dm_tortitas", name:"Tortitas de avena y plátano", grupo:"desayuno_merienda", emoji:"🥞", desc:"Tritura el plátano con un tenedor hasta hacer un puré. Mézclalo en un bol con la avena, los huevos y una pizca de canela hasta obtener una masa homogénea. Calienta una sartén antiadherente a fuego medio y vierte pequeñas porciones formando tortitas. Cocina 1-2 minutos por cada lado hasta que doren. Sirve apiladas con un hilo de miel.",
    ingredients:[{ name:"Avena en copos", kcal:370, p:13, g:7, c:63, base:50 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:100 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:100 },{ name:"Miel", kcal:304, p:0, g:0, c:82, base:15 }] },
  { id:"dm_tostada_tomate", name:"Tostada de tomate y aceite", grupo:"desayuno_merienda", emoji:"🍅", desc:"Tuesta el pan hasta que esté crujiente. Ralla el tomate maduro con un rallador y descarta la piel. Reparte el tomate rallado sobre la tostada, riega con un hilo de aceite de oliva virgen extra y añade una pizca de sal. Si quieres más proteína, acompaña con unas lonchas de pavo o jamón.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:100 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:60 }] },
  { id:"dm_batido_proteico", name:"Batido proteico de plátano", grupo:"desayuno_merienda", emoji:"🥤", desc:"Pela el plátano y trocéalo. Ponlo en la batidora junto con la leche, el yogur y la crema de cacahuete. Bate a velocidad alta hasta obtener una textura cremosa y sin grumos. Si lo prefieres más frío y espeso, añade unos cubitos de hielo y vuelve a batir. Sirve recién hecho.",
    ingredients:[{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:120 },{ name:"Leche", kcal:46, p:3, g:2, c:5, base:200 },{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:100 },{ name:"Crema de cacahuete", kcal:588, p:25, g:50, c:20, base:15 }] },
  { id:"dm_pan_quesofresco", name:"Pan con queso fresco y pavo", grupo:"desayuno_merienda", emoji:"🧀", desc:"Tuesta ligeramente el pan. Extiende el queso fresco batido sobre las rebanadas formando una capa uniforme. Coloca encima las lonchas de pavo dobladas y unas rodajas de tomate. Salpimienta al gusto y añade un hilo de aceite si lo deseas.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Queso fresco batido", kcal:60, p:11, g:0, c:4, base:80 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:50 }] },
  { id:"dm_porridge", name:"Porridge de avena con frutos rojos", grupo:"desayuno_merienda", emoji:"🫐", desc:"Calienta la leche en un cazo y, cuando empiece a humear, añade la avena. Cuece a fuego medio-bajo removiendo durante 5 minutos hasta que quede cremoso. Retira del fuego, deja reposar un minuto y sírvelo en un bol. Corona con los arándanos y las fresas troceadas y un toque de miel.",
    ingredients:[{ name:"Avena en copos", kcal:370, p:13, g:7, c:63, base:60 },{ name:"Leche", kcal:46, p:3, g:2, c:5, base:200 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:60 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:60 }] },
  { id:"dm_yogur_nueces", name:"Yogur con nueces y miel", grupo:"desayuno_merienda", emoji:"🍯", desc:"Vierte el yogur en un bol. Trocea las nueces ligeramente con las manos y repártelas por encima. Añade un hilo generoso de miel y, si quieres, un poco de canela. Remueve y disfruta como desayuno o merienda saciante.",
    ingredients:[{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:200 },{ name:"Nueces", kcal:654, p:15, g:65, c:14, base:25 },{ name:"Miel", kcal:304, p:0, g:0, c:82, base:15 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 }] },
  { id:"dm_tostada_aguacate_huevo", name:"Tostada de aguacate y huevo", grupo:"desayuno_merienda", emoji:"🥚", desc:"Cuece el huevo en agua hirviendo 7 minutos para que quede con la yema algo jugosa, o fríelo a la plancha. Tuesta el pan y extiende el aguacate machacado con sal y limón. Coloca el huevo encima, parte la yema y salpimienta. Un desayuno completo y saciante.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:60 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:50 }] },
  { id:"dm_smoothie_bowl", name:"Smoothie bowl de frutas", grupo:"desayuno_merienda", emoji:"🍓", desc:"Tritura el plátano congelado con los frutos rojos y un poco de yogur hasta lograr una crema espesa tipo helado. Viértelo en un bol y decora con granola, rodajas de fruta fresca y un hilo de crema de cacahuete. Cómelo con cuchara inmediatamente.",
    ingredients:[{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:100 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 },{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:100 },{ name:"Granola", kcal:480, p:10, g:20, c:60, base:30 }] },
  { id:"dm_requeson", name:"Requesón con fruta y miel", grupo:"desayuno_merienda", emoji:"🥝", desc:"Pon el requesón en un bol. Pela y trocea el kiwi y añádelo junto con la manzana en dados. Riega con un poco de miel y espolvorea unas almendras laminadas. Una opción rica en proteína ideal para merienda.",
    ingredients:[{ name:"Requesón", kcal:98, p:11, g:4, c:3, base:200 },{ name:"Kiwi", kcal:61, p:1, g:1, c:15, base:80 },{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:80 },{ name:"Almendras", kcal:579, p:21, g:50, c:22, base:15 }] },
  { id:"dm_tortilla_francesa_pan", name:"Tortilla francesa en pan", grupo:"desayuno_merienda", emoji:"🍞", desc:"Bate los huevos con las claras y una pizca de sal. Cuájalos en una sartén antiadherente formando una tortilla francesa fina. Tuesta el pan, coloca la tortilla dentro a modo de bocadillo y añade unas rodajas de tomate. Cierra y disfruta.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:100 },{ name:"Clara de huevo", kcal:52, p:11, g:0, c:1, base:100 },{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:40 }] },
  { id:"dm_avena_choco", name:"Avena con chocolate y plátano", grupo:"desayuno_merienda", emoji:"🍫", desc:"Cuece la avena con la leche removiendo hasta que espese. Fuera del fuego, ralla un poco de chocolate negro 85% y mézclalo para que se funda con el calor. Sirve en un bol con el plátano en rodajas por encima.",
    ingredients:[{ name:"Avena en copos", kcal:370, p:13, g:7, c:63, base:60 },{ name:"Leche", kcal:46, p:3, g:2, c:5, base:200 },{ name:"Chocolate negro 85%", kcal:600, p:8, g:46, c:34, base:15 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 }] },
  { id:"dm_kefir_fruta", name:"Kéfir con fruta y avena", grupo:"desayuno_merienda", emoji:"🥥", desc:"Sirve el kéfir en un bol. Añade la avena en copos en crudo, que se ablandará ligeramente, y reparte la fruta troceada por encima. Deja reposar 5 minutos si lo prefieres más cremoso. Opción muy digestiva y probiótica.",
    ingredients:[{ name:"Kéfir", kcal:60, p:3, g:3, c:4, base:200 },{ name:"Avena en copos", kcal:370, p:13, g:7, c:63, base:40 },{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:80 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:40 }] },
  { id:"dm_sandwich_pavo", name:"Sándwich de pavo y queso", grupo:"desayuno_merienda", emoji:"🥪", desc:"Tuesta ligeramente el pan. Monta el sándwich con las lonchas de pavo, el queso fresco y unas rodajas de tomate y lechuga. Aplasta un poco y, si quieres, dale un golpe de sartén para que el queso se funda. Práctico para llevar.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:80 },{ name:"Queso fresco batido", kcal:60, p:11, g:0, c:4, base:40 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:30 }] },
  { id:"dm_crepes_avena", name:"Crepes de avena rellenos", grupo:"desayuno_merienda", emoji:"🥯", desc:"Tritura la avena con los huevos y un poco de leche hasta tener una masa líquida. Vierte un poco en una sartén caliente y extiende formando un crep fino. Cocina por ambos lados. Rellena con queso fresco y fruta, enrolla y sirve.",
    ingredients:[{ name:"Avena en copos", kcal:370, p:13, g:7, c:63, base:40 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:100 },{ name:"Queso fresco batido", kcal:60, p:11, g:0, c:4, base:80 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 }] },
  { id:"dm_yogur_platano_almendra", name:"Yogur con plátano y almendras", grupo:"desayuno_merienda", emoji:"🥜", desc:"Vierte el yogur en un bol y añade el plátano en rodajas. Reparte las almendras troceadas por encima y un hilo de miel. Una merienda rápida, saciante y rica en grasas saludables.",
    ingredients:[{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:200 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:100 },{ name:"Almendras", kcal:579, p:21, g:50, c:22, base:20 },{ name:"Miel", kcal:304, p:0, g:0, c:82, base:10 }] },
  { id:"dm_tostada_mantequilla", name:"Tostada con crema de cacahuete y plátano", grupo:"desayuno_merienda", emoji:"🍌", desc:"Tuesta el pan. Extiende una capa de crema de cacahuete y coloca el plátano en rodajas por encima. Espolvorea un poco de canela y, si quieres, un hilo de miel. Energética e ideal antes de entrenar.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Crema de cacahuete", kcal:588, p:25, g:50, c:20, base:20 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:100 },{ name:"Miel", kcal:304, p:0, g:0, c:82, base:10 }] },
  { id:"dm_bowl_quesobatido", name:"Bowl de queso batido y frutos secos", grupo:"desayuno_merienda", emoji:"🫙", desc:"Pon el queso batido en un bol. Añade los arándanos, unas nueces troceadas y un poco de granola para dar crujiente. Termina con un hilo de miel. Muy alto en proteína para merienda.",
    ingredients:[{ name:"Queso batido 0%", kcal:60, p:11, g:0, c:4, base:200 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:60 },{ name:"Nueces", kcal:654, p:15, g:65, c:14, base:20 },{ name:"Granola", kcal:480, p:10, g:20, c:60, base:25 }] },
  { id:"dm_pan_aguacate_pavo", name:"Pan con aguacate, pavo y huevo", grupo:"desayuno_merienda", emoji:"🥗", desc:"Tuesta el pan y extiende el aguacate machacado. Coloca el pavo y un huevo a la plancha encima. Salpimienta y añade tomate. Un desayuno completo con proteína, grasa buena e hidratos.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:50 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:60 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 }] },
  { id:"dm_macedonia", name:"Macedonia con yogur", grupo:"desayuno_merienda", emoji:"🍉", desc:"Lava y trocea la manzana, el kiwi y las fresas en dados pequeños. Mézclalos en un bol y añade el yogur por encima. Remata con unas almendras laminadas. Fresco y ligero para merienda.",
    ingredients:[{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:150 },{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:100 },{ name:"Kiwi", kcal:61, p:1, g:1, c:15, base:80 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 }] },
  { id:"dm_gachas_quinoa", name:"Gachas de quinoa con fruta", grupo:"desayuno_merienda", emoji:"🌾", desc:"Cuece la quinoa en la leche a fuego medio unos 12 minutos hasta que absorba el líquido y quede cremosa. Sirve en bol con el plátano en rodajas y unos arándanos. Alternativa sin gluten a la avena.",
    ingredients:[{ name:"Quinoa (seca)", kcal:368, p:14, g:6, c:64, base:50 },{ name:"Leche", kcal:46, p:3, g:2, c:5, base:200 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:40 }] },
  { id:"dm_tostada_hummus", name:"Tostada de hummus y pavo", grupo:"desayuno_merienda", emoji:"🧆", desc:"Tuesta el pan. Extiende una capa generosa de hummus y coloca encima las lonchas de pavo y unas rodajas de tomate. Un toque de pimienta y aceite. Opción vegetal y saciante.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:80 },{ name:"Hummus", kcal:177, p:5, g:10, c:17, base:60 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:60 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:50 }] },
  { id:"ac_pollo_arroz", name:"Pollo con arroz y verduras", grupo:"almuerzo_cena", emoji:"🍗", desc:"Cuece el arroz en abundante agua con sal el tiempo que indique el paquete y escúrrelo. Salpimienta el pollo en dados y márcalo en una sartén con unas gotas de aceite hasta que dore por todos lados. Saltea el brócoli al vapor o en la misma sartén. Mezcla todo, riega con el aceite restante y sirve caliente.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Arroz blanco (seco)", kcal:360, p:7, g:1, c:80, base:70 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:150 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 }] },
  { id:"ac_pasta_ternera", name:"Pasta con ternera y tomate", grupo:"almuerzo_cena", emoji:"🍝", desc:"Cuece la pasta al dente en agua con sal. Mientras, saltea la ternera picada en una sartén con un poco de aceite hasta que pierda el color rojo. Añade el tomate triturado y deja reducir 8-10 minutos a fuego medio con sal y orégano. Mezcla la salsa con la pasta escurrida y sirve.",
    ingredients:[{ name:"Pasta (seca)", kcal:358, p:12, g:1, c:72, base:80 },{ name:"Ternera molida 5%", kcal:137, p:21, g:5, c:0, base:130 },{ name:"Tomate natural", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_salmon_patata", name:"Salmón al horno con patata", grupo:"almuerzo_cena", emoji:"🐟", desc:"Precalienta el horno a 200°C. Coloca el salmón en una bandeja con sal, pimienta y un hilo de aceite, y hornéalo 12-15 minutos. Mientras, cuece o asa la patata en dados. Sirve el salmón con la patata y una ensalada de lechuga aliñada.",
    ingredients:[{ name:"Salmón fresco", kcal:208, p:20, g:13, c:0, base:150 },{ name:"Patata (cruda)", kcal:77, p:2, g:0, c:17, base:200 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:80 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_lentejas", name:"Lentejas estofadas con verduras", grupo:"almuerzo_cena", emoji:"🍲", desc:"Pica la cebolla y la zanahoria y sofríelas en una olla con el aceite hasta que ablanden. Añade las lentejas y cúbrelas con agua. Cuece a fuego medio unos 25-30 minutos hasta que estén tiernas, añadiendo agua si hace falta. Salpimienta al final y deja reposar antes de servir.",
    ingredients:[{ name:"Lentejas (secas)", kcal:336, p:24, g:1, c:60, base:80 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:60 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:50 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 }] },
  { id:"ac_pavo_boniato", name:"Pavo con boniato asado", grupo:"almuerzo_cena", emoji:"🍠", desc:"Precalienta el horno a 200°C. Corta el boniato en dados, alíñalo con aceite y sal y ásalo 25 minutos. Salpimienta el pavo y márcalo a la plancha hasta que esté hecho. Saltea los espárragos. Sirve todo junto.",
    ingredients:[{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:160 },{ name:"Boniato (crudo)", kcal:86, p:2, g:0, c:20, base:180 },{ name:"Espárragos", kcal:20, p:2, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_merluza_horno", name:"Merluza al horno con verduras", grupo:"almuerzo_cena", emoji:"🐠", desc:"Precalienta el horno a 190°C. Coloca la merluza en una bandeja rodeada del calabacín y el pimiento en rodajas. Riega con aceite, sal y un poco de limón. Hornea 15 minutos hasta que el pescado esté jugoso. Sirve en la misma bandeja.",
    ingredients:[{ name:"Merluza", kcal:80, p:17, g:2, c:0, base:200 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:150 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:80 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_tortilla_ensalada", name:"Tortilla francesa con ensalada", grupo:"almuerzo_cena", emoji:"🍳", desc:"Bate los huevos con las claras y una pizca de sal. Cuaja la tortilla en una sartén antiadherente al gusto. Mientras, prepara una ensalada con lechuga y tomate aliñada con aceite y sal. Sirve la tortilla junto a la ensalada.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:150 },{ name:"Clara de huevo", kcal:52, p:11, g:0, c:1, base:100 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:80 }] },
  { id:"ac_atun_ensalada", name:"Ensalada de atún y huevo", grupo:"almuerzo_cena", emoji:"🥗", desc:"Cuece el huevo 10 minutos, enfríalo, pélalo y trocéalo. Escurre el atún. En un bol grande mezcla la lechuga, el maíz, el tomate, el atún y el huevo. Aliña con aceite, sal y vinagre. Una cena ligera y proteica.",
    ingredients:[{ name:"Atún en conserva", kcal:116, p:26, g:1, c:0, base:120 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:100 },{ name:"Maíz dulce", kcal:86, p:3, g:1, c:19, base:50 }] },
  { id:"ac_wrap_pollo", name:"Wrap de pollo y verduras", grupo:"almuerzo_cena", emoji:"🌯", desc:"Marca el pollo en tiras a la plancha con sal. Calienta la tortilla de trigo unos segundos por cada lado. Rellénala con el pollo, la lechuga y el tomate en tiras. Añade un poco de salsa de yogur si quieres, enrolla apretando y corta por la mitad.",
    ingredients:[{ name:"Tortilla de trigo", kcal:287, p:8, g:5, c:55, base:80 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:120 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:40 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:50 }] },
  { id:"ac_arroz_gambas", name:"Arroz salteado con gambas", grupo:"almuerzo_cena", emoji:"🍤", desc:"Cuece el arroz y escúrrelo. Saltea las gambas peladas en una sartén bien caliente con un poco de aceite y ajo. Añade el pimiento en tiras y saltea. Incorpora el arroz y saltea todo junto un par de minutos a fuego fuerte. Sirve enseguida.",
    ingredients:[{ name:"Arroz blanco (seco)", kcal:360, p:7, g:1, c:80, base:70 },{ name:"Gambas", kcal:85, p:18, g:1, c:0, base:150 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:80 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 }] },
  { id:"ac_bacalao_verduras", name:"Bacalao con verduras al horno", grupo:"almuerzo_cena", emoji:"🐡", desc:"Precalienta el horno a 190°C. Coloca el bacalao desalado sobre una cama de calabacín y cebolla en rodajas. Riega con aceite y sal y hornea 15-18 minutos. El pescado debe quedar jugoso y las verduras tiernas.",
    ingredients:[{ name:"Bacalao", kcal:82, p:18, g:1, c:0, base:200 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:150 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:60 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_cerdo_quinoa", name:"Solomillo de cerdo con quinoa", grupo:"almuerzo_cena", emoji:"🥩", desc:"Cuece la quinoa en agua con sal 12-15 minutos y escúrrela. Salpimienta el solomillo y márcalo en una sartén caliente por todos los lados hasta que esté dorado por fuera y jugoso por dentro. Saltea el brócoli. Sirve el cerdo en medallones con la quinoa y el brócoli.",
    ingredients:[{ name:"Cerdo solomillo", kcal:143, p:22, g:6, c:0, base:150 },{ name:"Quinoa (seca)", kcal:368, p:14, g:6, c:64, base:60 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:150 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_pollo_pasta", name:"Pasta con pollo y verduras", grupo:"almuerzo_cena", emoji:"🍜", desc:"Cuece la pasta al dente. Saltea el pollo en dados con un poco de aceite y añade el calabacín y el pimiento en tiras. Cuando estén tiernos, incorpora la pasta escurrida y saltea todo junto con sal y orégano.",
    ingredients:[{ name:"Pasta (seca)", kcal:358, p:12, g:1, c:72, base:80 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:130 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:100 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:60 }] },
  { id:"ac_garbanzos_espinacas", name:"Garbanzos con espinacas", grupo:"almuerzo_cena", emoji:"🫘", desc:"Si usas garbanzos secos, déjalos en remojo la noche anterior y cuécelos hasta que estén tiernos. Sofríe la cebolla, añade las espinacas hasta que reduzcan y luego los garbanzos. Saltea todo junto con aceite, sal y un poco de pimentón. Plato vegetal completo.",
    ingredients:[{ name:"Garbanzos (secos)", kcal:336, p:19, g:6, c:61, base:80 },{ name:"Espinacas", kcal:23, p:3, g:0, c:4, base:150 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:50 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 }] },
  { id:"ac_ternera_patata", name:"Ternera con patata y verduras", grupo:"almuerzo_cena", emoji:"🍖", desc:"Marca el filete de ternera en una sartén muy caliente al punto que prefieras. Cuece o asa la patata en dados. Saltea las judías o el brócoli. Sirve la ternera con la guarnición y un hilo de aceite crudo por encima.",
    ingredients:[{ name:"Filete de ternera", kcal:137, p:21, g:5, c:0, base:150 },{ name:"Patata (cruda)", kcal:77, p:2, g:0, c:17, base:200 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:120 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_salmon_quinoa", name:"Salmón con quinoa y aguacate", grupo:"almuerzo_cena", emoji:"🍱", desc:"Cuece la quinoa y escúrrela. Hornea o marca el salmón a la plancha con sal. Sirve la quinoa de base, coloca el salmón encima y acompaña con aguacate en láminas. Un plato completo rico en omega-3.",
    ingredients:[{ name:"Salmón fresco", kcal:208, p:20, g:13, c:0, base:150 },{ name:"Quinoa (seca)", kcal:368, p:14, g:6, c:64, base:60 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:50 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:60 }] },
  { id:"ac_pollo_boniato", name:"Pollo con boniato y brócoli", grupo:"almuerzo_cena", emoji:"🍛", desc:"Asa el boniato en dados al horno a 200°C unos 25 minutos. Marca el pollo en dados a la plancha con sal. Cuece el brócoli al vapor. Mezcla todo en un bol y aliña con aceite y especias al gusto. Clásico fitness equilibrado.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Boniato (crudo)", kcal:86, p:2, g:0, c:20, base:180 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:150 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_tofu_salteado", name:"Tofu salteado con verduras", grupo:"almuerzo_cena", emoji:"🥡", desc:"Corta el tofu en dados y séllalo en una sartén caliente con un poco de aceite hasta que dore. Retíralo y saltea el pimiento, el calabacín y la cebolla. Devuelve el tofu, añade salsa de soja y saltea todo junto. Sirve con arroz si quieres.",
    ingredients:[{ name:"Tofu", kcal:76, p:8, g:5, c:2, base:200 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:100 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:100 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 }] },
  { id:"ac_couscous_pollo", name:"Cuscús con pollo y verduras", grupo:"almuerzo_cena", emoji:"🍲", desc:"Hidrata el cuscús cubriéndolo con agua hirviendo y sal, tapa 5 minutos y suelta los granos con un tenedor. Marca el pollo en dados y saltea las verduras. Mezcla todo con el cuscús y un hilo de aceite. Rápido y completo.",
    ingredients:[{ name:"Cuscús (seco)", kcal:376, p:12, g:1, c:77, base:70 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:130 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:80 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:80 }] },
  { id:"ac_sardinas_ensalada", name:"Sardinas con ensalada de patata", grupo:"almuerzo_cena", emoji:"🐟", desc:"Cuece la patata entera, pélala y córtala en rodajas. Mézclala con cebolla picada, aceite y sal. Sirve las sardinas (a la plancha o en conserva) sobre la ensalada templada de patata. Económico y rico en omega-3.",
    ingredients:[{ name:"Sardinas", kcal:185, p:25, g:10, c:0, base:120 },{ name:"Patata (cruda)", kcal:77, p:2, g:0, c:17, base:200 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:40 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:8 }] },
  { id:"ac_huevos_revueltos_verdura", name:"Revuelto de huevos con verduras", grupo:"almuerzo_cena", emoji:"🍳", desc:"Saltea el calabacín y el pimiento picados en una sartén con aceite hasta que ablanden. Baja el fuego, añade los huevos batidos con las claras y remueve hasta cuajar al gusto. Salpimienta. Cena rápida y proteica.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Clara de huevo", kcal:52, p:11, g:0, c:1, base:100 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:100 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:80 }] },
  { id:"ac_pollo_ensalada", name:"Ensalada completa de pollo", grupo:"almuerzo_cena", emoji:"🥙", desc:"Marca el pollo en tiras a la plancha y deja templar. En un bol grande mezcla lechuga, tomate, maíz y el pollo. Añade aguacate en dados. Aliña con aceite, sal y vinagre. Una ensalada saciante de plato único.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Lechuga", kcal:15, p:1, g:0, c:2, base:100 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:80 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:50 }] },
  { id:"ac_arroz_atun", name:"Arroz con atún y tomate", grupo:"almuerzo_cena", emoji:"🍚", desc:"Cuece el arroz y escúrrelo. Escurre el atún y mézclalo con el arroz templado. Añade tomate natural en dados, maíz y un hilo de aceite. Remueve bien. Se puede comer caliente o frío como ensalada de arroz.",
    ingredients:[{ name:"Arroz blanco (seco)", kcal:360, p:7, g:1, c:80, base:70 },{ name:"Atún en conserva", kcal:116, p:26, g:1, c:0, base:120 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:80 },{ name:"Maíz dulce", kcal:86, p:3, g:1, c:19, base:50 }] },
  { id:"ac_pavo_pasta", name:"Pasta integral con pavo", grupo:"almuerzo_cena", emoji:"🍝", desc:"Cuece la pasta al dente. Saltea el pavo picado con cebolla y tomate triturado hasta reducir. Mezcla con la pasta y sirve con un poco de queso rallado por encima si quieres. Cena ligera y proteica.",
    ingredients:[{ name:"Pasta (seca)", kcal:358, p:12, g:1, c:72, base:80 },{ name:"Pechuga de pavo", kcal:135, p:29, g:2, c:0, base:140 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:40 }] },
  { id:"ac_merluza_patata", name:"Merluza con patata cocida", grupo:"almuerzo_cena", emoji:"🍽️", desc:"Cuece la patata en dados. En la misma agua o al vapor, cuece la merluza unos minutos hasta que esté jugosa. Sirve con un sofrito ligero de ajo y pimentón con aceite por encima, y unas judías verdes de guarnición.",
    ingredients:[{ name:"Merluza", kcal:80, p:17, g:2, c:0, base:200 },{ name:"Patata (cruda)", kcal:77, p:2, g:0, c:17, base:180 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:120 },{ name:"Aceite de oliva", kcal:900, p:0, g:100, c:0, base:10 }] },

  // ═══ AMPLIACIÓN — Desayuno / Merienda ═══
  { id:"dm_x01", name:"Tortilla francesa con pan", grupo:"desayuno_merienda", emoji:"🍳", desc:"Bate los huevos con una pizca de sal. Cuájalos en una sartén antiadherente con unas gotas de aceite, doblando la tortilla. Acompaña con el pan tostado.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:50 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:5 }] },
  { id:"dm_x02", name:"Tostada de aguacate y huevo", grupo:"desayuno_merienda", emoji:"🥑", desc:"Tuesta el pan. Machaca el aguacate con sal y extiéndelo sobre la tostada. Coloca encima un huevo poché o a la plancha.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:60 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 }] },
  { id:"dm_x03", name:"Yogur griego con frutos rojos y nueces", grupo:"desayuno_merienda", emoji:"🫐", desc:"Pon el yogur en un bol, añade los frutos rojos y las nueces troceadas por encima. Endulza con un hilo de miel si quieres.",
    ingredients:[{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:170 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:60 },{ name:"Nueces", kcal:654, p:15, g:65, c:14, base:15 }] },
  { id:"dm_x04", name:"Porridge de avena con manzana y canela", grupo:"desayuno_merienda", emoji:"🍎", desc:"Cuece la avena con la leche a fuego medio removiendo hasta que espese. Añade la manzana en dados y espolvorea canela.",
    ingredients:[{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:50 },{ name:"Leche semidesnatada", kcal:46, p:3, g:2, c:5, base:200 },{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:100 }] },
  { id:"dm_x05", name:"Batido de plátano y avena", grupo:"desayuno_merienda", emoji:"🥤", desc:"Tritura el plátano con la leche, la avena y la proteína hasta que quede cremoso. Sirve frío.",
    ingredients:[{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:100 },{ name:"Leche desnatada", kcal:34, p:3, g:0, c:5, base:200 },{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:30 },{ name:"Proteína whey", kcal:400, p:80, g:7, c:8, base:30 }] },
  { id:"dm_x06", name:"Tostadas con queso fresco y tomate", grupo:"desayuno_merienda", emoji:"🍅", desc:"Tuesta el pan, unta el queso fresco batido y cubre con rodajas de tomate. Sal, pimienta y un hilo de aceite.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:70 },{ name:"Queso fresco batido 0%", kcal:47, p:8, g:0, c:4, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:80 }] },
  { id:"dm_x07", name:"Tortitas de avena y clara", grupo:"desayuno_merienda", emoji:"🥞", desc:"Tritura la avena con las claras y el plátano hasta una masa homogénea. Haz las tortitas en sartén antiadherente vuelta y vuelta.",
    ingredients:[{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:50 },{ name:"Clara de huevo", kcal:52, p:11, g:0, c:1, base:120 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:60 }] },
  { id:"dm_x08", name:"Bol de skyr con granola", grupo:"desayuno_merienda", emoji:"🥛", desc:"Pon el skyr en un bol y añade la granola y unas fresas troceadas por encima.",
    ingredients:[{ name:"Yogur proteico (skyr)", kcal:63, p:11, g:0, c:4, base:170 },{ name:"Granola", kcal:471, p:10, g:20, c:64, base:40 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 }] },
  { id:"dm_x09", name:"Sándwich de pavo y queso", grupo:"desayuno_merienda", emoji:"🥪", desc:"Monta el sándwich con el pan, las lonchas de pavo y el queso. Tuesta en sandwichera o sartén.",
    ingredients:[{ name:"Pan de molde integral", kcal:248, p:9, g:4, c:42, base:70 },{ name:"Pavo en lonchas", kcal:104, p:18, g:3, c:1, base:60 },{ name:"Queso en lonchas", kcal:300, p:18, g:24, c:3, base:20 }] },
  { id:"dm_x10", name:"Requesón con miel y nueces", grupo:"desayuno_merienda", emoji:"🍯", desc:"Pon el requesón en un bol, añade un hilo de miel y las nueces troceadas.",
    ingredients:[{ name:"Requesón", kcal:97, p:11, g:4, c:3, base:150 },{ name:"Miel", kcal:304, p:0, g:0, c:82, base:15 },{ name:"Nueces", kcal:654, p:15, g:65, c:14, base:15 }] },
  { id:"dm_x11", name:"Tostada de crema de cacahuete y plátano", grupo:"desayuno_merienda", emoji:"🥜", desc:"Tuesta el pan, unta la crema de cacahuete y coloca el plátano en rodajas encima.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 },{ name:"Crema de cacahuete", kcal:588, p:25, g:50, c:20, base:20 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 }] },
  { id:"dm_x12", name:"Huevos revueltos con espinacas", grupo:"desayuno_merienda", emoji:"🍳", desc:"Saltea las espinacas en la sartén. Añade los huevos batidos y remueve a fuego suave hasta cuajar. Acompaña con pan.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Espinacas", kcal:23, p:3, g:0, c:4, base:80 },{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:40 }] },
  { id:"dm_x13", name:"Smoothie verde", grupo:"desayuno_merienda", emoji:"🥬", desc:"Tritura las espinacas con el plátano, el kiwi y la bebida vegetal hasta que quede fino.",
    ingredients:[{ name:"Espinacas", kcal:23, p:3, g:0, c:4, base:40 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:100 },{ name:"Kiwi", kcal:61, p:1, g:1, c:15, base:80 },{ name:"Bebida de avena", kcal:46, p:1, g:1, c:8, base:200 }] },
  { id:"dm_x14", name:"Pan con tomate y jamón serrano", grupo:"desayuno_merienda", emoji:"🍅", desc:"Tuesta el pan, restriega el tomate, añade un hilo de aceite y cubre con el jamón serrano.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:70 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:60 },{ name:"Jamón serrano", kcal:241, p:31, g:13, c:0, base:40 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:5 }] },
  { id:"dm_x15", name:"Cuenco de fruta y yogur", grupo:"desayuno_merienda", emoji:"🍓", desc:"Trocea la fruta variada en un bol y añade el yogur natural por encima.",
    ingredients:[{ name:"Yogur natural", kcal:61, p:4, g:3, c:5, base:150 },{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:100 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:40 }] },
  { id:"dm_x16", name:"Tortilla de claras con avena", grupo:"desayuno_merienda", emoji:"🍳", desc:"Mezcla las claras con la avena y cuaja en sartén como una tortita grande. Ideal pre/post entreno.",
    ingredients:[{ name:"Clara de huevo", kcal:52, p:11, g:0, c:1, base:200 },{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:40 }] },
  { id:"dm_x17", name:"Tostadas de pavo y aguacate", grupo:"desayuno_merienda", emoji:"🥑", desc:"Tuesta el pan, extiende el aguacate machacado y coloca las lonchas de pavo encima.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:50 },{ name:"Pavo en lonchas", kcal:104, p:18, g:3, c:1, base:50 }] },
  { id:"dm_x18", name:"Café con leche y tostada integral", grupo:"desayuno_merienda", emoji:"☕", desc:"Prepara el café con la leche. Acompaña con pan integral tostado con un poco de aceite.",
    ingredients:[{ name:"Leche semidesnatada", kcal:46, p:3, g:2, c:5, base:200 },{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:5 }] },
  { id:"dm_x19", name:"Yogur con dátiles y almendras", grupo:"desayuno_merienda", emoji:"🌰", desc:"Trocea los dátiles y las almendras y mézclalos con el yogur griego.",
    ingredients:[{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:170 },{ name:"Dátiles", kcal:282, p:2, g:0, c:75, base:30 },{ name:"Almendras", kcal:579, p:21, g:50, c:22, base:15 }] },
  { id:"dm_x20", name:"Tortitas de arroz con queso y pavo", grupo:"desayuno_merienda", emoji:"🍘", desc:"Unta las tortitas de arroz con queso crema y coloca pavo en lonchas encima.",
    ingredients:[{ name:"Tortitas de arroz", kcal:387, p:8, g:3, c:81, base:30 },{ name:"Queso crema (tipo Philadelphia)", kcal:255, p:6, g:25, c:4, base:30 },{ name:"Pavo en lonchas", kcal:104, p:18, g:3, c:1, base:50 }] },
  { id:"dm_x21", name:"Gachas de avena con cacao", grupo:"desayuno_merienda", emoji:"🍫", desc:"Cuece la avena con la leche y añade cacao puro en polvo removiendo. Endulza al gusto.",
    ingredients:[{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:50 },{ name:"Leche desnatada", kcal:34, p:3, g:0, c:5, base:200 },{ name:"Chocolate negro 85%", kcal:592, p:10, g:46, c:30, base:10 }] },
  { id:"dm_x22", name:"Bocadillo de tortilla", grupo:"desayuno_merienda", emoji:"🥖", desc:"Haz una tortilla francesa y métela en el pan. Clásico y saciante.",
    ingredients:[{ name:"Pan blanco", kcal:265, p:9, g:3, c:49, base:80 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:5 }] },
  { id:"dm_x23", name:"Bol de kéfir con semillas", grupo:"desayuno_merienda", emoji:"🥣", desc:"Pon el kéfir en un bol, añade semillas de chía y fruta troceada. Deja reposar 5 min.",
    ingredients:[{ name:"Kéfir", kcal:55, p:3, g:3, c:4, base:200 },{ name:"Semillas de chía", kcal:486, p:17, g:31, c:42, base:15 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 }] },
  { id:"dm_x24", name:"Tostada de hummus y tomate", grupo:"desayuno_merienda", emoji:"🧆", desc:"Tuesta el pan, unta el hummus y cubre con rodajas de tomate y una pizca de sal.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 },{ name:"Hummus", kcal:177, p:8, g:10, c:14, base:50 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:60 }] },
  { id:"dm_x25", name:"Macedonia con frutos secos", grupo:"desayuno_merienda", emoji:"🍇", desc:"Trocea varias frutas en un bol y añade un puñado de frutos secos. Fresco y rápido.",
    ingredients:[{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:100 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 },{ name:"Uvas", kcal:69, p:1, g:0, c:18, base:80 },{ name:"Almendras", kcal:579, p:21, g:50, c:22, base:20 }] },
  { id:"dm_x26", name:"Pudding de chía", grupo:"desayuno_merienda", emoji:"🍮", desc:"Mezcla las semillas de chía con la bebida vegetal y deja reposar en la nevera al menos 2h. Añade fruta al servir.",
    ingredients:[{ name:"Semillas de chía", kcal:486, p:17, g:31, c:42, base:25 },{ name:"Bebida de almendra", kcal:24, p:1, g:1, c:3, base:200 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:60 }] },
  { id:"dm_x27", name:"Tostada francesa fit", grupo:"desayuno_merienda", emoji:"🍞", desc:"Empapa el pan en huevo batido con un poco de leche y canela. Dóralo en la sartén vuelta y vuelta.",
    ingredients:[{ name:"Pan de molde integral", kcal:248, p:9, g:4, c:42, base:70 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 },{ name:"Leche desnatada", kcal:34, p:3, g:0, c:5, base:50 }] },
  { id:"dm_x28", name:"Queso batido con avena y fruta", grupo:"desayuno_merienda", emoji:"🥛", desc:"Mezcla el queso batido con la avena y deja reposar. Añade fruta troceada antes de comer.",
    ingredients:[{ name:"Queso fresco batido 0%", kcal:47, p:8, g:0, c:4, base:200 },{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:40 },{ name:"Manzana", kcal:52, p:0, g:0, c:14, base:100 }] },
  { id:"dm_x29", name:"Mini bocadillo de jamón york y queso", grupo:"desayuno_merienda", emoji:"🥪", desc:"Rellena el pan con jamón cocido y queso. Perfecto para media mañana.",
    ingredients:[{ name:"Pan blanco", kcal:265, p:9, g:3, c:49, base:60 },{ name:"Jamón cocido / york", kcal:107, p:18, g:4, c:1, base:50 },{ name:"Queso en lonchas", kcal:300, p:18, g:24, c:3, base:20 }] },
  { id:"dm_x30", name:"Avena overnight", grupo:"desayuno_merienda", emoji:"🌙", desc:"Mezcla la avena con el yogur y la leche en un bote y deja en la nevera toda la noche. Añade fruta al día siguiente.",
    ingredients:[{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:50 },{ name:"Yogur griego 0%", kcal:57, p:10, g:0, c:4, base:100 },{ name:"Leche desnatada", kcal:34, p:3, g:0, c:5, base:100 },{ name:"Arándanos", kcal:57, p:1, g:0, c:14, base:50 }] },
  { id:"dm_x31", name:"Tortilla de queso fresco", grupo:"desayuno_merienda", emoji:"🍳", desc:"Bate los huevos, añade el queso fresco en dados y cuaja en la sartén. Alto en proteína.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 },{ name:"Queso fresco", kcal:174, p:13, g:13, c:3, base:50 }] },
  { id:"dm_x32", name:"Crepes de avena dulces", grupo:"desayuno_merienda", emoji:"🥞", desc:"Tritura avena, huevo y leche hasta una masa líquida. Haz crepes finos en sartén y rellénalos de fruta.",
    ingredients:[{ name:"Avena en copos", kcal:389, p:17, g:7, c:66, base:40 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 },{ name:"Leche desnatada", kcal:34, p:3, g:0, c:5, base:100 },{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:80 }] },
  { id:"dm_x33", name:"Yogur proteico con cacao y nueces", grupo:"desayuno_merienda", emoji:"🍫", desc:"Mezcla el skyr con cacao puro y añade nueces troceadas. Postre o merienda saciante.",
    ingredients:[{ name:"Yogur proteico (skyr)", kcal:63, p:11, g:0, c:4, base:200 },{ name:"Chocolate negro 85%", kcal:592, p:10, g:46, c:30, base:10 },{ name:"Nueces", kcal:654, p:15, g:65, c:14, base:15 }] },
  { id:"dm_x34", name:"Tostada de requesón y miel", grupo:"desayuno_merienda", emoji:"🍯", desc:"Tuesta el pan, unta el requesón y añade un hilo de miel por encima.",
    ingredients:[{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:60 },{ name:"Requesón", kcal:97, p:11, g:4, c:3, base:80 },{ name:"Miel", kcal:304, p:0, g:0, c:82, base:15 }] },
  { id:"dm_x35", name:"Batido proteico de fresa", grupo:"desayuno_merienda", emoji:"🍓", desc:"Tritura las fresas con la leche y la proteína. Refrescante y rápido tras entrenar.",
    ingredients:[{ name:"Fresas", kcal:32, p:1, g:0, c:8, base:150 },{ name:"Leche desnatada", kcal:34, p:3, g:0, c:5, base:250 },{ name:"Proteína whey", kcal:400, p:80, g:7, c:8, base:30 }] },
  { id:"dm_x36", name:"Pan de centeno con aguacate y semillas", grupo:"desayuno_merienda", emoji:"🥑", desc:"Tuesta el pan de centeno, extiende el aguacate y espolvorea semillas de calabaza.",
    ingredients:[{ name:"Pan de centeno", kcal:259, p:9, g:3, c:48, base:60 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:60 },{ name:"Semillas de calabaza", kcal:559, p:30, g:49, c:11, base:10 }] },
  { id:"dm_x37", name:"Cuenco de queso cottage y piña", grupo:"desayuno_merienda", emoji:"🍍", desc:"Pon el queso cottage en un bol y añade la piña troceada. Combinación dulce y proteica.",
    ingredients:[{ name:"Queso cottage", kcal:98, p:11, g:4, c:3, base:150 },{ name:"Piña", kcal:50, p:1, g:0, c:13, base:120 }] },
  { id:"dm_x38", name:"Tortitas de plátano y huevo", grupo:"desayuno_merienda", emoji:"🍌", desc:"Machaca el plátano, mézclalo con el huevo y haz tortitas pequeñas en la sartén. Solo 2 ingredientes.",
    ingredients:[{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:120 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 }] },
  { id:"dm_x39", name:"Bol de granola con bebida de soja", grupo:"desayuno_merienda", emoji:"🥣", desc:"Pon la granola en un bol y cubre con bebida de soja. Añade fruta si quieres.",
    ingredients:[{ name:"Granola", kcal:471, p:10, g:20, c:64, base:50 },{ name:"Bebida de soja", kcal:42, p:3, g:2, c:3, base:200 },{ name:"Plátano", kcal:89, p:1, g:0, c:23, base:80 }] },
  { id:"dm_x40", name:"Tostada de salmón ahumado y queso crema", grupo:"desayuno_merienda", emoji:"🐟", desc:"Tuesta el pan, unta el queso crema y coloca el salmón ahumado encima. Un desayuno premium.",
    ingredients:[{ name:"Pan de centeno", kcal:259, p:9, g:3, c:48, base:60 },{ name:"Queso crema (tipo Philadelphia)", kcal:255, p:6, g:25, c:4, base:30 },{ name:"Salmón", kcal:208, p:20, g:13, c:0, base:50 }] },

  // ═══ AMPLIACIÓN — Almuerzo / Cena ═══
  { id:"ac_x01", name:"Pollo a la plancha con arroz y verduras", grupo:"almuerzo_cena", emoji:"🍗", desc:"Cocina el arroz. Haz la pechuga a la plancha con sal y pimienta. Saltea las verduras y sirve todo junto con un hilo de aceite.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Arroz blanco", kcal:360, p:7, g:1, c:80, base:70 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:150 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x02", name:"Salmón al horno con patata", grupo:"almuerzo_cena", emoji:"🐟", desc:"Hornea el salmón 15 min a 200°C con sal y limón. Acompaña con patata asada y verduras.",
    ingredients:[{ name:"Salmón", kcal:208, p:20, g:13, c:0, base:150 },{ name:"Patata cocida", kcal:87, p:2, g:0, c:20, base:200 },{ name:"Espárragos", kcal:20, p:2, g:0, c:4, base:100 }] },
  { id:"ac_x03", name:"Lentejas guisadas con verduras", grupo:"almuerzo_cena", emoji:"🍲", desc:"Sofríe cebolla y zanahoria, añade las lentejas cocidas y un poco de caldo. Guisa 10 min.",
    ingredients:[{ name:"Lentejas (cocidas)", kcal:116, p:9, g:0, c:20, base:250 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:80 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:60 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x04", name:"Ternera salteada con verduras y arroz", grupo:"almuerzo_cena", emoji:"🥩", desc:"Saltea la ternera en tiras a fuego fuerte. Añade las verduras y sirve con arroz.",
    ingredients:[{ name:"Ternera magra", kcal:158, p:26, g:6, c:0, base:150 },{ name:"Arroz basmati", kcal:356, p:8, g:1, c:78, base:70 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:100 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:60 }] },
  { id:"ac_x05", name:"Merluza al horno con verduras", grupo:"almuerzo_cena", emoji:"🐟", desc:"Hornea la merluza con rodajas de patata, cebolla y un chorrito de aceite 20 min a 190°C.",
    ingredients:[{ name:"Merluza", kcal:90, p:18, g:2, c:0, base:200 },{ name:"Patata cocida", kcal:87, p:2, g:0, c:20, base:180 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:80 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x06", name:"Ensalada de garbanzos y atún", grupo:"almuerzo_cena", emoji:"🥗", desc:"Mezcla los garbanzos con el atún escurrido, tomate, cebolla y un aliño de aceite y vinagre.",
    ingredients:[{ name:"Garbanzos (cocidos)", kcal:139, p:8, g:3, c:21, base:200 },{ name:"Atún al natural (lata)", kcal:116, p:26, g:1, c:0, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x07", name:"Pavo con boniato y brócoli", grupo:"almuerzo_cena", emoji:"🦃", desc:"Haz la pechuga de pavo a la plancha. Asa el boniato y cuece el brócoli al vapor.",
    ingredients:[{ name:"Pechuga de pavo", kcal:135, p:29, g:1, c:0, base:150 },{ name:"Boniato / batata", kcal:86, p:2, g:0, c:20, base:200 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:150 }] },
  { id:"ac_x08", name:"Pasta con atún y tomate", grupo:"almuerzo_cena", emoji:"🍝", desc:"Cuece la pasta. Calienta el tomate frito con el atún y mezcla con la pasta.",
    ingredients:[{ name:"Pasta (espaguetis)", kcal:358, p:12, g:1, c:72, base:80 },{ name:"Atún al natural (lata)", kcal:116, p:26, g:1, c:0, base:80 },{ name:"Tomate frito", kcal:82, p:2, g:4, c:9, base:100 }] },
  { id:"ac_x09", name:"Tortilla de patata ligera", grupo:"almuerzo_cena", emoji:"🥚", desc:"Cuece la patata en dados, mézclala con el huevo batido y cuaja la tortilla en la sartén.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:180 },{ name:"Patata cocida", kcal:87, p:2, g:0, c:20, base:200 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x10", name:"Wok de pollo y verduras con noodles", grupo:"almuerzo_cena", emoji:"🥢", desc:"Saltea el pollo en tiras, añade las verduras y los noodles cocidos. Salsa de soja al gusto.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Fideos / noodles (secos)", kcal:348, p:11, g:1, c:71, base:70 },{ name:"Pimiento verde", kcal:20, p:1, g:0, c:5, base:80 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:80 }] },
  { id:"ac_x11", name:"Dorada a la espalda con ensalada", grupo:"almuerzo_cena", emoji:"🐟", desc:"Haz la dorada a la plancha abierta. Acompaña con una ensalada verde aliñada.",
    ingredients:[{ name:"Dorada", kcal:96, p:20, g:2, c:0, base:200 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x12", name:"Arroz con pollo y verduras", grupo:"almuerzo_cena", emoji:"🍚", desc:"Sofríe el pollo en dados, añade las verduras y el arroz con caldo. Cocina hasta que el arroz esté listo.",
    ingredients:[{ name:"Arroz blanco", kcal:360, p:7, g:1, c:80, base:80 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:130 },{ name:"Guisantes", kcal:81, p:5, g:0, c:14, base:60 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:80 }] },
  { id:"ac_x13", name:"Hamburguesa de ternera con ensalada", grupo:"almuerzo_cena", emoji:"🍔", desc:"Forma la hamburguesa con la carne picada y hazla a la plancha. Sirve en pan con verduras.",
    ingredients:[{ name:"Carne picada mixta", kcal:215, p:19, g:15, c:0, base:150 },{ name:"Pan de hamburguesa", kcal:280, p:9, g:5, c:48, base:70 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:40 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:50 }] },
  { id:"ac_x14", name:"Crema de calabacín con pollo", grupo:"almuerzo_cena", emoji:"🥣", desc:"Cuece el calabacín y la cebolla, tritura con un poco de caldo. Acompaña con dados de pollo a la plancha.",
    ingredients:[{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:300 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:60 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:120 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x15", name:"Tacos de pollo", grupo:"almuerzo_cena", emoji:"🌮", desc:"Saltea el pollo con especias. Rellena las tortillas de trigo con pollo, verduras y un poco de salsa.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Tortilla de trigo (wrap)", kcal:287, p:8, g:5, c:55, base:80 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:60 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:40 }] },
  { id:"ac_x16", name:"Salteado de gambas y verduras", grupo:"almuerzo_cena", emoji:"🦐", desc:"Saltea las gambas con ajo, añade las verduras y sirve con arroz basmati.",
    ingredients:[{ name:"Gambas / langostinos", kcal:99, p:21, g:1, c:0, base:150 },{ name:"Arroz basmati", kcal:356, p:8, g:1, c:78, base:70 },{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:100 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:80 }] },
  { id:"ac_x17", name:"Bowl de quinoa, pollo y aguacate", grupo:"almuerzo_cena", emoji:"🥗", desc:"Cuece la quinoa. Monta el bowl con pollo a la plancha, aguacate y verduras frescas.",
    ingredients:[{ name:"Quinoa (seca)", kcal:368, p:14, g:6, c:64, base:60 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:130 },{ name:"Aguacate", kcal:160, p:2, g:15, c:9, base:60 },{ name:"Tomate cherry", kcal:18, p:1, g:0, c:4, base:80 }] },
  { id:"ac_x18", name:"Revuelto de gambas y espárragos", grupo:"almuerzo_cena", emoji:"🍳", desc:"Saltea los espárragos y las gambas, añade el huevo batido y revuelve hasta cuajar.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:150 },{ name:"Gambas / langostinos", kcal:99, p:21, g:1, c:0, base:100 },{ name:"Espárragos", kcal:20, p:2, g:0, c:4, base:120 }] },
  { id:"ac_x19", name:"Lomo de cerdo con puré de patata", grupo:"almuerzo_cena", emoji:"🥩", desc:"Haz el lomo a la plancha. Acompaña con puré de patata casero y verduras.",
    ingredients:[{ name:"Lomo de cerdo", kcal:208, p:27, g:11, c:0, base:150 },{ name:"Patata cocida", kcal:87, p:2, g:0, c:20, base:200 },{ name:"Judías verdes", kcal:31, p:2, g:0, c:7, base:120 }] },
  { id:"ac_x20", name:"Ensalada de pasta con pollo", grupo:"almuerzo_cena", emoji:"🥗", desc:"Cuece la pasta y déjala enfriar. Mezcla con pollo, tomate cherry y un aliño ligero.",
    ingredients:[{ name:"Pasta (espaguetis)", kcal:358, p:12, g:1, c:72, base:70 },{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:120 },{ name:"Tomate cherry", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x21", name:"Bacalao con garbanzos y espinacas", grupo:"almuerzo_cena", emoji:"🐟", desc:"Saltea las espinacas con los garbanzos cocidos y añade el bacalao desmigado. Guiso rápido y completo.",
    ingredients:[{ name:"Bacalao fresco", kcal:82, p:18, g:1, c:0, base:150 },{ name:"Garbanzos (cocidos)", kcal:139, p:8, g:3, c:21, base:150 },{ name:"Espinacas", kcal:23, p:3, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x22", name:"Pollo al curry con arroz", grupo:"almuerzo_cena", emoji:"🍛", desc:"Saltea el pollo, añade curry y un poco de bebida de coco o leche. Sirve con arroz basmati.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Arroz basmati", kcal:356, p:8, g:1, c:78, base:70 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:60 }] },
  { id:"ac_x23", name:"Tortilla de espinacas y queso", grupo:"almuerzo_cena", emoji:"🍳", desc:"Saltea las espinacas, añade el huevo batido y el queso fresco. Cuaja la tortilla.",
    ingredients:[{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:150 },{ name:"Espinacas", kcal:23, p:3, g:0, c:4, base:100 },{ name:"Queso fresco", kcal:174, p:13, g:13, c:3, base:50 }] },
  { id:"ac_x24", name:"Ensalada César con pollo", grupo:"almuerzo_cena", emoji:"🥗", desc:"Mezcla lechuga, pollo a la plancha, picatostes y un poco de queso parmesano con salsa césar ligera.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:100 },{ name:"Pan blanco", kcal:265, p:9, g:3, c:49, base:30 },{ name:"Queso parmesano", kcal:431, p:38, g:29, c:4, base:15 }] },
  { id:"ac_x25", name:"Albóndigas de pavo con tomate", grupo:"almuerzo_cena", emoji:"🍝", desc:"Forma albóndigas con la carne de pavo, dóralas y cuécelas en salsa de tomate. Sirve con pasta o arroz.",
    ingredients:[{ name:"Pechuga de pavo", kcal:135, p:29, g:1, c:0, base:150 },{ name:"Tomate frito", kcal:82, p:2, g:4, c:9, base:120 },{ name:"Arroz blanco", kcal:360, p:7, g:1, c:80, base:60 }] },
  { id:"ac_x26", name:"Salmón con quinoa y espárragos", grupo:"almuerzo_cena", emoji:"🐟", desc:"Cuece la quinoa, haz el salmón a la plancha y saltea los espárragos. Plato completo y omega-3.",
    ingredients:[{ name:"Salmón", kcal:208, p:20, g:13, c:0, base:150 },{ name:"Quinoa (seca)", kcal:368, p:14, g:6, c:64, base:60 },{ name:"Espárragos", kcal:20, p:2, g:0, c:4, base:120 }] },
  { id:"ac_x27", name:"Pisto con huevo", grupo:"almuerzo_cena", emoji:"🍅", desc:"Sofríe calabacín, pimiento, cebolla y tomate hasta hacer el pisto. Sirve con un huevo a la plancha encima.",
    ingredients:[{ name:"Calabacín", kcal:17, p:1, g:0, c:3, base:150 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:100 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:150 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:120 }] },
  { id:"ac_x28", name:"Wrap de pavo y verduras", grupo:"almuerzo_cena", emoji:"🌯", desc:"Rellena la tortilla de trigo con pavo, lechuga, tomate y un poco de queso. Enrolla y listo.",
    ingredients:[{ name:"Tortilla de trigo (wrap)", kcal:287, p:8, g:5, c:55, base:80 },{ name:"Pavo en lonchas", kcal:104, p:18, g:3, c:1, base:80 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:40 },{ name:"Queso en lonchas", kcal:300, p:18, g:24, c:3, base:20 }] },
  { id:"ac_x29", name:"Guiso de alubias con verduras", grupo:"almuerzo_cena", emoji:"🍲", desc:"Sofríe verduras, añade las alubias cocidas y caldo. Guisa 15 min. Reconfortante y proteico.",
    ingredients:[{ name:"Alubias / judías (cocidas)", kcal:127, p:9, g:1, c:23, base:250 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:80 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:60 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x30", name:"Pechuga rellena de queso y pavo", grupo:"almuerzo_cena", emoji:"🍗", desc:"Abre la pechuga, rellena con queso y pavo, ciérrala y hazla al horno o plancha. Sirve con ensalada.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:180 },{ name:"Queso en lonchas", kcal:300, p:18, g:24, c:3, base:20 },{ name:"Pavo en lonchas", kcal:104, p:18, g:3, c:1, base:30 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:80 }] },
  { id:"ac_x31", name:"Calamares a la plancha con ensalada", grupo:"almuerzo_cena", emoji:"🦑", desc:"Haz los calamares a la plancha con ajo y perejil. Acompaña con ensalada verde.",
    ingredients:[{ name:"Calamar", kcal:92, p:16, g:1, c:3, base:200 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x32", name:"Macarrones con carne picada", grupo:"almuerzo_cena", emoji:"🍝", desc:"Cuece los macarrones. Sofríe la carne picada con tomate y mézclalo todo. Clásico saciante.",
    ingredients:[{ name:"Macarrones", kcal:358, p:12, g:1, c:72, base:80 },{ name:"Carne picada mixta", kcal:215, p:19, g:15, c:0, base:120 },{ name:"Tomate frito", kcal:82, p:2, g:4, c:9, base:100 }] },
  { id:"ac_x33", name:"Trucha al horno con patata", grupo:"almuerzo_cena", emoji:"🐟", desc:"Hornea la trucha con limón y hierbas 18 min. Acompaña con patata asada.",
    ingredients:[{ name:"Trucha", kcal:119, p:20, g:4, c:0, base:200 },{ name:"Patata cocida", kcal:87, p:2, g:0, c:20, base:180 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x34", name:"Ensalada de lentejas y huevo", grupo:"almuerzo_cena", emoji:"🥗", desc:"Mezcla las lentejas cocidas frías con tomate, cebolla y huevo duro. Aliña al gusto.",
    ingredients:[{ name:"Lentejas (cocidas)", kcal:116, p:9, g:0, c:20, base:200 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:40 }] },
  { id:"ac_x35", name:"Pollo teriyaki con arroz", grupo:"almuerzo_cena", emoji:"🍱", desc:"Saltea el pollo en dados con salsa teriyaki hasta caramelizar. Sirve sobre arroz blanco.",
    ingredients:[{ name:"Pechuga de pollo", kcal:165, p:31, g:4, c:0, base:150 },{ name:"Arroz blanco", kcal:360, p:7, g:1, c:80, base:75 },{ name:"Cebolla", kcal:40, p:1, g:0, c:9, base:40 }] },
  { id:"ac_x36", name:"Crema de verduras con picatostes", grupo:"almuerzo_cena", emoji:"🥣", desc:"Cuece varias verduras y tritura con caldo. Sirve con picatostes de pan tostado.",
    ingredients:[{ name:"Calabaza", kcal:26, p:1, g:0, c:7, base:200 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:100 },{ name:"Puerro", kcal:61, p:1, g:0, c:14, base:80 },{ name:"Pan integral", kcal:247, p:9, g:3, c:46, base:30 }] },
  { id:"ac_x37", name:"Bistec de ternera con verduras al horno", grupo:"almuerzo_cena", emoji:"🥩", desc:"Haz el bistec a la plancha al punto que te guste. Acompaña con verduras asadas al horno.",
    ingredients:[{ name:"Ternera magra", kcal:158, p:26, g:6, c:0, base:180 },{ name:"Berenjena", kcal:25, p:1, g:0, c:6, base:120 },{ name:"Pimiento rojo", kcal:31, p:1, g:0, c:6, base:100 },{ name:"Aceite de oliva", kcal:899, p:0, g:100, c:0, base:10 }] },
  { id:"ac_x38", name:"Tofu salteado con verduras y arroz", grupo:"almuerzo_cena", emoji:"🌱", desc:"Saltea el tofu en dados hasta dorar, añade verduras y salsa de soja. Sirve con arroz. Opción vegana.",
    ingredients:[{ name:"Tofu", kcal:76, p:8, g:5, c:2, base:200 },{ name:"Arroz integral", kcal:340, p:8, g:2, c:72, base:70 },{ name:"Brócoli", kcal:34, p:3, g:0, c:7, base:120 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:80 }] },
  { id:"ac_x39", name:"Mejillones al vapor con ensalada", grupo:"almuerzo_cena", emoji:"🦪", desc:"Abre los mejillones al vapor con un poco de limón. Acompaña con una ensalada fresca.",
    ingredients:[{ name:"Mejillones", kcal:86, p:12, g:2, c:4, base:250 },{ name:"Lechuga", kcal:15, p:1, g:0, c:3, base:80 },{ name:"Tomate", kcal:18, p:1, g:0, c:4, base:100 }] },
  { id:"ac_x40", name:"Arroz integral con verduras y huevo", grupo:"almuerzo_cena", emoji:"🍚", desc:"Saltea el arroz integral cocido con verduras variadas y añade un huevo revuelto. Tipo arroz tres delicias fit.",
    ingredients:[{ name:"Arroz integral", kcal:340, p:8, g:2, c:72, base:80 },{ name:"Guisantes", kcal:81, p:5, g:0, c:14, base:60 },{ name:"Zanahoria", kcal:41, p:1, g:0, c:10, base:60 },{ name:"Huevo entero", kcal:155, p:13, g:11, c:1, base:60 }] },
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

// Escala una idea de comida para que cuadre con las kcal objetivo de esa comida.
// Mantiene las proporciones entre ingredientes pero ajusta el total.
function scaleMealIdea(idea, targetKcal) {
  // kcal base de la idea
  const baseKcal = idea.ingredients.reduce((s,ing) => s + (ing.kcal*ing.base)/100, 0);
  const factor = baseKcal > 0 ? targetKcal / baseKcal : 1;
  let totalK=0, totalP=0, totalG=0, totalC=0;
  const scaled = idea.ingredients.map(ing => {
    const grams = Math.round(ing.base * factor);
    const k = (ing.kcal*grams)/100;
    totalK += k; totalP += (ing.p*grams)/100; totalG += (ing.g*grams)/100; totalC += (ing.c*grams)/100;
    return { name:ing.name, grams };
  });
  return { scaled, totals:{ kcal:Math.round(totalK), p:Math.round(totalP), g:Math.round(totalG), c:Math.round(totalC) } };
}

// ═══════════════════════════════════════════════════════════════════════════
// ENTRENAMIENTO
// ═══════════════════════════════════════════════════════════════════════════

// Objetivos de entrenamiento
const TRAINING_GOALS = [
  { id:"running", label:"Running", emoji:"🏃", desc:"Carrera: rodajes, series y ritmo" },
  { id:"cardio", label:"Cardio / HIIT", emoji:"🔥", desc:"Quema intensa sin salir a correr" },
  { id:"calistenia", label:"Calistenia", emoji:"🤸", desc:"Domina tu propio peso corporal" },
  { id:"movilidad", label:"Movilidad", emoji:"🧘", desc:"Flexibilidad y rango de movimiento" },
  { id:"casa", label:"Entreno en casa", emoji:"🏠", desc:"Con el material que tengas" },
  { id:"fuerza", label:"Fuerza / Hipertrofia", emoji:"💪", desc:"Gana músculo y fuerza en el gym" },
];

// Ejercicios de carrera (running puro) vs cardio/HIIT (sin correr)
const CARDIO_HIIT_NAMES = ["Burpees (cardio)","Jumping jacks","Mountain climbers","Skipping (rodillas altas)","Talones al glúteo","Caminata rápida","Subir escaleras","HIIT carrera"];
const RUNNING_NAMES = ["Trote continuo suave","Rodaje largo","Series de 400m","Series de 800m","Series de 1000m","Fartlek (cambios de ritmo)","Series en cuesta","Tempo run (ritmo umbral)","Carrera progresiva","Carrera progresiva","Zancadas de carrera","Multisaltos","Plancha para corredor","Puente de glúteo","Elevación de gemelos","Sentadillas (fuerza para correr)","Zancadas","Movilidad de tobillo","Estiramiento isquiotibiales","Estiramiento de gemelo"];

// Material disponible (para "en casa")
const EQUIPMENT = [
  { id:"peso_corporal", label:"Solo mi peso", emoji:"🧍" },
  { id:"esterilla", label:"Esterilla", emoji:"🟦" },
  { id:"bandas", label:"Bandas elásticas", emoji:"➰" },
  { id:"mancuernas", label:"Mancuernas", emoji:"🏋️" },
  { id:"kettlebell", label:"Kettlebell", emoji:"🔔" },
  { id:"dominadas", label:"Barra dominadas", emoji:"🚪" },
  { id:"banco_barra", label:"Banco + barra", emoji:"🛋️" },
];

// Banco de ejercicios. anim = tipo de animación SVG. equip = material necesario.
// group = grupo muscular para sustituciones. metric = tipo de registro.

const EXERCISES = [
  { id:"press_banca", name:"Press de banca", group:"pecho", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 8", rir:"2" },
  { id:"press_inclinado", name:"Press inclinado con mancuernas", group:"pecho", goals:["fuerza","casa"], equip:["mancuernas","banco_barra"], metric:"peso", series:"4 × 10", rir:"2" },
  { id:"aperturas", name:"Aperturas con mancuernas", group:"pecho", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"3 × 12", rir:"2" },
  { id:"sentadilla_barra", name:"Sentadilla con barra", group:"pierna", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 8", rir:"2" },
  { id:"peso_muerto", name:"Peso muerto", group:"espalda", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 6", rir:"3" },
  { id:"prensa", name:"Prensa de piernas", group:"pierna", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"hip_thrust", name:"Hip thrust", group:"pierna", goals:["fuerza","casa"], equip:["banco_barra","mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"zancada_mancuerna", name:"Zancadas con mancuernas", group:"pierna", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"3 × 12", rir:"2" },
  { id:"curl_femoral", name:"Curl femoral", group:"pierna", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"extension_cuadriceps", name:"Extensión de cuádriceps", group:"pierna", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"gemelo_pie", name:"Elevación de gemelos", group:"pierna", goals:["fuerza","casa"], equip:["peso_corporal","mancuernas"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"press_militar", name:"Press militar", group:"hombro", goals:["fuerza","casa"], equip:["mancuernas","banco_barra"], metric:"peso", series:"4 × 10", rir:"2" },
  { id:"elevaciones_laterales", name:"Elevaciones laterales", group:"hombro", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"4 × 15", rir:"2" },
  { id:"pajaro", name:"Pájaro (deltoides posterior)", group:"hombro", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"3 × 15", rir:"2" },
  { id:"curl_biceps", name:"Curl de bíceps", group:"brazo", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"curl_martillo", name:"Curl martillo", group:"brazo", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"3 × 12", rir:"2" },
  { id:"extension_triceps", name:"Extensión de tríceps", group:"brazo", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"press_frances", name:"Press francés", group:"brazo", goals:["fuerza"], equip:["banco_barra","mancuernas"], metric:"peso", series:"3 × 12", rir:"2" },
  { id:"remo_barra", name:"Remo con barra", group:"espalda", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 10", rir:"2" },
  { id:"remo_mancuerna", name:"Remo con mancuerna", group:"espalda", goals:["fuerza","casa"], equip:["mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"jalon", name:"Jalón al pecho", group:"espalda", goals:["fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"dominada", name:"Dominadas", group:"espalda", goals:["fuerza","calistenia"], equip:["dominadas"], metric:"reps", series:"4 × 8", rir:"2" },
  { id:"encogimientos", name:"Encogimientos (trapecio)", group:"espalda", goals:["fuerza"], equip:["mancuernas","banco_barra"], metric:"peso", series:"4 × 15", rir:"2" },
  { id:"fondos_paralelas", name:"Fondos en paralelas", group:"pecho", goals:["fuerza","calistenia"], equip:["dominadas"], metric:"reps", series:"4 × 10", rir:"2" },
  { id:"sentadilla_goblet", name:"Sentadilla goblet", group:"pierna", goals:["fuerza","casa"], equip:["mancuernas","kettlebell"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"swing_kb", name:"Kettlebell swing", group:"fullbody", goals:["fuerza","casa"], equip:["kettlebell"], metric:"peso", series:"4 × 15", rir:"2" },
  { id:"peso_muerto_rumano", name:"Peso muerto rumano", group:"pierna", goals:["fuerza","casa"], equip:["mancuernas","banco_barra"], metric:"peso", series:"4 × 10", rir:"2" },
  { id:"face_pull", name:"Face pull con banda", group:"hombro", goals:["fuerza","casa"], equip:["bandas"], metric:"reps", series:"3 × 15", rir:"2" },
  { id:"plancha_lastrada", name:"Plancha", group:"core", goals:["fuerza","calistenia","casa"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 60s", rir:"-" },
  { id:"crunch_abdominal", name:"Abdominales (crunch)", group:"core", goals:["fuerza","calistenia","casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"flexion", name:"Flexiones", group:"pecho", goals:["calistenia","casa","fuerza"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 12", rir:"2" },
  { id:"flexion_diamante", name:"Flexiones diamante", group:"brazo", goals:["calistenia","casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 10", rir:"2" },
  { id:"flexion_inclinada", name:"Flexiones inclinadas", group:"pecho", goals:["calistenia","casa"], equip:["peso_corporal"], metric:"reps", series:"4 × 15", rir:"2" },
  { id:"flexion_declinada", name:"Flexiones declinadas", group:"pecho", goals:["calistenia","casa"], equip:["peso_corporal"], metric:"reps", series:"4 × 12", rir:"2" },
  { id:"pino_pared", name:"Pino contra la pared", group:"hombro", goals:["calistenia"], equip:["peso_corporal"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"flexion_pino", name:"Flexiones en pino", group:"hombro", goals:["calistenia"], equip:["peso_corporal"], metric:"reps", series:"3 × 6", rir:"3" },
  { id:"sentadilla", name:"Sentadilla libre", group:"pierna", goals:["calistenia","casa","fuerza"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"sentadilla_bulgara", name:"Sentadilla búlgara", group:"pierna", goals:["calistenia","casa","fuerza"], equip:["peso_corporal"], metric:"reps", series:"3 × 12", rir:"2" },
  { id:"sentadilla_pistol", name:"Sentadilla pistol", group:"pierna", goals:["calistenia"], equip:["peso_corporal"], metric:"reps", series:"3 × 6", rir:"3" },
  { id:"zancada", name:"Zancadas", group:"pierna", goals:["calistenia","casa","fuerza"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 12", rir:"2" },
  { id:"puente_gluteo", name:"Puente de glúteo", group:"pierna", goals:["calistenia","casa","movilidad","fuerza"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 15", rir:"2" },
  { id:"dominada_c", name:"Dominadas", group:"espalda", goals:["calistenia","fuerza"], equip:["dominadas"], metric:"reps", series:"4 × 8", rir:"2" },
  { id:"dominada_supina", name:"Dominadas supinas", group:"espalda", goals:["calistenia","fuerza"], equip:["dominadas"], metric:"reps", series:"4 × 8", rir:"2" },
  { id:"remo_australiano", name:"Remo australiano", group:"espalda", goals:["calistenia","casa"], equip:["dominadas"], metric:"reps", series:"4 × 12", rir:"2" },
  { id:"fondos_silla", name:"Fondos en silla/banco", group:"brazo", goals:["calistenia","casa"], equip:["peso_corporal"], metric:"reps", series:"4 × 12", rir:"2" },
  { id:"fondos_paralelas_c", name:"Fondos en paralelas", group:"pecho", goals:["calistenia","fuerza"], equip:["dominadas"], metric:"reps", series:"4 × 10", rir:"2" },
  { id:"plancha", name:"Plancha", group:"core", goals:["calistenia","casa","movilidad","fuerza"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 45s", rir:"-" },
  { id:"plancha_lateral", name:"Plancha lateral", group:"core", goals:["calistenia","casa","movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s/lado", rir:"-" },
  { id:"hollow", name:"Hollow hold", group:"core", goals:["calistenia","casa"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"elevacion_piernas", name:"Elevación de piernas", group:"core", goals:["calistenia","casa"], equip:["peso_corporal","esterilla","dominadas"], metric:"reps", series:"4 × 12", rir:"2" },
  { id:"crunch", name:"Abdominales (crunch)", group:"core", goals:["calistenia","casa","fuerza"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"bicicleta", name:"Abdominal bicicleta", group:"core", goals:["calistenia","casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 20", rir:"2" },
  { id:"mountain", name:"Mountain climbers", group:"core", goals:["calistenia","casa","running"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 40s", rir:"-" },
  { id:"burpee", name:"Burpees", group:"fullbody", goals:["calistenia","casa"], equip:["peso_corporal"], metric:"reps", series:"4 × 10", rir:"1" },
  { id:"subida_cajon", name:"Subidas a cajón/escalón", group:"pierna", goals:["calistenia","casa"], equip:["peso_corporal"], metric:"reps", series:"3 × 12/pierna", rir:"2" },
  { id:"superman", name:"Superman (lumbar)", group:"espalda", goals:["calistenia","casa","movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 15", rir:"2" },
  { id:"escalador_archer", name:"Flexión arquero", group:"pecho", goals:["calistenia"], equip:["peso_corporal"], metric:"reps", series:"3 × 8/lado", rir:"2" },
  { id:"l_sit", name:"L-sit", group:"core", goals:["calistenia"], equip:["peso_corporal","dominadas"], metric:"tiempo", series:"3 × 15s", rir:"-" },
  { id:"flexion_casa", name:"Flexiones", group:"pecho", goals:["casa","calistenia"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 12", rir:"2" },
  { id:"sentadilla_casa", name:"Sentadilla libre", group:"pierna", goals:["casa","calistenia"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"zancada_casa", name:"Zancadas", group:"pierna", goals:["casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 12/pierna", rir:"2" },
  { id:"puente_casa", name:"Puente de glúteo", group:"pierna", goals:["casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 15", rir:"2" },
  { id:"plancha_casa", name:"Plancha", group:"core", goals:["casa"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 45s", rir:"-" },
  { id:"burpee_casa", name:"Burpees", group:"fullbody", goals:["casa"], equip:["peso_corporal"], metric:"reps", series:"4 × 10", rir:"1" },
  { id:"mountain_casa", name:"Mountain climbers", group:"core", goals:["casa"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 40s", rir:"-" },
  { id:"jumping", name:"Jumping jacks", group:"fullbody", goals:["casa"], equip:["peso_corporal"], metric:"tiempo", series:"3 × 45s", rir:"-" },
  { id:"curl_banda", name:"Curl de bíceps con banda", group:"brazo", goals:["casa"], equip:["bandas"], metric:"reps", series:"4 × 15", rir:"2" },
  { id:"press_banda", name:"Press con banda", group:"pecho", goals:["casa"], equip:["bandas"], metric:"reps", series:"4 × 15", rir:"2" },
  { id:"remo_banda", name:"Remo con banda", group:"espalda", goals:["casa"], equip:["bandas"], metric:"reps", series:"4 × 15", rir:"2" },
  { id:"sentadilla_banda", name:"Sentadilla con banda", group:"pierna", goals:["casa"], equip:["bandas"], metric:"reps", series:"4 × 15", rir:"2" },
  { id:"abduccion_banda", name:"Abducción de cadera con banda", group:"pierna", goals:["casa"], equip:["bandas"], metric:"reps", series:"3 × 20", rir:"2" },
  { id:"press_hombro_banda", name:"Press de hombro con banda", group:"hombro", goals:["casa"], equip:["bandas"], metric:"reps", series:"4 × 15", rir:"2" },
  { id:"curl_mancuerna_casa", name:"Curl de bíceps", group:"brazo", goals:["casa","fuerza"], equip:["mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"press_mancuerna_casa", name:"Press de pecho con mancuernas", group:"pecho", goals:["casa","fuerza"], equip:["mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"remo_mancuerna_casa", name:"Remo con mancuerna", group:"espalda", goals:["casa","fuerza"], equip:["mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"sentadilla_goblet_casa", name:"Sentadilla goblet", group:"pierna", goals:["casa","fuerza"], equip:["mancuernas","kettlebell"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"zancada_mancuerna_casa", name:"Zancadas con mancuernas", group:"pierna", goals:["casa","fuerza"], equip:["mancuernas"], metric:"peso", series:"3 × 12/pierna", rir:"2" },
  { id:"elevaciones_casa", name:"Elevaciones laterales", group:"hombro", goals:["casa","fuerza"], equip:["mancuernas"], metric:"peso", series:"4 × 15", rir:"2" },
  { id:"swing_casa", name:"Kettlebell swing", group:"fullbody", goals:["casa","fuerza"], equip:["kettlebell"], metric:"peso", series:"4 × 15", rir:"2" },
  { id:"goblet_kb_casa", name:"Sentadilla goblet con kettlebell", group:"pierna", goals:["casa"], equip:["kettlebell"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"press_kb_casa", name:"Press de hombro con kettlebell", group:"hombro", goals:["casa"], equip:["kettlebell"], metric:"peso", series:"4 × 10", rir:"2" },
  { id:"remo_kb_casa", name:"Remo con kettlebell", group:"espalda", goals:["casa"], equip:["kettlebell"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"peso_muerto_kb", name:"Peso muerto con kettlebell", group:"pierna", goals:["casa"], equip:["kettlebell","mancuernas"], metric:"peso", series:"4 × 12", rir:"2" },
  { id:"dominada_casa", name:"Dominadas", group:"espalda", goals:["casa","calistenia"], equip:["dominadas"], metric:"reps", series:"4 × 8", rir:"2" },
  { id:"press_banca_casa", name:"Press de banca", group:"pecho", goals:["casa","fuerza"], equip:["banco_barra"], metric:"peso", series:"4 × 8", rir:"2" },
  { id:"subida_cajon_casa", name:"Subidas a escalón", group:"pierna", goals:["casa"], equip:["peso_corporal"], metric:"reps", series:"3 × 15/pierna", rir:"2" },
  { id:"crunch_casa", name:"Abdominales", group:"core", goals:["casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"superman_casa", name:"Superman (lumbar)", group:"espalda", goals:["casa"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 15", rir:"2" },
  { id:"trote", name:"Trote continuo suave", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"25-35 min", rir:"-" },
  { id:"rodaje_largo", name:"Rodaje largo", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"45-60 min", rir:"-" },
  { id:"series_400", name:"Series de 400m", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"6 × 400m", rir:"-" },
  { id:"series_800", name:"Series de 800m", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"5 × 800m", rir:"-" },
  { id:"series_1000", name:"Series de 1000m", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"4 × 1000m", rir:"-" },
  { id:"fartlek", name:"Fartlek (cambios de ritmo)", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"30 min", rir:"-" },
  { id:"cuestas", name:"Series en cuesta", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"8 × 30s", rir:"-" },
  { id:"tempo_run", name:"Tempo run (ritmo umbral)", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"20 min", rir:"-" },
  { id:"progresivo", name:"Carrera progresiva", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"30 min", rir:"-" },
  { id:"hiit_run", name:"HIIT carrera", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"10 × 30/30", rir:"-" },
  { id:"skipping_run", name:"Skipping (rodillas altas)", group:"cardio", goals:["running","casa"], equip:["peso_corporal"], metric:"tiempo", series:"4 × 30s", rir:"-" },
  { id:"talones", name:"Talones al glúteo", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"4 × 30s", rir:"-" },
  { id:"zancada_run", name:"Zancadas de carrera", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"4 × 20m", rir:"-" },
  { id:"multisaltos", name:"Multisaltos", group:"pierna", goals:["running"], equip:["peso_corporal"], metric:"reps", series:"4 × 10", rir:"-" },
  { id:"core_runner", name:"Plancha para corredor", group:"core", goals:["running"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 45s", rir:"-" },
  { id:"gluteo_runner", name:"Puente de glúteo", group:"pierna", goals:["running"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 15", rir:"2" },
  { id:"gemelos_runner", name:"Elevación de gemelos", group:"pierna", goals:["running"], equip:["peso_corporal"], metric:"reps", series:"4 × 20", rir:"2" },
  { id:"sentadilla_runner", name:"Sentadillas (fuerza para correr)", group:"pierna", goals:["running"], equip:["peso_corporal"], metric:"reps", series:"3 × 20", rir:"2" },
  { id:"zancada_runner", name:"Zancadas", group:"pierna", goals:["running"], equip:["peso_corporal"], metric:"reps", series:"3 × 12/pierna", rir:"2" },
  { id:"movilidad_tobillo", name:"Movilidad de tobillo", group:"movilidad", goals:["running","movilidad"], equip:["peso_corporal"], metric:"reps", series:"2 × 10/lado", rir:"-" },
  { id:"estiramiento_isquio", name:"Estiramiento isquiotibiales", group:"movilidad", goals:["running","movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"estiramiento_gemelo", name:"Estiramiento de gemelo", group:"movilidad", goals:["running","movilidad"], equip:["peso_corporal"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"caminata_rapida", name:"Caminata rápida", group:"cardio", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"40 min", rir:"-" },
  { id:"subida_escaleras", name:"Subir escaleras", group:"cardio", goals:["running","casa"], equip:["peso_corporal"], metric:"tiempo", series:"10 min", rir:"-" },
  { id:"burpee_run", name:"Burpees (cardio)", group:"fullbody", goals:["running"], equip:["peso_corporal"], metric:"reps", series:"4 × 12", rir:"1" },
  { id:"jumping_run", name:"Jumping jacks", group:"fullbody", goals:["running"], equip:["peso_corporal"], metric:"tiempo", series:"4 × 45s", rir:"-" },
  { id:"gato_camello", name:"Gato-camello", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 10", rir:"-" },
  { id:"cobra", name:"Cobra (estiramiento)", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"nino", name:"Postura del niño", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 40s", rir:"-" },
  { id:"perro_abajo", name:"Perro boca abajo", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"mundo", name:"Estiramiento del mundo", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"2 × 8/lado", rir:"-" },
  { id:"rotacion_toracica", name:"Rotación torácica", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"2 × 10/lado", rir:"-" },
  { id:"circulos_cadera", name:"Círculos de cadera", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"reps", series:"2 × 10/lado", rir:"-" },
  { id:"circulos_hombro", name:"Círculos de hombro", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"reps", series:"2 × 15", rir:"-" },
  { id:"movilidad_cuello", name:"Movilidad de cuello", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"reps", series:"2 × 10", rir:"-" },
  { id:"estiramiento_isquio_m", name:"Estiramiento isquiotibiales", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"estiramiento_cuadriceps", name:"Estiramiento de cuádriceps", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"tiempo", series:"3 × 30s/lado", rir:"-" },
  { id:"estiramiento_gluteo", name:"Estiramiento de glúteo", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s/lado", rir:"-" },
  { id:"estiramiento_psoas", name:"Estiramiento de psoas", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s/lado", rir:"-" },
  { id:"estiramiento_aductores", name:"Estiramiento de aductores", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"estiramiento_pectoral", name:"Estiramiento de pectoral", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"estiramiento_espalda", name:"Estiramiento de espalda", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"mariposa", name:"Estiramiento mariposa", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 40s", rir:"-" },
  { id:"torsion_espinal", name:"Torsión espinal tumbado", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s/lado", rir:"-" },
  { id:"cuadrupedia", name:"Movilidad en cuadrupedia", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"2 × 10", rir:"-" },
  { id:"sentadilla_profunda", name:"Sentadilla profunda (movilidad)", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"puente_movilidad", name:"Puente de glúteo", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 12", rir:"-" },
  { id:"plancha_movilidad", name:"Plancha", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"tiempo", series:"3 × 30s", rir:"-" },
  { id:"superman_movilidad", name:"Superman (lumbar)", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"3 × 12", rir:"-" },
  { id:"movilidad_muneca", name:"Movilidad de muñeca", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"reps", series:"2 × 10", rir:"-" },
  { id:"balanceo_pierna", name:"Balanceo de pierna", group:"movilidad", goals:["movilidad"], equip:["peso_corporal"], metric:"reps", series:"2 × 12/lado", rir:"-" },
  { id:"rotacion_cadera_90", name:"Rotaciones de cadera 90/90", group:"movilidad", goals:["movilidad"], equip:["peso_corporal","esterilla"], metric:"reps", series:"2 × 8/lado", rir:"-" },
];

// Genera una rutina según objetivo y material
function generateWorkout(goal, equipment, seed = 0, muscleGroups = null) {
  let pool;
  if (goal === "cardio") {
    // Cardio/HIIT: ejercicios de carrera goal pero solo los de tipo HIIT
    pool = EXERCISES.filter(ex => ex.goals.includes("running") && CARDIO_HIIT_NAMES.includes(ex.name));
  } else if (goal === "running") {
    // Running puro: ejercicios de carrera excluyendo los HIIT
    pool = EXERCISES.filter(ex => ex.goals.includes("running") && !CARDIO_HIIT_NAMES.includes(ex.name));
  } else {
    pool = EXERCISES.filter(ex => ex.goals.includes(goal));
  }
  if (goal === "casa" && equipment && equipment.length) {
    pool = pool.filter(ex => ex.equip.some(e => equipment.includes(e)));
  }
  // Filtrar por grupos musculares seleccionados (solo fuerza)
  if (muscleGroups && muscleGroups.length) {
    pool = pool.filter(ex => muscleGroups.includes(ex.group));
  }
  const shuffled = [...pool].sort((a,b) => {
    const ha = (a.id.charCodeAt(0) + a.id.charCodeAt(a.id.length-1) + seed * 7) % 100;
    const hb = (b.id.charCodeAt(0) + b.id.charCodeAt(b.id.length-1) + seed * 13) % 100;
    return ha - hb;
  });
  // Evitar nombres repetidos en la misma rutina
  const seen = new Set();
  const unique = [];
  for (const ex of shuffled) {
    if (!seen.has(ex.name)) { seen.add(ex.name); unique.push(ex); }
  }
  const count = goal === "running" ? 5 : goal === "cardio" ? 6 : goal === "movilidad" ? 6 : 6;
  return unique.slice(0, Math.min(count, unique.length));
}

// Devuelve alternativas para sustituir un ejercicio (mismo grupo, material compatible)
function getAlternatives(exercise, goal, equipment) {
  return EXERCISES.filter(ex =>
    ex.id !== exercise.id &&
    ex.group === exercise.group &&
    (goal !== "casa" || !equipment || !equipment.length || ex.equip.some(e => equipment.includes(e)))
  );
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

// Calcula el objetivo de agua diario (ml) según peso, objetivo y actividad.
// Coge el ml/kg más exigente entre el de actividad y el de objetivo.
function calcWaterGoal(u) {
  const weight = parseFloat(u.weight) || 70;
  // ml/kg por actividad
  const activeIds = ["moderado","activo"];
  const actMlKg = activeIds.includes(u.activity) ? 40 : 32; // activo vs sedentario/ligero
  // ml/kg por objetivo
  const goalMlKg = u.goal==="ganancia" ? 50 : u.goal==="perdida" ? 45 : 35;
  const mlKg = Math.max(actMlKg, goalMlKg);
  const ml = weight * mlKg;
  return Math.round(ml/50)*50; // redondeado a 50 ml
}

function calcMacros(u) {
  if (!u || !u.weight || !u.height || !u.age || !u.sex || !u.activity || !u.goal) return null;
  const bmr = u.sex === "hombre"
    ? 10*u.weight + 6.25*u.height - 5*u.age + 5
    : 10*u.weight + 6.25*u.height - 5*u.age - 161;
  const act = ACTIVITY_LEVELS.find(a => a.id === u.activity)?.factor || 1.2;
  const goal = GOALS.find(g => g.id === u.goal);
  if (!goal) return null;
  const tdee = Math.round(bmr * act);
  const recommendedKcal = Math.round(tdee + goal.kcalOffset);
  const adjust = u.kcalAdjust || 0;
  const targetKcal = recommendedKcal + adjust;
  const protein = Math.round(u.weight * goal.proteinMult);
  const fat = Math.round((targetKcal * goal.fatPct) / 9);
  const carbs = Math.round((targetKcal - protein*4 - fat*9) / 4);
  return { tdee, targetKcal, recommendedKcal, adjust, protein, fat, carbs };
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
  if (!datesSet.has(dateKey(d))) d = addDays(d, -1);
  while (datesSet.has(dateKey(d))) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}

// Progresión de hitos (en días): 3d, 1sem, 2sem, 3sem, 1-12 meses, 1 año, luego mensual hasta 2 años
const MILESTONES = [
  { days:3, label:"3 días" },
  { days:7, label:"1 semana" },
  { days:14, label:"2 semanas" },
  { days:21, label:"3 semanas" },
  { days:30, label:"1 mes" },
  { days:60, label:"2 meses" },
  { days:90, label:"3 meses" },
  { days:120, label:"4 meses" },
  { days:150, label:"5 meses" },
  { days:180, label:"6 meses" },
  { days:210, label:"7 meses" },
  { days:240, label:"8 meses" },
  { days:270, label:"9 meses" },
  { days:300, label:"10 meses" },
  { days:330, label:"11 meses" },
  { days:365, label:"1 año", special:true },
  { days:395, label:"1 año y 1 mes" },
  { days:425, label:"1 año y 2 meses" },
  { days:455, label:"1 año y 3 meses" },
  { days:485, label:"1 año y 4 meses" },
  { days:515, label:"1 año y 5 meses" },
  { days:545, label:"1 año y 6 meses" },
];

// Emojis por nivel de progreso
function milestoneEmoji(idx, special, unlocked, prefix) {
  if (special) return "👑";
  const tiers = ["🔥","⚡","💪","💎","🌟","🚀","🏅","🥇","🎖️"];
  return tiers[Math.min(idx, tiers.length-1)];
}

// Genera logros para una categoría (dieta/hidratación = días seguidos; entreno = total)
function getMilestoneAchievements(prefix, value, label, unitWord) {
  return MILESTONES.map((m, idx) => ({
    id:`${prefix}_${m.days}`,
    title: m.label,
    desc: `${m.label} ${label}`,
    threshold: m.days,
    special: m.special,
    emoji: milestoneEmoji(idx, m.special),
    unlocked: value >= m.days,
  }));
}

// Logros de entrenamiento por número total de entrenos
const WORKOUT_MILESTONES = [3,7,14,21,30,50,75,100,150,200,300,365,500];
function getWorkoutAchievements(total) {
  const tiers = ["🔥","⚡","💪","💎","🌟","🚀","🏅","🥇","🎖️","🏆"];
  return WORKOUT_MILESTONES.map((n, idx) => ({
    id:`entreno_${n}`,
    title:`${n} entrenos`,
    desc:`${n} entrenamientos completados`,
    threshold:n,
    special: n>=365,
    emoji: n>=365?"👑":tiers[Math.min(idx, tiers.length-1)],
    unlocked: total >= n,
  }));
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
          {/* S grande y elegante */}
          <path d="M70 32 C70 24 60 21 50 21 C39 21 31 27 31 37 C31 46 41 49 50 52 C59 55 69 58 69 68 C69 78 60 81 50 81 C39 81 30 77 30 68"
            stroke="url(#smGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div style={{ textAlign:"center", zIndex:2 }}>
        <div style={{ animation:"textRise 0.7s ease 0.3s both", fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:42, color:"#F5F7F0", letterSpacing:6, lineHeight:1 }}>SMINK</div>
        <div style={{ animation:"textRise 0.7s ease 0.5s both", fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:15, letterSpacing:18, marginTop:8, marginLeft:18, color:"#A8FF60" }}>FIT</div>
        <div style={{ height:2, background:"linear-gradient(90deg, transparent, #A8FF60, transparent)", borderRadius:2, margin:"22px auto 0", animation:"lineGrow 1s ease 0.7s both" }} />
      </div>
      <div style={{ position:"absolute", bottom:46, color:"#4A5240", fontSize:11, letterSpacing:4, textTransform:"uppercase", fontWeight:600, zIndex:2, animation:"textRise 0.7s ease 0.9s both" }}>Entrena · Come · Progresa</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFIL
// ═══════════════════════════════════════════════════════════════════════════
function ProfileScreen({ initial, onSave }) {
  const [form, setForm] = useState(initial ? { numMeals:3, kcalAdjust:0, ...initial } : { name:"", weight:"", height:"", age:"", sex:"", activity:"", goal:"", numMeals:3, kcalAdjust:0 });
  const [showAdjustWarn, setShowAdjustWarn] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const valid = ["name","weight","height","age","sex","activity","goal"].every(k => form[k] !== "" && form[k] != null);
  const inp = { width:"100%", padding:"12px 14px", borderRadius:12, border:"2px solid #2a2a3a", background:"#1a1a24", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:12, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"block" };

  // Calcular calorías recomendadas en vivo (si hay datos suficientes)
  const canCalc = form.weight && form.height && form.age && form.sex && form.activity && form.goal;
  const liveMacros = canCalc ? calcMacros({ ...form, weight:parseFloat(form.weight), height:parseFloat(form.height), age:parseFloat(form.age), kcalAdjust:0 }) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", padding:"30px 18px 60px" }}>
      <div style={{ fontWeight:900, fontSize:28, color:"white", marginBottom:4 }}>Completa tu perfil</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:28 }}>Cuéntanos un poco sobre ti para personalizar tus entrenos y tu nutrición</div>

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

      {/* Ajuste manual de calorías */}
      {liveMacros && (
        <div style={{ marginBottom:28 }}>
          <label style={lbl}>Calorías diarias</label>
          <div style={{ background:"#1a1a24", borderRadius:14, padding:"16px", border:"1px solid #2a2a3a" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
              <span style={{ color:"#4caf50", fontWeight:900, fontSize:26 }}>{liveMacros.recommendedKcal + (form.kcalAdjust||0)} kcal</span>
              <span style={{ color:"#666", fontSize:12 }}>recomendado: {liveMacros.recommendedKcal}</span>
            </div>
            <div style={{ color:"#666", fontSize:11.5, marginBottom:14 }}>
              {(form.kcalAdjust||0)===0 ? "Valor calculado para tu objetivo" : `${form.kcalAdjust>0?"+":""}${form.kcalAdjust} kcal sobre lo recomendado`}
            </div>
            <input type="range" min={-500} max={500} step={50} value={form.kcalAdjust||0}
              onChange={e=>{ const v=parseInt(e.target.value); if(v!==0 && (form.kcalAdjust||0)===0){ setShowAdjustWarn(true); } set("kcalAdjust", v); }}
              style={{ width:"100%", accentColor:"#4caf50" }} />
            <div style={{ display:"flex", justifyContent:"space-between", color:"#555", fontSize:10, marginTop:2 }}>
              <span>−500</span><span>0</span><span>+500</span>
            </div>
            {(form.kcalAdjust||0)!==0 && (
              <button onClick={()=>set("kcalAdjust",0)} style={{ marginTop:10, width:"100%", padding:"8px", borderRadius:10, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontSize:12, fontWeight:600, cursor:"pointer" }}>↺ Volver al valor recomendado</button>
            )}
          </div>
        </div>
      )}

      <button onClick={()=>valid&&onSave(form)} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:valid?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:valid?"white":"#555", fontWeight:900, fontSize:16, cursor:valid?"pointer":"default" }}>{valid?"Guardar y continuar →":"Rellena todos los campos"}</button>
      <button onClick={async()=>{ const {supabase:sb} = await import('./supabase.js'); await sb.auth.signOut(); window.location.reload(); }} style={{ width:"100%", marginTop:12, padding:"13px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#666", fontWeight:600, fontSize:14, cursor:"pointer" }}>Cerrar sesión</button>

      {/* Aviso al ajustar calorías */}
      {showAdjustWarn && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
          <div style={{ background:"#1a1a24", borderRadius:20, padding:"26px 22px", maxWidth:380, width:"100%", border:"1px solid #ff9800" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>⚠️</div>
            <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Seguro que quieres cambiarlo?</div>
            <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:22 }}>El valor calculado es el más adecuado para tu peso, altura, actividad y objetivo. Solo cámbialo si sabes lo que haces (por indicación de un profesional o experiencia propia).</div>
            <button onClick={()=>setShowAdjustWarn(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Lo entiendo, continuar</button>
            <button onClick={()=>{ set("kcalAdjust",0); setShowAdjustWarn(false); }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Mejor déjalo recomendado</button>
          </div>
        </div>
      )}
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
          <button onClick={()=>setCreating(false)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
          <div style={{ fontWeight:800, fontSize:18, color:"white" }}>Crear alimento</div>
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
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
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
// IDEAS DE COMIDAS (ajustadas a macros)
// ═══════════════════════════════════════════════════════════════════════════
function MealIdeasScreen({ macros, mealDist, mealList, onAddRecipe, onBack }) {
  const [filter, setFilter] = useState("todas");
  const [openInfo, setOpenInfo] = useState(null);
  const [selectingMeal, setSelectingMeal] = useState(null);
  const [confirmAdd, setConfirmAdd] = useState(null); // { idea, scaled, totals, mealId, mealLabel }
  const [celebrateAdd, setCelebrateAdd] = useState(null); // mealLabel

  useEffect(() => { window.scrollTo(0, 0); }, [openInfo]);

  // kcal objetivo según el grupo de la receta (usa el reparto del usuario)
  const kcalForGroup = (grupo) => {
    // desayuno_merienda → toma el % del desayuno; almuerzo_cena → el de la cena (o almuerzo)
    const mealId = grupo==="desayuno_merienda" ? "desayuno" : "cena";
    let pct = mealDist[mealId];
    if (!pct) {
      // si no existe esa comida, usar reparto medio
      pct = 100/mealList.length;
    }
    return Math.round(macros.targetKcal * (pct/100));
  };

  const tipos = [
    { id:"todas", label:"Todas" },
    { id:"desayuno_merienda", label:"🌅 Desayuno / Merienda" },
    { id:"almuerzo_cena", label:"🍽️ Almuerzo / Cena" },
  ];

  const ideas = filter==="todas" ? MEAL_IDEAS : MEAL_IDEAS.filter(i=>i.grupo===filter);

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", paddingBottom:40 }}>
      <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid #1e1e28" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:20, color:"white" }}>Recetas para tus macros</div>
        <div style={{ color:"#666", fontSize:12, marginTop:4 }}>Cantidades ajustadas a tus macros. Si cambias tus datos, se recalculan solas.</div>
      </div>

      <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"14px 16px" }}>
        {tipos.map(t => (
          <button key={t.id} onClick={()=>setFilter(t.id)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:20, border:`1px solid ${filter===t.id?"#4caf50":"#2a2a3a"}`, background:filter===t.id?"#1a3a1a":"transparent", color:filter===t.id?"#4caf50":"#888", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {ideas.map(idea => {
          const target = kcalForGroup(idea.grupo);
          const { scaled, totals } = scaleMealIdea(idea, target);
          const tipoLabel = idea.grupo==="desayuno_merienda" ? "Desayuno / Merienda" : "Almuerzo / Cena";
          return (
            <div key={idea.id} style={{ background:"#1a1a24", borderRadius:18, padding:"16px", border:"1px solid #2a2a3a", marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ color:"white", fontWeight:800, fontSize:16, display:"flex", alignItems:"center", gap:8 }}>
                    <span>{idea.emoji} {idea.name}</span>
                    <button onClick={()=>setOpenInfo(openInfo===idea.id?null:idea.id)} style={{ width:20, height:20, borderRadius:"50%", border:`1px solid ${openInfo===idea.id?"#4caf50":"#444"}`, background:openInfo===idea.id?"#1a3a1a":"transparent", color:openInfo===idea.id?"#4caf50":"#888", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, flexShrink:0, fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
                  </div>
                  <div style={{ color:"#666", fontSize:11, marginTop:2 }}>{tipoLabel} · ~{totals.kcal} kcal</div>
                </div>
              </div>
              {openInfo===idea.id && (
                <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
                  <div style={{ color:"#8bc34a", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>👨‍🍳 Cómo prepararla</div>
                  <div style={{ color:"#cde", fontSize:12.5, lineHeight:1.5 }}>{idea.desc}</div>
                </div>
              )}
              <div style={{ marginBottom:12 }}>
                {scaled.map((ing,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom: i<scaled.length-1?"1px solid #232330":"none" }}>
                    <span style={{ color:"#ccc", fontSize:13 }}>{ing.name}</span>
                    <span style={{ color:"#4caf50", fontWeight:700, fontSize:13 }}>{ing.grams} g</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-around", background:"#0f0f14", borderRadius:10, padding:"8px 0", marginBottom:12 }}>
                <div style={{ textAlign:"center" }}><div style={{ color:"#4caf50", fontWeight:800, fontSize:14 }}>{totals.p}g</div><div style={{ color:"#666", fontSize:10 }}>Proteína</div></div>
                <div style={{ textAlign:"center" }}><div style={{ color:"#e91e63", fontWeight:800, fontSize:14 }}>{totals.g}g</div><div style={{ color:"#666", fontSize:10 }}>Grasa</div></div>
                <div style={{ textAlign:"center" }}><div style={{ color:"#ff9800", fontWeight:800, fontSize:14 }}>{totals.c}g</div><div style={{ color:"#666", fontSize:10 }}>Hidratos</div></div>
              </div>
              <button onClick={()=>setSelectingMeal({ idea, scaled, totals })} style={{ width:"100%", padding:"12px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:14, cursor:"pointer" }}>➕ Añadir a una comida</button>
            </div>
          );
        })}
      </div>

      {/* Selector de comida */}
      {selectingMeal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(3px)", WebkitBackdropFilter:"blur(3px)", zIndex:250, display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fade-in 0.2s ease" }} onClick={()=>setSelectingMeal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a24", borderTopLeftRadius:24, borderTopRightRadius:24, padding:"24px 20px 32px", width:"100%", maxWidth:500, animation:"rise-up 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ fontWeight:900, fontSize:17, color:"white" }}>¿En qué comida?</div>
              <button onClick={()=>setSelectingMeal(null)} style={{ background:"none", border:"none", color:"#666", fontSize:22, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ color:"#666", fontSize:12, marginBottom:18 }}>{selectingMeal.idea.name} · ~{selectingMeal.totals.kcal} kcal</div>
            {mealList.map(m => (
              <button key={m.id} onClick={()=>{ setConfirmAdd({ idea:selectingMeal.idea, scaled:selectingMeal.scaled, totals:selectingMeal.totals, mealId:m.id, mealLabel:m.label }); setSelectingMeal(null); }} style={{ width:"100%", marginBottom:10, padding:"15px", borderRadius:14, border:"1px solid #2a2a3a", background:"#15151c", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                <span style={{ color:"white", fontWeight:700, fontSize:15 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pop-up confirmar añadir receta */}
      {confirmAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
          <div style={{ background:"#1a1a24", borderRadius:20, padding:"28px 22px", maxWidth:360, width:"100%", border:"1px solid #2a2a3a", animation:"scale-fade 0.3s ease" }}>
            <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Añadir esta receta a {confirmAdd.mealLabel}?</div>
            <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:24 }}>{confirmAdd.idea.name} · ~{confirmAdd.totals.kcal} kcal. Sus ingredientes se añadirán a tu {confirmAdd.mealLabel.toLowerCase()}.</div>
            <button onClick={()=>{ onAddRecipe(confirmAdd.idea, confirmAdd.scaled, confirmAdd.mealId); const lbl=confirmAdd.mealLabel; setConfirmAdd(null); setCelebrateAdd(lbl); setTimeout(()=>{ setCelebrateAdd(null); onBack(); }, 2200); }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, añadir</button>
            <button onClick={()=>setConfirmAdd(null)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Animación de receta añadida (estilo entreno) */}
      {celebrateAdd && (
        <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #16201a 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
          <div style={{ position:"relative", width:120, height:120, marginBottom:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.6s ease-out 0.4s" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ position:"absolute", top:0, left:0 }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1e3a24" strokeWidth="4" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#4caf50" strokeWidth="4" strokeLinecap="round"
                pathLength="1" transform="rotate(-90 60 60)"
                style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.7s ease-out 0.2s forwards" }} />
              <path d="M38 62 L53 76 L83 44" fill="none" stroke="#8bc34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                pathLength="1"
                style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.4s ease-out 0.85s forwards" }} />
            </svg>
          </div>
          <div style={{ color:"white", fontWeight:900, fontSize:24, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.8s both" }}>Receta añadida</div>
          <div style={{ color:"#4caf50", fontSize:14, marginTop:8, fontWeight:600, letterSpacing:2, textTransform:"uppercase", animation:"rise-up 0.5s ease 1s both" }}>{celebrateAdd}</div>
        </div>
      )}
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
  const [showIdeas, setShowIdeas] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [searching, showIdeas, activeTab]);

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

  // Añadir una receta a una comida: mete cada ingrediente en su bloque con gramos FIJOS
  const handleAddRecipe = (idea, scaled, mealId) => {
    updateMeal(mealId, m => {
      const nm = JSON.parse(JSON.stringify(m));
      // Reconstruir mapa de macros de los ingredientes de la idea por nombre
      const macroByName = {};
      idea.ingredients.forEach(ing => { macroByName[ing.name] = ing; });
      scaled.forEach((ing, idx) => {
        const meta = macroByName[ing.name] || {};
        // Las verduras van siempre al bloque de verduras (aunque su macro dominante sea hidrato)
        const VERDURAS = ["Brócoli","Tomate","Tomate natural","Lechuga","Espinacas","Calabacín","Pimiento rojo","Espárragos","Zanahoria","Cebolla","Maíz dulce"];
        const cat = VERDURAS.includes(ing.name) ? "verdura" : classifyFood({ p:meta.p||0, g:meta.g||0, c:meta.c||0 });
        const food = {
          id: `recipe_${idea.id}_${idx}_${Date.now()}`,
          name: ing.name,
          kcal: meta.kcal||0, p: meta.p||0, g: meta.g||0, c: meta.c||0,
          cat, fg: ing.grams, // fg = gramos fijos
        };
        if (!nm.foods[cat]) nm.foods[cat] = [];
        if (!nm.selected[cat]) nm.selected[cat] = [];
        nm.foods[cat].push(food);
        nm.selected[cat].push(food.id);
      });
      return nm;
    });
  };

  const hasPostre = ((meals[lastMealId]?.selected?.postre) || []).length > 0;
  const getMealKcal = (mealId) => macros.targetKcal * ((mealDist[mealId]||0)/100);

  const calcMealTotals = (mealId) => {
    const md = history[dKey]?.[mealId] || emptyMeal(mealId===lastMealId);
    const mealKcal = getMealKcal(mealId);
    const blocksToUse = mealId===lastMealId && ((md.selected.postre)||[]).length>0 ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
    let kcal=0,p=0,g=0,c=0;
    blocksToUse.forEach(block => {
      const selIds = md.selected[block.id] || [];
      // ingredientes con gramos fijos (recetas) restan del reparto del resto
      const dynIds = selIds.filter(id => { const f=(md.foods[block.id]||[]).find(x=>x.id===id); return !(f&&f.fg); });
      selIds.forEach(id => {
        const food = (md.foods[block.id]||[]).find(f=>f.id===id);
        if (!food||!food.kcal) return;
        let gr;
        if (food.fg) { gr = food.fg; } // gramos fijos
        else {
          const pct = (md.pct[block.id]?.[id] || Math.round(100/(dynIds.length||1)))/100;
          const kcalT = (mealKcal/blocksToUse.length)*pct;
          gr = (kcalT/food.kcal)*100;
        }
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

  if (showIdeas) {
    return <MealIdeasScreen macros={macros} mealDist={mealDist} mealList={mealList} onAddRecipe={handleAddRecipe} onBack={()=>setShowIdeas(false)} />;
  }

  if (searching) {
    const block = searching.blockId==="postre" ? POSTRE_BLOCK : BLOCKS.find(b=>b.id===searching.blockId);
    const existingIds = ((meals[searching.mealId]?.foods?.[searching.blockId])||[]).map(f=>f.id);
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
            <div style={{ color:"#cde", fontSize:12.5, lineHeight:1.5 }}>Tienes <b style={{color:"#4caf50"}}>{numMeals} comidas</b> al día. Puedes cambiar el número de comidas cuando quieras desde el icono de perfil de arriba a la derecha. Tus datos registrados no se borran.</div>
          </div>
        )}
        <button onClick={()=>setShowIdeas(true)} style={{ width:"100%", background:"linear-gradient(135deg,#0d2818,#15201a)", border:"1px solid #2e7d32", borderRadius:12, padding:"11px 14px", cursor:"pointer", color:"#8bc34a", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <span>Recetas para tus macros</span>
          <span style={{ fontSize:15 }}>→</span>
        </button>
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
                      const dynCount = selIds.filter(id => { const f=foods.find(x=>x.id===id); return !(f&&f.fg); }).length;
                      const blocksCount = activeBlocks.length===5 && !hasPostre ? 4 : activeBlocks.length;
                      let gr, kcalShown;
                      if (food.fg) {
                        // alimento de receta: gramos fijos
                        gr = food.fg;
                        kcalShown = Math.round((food.kcal*gr)/100);
                      } else {
                        const kcalT = isSel ? (mealKcalTarget/blocksCount)*(pct/100) : 0;
                        gr = kcalT>0&&food.kcal ? Math.round((kcalT/food.kcal)*100) : 0;
                        kcalShown = Math.round(kcalT);
                      }
                      return (
                        <div key={food.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #1e1e28" }}>
                          <button onClick={()=>toggleSelect(meal.id,block.id,food.id)} style={{ width:28, height:28, borderRadius:8, border:`2px solid ${isSel?block.color.border:"#3a3a4a"}`, background:isSel?block.color.accent:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{isSel && <span style={{ color:"white", fontSize:16, fontWeight:900 }}>✓</span>}</button>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ color:isSel?"white":"#888", fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{food.name} {food.fg && <span style={{ fontSize:9, background:"#2e7d32", color:"white", borderRadius:6, padding:"1px 5px", fontWeight:700 }}>RECETA</span>}</div>
                            <div style={{ color:"#555", fontSize:11 }}>{food.kcal}kcal/100g · P:{food.p} HC:{food.c} G:{food.g}</div>
                            {isSel&&gr>0 && <div style={{ color:block.color.border, fontSize:12, fontWeight:700, marginTop:2 }}>→ {gr}g · {kcalShown}kcal{food.fg?" (fijo)":` (${pct}%)`}</div>}
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
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Peso y medidas</div>
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
function AchievementsTab({ measureLog, history, workoutLog, waterLog, userData, onBack }) {
  const [showInfo, setShowInfo] = useState(false);
  const today = new Date();

  // ── DIETA: días seguidos registrando comida ──
  const nutritionDays = Object.keys(history).filter(k => {
    const d = history[k];
    return ALL_MEALS.some(m => BLOCKS.some(b => (d[m.id]?.selected?.[b.id]||[]).length > 0));
  });
  const dietStreak = calcStreak(new Set(nutritionDays), today);

  // ── HIDRATACIÓN: días seguidos cumpliendo el objetivo de agua ──
  const waterGoal = calcWaterGoal(userData);
  const waterDays = Object.keys(waterLog).filter(k => (waterLog[k]||0) >= waterGoal);
  const waterStreak = calcStreak(new Set(waterDays), today);

  // ── ENTRENO: número total de entrenos ──
  const totalWorkouts = Object.keys(workoutLog).length;

  // Generar logros de cada categoría
  const dietAch = getMilestoneAchievements("dieta", dietStreak, "cuidando tu alimentación");
  const waterAch = getMilestoneAchievements("agua", waterStreak, "cumpliendo tu hidratación");
  const workoutAch = getWorkoutAchievements(totalWorkouts);

  const allAch = [...dietAch, ...workoutAch, ...waterAch];
  const unlockedCount = allAch.filter(a=>a.unlocked).length;

  const Section = ({ title, items }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>{title}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {items.map(a => (
          <div key={a.id} style={{ background:a.unlocked?(a.special?"linear-gradient(135deg,#3a2e00,#1a1a24)":"linear-gradient(135deg,#1a2e1a,#1a1a24)"):"#15151c", borderRadius:14, padding:"14px 12px", border:`1px solid ${a.unlocked?(a.special?"#ffd700":"#4caf50"):"#222"}`, textAlign:"center", opacity:a.unlocked?1:0.55, position:"relative" }}>
            <div style={{ fontSize:32, marginBottom:6, filter:a.unlocked?"none":"grayscale(1)" }}>{a.emoji}</div>
            <div style={{ color:a.unlocked?(a.special?"#ffd700":"white"):"#666", fontWeight:800, fontSize:13, marginBottom:3 }}>{a.title}</div>
            <div style={{ color:"#666", fontSize:10.5, lineHeight:1.3 }}>{a.desc}</div>
            {a.unlocked && <div style={{ position:"absolute", top:8, right:8, color:a.special?"#ffd700":"#4caf50", fontSize:14 }}>✓</div>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding:"16px 16px 30px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Logros</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>{unlockedCount} de {allAch.length} desbloqueados</div>

      {/* Rachas actuales */}
      <div style={{ display:"flex", gap:10, marginBottom: showInfo?12:24 }}>
        <div style={{ flex:1, background:"linear-gradient(135deg,#2a1a00,#1a1a24)", borderRadius:14, padding:"14px", border:"1px solid #ff9800", textAlign:"center" }}>
          <div style={{ fontSize:24 }}>🔥</div>
          <div style={{ color:"#ff9800", fontWeight:900, fontSize:20, lineHeight:1, marginTop:4 }}>{dietStreak}</div>
          <div style={{ color:"#aaa", fontSize:10, marginTop:3 }}>días dieta</div>
        </div>
        <div style={{ flex:1, background:"linear-gradient(135deg,#001a2a,#1a1a24)", borderRadius:14, padding:"14px", border:"1px solid #4fc3f7", textAlign:"center" }}>
          <div style={{ fontSize:24 }}>💧</div>
          <div style={{ color:"#4fc3f7", fontWeight:900, fontSize:20, lineHeight:1, marginTop:4 }}>{waterStreak}</div>
          <div style={{ color:"#aaa", fontSize:10, marginTop:3 }}>días agua</div>
        </div>
        <div style={{ flex:1, background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:14, padding:"14px", border:"1px solid #8bc34a", textAlign:"center", position:"relative" }}>
          <div style={{ fontSize:24 }}>🏋️</div>
          <div style={{ color:"#8bc34a", fontWeight:900, fontSize:20, lineHeight:1, marginTop:4 }}>{totalWorkouts}</div>
          <div style={{ color:"#aaa", fontSize:10, marginTop:3 }}>entrenos</div>
          <button onClick={()=>setShowInfo(!showInfo)} style={{ position:"absolute", top:6, right:6, width:20, height:20, borderRadius:"50%", border:"none", background:"transparent", color:"#888", fontSize:12, fontWeight:800, cursor:"pointer", fontStyle:"italic", fontFamily:"Georgia, serif" }}>i</button>
        </div>
      </div>

      {showInfo && (
        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:16, padding:"16px 18px", marginBottom:24 }}>
          <div style={{ color:"#8bc34a", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>¿Cómo conseguir logros?</div>
          <div style={{ color:"#cde", fontSize:13, lineHeight:1.6 }}>
            <div style={{ marginBottom:8 }}><b style={{ color:"#ff9800" }}>🔥 Dieta:</b> registra tu comida cada día sin saltarte ninguno. Si fallas un día, la racha vuelve a empezar.</div>
            <div style={{ marginBottom:8 }}><b style={{ color:"#4fc3f7" }}>💧 Hidratación:</b> cumple tu objetivo de agua diario varios días seguidos.</div>
            <div><b style={{ color:"#8bc34a" }}>🏋️ Entrenamiento:</b> aquí cuenta el número total de entrenos que completas, no días seguidos.</div>
          </div>
        </div>
      )}

      <Section title="🔥 Dieta" items={dietAch} />
      <Section title="🏋️ Entrenamiento" items={workoutAch} />
      <Section title="💧 Hidratación" items={waterAch} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CALENDARIO
// ═══════════════════════════════════════════════════════════════════════════
function CalendarView({ measureLog, history, workoutLog, macros, mealDist, numMeals, onClose }) {
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [selDay, setSelDay] = useState(dateKey(new Date()));
  const [viewWorkout, setViewWorkout] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [viewWorkout]);

  const today = new Date();
  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1);
  const daysInMonth = new Date(year, mon+1, 0).getDate();
  // Lunes = 0
  let startWeekday = firstDay.getDay() - 1; if (startWeekday < 0) startWeekday = 6;

  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  // ¿Qué actividad hay en un día?
  const dayActivity = (key) => {
    const hasWeight = measureLog[key] && Object.values(measureLog[key]).some(v=>v!=null&&v!=="");
    const hasFood = history[key] && ALL_MEALS.some(m => BLOCKS.some(b => (history[key][m.id]?.selected?.[b.id]||[]).length>0));
    const hasWorkout = Object.values(workoutLog).some(w => w.date === key);
    return { hasWeight, hasFood, hasWorkout, any: hasWeight||hasFood||hasWorkout };
  };

  // Detalle del día seleccionado
  const renderDayDetail = () => {
    const key = selDay;
    const act = dayActivity(key);
    const ml = measureLog[key] || {};
    const measuresPresent = MEASURES.filter(m => ml[m.id]!=null && ml[m.id]!=="");
    const dayMeals = history[key];
    const workouts = Object.values(workoutLog).filter(w => w.date === key);

    return (
      <div style={{ marginTop:18 }}>
        <div style={{ color:"white", fontWeight:800, fontSize:16, marginBottom:14 }}>{formatDateLong(parseKey(key))}</div>
        {!act.any && workouts.length===0 && measuresPresent.length===0 && (
          <div style={{ color:"#555", fontSize:14, textAlign:"center", padding:"30px 0", background:"#15151c", borderRadius:14 }}>Sin registros este día</div>
        )}

        {/* Peso y medidas */}
        {measuresPresent.length>0 && (
          <div style={{ background:"#1a1a24", borderRadius:14, padding:"14px", border:"1px solid #2a2a3a", marginBottom:12 }}>
            <div style={{ color:"#4caf50", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>⚖️ Peso y medidas</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {measuresPresent.map(m => (
                <div key={m.id} style={{ background:"#0f0f14", borderRadius:10, padding:"8px 12px" }}>
                  <span style={{ color:"#888", fontSize:12 }}>{m.label}: </span>
                  <span style={{ color:"white", fontWeight:700, fontSize:13 }}>{ml[m.id]}{m.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comidas detalladas */}
        {dayMeals && (() => {
          const ml2 = getMeals(numMeals);
          const lastId = ml2[ml2.length-1].id;
          const mealsWithFood = ml2.filter(meal => BLOCKS.concat(POSTRE_BLOCK).some(b => (dayMeals[meal.id]?.selected?.[b.id]||[]).length>0));
          if (!mealsWithFood.length) return null;

          // Calcular gramos y kcal de un alimento en una comida
          const calcFoodGramsKcal = (mealId, blockId, food, md) => {
            if (food.fg) return { gr:food.fg, kcal:Math.round((food.kcal*food.fg)/100) };
            const mealKcal = macros.targetKcal * ((mealDist?.[mealId]||0)/100);
            const hasPostre = ((md.selected?.postre)||[]).length>0;
            const blocksToUse = (mealId===lastId && hasPostre) ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
            const selIds = md.selected?.[blockId]||[];
            const dynIds = selIds.filter(id=>{ const f=(md.foods?.[blockId]||[]).find(x=>x.id===id); return !(f&&f.fg); });
            const pct = (md.pct?.[blockId]?.[food.id]||Math.round(100/(dynIds.length||1)))/100;
            const kcalT = (mealKcal/blocksToUse.length)*pct;
            const gr = food.kcal?Math.round((kcalT/food.kcal)*100):0;
            return { gr, kcal:Math.round((food.kcal*gr)/100) };
          };

          let dayTotal = 0;
          const mealBlocks = mealsWithFood.map(meal => {
            const md = dayMeals[meal.id];
            const items = [];
            let mealKcal = 0;
            BLOCKS.concat(POSTRE_BLOCK).forEach(b => {
              (md?.selected?.[b.id]||[]).forEach(id => {
                const f = (md?.foods?.[b.id]||[]).find(x=>x.id===id);
                if (!f) return;
                const { gr, kcal } = calcFoodGramsKcal(meal.id, b.id, f, md);
                mealKcal += kcal;
                items.push({ name:f.name, gr, kcal });
              });
            });
            dayTotal += mealKcal;
            return { meal, items, mealKcal };
          });

          return (
            <div style={{ background:"#1a1a24", borderRadius:14, padding:"14px", border:"1px solid #2a2a3a", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ color:"#ff9800", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1 }}>🍽️ Nutrición</div>
                <div style={{ color:"#ff9800", fontSize:13, fontWeight:800 }}>{dayTotal} kcal</div>
              </div>
              {mealBlocks.map(({meal, items, mealKcal}) => (
                <div key={meal.id} style={{ marginBottom:12, background:"#15151c", borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ color:"#ccc", fontWeight:700, fontSize:13 }}>{meal.emoji} {meal.label}</span>
                    <span style={{ color:"#888", fontSize:12, fontWeight:700 }}>{mealKcal} kcal</span>
                  </div>
                  {items.map((it,j) => (
                    <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0" }}>
                      <span style={{ color:"#999", fontSize:12.5 }}>{it.name}</span>
                      <span style={{ color:"#666", fontSize:12 }}>{it.gr}g · {it.kcal}kcal</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Entrenos */}
        {workouts.map((w,i) => {
          const g = TRAINING_GOALS.find(x=>x.id===w.goal);
          const hasMarks = w.marks && Object.values(w.marks).some(arr => (arr||[]).some(s => s && (s.peso||s.reps)));
          return (
            <button key={i} onClick={()=>setViewWorkout(w)} style={{ width:"100%", textAlign:"left", background:"#1a1a24", borderRadius:14, padding:"14px", border:"1px solid #2a2a3a", marginBottom:12, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#8bc34a", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{w.routineDay || g?.label || "Entreno"}</div>
                <div style={{ color:"#999", fontSize:12, lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{w.exercises.map(e=>e.name).join(" · ")}</div>
                <div style={{ color:"#5a7a5a", fontSize:11, marginTop:6 }}>{w.exercises.length} ejercicios{hasMarks?" · con marcas":""} · toca para ver</div>
              </div>
              <span style={{ color:"#4caf50", fontSize:16, flexShrink:0 }}>›</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Vista detalle de un entreno (tabla no editable)
  if (viewWorkout) {
    const w = viewWorkout;
    const g = TRAINING_GOALS.find(x=>x.id===w.goal);
    const d = parseKey(w.date);
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setViewWorkout(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:21, color:"white", marginBottom:2 }}>{w.routineDay || g?.label || "Entreno"}</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>{formatDateLong(d)}</div>

        {w.exercises.map((ex,i) => {
          const exMarks = (w.marks && w.marks[ex.id]) || [];
          const filledMarks = exMarks.filter(s => s && (s.peso||s.reps));
          return (
            <div key={i} style={{ background:"#1a1a24", borderRadius:16, marginBottom:12, border:"1px solid #2a2a3a", overflow:"hidden" }}>
              <div style={{ padding:"13px 16px", borderBottom:filledMarks.length?"1px solid #232330":"none" }}>
                <div style={{ color:"white", fontWeight:700, fontSize:14.5 }}>{ex.name}</div>
                {ex.series && <div style={{ color:"#5a7a5a", fontSize:12, marginTop:2 }}>{ex.series}</div>}
              </div>
              {filledMarks.length > 0 && (
                <div style={{ padding:"10px 16px 12px" }}>
                  <div style={{ display:"flex", gap:10, marginBottom:6, paddingLeft:2 }}>
                    <span style={{ width:50, fontSize:10, color:"#666", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>Serie</span>
                    <span style={{ flex:1, fontSize:10, color:"#666", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, textAlign:"center" }}>Peso</span>
                    <span style={{ flex:1, fontSize:10, color:"#666", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, textAlign:"center" }}>Reps</span>
                  </div>
                  {exMarks.map((s,si) => (s && (s.peso||s.reps)) ? (
                    <div key={si} style={{ display:"flex", gap:10, alignItems:"center", padding:"5px 0", borderTop:si>0?"1px solid #1a1a1a":"none" }}>
                      <span style={{ width:50, color:"#888", fontSize:13, fontWeight:700 }}>{si+1}</span>
                      <span style={{ flex:1, color:"white", fontSize:14, textAlign:"center", fontWeight:600 }}>{s.peso?`${s.peso} kg`:"—"}</span>
                      <span style={{ flex:1, color:"white", fontSize:14, textAlign:"center", fontWeight:600 }}>{s.reps||"—"}</span>
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          );
        })}

        {w.comment && (
          <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px", marginTop:6 }}>
            <div style={{ color:"#5a7a5a", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Tus sensaciones</div>
            <div style={{ color:"#cde", fontSize:13.5, lineHeight:1.5, fontStyle:"italic" }}>"{w.comment}"</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:16 }}>Calendario</div>

      {/* Navegación de mes */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <button onClick={()=>setMonth(new Date(year, mon-1, 1))} style={{ background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:10, color:"#4caf50", fontSize:18, cursor:"pointer", padding:"4px 14px" }}>‹</button>
        <div style={{ color:"white", fontWeight:800, fontSize:16 }}>{meses[mon]} {year}</div>
        <button onClick={()=>setMonth(new Date(year, mon+1, 1))} style={{ background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:10, color:"#4caf50", fontSize:18, cursor:"pointer", padding:"4px 14px" }}>›</button>
      </div>

      {/* Días de la semana */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
        {["L","M","X","J","V","S","D"].map((d,i) => <div key={i} style={{ textAlign:"center", color:"#555", fontSize:11, fontWeight:700, padding:"4px 0" }}>{d}</div>)}
      </div>

      {/* Cuadrícula del mes */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
        {Array.from({length:startWeekday}).map((_,i)=><div key={"e"+i} />)}
        {Array.from({length:daysInMonth}).map((_,i) => {
          const day = i+1;
          const key = dateKey(new Date(year, mon, day));
          const act = dayActivity(key);
          const isToday = isSameDay(new Date(year,mon,day), today);
          const isSel = key === selDay;
          return (
            <button key={day} onClick={()=>setSelDay(key)} style={{ aspectRatio:"1", borderRadius:10, border:isSel?"2px solid #4caf50":isToday?"1px solid #4caf50":"1px solid #232330", background:isSel?"#1a3a1a":"#15151c", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:0 }}>
              <span style={{ color:isToday?"#4caf50":"#ccc", fontSize:13, fontWeight:isToday?800:600 }}>{day}</span>
              {act.any && (
                <div style={{ display:"flex", gap:2 }}>
                  {act.hasWeight && <div style={{ width:5, height:5, borderRadius:"50%", background:"#4caf50" }} />}
                  {act.hasFood && <div style={{ width:5, height:5, borderRadius:"50%", background:"#ff9800" }} />}
                  {act.hasWorkout && <div style={{ width:5, height:5, borderRadius:"50%", background:"#8bc34a" }} />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:"50%", background:"#4caf50" }} /><span style={{ color:"#777", fontSize:11 }}>Peso/medidas</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:"50%", background:"#ff9800" }} /><span style={{ color:"#777", fontSize:11 }}>Comidas</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:"50%", background:"#8bc34a" }} /><span style={{ color:"#777", fontSize:11 }}>Entreno</span></div>
      </div>

      {renderDayDetail()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: DASHBOARD (INICIO)
// ═══════════════════════════════════════════════════════════════════════════
function DashboardTab({ userData, macros, measureLog, history, workoutLog, waterLog, mealDist, numMeals, savedRoutine, racePlan, onGoTo }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [showWeightInfo, setShowWeightInfo] = useState(false);
  const [chartTab, setChartTab] = useState("peso");
  const [tip] = useState(() => getRandomTip());
  if (showCalendar) return <CalendarView measureLog={measureLog} history={history} workoutLog={workoutLog} macros={macros} mealDist={mealDist} numMeals={numMeals} onClose={()=>setShowCalendar(false)} />;
  const today = new Date();
  const weightKeys = Object.keys(measureLog).filter(k => measureLog[k].peso != null && measureLog[k].peso !== "").sort();
  const weightData = weightKeys.map(k => ({ label: formatDateShort(parseKey(k)), value: parseFloat(measureLog[k].peso) }));

  // El peso inicial es el primer registro real; si no hay registros, el del perfil
  const startWeight = weightData.length > 0 ? weightData[0].value : parseFloat(userData.weight);
  const currentWeight = weightData.length > 0 ? weightData[weightData.length-1].value : parseFloat(userData.weight);
  const weightChange = currentWeight - startWeight;

  // Días activos y racha
  const weightDays = weightKeys;
  const nutritionDays = Object.keys(history).filter(k => { const d = history[k]; return ALL_MEALS.some(m => BLOCKS.some(b => (d[m.id]?.selected?.[b.id]||[]).length>0)); });
  const nutritionSet = new Set(nutritionDays);
  const streak = calcStreak(nutritionSet, today);

  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  })();

  // ── Progreso de hoy ──
  const todayKey = dateKey(today);
  // Calorías de hoy
  const mealList = getMeals(numMeals);
  const lastMealId = mealList[mealList.length-1].id;
  const todayKcal = (() => {
    const d = history[todayKey]; if (!d) return 0;
    let total = 0;
    mealList.forEach(meal => {
      const mealKcal = macros.targetKcal * ((mealDist?.[meal.id]||0)/100);
      const hasPostre = ((d[meal.id]?.selected?.postre)||[]).length>0;
      const blocksToUse = (meal.id===lastMealId && hasPostre) ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
      blocksToUse.forEach(block => {
        const selIds = d[meal.id]?.selected?.[block.id]||[];
        const dynIds = selIds.filter(id => { const f=(d[meal.id]?.foods?.[block.id]||[]).find(x=>x.id===id); return !(f&&f.fg); });
        selIds.forEach(id => {
          const food = (d[meal.id]?.foods?.[block.id]||[]).find(f=>f.id===id);
          if (!food||!food.kcal) return;
          let gr;
          if (food.fg) gr = food.fg;
          else { const pct = (d[meal.id]?.pct?.[block.id]?.[id]||Math.round(100/(dynIds.length||1)))/100; gr = ((mealKcal/blocksToUse.length)*pct/food.kcal)*100; }
          total += (food.kcal*gr)/100;
        });
      });
    });
    return Math.round(total);
  })();
  // Agua de hoy
  const todayWater = (waterLog?.[todayKey])||0;
  const waterGoal = calcWaterGoal(userData);
  // Entrenos de esta semana (lunes a hoy)
  const weekWorkouts = (() => {
    const dow = (today.getDay()+6)%7; // lunes=0
    const monday = addDays(today, -dow);
    return Object.values(workoutLog||{}).filter(w => { const d=parseKey(w.date); return d>=new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()) && d<=today; }).length;
  })();

  // ── Modo coach: mensaje inteligente según el día ──
  const coachMsg = (() => {
    const h = today.getHours();
    const kcalLeft = macros.targetKcal - todayKcal;
    const waterLeftL = (waterGoal - todayWater)/1000;
    const trainedToday = Object.values(workoutLog||{}).some(w => w.date === todayKey);
    const dietToday = todayKcal > 0;

    // Noche: resumen del día
    if (h >= 21) {
      if (dietToday && todayKcal >= macros.targetKcal*0.85 && todayWater >= waterGoal*0.8) {
        return { icon:"🌙", text:"¡Gran día! Has cumplido bien con tu nutrición e hidratación. Descansa, que el descanso también construye." };
      }
      return { icon:"🌙", text:"Cierra el día: recuerda registrar lo que te falte y prepárate para mañana. La constancia es lo que cuenta." };
    }
    // Si no ha registrado comida aún
    if (!dietToday && h >= 10) {
      return { icon:"🍽️", text:"Aún no has registrado ninguna comida hoy. ¡No olvides apuntar lo que comes para llevar el control!" };
    }
    // Mañana temprano
    if (h < 10) {
      return { icon:"☀️", text:`¡Buen día por delante! Tu objetivo: ${macros.targetKcal} kcal y ${(waterGoal/1000).toFixed(1)}L de agua. A por ello.` };
    }
    // Mensajes según lo que falta
    const parts = [];
    if (kcalLeft > 100) parts.push(`te faltan ${kcalLeft} kcal`);
    else if (kcalLeft < -150) parts.push(`te has pasado ${Math.abs(kcalLeft)} kcal de tu objetivo`);
    if (waterLeftL > 0.3) parts.push(`${waterLeftL.toFixed(1)}L de agua`);
    if (!trainedToday && weekWorkouts < 3) parts.push("aún no has entrenado hoy");

    if (parts.length === 0) {
      return { icon:"🎯", text:"¡Vas perfecto hoy! Estás cumpliendo tus objetivos. Sigue así 💪" };
    }
    return { icon:"💪", text:`Para cerrar un buen día: ${parts.join(", ")}. ¡Tú puedes!` };
  })();

  // Entrenos por semana (últimas 8) para la gráfica
  const weeklyWorkoutData = (() => {
    const arr = [];
    for (let w=7; w>=0; w--) {
      const end = addDays(today, -w*7);
      const start = addDays(end, -6);
      const count = Object.values(workoutLog||{}).filter(wo => { const d=parseKey(wo.date); return d>=new Date(start.getFullYear(),start.getMonth(),start.getDate()) && d<=end; }).length;
      arr.push({ label:`${start.getDate()}/${start.getMonth()+1}`, value:count });
    }
    return arr;
  })();

  const ProgressBar = ({ emoji, label, value, max, unit, color, onClick }) => {
    const pct = max>0 ? Math.min(100, Math.round((value/max)*100)) : 0;
    return (
      <div onClick={onClick} style={{ background:"#1a1a24", borderRadius:14, padding:"12px 14px", border:"1px solid #2a2a3a", cursor:onClick?"pointer":"default" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
          <span style={{ color:"#ccc", fontSize:13, fontWeight:600 }}>{emoji} {label}</span>
          <span style={{ color:color, fontSize:12, fontWeight:800 }}>{value}{unit} <span style={{ color:"#555" }}>/ {max}{unit}</span></span>
        </div>
        <div style={{ background:"#0f0f14", borderRadius:6, height:7, overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:6, transition:"width 0.4s" }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding:"20px 16px 30px" }}>
      <div style={{ color:"#888", fontSize:14, marginBottom:2 }}>{greeting},</div>
      <div style={{ fontWeight:900, fontSize:26, color:"white", marginBottom:18 }}>{userData.name} 👋</div>

      {/* Coach - mensaje directo sin etiqueta */}
      <div style={{ background:"linear-gradient(135deg,#1a2440,#16161f)", borderRadius:16, padding:"16px 18px", marginBottom:18, border:"1px solid #2a3a5a", display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:3, alignSelf:"stretch", background:"linear-gradient(180deg,#4fc3f7,#7a9ae0)", borderRadius:3, flexShrink:0 }} />
        <div style={{ color:"#e8eef5", fontSize:14, lineHeight:1.5, fontWeight:500 }}>{coachMsg.text}</div>
      </div>

      {/* Hoy te toca (rutina / plan de carrera) */}
      {(() => {
        const todayIdx = (new Date().getDay()+6)%7; // 0=Lunes
        if (savedRoutine?.schedule) {
          const day = savedRoutine.schedule[todayIdx];
          if (!day) return null;
          return (
            <button onClick={()=>onGoTo("entreno")} style={{ width:"100%", textAlign:"left", background:"linear-gradient(135deg,#1a2e1a,#16161f)", borderRadius:16, padding:"16px 18px", marginBottom:18, border:"1px solid #2e7d32", cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:day.rest?0:10 }}>
                <span style={{ color:"#8bc34a", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Hoy · {day.weekday}</span>
                <span style={{ color:"#4caf50", fontSize:18 }}>→</span>
              </div>
              {day.rest ? (
                <div style={{ color:"white", fontWeight:800, fontSize:16, display:"flex", alignItems:"center", gap:8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8bc34a" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                  Día de descanso
                </div>
              ) : (
                day.workouts.map((w,wi)=>(
                  <div key={wi} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:wi<day.workouts.length-1?8:0 }}>
                    <span style={{ fontSize:9, background:w.type==="fuerza"?"#2e4a7a":w.type==="core"?"#5a3a7a":w.type==="estiramiento"?"#3a5a4a":"#7a5a1a", color:"white", borderRadius:20, padding:"2px 7px", fontWeight:700, textTransform:"uppercase", flexShrink:0 }}>{w.type==="fuerza"?"Fuerza":w.type==="carrera"?"Carrera":w.type==="bici"?"Bici":w.type==="natacion"?"Natación":w.type==="core"?"Core":"Movilidad"}</span>
                    <span style={{ color:"white", fontWeight:600, fontSize:14 }}>{w.name}</span>
                  </div>
                ))
              )}
            </button>
          );
        }
        if (racePlan && !racePlan.allDone) {
          const phase = racePlan.phases[racePlan.currentPhase];
          const wk = phase?.weekPlans?.[racePlan.currentWeek||0];
          return (
            <button onClick={()=>onGoTo("entreno")} style={{ width:"100%", textAlign:"left", background:"linear-gradient(135deg,#2a2410,#16161f)", borderRadius:16, padding:"16px 18px", marginBottom:18, border:"1px solid #b8860b", cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ color:"#ffd700", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Tu plan de carrera</span>
                <span style={{ color:"#ffd700", fontSize:18 }}>→</span>
              </div>
              <div style={{ color:"white", fontWeight:800, fontSize:15 }}>{racePlan.discipline==="running"?`Camino a tu ${racePlan.targetLabel}`:"Tu reto en bici"}</div>
              <div style={{ color:"#aa9", fontSize:12, marginTop:3 }}>Fase {racePlan.currentPhase+1}/{racePlan.phases.length} · semana {(racePlan.currentWeek||0)+1} · {wk?wk.sessions.length:0} entrenos</div>
            </button>
          );
        }
        return null;
      })()}

      {/* Progreso de hoy */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
        <ProgressBar emoji="🔥" label="Calorías de hoy" value={todayKcal} max={macros.targetKcal} unit="" color="#4caf50" onClick={()=>onGoTo("nutricion")} />
        <ProgressBar emoji="💧" label="Agua de hoy" value={(todayWater/1000).toFixed(1)*1} max={(waterGoal/1000).toFixed(1)*1} unit="L" color="#4fc3f7" onClick={()=>onGoTo("agua")} />
        <div style={{ background:"#1a1a24", borderRadius:14, padding:"12px 14px", border:"1px solid #2a2a3a", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }} onClick={()=>onGoTo("entreno")}>
          <span style={{ color:"#ccc", fontSize:13, fontWeight:600 }}>🏋️ Entrenos esta semana</span>
          <span style={{ color:"#8bc34a", fontSize:15, fontWeight:900 }}>{weekWorkouts}</span>
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

      {/* Gráfica con pestañas: Peso / Entrenos */}
      <div style={{ background:"#1a1a24", borderRadius:18, padding:"16px 8px 12px", marginBottom:16, border:"1px solid #2a2a3a" }}>
        <div style={{ display:"flex", gap:8, paddingLeft:8, paddingRight:8, marginBottom:12 }}>
          <button onClick={()=>setChartTab("peso")} style={{ flex:1, padding:"8px", borderRadius:10, border:"none", background:chartTab==="peso"?"#1a3a1a":"transparent", color:chartTab==="peso"?"#4caf50":"#888", fontSize:13, fontWeight:700, cursor:"pointer" }}>⚖️ Peso</button>
          <button onClick={()=>setChartTab("entrenos")} style={{ flex:1, padding:"8px", borderRadius:10, border:"none", background:chartTab==="entrenos"?"#1a3a1a":"transparent", color:chartTab==="entrenos"?"#8bc34a":"#888", fontSize:13, fontWeight:700, cursor:"pointer" }}>🏋️ Entrenos</button>
        </div>
        {chartTab==="peso" ? (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:8, paddingRight:8, marginBottom:8 }}>
              <span style={{ color:"#ccc", fontWeight:800, fontSize:14 }}>Evolución del peso</span>
              <span style={{ color:"#4caf50", fontSize:13, fontWeight:700 }}>{currentWeight.toFixed(1)} kg</span>
            </div>
            <LineChart data={weightData.length?weightData:[{label:"inicio",value:startWeight}]} unit="kg" color="#4caf50" />
          </>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:8, paddingRight:8, marginBottom:14 }}>
              <span style={{ color:"#ccc", fontWeight:800, fontSize:14 }}>Entrenos por semana</span>
              <span style={{ color:"#8bc34a", fontSize:13, fontWeight:700 }}>{weekWorkouts} esta semana</span>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:130, padding:"0 8px" }}>
              {weeklyWorkoutData.map((wk,i) => {
                const maxV = Math.max(...weeklyWorkoutData.map(x=>x.value), 1);
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ color:"#666", fontSize:10, fontWeight:700 }}>{wk.value>0?wk.value:""}</div>
                    <div style={{ width:"100%", maxWidth:26, height:`${(wk.value/maxV)*90+4}px`, background:wk.value>0?"linear-gradient(180deg,#8bc34a,#2e7d32)":"#232330", borderRadius:6, transition:"height 0.4s" }} />
                    <div style={{ color:"#555", fontSize:9 }}>{wk.label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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

      {/* Calendario */}
      <button onClick={()=>setShowCalendar(true)} style={{ width:"100%", marginTop:12, background:"linear-gradient(135deg,#1a1a24,#1f1f2e)", border:"1px solid #2a2a3a", borderRadius:16, padding:"18px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ fontSize:26 }}>📅</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"white", fontWeight:800, fontSize:14 }}>Ver calendario</div>
          <div style={{ color:"#888", fontSize:11, marginTop:2 }}>Todo tu historial día a día</div>
        </div>
        <span style={{ color:"#4caf50", fontSize:18 }}>→</span>
      </button>

      {/* Lista de la compra */}
      <button onClick={()=>onGoTo("compra")} style={{ width:"100%", marginTop:12, background:"linear-gradient(135deg,#1a1a24,#1f1f2e)", border:"1px solid #2a2a3a", borderRadius:16, padding:"18px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ fontSize:26 }}>🛒</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"white", fontWeight:800, fontSize:14 }}>Lista de la compra</div>
          <div style={{ color:"#888", fontSize:11, marginTop:2 }}>Planifica tu semana y genera la lista</div>
        </div>
        <span style={{ color:"#4caf50", fontSize:18 }}>→</span>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GRÁFICAS DE ENTRENAMIENTO
// ═══════════════════════════════════════════════════════════════════════════
function TrainingCharts({ workoutLog }) {
  const entries = Object.values(workoutLog);

  // 1) Constancia: entrenos por semana (últimas 8 semanas)
  const now = new Date();
  const weeks = [];
  for (let w = 7; w >= 0; w--) {
    const end = addDays(now, -w*7);
    const start = addDays(end, -6);
    const count = entries.filter(e => {
      const d = parseKey(e.date);
      return d >= new Date(start.getFullYear(),start.getMonth(),start.getDate()) && d <= end;
    }).length;
    weeks.push({ label: `${start.getDate()}/${start.getMonth()+1}`, value: count });
  }

  // 2) Evolución de peso por ejercicio (los que tienen marcas de peso)
  const exerciseWeights = {}; // {exName: [{date, maxPeso}]}
  entries.sort((a,b)=>a.ts-b.ts).forEach(e => {
    Object.entries(e.marks||{}).forEach(([exId, series]) => {
      const exMeta = EXERCISES.find(x=>x.id===exId);
      const name = exMeta?.name || exId;
      const pesos = (series||[]).map(s=>parseFloat(s?.peso)).filter(p=>!isNaN(p)&&p>0);
      if (pesos.length) {
        const maxP = Math.max(...pesos);
        if (!exerciseWeights[name]) exerciseWeights[name] = [];
        exerciseWeights[name].push({ label: formatDateShort(parseKey(e.date)), value: maxP });
      }
    });
  });
  const exNames = Object.keys(exerciseWeights).filter(n => exerciseWeights[n].length >= 1);
  const [selEx, setSelEx] = useState(exNames[0] || null);

  const totalWorkouts = entries.length;
  const maxWeek = Math.max(...weeks.map(w=>w.value), 1);

  return (
    <div style={{ marginTop:28 }}>
      <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Tu progreso</div>

      {/* Resumen */}
      <div style={{ display:"flex", gap:12, marginBottom:16 }}>
        <div style={{ flex:1, background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:14, padding:"14px", border:"1px solid #2a3a2a" }}>
          <div style={{ color:"#4caf50", fontWeight:900, fontSize:26, lineHeight:1 }}>{totalWorkouts}</div>
          <div style={{ color:"#888", fontSize:12, marginTop:3 }}>entrenos totales</div>
        </div>
        <div style={{ flex:1, background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:14, padding:"14px", border:"1px solid #2a3a2a" }}>
          <div style={{ color:"#4caf50", fontWeight:900, fontSize:26, lineHeight:1 }}>{weeks[weeks.length-1].value}</div>
          <div style={{ color:"#888", fontSize:12, marginTop:3 }}>esta semana</div>
        </div>
      </div>

      {/* Constancia semanal (barras) */}
      <div style={{ background:"#1a1a24", borderRadius:16, padding:"16px", border:"1px solid #2a2a3a", marginBottom:16 }}>
        <div style={{ color:"#ccc", fontWeight:700, fontSize:14, marginBottom:14 }}>📊 Entrenos por semana</div>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:100 }}>
          {weeks.map((w,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ color:"#666", fontSize:10, fontWeight:700 }}>{w.value>0?w.value:""}</div>
              <div style={{ width:"100%", maxWidth:28, height:`${(w.value/maxWeek)*70+4}px`, background:w.value>0?"linear-gradient(180deg,#4caf50,#2e7d32)":"#232330", borderRadius:6, transition:"height 0.4s" }} />
              <div style={{ color:"#555", fontSize:9 }}>{w.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolución de peso por ejercicio */}
      {exNames.length > 0 && selEx && (
        <div style={{ background:"#1a1a24", borderRadius:16, padding:"16px 8px 8px", border:"1px solid #2a2a3a" }}>
          <div style={{ paddingLeft:8, paddingRight:8, marginBottom:10 }}>
            <div style={{ color:"#ccc", fontWeight:700, fontSize:14, marginBottom:10 }}>🏋️ Peso levantado</div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
              {exNames.map(n => (
                <button key={n} onClick={()=>setSelEx(n)} style={{ flexShrink:0, padding:"6px 12px", borderRadius:16, border:`1px solid ${selEx===n?"#4caf50":"#2a2a3a"}`, background:selEx===n?"#1a3a1a":"transparent", color:selEx===n?"#4caf50":"#888", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{n}</button>
              ))}
            </div>
          </div>
          <LineChart data={exerciseWeights[selEx]} unit="kg" color="#4caf50" />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: ENTRENAMIENTO
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// PLANIFICADOR DE CARRERA (Running y Bici)
// ═══════════════════════════════════════════════════════════════════════════

// Distancias de running con su valor en km
const RACE_DISTANCES = [
  { id:"5k", label:"5K", km:5 },
  { id:"10k", label:"10K", km:10 },
  { id:"21k", label:"Media maratón (21K)", km:21.097 },
  { id:"42k", label:"Maratón (42K)", km:42.195 },
];

// Formatea segundos a "h:mm:ss" o "mm:ss"
function fmtTime(secs) {
  if (!secs || secs<=0) return "—";
  secs = Math.round(secs);
  const h = Math.floor(secs/3600);
  const m = Math.floor((secs%3600)/60);
  const s = secs%60;
  if (h>0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}
// Formatea ritmo (seg/km) a "m:ss/km"
function fmtPace(secsPerKm) {
  if (!secsPerKm || secsPerKm<=0) return "—";
  const m = Math.floor(secsPerKm/60);
  const s = Math.round(secsPerKm%60);
  return `${m}:${String(s).padStart(2,"0")}/km`;
}
// Convierte "mm:ss" o "h:mm:ss" a segundos
function parseTimeToSecs(str) {
  if (!str) return 0;
  const parts = str.split(":").map(x=>parseInt(x)||0);
  if (parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
  if (parts.length===2) return parts[0]*60+parts[1];
  return 0;
}

// Fórmula de Riegel: predice tiempo en distancia D2 a partir de tiempo T1 en distancia D1
// T2 = T1 * (D2/D1)^1.06
function riegelPredict(t1secs, d1km, d2km) {
  if (!t1secs || !d1km || !d2km) return 0;
  return t1secs * Math.pow(d2km/d1km, 1.06);
}

// A partir de las marcas del usuario, estima su mejor predicción para una distancia objetivo
function bestPrediction(marks, targetKm) {
  // marks: { "5k": secs, "10k": secs, ... }
  let best = 0;
  RACE_DISTANCES.forEach(d => {
    const t = marks[d.id];
    if (t && t>0) {
      const pred = riegelPredict(t, d.km, targetKm);
      if (best===0 || pred<best) best = pred;
    }
  });
  return best; // 0 si no tiene ninguna marca
}

// Decide las fases necesarias para llegar de la condición actual a la distancia objetivo
// Si el objetivo es muy superior a lo que ha corrido, escalona: 5k->10k->21k->42k
function racePhases(marks, targetId) {
  const order = ["5k","10k","21k","42k"];
  const targetIdx = order.indexOf(targetId);
  // ¿Cuál es la mayor distancia que ya domina (tiene marca)?
  let maxDoneIdx = -1;
  order.forEach((id,i) => { if (marks[id] && marks[id]>0) maxDoneIdx = Math.max(maxDoneIdx, i); });
  // Empieza desde la siguiente a la que domina (o desde 5k si no ha corrido nada)
  let startIdx = maxDoneIdx>=0 ? maxDoneIdx+1 : 0;
  if (startIdx > targetIdx) startIdx = targetIdx; // ya domina distancias mayores; plan directo
  const phases = [];
  for (let i=startIdx; i<=targetIdx; i++) phases.push(order[i]);
  if (phases.length===0) phases.push(targetId);
  return phases; // array de ids de distancia, en orden
}

// Semanas recomendadas para una fase según la distancia objetivo de la fase y el nivel
function phaseWeeks(distId, level, experience) {
  const base = { "5k":8, "10k":8, "21k":10, "42k":12 }[distId] || 8;
  let mult = 1;
  if (level==="principiante") mult = 1.15;
  else if (level==="avanzado") mult = 0.85;
  if (experience==="cero") mult += 0.15;
  return Math.max(6, Math.round(base*mult));
}

// Genera el plan semanal de UNA fase de running (días con tipo de entreno y descripción)
// Mensaje del entrenador según nivel y experiencia
function raceCoachMessage(disc, level, experience, targetId, numPhases) {
  if (experience==="cero") {
    return `Empezamos desde la base, y eso está genial: todos empezamos por algún sitio. Vamos poco a poco, sin prisa pero sin pausa, para que tu cuerpo se adapte sin lesiones.${numPhases>1?` Tienes ${numPhases} fases por delante: cada una es un logro.`:""} Confía en el proceso. ¡Tú puedes!`;
  }
  if (level==="principiante") {
    return `Ya tienes algo de base, así que construimos sobre ello con cabeza. La constancia marca la diferencia: mejor poco y siempre que mucho de golpe.${numPhases>1?` Iremos fase a fase hasta tu meta.`:""} Notarás el progreso semana a semana.`;
  }
  if (level==="avanzado") {
    return `Se nota que llevas rodaje. Este plan busca pulir tu rendimiento y llevarte a tu mejor versión. Cuida la recuperación tanto como los entrenos duros: ahí está la diferencia en tu nivel. A darlo todo.`;
  }
  return `Tienes buena base para este reto. Trabajaremos de forma progresiva combinando calidad, fondo y fuerza. Respeta las semanas de descarga: es cuando el cuerpo asimila y mejora. ¡A por ello!`;
}

function generateRunPhase(distId, level, daysPerWeek, targetPaceSecsPerKm, experience, runType, desnivel) {
  const weeks = phaseWeeks(distId, level, experience);
  const distKm = RACE_DISTANCES.find(d=>d.id===distId).km;
  const paceTxt = targetPaceSecsPerKm ? ` (~${fmtPace(targetPaceSecsPerKm)})` : "";
  const isTrail = runType==="trail";
  const buildWeek = (wIdx) => {
    const prog = weeks>1 ? wIdx/(weeks-1) : 1;
    const isDeload = (wIdx+1)%4===0 && wIdx<weeks-2;
    const longKm = (distKm * (0.5 + prog*0.5) * (isDeload?0.7:1)).toFixed(1);
    const rodajeMin = Math.round(25 + prog*20);
    const semNota = isDeload ? " (semana de descarga: baja el volumen para asimilar)" : "";
    const desnObj = desnivel ? Math.round(desnivel*(0.4+prog*0.6)) : 0;
    // Sesiones base de carrera
    const pool = isTrail ? [
      { type:"carrera", name:"Rodaje suave", detail:`Rodaje cómodo de ${rodajeMin} min por terreno fácil, a ritmo conversacional.${semNota}` },
      { type:"carrera", name:"Subidas (cuestas)", detail:`Series en cuesta: ${wIdx<3?"6":"8"}×1-2 min subiendo fuerte, baja trotando a recuperar. Mejora potencia y te prepara para el desnivel.` },
      { type:"fuerza", name:"Fuerza para trail", detail:"Sentadillas, zancadas, peso muerto rumano, gemelos, tibial y core. 4 series. Clave para subir fuerte y bajar sin destrozarte." },
      { type:"carrera", name:"Tirada larga con desnivel", detail:`Tirada larga de ${longKm} km${desnObj?` buscando ~${desnObj} m de desnivel positivo`:" por terreno con subidas y bajadas"} a ritmo suave. Practica caminar fuerte en las subidas duras.${semNota}` },
      { type:"carrera", name:"Bajadas técnicas", detail:"Rodaje 30 min trabajando bajadas: pasos cortos, mirada adelante, brazos para equilibrio. Bajar bien ahorra mucho tiempo en trail." },
      { type:"fuerza", name:"Fuerza excéntrica y core", detail:"Trabajo excéntrico de cuádriceps (bajadas controladas), glúteo, tobillo y core. 3 series. Protege tus piernas en las bajadas." },
    ] : [
      { type:"carrera", name:"Rodaje suave", detail:`Rodaje cómodo de ${rodajeMin} min a ritmo conversacional (deberías poder hablar)${paceTxt}.${semNota}` },
      { type:"carrera", name:"Series / calidad", detail:`Entrenamiento de calidad. Ej: ${wIdx<3?"5×400m":"6×800m"} a ritmo fuerte con 2 min de recuperación. Calienta 10 min antes.` },
      { type:"fuerza", name:"Fuerza para correr", detail:"Sentadillas, zancadas, peso muerto rumano, gemelos y core. 3-4 series. Previene lesiones y mejora tu economía de carrera." },
      { type:"carrera", name:"Tirada larga", detail:`Tirada larga de ${longKm} km a ritmo suave y constante. La sesión clave para ganar fondo.${semNota}` },
      { type:"carrera", name:"Rodaje + técnica", detail:"Rodaje suave 30 min + 4-5 ejercicios de técnica (skipping, talones al glúteo, zancadas progresivas)." },
      { type:"fuerza", name:"Fuerza y core", detail:"Core, glúteo, estabilidad e isométricos (plancha, hollow). 3 series. Clave para aguantar la distancia." },
    ];
    return pool.slice(0, daysPerWeek);
  };
  const weekPlans = [];
  for (let w=0; w<weeks; w++) weekPlans.push({ week:w+1, sessions: buildWeek(w) });
  return { distId, weeks, weekPlans };
}

// Genera el plan de una fase de BICI
function generateBikePhase(kmObjetivo, desnivel, level, daysPerWeek, experience) {
  let weeks = level==="principiante" ? 10 : level==="avanzado" ? 7 : 8;
  if (experience==="cero") weeks += 2;
  const buildWeek = (wIdx) => {
    const prog = weeks>1 ? wIdx/(weeks-1) : 1;
    const isDeload = (wIdx+1)%4===0 && wIdx<weeks-2;
    const longKm = Math.round(kmObjetivo * (0.5 + prog*0.5) * (isDeload?0.75:1));
    const fondoKm = Math.round(kmObjetivo * 0.4);
    const semNota = isDeload ? " (semana de descarga)" : "";
    const sessions = [
      { type:"bici", name:"Salida de fondo", detail:`Rodar ${fondoKm} km a ritmo cómodo y constante. Base aeróbica.${semNota}` },
      { type:"bici", name:"Intervalos de potencia", detail:`Series de intensidad: ${wIdx<3?"4×3 min":"5×4 min"} fuertes con recuperación pedaleando suave. Mejora tu potencia.` },
      { type:"fuerza", name:"Fuerza para ciclismo", detail:"Sentadilla, prensa, zancadas, peso muerto y core. 4 series. Más vatios en el pedaleo." },
      { type:"bici", name:"Salida larga", detail:`Salida de ${longKm} km${desnivel?` buscando ~${Math.round(desnivel*(0.4+prog*0.6))} m de desnivel`:""}. Resistencia específica para tu reto.${semNota}` },
      { type:"bici", name:"Trabajo de subidas", detail:"Repeticiones en cuesta (4-6 subidas firmes). Gana fuerza específica para el desnivel." },
      { type:"fuerza", name:"Core y estabilidad", detail:"Core, lumbares y estabilidad para mantener la posición sin molestias. 3 series." },
    ];
    return sessions.slice(0, daysPerWeek);
  };
  const weekPlans = [];
  for (let w=0; w<weeks; w++) weekPlans.push({ week:w+1, sessions: buildWeek(w) });
  return { kmObjetivo, desnivel, weeks, weekPlans };
}

// Genera una rutina SEMANAL según objetivo, días y nivel
// Etiquetas legibles de grupos musculares
const MUSCLE_LABELS = { pecho:"Pecho", espalda:"Espalda", pierna:"Pierna", hombro:"Hombro", brazo:"Brazo", core:"Core" };

function generateWeeklyRoutine(type, focus, days, level, equip = []) {
  // ── RUNNING: plan semanal de carrera ──
  if (type === "running") {
    const plans = {
      principiante: ["Rodaje suave 20-30 min","Caminata + carrera (intervalos suaves)","Rodaje suave 25-35 min","Tirada larga cómoda 35-45 min"],
      intermedio: ["Rodaje suave 30-40 min","Series cortas (ej: 6×400m)","Rodaje medio 40-50 min","Tirada larga 60-75 min","Trote regenerativo 25 min"],
      avanzado: ["Rodaje 40-50 min","Series largas (ej: 5×1000m)","Tempo run 30-40 min ritmo exigente","Rodaje medio 50 min","Tirada larga 75-90 min","Series en cuesta"],
    };
    const list = plans[level] || plans.principiante;
    const dayPlans = [];
    const shortNames = { principiante:["Rodaje suave","Intervalos suaves","Rodaje suave","Tirada larga"], intermedio:["Rodaje suave","Series cortas","Rodaje medio","Tirada larga","Trote suave"], avanzado:["Rodaje","Series largas","Tempo run","Rodaje medio","Tirada larga","Series en cuesta"] };
    const names = shortNames[level] || shortNames.principiante;
    for (let i=0;i<days;i++){ dayPlans.push({ name:names[i % names.length], groupsLabel:"Carrera", exercises:[], runDetail:list[i % list.length] }); }
    return { type, params:{ desc:"Plan de carrera progresivo. Alterna rodajes, series y tirada larga. Respeta los días de descanso.", rest:"—" }, dayPlans };
  }
  // ── CARDIO: HIIT, comba, circuitos (sin carrera) ──
  if (type === "cardio") {
    const sessions = [
      { name:"HIIT cuerpo completo", detail:"20-25 min. Intervalos de alta intensidad: burpees, mountain climbers, jumping jacks. 40s trabajo / 20s descanso." },
      { name:"Circuito metabólico", detail:"30 min en circuito: saltos, sentadilla con salto, escaladores, comba. 4-5 rondas." },
      { name:"Comba y core", detail:"15-20 min de comba por intervalos + core al final." },
      { name:"Cardio + fuerza ligera", detail:"30 min combinando ejercicios de peso corporal a ritmo alto." },
      { name:"HIIT piernas y glúteo", detail:"20 min: sentadillas, zancadas saltadas, puente de glúteo dinámico." },
      { name:"Tabata", detail:"4 bloques de 4 min (20s/10s) con ejercicios explosivos." },
    ];
    const dayPlans = [];
    for (let i=0;i<days;i++){ const s = sessions[i % sessions.length]; dayPlans.push({ name:s.name, groupsLabel:"Cardio", exercises:[], runDetail:s.detail }); }
    return { type, params:{ desc:"Entrenamiento cardiovascular de alta intensidad (sin carrera). Ideal para quemar y mejorar tu condición.", rest:"—" }, dayPlans };
  }

  // ── GIMNASIO o CASA: rutina de fuerza por grupos ──
  const splits = {
    2: [ {n:"Cuerpo completo A", g:["pecho","espalda","pierna","core"]}, {n:"Cuerpo completo B", g:["hombro","brazo","pierna","core"]} ],
    3: [ {n:"Empuje", g:["pecho","hombro","brazo"]}, {n:"Tirón", g:["espalda","brazo","core"]}, {n:"Pierna", g:["pierna","core"]} ],
    4: [ {n:"Pecho y Tríceps", g:["pecho","brazo"]}, {n:"Espalda y Bíceps", g:["espalda","brazo"]}, {n:"Pierna", g:["pierna","core"]}, {n:"Hombro y Core", g:["hombro","core","brazo"]} ],
    5: [ {n:"Pecho", g:["pecho","brazo"]}, {n:"Espalda", g:["espalda","brazo"]}, {n:"Pierna", g:["pierna","core"]}, {n:"Hombro", g:["hombro","core"]}, {n:"Brazo y Core", g:["brazo","core"]} ],
    6: [ {n:"Empuje A", g:["pecho","hombro","brazo"]}, {n:"Tirón A", g:["espalda","brazo"]}, {n:"Pierna A", g:["pierna","core"]}, {n:"Empuje B", g:["pecho","hombro","brazo"]}, {n:"Tirón B", g:["espalda","brazo","core"]}, {n:"Pierna B", g:["pierna","core"]} ],
  };
  const split = splits[days] || splits[3];

  const params = {
    masa: { reps:"8-12", series:4, rir:"1-2", rest:"90 seg", desc:"Hipertrofia: volumen e intensidad medias-altas" },
    estetica: { reps:"10-15", series:4, rir:"1-2", rest:"60-75 seg", desc:"Estética: definición muscular y trabajo completo" },
    fuerza: { reps:"3-6", series:5, rir:"2-3", rest:"2-3 min", desc:"Fuerza: cargas altas y más descanso entre series" },
    resistencia: { reps:"15-20", series:3, rir:"0-1", rest:"30-45 seg", desc:"Resistencia muscular: muchas reps, poco descanso" },
  };
  const p = params[focus] || params.masa;
  const nEx = level==="principiante" ? 6 : level==="intermedio" ? 7 : 8;
  // En casa solo ejercicios sin material pesado (calistenia/casa); en gimnasio, de fuerza
  const goalFilter = type === "casa" ? "casa" : "fuerza";

  const dayPlans = split.map((d) => {
    const byGroup = {};
    d.g.forEach(g => {
      const seen = new Set(); const list = [];
      EXERCISES.filter(ex => {
        if (!ex.goals.includes(goalFilter) || ex.group!==g) return false;
        // En casa, filtrar por material disponible
        if (type==="casa" && equip && equip.length) return ex.equip.some(e => equip.includes(e));
        return true;
      })
        .sort((a,b)=>(a.id.charCodeAt(0)-b.id.charCodeAt(0)))
        .forEach(ex => { if(!seen.has(ex.name)){ seen.add(ex.name); list.push(ex); } });
      byGroup[g] = list;
    });
    const chosen = []; const usedNames = new Set(); let idx = 0;
    while (chosen.length < nEx) {
      let added = false;
      for (const g of d.g) {
        const list = byGroup[g] || [];
        if (list[idx] && !usedNames.has(list[idx].name)) { chosen.push(list[idx]); usedNames.add(list[idx].name); added = true; if (chosen.length >= nEx) break; }
      }
      idx++;
      if (!added && idx > 12) break;
    }
    const exercises = chosen.map(ex => ({ id:ex.id, name:ex.name, group:ex.group, series:p.series, reps:p.reps, rir:p.rir }));
    const groupsLabel = d.g.map(g=>MUSCLE_LABELS[g]).filter((v,i,a)=>a.indexOf(v)===i).join(" · ");
    return { name:d.n, groups:d.g, groupsLabel, exercises };
  });

  return { type, params:p, dayPlans };
}

// Recomienda días de entreno según nivel
function recommendedDays(level) {
  return level==="principiante" ? 3 : level==="intermedio" ? 4 : 5;
}

// Disciplinas disponibles para atleta híbrido
const HYBRID_DISCIPLINES = [
  { id:"fuerza", label:"Fuerza", desc:"Gimnasio / pesas", session:"Fuerza · cuerpo completo" },
  { id:"carrera", label:"Carrera", desc:"Running", session:"Carrera" },
  { id:"bici", label:"Bici", desc:"Ciclismo", session:"Bici" },
  { id:"natacion", label:"Natación", desc:"Piscina", session:"Natación" },
  { id:"core", label:"Core", desc:"Abdomen / zona media", session:"Core y estabilidad" },
  { id:"estiramiento", label:"Estiramientos", desc:"Movilidad", session:"Estiramientos y movilidad" },
];

// Construye los ejercicios concretos de un día híbrido según la disciplina
function hybridDayExercises(discId) {
  if (discId === "fuerza") {
    // Cuerpo completo: compuestos de varios grupos
    const pick = ["pecho","espalda","pierna","hombro","core"];
    const list = [];
    pick.forEach(g => {
      const ex = EXERCISES.find(e => e.group===g && e.goals.includes("fuerza"));
      if (ex) list.push({ id:ex.id, name:ex.name, group:ex.group, series:4, reps:"6-10", rir:"1-2" });
    });
    return list;
  }
  if (discId === "core") {
    const list = EXERCISES.filter(e => e.group==="core").slice(0,5).map(ex=>({ id:ex.id, name:ex.name, group:"core", series:3, reps:"12-15", rir:"1-2" }));
    return list.length ? list : [{ id:"core_plancha", name:"Plancha", group:"core", series:3, reps:"40-60 seg", rir:"" }];
  }
  if (discId === "estiramiento") {
    return [{ id:"estiramiento_dia", name:"Rutina de movilidad y estiramientos", group:"movilidad", series:"15-20 min", reps:"", rir:"" }];
  }
  // Disciplinas cardio: carrera, bici, natación → sesión con dist/tiempo
  const cardioNames = { carrera:"Sesión de carrera", bici:"Salida en bici", natacion:"Sesión de natación" };
  return [{ id:`${discId}_session`, name:cardioNames[discId]||"Sesión", group:"cardio", series:"1 sesión", reps:"", rir:"" }];
}

// Detalle descriptivo de cada disciplina
function hybridDayDetail(discId) {
  return {
    fuerza:"Entrenamiento de fuerza de cuerpo completo con ejercicios compuestos. Apunta el peso y las reps de cada serie.",
    carrera:"Sesión de carrera: rodaje suave, series o tirada larga según cómo te encuentres. Registra distancia y tiempo.",
    bici:"Salida en bici combinando fondo e intensidad. Registra distancia y tiempo.",
    natacion:"Sesión de natación: técnica y series de resistencia, alternando estilos. Registra distancia y tiempo.",
    core:"Trabajo de core y zona media: plancha, hollow, rotaciones. Clave para rendir en todos los deportes.",
    estiramiento:"15-20 min de estiramientos y movilidad para recuperar y prevenir lesiones.",
  }[discId] || "";
}

// Genera una semana híbrida repartiendo las disciplinas elegidas en los días disponibles
function generateHybridRoutine(disciplines, days) {
  const sessions = [];
  const discObjs = disciplines.map(id => HYBRID_DISCIPLINES.find(d=>d.id===id)).filter(Boolean);
  if (!discObjs.length) return [];
  for (let i=0; i<days; i++) {
    const disc = discObjs[i % discObjs.length];
    sessions.push({
      disc: disc.id, session: disc.session, label: disc.label,
      detail: hybridDayDetail(disc.id),
      exercises: hybridDayExercises(disc.id),
    });
  }
  return sessions;
}

// Nombres de los días de la semana (Lunes a Domingo)
const WEEKDAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

// Reparte N días de entreno en la semana (7 días) de forma óptima, dejando descansos espaciados.
// Devuelve un array de 7 posiciones con true (entreno) o false (descanso).
function distributeTrainingDays(numTrain, restDayIdx) {
  const slots = new Array(7).fill(false);
  if (restDayIdx != null && restDayIdx >= 0) {
    // El usuario eligió un día concreto de descanso → el resto se reparte
    const trainable = [];
    for (let i=0;i<7;i++) if (i!==restDayIdx) trainable.push(i);
    // Coger numTrain días de los trainables, espaciados
    if (numTrain >= trainable.length) { trainable.forEach(i=>slots[i]=true); }
    else {
      // repartir uniformemente
      for (let k=0;k<numTrain;k++){ const idx = trainable[Math.round(k*(trainable.length-1)/(numTrain-1||1))]; slots[idx]=true; }
    }
    return slots;
  }
  // Aleatorio/óptimo: repartir numTrain entrenos espaciados en 7 días
  for (let k=0;k<numTrain;k++){ const idx = Math.round(k*6/(numTrain-1||1)); slots[idx]=true; }
  // Si por redondeo faltan días, rellenar huecos
  let count = slots.filter(Boolean).length;
  for (let i=0;i<7 && count<numTrain;i++){ if(!slots[i]){slots[i]=true;count++;} }
  return slots;
}

// Construye la semana L-D a partir de los días de entreno (dayPlans) + opcionalmente días extra (fusión).
// Cada día del resultado: { weekday, rest:bool, workouts:[{name, type, exercises, detail, disc}] }
function buildWeekSchedule(dayPlans, restDayIdx, extraDays) {
  const numTrain = dayPlans.length;
  const slots = distributeTrainingDays(numTrain, restDayIdx);
  const week = [];
  let di = 0; // índice del dayPlan actual
  for (let d=0; d<7; d++) {
    if (!slots[d]) { week.push({ weekday:WEEKDAYS[d], rest:true, workouts:[] }); continue; }
    const dp = dayPlans[di]; di++;
    const workouts = [{
      name: dp.name || dp.session, type: dp.disc || (dp.groups?"fuerza":"fuerza"),
      exercises: dp.exercises || [], detail: dp.hybridDetail || "", disc: dp.disc,
    }];
    // Día extra (fusión): se añade un segundo entreno a este día si hay extras disponibles
    if (extraDays && extraDays.length) {
      const ex = extraDays[di % extraDays.length];
      if (ex) workouts.push({ name:ex.name, type:ex.type, exercises:ex.exercises||[], detail:ex.detail||"", extra:true });
    }
    week.push({ weekday:WEEKDAYS[d], rest:false, workouts });
  }
  return week;
}

function TrainingTab({ trainingState, setTrainingState, workoutLog, setWorkoutLog, savedRoutine, setSavedRoutine, racePlan, setRacePlan, onGoTo }) {
  // trainingState: { goal, equipment, seed, exercises (ids), overrides:{exId:altId} }
  const [step, setStep] = useState(trainingState?.goal ? "workout" : "goal");
  const [tempGoal, setTempGoal] = useState(null);
  const [tempEquip, setTempEquip] = useState([]);
  const [swapping, setSwapping] = useState(null); // ejercicio que se está sustituyendo
  const [customForm, setCustomForm] = useState(null); // formulario de ejercicio personalizado
  const [marks, setMarks] = useState({}); // {exId: [{peso,reps}...]} de la sesión actual
  const [comment, setComment] = useState("");
  const [viewExercise, setViewExercise] = useState(null); // ver animación en grande
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [newPRs, setNewPRs] = useState([]);
  const [savingRoutine, setSavingRoutine] = useState(false);
  const [tempMuscles, setTempMuscles] = useState([]);
  const [weekType, setWeekType] = useState(null);
  const [weekFocus, setWeekFocus] = useState(null);
  const [weekDays, setWeekDays] = useState(null);
  const [restDay, setRestDay] = useState(null); // día de descanso elegido (0-6) o null=óptimo
  const [weekLevel, setWeekLevel] = useState(null);
  const [weekEquip, setWeekEquip] = useState([]);
  const [hybridDiscs, setHybridDiscs] = useState([]);
  const [hybridDays, setHybridDays] = useState(4);
  const [viewHybridDay, setViewHybridDay] = useState(null);
  const [confirmDeleteRoutine, setConfirmDeleteRoutine] = useState(false);
  // Planificador de carrera
  const [raceDiscipline, setRaceDiscipline] = useState(null); // "running" | "bici"
  const [raceBikeType, setRaceBikeType] = useState(null); // "mtb" | "carretera"
  const [raceRunType, setRaceRunType] = useState(null); // "asfalto" | "trail"
  const [raceRunDesnivel, setRaceRunDesnivel] = useState(""); // desnivel trail
  const [raceMarks, setRaceMarks] = useState({}); // {5k:"25:00",...}
  const [raceTarget, setRaceTarget] = useState(null); // id distancia (running)
  const [raceTargetTime, setRaceTargetTime] = useState(""); // tiempo objetivo
  const [raceBikeKm, setRaceBikeKm] = useState(""); // km objetivo bici
  const [raceBikeDesnivel, setRaceBikeDesnivel] = useState(""); // desnivel bici
  const [raceLevel, setRaceLevel] = useState(null);
  const [raceExperience, setRaceExperience] = useState(null);
  const [raceDays, setRaceDays] = useState(4);
  const [phaseComplete, setPhaseComplete] = useState(false); // animación fase completada
  const [creatingRacePlan, setCreatingRacePlan] = useState(false); // animación al crear plan
  const [confirmWeek, setConfirmWeek] = useState(false); // pop-up confirmar completar semana
  const [weekComplete, setWeekComplete] = useState(false); // animación semana completada
  const [confirmFinishRoutineWeek, setConfirmFinishRoutineWeek] = useState(false); // pop-up finalizar semana de rutina
  const [askNextWeek, setAskNextWeek] = useState(false); // pop-up ¿otra semana igual?
  const [routineConflict, setRoutineConflict] = useState(null); // {pending} datos de la rutina nueva pendiente de confirmar
  const [confirmDeleteRace, setConfirmDeleteRace] = useState(false);

  // Subir arriba al cambiar de pantalla interna del entreno
  useEffect(() => { window.scrollTo(0, 0); }, [step, swapping, customForm]);

  const goal = trainingState?.goal;
  const equipment = trainingState?.equipment || [];
  const seed = trainingState?.seed || 0;
  const muscleGroups = trainingState?.muscleGroups || null;

  // Lista de ejercicios actual (con sustituciones aplicadas)
  // Si el entreno viene de un día de la rutina, usar ejercicios fijos; si no, generar
  const fixedExercises = trainingState?.fixedExercises || null;
  const baseExercises = fixedExercises
    ? fixedExercises.map(fe => {
        const base = EXERCISES.find(e=>e.id===fe.id);
        if (!base) {
          // Ejercicio que no está en la base (sesión de carrera/bici/natación o movilidad)
          const isCardio = (fe.group==="cardio");
          return { id:fe.id, name:fe.name, group:fe.group||"cardio", anim:isCardio?"cardio":"movilidad", metric:isCardio?"cardio":"tiempo",
            series: (fe.series && fe.reps) ? `${fe.series} × ${fe.reps}` : (fe.series||"1 sesión"),
            rir: fe.rir||"", goals:["running"], equip:["peso_corporal"], _custom:true };
        }
        const series = (fe.series && fe.reps) ? `${fe.series} × ${fe.reps}` : base.series;
        return { ...base, series, rir: fe.rir || base.rir };
      }).filter(Boolean)
    : (goal ? generateWorkout(goal, equipment, seed, muscleGroups) : []);
  const exercises = baseExercises.map(ex => {
    const override = trainingState?.overrides?.[ex.id];
    if (override) {
      if (typeof override === "object") return { ...override, _custom:true };
      const alt = EXERCISES.find(e=>e.id===override); if (alt) return alt;
    }
    return ex;
  });

  const startWorkout = () => {
    setTrainingState({ goal:tempGoal, equipment:tempEquip, seed:0, overrides:{} });
    setStep("workout");
  };

  const startStrengthWorkout = () => {
    setTrainingState({ goal:"fuerza", equipment:[], seed:0, overrides:{}, muscleGroups: tempMuscles.length?tempMuscles:null });
    setStep("workout");
  };

  // Entrenar un día concreto de la rutina guardada
  const startRoutineDay = (dayPlan) => {
    setTrainingState({ goal:"fuerza", equipment:[], seed:0, overrides:{}, fixedExercises: dayPlan.exercises, routineDayName: dayPlan.name });
    setMarks({});
    setStep("workout");
  };

  // Entrenar un día (de rutina normal o híbrida). Detecta si es cardio para el formato correcto.
  const startHybridOrRoutineDay = (dayPlan) => {
    const isCardioDay = dayPlan.disc==="carrera" || dayPlan.disc==="bici" || dayPlan.disc==="natacion";
    setTrainingState({
      goal: isCardioDay ? "running" : "fuerza",
      equipment:[], seed:0, overrides:{},
      fixedExercises: dayPlan.exercises,
      routineDayName: dayPlan.name,
      raceCardio: isCardioDay,
    });
    setMarks({});
    setStep("workout");
  };

  // Entrenar un workout concreto de la semana estructurada (schedule)
  const startScheduledWorkout = (day, dayIdx, workout, workoutIdx) => {
    const isCardio = workout.type==="carrera" || workout.type==="bici" || workout.type==="natacion";
    let fixed;
    if (workout.exercises && workout.exercises.length) {
      fixed = workout.exercises;
    } else if (isCardio) {
      const exId = workout.type==="bici"?"bike_session":workout.type==="natacion"?"natacion_session":"run_session";
      fixed = [{ id:exId, name:workout.name, group:"cardio", series:"1 sesión", reps:"", rir:"" }];
    } else {
      fixed = [{ id:`${workout.type}_dia`, name:workout.name, group:workout.type==="core"?"core":"movilidad", series:workout.type==="core"?3:"15-20 min", reps:workout.type==="core"?"12-15":"", rir:"" }];
    }
    setTrainingState({
      goal: isCardio ? "running" : "fuerza",
      equipment:[], seed:0, overrides:{},
      fixedExercises: fixed,
      routineDayName: `${day.weekday} · ${workout.name}`,
      raceCardio: isCardio,
      schedCtx: { dayIdx, workoutIdx },
    });
    setMarks({});
    setStep("workout");
  };

  // Finalizar la semana de la rutina: muestra el pop-up de "¿otra semana?"
  const finishRoutineWeek = () => {
    setConfirmFinishRoutineWeek(false);
    setWeekComplete(true);
    setTimeout(()=>{ setWeekComplete(false); setAskNextWeek(true); }, 2000);
  };

  // Regenerar la misma rutina para la semana siguiente (misma estructura) y limpiar los días hechos
  const regenerateSameRoutine = () => {
    if (!savedRoutine) return;
    const weekNum = (savedRoutine.weekNum||1) + 1;
    let nueva;
    if (savedRoutine.hybrid) {
      const sessions = generateHybridRoutine(savedRoutine.discs, savedRoutine.days);
      const dps = sessions.map(s=>({ name:s.session, groupsLabel:s.label, exercises:s.exercises, hybridDetail:s.detail, disc:s.disc }));
      nueva = { ...savedRoutine, sessions, dayPlans: dps, schedule: buildWeekSchedule(dps, savedRoutine.restDay??null, null), doneDays:[], weekNum, ts:Date.now() };
    } else {
      const routine = generateWeeklyRoutine(savedRoutine.type, savedRoutine.focus, savedRoutine.days, savedRoutine.level, savedRoutine.equip||[]);
      nueva = { ...savedRoutine, params:routine.params, dayPlans:routine.dayPlans, schedule: buildWeekSchedule(routine.dayPlans, savedRoutine.restDay??null, null), doneDays:[], weekNum, ts:Date.now() };
    }
    // Los entrenos quedan guardados en el calendario; solo reiniciamos los checks (doneDays).
    setSavedRoutine(nueva);
    setAskNextWeek(false);
  };

  // Guardar una rutina con animación y volver al inicio de Entreno
  const saveRoutineWithAnimation = (routineData) => {
    setSavedRoutine(routineData);
    setSavingRoutine(true);
    setTimeout(()=>{ setSavingRoutine(false); setStep("goal"); }, 2200);
  };

  // ¿Hay ya alguna rutina o plan activos? (para avisar de conflicto)
  const hasActivePlan = () => (savedRoutine || racePlan);

  // Intentar guardar una rutina nueva: si ya hay otra rutina/plan, avisar; si no, guardar
  const attemptSaveRoutine = (routineData) => {
    if (hasActivePlan()) {
      setRoutineConflict({ kind:"routine", data:routineData });
    } else {
      saveRoutineWithAnimation(routineData);
    }
  };

  // Fusiona la rutina pendiente con lo que ya existe (alta exigencia, días extra)
  const mergeRoutines = () => {
    const c = routineConflict;
    if (!c) return;
    // CASO 1: hay un plan de carrera activo → añadir los días de la rutina nueva como EXTRA a cada semana del plan
    if (racePlan && c.kind==="routine") {
      const nuevaData = c.data;
      // Días extra a añadir (de fuerza/disciplinas de la rutina nueva)
      const extraDays = (nuevaData.dayPlans||[]).map(dp => ({
        type: dp.disc==="carrera"||dp.disc==="bici"||dp.disc==="natacion" ? dp.disc : "fuerza",
        name: dp.name + " (extra)",
        detail: dp.hybridDetail || "Sesión extra de tu otra rutina para subir la carga.",
        exercises: dp.exercises || [],
        extra: true,
      }));
      setRacePlan(prev => {
        if (!prev) return prev;
        const phases = prev.phases.map(ph => ({
          ...ph,
          weekPlans: ph.weekPlans.map(wp => ({ ...wp, sessions: [...wp.sessions, ...extraDays.map(e=>({ type:e.type, name:e.name, detail:e.detail, exercises:e.exercises, extra:true }))] })),
        }));
        return { ...prev, phases, merged:true };
      });
      setRoutineConflict(null);
      setSavingRoutine(true);
      setTimeout(()=>{ setSavingRoutine(false); setStep("race_plan"); }, 2200);
      return;
    }
    // CASO 2: dos rutinas normales/híbridas → fusionar por días (dobles sesiones) en una semana estructurada
    if (savedRoutine && c.kind==="routine") {
      const dpsA = savedRoutine.dayPlans || [];
      const dpsB = c.data.dayPlans || [];
      // A son los días principales; B se añaden como segundo entreno del día (días extra)
      const extraDays = dpsB.map(dp => ({
        type: dp.disc==="carrera"||dp.disc==="bici"||dp.disc==="natacion" ? dp.disc : "fuerza",
        name: dp.name, detail: dp.hybridDetail||"", exercises: dp.exercises||[], extra:true,
      }));
      const days = Math.max(savedRoutine.days||4, c.data.days||4);
      const discs = Array.from(new Set([...(savedRoutine.hybrid?savedRoutine.discs:["fuerza"]), ...(c.data.hybrid?c.data.discs:["fuerza"])]));
      const schedule = buildWeekSchedule(dpsA, savedRoutine.restDay??null, extraDays);
      const nueva = { hybrid:true, days, discs, doneDays:[], weekNum:1, merged:true, restDay:savedRoutine.restDay??null,
        dayPlans: dpsA, schedule, ts:Date.now() };
      setRoutineConflict(null);
      saveRoutineWithAnimation(nueva);
      return;
    }
    // CASO 3: rutina pendiente es un PLAN de carrera y ya hay una rutina → añadir días de la rutina como extra al plan
    if (c.kind==="race" && savedRoutine) {
      // El plan ya se habrá construido; lo recogemos de c.data (racePlan)
      const extraDays = (savedRoutine.dayPlans||[]).map(dp => ({
        type: dp.disc==="carrera"||dp.disc==="bici"||dp.disc==="natacion" ? dp.disc : "fuerza",
        name: dp.name + " (extra)", detail: dp.hybridDetail || "Sesión extra de tu otra rutina.", exercises: dp.exercises || [], extra:true,
      }));
      const plan = c.data;
      const phases = plan.phases.map(ph => ({
        ...ph,
        weekPlans: ph.weekPlans.map(wp => ({ ...wp, sessions:[...wp.sessions, ...extraDays.map(e=>({ type:e.type, name:e.name, detail:e.detail, exercises:e.exercises, extra:true }))] })),
      }));
      setRacePlan({ ...plan, phases, merged:true });
      setSavedRoutine(null); // la rutina se absorbe en el plan
      setRoutineConflict(null);
      setCreatingRacePlan(true);
      setTimeout(()=>{ setCreatingRacePlan(false); setStep("race_plan"); }, 2400);
      return;
    }
    setRoutineConflict(null);
  };

  // Construye el plan de carrera completo (con fases) y lo guarda
  const buildRacePlan = () => {
    let plan;
    if (raceDiscipline==="running") {
      // Convertir marcas a segundos
      const marksSecs = {};
      Object.keys(raceMarks).forEach(k=>{ const s=parseTimeToSecs(raceMarks[k]); if(s>0) marksSecs[k]=s; });
      const phases = racePhases(marksSecs, raceTarget);
      const targetKm = RACE_DISTANCES.find(d=>d.id===raceTarget).km;
      const pred = bestPrediction(marksSecs, targetKm);
      const objSecs = parseTimeToSecs(raceTargetTime);
      // ¿Es realista el objetivo?
      let realismo = "sin_objetivo";
      if (objSecs>0 && pred>0) realismo = objSecs >= pred*0.97 ? "realista" : "ambicioso";
      // Ritmo objetivo (del objetivo o de la predicción)
      const refSecs = objSecs>0 ? objSecs : pred;
      const targetPace = refSecs>0 ? refSecs/targetKm : 0;
      // Generar plan de cada fase
      const phasePlans = phases.map(pid => {
        const ph = generateRunPhase(pid, raceLevel, raceDays, targetPace, raceExperience, raceRunType, parseInt(raceRunDesnivel)||0);
        return { ...ph, label: RACE_DISTANCES.find(d=>d.id===pid).label, completed:false };
      });
      const totalWeeks = phasePlans.reduce((a,p)=>a+p.weeks,0);
      const finishDate = new Date(); finishDate.setDate(finishDate.getDate()+totalWeeks*7);
      // Mensaje del entrenador según nivel/experiencia
      const coach = raceCoachMessage("running", raceLevel, raceExperience, raceTarget, phases.length);
      plan = {
        discipline:"running", runType:raceRunType, runDesnivel:parseInt(raceRunDesnivel)||0, target:raceTarget, targetLabel:RACE_DISTANCES.find(d=>d.id===raceTarget).label,
        marks:marksSecs, prediction:pred, objective:objSecs, realismo, targetPace,
        level:raceLevel, experience:raceExperience, days:raceDays, phases:phasePlans, currentPhase:0, currentWeek:0,
        totalWeeks, estFinish:finishDate.toISOString(), coach, ts:Date.now(),
      };
    } else {
      // BICI
      const km = parseInt(raceBikeKm)||0;
      const desn = parseInt(raceBikeDesnivel)||0;
      const ph = generateBikePhase(km, desn, raceLevel, raceDays, raceExperience);
      const coach = raceCoachMessage("bici", raceLevel, raceExperience, null, 1);
      plan = {
        discipline:"bici", bikeType:raceBikeType, km, desnivel:desn, level:raceLevel, experience:raceExperience, days:raceDays,
        phases:[{ ...ph, label:`${km} km${desn?` · ${desn}m`:""}`, completed:false }],
        currentPhase:0, currentWeek:0, totalWeeks:ph.weeks, coach,
        estFinish:(()=>{ const d=new Date(); d.setDate(d.getDate()+ph.weeks*7); return d.toISOString(); })(), ts:Date.now(),
      };
    }
    // Si ya hay una rutina activa, avisar del conflicto en vez de crear directamente
    if (savedRoutine) {
      setRoutineConflict({ kind:"race", data:plan });
      return;
    }
    setRacePlan(plan);
    // Animación de "plan creado" antes de mostrarlo
    setCreatingRacePlan(true);
    setTimeout(()=>{ setCreatingRacePlan(false); setStep("race_plan"); window.scrollTo(0,0); }, 2400);
  };

  // Iniciar una sesión del plan de carrera (fuerza = ejercicios; carrera/bici = registro simple)
  const startRaceSession = (session, sessionIdx) => {
    const raceCtx = { phase: racePlan?.currentPhase||0, week: racePlan?.currentWeek||0, sessionIdx };
    if (session.type === "fuerza") {
      let fixed;
      if (session.exercises && session.exercises.length) {
        // Día extra fusionado: usar sus propios ejercicios
        fixed = session.exercises;
      } else {
        const pool = EXERCISES.filter(ex => ex.goals.includes("fuerza") && (ex.group==="pierna"||ex.group==="core"));
        const seen = new Set(); const list = [];
        pool.sort((a,b)=>(a.id.charCodeAt(0)-b.id.charCodeAt(0))).forEach(ex=>{ if(!seen.has(ex.name)){seen.add(ex.name);list.push(ex);} });
        fixed = list.slice(0,6).map(ex=>({ id:ex.id, name:ex.name, group:ex.group, series:4, reps:"10-12", rir:"1-2" }));
      }
      setTrainingState({ goal:"fuerza", equipment:[], seed:0, overrides:{}, fixedExercises:fixed, routineDayName:`${session.name} (plan de carrera)`, raceCtx });
      setMarks({});
      setStep("workout");
    } else {
      const exId = session.type==="bici" ? "bike_session" : session.type==="natacion" ? "natacion_session" : "run_session";
      setTrainingState({ goal:"running", equipment:[], seed:0, overrides:{},
        fixedExercises:[{ id:exId, name:session.name, group:"cardio", series:"1 sesión", reps:"", rir:"" }],
        routineDayName:`${session.name} (plan de carrera)`, raceCardio:true, raceCtx });
      setMarks({});
      setStep("workout");
    }
  };

  // Marcar una sesión como completada en el plan (se llama al terminar el entreno)
  const markRaceSessionDone = (ctx) => {
    if (!ctx) return;
    setRacePlan(prev => {
      if (!prev) return prev;
      const key = `${ctx.phase}_${ctx.week}`;
      const ds = { ...(prev.doneSessions||{}) };
      const arr = ds[key] ? [...ds[key]] : [];
      if (!arr.includes(ctx.sessionIdx)) arr.push(ctx.sessionIdx);
      ds[key] = arr;
      return { ...prev, doneSessions: ds };
    });
  };

  // Avanzar a la siguiente semana de la fase
  const advanceRaceWeek = () => {
    setConfirmWeek(false);
    setWeekComplete(true);
    setTimeout(()=>{
      setWeekComplete(false);
      setRacePlan(prev => prev ? { ...prev, currentWeek: (prev.currentWeek||0)+1 } : prev);
      window.scrollTo(0,0);
    }, 2000);
  };

  // Marcar la fase actual como completada y avanzar (con animación)
  const completeRacePhase = () => {
    setPhaseComplete(true);
    setTimeout(()=>{
      setPhaseComplete(false);
      setRacePlan(prev => {
        if (!prev) return prev;
        const phases = prev.phases.map((p,i)=> i===prev.currentPhase ? {...p, completed:true} : p);
        const nextPhase = prev.currentPhase + 1;
        return { ...prev, phases, currentPhase: Math.min(nextPhase, prev.phases.length-1), currentWeek:0, allDone: nextPhase>=prev.phases.length };
      });
    }, 2600);
  };

  const rotate = () => {
    setTrainingState({ ...trainingState, seed:(seed+1), overrides:{} });
    setMarks({});
  };

  const changeGoal = () => { setStep("goal"); setTempGoal(null); setTempEquip([]); if (trainingState?.fixedExercises) setTrainingState({ ...trainingState, fixedExercises:null, routineDayName:null, goal:null }); };

  // Días de rutina completados esta semana (lunes a domingo)
  const completedRoutineDaysThisWeek = (() => {
    // Los días completados de la semana actual se guardan en la propia rutina (doneDays).
    // Así al finalizar semana o regenerar se resetean al 100% sin depender de fechas.
    return new Set(savedRoutine?.doneDays || []);
  })();

  const swapExercise = (exId, altId) => {
    setTrainingState({ ...trainingState, overrides:{ ...(trainingState.overrides||{}), [exId]:altId } });
    setSwapping(null);
  };

  // Sustituir por un ejercicio personalizado (objeto completo)
  const swapCustomExercise = (exId, custom) => {
    setTrainingState({ ...trainingState, overrides:{ ...(trainingState.overrides||{}), [exId]: custom } });
    setSwapping(null);
    setCustomForm(null);
  };

  const setMark = (exId, idx, field, value) => {
    setMarks(prev => {
      const list = [...(prev[exId]||[])];
      list[idx] = { ...(list[idx]||{}), [field]:value };
      return { ...prev, [exId]:list };
    });
  };

  const doFinishWorkout = () => {
    const now = new Date();
    // Detectar récords personales (peso máximo por ejercicio)
    const prs = [];
    exercises.forEach(ex => {
      const todayMax = Math.max(0, ...((marks[ex.id]||[]).map(s => parseFloat(s?.peso)||0)));
      if (todayMax <= 0) return;
      // Máximo histórico anterior de este ejercicio
      let prevMax = 0;
      Object.values(workoutLog||{}).forEach(w => {
        const m = w.marks?.[ex.id];
        if (m) m.forEach(s => { const p = parseFloat(s?.peso)||0; if (p>prevMax) prevMax = p; });
      });
      if (todayMax > prevMax && prevMax >= 0) {
        prs.push({ name:ex.name, weight:todayMax, prev:prevMax });
      }
    });

    const key = dateKey(now) + "_" + Date.now();
    const entry = { date: dateKey(now), goal, exercises: exercises.map(e=>({ id:e.id, name:e.name, series:e.series })), marks, comment, ts: Date.now(), routineDay: trainingState?.routineDayName||null };
    setWorkoutLog(prev => ({ ...prev, [key]: entry }));
    // Si es una sesión del plan de carrera, marcarla como completada
    if (trainingState?.raceCtx) markRaceSessionDone(trainingState.raceCtx);
    // Si es un día de la rutina guardada, marcarlo como hecho (check) en la propia rutina
    const rDay = trainingState?.routineDayName;
    const schedCtx = trainingState?.schedCtx;
    if (schedCtx && savedRoutine?.schedule) {
      // Rutina con semana estructurada: marcar el workout concreto (diaIdx_workoutIdx)
      const keyW = `${schedCtx.dayIdx}_${schedCtx.workoutIdx}`;
      setSavedRoutine(prev => {
        if (!prev) return prev;
        const dd = prev.doneDays ? [...prev.doneDays] : [];
        if (!dd.includes(keyW)) dd.push(keyW);
        // ¿Se ha completado toda la semana? (todos los workouts de todos los días no-descanso)
        let totalW = 0; prev.schedule.forEach((d)=>{ if(!d.rest) totalW += d.workouts.length; });
        const allDone = dd.length >= totalW && totalW>0;
        if (allDone) setTimeout(()=>{ setWeekComplete(true); setTimeout(()=>{ setWeekComplete(false); setAskNextWeek(true); }, 2000); }, 700);
        return { ...prev, doneDays: dd };
      });
    } else if (rDay && savedRoutine && !String(rDay).includes("(plan de carrera)")) {
      setSavedRoutine(prev => {
        if (!prev) return prev;
        const dd = prev.doneDays ? [...prev.doneDays] : [];
        if (!dd.includes(rDay)) dd.push(rDay);
        return { ...prev, doneDays: dd };
      });
    }
    setMarks({}); setComment("");
    setConfirmFinish(false);
    if (trainingState?.fixedExercises) setTrainingState({ ...trainingState, fixedExercises:null, routineDayName:null, goal:null, raceCtx:null, schedCtx:null });
    setNewPRs(prs);
    setCelebrating(true);
    // Si hay récords, la animación dura un poco más para verlos
    const dur = prs.length ? 3600 : 2400;
    setTimeout(()=>{ setCelebrating(false); setNewPRs([]); if (onGoTo) onGoTo("inicio"); }, dur);
  };

  // Busca la última sesión registrada de un ejercicio (sus marcas) para mostrarlas como referencia
  const lastMarksFor = (exId) => {
    const past = Object.values(workoutLog)
      .filter(w => w.marks && w.marks[exId] && w.marks[exId].some(s => s && (s.peso || s.reps)))
      .sort((a,b) => b.ts - a.ts);
    if (!past.length) return null;
    return { date: past[0].date, series: past[0].marks[exId] };
  };

  // Overlay de animación al guardar rutina (visible desde cualquier paso)
  // Pop-up de conflicto: ya hay una rutina/plan y se intenta crear otra
  if (routineConflict) {
    const existing = racePlan ? "plan de carrera" : savedRoutine?.hybrid ? "rutina híbrida" : "rutina semanal";
    const nuevaEsRace = routineConflict.kind==="race";
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(5px)", WebkitBackdropFilter:"blur(5px)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.3s ease" }}>
        <div style={{ background:"#16161f", borderRadius:22, padding:"26px 22px", maxWidth:380, width:"100%", border:"1px solid #3a3a2a", animation:"scale-fade 0.35s ease", maxHeight:"88vh", overflowY:"auto" }}>
          <div style={{ color:"#ffb74d", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, textAlign:"center", marginBottom:8 }}>Aviso</div>
          <div style={{ color:"white", fontWeight:900, fontSize:19, textAlign:"center", marginBottom:10 }}>Ya tienes un {existing} activo</div>
          <div style={{ color:"#aaa", fontSize:13.5, textAlign:"center", lineHeight:1.55, marginBottom:22 }}>Tener dos planes a la vez hace difícil cumplir ambos al 100%. ¿Qué prefieres hacer?</div>

          {/* Quedarme con la nueva */}
          <button onClick={()=>{
            const c = routineConflict; setRoutineConflict(null);
            if (c.kind==="race") { setSavedRoutine(null); setRacePlan(c.data); setCreatingRacePlan(true); setTimeout(()=>{ setCreatingRacePlan(false); setStep("race_plan"); }, 2400); }
            else { setRacePlan(null); saveRoutineWithAnimation(c.data); }
          }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:14.5, cursor:"pointer", marginBottom:10 }}>
            Quedarme con {nuevaEsRace?"el nuevo plan de carrera":"la rutina nueva"}
          </button>

          {/* Mantener la actual */}
          <button onClick={()=>{ setRoutineConflict(null); setStep("goal"); }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#ccc", fontWeight:700, fontSize:14, cursor:"pointer", marginBottom:10 }}>
            Mantener mi {existing} actual
          </button>

          {/* Fusionar */}
          <button onClick={mergeRoutines} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #b8860b", background:"linear-gradient(135deg,#2a2410,#1a1a24)", color:"#ffd700", fontWeight:800, fontSize:14, cursor:"pointer" }}>
            Fusionar ambas (alta exigencia)
          </button>
          <div style={{ color:"#666", fontSize:11, textAlign:"center", marginTop:10, lineHeight:1.5 }}>{(racePlan||nuevaEsRace) ? "Al fusionar, añadiremos los entrenos extra a tu plan de carrera para subir la carga." : "Crearemos una rutina semanal combinada subiendo un poco la carga (sin saturar)."}</div>
        </div>
      </div>
    );
  }

  if (creatingRacePlan) {
    return (
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #2a2410 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
        <div style={{ position:"relative", width:130, height:130, marginBottom:28, display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.8s ease-out 0.3s" }}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ position:"absolute", top:0, left:0 }}>
            <circle cx="65" cy="65" r="58" fill="none" stroke="#3a2e0a" strokeWidth="5" />
            <circle cx="65" cy="65" r="58" fill="none" stroke="#ffd700" strokeWidth="5" strokeLinecap="round" pathLength="1" transform="rotate(-90 65 65)" style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.9s ease-out 0.2s forwards" }} />
          </svg>
          <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" style={{ animation:"scale-fade 0.6s ease 0.7s both" }}>
            <path d="M3 11l19-9-9 19-2-8-8-2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ color:"#ffd700", fontWeight:900, fontSize:24, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.9s both", textAlign:"center" }}>¡Plan de carrera creado!</div>
        <div style={{ color:"#fff", fontSize:14, marginTop:10, fontWeight:600, animation:"rise-up 0.5s ease 1.1s both", textAlign:"center" }}>Preparando tu camino hacia la meta…</div>
      </div>
    );
  }

  if (savingRoutine) {
    return (
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #16201a 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
        <div style={{ position:"relative", width:120, height:120, marginBottom:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.6s ease-out 0.4s" }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ position:"absolute", top:0, left:0 }}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#1e3a24" strokeWidth="4" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="#4caf50" strokeWidth="4" strokeLinecap="round"
              pathLength="1" transform="rotate(-90 60 60)"
              style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.7s ease-out 0.2s forwards" }} />
            <path d="M38 62 L53 76 L83 44" fill="none" stroke="#8bc34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
              pathLength="1"
              style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.4s ease-out 0.85s forwards" }} />
          </svg>
        </div>
        <div style={{ color:"white", fontWeight:900, fontSize:24, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.8s both" }}>Rutina guardada</div>
        <div style={{ color:"#4caf50", fontSize:14, marginTop:8, fontWeight:600, letterSpacing:2, textTransform:"uppercase", animation:"rise-up 0.5s ease 1s both" }}>Ya está en tu rutina programada</div>
      </div>
    );
  }

  // ── PASO 1: elegir objetivo ──
  if (step === "goal") {
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        {/* Modal detalle día híbrido */}
        {viewHybridDay && (
          <div onClick={()=>setViewHybridDay(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#16161f", borderRadius:20, padding:"24px 22px", maxWidth:380, width:"100%", border:"1px solid #2a4a5a" }}>
              <div style={{ color:"#4fc3f7", fontWeight:900, fontSize:18, marginBottom:6 }}>{viewHybridDay.name}</div>
              <div style={{ color:"#bde", fontSize:14, lineHeight:1.6, marginBottom:20 }}>{viewHybridDay.hybridDetail}</div>
              <button onClick={()=>setViewHybridDay(null)} style={{ width:"100%", padding:"13px", borderRadius:13, border:"none", background:"linear-gradient(135deg,#0288d1,#01579b)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer" }}>Entendido</button>
            </div>
          </div>
        )}

        {/* Modal confirmar borrar rutina */}
        {/* Animación de semana completada (rutina) */}
        {weekComplete && (
          <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #16201a 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
            <div style={{ position:"relative", width:120, height:120, marginBottom:26, display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.5s ease-out 0.3s" }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ position:"absolute", top:0, left:0 }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1e3a24" strokeWidth="4" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" pathLength="1" transform="rotate(-90 60 60)" style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.7s ease-out 0.2s forwards" }} />
                <path d="M38 62 L53 76 L83 44" fill="none" stroke="#8bc34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.4s ease-out 0.85s forwards" }} />
              </svg>
            </div>
            <div style={{ color:"white", fontWeight:900, fontSize:23, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.8s both", textAlign:"center" }}>¡Semana completada!</div>
            <div style={{ color:"#4caf50", fontSize:13.5, marginTop:8, fontWeight:600, letterSpacing:1, textTransform:"uppercase", animation:"rise-up 0.5s ease 1s both" }}>Buen trabajo esta semana</div>
          </div>
        )}

        {/* Pop-up confirmar finalizar semana de rutina */}
        {confirmFinishRoutineWeek && savedRoutine && (() => {
          let total, hechos;
          if (savedRoutine.schedule) {
            const dd = savedRoutine.doneDays || [];
            total = 0; savedRoutine.schedule.forEach(d=>{ if(!d.rest) total += d.workouts.length; });
            hechos = dd.length;
          } else {
            total = savedRoutine.dayPlans.length;
            hechos = savedRoutine.dayPlans.filter(d=>completedRoutineDaysThisWeek.has(d.name)).length;
          }
          const pendientes = total - hechos;
          return (
            <div onClick={()=>setConfirmFinishRoutineWeek(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
              <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a24", borderRadius:20, padding:"26px 22px", maxWidth:360, width:"100%", border:"1px solid #2a2a3a", animation:"scale-fade 0.3s ease" }}>
                <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Finalizar la semana?</div>
                {pendientes>0 ? (
                  <div style={{ background:"#2a2410", border:"1px solid #b8860b", borderRadius:12, padding:"12px 14px", margin:"14px 0" }}>
                    <div style={{ color:"#ffd700", fontSize:13, fontWeight:700, textAlign:"center", lineHeight:1.5 }}>Te {pendientes===1?"queda":"quedan"} {pendientes} {pendientes===1?"entreno":"entrenos"} sin hacer esta semana.</div>
                    <div style={{ color:"#aa9", fontSize:12, textAlign:"center", marginTop:5 }}>Puedes finalizarla igualmente, pero lo ideal es completar todos los días.</div>
                  </div>
                ) : (
                  <div style={{ color:"#8bc34a", fontSize:13.5, textAlign:"center", lineHeight:1.5, margin:"14px 0" }}>¡Has completado todos los días de la semana! Eres una máquina.</div>
                )}
                <button onClick={finishRoutineWeek} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, finalizar semana</button>
                <button onClick={()=>setConfirmFinishRoutineWeek(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Volver</button>
              </div>
            </div>
          );
        })()}

        {/* Pop-up ¿otra semana con la misma estructura? */}
        {askNextWeek && savedRoutine && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
            <div style={{ background:"#1a1a24", borderRadius:20, padding:"26px 22px", maxWidth:360, width:"100%", border:"1px solid #2a2a3a", animation:"scale-fade 0.3s ease" }}>
              <div style={{ color:"white", fontWeight:900, fontSize:19, textAlign:"center", marginBottom:8 }}>¡Semana terminada!</div>
              <div style={{ color:"#aaa", fontSize:13.5, textAlign:"center", lineHeight:1.55, marginBottom:22 }}>¿Quieres otra semana con la misma estructura, o prefieres cambiar las modalidades y crear una rutina nueva?</div>
              <button onClick={regenerateSameRoutine} style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:savedRoutine.hybrid?"linear-gradient(135deg,#0288d1,#01579b)":"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Otra semana igual</button>
              <button onClick={()=>{ setAskNextWeek(false); if (savedRoutine.hybrid) { setHybridDiscs([]); setStep("hybrid_setup"); } else { setWeekType(null); setWeekFocus(null); setWeekLevel(null); setWeekDays(null); setWeekEquip([]); setStep("weekly_setup"); } }} style={{ width:"100%", padding:"15px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#ccc", fontWeight:700, fontSize:14, cursor:"pointer" }}>Cambiar modalidades</button>
            </div>
          </div>
        )}

        {confirmDeleteRoutine && (
          <div onClick={()=>setConfirmDeleteRoutine(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a24", borderRadius:20, padding:"28px 22px", maxWidth:360, width:"100%", border:"1px solid #2a2a3a", animation:"scale-fade 0.3s ease" }}>
              <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Eliminar tu rutina?</div>
              <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:24 }}>Se borrará tu rutina programada. Tus entrenos ya registrados se mantienen en el historial.</div>
              <button onClick={()=>{ setSavedRoutine(null); setConfirmDeleteRoutine(false); }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#c62828,#8e1f1f)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, eliminar</button>
              <button onClick={()=>setConfirmDeleteRoutine(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Cancelar</button>
            </div>
          </div>
        )}

        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Entrenamiento</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>Entrena hoy o crea tu rutina semanal</div>

        {/* Rutina programada (si hay guardada) */}
        {savedRoutine && (
          <div style={{ marginBottom:20 }}>
            <div style={{ color:"#666", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Tu rutina programada</div>
            <div style={{ background: (savedRoutine.hybrid||savedRoutine.cardio)?"linear-gradient(135deg,#15252e,#16161f)":"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:16, border:`1px solid ${(savedRoutine.hybrid||savedRoutine.cardio)?"#2a4a5a":"#2e7d32"}`, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid #232330", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:(savedRoutine.hybrid||savedRoutine.cardio)?"#4fc3f7":"#8bc34a", fontWeight:800, fontSize:13 }}>{savedRoutine.cardio?`${savedRoutine.dayPlans.length} días de entreno`:savedRoutine.schedule?(()=>{ const dd=savedRoutine.doneDays||[]; let total=0; savedRoutine.schedule.forEach(d=>{if(!d.rest)total+=d.workouts.length;}); return `${dd.length}/${total} entrenos · semana ${savedRoutine.weekNum||1}`; })():`${completedRoutineDaysThisWeek.size}/${savedRoutine.dayPlans.length} días esta semana`}</span>
                <button onClick={()=>setConfirmDeleteRoutine(true)} style={{ background:"none", border:"none", color:"#a44", fontSize:12, cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a44" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                  Eliminar
                </button>
              </div>
              {savedRoutine.schedule ? (() => {
                // Nueva estructura: semana L-D con días y workouts
                const done = savedRoutine.doneDays || []; // claves "diaIdx_workoutIdx"
                const dayIsDone = (di, day) => day.workouts.length>0 && day.workouts.every((_,wi)=>done.includes(`${di}_${wi}`));
                const accent = savedRoutine.hybrid ? "#4fc3f7" : "#8bc34a";
                return savedRoutine.schedule.map((day, di) => {
                  if (day.rest) {
                    return (
                      <div key={di} style={{ padding:"12px 16px", borderBottom:di<6?"1px solid #1e2a1e":"none", display:"flex", justifyContent:"space-between", alignItems:"center", opacity:0.6 }}>
                        <div>
                          <div style={{ color:"#888", fontWeight:700, fontSize:14 }}>{day.weekday}</div>
                          <div style={{ color:"#5a6a5a", fontSize:11, marginTop:2 }}>Descanso</div>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                      </div>
                    );
                  }
                  const dDone = dayIsDone(di, day);
                  return (
                    <div key={di} style={{ borderBottom:di<6?"1px solid #1e2a1e":"none", background:dDone?"rgba(76,175,80,0.05)":"none" }}>
                      <div style={{ padding:"11px 16px 6px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ color:dDone?"#7a9":"white", fontWeight:800, fontSize:14 }}>{day.weekday}</span>
                        {dDone && <span style={{ fontSize:10, background:"#2e7d32", color:"white", borderRadius:20, padding:"2px 8px", fontWeight:700 }}>DÍA COMPLETO</span>}
                      </div>
                      {day.workouts.map((w, wi) => {
                        const wDone = done.includes(`${di}_${wi}`);
                        return (
                          <button key={wi} onClick={()=>startScheduledWorkout(day, di, w, wi)} style={{ width:"100%", padding:"9px 16px 11px", background:"none", border:"none", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                            <div style={{ flex:1, minWidth:0, display:"flex", alignItems:"center", gap:10 }}>
                              <span style={{ fontSize:9, background:w.type==="fuerza"?"#2e4a7a":w.type==="core"?"#5a3a7a":w.type==="estiramiento"?"#3a5a4a":"#7a5a1a", color:"white", borderRadius:20, padding:"2px 7px", fontWeight:700, letterSpacing:0.3, textTransform:"uppercase", flexShrink:0 }}>{w.type==="fuerza"?"Fuerza":w.type==="carrera"?"Carrera":w.type==="bici"?"Bici":w.type==="natacion"?"Natación":w.type==="core"?"Core":w.type==="estiramiento"?"Movilidad":w.type}</span>
                              <span style={{ color:wDone?"#7a9":"#ddd", fontSize:13.5, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{w.name}</span>
                            </div>
                            <div style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${wDone?"#2e7d32":"#3a4a3a"}`, background:wDone?"#2e7d32":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              {wDone
                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                                : <svg width="11" height="11" viewBox="0 0 24 24" fill={accent}><path d="M8 5v14l11-7z"/></svg>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                });
              })() : savedRoutine.dayPlans.map((day,i) => {
                const detailOnly = savedRoutine.cardio;
                const done = !detailOnly && completedRoutineDaysThisWeek.has(day.name);
                const accent = (savedRoutine.hybrid||detailOnly) ? "#4fc3f7" : "#8bc34a";
                const exCount = day.exercises ? day.exercises.length : 0;
                return (
                <button key={i} onClick={()=> detailOnly ? setViewHybridDay({ name:day.name, hybridDetail: day.hybridDetail || day.runDetail }) : startHybridOrRoutineDay(day)} style={{ width:"100%", padding:"13px 16px", background:done?"rgba(76,175,80,0.06)":"none", border:"none", borderBottom:i<savedRoutine.dayPlans.length-1?"1px solid #1e2a1e":"none", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:done?"#7a9":"white", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                      Día {i+1} · {day.name}
                      {done && <span style={{ fontSize:10, background:"#2e7d32", color:"white", borderRadius:20, padding:"2px 8px", fontWeight:700, letterSpacing:0.5 }}>HECHO</span>}
                    </div>
                    <div style={{ color:"#5a7a5a", fontSize:11, marginTop:2 }}>{detailOnly ? day.groupsLabel : `${day.groupsLabel}${exCount?` · ${exCount} ${exCount===1?"bloque":"ejercicios"}`:""}`}</div>
                  </div>
                  <div style={{ width:30, height:30, borderRadius:"50%", border:`1.5px solid ${done?"#2e7d32":(savedRoutine.hybrid||detailOnly)?"#2a4a5a":"#3a5a3a"}`, background:done?"#2e7d32":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {done
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill={accent}><path d="M8 5v14l11-7z"/></svg>}
                  </div>
                </button>
                );
              })}
              {/* Botón finalizar semana (no para las rutinas cardio antiguas de solo-detalle) */}
              {!savedRoutine.cardio && (
                <div style={{ padding:"12px 16px", borderTop:"1px solid #1e2a1e" }}>
                  <button onClick={()=>setConfirmFinishRoutineWeek(true)} style={{ width:"100%", padding:"13px", borderRadius:12, border:`1px solid ${savedRoutine.hybrid?"#2a4a5a":"#2e7d32"}`, background:"transparent", color:savedRoutine.hybrid?"#4fc3f7":"#8bc34a", fontWeight:800, fontSize:14, cursor:"pointer" }}>Finalizar semana →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Crear rutina semanal */}
        <button onClick={()=>{ setWeekType(null); setWeekFocus(null); setWeekLevel(null); setWeekDays(null); setWeekEquip([]); setStep("weekly_setup"); }} style={{ width:"100%", marginBottom:12, padding:"18px", borderRadius:16, border:"1px solid #2e7d32", background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:30 }}>📅</span>
          <div style={{ flex:1 }}>
            <div style={{ color:"#8bc34a", fontWeight:800, fontSize:16 }}>{savedRoutine?"Crear otra rutina semanal":"Crea tu rutina semanal"}</div>
            <div style={{ color:"#777", fontSize:12, marginTop:2 }}>Un plan completo adaptado a tu objetivo y nivel</div>
          </div>
          <span style={{ color:"#4caf50", fontSize:18 }}>→</span>
        </button>

        {/* Atleta híbrido */}
        <button onClick={()=>{ setHybridDiscs([]); setStep("hybrid_setup"); }} style={{ width:"100%", marginBottom:20, padding:"18px", borderRadius:16, border:"1px solid #2a4a5a", background:"linear-gradient(135deg,#15252e,#16161f)", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:30 }}>🔀</span>
          <div style={{ flex:1 }}>
            <div style={{ color:"#4fc3f7", fontWeight:800, fontSize:16 }}>Atleta híbrido</div>
            <div style={{ color:"#777", fontSize:12, marginTop:2 }}>Combina varios deportes en tu semana</div>
          </div>
          <span style={{ color:"#4fc3f7", fontSize:18 }}>→</span>
        </button>

        {/* Planificador de carrera */}
        <button onClick={()=>{ if(racePlan){ setStep("race_plan"); } else { setRaceDiscipline(null); setRaceBikeType(null); setRaceRunType(null); setRaceRunDesnivel(""); setRaceMarks({}); setRaceTarget(null); setRaceTargetTime(""); setRaceBikeKm(""); setRaceBikeDesnivel(""); setRaceLevel(null); setRaceExperience(null); setRaceDays(4); setStep("race_setup"); } }} style={{ width:"100%", marginBottom:20, padding:"18px", borderRadius:16, border:"1px solid #b8860b", background:"linear-gradient(135deg,#2a2410,#16161f)", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:30 }}>🏁</span>
          <div style={{ flex:1 }}>
            <div style={{ color:"#ffd700", fontWeight:800, fontSize:16 }}>{racePlan?"Ver mi plan de carrera":"Planificador de carrera"}</div>
            <div style={{ color:"#777", fontSize:12, marginTop:2 }}>{racePlan?"Continúa tu preparación":"Prepara un 5K, 10K, maratón o ruta en bici"}</div>
          </div>
          <span style={{ color:"#ffd700", fontSize:18 }}>→</span>
        </button>

        <div style={{ color:"#666", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>O entrena hoy</div>
        {TRAINING_GOALS.map(g => (
          <button key={g.id} onClick={()=>{ setTempGoal(g.id); if(g.id==="casa"){ setStep("equip"); } else if(g.id==="fuerza"){ setTempMuscles([]); setStep("muscles"); } else { setTrainingState({ goal:g.id, equipment:[], seed:0, overrides:{} }); setStep("workout"); } }}
            style={{ width:"100%", marginBottom:12, padding:"18px", borderRadius:16, border:"1px solid #2a2a3a", background:"linear-gradient(135deg,#1a1a24,#1f1f2e)", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:30 }}>{g.emoji}</span>
            <div>
              <div style={{ color:"white", fontWeight:800, fontSize:16 }}>{g.label}</div>
              <div style={{ color:"#777", fontSize:12, marginTop:2 }}>{g.desc}</div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // ── PASO: elegir grupos musculares (fuerza) ──
  if (step === "muscles") {
    const MUSCLES = [
      { id:"pecho", label:"Pecho", emoji:"🫀" },
      { id:"espalda", label:"Espalda", emoji:"🔙" },
      { id:"pierna", label:"Pierna", emoji:"🦵" },
      { id:"hombro", label:"Hombro", emoji:"💪" },
      { id:"brazo", label:"Brazo", emoji:"💪" },
      { id:"core", label:"Core / Abdomen", emoji:"🎯" },
    ];
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("goal")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>¿Qué quieres entrenar?</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:22 }}>Selecciona los grupos musculares (o ninguno para un entreno completo)</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          {MUSCLES.map(mus => {
            const sel = tempMuscles.includes(mus.id);
            return (
              <button key={mus.id} onClick={()=>setTempMuscles(sel?tempMuscles.filter(x=>x!==mus.id):[...tempMuscles,mus.id])}
                style={{ padding:"16px 10px", borderRadius:14, border:`2px solid ${sel?"#4caf50":"#2a2a3a"}`, background:sel?"#1a3a1a":"#1a1a24", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:26 }}>{mus.emoji}</span>
                <span style={{ color:sel?"#4caf50":"#aaa", fontSize:13, fontWeight:700 }}>{mus.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={startStrengthWorkout} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:900, fontSize:16, cursor:"pointer" }}>{tempMuscles.length?`Generar entreno (${tempMuscles.length} grupo${tempMuscles.length!==1?"s":""})`:"Generar entreno completo →"}</button>
      </div>
    );
  }

  // ── PASO: asistente rutina semanal ──
  if (step === "weekly_setup") {
    const TYPES = [
      { id:"gimnasio", label:"Gimnasio", desc:"Pesas y máquinas" },
      { id:"casa", label:"En casa", desc:"Peso corporal y poco material" },
      { id:"running", label:"Running", desc:"Carrera: rodajes, series, tiradas" },
      { id:"cardio", label:"Cardio / HIIT", desc:"Quema intensa, sin carrera" },
    ];
    const FOCUS = [
      { id:"masa", label:"Ganar masa muscular", desc:"Aumentar el tamaño del músculo" },
      { id:"estetica", label:"Estética / definición", desc:"Marcar y tonificar el cuerpo" },
      { id:"fuerza", label:"Fuerza", desc:"Levantar más peso, más potencia" },
      { id:"resistencia", label:"Resistencia muscular", desc:"Aguantar más repeticiones" },
    ];
    const LEVELS = [
      { id:"principiante", label:"Principiante", desc:"Empiezo ahora o llevo poco" },
      { id:"intermedio", label:"Intermedio", desc:"Llevo meses entrenando" },
      { id:"avanzado", label:"Avanzado", desc:"Años de experiencia" },
    ];
    const needsFocus = weekType==="gimnasio" || weekType==="casa";
    const recDays = weekLevel ? recommendedDays(weekLevel) : null;
    const canGenerate = weekType && weekLevel && weekDays && (!needsFocus || weekFocus) && (weekType!=="casa" || weekEquip.length>0);

    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("goal")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Crea tu rutina semanal</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:22 }}>Responde unas preguntas y te montamos un plan a medida</div>

        {/* Tipo de entrenamiento */}
        <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>¿Qué tipo de entrenamiento?</div>
        {TYPES.map(t => (
          <button key={t.id} onClick={()=>{ setWeekType(t.id); if(t.id!=="gimnasio"&&t.id!=="casa") setWeekFocus(null); }} style={{ width:"100%", marginBottom:8, padding:"14px", borderRadius:12, border:`2px solid ${weekType===t.id?"#4caf50":"#2a2a3a"}`, background:weekType===t.id?"#1a3a1a":"#1a1a24", cursor:"pointer", textAlign:"left" }}>
            <div style={{ color:weekType===t.id?"#4caf50":"white", fontWeight:700, fontSize:15 }}>{t.label}</div><div style={{ color:"#777", fontSize:11.5, marginTop:1 }}>{t.desc}</div>
          </button>
        ))}

        {/* Material (solo en casa) */}
        {weekType==="casa" && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"20px 0 10px" }}>¿Qué material tienes en casa?</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {EQUIPMENT.map(eq => {
                const sel = weekEquip.includes(eq.id);
                return (
                  <button key={eq.id} onClick={()=>setWeekEquip(sel?weekEquip.filter(x=>x!==eq.id):[...weekEquip,eq.id])} style={{ padding:"13px 10px", borderRadius:12, border:`2px solid ${sel?"#4caf50":"#2a2a3a"}`, background:sel?"#1a3a1a":"#1a1a24", cursor:"pointer", display:"flex", alignItems:"center", gap:8, textAlign:"left" }}>
                    <span style={{ fontSize:18 }}>{eq.emoji}</span>
                    <span style={{ color:sel?"#4caf50":"#aaa", fontSize:12.5, fontWeight:700 }}>{eq.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ color:"#666", fontSize:11, marginTop:8 }}>Si no tienes nada, marca "Solo mi peso". La rutina se adaptará al material que elijas.</div>
          </>
        )}

        {/* Objetivo (solo gimnasio/casa) */}
        {needsFocus && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"20px 0 10px" }}>¿Cuál es tu objetivo?</div>
            {FOCUS.map(f => (
              <button key={f.id} onClick={()=>setWeekFocus(f.id)} style={{ width:"100%", marginBottom:8, padding:"14px", borderRadius:12, border:`2px solid ${weekFocus===f.id?"#4caf50":"#2a2a3a"}`, background:weekFocus===f.id?"#1a3a1a":"#1a1a24", cursor:"pointer", textAlign:"left" }}>
                <div style={{ color:weekFocus===f.id?"#4caf50":"white", fontWeight:700, fontSize:15 }}>{f.label}</div><div style={{ color:"#777", fontSize:11.5, marginTop:1 }}>{f.desc}</div>
              </button>
            ))}
          </>
        )}

        {/* Nivel */}
        {weekType && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"20px 0 10px" }}>¿Cuál es tu nivel?</div>
            {LEVELS.map(l => (
              <button key={l.id} onClick={()=>{ setWeekLevel(l.id); if(!weekDays) setWeekDays(recommendedDays(l.id)); }} style={{ width:"100%", marginBottom:8, padding:"14px", borderRadius:12, border:`2px solid ${weekLevel===l.id?"#4caf50":"#2a2a3a"}`, background:weekLevel===l.id?"#1a3a1a":"#1a1a24", cursor:"pointer", textAlign:"left" }}>
                <div style={{ color:weekLevel===l.id?"#4caf50":"white", fontWeight:700, fontSize:15 }}>{l.label}</div><div style={{ color:"#777", fontSize:11.5, marginTop:1 }}>{l.desc}</div>
              </button>
            ))}
          </>
        )}

        {/* Días */}
        {weekLevel && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"20px 0 10px" }}>¿Cuántos días quieres entrenar?</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:8 }}>
              {[2,3,4,5,6].map(n => (
                <button key={n} onClick={()=>setWeekDays(n)} style={{ padding:"14px 0", borderRadius:12, border:`2px solid ${weekDays===n?"#4caf50":"#2a2a3a"}`, background:weekDays===n?"#1a3a1a":"#1a1a24", color:weekDays===n?"#4caf50":"#888", fontWeight:900, fontSize:18, cursor:"pointer" }}>{n}</button>
              ))}
            </div>
            {recDays && weekDays && weekDays > recDays && (
              <div style={{ background:"#2a1a00", border:"1px solid #ff9800", borderRadius:12, padding:"12px 14px", marginTop:8 }}>
                <div style={{ color:"#ffb74d", fontSize:12.5, lineHeight:1.5 }}>Para tu nivel ({weekLevel}), te recomendamos <b>{recDays} días</b>. Entrenar {weekDays} días puede ser demasiado y dificultar tu recuperación. Pero tú decides.</div>
              </div>
            )}
            {recDays && weekDays && weekDays <= recDays && (
              <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:12, padding:"12px 14px", marginTop:8 }}>
                <div style={{ color:"#8bc34a", fontSize:12.5, lineHeight:1.5 }}>{weekDays} días es una buena elección para tu nivel. Recuperarás bien entre sesiones.</div>
              </div>
            )}
          </>
        )}

        {weekLevel && weekDays && weekDays < 7 && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 10px" }}>¿Qué día prefieres descansar?</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              <button onClick={()=>setRestDay(null)} style={{ gridColumn:"span 4", padding:"12px", borderRadius:12, border:`2px solid ${restDay===null?"#4caf50":"#2a2a3a"}`, background:restDay===null?"#1a3a1a":"#1a1a24", color:restDay===null?"#4caf50":"#aaa", fontWeight:700, fontSize:13.5, cursor:"pointer" }}>Lo que sea más óptimo (recomendado)</button>
              {WEEKDAYS.map((d,i) => (
                <button key={i} onClick={()=>setRestDay(i)} style={{ padding:"11px 0", borderRadius:10, border:`2px solid ${restDay===i?"#4caf50":"#2a2a3a"}`, background:restDay===i?"#1a3a1a":"#1a1a24", color:restDay===i?"#4caf50":"#888", fontWeight:700, fontSize:12, cursor:"pointer" }}>{d.slice(0,3)}</button>
              ))}
            </div>
            <div style={{ color:"#666", fontSize:11.5, marginTop:8 }}>Colocaremos los entrenos repartidos por la semana dejando ese día (y los necesarios) de descanso.</div>
          </>
        )}

        <button onClick={()=>canGenerate && setStep("weekly_result")} disabled={!canGenerate} style={{ width:"100%", marginTop:20, padding:"16px", borderRadius:14, border:"none", background:canGenerate?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:canGenerate?"white":"#555", fontWeight:900, fontSize:16, cursor:canGenerate?"pointer":"default" }}>{canGenerate?"Generar mi rutina semanal →":"Responde todas las preguntas"}</button>
      </div>
    );
  }

  // ── PASO: resultado rutina semanal ──
  if (step === "weekly_result") {
    const routine = generateWeeklyRoutine(weekType, weekFocus, weekDays, weekLevel, weekEquip);
    const typeLabels = { gimnasio:"Gimnasio", casa:"En casa", running:"Running", cardio:"Cardio / HIIT" };
    const isStrength = weekType==="gimnasio" || weekType==="casa";
    const restDays = 7 - weekDays;
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("weekly_setup")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Tu rutina semanal</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>{typeLabels[weekType]} · {weekDays} días · {weekLevel}</div>

        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px", marginBottom:18 }}>
          <div style={{ color:"#cde", fontSize:13, lineHeight:1.5 }}>{routine.params.desc}{isStrength ? <>. <b>{routine.params.series} series</b> de <b>{routine.params.reps} reps</b> · RIR {routine.params.rir}.</> : "."} Descansa {restDays} día{restDays!==1?"s":""} a la semana.</div>
        </div>

        {routine.dayPlans.map((day, i) => (
          <div key={i} style={{ background:"#1a1a24", borderRadius:16, marginBottom:12, border:"1px solid #2a2a3a", overflow:"hidden" }}>
            <div style={{ background:"#15201a", padding:"12px 16px", borderBottom:isStrength?"1px solid #232330":"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ color:"#8bc34a", fontWeight:800, fontSize:14 }}>Día {i+1} · {day.name}</span>
                {isStrength && <span style={{ color:"#666", fontSize:11 }}>{day.exercises.length} ejercicios</span>}
              </div>
              <div style={{ color:"#7a9", fontSize:11.5, fontWeight:600 }}>{day.groupsLabel}</div>
            </div>
            {isStrength ? (
              <div style={{ padding:"8px 16px 12px" }}>
                {day.exercises.map((ex,j) => (
                  <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:j<day.exercises.length-1?"1px solid #1e1e28":"none" }}>
                    <span style={{ color:"white", fontSize:13.5, fontWeight:600 }}>{ex.name}</span>
                    <span style={{ color:"#4caf50", fontSize:12.5, fontWeight:700 }}>{ex.series} × {ex.reps}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding:"12px 16px" }}>
                <div style={{ color:"#aaa", fontSize:13, lineHeight:1.5 }}>{day.runDetail}</div>
              </div>
            )}
          </div>
        ))}

        {isStrength && (
          <div style={{ background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:14, padding:"14px 16px", marginTop:6, marginBottom:18 }}>
            <div style={{ color:"#888", fontSize:12.5, lineHeight:1.5 }}>Descanso entre series: <b style={{color:"#aaa"}}>{routine.params.rest}</b>. RIR = repeticiones que dejas en reserva.</div>
          </div>
        )}

        <button onClick={()=>{
          attemptSaveRoutine({ type:weekType, focus:weekFocus, days:weekDays, level:weekLevel, equip:weekEquip, restDay, params:routine.params, dayPlans:routine.dayPlans, schedule:buildWeekSchedule(routine.dayPlans, restDay, null), doneDays:[], weekNum:1, ts:Date.now(), cardio: !isStrength });
        }} style={{ width:"100%", marginTop:isStrength?0:12, padding:"16px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:900, fontSize:16, cursor:"pointer" }}>Guardar esta rutina</button>
        <div style={{ color:"#666", fontSize:12, textAlign:"center", marginTop:10 }}>La tendrás disponible en "Rutina programada"</div>
      </div>
    );
  }

  // ── PASO: asistente atleta híbrido ──
  if (step === "hybrid_setup") {
    const canGen = hybridDiscs.length >= 2;
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("goal")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Atleta híbrido</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:22 }}>Elige las disciplinas que TÚ quieres combinar. Solo las que selecciones entrarán en tu semana.</div>

        <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Tus disciplinas</div>
        {HYBRID_DISCIPLINES.map(d => {
          const sel = hybridDiscs.includes(d.id);
          return (
            <button key={d.id} onClick={()=>setHybridDiscs(sel?hybridDiscs.filter(x=>x!==d.id):[...hybridDiscs,d.id])}
              style={{ width:"100%", marginBottom:8, padding:"15px 16px", borderRadius:13, border:`2px solid ${sel?"#4fc3f7":"#2a2a3a"}`, background:sel?"#15252e":"#1a1a24", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:sel?"#4fc3f7":"white", fontWeight:700, fontSize:15 }}>{d.label}</div>
                <div style={{ color:"#777", fontSize:12, marginTop:1 }}>{d.desc}</div>
              </div>
              <div style={{ width:24, height:24, borderRadius:7, border:`2px solid ${sel?"#4fc3f7":"#3a3a4a"}`, background:sel?"#4fc3f7":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {sel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16161f" strokeWidth="3.5"><path d="M5 13l4 4L19 7"/></svg>}
              </div>
            </button>
          );
        })}

        <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"20px 0 10px" }}>Días de entreno por semana</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
          {[3,4,5,6,7].map(n => (
            <button key={n} onClick={()=>setHybridDays(n)} style={{ padding:"14px 0", borderRadius:12, border:`2px solid ${hybridDays===n?"#4fc3f7":"#2a2a3a"}`, background:hybridDays===n?"#15252e":"#1a1a24", color:hybridDays===n?"#4fc3f7":"#888", fontWeight:900, fontSize:18, cursor:"pointer" }}>{n}</button>
          ))}
        </div>

        <button onClick={()=>canGen && setStep("hybrid_result")} disabled={!canGen} style={{ width:"100%", marginTop:24, padding:"16px", borderRadius:14, border:"none", background:canGen?"linear-gradient(135deg,#0288d1,#01579b)":"#2a2a3a", color:canGen?"white":"#555", fontWeight:900, fontSize:16, cursor:canGen?"pointer":"default" }}>{canGen?"Generar mi semana híbrida →":"Elige al menos 2 disciplinas"}</button>
      </div>
    );
  }

  // ── PASO: resultado atleta híbrido ──
  if (step === "hybrid_result") {
    const sessions = generateHybridRoutine(hybridDiscs, hybridDays);
    const restDays = 7 - hybridDays;
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("hybrid_setup")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Tu semana híbrida</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>{hybridDays} días de entreno · {restDays} de descanso · {hybridDiscs.length} disciplinas</div>

        {sessions.map((s, i) => (
          <div key={i} style={{ background:"#1a1a24", borderRadius:16, marginBottom:12, border:"1px solid #2a2a3a", overflow:"hidden" }}>
            <div style={{ background:"#15252e", padding:"12px 16px", borderBottom:"1px solid #1e3038", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#4fc3f7", fontWeight:800, fontSize:14 }}>Día {i+1}</span>
              <span style={{ color:"#ccc", fontWeight:700, fontSize:13 }}>{s.session}</span>
            </div>
            <div style={{ padding:"12px 16px" }}>
              <div style={{ color:"#aaa", fontSize:13, lineHeight:1.5 }}>{s.detail}</div>
            </div>
          </div>
        ))}

        <div style={{ background:"#15252e", border:"1px solid #2a4a5a", borderRadius:14, padding:"14px 16px", marginTop:6 }}>
          <div style={{ color:"#bde", fontSize:12.5, lineHeight:1.5 }}>Puedes ajustar el orden de los días según te convenga. Lo importante es alternar disciplinas y respetar los días de descanso para recuperar bien.</div>
        </div>

        <button onClick={()=>{
          attemptSaveRoutine({ hybrid:true, days:hybridDays, discs:hybridDiscs, sessions, doneDays:[], weekNum:1, ts:Date.now(),
            dayPlans: sessions.map(s=>({ name:s.session, groupsLabel:s.label, exercises:s.exercises, hybridDetail:s.detail, disc:s.disc })),
            schedule: buildWeekSchedule(sessions.map(s=>({ name:s.session, groupsLabel:s.label, exercises:s.exercises, hybridDetail:s.detail, disc:s.disc })), null, null) });
        }} style={{ width:"100%", marginTop:18, padding:"16px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#0288d1,#01579b)", color:"white", fontWeight:900, fontSize:16, cursor:"pointer" }}>Guardar esta semana</button>
        <div style={{ color:"#666", fontSize:12, textAlign:"center", marginTop:10 }}>La tendrás disponible para consultarla cuando quieras</div>
      </div>
    );
  }

  // ── PASO: configurar planificador de carrera ──
  if (step === "race_setup") {
    const LEVELS = [
      { id:"principiante", label:"Principiante", desc:"Empiezo o llevo poco" },
      { id:"intermedio", label:"Intermedio", desc:"Tengo algo de fondo" },
      { id:"avanzado", label:"Avanzado", desc:"Llevo tiempo entrenando" },
    ];
    const isRun = raceDiscipline==="running";
    const isBike = raceDiscipline==="bici";
    const canGenerate = raceDiscipline && raceLevel && raceExperience && (
      isRun ? (raceTarget && raceRunType) : (isBike && raceBikeType && raceBikeKm)
    );
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("goal")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Planificador de carrera</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:22 }}>Te montamos un plan progresivo y realista hasta tu meta, con entrenos de carrera y de fuerza.</div>

        {/* Disciplina */}
        <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>¿Qué quieres preparar?</div>
        <div style={{ display:"flex", gap:10, marginBottom:8 }}>
          {[{id:"running",label:"Running",emoji:"🏃"},{id:"bici",label:"Bici",emoji:"🚴"}].map(d=>(
            <button key={d.id} onClick={()=>setRaceDiscipline(d.id)} style={{ flex:1, padding:"16px", borderRadius:14, border:`2px solid ${raceDiscipline===d.id?"#ffd700":"#2a2a3a"}`, background:raceDiscipline===d.id?"#2a2410":"#1a1a24", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:26 }}>{d.emoji}</span>
              <span style={{ color:raceDiscipline===d.id?"#ffd700":"#aaa", fontWeight:700, fontSize:14 }}>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Tipo de bici */}
        {isBike && (
          <div style={{ marginTop:16 }}>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Tipo de bici</div>
            <div style={{ display:"flex", gap:10 }}>
              {[{id:"mtb",label:"MTB / Montaña"},{id:"carretera",label:"Carretera"}].map(t=>(
                <button key={t.id} onClick={()=>setRaceBikeType(t.id)} style={{ flex:1, padding:"13px", borderRadius:12, border:`2px solid ${raceBikeType===t.id?"#ffd700":"#2a2a3a"}`, background:raceBikeType===t.id?"#2a2410":"#1a1a24", color:raceBikeType===t.id?"#ffd700":"#aaa", fontWeight:700, fontSize:13.5, cursor:"pointer" }}>{t.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* RUNNING: marcas actuales + objetivo */}
        {isRun && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 10px" }}>Tipo de carrera</div>
            <div style={{ display:"flex", gap:10 }}>
              {[{id:"asfalto",label:"Asfalto",desc:"Ciudad, ruta, pista"},{id:"trail",label:"Trail / Montaña",desc:"Senderos y desnivel"}].map(t=>(
                <button key={t.id} onClick={()=>setRaceRunType(t.id)} style={{ flex:1, padding:"16px 12px", borderRadius:12, border:`2px solid ${raceRunType===t.id?"#ffd700":"#2a2a3a"}`, background:raceRunType===t.id?"#2a2410":"#1a1a24", cursor:"pointer", textAlign:"center" }}>
                  <div style={{ color:raceRunType===t.id?"#ffd700":"#aaa", fontWeight:700, fontSize:14 }}>{t.label}</div>
                  <div style={{ color:"#777", fontSize:11, marginTop:2 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 6px" }}>Tus marcas actuales</div>
            <div style={{ color:"#666", fontSize:12, marginBottom:12 }}>Pon tu mejor tiempo en cada distancia (formato mm:ss o h:mm:ss). Deja vacías las que no hayas corrido.</div>
            {RACE_DISTANCES.map(d=>(
              <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, background:"#1a1a24", borderRadius:12, padding:"10px 14px", border:"1px solid #2a2a3a" }}>
                <span style={{ color:"#ccc", fontSize:14, fontWeight:600 }}>{d.label}</span>
                <input value={raceMarks[d.id]||""} onChange={e=>setRaceMarks({...raceMarks,[d.id]:e.target.value.replace(/[^0-9:]/g,"")})} inputMode="numeric" placeholder="mm:ss" style={{ width:110, padding:"8px 10px", borderRadius:8, border:"1px solid #2a2a3a", background:"#15151c", color:"white", fontSize:14, textAlign:"center", outline:"none" }} />
              </div>
            ))}

            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 10px" }}>¿Qué distancia quieres conseguir?</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {RACE_DISTANCES.map(d=>(
                <button key={d.id} onClick={()=>setRaceTarget(d.id)} style={{ padding:"14px", borderRadius:12, border:`2px solid ${raceTarget===d.id?"#ffd700":"#2a2a3a"}`, background:raceTarget===d.id?"#2a2410":"#1a1a24", color:raceTarget===d.id?"#ffd700":"#aaa", fontWeight:700, fontSize:13.5, cursor:"pointer" }}>{d.label}</button>
              ))}
            </div>

            {/* Desnivel de la carrera objetivo (solo trail) */}
            {raceRunType==="trail" && (
              <div style={{ marginTop:16 }}>
                <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Desnivel de tu carrera objetivo</div>
                <div style={{ color:"#666", fontSize:12, marginBottom:8 }}>¿Cuántos metros de desnivel positivo (D+) tendrá la carrera que preparas? Opcional, pero ayuda mucho a afinar el plan.</div>
                <input value={raceRunDesnivel} onChange={e=>setRaceRunDesnivel(e.target.value.replace(/[^0-9]/g,""))} inputMode="numeric" placeholder="Ej: 1500 m D+" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid #2a2a3a", background:"#15151c", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" }} />
                <div style={{ color:"#666", fontSize:11.5, marginTop:6 }}>Trabajaremos subidas, bajadas técnicas y fuerza específica para ese desnivel.</div>
              </div>
            )}

            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 6px" }}>Tiempo objetivo (opcional)</div>
            <div style={{ color:"#666", fontSize:12, marginBottom:10 }}>¿En qué tiempo te gustaría hacerla? Déjalo vacío si solo quieres terminarla.</div>
            <input value={raceTargetTime} onChange={e=>setRaceTargetTime(e.target.value.replace(/[^0-9:]/g,""))} inputMode="numeric" placeholder="Ej: 50:00 o 02:15:08" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid #2a2a3a", background:"#15151c", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" }} />
            <div style={{ color:"#666", fontSize:11.5, marginTop:6 }}>Formato: minutos:segundos (50:00) o horas:minutos:segundos (02:15:08)</div>
          </>
        )}

        {/* BICI: km y desnivel */}
        {isBike && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 10px" }}>Tu reto</div>
            <div style={{ color:"#999", fontSize:13, marginBottom:6 }}>Distancia objetivo (km)</div>
            <input value={raceBikeKm} onChange={e=>setRaceBikeKm(e.target.value)} placeholder="Ej: 80" inputMode="numeric" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid #2a2a3a", background:"#15151c", color:"white", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:14 }} />
            <div style={{ color:"#999", fontSize:13, marginBottom:6 }}>Desnivel acumulado (m) — opcional</div>
            <input value={raceBikeDesnivel} onChange={e=>setRaceBikeDesnivel(e.target.value)} placeholder="Ej: 1200" inputMode="numeric" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid #2a2a3a", background:"#15151c", color:"white", fontSize:15, outline:"none", boxSizing:"border-box" }} />
          </>
        )}

        {/* Nivel */}
        {raceDiscipline && (
          <>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"22px 0 10px" }}>Tu nivel</div>
            {LEVELS.map(l=>(
              <button key={l.id} onClick={()=>setRaceLevel(l.id)} style={{ width:"100%", marginBottom:8, padding:"14px", borderRadius:12, border:`2px solid ${raceLevel===l.id?"#ffd700":"#2a2a3a"}`, background:raceLevel===l.id?"#2a2410":"#1a1a24", cursor:"pointer", textAlign:"left" }}>
                <div style={{ color:raceLevel===l.id?"#ffd700":"white", fontWeight:700, fontSize:15 }}>{l.label}</div><div style={{ color:"#777", fontSize:11.5, marginTop:1 }}>{l.desc}</div>
              </button>
            ))}

            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"18px 0 10px" }}>¿Cuánto {isBike?"montas en bici":"corres"} ahora mismo?</div>
            {[
              {id:"cero",label:"Parto de cero",desc:isBike?"No salgo en bici habitualmente":"No corro casi nada ahora"},
              {id:"poco",label:"Algo, de vez en cuando",desc:"1-2 días por semana sueltos"},
              {id:"regular",label:"Entreno regularmente",desc:"3 o más días por semana"},
            ].map(e=>(
              <button key={e.id} onClick={()=>setRaceExperience(e.id)} style={{ width:"100%", marginBottom:8, padding:"14px", borderRadius:12, border:`2px solid ${raceExperience===e.id?"#ffd700":"#2a2a3a"}`, background:raceExperience===e.id?"#2a2410":"#1a1a24", cursor:"pointer", textAlign:"left" }}>
                <div style={{ color:raceExperience===e.id?"#ffd700":"white", fontWeight:700, fontSize:15 }}>{e.label}</div><div style={{ color:"#777", fontSize:11.5, marginTop:1 }}>{e.desc}</div>
              </button>
            ))}
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, margin:"18px 0 10px" }}>Días por semana</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {[3,4,5,6].map(n=>(
                <button key={n} onClick={()=>setRaceDays(n)} style={{ padding:"13px 0", borderRadius:12, border:`2px solid ${raceDays===n?"#ffd700":"#2a2a3a"}`, background:raceDays===n?"#2a2410":"#1a1a24", color:raceDays===n?"#ffd700":"#888", fontWeight:900, fontSize:17, cursor:"pointer" }}>{n}</button>
              ))}
            </div>
          </>
        )}

        <button onClick={()=>canGenerate && buildRacePlan()} disabled={!canGenerate} style={{ width:"100%", marginTop:24, padding:"16px", borderRadius:14, border:"none", background:canGenerate?"linear-gradient(135deg,#d4af37,#b8860b)":"#2a2a3a", color:canGenerate?"#1a1a10":"#555", fontWeight:900, fontSize:16, cursor:canGenerate?"pointer":"default" }}>{canGenerate?"Crear mi plan →":"Completa los datos"}</button>
      </div>
    );
  }

  // ── PASO: ver el plan de carrera ──
  if (step === "race_plan" && racePlan) {
    const rp = racePlan;
    const phase = rp.phases[rp.currentPhase];
    const isRun = rp.discipline==="running";
    const estFinish = new Date(rp.estFinish);
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const finishTxt = `${estFinish.getDate()} de ${meses[estFinish.getMonth()]} de ${estFinish.getFullYear()}`;
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        {/* Animación de semana completada */}
        {weekComplete && (
          <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #16201a 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
            <div style={{ position:"relative", width:120, height:120, marginBottom:26, display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.5s ease-out 0.3s" }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ position:"absolute", top:0, left:0 }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1e3a24" strokeWidth="4" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" pathLength="1" transform="rotate(-90 60 60)" style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.7s ease-out 0.2s forwards" }} />
                <path d="M38 62 L53 76 L83 44" fill="none" stroke="#8bc34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.4s ease-out 0.85s forwards" }} />
              </svg>
            </div>
            <div style={{ color:"white", fontWeight:900, fontSize:23, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.8s both", textAlign:"center" }}>Semana completada</div>
            <div style={{ color:"#4caf50", fontSize:13.5, marginTop:8, fontWeight:600, letterSpacing:1, textTransform:"uppercase", animation:"rise-up 0.5s ease 1s both" }}>Una semana más cerca de tu meta</div>
          </div>
        )}

        {/* Pop-up confirmar completar semana */}
        {confirmWeek && (() => {
          const wk = phase.weekPlans[rp.currentWeek||0] || phase.weekPlans[0];
          const doneSessions = (rp.doneSessions && rp.doneSessions[`${rp.currentPhase}_${rp.currentWeek||0}`]) || [];
          const pendientes = wk.sessions.length - doneSessions.length;
          return (
            <div onClick={()=>setConfirmWeek(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
              <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a24", borderRadius:20, padding:"26px 22px", maxWidth:360, width:"100%", border:"1px solid #2a2a3a", animation:"scale-fade 0.3s ease" }}>
                <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Completar la semana {(rp.currentWeek||0)+1}?</div>
                {pendientes>0 ? (
                  <div style={{ background:"#2a2410", border:"1px solid #b8860b", borderRadius:12, padding:"12px 14px", margin:"14px 0" }}>
                    <div style={{ color:"#ffd700", fontSize:13, fontWeight:700, textAlign:"center", lineHeight:1.5 }}>Te {pendientes===1?"queda":"quedan"} {pendientes} {pendientes===1?"entreno":"entrenos"} sin marcar esta semana.</div>
                    <div style={{ color:"#aa9", fontSize:12, textAlign:"center", marginTop:5 }}>Puedes completarla igualmente, pero lo ideal es hacer todos los entrenos.</div>
                  </div>
                ) : (
                  <div style={{ color:"#8bc34a", fontSize:13.5, textAlign:"center", lineHeight:1.5, margin:"14px 0" }}>¡Has hecho todos los entrenos de la semana! Pasas a la siguiente.</div>
                )}
                <button onClick={advanceRaceWeek} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, completar semana</button>
                <button onClick={()=>setConfirmWeek(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Volver</button>
              </div>
            </div>
          );
        })()}

        {/* Animación de fase completada */}
        {phaseComplete && (
          <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #2a2410 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
            <div style={{ position:"relative", width:130, height:130, marginBottom:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.6s ease-out 0.4s" }}>
              <svg width="130" height="130" viewBox="0 0 130 130" style={{ position:"absolute", top:0, left:0 }}>
                <circle cx="65" cy="65" r="58" fill="none" stroke="#3a2e0a" strokeWidth="5" />
                <circle cx="65" cy="65" r="58" fill="none" stroke="#ffd700" strokeWidth="5" strokeLinecap="round" pathLength="1" transform="rotate(-90 65 65)" style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.8s ease-out 0.2s forwards" }} />
              </svg>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="#ffd700" style={{ animation:"scale-fade 0.5s ease 0.9s both" }}><path d="M5 4h14v2a5 5 0 01-3 4.58A4 4 0 0113 14v2h2v2H9v-2h2v-2a4 4 0 01-3-3.42A5 5 0 015 6V4z"/></svg>
            </div>
            <div style={{ color:"#ffd700", fontWeight:900, fontSize:26, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.9s both", textAlign:"center" }}>¡Fase completada!</div>
            <div style={{ color:"#fff", fontSize:15, marginTop:10, fontWeight:600, animation:"rise-up 0.5s ease 1.1s both", textAlign:"center" }}>{rp.currentPhase < rp.phases.length-1 ? "Siguiente nivel desbloqueado" : "¡Has llegado a tu meta!"}</div>
          </div>
        )}

        <button onClick={()=>setStep("goal")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>

        {/* Modal confirmar borrar plan */}
        {confirmDeleteRace && (
          <div onClick={()=>setConfirmDeleteRace(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a24", borderRadius:20, padding:"28px 22px", maxWidth:360, width:"100%", border:"1px solid #2a2a3a", animation:"scale-fade 0.3s ease" }}>
              <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Eliminar el plan de carrera?</div>
              <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:24 }}>Perderás el progreso de las fases. Tus entrenos registrados se mantienen en el historial.</div>
              <button onClick={()=>{ setRacePlan(null); setConfirmDeleteRace(false); setStep("goal"); }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#c62828,#8e1f1f)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, eliminar</button>
              <button onClick={()=>setConfirmDeleteRace(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Cabecera del plan */}
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:2 }}>{isRun?"Camino a tu "+rp.targetLabel:"Tu reto en bici"}</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:16 }}>{isRun?`${rp.runType==="trail"?"Trail":"Asfalto"}${rp.runDesnivel?` · ${rp.runDesnivel}m+`:""} · ${rp.days} días/semana · nivel ${rp.level}`:`${rp.bikeType==="mtb"?"MTB":"Carretera"} · ${rp.km} km${rp.desnivel?` · ${rp.desnivel}m desnivel`:""}`}</div>

        {/* Predicción y realismo (running) */}
        {isRun && rp.prediction>0 && (
          <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:"#cde", fontSize:13, lineHeight:1.6 }}>
              Según tus marcas, ahora mismo podrías hacer tu {rp.targetLabel} en torno a <b style={{color:"#8bc34a"}}>{fmtTime(rp.prediction)}</b>.
              {rp.objective>0 && rp.realismo==="realista" && <> Tu objetivo de <b>{fmtTime(rp.objective)}</b> es <b style={{color:"#8bc34a"}}>realista</b>. ¡A por él!</>}
              {rp.objective>0 && rp.realismo==="ambicioso" && <> Tu objetivo de <b>{fmtTime(rp.objective)}</b> es <b style={{color:"#ffb74d"}}>ambicioso</b>: trabajando este plan con constancia puedes acercarte mucho.</>}
            </div>
          </div>
        )}
        {isRun && rp.prediction===0 && (
          <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:"#cde", fontSize:13, lineHeight:1.6 }}>Como aún no tienes marcas, te montamos un plan progresivo y seguro desde la base hasta tu {rp.targetLabel}, sin forzar.</div>
          </div>
        )}

        {/* Fecha estimada */}
        <div style={{ background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:14, padding:"14px 16px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#888", fontSize:13 }}>Listo para tu meta</span>
          <span style={{ color:"#ffd700", fontWeight:800, fontSize:14 }}>~{finishTxt}</span>
        </div>

        {/* Progreso de fases */}
        {rp.phases.length>1 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Tu camino ({rp.phases.length} fases)</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {rp.phases.map((p,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                  <div style={{ width:"100%", height:6, borderRadius:3, background: p.completed?"#4caf50":i===rp.currentPhase?"#ffd700":"#2a2a3a" }} />
                  <span style={{ color:p.completed?"#4caf50":i===rp.currentPhase?"#ffd700":"#666", fontSize:10, fontWeight:700 }}>{p.label.replace("Media maratón ","").replace("(","").replace(")","")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {rp.allDone ? (
          <div style={{ background:"linear-gradient(135deg,#2a2410,#15201a)", border:"1px solid #b8860b", borderRadius:16, padding:"24px", textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:10 }}>🏆</div>
            <div style={{ color:"#ffd700", fontWeight:900, fontSize:18, marginBottom:6 }}>¡Plan completado!</div>
            <div style={{ color:"#cde", fontSize:13, lineHeight:1.5 }}>Has recorrido todas las fases hasta tu meta. ¡Enhorabuena, máquina! Ya estás listo para tu {isRun?rp.targetLabel:"reto"}.</div>
          </div>
        ) : (
          <>
            {/* Mensaje del entrenador */}
            {rp.coach && (
              <div style={{ background:"#15201a", borderLeft:"3px solid #4caf50", borderRadius:"0 12px 12px 0", padding:"12px 16px", marginBottom:16 }}>
                <div style={{ color:"#8bc34a", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Tu entrenador</div>
                <div style={{ color:"#cde", fontSize:13, lineHeight:1.55 }}>{rp.coach}</div>
              </div>
            )}

            {/* Fase actual */}
            <div style={{ background:"#2a2410", border:"1px solid #b8860b", borderRadius:14, padding:"12px 16px", marginBottom:14 }}>
              <div style={{ color:"#ffd700", fontWeight:800, fontSize:14 }}>Fase {rp.currentPhase+1} de {rp.phases.length}{rp.phases.length>1?` · hasta ${phase.label}`:""}</div>
              <div style={{ color:"#aa9", fontSize:12, marginTop:2 }}>Semana {(rp.currentWeek||0)+1} de {phase.weeks} · {rp.days} días/semana</div>
            </div>

            {/* Progreso de semanas dentro de la fase */}
            <div style={{ display:"flex", gap:4, marginBottom:18, flexWrap:"wrap" }}>
              {phase.weekPlans.map((wp,i)=>{
                const done = i < (rp.currentWeek||0);
                const current = i === (rp.currentWeek||0);
                return <div key={i} style={{ flex:"1 1 18px", height:6, borderRadius:3, background: done?"#4caf50":current?"#ffd700":"#2a2a3a" }} />;
              })}
            </div>

            {/* Sesiones de la SEMANA ACTUAL con checks */}
            <div style={{ color:"#888", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Entrenos de la semana {(rp.currentWeek||0)+1}</div>
            {(() => {
              const wk = phase.weekPlans[rp.currentWeek||0] || phase.weekPlans[0];
              const doneSessions = (rp.doneSessions && rp.doneSessions[`${rp.currentPhase}_${rp.currentWeek||0}`]) || [];
              return wk.sessions.map((s,i)=>{
                const isDone = doneSessions.includes(i);
                return (
                  <div key={i} style={{ background:"#1a1a24", borderRadius:14, marginBottom:10, border:`1px solid ${isDone?"#2e7d32":"#2a2a3a"}`, overflow:"hidden", opacity:isDone?0.7:1 }}>
                    <div style={{ padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                          <span style={{ fontSize:10, background:s.type==="fuerza"?"#2e4a7a":"#7a5a1a", color:"white", borderRadius:20, padding:"2px 8px", fontWeight:700, letterSpacing:0.5, textTransform:"uppercase" }}>{s.type==="fuerza"?"Fuerza":isRun?"Carrera":"Bici"}</span>
                          <span style={{ color:"white", fontWeight:700, fontSize:14 }}>{s.name}</span>
                          {isDone && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div style={{ color:"#888", fontSize:12, lineHeight:1.45, marginTop:4 }}>{s.detail}</div>
                      </div>
                      <button onClick={()=>startRaceSession(s, i)} style={{ flexShrink:0, background:isDone?"#15201a":"#2a2410", border:`1px solid ${isDone?"#2e7d32":"#b8860b"}`, borderRadius:10, color:isDone?"#8bc34a":"#ffd700", fontSize:12, fontWeight:700, padding:"8px 12px", cursor:"pointer" }}>{isDone?"Repetir":"Entrenar"}</button>
                    </div>
                  </div>
                );
              });
            })()}

            {/* Botón completar semana */}
            {(rp.currentWeek||0) < phase.weeks-1 ? (
              <button onClick={()=>setConfirmWeek(true)} style={{ width:"100%", marginTop:10, padding:"15px", borderRadius:14, border:"1px solid #ffd700", background:"transparent", color:"#ffd700", fontWeight:800, fontSize:14, cursor:"pointer" }}>Completar semana {(rp.currentWeek||0)+1} →</button>
            ) : (
              <button onClick={completeRacePhase} style={{ width:"100%", marginTop:10, padding:"15px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#d4af37,#b8860b)", color:"#1a1a10", fontWeight:900, fontSize:15, cursor:"pointer" }}>{rp.currentPhase < rp.phases.length-1 ? "¡Completar fase y desbloquear la siguiente!" : "¡Completar plan!"}</button>
            )}
            <div style={{ color:"#666", fontSize:11.5, textAlign:"center", marginTop:8, lineHeight:1.5 }}>{(rp.currentWeek||0) < phase.weeks-1 ? "Cuando termines los entrenos de esta semana, pasa a la siguiente." : "Última semana de la fase. ¡Remátala con ganas!"}</div>
          </>
        )}

        <button onClick={()=>setConfirmDeleteRace(true)} style={{ width:"100%", marginTop:20, padding:"12px", borderRadius:12, border:"none", background:"transparent", color:"#a44", fontSize:13, fontWeight:600, cursor:"pointer" }}>Eliminar plan de carrera</button>
      </div>
    );
  }

  // ── PASO 2: elegir material (solo "casa") ──
  if (step === "equip") {
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setStep("goal")} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>¿Qué material tienes?</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:22 }}>Selecciona todo lo que tengas disponible</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          {EQUIPMENT.map(eq => {
            const sel = tempEquip.includes(eq.id);
            return (
              <button key={eq.id} onClick={()=>setTempEquip(sel?tempEquip.filter(x=>x!==eq.id):[...tempEquip,eq.id])}
                style={{ padding:"16px 10px", borderRadius:14, border:`2px solid ${sel?"#4caf50":"#2a2a3a"}`, background:sel?"#1a3a1a":"#1a1a24", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:26 }}>{eq.emoji}</span>
                <span style={{ color:sel?"#4caf50":"#aaa", fontSize:12, fontWeight:700, textAlign:"center" }}>{eq.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={startWorkout} disabled={tempEquip.length===0} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:tempEquip.length?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:tempEquip.length?"white":"#555", fontWeight:900, fontSize:16, cursor:tempEquip.length?"pointer":"default" }}>{tempEquip.length?"Generar entreno →":"Selecciona material"}</button>
      </div>
    );
  }

  // ── Ver ejercicio en grande ──
  if (viewExercise) {
    const ex = viewExercise;
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setViewExercise(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ background:"#1a1a24", borderRadius:20, padding:"26px 20px", border:"1px solid #2a2a3a", textAlign:"center", marginBottom:20 }}>
          <div style={{ color:"white", fontWeight:900, fontSize:24 }}>{ex.name}</div>
          <div style={{ color:"#4caf50", fontSize:15, marginTop:8, fontWeight:700 }}>{ex.series} · RIR {ex.rir}</div>
        </div>
        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px" }}>
          <div style={{ color:"#8bc34a", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Cómo hacerlo</div>
          <div style={{ color:"#cde", fontSize:13, lineHeight:1.5 }}>Realiza el movimiento de forma controlada, manteniendo la técnica en todo el rango. Respira de forma constante y mantén el RIR indicado (repeticiones en reserva) para regular la intensidad.</div>
        </div>
      </div>
    );
  }

  // ── Sustituir ejercicio ──
  if (swapping) {
    const alts = getAlternatives(swapping, goal, equipment);
    // Formulario de ejercicio personalizado
    if (customForm) {
      const cf = customForm;
      const validCustom = cf.name.trim() && cf.series.trim();
      return (
        <div style={{ padding:"20px 16px 40px" }}>
          <button onClick={()=>setCustomForm(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
          <div style={{ fontWeight:900, fontSize:20, color:"white", marginBottom:4 }}>Crear ejercicio propio</div>
          <div style={{ color:"#666", fontSize:13, marginBottom:22 }}>Sustituirá a <b style={{color:"#aaa"}}>{swapping.name}</b></div>

          <label style={{ fontSize:12, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"block" }}>Nombre del ejercicio</label>
          <input value={cf.name} onChange={e=>setCustomForm({...cf, name:e.target.value})} placeholder="Ej: Press inclinado con mancuernas" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"2px solid #2a2a3a", background:"#1a1a24", color:"white", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:16 }} />

          <label style={{ fontSize:12, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"block" }}>Series y repeticiones</label>
          <input value={cf.series} onChange={e=>setCustomForm({...cf, series:e.target.value})} placeholder="Ej: 4 × 10" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"2px solid #2a2a3a", background:"#1a1a24", color:"white", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:16 }} />

          <label style={{ fontSize:12, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"block" }}>RIR (repeticiones en reserva)</label>
          <input value={cf.rir} onChange={e=>setCustomForm({...cf, rir:e.target.value})} placeholder="Ej: 1-2" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"2px solid #2a2a3a", background:"#1a1a24", color:"white", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:16 }} />

          <label style={{ fontSize:12, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6, display:"block" }}>¿Cómo se registra?</label>
          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            {[{id:"peso",label:"Peso y reps"},{id:"reps",label:"Solo reps"},{id:"tiempo",label:"Tiempo"}].map(m=>(
              <button key={m.id} onClick={()=>setCustomForm({...cf, metric:m.id})} style={{ flex:1, padding:"12px 6px", borderRadius:12, border:`2px solid ${cf.metric===m.id?"#4caf50":"#2a2a3a"}`, background:cf.metric===m.id?"#1a3a1a":"#1a1a24", color:cf.metric===m.id?"#4caf50":"#888", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>{m.label}</button>
            ))}
          </div>

          <button onClick={()=>validCustom && swapCustomExercise(swapping.id, { id:`custom_${Date.now()}`, name:cf.name.trim(), series:cf.series.trim()||"3 × 10", rir:cf.rir.trim()||"1-2", metric:cf.metric, group:swapping.group, goals:[goal] })} disabled={!validCustom} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:validCustom?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:validCustom?"white":"#555", fontWeight:900, fontSize:16, cursor:validCustom?"pointer":"default" }}>{validCustom?"Usar este ejercicio":"Pon al menos nombre y series"}</button>
        </div>
      );
    }
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setSwapping(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:20, color:"white", marginBottom:4 }}>Cambiar ejercicio</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>Alternativas para <b style={{color:"#aaa"}}>{swapping.name}</b></div>

        {/* Crear ejercicio propio */}
        <button onClick={()=>setCustomForm({ name:"", series:"4 × 10", rir:"1-2", metric:"peso" })} style={{ width:"100%", marginBottom:16, padding:"16px", borderRadius:14, border:"1px solid #2a4a5a", background:"linear-gradient(135deg,#15252e,#16161f)", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #4fc3f7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <div>
            <div style={{ color:"#4fc3f7", fontWeight:800, fontSize:15 }}>Crear ejercicio propio</div>
            <div style={{ color:"#777", fontSize:11.5, marginTop:1 }}>Pon tú el nombre, series y reps</div>
          </div>
        </button>

        <div style={{ color:"#666", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>O elige una alternativa</div>
        {alts.length===0 && <div style={{ color:"#555", fontSize:14, textAlign:"center", padding:"30px 0" }}>No hay alternativas con tu material para este grupo muscular.</div>}
        {alts.map(alt => (
          <button key={alt.id} onClick={()=>swapExercise(swapping.id, alt.id)} style={{ width:"100%", marginBottom:10, padding:"16px", borderRadius:14, border:"1px solid #2a2a3a", background:"#1a1a24", cursor:"pointer", textAlign:"left" }}>
            <div style={{ color:"white", fontWeight:700, fontSize:15 }}>{alt.name}</div>
            <div style={{ color:"#777", fontSize:12, marginTop:2 }}>{alt.series} · RIR {alt.rir}</div>
          </button>
        ))}
      </div>
    );
  }

  // ── PASO 3: entreno generado ──
  const goalObj = TRAINING_GOALS.find(g=>g.id===goal);
  // ¿Hay series sin rellenar? (ningún ejercicio con marca de peso o reps)
  const hasAnyMark = exercises.some(ex => (marks[ex.id]||[]).some(s => s && (s.peso || s.reps || s.dist || s.tiempo)));
  const missingData = !hasAnyMark;
  return (
    <div style={{ padding:"16px 16px 40px" }}>
      {/* Animación CSS */}
      <style>{`
        @keyframes pop-in { 0% { transform:scale(0.3); opacity:0; } 60% { transform:scale(1.15); opacity:1; } 100% { transform:scale(1); } }
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes ring-draw { from { stroke-dashoffset:339; } to { stroke-dashoffset:0; } }
        @keyframes check-draw { from { stroke-dashoffset:60; } to { stroke-dashoffset:0; } }
        @keyframes draw-line { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }
        @keyframes glow-pulse { 0% { box-shadow:0 0 0 0 rgba(76,175,80,0.4); } 70% { box-shadow:0 0 0 30px rgba(76,175,80,0); } 100% { box-shadow:0 0 0 0 rgba(76,175,80,0); } }
        @keyframes scale-fade { 0% { transform:scale(0.85); opacity:0; } 100% { transform:scale(1); opacity:1; } }
        @keyframes rise-up { 0% { transform:translateY(14px); opacity:0; } 100% { transform:translateY(0); opacity:1; } }
      `}</style>

      {/* Pop-up confirmar finalizar */}
      {confirmFinish && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.25s ease" }}>
          <div style={{ background:"#1a1a24", borderRadius:20, padding:"28px 22px", maxWidth:360, width:"100%", border:`1px solid ${missingData?"#ff9800":"#2a2a3a"}`, animation:"scale-fade 0.3s ease" }}>
            {missingData ? (
              <>
                <div style={{ color:"#ff9800", fontWeight:900, fontSize:19, textAlign:"center", marginBottom:8 }}>Faltan datos por rellenar</div>
                <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:24 }}>No has anotado el peso ni las repeticiones de ninguna serie. Puedes guardar igualmente, pero perderás el registro de tus marcas de hoy.</div>
                <button onClick={doFinishWorkout} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#ff9800,#e65100)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Guardar igualmente</button>
                <button onClick={()=>setConfirmFinish(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Volver y rellenar</button>
              </>
            ) : (
              <>
                <div style={{ color:"white", fontWeight:900, fontSize:19, textAlign:"center", marginBottom:8 }}>¿Finalizar el entrenamiento?</div>
                <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:24 }}>Se guardará en tu historial con las marcas que has registrado.</div>
                <button onClick={doFinishWorkout} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, finalizar</button>
                <button onClick={()=>setConfirmFinish(false)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Seguir entrenando</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Animación de celebración moderna */}
      {celebrating && (
        <div style={{ position:"fixed", inset:0, background:"radial-gradient(circle at center, #16201a 0%, #0a0d0a 100%)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fade-in 0.3s ease", padding:"24px" }}>
          <div style={{ position:"relative", width:120, height:120, marginBottom:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", animation:"glow-pulse 1.6s ease-out 0.4s" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ position:"absolute", top:0, left:0 }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1e3a24" strokeWidth="4" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#4caf50" strokeWidth="4" strokeLinecap="round"
                pathLength="1" transform="rotate(-90 60 60)"
                style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.7s ease-out 0.2s forwards" }} />
              <path d="M38 62 L53 76 L83 44" fill="none" stroke="#8bc34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                pathLength="1"
                style={{ strokeDasharray:1, strokeDashoffset:1, animation:"draw-line 0.4s ease-out 0.85s forwards" }} />
            </svg>
          </div>
          <div style={{ color:"white", fontWeight:900, fontSize:24, letterSpacing:0.5, animation:"rise-up 0.5s ease 0.8s both" }}>Entrenamiento completado</div>

          {newPRs.length > 0 ? (
            <>
              <div style={{ color:"#ffd700", fontSize:13, marginTop:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", animation:"rise-up 0.5s ease 1s both" }}>
                {newPRs.length===1 ? "¡Nuevo récord personal!" : `¡${newPRs.length} récords personales!`}
              </div>
              <div style={{ marginTop:18, width:"100%", maxWidth:340, animation:"rise-up 0.6s ease 1.2s both" }}>
                {newPRs.map((pr,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,215,0,0.08)", border:"1px solid rgba(255,215,0,0.3)", borderRadius:12, padding:"12px 16px", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffd700" style={{ flexShrink:0 }}><path d="M5 4h14v2a5 5 0 01-3 4.58A4 4 0 0113 14v2h2v2H9v-2h2v-2a4 4 0 01-3-3.42A5 5 0 015 6V4zm2 2v0a3 3 0 002 2.83V6H7zm10 0h-2v2.83A3 3 0 0017 6z"/></svg>
                      <span style={{ color:"white", fontSize:13.5, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pr.name}</span>
                    </div>
                    <span style={{ color:"#ffd700", fontWeight:800, fontSize:14, flexShrink:0, marginLeft:10 }}>{pr.weight} kg</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color:"#4caf50", fontSize:14, marginTop:8, fontWeight:600, letterSpacing:2, textTransform:"uppercase", animation:"rise-up 0.5s ease 1s both" }}>Bien hecho</div>
          )}
        </div>
      )}

      <button onClick={changeGoal} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:900, fontSize:22, color:"white" }}>{trainingState?.routineDayName ? trainingState.routineDayName : (goalObj?.label||"Entreno")}</div>
          <div style={{ color:"#666", fontSize:12, marginTop:2 }}>{trainingState?.routineDayName ? "Día de tu rutina" : "Tu entreno de hoy"} · {exercises.length} ejercicios</div>
        </div>
      </div>

      {!trainingState?.fixedExercises && (
        <div style={{ display:"flex", gap:8, marginBottom:18 }}>
          <button onClick={rotate} style={{ flex:1, background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", border:"1px solid #2e7d32", borderRadius:12, padding:"11px", cursor:"pointer", color:"#8bc34a", fontSize:13, fontWeight:700 }}>🔄 Rotar rutina</button>
        </div>
      )}

      {exercises.map((ex, i) => {
        const exMarks = marks[ex.id] || [];
        const lastSession = lastMarksFor(ex.id);
        const isCardioSession = ex.group==="cardio" || ex.metric==="cardio";
        // Nº de filas de series: usa el número antes del "×". Para cardio/tiempo sin "×", 1 fila.
        let numSeries = 3;
        if (ex.series.includes("×")) {
          numSeries = parseInt(ex.series.split("×")[0].trim()) || 3;
        } else {
          numSeries = 1; // ej: "25-35 min", "20 min"
        }
        numSeries = Math.min(numSeries, 6);
        // ── Sesión de carrera/bici: registrar distancia y tiempo (no peso/reps) ──
        if (isCardioSession) {
          const m = exMarks[0] || {};
          return (
            <div key={ex.id} style={{ background:"#1a1a24", borderRadius:18, marginBottom:14, border:"1px solid #2a2a3a", overflow:"hidden" }}>
              <div style={{ padding:"14px", borderBottom:"1px solid #232330" }}>
                <div style={{ color:"white", fontWeight:800, fontSize:15 }}>{ex.name}</div>
                <div style={{ color:"#ffd700", fontSize:12, fontWeight:700, marginTop:2 }}>Registra tu sesión</div>
              </div>
              {lastSession && (lastSession.series?.[0]?.dist || lastSession.series?.[0]?.tiempo) && (
                <div style={{ background:"#13131a", padding:"8px 14px", borderBottom:"1px solid #232330" }}>
                  <div style={{ color:"#666", fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>📅 Última vez ({formatDateShort(parseKey(lastSession.date))})</div>
                  <span style={{ color:"#8bc34a", fontSize:11.5, background:"#1a2a1a", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>
                    {lastSession.series[0].dist?`${lastSession.series[0].dist} km`:""}{lastSession.series[0].dist&&lastSession.series[0].tiempo?" · ":""}{lastSession.series[0].tiempo?`${lastSession.series[0].tiempo}`:""}
                  </span>
                </div>
              )}
              <div style={{ padding:"14px" }}>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:"#666", fontWeight:700, marginBottom:5, textAlign:"center" }}>DISTANCIA (km)</div>
                    <input type="number" inputMode="decimal" placeholder="—" value={m.dist||""} onChange={e=>setMark(ex.id,0,"dist",e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:8, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:15, textAlign:"center", outline:"none", boxSizing:"border-box" }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:"#666", fontWeight:700, marginBottom:5, textAlign:"center" }}>TIEMPO (h:mm:ss)</div>
                    <input inputMode="numeric" placeholder="ej 1:05:30" value={m.tiempo||""} onChange={e=>setMark(ex.id,0,"tiempo",e.target.value.replace(/[^0-9:]/g,""))} style={{ width:"100%", padding:"10px", borderRadius:8, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:15, textAlign:"center", outline:"none", boxSizing:"border-box" }} />
                  </div>
                </div>
                {(() => {
                  const secs = parseTimeToSecs(m.tiempo||"");
                  const dist = parseFloat(m.dist)||0;
                  return (secs>0 && dist>0) ? (
                    <div style={{ color:"#8bc34a", fontSize:12.5, textAlign:"center", marginTop:10, fontWeight:600 }}>Ritmo medio: {fmtPace(secs/dist)}</div>
                  ) : null;
                })()}
              </div>
            </div>
          );
        }
        return (
          <div key={ex.id} style={{ background:"#1a1a24", borderRadius:18, marginBottom:14, border:"1px solid #2a2a3a", overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px", borderBottom:"1px solid #232330" }}>
              <button onClick={()=>setViewExercise(ex)} style={{ flex:1, minWidth:0, background:"none", border:"none", textAlign:"left", cursor:"pointer", padding:0 }}>
                <div style={{ color:"white", fontWeight:800, fontSize:15 }}>{ex.name}</div>
                <div style={{ color:"#4caf50", fontSize:12, fontWeight:700, marginTop:2 }}>{ex.series} · RIR {ex.rir}</div>
              </button>
              <button onClick={()=>setSwapping(ex)} style={{ background:"#232330", border:"none", borderRadius:10, color:"#aaa", fontSize:13, fontWeight:700, padding:"8px 12px", cursor:"pointer", flexShrink:0 }}>Cambiar</button>
            </div>
            {lastSession && (
              <div style={{ background:"#13131a", padding:"8px 14px", borderBottom:"1px solid #232330" }}>
                <div style={{ color:"#666", fontSize:10.5, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>📅 Última vez ({formatDateShort(parseKey(lastSession.date))})</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {lastSession.series.map((s,idx) => (s && (s.peso||s.reps)) ? (
                    <span key={idx} style={{ color:"#8bc34a", fontSize:11.5, background:"#1a2a1a", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>
                      {s.peso?`${s.peso}kg`:""}{s.peso&&s.reps?" × ":""}{s.reps?`${s.reps}`:""}{!s.peso&&s.reps?" reps":""}
                    </span>
                  ) : null)}
                </div>
              </div>
            )}
            <div style={{ padding:"12px 14px" }}>
              <div style={{ display:"flex", gap:6, marginBottom:8, paddingLeft:4 }}>
                <span style={{ width:30, fontSize:10, color:"#666", fontWeight:700 }}>SERIE</span>
                {(ex.metric==="peso") && <span style={{ flex:1, fontSize:10, color:"#666", fontWeight:700, textAlign:"center" }}>PESO (kg)</span>}
                <span style={{ flex:1, fontSize:10, color:"#666", fontWeight:700, textAlign:"center" }}>{ex.metric==="tiempo"?"SEGUNDOS":"REPS"}</span>
              </div>
              {Array.from({length:numSeries}).map((_, s) => {
                const prev = lastSession?.series?.[s];
                return (
                <div key={s} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                  <span style={{ width:30, color:"#888", fontSize:13, fontWeight:700 }}>{s+1}</span>
                  {ex.metric==="peso" && <input type="number" inputMode="decimal" placeholder={prev?.peso?`${prev.peso}`:"—"} value={exMarks[s]?.peso||""} onChange={e=>setMark(ex.id,s,"peso",e.target.value)} style={{ flex:1, padding:"8px", borderRadius:8, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:14, textAlign:"center", outline:"none", minWidth:0 }} />}
                  <input type="number" inputMode="numeric" placeholder={prev?.reps?`${prev.reps}`:"—"} value={exMarks[s]?.reps||""} onChange={e=>setMark(ex.id,s,"reps",e.target.value)} style={{ flex:1, padding:"8px", borderRadius:8, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:14, textAlign:"center", outline:"none", minWidth:0 }} />
                </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Comentario de sensaciones */}
      <div style={{ background:"#1a1a24", borderRadius:18, padding:"16px", border:"1px solid #2a2a3a", marginBottom:18, marginTop:4 }}>
        <div style={{ color:"#ccc", fontWeight:800, fontSize:14, marginBottom:8 }}>📝 ¿Cómo te has sentido?</div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Sensaciones, energía, molestias, notas para la próxima vez..." rows={3} style={{ width:"100%", padding:"12px", borderRadius:12, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" }} />
      </div>

      <button onClick={()=>setConfirmFinish(true)} style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:900, fontSize:16, cursor:"pointer" }}>✓ Finalizar y guardar entreno</button>

      {/* Gráficas de entrenamiento */}
      {Object.keys(workoutLog).length > 0 && <TrainingCharts workoutLog={workoutLog} />}

      {/* Historial reciente */}
      {Object.keys(workoutLog).length > 0 && (
        <div style={{ marginTop:28 }}>
          <div style={{ fontSize:13, color:"#888", fontWeight:700, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Entrenos recientes</div>
          {Object.entries(workoutLog).sort((a,b)=>b[1].ts-a[1].ts).slice(0,5).map(([k,w]) => {
            const g = TRAINING_GOALS.find(x=>x.id===w.goal);
            return (
              <div key={k} style={{ background:"#15151c", borderRadius:12, padding:"12px 14px", marginBottom:8, border:"1px solid #232330" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:"white", fontWeight:700, fontSize:13 }}>{g?.emoji} {g?.label}</span>
                  <span style={{ color:"#666", fontSize:11 }}>{formatDateLong(parseKey(w.date))}</span>
                </div>
                <div style={{ color:"#777", fontSize:11, marginTop:4 }}>{w.exercises.map(e=>e.name).join(" · ")}</div>
                {w.comment && <div style={{ color:"#8bc34a", fontSize:12, marginTop:6, fontStyle:"italic" }}>"{w.comment}"</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIONES DE INFORMACIÓN
// ═══════════════════════════════════════════════════════════════════════════
function InfoTab({ onBack }) {
  const [section, setSection] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q:"¿Mis datos se guardan?", a:"Sí. Todo lo que registras (perfil, comidas, peso, entrenos) se guarda en tu propio móvil. Cada persona que usa la app tiene sus propios datos privados." },
    { q:"¿Por qué empiezo desde cero al abrir la app?", a:"Porque los datos son personales de cada usuario y se guardan en tu dispositivo. Al abrir por primera vez, rellenas tu perfil y a partir de ahí es tu app personal." },
    { q:"¿Las cantidades son en crudo o cocinado?", a:"Todos los alimentos están en CRUDO o EN SECO. Pesa el arroz, la pasta, las legumbres, etc. antes de cocinarlos. El peso cambia bastante al cocinar." },
    { q:"¿Cómo cambio mis calorías o macros?", a:"Edita tu perfil con el icono de perfil de arriba a la derecha. Al cambiar tu peso, actividad u objetivo, los macros se recalculan automáticamente." },
    { q:"¿Puedo cambiar el número de comidas?", a:"Sí, en cualquier momento desde tu perfil. Puedes elegir de 2 a 6 comidas al día y el reparto de calorías se ajusta solo." },
    { q:"¿Qué hago si un alimento no está en la lista?", a:"Pulsa 'Crear alimento' dentro de cualquier bloque, mete el nombre y los valores de la etiqueta (por 100g). La app lo clasifica automáticamente y se guarda en tu lista." },
    { q:"¿Cómo uso las recetas predefinidas?", a:"En Nutrición, entra en 'Recetas para tus macros', elige una receta y pulsa 'Añadir a una comida'. Selecciona en qué comida quieres meterla y sus ingredientes se añaden con las cantidades ya calculadas." },
    { q:"¿Qué es el RIR en los entrenamientos?", a:"Son las repeticiones que te quedan 'en reserva' al acabar una serie. RIR 2 = podrías hacer 2 reps más. Tienes la explicación completa en las guías de arriba." },
    { q:"¿La app sirve para perder y para ganar peso?", a:"Sí. Al crear tu perfil eliges tu objetivo (pérdida de grasa, mantenimiento o ganancia muscular) y la app ajusta tus calorías y macros en consecuencia." },
    { q:"¿Cada cuánto debo pesarme?", a:"El peso puedes anotarlo a diario, pero fíjate en la tendencia semanal, no en el dato de un día. Las medidas, una vez por semana es suficiente." },
    { q:"¿Necesito material para entrenar?", a:"No. Puedes entrenar solo con tu peso corporal. Si tienes material (mancuernas, bandas, etc.), selecciónalo y la app adaptará los ejercicios." },
  ];

  const sections = [
    { id:"empezar", emoji:"🚀", title:"Primeros pasos", body:[
      "SMINK FIT calcula tus calorías y macronutrientes a partir de tus datos (peso, altura, edad, sexo, nivel de actividad y objetivo).",
      "Lo primero es rellenar tu perfil con datos reales. Cuanto más precisos, mejor será el cálculo.",
      "Después podrás registrar tus comidas, tu peso y medidas, y tus entrenamientos. La constancia es lo que marca la diferencia: registra cada día.",
      "Puedes cambiar tus datos cuando quieras desde el icono de perfil de arriba a la derecha. Tus macros se recalcularán automáticamente.",
    ]},
    { id:"macros", emoji:"🥗", title:"Qué son los macros", body:[
      "Los macronutrientes son los tres grandes grupos que aportan energía: proteínas, grasas e hidratos de carbono.",
      "PROTEÍNAS (4 kcal/g): construyen y reparan el músculo. Clave para no perder masa muscular en déficit. Fuentes: carne, pescado, huevo, lácteos, legumbres.",
      "GRASAS (9 kcal/g): esenciales para las hormonas y la salud. No les tengas miedo, pero mídelas porque aportan más del doble de calorías por gramo. Fuentes: aceite de oliva, aguacate, frutos secos, pescado azul.",
      "HIDRATOS (4 kcal/g): tu principal fuente de energía, sobre todo para entrenar. Fuentes: arroz, pasta, patata, avena, fruta, pan.",
      "La app calcula tu proteína según tu peso corporal (lo más correcto para preservar músculo), fija un porcentaje de grasa saludable y el resto lo completa con hidratos.",
    ]},
    { id:"alimentacion", emoji:"🍽️", title:"Cómo funciona la nutrición", body:[
      "En la pestaña Nutrición eliges cuántas comidas haces al día y la app reparte tus calorías entre ellas (puedes ajustar el reparto con los sliders).",
      "Cada comida se divide en bloques: hidratos, proteínas, grasas y verduras. En la última comida del día tienes además un bloque de postre opcional.",
      "Añades alimentos a cada bloque y la app calcula automáticamente los gramos que necesitas para cuadrar tus calorías objetivo.",
      "Puedes seleccionar varios alimentos por bloque y repartirlos a partes iguales o de forma manual con los sliders.",
      "Si un producto no está, créalo tú mismo con el botón 'Crear alimento': la app lo clasifica solo según su macro dominante.",
      "Todos los alimentos están en CRUDO/SECO. Pesa el arroz, la pasta o las legumbres antes de cocinarlos.",
      "¿No sabes qué cocinar? Usa las 'Recetas para tus macros': más de 130 recetas con cantidades ya ajustadas a tus macros y su explicación paso a paso.",
    ]},
    { id:"entrenamiento", emoji:"🏋️", title:"Cómo funciona el entrenamiento", body:[
      "En la pestaña Entreno eliges tu objetivo: running, calistenia, movilidad, entreno en casa o fuerza/hipertrofia.",
      "Si entrenas en casa, seleccionas el material que tienes y la app solo te propondrá ejercicios que puedas hacer con él.",
      "La rutina se genera con ejercicios adaptados. Puedes cambiar cualquier ejercicio por otra alternativa del mismo grupo muscular, o rotar toda la rutina.",
      "Anotas el peso y las repeticiones de cada serie. Al terminar, puedes dejar un comentario sobre tus sensaciones.",
      "Todo queda guardado en el historial y verás gráficas de tu progreso: constancia semanal y evolución del peso que levantas.",
    ]},
    { id:"rir", emoji:"💪", title:"Qué es el RIR", body:[
      "RIR significa 'Repeticiones En Reserva'. Es una forma de medir cuánto esfuerzo le pones a cada serie.",
      "Un RIR de 2 significa que paras la serie cuando podrías haber hecho 2 repeticiones más con buena técnica.",
      "RIR 0 = al fallo total (no podrías hacer ni una más). RIR 3-4 = aún te quedan bastantes reps.",
      "Para ganar músculo, lo ideal suele ser entrenar con RIR 1-3: cerca del fallo pero sin llegar siempre a él, para recuperar bien.",
      "Ajusta el peso para que las últimas repeticiones de cada serie cuesten, manteniendo el RIR indicado.",
    ]},
    { id:"peso", emoji:"⚖️", title:"Peso, medidas y progreso", body:[
      "Pésate siempre en las mismas condiciones: por la mañana, en ayunas, después de ir al baño y sin ropa. Usa la misma báscula.",
      "El peso fluctúa cada día por agua, sal, glucógeno y digestión. No te obsesiones con el número diario: mira la TENDENCIA de la semana.",
      "Las medidas corporales (pecho, brazo, abdomen, etc.) son tan importantes como el peso, sobre todo si ganas músculo y pierdes grasa a la vez.",
      "Toma las medidas una vez por semana, en el mismo momento y de la misma forma. Usa el icono ⓘ de cada medida para ver cómo medir correctamente.",
      "El progreso real se ve en semanas y meses, no en días. Confía en el proceso y sé constante.",
    ]},
    { id:"rachas", emoji:"🔥", title:"Rachas y logros", body:[
      "Tu racha sube cada día que registras tu comida. Si te saltas un día, vuelve a empezar desde cero.",
      "Mantener la racha desbloquea logros: 3, 7, 15, 30 y 100 días seguidos.",
      "También hay logros por constancia en el control de peso (semanal, mensual y anual) y en la nutrición.",
      "Los logros son una forma de motivarte a ser constante. Al final, la constancia es lo que de verdad da resultados.",
    ]},
    { id:"consejos", emoji:"💡", title:"Consejos para tener éxito", body:[
      "Sé realista: una pérdida de grasa saludable es de 0,3-0,7 kg por semana. Ir más rápido suele significar perder músculo.",
      "Para ganar músculo, come ligeramente por encima de tu mantenimiento y prioriza la proteína y el entrenamiento de fuerza.",
      "Planifica tus comidas con antelación. Lo que no planificas, lo improvisas, y normalmente mal.",
      "Duerme 7-8 horas: el descanso es cuando el cuerpo se recupera y construye músculo.",
      "Bebe 2-3 litros de agua al día. Muchas veces confundimos sed con hambre.",
      "Un día malo no arruina nada. Lo que cuenta es lo que haces la mayoría del tiempo, no la perfección.",
    ]},
  ];

  if (section) {
    const s = sections.find(x=>x.id===section);
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setSection(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:18 }}>{s.emoji} {s.title}</div>
        {s.body.map((p,i) => (
          <p key={i} style={{ color:"#cde", fontSize:14, lineHeight:1.6, marginBottom:14 }}>{p}</p>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Resuelve tus dudas</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>Guías y preguntas frecuentes para sacarle el máximo partido a la app</div>

      <div style={{ fontSize:12, color:"#888", fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Guías</div>
      {sections.map(s => (
        <button key={s.id} onClick={()=>setSection(s.id)} style={{ width:"100%", marginBottom:10, padding:"16px", borderRadius:14, border:"1px solid #2a2a3a", background:"#1a1a24", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
          <span style={{ fontSize:24 }}>{s.emoji}</span>
          <span style={{ color:"white", fontWeight:700, fontSize:15, flex:1 }}>{s.title}</span>
          <span style={{ color:"#4caf50", fontSize:18 }}>→</span>
        </button>
      ))}

      <div style={{ fontSize:12, color:"#888", fontWeight:700, margin:"24px 0 10px", textTransform:"uppercase", letterSpacing:1 }}>Preguntas frecuentes</div>
      {faqs.map((f,i) => (
        <div key={i} style={{ marginBottom:10, background:"#1a1a24", borderRadius:14, border:"1px solid #2a2a3a", overflow:"hidden" }}>
          <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left", gap:10 }}>
            <span style={{ color:"white", fontWeight:700, fontSize:14 }}>{f.q}</span>
            <span style={{ color:"#4caf50", fontSize:18, flexShrink:0 }}>{openFaq===i?"−":"+"}</span>
          </button>
          {openFaq===i && <div style={{ padding:"0 16px 14px", color:"#aaa", fontSize:13, lineHeight:1.55 }}>{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

function InstallTab({ onBack }) {
  const [open, setOpen] = useState("ios_safari");
  const guides = [
    {
      id:"ios_safari", device:"iPhone / iPad", browser:"Safari", note:"La forma recomendada en Apple",
      steps:[
        "Abre esta web en Safari (no vale Chrome en iPhone para instalar).",
        "Pulsa el botón de Compartir (el cuadrado con la flecha hacia arriba, abajo en el centro).",
        "Desliza y pulsa «Añadir a pantalla de inicio».",
        "Pon el nombre (SMINK FIT ya viene puesto) y pulsa «Añadir» arriba a la derecha.",
        "¡Listo! El icono aparecerá en tu pantalla como una app normal.",
      ],
    },
    {
      id:"android_chrome", device:"Android", browser:"Chrome", note:"La forma más común en Android",
      steps:[
        "Abre esta web en Google Chrome.",
        "Pulsa los tres puntos (⋮) arriba a la derecha.",
        "Pulsa «Instalar aplicación» o «Añadir a pantalla de inicio».",
        "Confirma pulsando «Instalar».",
        "El icono aparecerá en tu pantalla de inicio y se abrirá a pantalla completa.",
      ],
    },
    {
      id:"android_otros", device:"Android", browser:"Samsung Internet / otros", note:"Si no usas Chrome",
      steps:[
        "Abre la web en tu navegador.",
        "Abre el menú del navegador (suele ser tres líneas o tres puntos).",
        "Busca «Añadir página a» o «Añadir a pantalla de inicio».",
        "Confirma y el icono quedará en tu pantalla.",
      ],
    },
    {
      id:"ios_chrome", device:"iPhone", browser:"Chrome", note:"Ojo: en iPhone conviene Safari",
      steps:[
        "En iPhone, Chrome no permite instalar apps como Safari por limitaciones de Apple.",
        "Te recomendamos abrir la web en Safari y seguir los pasos de arriba.",
        "Copia el enlace en Chrome, ábrelo en Safari y usa «Añadir a pantalla de inicio».",
      ],
    },
  ];
  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Instalar app</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:20, lineHeight:1.5 }}>Instala SMINK FIT en tu móvil para abrirla como una app, a pantalla completa y con su icono. Elige tu caso:</div>

      {guides.map(g => {
        const isOpen = open===g.id;
        return (
          <div key={g.id} style={{ background:"#1a1a24", borderRadius:16, marginBottom:12, border:`1px solid ${isOpen?"#2e7d32":"#2a2a3a"}`, overflow:"hidden" }}>
            <button onClick={()=>setOpen(isOpen?null:g.id)} style={{ width:"100%", padding:"16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
              <div>
                <div style={{ color:isOpen?"#8bc34a":"white", fontWeight:800, fontSize:15 }}>{g.device} · {g.browser}</div>
                <div style={{ color:"#777", fontSize:11.5, marginTop:2 }}>{g.note}</div>
              </div>
              <span style={{ color:"#4caf50", fontSize:18, transform:isOpen?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
            </button>
            {isOpen && (
              <div style={{ padding:"0 16px 16px" }}>
                {g.steps.map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"#2e7d32", color:"white", fontWeight:800, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                    <div style={{ color:"#ccc", fontSize:13.5, lineHeight:1.5, paddingTop:2 }}>{s}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px", marginTop:8 }}>
        <div style={{ color:"#8bc34a", fontSize:12.5, lineHeight:1.6 }}>Una vez instalada, ábrela desde el icono de tu pantalla de inicio. Funcionará a pantalla completa, sin la barra del navegador, como cualquier otra app. Tus datos se guardan en tu dispositivo.</div>
      </div>
    </div>
  );
}

function SupportTab({ onBack }) {
  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Soporte</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:24 }}>¿Necesitas ayuda o tienes una sugerencia?</div>
      <div style={{ background:"#1a1a24", borderRadius:18, padding:"24px 18px", border:"1px solid #2a2a3a", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
        <div style={{ color:"white", fontWeight:800, fontSize:16, marginBottom:8 }}>Estamos preparando esta sección</div>
        <div style={{ color:"#888", fontSize:13, lineHeight:1.5 }}>Pronto podrás contactar con nosotros desde aquí para resolver dudas, reportar problemas o enviar sugerencias para mejorar la app.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: SUEÑO Y DESCANSO
// ═══════════════════════════════════════════════════════════════════════════
function SleepTab({ sleepLog, setSleepLog, onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dKey = dateKey(currentDate);
  const today = new Date();
  const isToday = isSameDay(currentDate, today);
  const entry = sleepLog[dKey] || {};

  const setVal = (field, value) => setSleepLog(prev => ({ ...prev, [dKey]: { ...(prev[dKey]||{}), [field]:value } }));

  // Promedio de los últimos 7 días con registro
  const last7 = [];
  for (let i=0;i<7;i++){ const k = dateKey(addDays(today,-i)); if (sleepLog[k]?.hours) last7.push(parseFloat(sleepLog[k].hours)); }
  const avg7 = last7.length ? (last7.reduce((a,b)=>a+b,0)/last7.length).toFixed(1) : null;

  // Datos para la gráfica (últimos 14 días)
  const chartData = [];
  for (let i=13;i>=0;i--){ const k = dateKey(addDays(today,-i)); const h = sleepLog[k]?.hours; chartData.push({ label: formatDateShort(addDays(today,-i)), value: h?parseFloat(h):0 }); }
  const hasData = chartData.some(d=>d.value>0);

  const qualityOpts = [
    { id:"mala", label:"Mala", emoji:"😣", color:"#f44336" },
    { id:"regular", label:"Regular", emoji:"😐", color:"#ff9800" },
    { id:"buena", label:"Buena", emoji:"🙂", color:"#8bc34a" },
    { id:"excelente", label:"Excelente", emoji:"😴", color:"#4caf50" },
  ];

  const hoursColor = entry.hours ? (parseFloat(entry.hours)>=7 ? "#4caf50" : parseFloat(entry.hours)>=6 ? "#ff9800" : "#f44336") : "#666";

  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Sueño y descanso</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>El descanso es cuando tu cuerpo se recupera y crece</div>

      {/* Promedio destacado */}
      {avg7 && (
        <div style={{ background:"linear-gradient(135deg,#1a1a2e,#1a1a24)", borderRadius:16, padding:"18px", marginBottom:18, border:"1px solid #2a2a3a", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:40 }}>🌙</div>
          <div>
            <div style={{ color:"#A8FF60", fontWeight:900, fontSize:28, lineHeight:1 }}>{avg7}h</div>
            <div style={{ color:"#aaa", fontSize:13, marginTop:4 }}>Media de los últimos {last7.length} días</div>
          </div>
        </div>
      )}

      {/* Navegación de fecha */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:12, padding:"8px 6px", marginBottom:18 }}>
        <button onClick={()=>setCurrentDate(addDays(currentDate,-1))} style={{ background:"none", border:"none", color:"#4caf50", fontSize:20, cursor:"pointer", padding:"4px 14px" }}>‹</button>
        <div style={{ textAlign:"center", flex:1 }}>
          <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{isToday?"📍 Hoy":formatDateLong(currentDate)}</div>
        </div>
        <button onClick={()=>!isToday && setCurrentDate(addDays(currentDate,1))} disabled={isToday} style={{ background:"none", border:"none", color:isToday?"#333":"#4caf50", fontSize:20, cursor:isToday?"default":"pointer", padding:"4px 14px" }}>›</button>
      </div>

      {/* Horas de sueño */}
      <div style={{ background:"#1a1a24", borderRadius:16, padding:"18px", border:"1px solid #2a2a3a", marginBottom:14 }}>
        <div style={{ color:"#ccc", fontWeight:700, fontSize:14, marginBottom:14 }}>¿Cuántas horas dormiste?</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:8 }}>
          <button onClick={()=>setVal("hours", Math.max(0,(parseFloat(entry.hours)||0)-0.5).toString())} style={{ width:44, height:44, borderRadius:"50%", border:"1px solid #2a2a3a", background:"#0f0f14", color:"#4caf50", fontSize:22, cursor:"pointer" }}>−</button>
          <div style={{ textAlign:"center", minWidth:90 }}>
            <span style={{ color:hoursColor, fontWeight:900, fontSize:38 }}>{entry.hours||"0"}</span>
            <span style={{ color:"#666", fontSize:16, fontWeight:700 }}>h</span>
          </div>
          <button onClick={()=>setVal("hours", Math.min(14,(parseFloat(entry.hours)||0)+0.5).toString())} style={{ width:44, height:44, borderRadius:"50%", border:"1px solid #2a2a3a", background:"#0f0f14", color:"#4caf50", fontSize:22, cursor:"pointer" }}>+</button>
        </div>
        <div style={{ textAlign:"center", color:"#666", fontSize:12 }}>Lo recomendado es entre 7 y 9 horas</div>
      </div>

      {/* Calidad del sueño */}
      <div style={{ background:"#1a1a24", borderRadius:16, padding:"18px", border:"1px solid #2a2a3a", marginBottom:14 }}>
        <div style={{ color:"#ccc", fontWeight:700, fontSize:14, marginBottom:14 }}>¿Cómo descansaste?</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {qualityOpts.map(q => {
            const sel = entry.quality===q.id;
            return (
              <button key={q.id} onClick={()=>setVal("quality",q.id)} style={{ padding:"12px 4px", borderRadius:12, border:`2px solid ${sel?q.color:"#2a2a3a"}`, background:sel?"#15151c":"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:24 }}>{q.emoji}</span>
                <span style={{ color:sel?q.color:"#888", fontSize:11, fontWeight:700 }}>{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nota */}
      <div style={{ background:"#1a1a24", borderRadius:16, padding:"18px", border:"1px solid #2a2a3a", marginBottom:18 }}>
        <div style={{ color:"#ccc", fontWeight:700, fontSize:14, marginBottom:10 }}>📝 Notas (opcional)</div>
        <textarea value={entry.note||""} onChange={e=>setVal("note",e.target.value)} placeholder="¿Te despertaste de noche? ¿Cómo te sentiste al levantarte?" rows={2} style={{ width:"100%", padding:"12px", borderRadius:12, border:"1px solid #2a2a3a", background:"#0f0f14", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" }} />
      </div>

      {/* Gráfica de sueño */}
      {hasData && (
        <div style={{ background:"#1a1a24", borderRadius:16, padding:"16px", border:"1px solid #2a2a3a", marginBottom:18 }}>
          <div style={{ color:"#ccc", fontWeight:700, fontSize:14, marginBottom:14 }}>📊 Últimos 14 días</div>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:3, height:110 }}>
            {chartData.map((d,i) => {
              const color = d.value>=7?"#4caf50":d.value>=6?"#ff9800":d.value>0?"#f44336":"#232330";
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <div style={{ color:"#666", fontSize:8, fontWeight:700 }}>{d.value>0?d.value:""}</div>
                  <div style={{ width:"100%", maxWidth:16, height:`${d.value>0?(d.value/10)*80+4:3}px`, background:color, borderRadius:4, transition:"height 0.4s" }} />
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:14, marginTop:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:2, background:"#4caf50" }} /><span style={{ color:"#777", fontSize:11 }}>7h+</span></div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:2, background:"#ff9800" }} /><span style={{ color:"#777", fontSize:11 }}>6-7h</span></div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:2, background:"#f44336" }} /><span style={{ color:"#777", fontSize:11 }}>menos de 6h</span></div>
          </div>
        </div>
      )}

      {/* Consejos de descanso */}
      <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:16, padding:"16px 18px" }}>
        <div style={{ color:"#8bc34a", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>💡 Claves para dormir mejor</div>
        {[
          "Acuéstate y levántate a la misma hora, también los fines de semana.",
          "Evita pantallas (móvil, TV) al menos 1 hora antes de dormir.",
          "No tomes cafeína por la tarde: te puede robar horas de sueño.",
          "Mantén el dormitorio fresco, oscuro y silencioso.",
          "El alcohol empeora la calidad del sueño aunque te duermas antes.",
          "Dormir bien regula el hambre y mejora la recuperación muscular.",
        ].map((t,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
            <span style={{ color:"#4caf50", fontSize:13 }}>•</span>
            <span style={{ color:"#cde", fontSize:13, lineHeight:1.45 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: RESUMEN SEMANAL
// ═══════════════════════════════════════════════════════════════════════════
function WeeklySummaryTab({ history, workoutLog, sleepLog, waterLog, measureLog, mealDist, macros, numMeals, onBack }) {
  const today = new Date();
  const mealList = getMeals(numMeals);
  const lastMealId = mealList[mealList.length-1].id;

  // Días de la semana (últimos 7)
  const days = [];
  for (let i=6;i>=0;i--) days.push({ key:dateKey(addDays(today,-i)), date:addDays(today,-i) });

  // Calorías de un día (suma de comidas)
  const dayKcal = (key) => {
    const d = history[key]; if (!d) return 0;
    let total = 0;
    mealList.forEach(meal => {
      const mealKcal = macros.targetKcal * ((mealDist[meal.id]||0)/100);
      const hasPostre = ((d[meal.id]?.selected?.postre)||[]).length>0;
      const blocksToUse = (meal.id===lastMealId && hasPostre) ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
      blocksToUse.forEach(block => {
        const selIds = d[meal.id]?.selected?.[block.id]||[];
        const dynIds = selIds.filter(id => { const f=(d[meal.id]?.foods?.[block.id]||[]).find(x=>x.id===id); return !(f&&f.fg); });
        selIds.forEach(id => {
          const food = (d[meal.id]?.foods?.[block.id]||[]).find(f=>f.id===id);
          if (!food||!food.kcal) return;
          let gr;
          if (food.fg) gr = food.fg;
          else { const pct = (d[meal.id]?.pct?.[block.id]?.[id]||Math.round(100/(dynIds.length||1)))/100; gr = ((mealKcal/blocksToUse.length)*pct/food.kcal)*100; }
          total += (food.kcal*gr)/100;
        });
      });
    });
    return Math.round(total);
  };

  // Cálculos de la semana
  const kcalDays = days.map(d=>dayKcal(d.key)).filter(k=>k>0);
  const avgKcal = kcalDays.length ? Math.round(kcalDays.reduce((a,b)=>a+b,0)/kcalDays.length) : 0;
  const daysRegistered = kcalDays.length;

  const weekWorkouts = Object.values(workoutLog).filter(w => days.some(d=>d.key===w.date)).length;

  const sleepVals = days.map(d=>sleepLog[d.key]?.hours).filter(Boolean).map(parseFloat);
  const avgSleep = sleepVals.length ? (sleepVals.reduce((a,b)=>a+b,0)/sleepVals.length).toFixed(1) : null;

  const waterVals = days.map(d=>waterLog[d.key]).filter(Boolean);
  const avgWater = waterVals.length ? (waterVals.reduce((a,b)=>a+b,0)/waterVals.length/1000).toFixed(2) : null;

  // Cambio de peso en la semana
  const weekWeights = days.map(d=>({ key:d.key, w:measureLog[d.key]?.peso })).filter(x=>x.w);
  let weightChange = null;
  if (weekWeights.length>=2) {
    weightChange = (parseFloat(weekWeights[weekWeights.length-1].w) - parseFloat(weekWeights[0].w)).toFixed(1);
  }

  const adherence = Math.round((daysRegistered/7)*100);

  const Card = ({ emoji, value, label, sub, color }) => (
    <div style={{ background:"#1a1a24", borderRadius:16, padding:"16px", border:"1px solid #2a2a3a" }}>
      <div style={{ fontSize:22, marginBottom:6 }}>{emoji}</div>
      <div style={{ color:color||"#4caf50", fontWeight:900, fontSize:22, lineHeight:1 }}>{value}</div>
      <div style={{ color:"#999", fontSize:12, marginTop:4 }}>{label}</div>
      {sub && <div style={{ color:"#666", fontSize:11, marginTop:2 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Resumen de tu semana</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>Últimos 7 días de un vistazo</div>

      {/* Adherencia destacada */}
      <div style={{ background:"linear-gradient(135deg,#1a2e1a,#1a1a24)", borderRadius:18, padding:"20px", border:"1px solid #2e7d32", marginBottom:16, textAlign:"center" }}>
        <div style={{ color:"#4caf50", fontWeight:900, fontSize:36, lineHeight:1 }}>{adherence}%</div>
        <div style={{ color:"#aaa", fontSize:13, marginTop:6 }}>Adherencia · registraste {daysRegistered} de 7 días</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <Card emoji="🔥" value={avgKcal>0?`${avgKcal}`:"—"} label="Calorías/día (media)" sub={avgKcal>0?`objetivo ${macros.targetKcal}`:"sin registros"} />
        <Card emoji="🏋️" value={weekWorkouts} label="Entrenos esta semana" color="#8bc34a" />
        <Card emoji="😴" value={avgSleep?`${avgSleep}h`:"—"} label="Sueño (media)" color="#A8FF60" sub={avgSleep?(parseFloat(avgSleep)>=7?"¡Buen descanso!":"Intenta dormir más"):"sin registros"} />
        <Card emoji="💧" value={avgWater?`${avgWater}L`:"—"} label="Agua/día (media)" color="#4fc3f7" />
      </div>

      {weightChange!==null && (
        <Card emoji={parseFloat(weightChange)<0?"📉":parseFloat(weightChange)>0?"📈":"➡️"} value={`${weightChange>0?"+":""}${weightChange} kg`} label="Cambio de peso esta semana" color={parseFloat(weightChange)<0?"#4caf50":"#ff9800"} />
      )}

      {/* Mensaje motivacional */}
      <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:16, padding:"16px 18px", marginTop:16 }}>
        <div style={{ color:"#cde", fontSize:13.5, lineHeight:1.5 }}>
          {adherence>=85 ? "🌟 ¡Semana espectacular! Tu constancia es tu mayor fortaleza. Sigue así." :
           adherence>=50 ? "💪 Buen trabajo esta semana. Intenta registrar algún día más para tener un control completo." :
           "📌 Esta semana has registrado pocos días. ¡Ánimo! La constancia es la clave del progreso."}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: LISTA DE LA COMPRA (planificador independiente)
// ═══════════════════════════════════════════════════════════════════════════
function ShoppingListTab({ shoppingPlan, setShoppingPlan, savedLists, setSavedLists, macros, numMeals, customFoods, onCreateFood, onDeleteFood, onBack }) {
  const DIAS = [
    { id:"lunes", label:"Lunes" }, { id:"martes", label:"Martes" }, { id:"miercoles", label:"Miércoles" },
    { id:"jueves", label:"Jueves" }, { id:"viernes", label:"Viernes" }, { id:"sabado", label:"Sábado" }, { id:"domingo", label:"Domingo" },
  ];
  const mealList = getMeals(numMeals);
  const lastMealId = mealList[mealList.length-1].id;

  const [editingDay, setEditingDay] = useState(null);
  const [searching, setSearching] = useState(null);
  const [activeMeal, setActiveMeal] = useState(mealList[0].id);
  const [result, setResult] = useState(null);
  const [showRecipes, setShowRecipes] = useState(false);
  const [askSave, setAskSave] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [viewSaved, setViewSaved] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [editingDay, searching, result, showRecipes, showSaved, viewSaved]);

  const plan = shoppingPlan || { dias: {} };
  const getDay = (dayId) => plan.dias[dayId] || { active:false, meals: initMealState(numMeals) };

  const updateDay = (dayId, updater) => {
    setShoppingPlan(prev => {
      const p = prev || { dias:{} };
      const cur = p.dias[dayId] || { active:false, meals: initMealState(numMeals) };
      return { ...p, dias: { ...p.dias, [dayId]: updater(cur) } };
    });
  };

  const toggleActive = (dayId) => updateDay(dayId, d => ({ ...d, active: !d.active }));

  const dayHasFood = (dayId) => {
    const d = plan.dias[dayId];
    return d && mealList.some(m => BLOCKS.concat(POSTRE_BLOCK).some(b => (d.meals?.[m.id]?.selected?.[b.id]||[]).length>0));
  };

  const updateMeal = (dayId, mealId, updater) => updateDay(dayId, d => ({ ...d, meals: { ...d.meals, [mealId]: updater(d.meals[mealId] || emptyMeal(mealId===lastMealId)) } }));
  const addFood = (dayId, mealId, blockId, food) => updateMeal(dayId, mealId, m => ({ ...m, foods:{...m.foods,[blockId]:[...(m.foods[blockId]||[]).filter(f=>f.id!==food.id),food]}, selected:{...m.selected,[blockId]:[...(m.selected[blockId]||[]), food.id]}, pct:{...m.pct,[blockId]:equalPct([...(m.selected[blockId]||[]), food.id])} }));
  const removeFood = (dayId, mealId, blockId, foodId) => updateMeal(dayId, mealId, m => {
    const nf=(m.foods[blockId]||[]).filter(f=>f.id!==foodId); const ns=(m.selected[blockId]||[]).filter(id=>id!==foodId);
    return { ...m, foods:{...m.foods,[blockId]:nf}, selected:{...m.selected,[blockId]:ns}, pct:{...m.pct,[blockId]:equalPct(ns)} };
  });

  // Añadir receta completa a la comida activa del día que se edita (ingredientes con gramos fijos)
  const handleAddRecipeToDay = (idea, scaled, mealId) => {
    const VERDURAS = ["Brócoli","Tomate","Tomate natural","Lechuga","Espinacas","Calabacín","Pimiento rojo","Espárragos","Zanahoria","Cebolla","Maíz dulce"];
    const macroByName = {}; idea.ingredients.forEach(ing => { macroByName[ing.name] = ing; });
    updateMeal(editingDay, mealId, m => {
      const nm = JSON.parse(JSON.stringify(m));
      scaled.forEach((ing, idx) => {
        const meta = macroByName[ing.name] || {};
        const cat = VERDURAS.includes(ing.name) ? "verdura" : classifyFood({ p:meta.p||0, g:meta.g||0, c:meta.c||0 });
        const food = { id:`recipe_${idea.id}_${idx}_${Date.now()}`, name:ing.name, kcal:meta.kcal||0, p:meta.p||0, g:meta.g||0, c:meta.c||0, cat, fg:ing.grams };
        if (!nm.foods[cat]) nm.foods[cat]=[];
        if (!nm.selected[cat]) nm.selected[cat]=[];
        nm.foods[cat].push(food); nm.selected[cat].push(food.id);
      });
      return nm;
    });
  };

  const calcGrams = (mealId, blockId, food, mealData) => {
    if (food.fg) return food.fg;
    const mealKcal = macros.targetKcal * (1/mealList.length);
    const hasPostre = ((mealData.selected?.postre)||[]).length>0;
    const blocksToUse = (mealId===lastMealId && hasPostre) ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
    const selIds = mealData.selected?.[blockId]||[];
    const dynIds = selIds.filter(id => { const f=(mealData.foods?.[blockId]||[]).find(x=>x.id===id); return !(f&&f.fg); });
    const pct = (mealData.pct?.[blockId]?.[food.id] || Math.round(100/(dynIds.length||1)))/100;
    const kcalT = (mealKcal/blocksToUse.length)*pct;
    return food.kcal ? Math.round((kcalT/food.kcal)*100) : 0;
  };

  const generate = () => {
    const totals = {};
    const dayBreakdown = []; // desglose por día
    DIAS.forEach(dia => {
      const d = plan.dias[dia.id];
      if (!d || !d.active) return;
      const dayFoods = [];
      mealList.forEach(meal => {
        BLOCKS.concat(POSTRE_BLOCK).forEach(block => {
          const selIds = d.meals?.[meal.id]?.selected?.[block.id]||[];
          selIds.forEach(id => {
            const food = (d.meals?.[meal.id]?.foods?.[block.id]||[]).find(f=>f.id===id);
            if (!food) return;
            const gr = calcGrams(meal.id, block.id, food, d.meals[meal.id]);
            if (gr>0) {
              totals[food.name] = (totals[food.name]||0) + gr;
              dayFoods.push({ meal:meal.label, name:food.name, grams:Math.round(gr) });
            }
          });
        });
      });
      if (dayFoods.length) dayBreakdown.push({ dia:dia.label, foods:dayFoods });
    });
    const list = Object.entries(totals).map(([name,gr])=>({ name, grams:Math.round(gr) })).sort((a,b)=>a.name.localeCompare(b.name));
    setResult({ list, dayBreakdown, plan: JSON.parse(JSON.stringify(plan)) });
    setAskSave(true);
  };

  // Guardar la lista actual
  const saveCurrentList = () => {
    const now = new Date();
    const entry = {
      id: "list_" + Date.now(),
      name: `Lista ${now.getDate()}/${now.getMonth()+1}`,
      ts: now.getTime(),
      list: result.list,
      dayBreakdown: result.dayBreakdown,
      plan: result.plan,
    };
    setSavedLists(prev => [entry, ...prev]);
    setAskSave(false);
    resetPlan();
  };

  // Resetear el planificador (días en blanco)
  const resetPlan = () => setShoppingPlan({ dias:{} });

  // Cargar una lista guardada de nuevo al planificador
  const loadSavedList = (saved) => {
    setShoppingPlan(JSON.parse(JSON.stringify(saved.plan)));
    setViewSaved(null); setShowSaved(false);
  };

  const deleteSavedList = (id) => setSavedLists(prev => prev.filter(l=>l.id!==id));

  if (searching) {
    const block = searching.blockId==="postre" ? POSTRE_BLOCK : BLOCKS.find(b=>b.id===searching.blockId);
    const dayData = getDay(editingDay);
    const existingIds = ((dayData.meals[searching.mealId]?.foods?.[searching.blockId])||[]).map(f=>f.id);
    return <SearchScreen block={block} existingIds={existingIds} customFoods={customFoods}
      onAdd={food=>addFood(editingDay, searching.mealId, searching.blockId, food)}
      onCreateFood={onCreateFood} onDeleteFood={onDeleteFood}
      onBack={()=>setSearching(null)} />;
  }

  if (showRecipes && editingDay) {
    // reparto equitativo para escalar recetas en el planificador de compra
    const equalDist = {}; mealList.forEach(m => equalDist[m.id] = Math.round(100/mealList.length));
    return <MealIdeasScreen macros={macros} mealDist={equalDist} mealList={mealList}
      onAddRecipe={(idea,scaled,mealId)=>{ handleAddRecipeToDay(idea,scaled,mealId); setShowRecipes(false); }}
      onBack={()=>setShowRecipes(false)} />;
  }

  if (editingDay) {
    const dia = DIAS.find(d=>d.id===editingDay);
    const dayData = getDay(editingDay);
    const meal = mealList.find(m=>m.id===activeMeal) || mealList[0];
    const activeBlocks = meal.id===lastMealId ? [...BLOCKS, POSTRE_BLOCK] : BLOCKS;
    const mealData = dayData.meals[meal.id] || emptyMeal(meal.id===lastMealId);

    return (
      <div style={{ paddingBottom:30 }}>
        <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid #1e1e28" }}>
          <button onClick={()=>setEditingDay(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
          <div style={{ fontWeight:900, fontSize:20, color:"white" }}>🛒 Planificar {dia.label}</div>
          <div style={{ color:"#666", fontSize:12, marginTop:4 }}>Añade alimentos o recetas para este día</div>
        </div>
        <div style={{ display:"flex", borderBottom:"1px solid #1e1e28", background:"#0f0f14", overflowX:"auto" }}>
          {mealList.map(m => (
            <button key={m.id} onClick={()=>setActiveMeal(m.id)} style={{ flex:mealList.length<=4?1:"none", minWidth:mealList.length>4?80:0, padding:"12px 8px", border:"none", background:"none", borderBottom:`3px solid ${activeMeal===m.id?"#4caf50":"transparent"}`, color:activeMeal===m.id?"#4caf50":"#555", fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
              {m.emoji} {m.label}
              <div style={{ fontSize:10, color:activeMeal===m.id?"#4caf50":"#444", marginTop:2 }}>{Math.round(macros.targetKcal/mealList.length)} kcal</div>
            </button>
          ))}
        </div>
        <div style={{ padding:"14px" }}>
          <button onClick={()=>setShowRecipes(true)} style={{ width:"100%", background:"linear-gradient(135deg,#0d2818,#15201a)", border:"1px solid #2e7d32", borderRadius:12, padding:"12px 14px", cursor:"pointer", color:"#8bc34a", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span>💡 Añadir una receta completa</span>
            <span style={{ fontSize:15 }}>→</span>
          </button>
          {activeBlocks.map(block => {
            const foods = mealData.foods?.[block.id]||[];
            return (
              <div key={block.id} style={{ background:"#1a1a24", borderRadius:16, marginBottom:14, border:"1px solid #2a2a3a", overflow:"hidden" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:"1px solid #2a2a3a" }}>
                  <span style={{ color:"#ccc", fontWeight:800, fontSize:14 }}>{block.emoji} {block.label}</span>
                  <button onClick={()=>setSearching({ mealId:meal.id, blockId:block.id })} style={{ background:block.color.accent, border:"none", borderRadius:8, color:"white", fontSize:13, fontWeight:700, padding:"6px 12px", cursor:"pointer" }}>+ Añadir</button>
                </div>
                <div style={{ padding:"4px 14px 10px" }}>
                  {foods.length===0 && <div style={{ color:"#555", fontSize:12, padding:"10px 0", textAlign:"center" }}>Nada añadido</div>}
                  {foods.map(food => {
                    const gr = calcGrams(meal.id, block.id, food, mealData);
                    return (
                      <div key={food.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid #1e1e28" }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ color:"white", fontWeight:600, fontSize:13 }}>{food.name}</div>
                          <div style={{ color:block.color.border, fontSize:12, fontWeight:700, marginTop:2 }}>→ {gr}g</div>
                        </div>
                        <button onClick={()=>removeFood(editingDay, meal.id, block.id, food.id)} style={{ background:"none", border:"none", color:"#444", fontSize:18, cursor:"pointer", padding:"4px 8px" }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ───────── PANTALLA: ver una lista guardada concreta ─────────
  if (viewSaved) {
    const s = viewSaved;
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setViewSaved(null)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>📋 {s.name}</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>{s.list.length} alimentos · {s.dayBreakdown.length} días</div>

        <button onClick={()=>loadSavedList(s)} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:20 }}>↩️ Cargar esta lista en el planificador</button>

        {/* Lista total */}
        <div style={{ fontSize:12, color:"#888", fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Lista total</div>
        <div style={{ background:"#1a1a24", borderRadius:16, border:"1px solid #2a2a3a", overflow:"hidden", marginBottom:24 }}>
          {s.list.map((item,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", borderBottom: i<s.list.length-1?"1px solid #232330":"none" }}>
              <span style={{ color:"white", fontSize:14, fontWeight:600 }}>{item.name}</span>
              <span style={{ color:"#4caf50", fontWeight:800, fontSize:14 }}>{item.grams>=1000?`${(item.grams/1000).toFixed(2)} kg`:`${item.grams} g`}</span>
            </div>
          ))}
        </div>

        {/* Desglose por día */}
        <div style={{ fontSize:12, color:"#888", fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Por días</div>
        {s.dayBreakdown.map((day,i) => (
          <div key={i} style={{ background:"#1a1a24", borderRadius:14, border:"1px solid #2a2a3a", marginBottom:10, overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid #232330", color:"#4caf50", fontWeight:800, fontSize:14 }}>{day.dia}</div>
            <div style={{ padding:"6px 14px 10px" }}>
              {day.foods.map((f,j) => (
                <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:j<day.foods.length-1?"1px solid #1e1e28":"none" }}>
                  <span style={{ color:"#bbb", fontSize:13 }}><span style={{ color:"#666" }}>{f.meal}:</span> {f.name}</span>
                  <span style={{ color:"#8bc34a", fontSize:13, fontWeight:700 }}>{f.grams}g</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ───────── PANTALLA: listas guardadas ─────────
  if (showSaved) {
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>setShowSaved(false)} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>📋 Listas guardadas</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>Tus listas de la compra guardadas</div>
        {savedLists.length===0 ? (
          <div style={{ color:"#555", fontSize:14, textAlign:"center", padding:"40px 20px", background:"#15151c", borderRadius:14 }}>Aún no has guardado ninguna lista. Cuando generes una lista podrás guardarla aquí.</div>
        ) : savedLists.map(s => (
          <div key={s.id} style={{ background:"#1a1a24", borderRadius:14, border:"1px solid #2a2a3a", marginBottom:10, overflow:"hidden", display:"flex", alignItems:"center" }}>
            <button onClick={()=>setViewSaved(s)} style={{ flex:1, padding:"15px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
              <div style={{ color:"white", fontWeight:700, fontSize:15 }}>{s.name}</div>
              <div style={{ color:"#666", fontSize:12, marginTop:2 }}>{s.list.length} alimentos · {s.dayBreakdown.length} días</div>
            </button>
            <button onClick={()=>deleteSavedList(s.id)} style={{ background:"none", border:"none", color:"#a44", fontSize:13, cursor:"pointer", padding:"0 16px", fontWeight:600 }}>🗑</button>
          </div>
        ))}
      </div>
    );
  }

  if (result) {
    return (
      <div style={{ padding:"20px 16px 40px" }}>
        <button onClick={()=>{ setResult(null); setAskSave(false); }} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
        <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Tu lista de la compra</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>{result.list.length} alimentos en total</div>
        {result.list.length===0 ? (
          <div style={{ color:"#555", fontSize:14, textAlign:"center", padding:"40px 0", background:"#15151c", borderRadius:14 }}>No hay alimentos en los días activos.</div>
        ) : (
          <div style={{ background:"#1a1a24", borderRadius:16, border:"1px solid #2a2a3a", overflow:"hidden" }}>
            {result.list.map((item,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", borderBottom: i<result.list.length-1?"1px solid #232330":"none" }}>
                <span style={{ color:"white", fontSize:14, fontWeight:600 }}>{item.name}</span>
                <span style={{ color:"#4caf50", fontWeight:800, fontSize:14 }}>{item.grams>=1000?`${(item.grams/1000).toFixed(2)} kg`:`${item.grams} g`}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ background:"#15201a", border:"1px solid #2e7d32", borderRadius:14, padding:"14px 16px", marginTop:18 }}>
          <div style={{ color:"#cde", fontSize:12.5, lineHeight:1.5 }}>💡 Las cantidades están en crudo/seco. Compra un poco de más para tener margen.</div>
        </div>

        {/* Pop-up de guardar */}
        {askSave && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
            <div style={{ background:"#1a1a24", borderRadius:20, padding:"26px 22px", maxWidth:380, width:"100%", border:"1px solid #2a2a3a" }}>
              <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>💾</div>
              <div style={{ color:"white", fontWeight:900, fontSize:18, textAlign:"center", marginBottom:8 }}>¿Quieres guardar esta lista?</div>
              <div style={{ color:"#999", fontSize:13, textAlign:"center", lineHeight:1.5, marginBottom:22 }}>Se guardará el plan completo con todos los días y comidas, para que puedas reutilizarlo en el futuro. El planificador se vaciará para empezar de nuevo.</div>
              <button onClick={saveCurrentList} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>💾 Guardar lista</button>
              <button onClick={()=>{ setAskSave(false); resetPlan(); }} style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>No guardar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const activeDaysList = DIAS.filter(d=>plan.dias[d.id]?.active);
  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Lista de la compra</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:16 }}>Planifica los días de la semana. Pulsa un día para añadir alimentos y actívalo. Cuando termines, genera la lista.</div>

      <button onClick={()=>setShowSaved(true)} style={{ width:"100%", background:"linear-gradient(135deg,#1a1a24,#1f1f2e)", border:"1px solid #2a2a3a", borderRadius:12, padding:"13px 16px", cursor:"pointer", color:"#ccc", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <span>📋 Listas guardadas{savedLists.length>0?` (${savedLists.length})`:""}</span>
        <span style={{ color:"#4caf50", fontSize:15 }}>→</span>
      </button>
      {DIAS.map(dia => {
        const d = plan.dias[dia.id];
        const active = d?.active;
        const hasFood = dayHasFood(dia.id);
        return (
          <div key={dia.id} style={{ marginBottom:10, background:"#1a1a24", borderRadius:14, border:`1px solid ${active?"#2e7d32":"#2a2a3a"}`, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center" }}>
              <button onClick={()=>{ setEditingDay(dia.id); setActiveMeal(mealList[0].id); }} style={{ flex:1, padding:"15px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ color:"white", fontWeight:700, fontSize:15 }}>{dia.label}</div>
                <div style={{ color:"#666", fontSize:12, marginTop:2 }}>{hasFood?"Toca para editar":"Toca para añadir alimentos"}</div>
              </button>
              <button onClick={()=>hasFood && toggleActive(dia.id)} disabled={!hasFood} style={{ margin:"0 14px", padding:"7px 14px", borderRadius:20, border:"none", background:active?"#2e7d32":hasFood?"#2a2a3a":"#1e1e28", color:active?"white":hasFood?"#888":"#444", fontSize:12, fontWeight:700, cursor:hasFood?"pointer":"default", whiteSpace:"nowrap" }}>{active?"✓ Activo":"Activar"}</button>
            </div>
          </div>
        );
      })}
      <button onClick={generate} disabled={activeDaysList.length===0} style={{ width:"100%", marginTop:12, padding:"16px", borderRadius:14, border:"none", background:activeDaysList.length?"linear-gradient(135deg,#4caf50,#2e7d32)":"#2a2a3a", color:activeDaysList.length?"white":"#555", fontWeight:900, fontSize:16, cursor:activeDaysList.length?"pointer":"default" }}>{activeDaysList.length?`Crear lista de la compra (${activeDaysList.length} día${activeDaysList.length!==1?"s":""})`:"Activa al menos un día"}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PESTAÑA: AGUA
// ═══════════════════════════════════════════════════════════════════════════
function WaterTab({ waterLog, setWaterLog, userData, onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dKey = dateKey(currentDate);
  const today = new Date();
  const isToday = isSameDay(currentDate, today);

  // Objetivo personalizado según peso, objetivo y actividad
  const weight = parseFloat(userData.weight) || 70;
  const goalMl = calcWaterGoal(userData);
  const currentMl = waterLog[dKey] || 0;
  const pct = Math.min(100, Math.round((currentMl/goalMl)*100));

  const add = (ml) => setWaterLog(prev => ({ ...prev, [dKey]: Math.max(0, (prev[dKey]||0) + ml) }));
  const reset = () => setWaterLog(prev => ({ ...prev, [dKey]: 0 }));

  // Media de los últimos 7 días
  const last7 = [];
  for (let i=0;i<7;i++){ const k=dateKey(addDays(today,-i)); if (waterLog[k]) last7.push(waterLog[k]); }
  const avg7 = last7.length ? Math.round(last7.reduce((a,b)=>a+b,0)/last7.length) : null;

  return (
    <div style={{ padding:"20px 16px 40px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#4caf50", fontSize:14, cursor:"pointer", marginBottom:16, padding:0 }}>← Atrás</button>
      <div style={{ fontWeight:900, fontSize:22, color:"white", marginBottom:4 }}>Hidratación</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:18 }}>Tu objetivo diario: {(goalMl/1000).toFixed(1)} L · calculado según tu peso, objetivo y actividad</div>

      {/* Navegación de fecha */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:12, padding:"8px 6px", marginBottom:18 }}>
        <button onClick={()=>setCurrentDate(addDays(currentDate,-1))} style={{ background:"none", border:"none", color:"#4caf50", fontSize:20, cursor:"pointer", padding:"4px 14px" }}>‹</button>
        <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{isToday?"📍 Hoy":formatDateLong(currentDate)}</div>
        <button onClick={()=>!isToday && setCurrentDate(addDays(currentDate,1))} disabled={isToday} style={{ background:"none", border:"none", color:isToday?"#333":"#4caf50", fontSize:20, cursor:isToday?"default":"pointer", padding:"4px 14px" }}>›</button>
      </div>

      {/* Vaso visual */}
      <div style={{ background:"#1a1a24", borderRadius:20, padding:"24px", border:"1px solid #2a2a3a", marginBottom:16, textAlign:"center" }}>
        <div style={{ position:"relative", width:120, height:160, margin:"0 auto 16px", border:"3px solid #2a4a5a", borderTop:"none", borderRadius:"0 0 24px 24px", overflow:"hidden", background:"#0f0f14" }}>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${pct}%`, background:"linear-gradient(180deg,#4fc3f7,#0288d1)", transition:"height 0.5s ease", borderRadius:pct>=98?"0":"40% 40% 0 0" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
            <span style={{ color:"white", fontWeight:900, fontSize:26, textShadow:"0 1px 3px rgba(0,0,0,0.5)" }}>{pct}%</span>
          </div>
        </div>
        <div style={{ color:"#4fc3f7", fontWeight:900, fontSize:24 }}>{(currentMl/1000).toFixed(2)} L</div>
        <div style={{ color:"#666", fontSize:13, marginTop:2 }}>de {(goalMl/1000).toFixed(1)} L</div>
      </div>

      {/* Botones rápidos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
        <button onClick={()=>add(250)} style={{ padding:"16px 8px", borderRadius:14, border:"1px solid #2a4a5a", background:"#15202a", cursor:"pointer", color:"#4fc3f7", fontWeight:700, fontSize:13 }}>+ Vaso<div style={{ fontSize:11, color:"#5a7a8a", marginTop:2 }}>250 ml</div></button>
        <button onClick={()=>add(500)} style={{ padding:"16px 8px", borderRadius:14, border:"1px solid #2a4a5a", background:"#15202a", cursor:"pointer", color:"#4fc3f7", fontWeight:700, fontSize:13 }}>+ Botella<div style={{ fontSize:11, color:"#5a7a8a", marginTop:2 }}>500 ml</div></button>
        <button onClick={()=>add(1000)} style={{ padding:"16px 8px", borderRadius:14, border:"1px solid #2a4a5a", background:"#15202a", cursor:"pointer", color:"#4fc3f7", fontWeight:700, fontSize:13 }}>+ Litro<div style={{ fontSize:11, color:"#5a7a8a", marginTop:2 }}>1 L</div></button>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        <button onClick={()=>add(-250)} style={{ flex:1, padding:"10px", borderRadius:12, border:"1px solid #2a2a3a", background:"transparent", cursor:"pointer", color:"#888", fontSize:13, fontWeight:600 }}>− Quitar vaso</button>
        <button onClick={reset} style={{ flex:1, padding:"10px", borderRadius:12, border:"1px solid #2a2a3a", background:"transparent", cursor:"pointer", color:"#888", fontSize:13, fontWeight:600 }}>↺ Reiniciar</button>
      </div>

      {avg7 && (
        <div style={{ background:"#15202a", borderRadius:14, padding:"16px", border:"1px solid #2a4a5a", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:30 }}>💧</span>
          <div><div style={{ color:"#4fc3f7", fontWeight:900, fontSize:20 }}>{(avg7/1000).toFixed(2)} L</div><div style={{ color:"#888", fontSize:12 }}>Media de los últimos {last7.length} días</div></div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ LATERAL (hamburguesa)
// ═══════════════════════════════════════════════════════════════════════════
function SideMenu({ open, onClose, onNavigate, userName }) {
  if (!open) return null;
  const items = [
    { id:"inicio", emoji:"🏠", label:"Inicio" },
    { id:"nutricion", emoji:"🍽️", label:"Nutrición" },
    { id:"entreno", emoji:"🏋️", label:"Entreno" },
    { id:"medidas", emoji:"📊", label:"Peso y medidas" },
    { id:"agua", emoji:"💧", label:"Hidratación" },
    { id:"sueno", emoji:"😴", label:"Sueño y descanso" },
    { id:"resumen", emoji:"📈", label:"Resumen semanal" },
    { id:"compra", emoji:"🛒", label:"Lista de la compra" },
    { id:"logros", emoji:"🏆", label:"Logros" },
    { id:"sep1", sep:true },
    { id:"instalar", emoji:"📲", label:"Instalar app" },
    { id:"info", emoji:"💬", label:"Resuelve tus dudas" },
    { id:"soporte", emoji:"📞", label:"Soporte" },
  ];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)" }} />
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:"78%", maxWidth:320, background:"#15151c", borderRight:"1px solid #2a2a3a", padding:"24px 0", boxShadow:"4px 0 30px rgba(0,0,0,0.5)", overflowY:"auto" }}>
        <div style={{ padding:"0 20px 20px", borderBottom:"1px solid #232330", marginBottom:12 }}>
          <div style={{ fontWeight:900, fontSize:20, letterSpacing:1 }}><span style={{ color:"#A8FF60" }}>SMINK</span> <span style={{ color:"#fff" }}>FIT</span></div>
          <div style={{ color:"#666", fontSize:13, marginTop:4 }}>Hola, {userName} 👋</div>
        </div>
        {items.map(it => it.sep
          ? <div key={it.id} style={{ height:1, background:"#232330", margin:"12px 20px" }} />
          : (
            <button key={it.id} onClick={()=>{ onNavigate(it.id); onClose(); }} style={{ width:"100%", padding:"14px 20px", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
              <span style={{ fontSize:20 }}>{it.emoji}</span>
              <span style={{ color:"#ddd", fontWeight:600, fontSize:15 }}>{it.label}</span>
            </button>
          )
        )}
        <div style={{ padding:"20px", marginTop:12, borderTop:"1px solid #232330" }}>
          <div style={{ color:"#444", fontSize:11, textAlign:"center" }}>SMINK FIT · v1.0</div>
        </div>
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
    { id:"entreno", label:"Entreno", icon:"🏋️" },
    { id:"medidas", label:"Medidas", icon:"📊" },
    { id:"ajustes", label:"Ajustes", icon:"⚙️" },
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
export default function App({ userId, userEmail, cloudData }) {
  // ── Estados inicializados desde Supabase (cloudData) o localStorage como fallback ──
  const cd = cloudData || {};
  const [userData, setUserDataRaw] = useLS("userData_v10", {});
  const [history, setHistoryRaw] = useLS("history_v10", {});
  const [measureLog, setMeasureLogRaw] = useLS("measureLog_v10", {});
  const [mealDist, setMealDist] = useLS("mealDist_v10", DEFAULT_MEAL_DIST);
  const [customFoods, setCustomFoodsRaw] = useLS("customFoods_v10", []);
  const [trainingState, setTrainingState] = useLS("trainingState_v10", null);
  const [savedRoutine, setSavedRoutineRaw] = useLS("savedRoutine_v10", null);
  const [racePlan, setRacePlanRaw] = useLS("racePlan_v10", null);
  const [workoutLog, setWorkoutLogRaw] = useLS("workoutLog_v10", {});
  const [sleepLog, setSleepLogRaw] = useLS("sleepLog_v10", {});
  const [waterLog, setWaterLogRaw] = useLS("waterLog_v10", {});
  const [shoppingPlan, setShoppingPlan] = useLS("shoppingPlan_v10", { dias:{} });
  const [savedLists, setSavedLists] = useLS("savedLists_v10", []);
  const [cloudLoaded, setCloudLoaded] = useState(false);

  // Al recibir cloudData, sobrescribir el estado local con los datos de Supabase
  useEffect(() => {
    if (!cloudData || cloudLoaded) return;
    if (cloudData.userData) setUserDataRaw(cloudData.userData);
    if (cloudData.history && Object.keys(cloudData.history).length) setHistoryRaw(cloudData.history);
    if (cloudData.workoutLog && Object.keys(cloudData.workoutLog).length) setWorkoutLogRaw(cloudData.workoutLog);
    if (cloudData.measureLog && Object.keys(cloudData.measureLog).length) setMeasureLogRaw(cloudData.measureLog);
    if (cloudData.savedRoutine) setSavedRoutineRaw(cloudData.savedRoutine);
    if (cloudData.racePlan) setRacePlanRaw(cloudData.racePlan);
    if (cloudData.waterLog && Object.keys(cloudData.waterLog).length) setWaterLogRaw(cloudData.waterLog);
    if (cloudData.sleepLog && Object.keys(cloudData.sleepLog).length) setSleepLogRaw(cloudData.sleepLog);
    if (cloudData.customFoods && cloudData.customFoods.length) setCustomFoodsRaw(cloudData.customFoods);
    setCloudLoaded(true);
  }, [cloudData]);

  // Wrappers que guardan en Supabase + localStorage simultáneamente
  const setUserData = useCallback(v => {
    setUserDataRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) saveProfile(userId, { name:nv.name, weight:nv.weight, height:nv.height, age:nv.age, sex:nv.sex, activity:nv.activity, goal:nv.goal, num_meals:nv.numMeals, kcal_adjust:nv.kcalAdjust });
      return nv;
    });
  }, [userId]);

  const setHistory = useCallback(v => {
    setHistoryRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) {
        // Guardar solo los días que hayan cambiado
        const changed = Object.keys(nv).filter(k => JSON.stringify(nv[k]) !== JSON.stringify(prev[k]));
        changed.forEach(k => saveNutritionDay(userId, k, nv[k]));
      }
      return nv;
    });
  }, [userId]);

  const setWorkoutLog = useCallback(v => {
    setWorkoutLogRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) {
        const changed = Object.keys(nv).filter(k => !prev[k]);
        changed.forEach(k => saveWorkout(userId, k, nv[k]));
      }
      return nv;
    });
  }, [userId]);

  const setMeasureLog = useCallback(v => {
    setMeasureLogRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) {
        const changed = Object.keys(nv).filter(k => JSON.stringify(nv[k]) !== JSON.stringify(prev[k]));
        changed.forEach(k => saveMeasure(userId, k, nv[k]));
      }
      return nv;
    });
  }, [userId]);

  const setSavedRoutine = useCallback(v => {
    setSavedRoutineRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) saveRoutine(userId, nv);
      return nv;
    });
  }, [userId]);

  const setRacePlan = useCallback(v => {
    setRacePlanRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) saveRacePlan(userId, nv);
      return nv;
    });
  }, [userId]);

  const setWaterLog = useCallback(v => {
    setWaterLogRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) {
        const changed = Object.keys(nv).filter(k => nv[k] !== prev[k]);
        changed.forEach(k => saveWater(userId, k, nv[k]));
      }
      return nv;
    });
  }, [userId]);

  const setSleepLog = useCallback(v => {
    setSleepLogRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) {
        const changed = Object.keys(nv).filter(k => JSON.stringify(nv[k]) !== JSON.stringify(prev[k]));
        changed.forEach(k => saveSleep(userId, k, nv[k]));
      }
      return nv;
    });
  }, [userId]);

  const setCustomFoods = useCallback(v => {
    setCustomFoodsRaw(prev => {
      const nv = typeof v === "function" ? v(prev) : v;
      if (userId) saveCustomFoods(userId, nv);
      return nv;
    });
  }, [userId]);
  const [editing, setEditing] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState("inicio");
  const [nutritionDate, setNutritionDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [installPromptSeen, setInstallPromptSeen] = useLS("installPromptSeen_v10", false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => { const t = setTimeout(()=>setShowSplash(false), 3000); return ()=>clearTimeout(t); }, []);

  // La primera vez (tras el splash), preguntar si quiere instalar la app
  useEffect(() => {
    if (!showSplash && !installPromptSeen) {
      // Detectar si ya está instalada (modo standalone) para no preguntar
      const standalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      if (!standalone) {
        const t = setTimeout(()=>setShowInstallPrompt(true), 600);
        return ()=>clearTimeout(t);
      }
    }
  }, [showSplash, installPromptSeen]);

  // Al cambiar de pestaña, subir arriba del todo para ver la cabecera
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

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
  // Si userData está vacío (sin nombre) o editando, mostrar perfil
  if (!userData || !userData.name || editing) return <ProfileScreen initial={editing?userData:null} onSave={handleSaveProfile} />;

  const mainTabs = ["inicio","nutricion","entreno","medidas","ajustes"];

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", paddingBottom:74 }}>
      <style>{`
        @keyframes screen-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes soft-fade { from { opacity:0; } to { opacity:1; } }
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes pop-in { 0% { transform:scale(0.3); opacity:0; } 60% { transform:scale(1.15); opacity:1; } 100% { transform:scale(1); } }
        @keyframes ring-draw { from { stroke-dashoffset:339; } to { stroke-dashoffset:0; } }
        @keyframes check-draw { from { stroke-dashoffset:60; } to { stroke-dashoffset:0; } }
        @keyframes draw-line { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }
        @keyframes glow-pulse { 0% { box-shadow:0 0 0 0 rgba(76,175,80,0.4); } 70% { box-shadow:0 0 0 30px rgba(76,175,80,0); } 100% { box-shadow:0 0 0 0 rgba(76,175,80,0); } }
        @keyframes scale-fade { 0% { transform:scale(0.85); opacity:0; } 100% { transform:scale(1); opacity:1; } }
        @keyframes rise-up { 0% { transform:translateY(14px); opacity:0; } 100% { transform:translateY(0); opacity:1; } }
        * { -webkit-tap-highlight-color: transparent; }
        button { transition: transform 0.08s ease, opacity 0.15s ease; }
        button:active { transform: scale(0.97); }
      `}</style>
      <SideMenu open={menuOpen} onClose={()=>setMenuOpen(false)} onNavigate={setTab} userName={userData.name} />

      {/* Pop-up de bienvenida: instalar app (primera visita) */}
      {showInstallPrompt && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(5px)", WebkitBackdropFilter:"blur(5px)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", animation:"fade-in 0.3s ease" }}>
          <div style={{ background:"#16161f", borderRadius:22, padding:"30px 24px", maxWidth:360, width:"100%", border:"1px solid #2a3a2a", animation:"scale-fade 0.35s ease", textAlign:"center" }}>
            <div style={{ width:72, height:72, margin:"0 auto 18px", borderRadius:"50%", background:"radial-gradient(circle, rgba(168,255,96,0.15), transparent 70%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#A8FF60" strokeWidth="4" fill="rgba(168,255,61,0.05)" />
                <path d="M70 32 C70 24 60 21 50 21 C39 21 31 27 31 37 C31 46 41 49 50 52 C59 55 69 58 69 68 C69 78 60 81 50 81 C39 81 30 77 30 68" stroke="#A8FF60" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div style={{ color:"white", fontWeight:900, fontSize:20, marginBottom:8 }}>Instala SMINK FIT</div>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.5, marginBottom:24 }}>Añádela a tu pantalla de inicio y úsala como una app, a pantalla completa y con su icono. ¿Quieres ver cómo se hace?</div>
            <button onClick={()=>{ setInstallPromptSeen(true); setShowInstallPrompt(false); setTab("instalar"); }} style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4caf50,#2e7d32)", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>Sí, enséñame cómo</button>
            <button onClick={()=>{ setInstallPromptSeen(true); setShowInstallPrompt(false); }} style={{ width:"100%", padding:"15px", borderRadius:14, border:"1px solid #2a2a3a", background:"transparent", color:"#888", fontWeight:700, fontSize:14, cursor:"pointer" }}>Ahora no</button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:120, background:"rgba(15,15,20,0.85)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderBottom:"1px solid #1e1e28", padding:"14px 18px", paddingTop:"calc(14px + env(safe-area-inset-top))", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={()=>setMenuOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexDirection:"column", gap:4, width:22 }}>
            <span style={{ height:2.5, background:"#A8FF60", borderRadius:2, width:"100%" }} />
            <span style={{ height:2.5, background:"#A8FF60", borderRadius:2, width:"100%" }} />
            <span style={{ height:2.5, background:"#A8FF60", borderRadius:2, width:"100%" }} />
          </button>
          <div style={{ fontWeight:900, fontSize:18, color:"white", letterSpacing:1 }}>
            <span style={{ color:"#A8FF60" }}>SMINK</span> <span style={{ color:"#fff" }}>FIT</span>
          </div>
        </div>
        <button onClick={()=>setEditing(true)} style={{ background:"#1a1a24", border:"1px solid #2a2a3a", borderRadius:10, color:"#888", fontSize:12, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#888"><circle cx="12" cy="8" r="4" /><path d="M12 14c-4 0-7 2.2-7 5v1h14v-1c0-2.8-3-5-7-5z" /></svg>
          {userData.name}
        </button>
      </div>

      <div key={tab} style={{ animation:"screen-in 0.35s ease" }}>
      {tab === "inicio" && <DashboardTab userData={userData} macros={macros} measureLog={measureLog} history={history} workoutLog={workoutLog} waterLog={waterLog} mealDist={mealDist} numMeals={numMeals} savedRoutine={savedRoutine} racePlan={racePlan} onGoTo={setTab} />}
      {tab === "nutricion" && <NutritionTab macros={macros} numMeals={numMeals} history={history} setHistory={setHistory} mealDist={mealDist} setMealDist={setMealDist} currentDate={nutritionDate} setCurrentDate={setNutritionDate} customFoods={customFoods} onCreateFood={handleCreateFood} onDeleteFood={handleDeleteFood} />}
      {tab === "medidas" && <MeasuresTab measureLog={measureLog} setMeasureLog={setMeasureLog} />}
      {tab === "entreno" && <TrainingTab trainingState={trainingState} setTrainingState={setTrainingState} workoutLog={workoutLog} setWorkoutLog={setWorkoutLog} savedRoutine={savedRoutine} setSavedRoutine={setSavedRoutine} racePlan={racePlan} setRacePlan={setRacePlan} onGoTo={setTab} />}
      {tab === "logros" && <AchievementsTab measureLog={measureLog} history={history} workoutLog={workoutLog} waterLog={waterLog} userData={userData} onBack={()=>setTab("inicio")} />}
      {tab === "sueno" && <SleepTab sleepLog={sleepLog} setSleepLog={setSleepLog} onBack={()=>setTab("inicio")} />}
      {tab === "agua" && <WaterTab waterLog={waterLog} setWaterLog={setWaterLog} userData={userData} onBack={()=>setTab("inicio")} />}
      {tab === "resumen" && <WeeklySummaryTab history={history} workoutLog={workoutLog} sleepLog={sleepLog} waterLog={waterLog} measureLog={measureLog} mealDist={mealDist} macros={macros} numMeals={numMeals} onBack={()=>setTab("inicio")} />}
      {tab === "compra" && <ShoppingListTab shoppingPlan={shoppingPlan} setShoppingPlan={setShoppingPlan} savedLists={savedLists} setSavedLists={setSavedLists} macros={macros} numMeals={numMeals} customFoods={customFoods} onCreateFood={handleCreateFood} onDeleteFood={handleDeleteFood} onBack={()=>setTab("inicio")} />}
      {tab === "info" && <InfoTab onBack={()=>setTab("inicio")} />}
      {tab === "instalar" && <InstallTab onBack={()=>setTab("inicio")} />}
      {tab === "ajustes" && <SettingsScreen userData={userData} userId={userId} userEmail={userEmail} userPlan={cloudData?.userPlan||"free"} onLogout={async()=>{ const {supabase:sb}=await import('./supabase.js'); await sb.auth.signOut(); window.location.reload(); }} onEditProfile={()=>setEditing(true)} />}
      {tab === "soporte" && <SupportTab onBack={()=>setTab("inicio")} />}
      </div>

      <BottomNav active={mainTabs.includes(tab)?tab:""} onChange={setTab} />
    </div>
  );
}
