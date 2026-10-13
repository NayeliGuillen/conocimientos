// Navigation
const panelMap = {
  inicio:'inicio',matematicas:'matematicas',economia:'economia',espanol:'espanol',
  ciencias:'ciencias',filosofia:'filosofia',historia:'historia',guerras:'guerras',
  politica:'politica',paises:'paises',austria:'austria',centroamerica:'centroamerica',
  honduras:'honduras',horario:'horario',mentor:'mentor',recursos:'recursos'
};

function go(id) {
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const p = document.getElementById('panel-'+id);
  if(p) p.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>{
    if(n.getAttribute('onclick')&&n.getAttribute('onclick').includes("'"+id+"'")) n.classList.add('active');
  });
  if(window.innerWidth<=700) document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='progreso'||id==='inicio') setTimeout(updateAllProgress, 50);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Tabs
function tab(groupId, panelId) {
  const group = document.getElementById(groupId);
  if(!group) return;
  const prefix = panelId.replace(/-[^-]+$/,'').replace(/[a-z]+$/,'');
  group.querySelectorAll('.tb').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
  // hide siblings
  const target = document.getElementById(panelId);
  if(!target) return;
  const siblings = target.parentElement.children;
  for(let s of siblings){ if(s.id && s.id !== panelId && s.tagName!=='DIV'||s.classList.contains('tabs')) continue; if(s.tagName==='DIV' && s.id && s.id!==panelId){ s.style.display='none'; } }
  // show all siblings then hide
  let allPanels = [];
  for(let s of target.parentElement.children){
    if(s.tagName==='DIV' && s.id && !s.classList.contains('tabs') && !s.classList.contains('panel') && !s.classList.contains('card')){
      allPanels.push(s);
    }
  }
  allPanels.forEach(p=>p.style.display='none');
  target.style.display='block';
}

// Level tabs
function lvl(btn, id) {
  const parent = btn.closest('.card')||btn.closest('.panel');
  if(!parent) return;
  parent.querySelectorAll('.lb').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  parent.querySelectorAll('.lc').forEach(c=>c.classList.remove('active'));
  const t = document.getElementById(id);
  if(t) t.classList.add('active');
}

// Topic toggle (expandable study topics)
function topic(hd) {
  const body = hd.nextElementSibling;
  const arr = hd.querySelector('.ti-arr');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  if(arr) arr.classList.toggle('open', !isOpen);
}

// Accordion
function acc(head) {
  const body = head.nextElementSibling;
  const arrow = head.querySelector('.ar');
  const open = body.classList.contains('open');
  body.classList.toggle('open',!open);
  if(arrow) arrow.classList.toggle('open',!open);
}

// Country tabs (Centroamerica)
function ctry(prefix, id) {
  const tabGroup = document.getElementById(prefix+'-ctabs');
  if(tabGroup){ tabGroup.querySelectorAll('.ctb').forEach(b=>b.classList.remove('active')); event.target.classList.add('active'); }
  const panels = document.querySelectorAll('.cp');
  panels.forEach(p=>{if(p.id===prefix+'-'+id){p.classList.add('active');}else{p.classList.remove('active');}});
}

// Close sidebar on outside click
document.addEventListener('click', function(e){
  const sb = document.getElementById('sidebar');
  if(window.innerWidth<=700 && sb.classList.contains('open') && !sb.contains(e.target) && !e.target.classList.contains('mob-menu')){
    sb.classList.remove('open');
  }
});

// ==================== PROGRESO: DOMINO ESTE TEMA ====================
const SECTION_LABELS = {
  historia:'Historia', guerras:'Guerras', matematicas:'Matemáticas',
  economia:'Economía', espanol:'Español', ciencias:'Ciencias',
  filosofia:'Filosofía', politica:'Política', paises:'Países',
  austria:'Austro-Húngaro', centroamerica:'Centroamérica', honduras:'Honduras',
  migraciones:'Migraciones', sorprendente:'Sorprendente', fuentes:'Fuentes', recursos:'Recursos'
};

function initProgress() {
  document.querySelectorAll('.ti').forEach(function(ti, idx) {
    const panel = ti.closest('.panel');
    const panelId = panel ? panel.id.replace('panel-','') : 'x';
    const tid = panelId + '-' + idx;
    ti.dataset.tid = tid;
    const body = ti.querySelector('.ti-body');
    if (!body) return;
    const btn = document.createElement('button');
    btn.className = 'ti-domino';
    btn.innerHTML = '&#10003; Domino este tema';
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const isMastered = ti.classList.contains('mastered');
      if (isMastered) {
        ti.classList.remove('mastered');
        try { localStorage.removeItem('ac_' + tid); } catch(err){}
        btn.innerHTML = '&#10003; Domino este tema';
      } else {
        ti.classList.add('mastered');
        try { localStorage.setItem('ac_' + tid, '1'); } catch(err){}
        btn.innerHTML = '&#10003; ¡Dominado!';
      }
      updateAllProgress();
    });
    body.appendChild(btn);
    try {
      if (localStorage.getItem('ac_' + tid)) {
        ti.classList.add('mastered');
        btn.innerHTML = '&#10003; ¡Dominado!';
      }
    } catch(err){}
  });
  updateAllProgress();
}

function updateAllProgress() {
  const all = document.querySelectorAll('.ti');
  const done = document.querySelectorAll('.ti.mastered');
  const total = all.length, mastered = done.length;
  const pct = total ? Math.round(mastered/total*100) : 0;
  const fill1 = document.getElementById('prog-bar-fill');
  const txt1 = document.getElementById('prog-bar-txt');
  const fill2 = document.getElementById('prog-total-fill');
  const txt2 = document.getElementById('prog-total-txt');
  if(fill1) fill1.style.width = pct+'%';
  if(txt1) txt1.textContent = mastered+' / '+total+' temas ('+pct+'%)';
  if(fill2) fill2.style.width = pct+'%';
  if(txt2) txt2.textContent = mastered+' / '+total+' temas dominados ('+pct+'%)';
  renderProgressSubjects();
}

function renderProgressSubjects() {
  const grid = document.getElementById('prog-subjects-grid');
  if (!grid) return;
  const sections = {};
  document.querySelectorAll('.ti').forEach(function(ti){
    const tid = ti.dataset.tid || '';
    const sec = tid.split('-')[0] || 'otros';
    if (!sections[sec]) sections[sec] = {total:0, done:0};
    sections[sec].total++;
    if (ti.classList.contains('mastered')) sections[sec].done++;
  });
  let html = '';
  Object.keys(sections).forEach(function(sec){
    const d = sections[sec];
    if(d.total === 0) return;
    const pct = Math.round(d.done/d.total*100);
    const label = SECTION_LABELS[sec] || sec;
    html += '<div class="prog-sub" onclick="go(\''+sec+'\')">';
    html += '<div class="prog-sub-top"><span class="prog-sub-name">'+label+'</span><span class="prog-sub-pct">'+pct+'%</span></div>';
    html += '<div class="prog-sub-track"><div class="prog-sub-fill" style="width:'+pct+'%"></div></div>';
    html += '<div class="prog-sub-count">'+d.done+' de '+d.total+' temas</div>';
    html += '</div>';
  });
  grid.innerHTML = html || '<p style="font-size:12px;color:var(--tx3)">Aún no has marcado ningún tema como dominado.</p>';
}

function resetProgress() {
  if (!confirm('¿Reiniciar todo tu progreso? Esta acción no se puede deshacer.')) return;
  try {
    const keys = Object.keys(localStorage).filter(k=>k.startsWith('ac_'));
    keys.forEach(k=>localStorage.removeItem(k));
  } catch(err){}
  document.querySelectorAll('.ti.mastered').forEach(function(ti){
    ti.classList.remove('mastered');
    const btn = ti.querySelector('.ti-domino');
    if(btn) btn.innerHTML = '&#10003; Domino este tema';
  });
  updateAllProgress();
}

// ==================== SISTEMA DE EXÁMENES ====================
const QUIZDATA = {
  historia: [
    {q:'¿En qué año cayó el Imperio Romano de Occidente?', opts:['410 d.C.','476 d.C.','395 d.C.','509 d.C.'], a:1, ex:'En 476 d.C., Rómulo Augústulo fue depuesto por Odoacro, marcando el fin del Imperio Romano de Occidente y el inicio de la Edad Media.'},
    {q:'¿Cuál es considerada la primera civilización de la historia?', opts:['Egipto','China','Sumer (Mesopotamia)','India'], a:2, ex:'Sumer, en Mesopotamia (actual Iraq), es considerada la primera civilización: inventó la escritura cuneiforme, las leyes escritas y las ciudades-estado.'},
    {q:'¿Qué documento firmado en 1215 limitó el poder del rey en Inglaterra?', opts:['La Carta de Derechos','La Magna Carta','El Tratado de Westfalia','La Declaración de Independencia'], a:1, ex:'La Magna Carta (1215) fue firmada por el rey Juan I de Inglaterra y obligaba al monarca a respetar ciertos derechos de sus súbditos, precursor del constitucionalismo.'},
    {q:'¿En qué año comenzó la Primera Guerra Mundial?', opts:['1912','1916','1914','1918'], a:2, ex:'La Primera Guerra Mundial comenzó el 28 de julio de 1914, detonada por el asesinato del Archiduque Francisco Fernando en Sarajevo.'},
    {q:'¿Cuál fue el primer país en otorgar el voto a las mujeres?', opts:['Estados Unidos','Francia','Nueva Zelanda','Reino Unido'], a:2, ex:'Nueva Zelanda fue el primer país autogobernado en reconocer el derecho al voto de las mujeres en 1893.'},
    {q:'¿Qué evento marca el inicio de la Edad Contemporánea?', opts:['La Revolución Industrial','La Revolución Francesa de 1789','La Independencia de EE.UU.','La caída de Constantinopla'], a:1, ex:'Convencionalmente, la Revolución Francesa de 1789 marca el inicio de la Edad Contemporánea, al abolir el Antiguo Régimen e instaurar los principios de libertad, igualdad y fraternidad.'},
    {q:'¿Qué civilización construyó el Coliseo de Roma?', opts:['Griegos','Etruscos','Romanos','Bizantinos'], a:2, ex:'El Coliseo fue construido por el Imperio Romano entre 70 y 80 d.C. bajo los emperadores Vespasiano y Tito.'},
    {q:'¿En qué continente surgió el Homo sapiens?', opts:['Asia','Europa','América','África'], a:3, ex:'El Homo sapiens surgió en África hace aproximadamente 300,000 años. Desde allí migró al resto del mundo.'}
  ],
  economia: [
    {q:'¿Qué es el PIB de un país?', opts:['El dinero en circulación','El valor de todos los bienes y servicios producidos en un año','La deuda total del gobierno','El salario promedio de la población'], a:1, ex:'El PIB (Producto Interno Bruto) mide el valor monetario de todos los bienes y servicios finales producidos en un país durante un período determinado, generalmente un año.'},
    {q:'¿Cuál es la principal función del Banco Central?', opts:['Dar préstamos a empresas privadas','Controlar la inflación y la política monetaria','Recaudar impuestos','Administrar el presupuesto del gobierno'], a:1, ex:'El Banco Central controla la oferta de dinero y la política monetaria para mantener la estabilidad de precios (inflación) y promover el empleo.'},
    {q:'¿Qué estudia la microeconomía?', opts:['El comportamiento de la economía global','Las decisiones de consumidores y empresas individuales','Las políticas fiscales del gobierno','El comercio entre países'], a:1, ex:'La microeconomía estudia el comportamiento de los agentes económicos individuales: consumidores, empresas y mercados específicos.'},
    {q:'¿Qué es la inflación?', opts:['Aumento del desempleo','Aumento general y sostenido de los precios','Reducción del PIB','Exceso de exportaciones'], a:1, ex:'La inflación es el aumento generalizado y sostenido en el nivel de precios de una economía, lo que reduce el poder adquisitivo de la moneda.'},
    {q:'¿Quién escribió "La riqueza de las naciones"?', opts:['Karl Marx','John Maynard Keynes','Adam Smith','Milton Friedman'], a:2, ex:'Adam Smith publicó "La riqueza de las naciones" en 1776, fundando la economía moderna y describiendo la "mano invisible" del mercado libre.'},
    {q:'¿Qué es el interés compuesto?', opts:['Interés calculado solo sobre el capital inicial','Interés calculado sobre el capital más los intereses acumulados','Una tasa de interés fija por ley','El interés de un préstamo hipotecario'], a:1, ex:'El interés compuesto se calcula sobre el capital inicial más los intereses ya generados, lo que produce crecimiento exponencial. Einstein lo llamó "la octava maravilla del mundo".'}
  ],
  matematicas: [
    {q:'¿Cuánto es √144?', opts:['11','12','13','14'], a:1, ex:'La raíz cuadrada de 144 es 12, porque 12 × 12 = 144.'},
    {q:'¿Cuál es el resultado de 2³?', opts:['6','8','9','12'], a:1, ex:'2³ significa 2 × 2 × 2 = 8.'},
    {q:'¿Qué es un número primo?', opts:['Divisible entre 2','Solo divisible entre 1 y sí mismo','Múltiplo de 3','Número par mayor que 10'], a:1, ex:'Un número primo es aquel que solo puede dividirse exactamente entre 1 y él mismo. Ejemplos: 2, 3, 5, 7, 11, 13...'},
    {q:'Si x + 5 = 12, ¿cuánto vale x?', opts:['5','6','7','8'], a:2, ex:'x = 12 - 5 = 7. Se despeja la incógnita restando 5 en ambos lados de la ecuación.'},
    {q:'¿Cuántos grados suman los ángulos interiores de un triángulo?', opts:['90°','180°','270°','360°'], a:1, ex:'La suma de los ángulos interiores de cualquier triángulo es siempre 180°.'},
    {q:'¿Qué representa π (pi) en matemáticas?', opts:['La raíz cuadrada de -1','La relación entre la circunferencia y el diámetro de un círculo','El número de Euler','La pendiente de una recta'], a:1, ex:'π (pi) ≈ 3.14159... es la constante que relaciona la circunferencia de un círculo con su diámetro: C = π × d.'}
  ],
  ciencias: [
    {q:'¿Cuál es el elemento más abundante en el universo?', opts:['Oxígeno','Carbono','Hidrógeno','Helio'], a:2, ex:'El hidrógeno es el elemento más abundante en el universo, constituyendo aproximadamente el 75% de toda la materia ordinaria.'},
    {q:'¿Cuántos cromosomas tiene una célula humana normal?', opts:['23','44','46','48'], a:2, ex:'Las células humanas tienen 46 cromosomas (23 pares). Los gametos (óvulo y espermatozoide) tienen 23 cromosomas cada uno.'},
    {q:'¿Qué gas producen las plantas durante la fotosíntesis?', opts:['Dióxido de carbono','Nitrógeno','Oxígeno','Hidrógeno'], a:2, ex:'Las plantas producen oxígeno durante la fotosíntesis, al convertir dióxido de carbono y agua en glucosa usando la energía solar.'},
    {q:'¿A qué velocidad viaja la luz en el vacío?', opts:['300,000 km/s','150,000 km/s','500,000 km/s','30,000 km/s'], a:0, ex:'La luz viaja a aproximadamente 299,792 km/s en el vacío (≈300,000 km/s). Esta velocidad es una constante fundamental de la física.'},
    {q:'¿Cuál es la fórmula química del agua?', opts:['H₃O','H₂O','HO₂','H₂O₂'], a:1, ex:'El agua es H₂O: dos átomos de hidrógeno y uno de oxígeno unidos por enlaces covalentes.'},
    {q:'¿Quién propuso la teoría de la evolución por selección natural?', opts:['Gregor Mendel','Louis Pasteur','Charles Darwin','Albert Einstein'], a:2, ex:'Charles Darwin publicó "El origen de las especies" en 1859, describiendo la evolución por selección natural como el mecanismo que explica la diversidad de la vida.'}
  ],
  filosofia: [
    {q:'¿Qué filósofo dijo "Solo sé que no sé nada"?', opts:['Platón','Aristóteles','Sócrates','Descartes'], a:2, ex:'Esta frase se atribuye a Sócrates y refleja su método filosófico: reconocer la propia ignorancia como punto de partida para buscar el conocimiento verdadero.'},
    {q:'¿Qué es la ética?', opts:['El estudio del conocimiento','La rama de la filosofía que estudia el bien y la conducta moral','El estudio de la belleza','La lógica formal'], a:1, ex:'La ética es la rama de la filosofía que estudia los principios morales que guían la conducta humana: qué está bien, qué está mal, cómo debemos vivir.'},
    {q:'¿Qué filósofo escribió "El Príncipe"?', opts:['John Locke','Rousseau','Nicolás Maquiavelo','Thomas Hobbes'], a:2, ex:'"El Príncipe" (1513) fue escrito por Nicolás Maquiavelo. En él describe cómo un gobernante debe actuar para mantener el poder, separando la política de la moral.'},
    {q:'¿Qué es el método socrático?', opts:['Memorizar textos filosóficos','Una técnica de debate por preguntas para llegar a la verdad','Un sistema de lógica formal','La filosofía del deber moral'], a:1, ex:'El método socrático consiste en hacer preguntas progresivas para guiar al interlocutor a descubrir la verdad por sí mismo o revelar las contradicciones de su pensamiento.'},
    {q:'¿Cuál es el problema central del libre albedrío?', opts:['Si Dios existe','Si las acciones humanas son libres o determinadas por causas previas','Si el tiempo es lineal','Si la materia existe independientemente'], a:1, ex:'El problema del libre albedrío pregunta si los seres humanos toman decisiones genuinamente libres o si todas las acciones están determinadas por causas previas (genes, entorno, física).'}
  ],
  espanol: [
    {q:'¿Cuál de estas palabras es un sustantivo?', opts:['Correr','Rápido','Ciudad','Azul'], a:2, ex:'"Ciudad" es un sustantivo porque denomina una cosa o entidad. "Correr" es verbo, "rápido" y "azul" son adjetivos.'},
    {q:'¿Qué es un adverbio?', opts:['Palabra que sustituye al sustantivo','Palabra que modifica al verbo, adjetivo u otro adverbio','Palabra que conecta oraciones','Palabra que expresa acción'], a:1, ex:'El adverbio modifica al verbo, a un adjetivo u otro adverbio. Ejemplos: "rápidamente", "muy", "aquí", "siempre".'},
    {q:'¿Cuál de estas palabras lleva tilde (acento escrito)?', opts:['Examen','Lapiz','Mesa','Libro'], a:1, ex:'"Lápiz" lleva tilde porque es una palabra esdrújula (acento en la antepenúltima sílaba: LÁ-piz). Todas las esdrújulas se acentúan.'},
    {q:'¿Qué es una metáfora?', opts:['Una comparación con "como"','Una figura retórica que identifica una cosa con otra sin usar "como"','Una exageración con fines expresivos','Una pregunta sin respuesta esperada'], a:1, ex:'La metáfora identifica directamente dos cosas diferentes: "Sus ojos son estrellas" (no dice "son COMO estrellas"). La comparación usa "como": "Sus ojos son COMO estrellas" — eso es un símil.'},
    {q:'¿Cuál es el plural correcto de "análisis"?', opts:['Análisises','Análisis','Analisises','Anális'], a:1, ex:'"Análisis" es una palabra que no cambia en plural: "el análisis" / "los análisis". Las palabras agudas y esdrújulas terminadas en -s no varían en plural.'}
  ],
  politica: [
    {q:'¿Qué es la democracia representativa?', opts:['El pueblo vota directamente cada ley','Los ciudadanos eligen representantes que toman decisiones por ellos','El gobierno es elegido por los militares','Una monarquía con elecciones'], a:1, ex:'En la democracia representativa, los ciudadanos eligen periódicamente a representantes (diputados, presidente) que legislan y gobiernan en su nombre.'},
    {q:'¿Qué separa los poderes del Estado en una democracia?', opts:['El ejército','La Iglesia','La división de poderes (ejecutivo, legislativo, judicial)','El mercado'], a:2, ex:'La separación de poderes divide al Estado en tres ramas independientes: el ejecutivo (gobierno), el legislativo (parlamento) y el judicial (tribunales), para evitar la concentración del poder.'},
    {q:'¿Cuál es la diferencia entre izquierda y derecha política?', opts:['La izquierda es religiosa y la derecha laica','La izquierda prioriza igualdad social/estado activo; la derecha prioriza libertad individual/mercado','La izquierda es militar y la derecha civil','Son términos sin significado real'], a:1, ex:'Históricamente: la izquierda prioriza la igualdad, la intervención del Estado y los derechos colectivos; la derecha prioriza la libertad individual, el mercado libre y el orden tradicional. Hoy el espectro es más complejo.'},
    {q:'¿Qué es el Estado de Derecho?', opts:['Un país gobernado por militares','Sistema donde todos, incluido el gobierno, están sujetos a la ley','Un tipo de monarquía absoluta','El gobierno más poderoso de la región'], a:1, ex:'El Estado de Derecho significa que ninguna persona ni institución está por encima de la ley. El gobierno actúa según leyes establecidas y los ciudadanos tienen garantías jurídicas.'},
    {q:'¿Cuál fue el primer país en adoptar una constitución escrita moderna?', opts:['Francia','Reino Unido','Estados Unidos','México'], a:2, ex:'Estados Unidos adoptó su Constitución en 1787, la primera constitución escrita y codificada de una nación moderna, aún vigente hoy con enmiendas.'}
  ],
  migraciones: [
    {q:'¿Por qué a los inmigrantes árabes en Honduras se les llama "turcos"?', opts:['Porque venían de Turquía directamente','Porque viajaban con pasaportes del Imperio Otomano','Porque hablaban turco','Por un tratado entre Honduras y Turquía'], a:1, ex:'Los árabes (principalmente libaneses, palestinos y sirios) emigraron cuando sus territorios eran parte del Imperio Otomano (Turquía). Presentaban pasaportes otomanos, por lo que se les llamó "turcos", un apodo que persiste aunque son de origen árabe.'},
    {q:'¿Cuándo colapsó el Imperio Otomano?', opts:['Al final de la Primera Guerra Mundial (1918-1923)','Durante la Segunda Guerra Mundial','En la Revolución Francesa','En 1850'], a:0, ex:'El Imperio Otomano colapsó tras su derrota en la Primera Guerra Mundial. El Tratado de Lausana (1923) reconoció la República de Turquía, poniendo fin formalmente al Imperio.'},
    {q:'¿De cuántos países está compuesto el Medio Oriente moderno?', opts:['Siempre existió igual','Fue dividido principalmente por Francia e Inglaterra con los Acuerdos Sykes-Picot (1916)','Fue dividido por Estados Unidos después de la Segunda Guerra Mundial','Cada país se independizó por su propia revolución'], a:1, ex:'Los Acuerdos Sykes-Picot (1916) fueron un tratado secreto entre Francia e Inglaterra que trazó las fronteras del Medio Oriente moderno sin considerar las etnias o tribus locales, sembrando conflictos que persisten hoy.'},
    {q:'¿Cuál es la religión con más seguidores en el mundo?', opts:['Islam','Hinduismo','Cristianismo','Budismo'], a:2, ex:'El Cristianismo es la religión más extendida con aproximadamente 2,400 millones de seguidores, seguido del Islam con 1,900 millones.'},
    {q:'¿De dónde salieron los primeros humanos modernos (Homo sapiens)?', opts:['De Asia','Del Medio Oriente','De África','De Europa'], a:2, ex:'El Homo sapiens surgió en África hace unos 300,000 años. Las primeras migraciones fuera de África ocurrieron hace 60,000-70,000 años, poblando gradualmente todo el planeta.'}
  ]
};

let quizState = {subj:'historia', idx:0, score:0, answered:false};

function selectQuiz(btn, subj) {
  document.querySelectorAll('.quiz-subj-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  quizState = {subj:subj, idx:0, score:0, answered:false};
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const area = document.getElementById('quiz-area');
  if(!area) return;
  const qs = QUIZDATA[quizState.subj];
  if(!qs) return;
  if(quizState.idx >= qs.length) { renderQuizScore(); return; }
  const q = qs[quizState.idx];
  const pct = Math.round(quizState.idx/qs.length*100);
  let html = '<div class="quiz-prog-bar"><div class="quiz-prog-fill" style="width:'+pct+'%"></div></div>';
  html += '<div class="quiz-q-card">';
  html += '<div class="quiz-q-num">Pregunta '+(quizState.idx+1)+' de '+qs.length+'</div>';
  html += '<div class="quiz-q-text">'+q.q+'</div>';
  html += '<div class="quiz-opts">';
  q.opts.forEach(function(opt, i){
    html += '<button class="quiz-opt" id="qopt-'+i+'" onclick="answerQuiz('+i+')">'+'<span style="font-weight:700;min-width:16px">'+'ABCD'[i]+'.</span> '+opt+'</button>';
  });
  html += '</div><div id="quiz-fb"></div>';
  html += '<div class="quiz-nav"><div></div><button class="quiz-btn primary" id="quiz-next-btn" onclick="nextQuizQ()" style="display:none">Siguiente &rarr;</button></div>';
  html += '</div>';
  area.innerHTML = html;
  quizState.answered = false;
}

function answerQuiz(chosen) {
  if(quizState.answered) return;
  quizState.answered = true;
  const qs = QUIZDATA[quizState.subj];
  const q = qs[quizState.idx];
  const correct = q.a;
  document.querySelectorAll('.quiz-opt').forEach(function(btn,i){
    btn.disabled = true;
    if(i===correct) btn.classList.add('correct');
    else if(i===chosen && chosen!==correct) btn.classList.add('wrong');
  });
  const fb = document.getElementById('quiz-fb');
  if(chosen===correct){
    quizState.score++;
    if(fb) fb.innerHTML='<div class="quiz-feedback ok"><strong>&#10003; Correcto.</strong> '+q.ex+'</div>';
  } else {
    if(fb) fb.innerHTML='<div class="quiz-feedback fail"><strong>&#10007; Incorrecto.</strong> La respuesta correcta es: <strong>'+q.opts[correct]+'</strong>. '+q.ex+'</div>';
  }
  const nb = document.getElementById('quiz-next-btn');
  if(nb) nb.style.display='block';
}

function nextQuizQ() {
  quizState.idx++;
  renderQuizQuestion();
}

function renderQuizScore() {
  const area = document.getElementById('quiz-area');
  const qs = QUIZDATA[quizState.subj];
  const total = qs.length, score = quizState.score;
  const pct = Math.round(score/total*100);
  let msg = pct>=90?'Excelente dominio del tema.':pct>=70?'Muy bien, vas por buen camino.':pct>=50?'Buen intento. Repasa los temas fallados.':'Sigue estudiando, lo lograrás.';
  let html='<div class="quiz-score-card">';
  html += '<div class="quiz-score-num">'+score+'/'+total+'</div>';
  html += '<div class="quiz-score-lbl">Respuestas correctas</div>';
  html += '<div class="quiz-score-msg">'+pct+'% — '+msg+'</div>';
  html += '</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
  html += '<button class="quiz-btn primary" onclick="quizState.idx=0;quizState.score=0;renderQuizQuestion()">&#8635; Repetir examen</button>';
  html += '<button class="quiz-btn sec" onclick="go(\''+quizState.subj+'\')">Ir a estudiar esta materia</button>';
  html += '</div>';
  area.innerHTML = html;
}

// Init everything on load
document.addEventListener('DOMContentLoaded', function(){
  initProgress();
  selectQuiz(document.querySelector('.quiz-subj-btn'), 'historia');
  renderQuizQuestion();
});
