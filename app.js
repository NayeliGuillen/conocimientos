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
    {q:'¿En qué continente surgió el Homo sapiens?', opts:['Asia','Europa','América','África'], a:3, ex:'El Homo sapiens surgió en África hace aproximadamente 300,000 años. Desde allí migró al resto del mundo.'},
    {q:'¿Quién conquistó el Imperio Azteca en 1521?', opts:['Francisco Pizarro','Hernán Cortés','Diego de Almagro','Vasco de Gama'], a:1, ex:'Hernán Cortés, con unos 600 soldados españoles y miles de aliados indígenas, conquistó Tenochtitlan en 1521, poniendo fin al Imperio Azteca y fundando la Nueva España.'},
    {q:'¿En qué año terminó la Segunda Guerra Mundial?', opts:['1943','1944','1945','1946'], a:2, ex:'La Segunda Guerra Mundial terminó en 1945: Alemania se rindió el 8 de mayo (V-E Day) y Japón el 2 de septiembre, tras las bombas atómicas en Hiroshima y Nagasaki.'},
    {q:'¿Qué imperio fue el más extenso de la historia?', opts:['Imperio Romano','Imperio Mongol','Imperio Británico','Imperio Español'], a:2, ex:'El Imperio Británico fue el más extenso de la historia, llegando a cubrir el 24% de la superficie terrestre y gobernar sobre el 23% de la población mundial a principios del siglo XX.'},
    {q:'¿Qué fue la Revolución Industrial?', opts:['Una guerra entre industrias','El paso de la producción manual a la mecanizada, iniciado en Inglaterra','Una revolución política en Francia','El descubrimiento del petróleo'], a:1, ex:'La Revolución Industrial (1760-1840) fue el proceso de transformación económica que sustituyó el trabajo manual por máquinas de vapor, iniciado en Inglaterra y extendido al mundo entero.'},
    {q:'¿Quién fue Alejandro Magno?', opts:['Un emperador romano','Un rey macedonio que conquistó desde Grecia hasta India','Un faraón egipcio','Un rey persa'], a:1, ex:'Alejandro Magno (356-323 a.C.) fue rey de Macedonia y uno de los mayores conquistadores de la historia. Extendió el helenismo desde Grecia hasta el noroeste de India en solo 13 años.'},
    {q:'¿En qué año llegó Cristóbal Colón a América?', opts:['1488','1490','1492','1500'], a:2, ex:'Cristóbal Colón llegó a las Américas el 12 de octubre de 1492, cuando desembarcó en una isla del Caribe (posiblemente Guanahaní), creyendo haber llegado a Asia.'},
    {q:'¿Qué fue la Guerra Fría?', opts:['Una guerra entre EE.UU. y Rusia con armas convencionales','La tensión geopolítica entre EE.UU. y la URSS sin combate directo (1947-1991)','Una guerra en el Ártico','Un conflicto entre China y Europa'], a:1, ex:'La Guerra Fría fue la rivalidad ideológica, política y militar entre Estados Unidos (capitalismo) y la Unión Soviética (comunismo) entre 1947 y 1991, sin enfrentamiento militar directo entre ellos.'},
    {q:'¿Qué evento desencadenó la caída del Muro de Berlín en 1989?', opts:['Una guerra','Una revolución armada','La apertura de la frontera por presión ciudadana y el colapso soviético','Un terremoto'], a:2, ex:'La caída del Muro de Berlín el 9 de noviembre de 1989 fue resultado del colapso del bloque soviético, las protestas masivas en Alemania Oriental y el anuncio inesperado de apertura de la frontera.'},
    {q:'¿Cuál fue la consecuencia principal de la Revolución Francesa?', opts:['La creación del Imperio Británico','El fin de la monarquía absoluta en Francia y la proclamación de los derechos del ciudadano','La unificación de Alemania','La independencia de América Latina'], a:1, ex:'La Revolución Francesa (1789-1799) acabó con la monarquía absoluta, instauró los principios de libertad, igualdad y fraternidad, y produjo la Declaración de los Derechos del Hombre y del Ciudadano.'}
  ],
  economia: [
    {q:'¿Qué es el PIB de un país?', opts:['El dinero en circulación','El valor de todos los bienes y servicios producidos en un año','La deuda total del gobierno','El salario promedio de la población'], a:1, ex:'El PIB (Producto Interno Bruto) mide el valor monetario de todos los bienes y servicios finales producidos en un país durante un período determinado, generalmente un año.'},
    {q:'¿Cuál es la principal función del Banco Central?', opts:['Dar préstamos a empresas privadas','Controlar la inflación y la política monetaria','Recaudar impuestos','Administrar el presupuesto del gobierno'], a:1, ex:'El Banco Central controla la oferta de dinero y la política monetaria para mantener la estabilidad de precios (inflación) y promover el empleo.'},
    {q:'¿Qué estudia la microeconomía?', opts:['El comportamiento de la economía global','Las decisiones de consumidores y empresas individuales','Las políticas fiscales del gobierno','El comercio entre países'], a:1, ex:'La microeconomía estudia el comportamiento de los agentes económicos individuales: consumidores, empresas y mercados específicos.'},
    {q:'¿Qué es la inflación?', opts:['Aumento del desempleo','Aumento general y sostenido de los precios','Reducción del PIB','Exceso de exportaciones'], a:1, ex:'La inflación es el aumento generalizado y sostenido en el nivel de precios de una economía, lo que reduce el poder adquisitivo de la moneda.'},
    {q:'¿Quién escribió "La riqueza de las naciones"?', opts:['Karl Marx','John Maynard Keynes','Adam Smith','Milton Friedman'], a:2, ex:'Adam Smith publicó "La riqueza de las naciones" en 1776, fundando la economía moderna y describiendo la "mano invisible" del mercado libre.'},
    {q:'¿Qué es el interés compuesto?', opts:['Interés calculado solo sobre el capital inicial','Interés calculado sobre el capital más los intereses acumulados','Una tasa de interés fija por ley','El interés de un préstamo hipotecario'], a:1, ex:'El interés compuesto se calcula sobre el capital inicial más los intereses ya generados, lo que produce crecimiento exponencial. Einstein lo llamó "la octava maravilla del mundo".'},
    {q:'¿Qué es la oferta y la demanda?', opts:['Solo aplica al mercado de valores','La oferta es lo disponible para vender; la demanda es lo que los compradores desean; juntos determinan el precio','Un sistema de control de precios gubernamental','La cantidad de dinero en circulación'], a:1, ex:'La ley de oferta y demanda explica cómo los precios se determinan: si la demanda sube y la oferta es fija, el precio sube; si la oferta sube y la demanda es fija, el precio baja.'},
    {q:'¿Qué es la deflación?', opts:['Aumento acelerado de precios','Caída generalizada y sostenida de los precios','Una política de ahorro del gobierno','El aumento del desempleo'], a:1, ex:'La deflación es la caída generalizada de los precios. Aunque suena positiva, es peligrosa: provoca que los consumidores posterguen compras esperando precios menores, paralizando la economía.'},
    {q:'¿Qué son los impuestos progresivos?', opts:['Impuestos iguales para todos','Impuestos donde quien más gana, mayor porcentaje paga','Impuestos que se reducen con el tiempo','Impuestos sobre importaciones'], a:1, ex:'Los impuestos progresivos aplican tasas más altas a ingresos mayores. El principio es que quien más tiene, más puede contribuir. La mayoría de los sistemas de impuesto sobre la renta son progresivos.'},
    {q:'¿Qué es el desempleo estructural?', opts:['Desempleo temporal por estaciones del año','Desempleo causado por cambios en la estructura económica que hacen obsoletas ciertas habilidades','Desempleo voluntario','Desempleo por crisis económica temporal'], a:1, ex:'El desempleo estructural ocurre cuando las habilidades de los trabajadores no coinciden con las demandas del mercado. Por ejemplo, obreros de fábricas cerradas por la automatización.'},
    {q:'¿Qué diferencia al capitalismo del socialismo?', opts:['El capitalismo tiene gobierno; el socialismo no','En el capitalismo los medios de producción son privados; en el socialismo son del Estado o colectivos','El capitalismo es moderno; el socialismo es antiguo','Son lo mismo con diferente nombre'], a:1, ex:'En el capitalismo, los medios de producción (fábricas, tierras) son propiedad privada y el mercado regula la economía. En el socialismo, el Estado o la comunidad poseen esos medios y planifican la economía.'},
    {q:'¿Qué es la deuda pública?', opts:['Las deudas de los ciudadanos con los bancos','El total de dinero que el gobierno debe a acreedores nacionales e internacionales','El déficit comercial del país','Las deudas de empresas privadas'], a:1, ex:'La deuda pública es el total de obligaciones financieras que tiene un gobierno. Se acumula cuando el Estado gasta más de lo que recauda (déficit fiscal) y debe pedir prestado para cubrir la diferencia.'},
    {q:'¿Qué es el libre comercio?', opts:['Comercio sin dinero (trueque)','Intercambio internacional sin aranceles ni restricciones entre países','Comercio regulado completamente por el Estado','Solo el comercio dentro de un país'], a:1, ex:'El libre comercio es la política que elimina barreras (aranceles, cuotas) al intercambio de bienes y servicios entre países. Sus defensores argumentan que genera eficiencia y prosperidad; sus críticos, que perjudica industrias locales.'},
    {q:'¿Qué es la macroeconomía?', opts:['El estudio de empresas individuales','El estudio de la economía de un país o región en su conjunto','El estudio de los precios de los productos','El estudio del mercado de valores'], a:1, ex:'La macroeconomía estudia la economía a gran escala: el PIB, la inflación, el desempleo, el comercio exterior y las políticas monetarias y fiscales que afectan a toda una nación.'},
    {q:'¿Qué es una recesión económica?', opts:['Un período de crecimiento acelerado','Dos trimestres consecutivos de caída del PIB','El cierre de bancos nacionales','Un aumento del desempleo superior al 20%'], a:1, ex:'Se considera recesión cuando el PIB de un país cae durante dos trimestres consecutivos. Se caracteriza por reducción de la actividad económica, aumento del desempleo y caída del consumo.'},
    {q:'¿Qué son las divisas?', opts:['Las deudas de un país','Las monedas extranjeras utilizadas en el comercio internacional','Los bonos del gobierno','Las acciones bursátiles'], a:1, ex:'Las divisas son las monedas de otros países. El tipo de cambio indica cuántas unidades de una divisa se necesitan para comprar otra. El dólar, el euro y el yen son las divisas más usadas en el comercio mundial.'}
  ],
  matematicas: [
    {q:'¿Cuánto es √144?', opts:['11','12','13','14'], a:1, ex:'La raíz cuadrada de 144 es 12, porque 12 × 12 = 144.'},
    {q:'¿Cuál es el resultado de 2³?', opts:['6','8','9','12'], a:1, ex:'2³ significa 2 × 2 × 2 = 8.'},
    {q:'¿Qué es un número primo?', opts:['Divisible entre 2','Solo divisible entre 1 y sí mismo','Múltiplo de 3','Número par mayor que 10'], a:1, ex:'Un número primo es aquel que solo puede dividirse exactamente entre 1 y él mismo. Ejemplos: 2, 3, 5, 7, 11, 13...'},
    {q:'Si x + 5 = 12, ¿cuánto vale x?', opts:['5','6','7','8'], a:2, ex:'x = 12 - 5 = 7. Se despeja la incógnita restando 5 en ambos lados de la ecuación.'},
    {q:'¿Cuántos grados suman los ángulos interiores de un triángulo?', opts:['90°','180°','270°','360°'], a:1, ex:'La suma de los ángulos interiores de cualquier triángulo es siempre 180°.'},
    {q:'¿Qué representa π (pi) en matemáticas?', opts:['La raíz cuadrada de -1','La relación entre la circunferencia y el diámetro de un círculo','El número de Euler','La pendiente de una recta'], a:1, ex:'π (pi) ≈ 3.14159... es la constante que relaciona la circunferencia de un círculo con su diámetro: C = π × d.'},
    {q:'¿Cuánto es el 30% de 200?', opts:['40','50','60','70'], a:2, ex:'Para calcular el 30% de 200: 200 × 0.30 = 60. O bien: 200 ÷ 100 × 30 = 60.'},
    {q:'¿Qué es el mínimo común múltiplo (MCM)?', opts:['El número más pequeño que es múltiplo de dos o más números','El número que divide exactamente a dos números','La suma de dos números','El cociente de dos números'], a:0, ex:'El MCM de dos números es el menor número positivo que es múltiplo de ambos. Por ejemplo, el MCM de 4 y 6 es 12, porque 12 es el menor número divisible entre 4 y entre 6.'},
    {q:'Si un triángulo tiene base 8 cm y altura 5 cm, ¿cuál es su área?', opts:['40 cm²','20 cm²','13 cm²','80 cm²'], a:1, ex:'Área del triángulo = (base × altura) ÷ 2 = (8 × 5) ÷ 2 = 40 ÷ 2 = 20 cm².'},
    {q:'¿Qué es una ecuación de segundo grado?', opts:['Una ecuación con dos incógnitas','Una ecuación donde la variable tiene exponente 2 (ax² + bx + c = 0)','Una ecuación con dos soluciones siempre','Una ecuación que solo tiene números negativos'], a:1, ex:'Una ecuación cuadrática tiene la forma ax² + bx + c = 0, donde a ≠ 0. Puede tener dos soluciones, una o ninguna solución real. Se resuelve con la fórmula general o factorizando.'},
    {q:'¿Cuál es el resultado de (-3) × (-4)?', opts:['-12','-7','7','12'], a:3, ex:'Negativo por negativo da positivo: (-3) × (-4) = +12. Regla de signos: cuando los dos factores tienen el mismo signo, el producto es positivo.'},
    {q:'¿Qué es la media aritmética?', opts:['El valor que más se repite','El valor central de un conjunto ordenado','La suma de todos los valores dividida entre la cantidad de valores','La diferencia entre el mayor y el menor valor'], a:2, ex:'La media aritmética (promedio) = suma de todos los valores ÷ cantidad de valores. Si tienes 3, 7 y 8, la media es (3+7+8) ÷ 3 = 18 ÷ 3 = 6.'},
    {q:'¿Cuántos lados tiene un hexágono?', opts:['5','6','7','8'], a:1, ex:'Un hexágono tiene 6 lados. Los prefijos griegos ayudan: tri=3, cuadri=4, penta=5, hexa=6, hepta=7, octa=8.'},
    {q:'¿Qué es el teorema de Pitágoras?', opts:['a + b = c','a² + b² = c²','a × b = c','a² - b² = c'], a:1, ex:'El teorema de Pitágoras establece que en un triángulo rectángulo, el cuadrado de la hipotenusa (c) es igual a la suma de los cuadrados de los catetos (a y b): a² + b² = c².'},
    {q:'¿Cuál es la probabilidad de sacar cara al lanzar una moneda?', opts:['25%','50%','75%','100%'], a:1, ex:'Una moneda tiene dos caras iguales. La probabilidad de obtener cara es 1 (caso favorable) ÷ 2 (total de casos posibles) = 0.5 = 50%.'},
    {q:'¿Qué es un número negativo?', opts:['Un número sin valor','Un número menor que cero','Un número impar','Un número no divisible entre 2'], a:1, ex:'Los números negativos son menores que cero y se escriben con el signo menos. Representan cantidades como deudas, temperaturas bajo cero o altitudes bajo el nivel del mar. Ej: -5, -100, -0.3.'}
  ],
  ciencias: [
    {q:'¿Cuál es el elemento más abundante en el universo?', opts:['Oxígeno','Carbono','Hidrógeno','Helio'], a:2, ex:'El hidrógeno es el elemento más abundante en el universo, constituyendo aproximadamente el 75% de toda la materia ordinaria.'},
    {q:'¿Cuántos cromosomas tiene una célula humana normal?', opts:['23','44','46','48'], a:2, ex:'Las células humanas tienen 46 cromosomas (23 pares). Los gametos (óvulo y espermatozoide) tienen 23 cromosomas cada uno.'},
    {q:'¿Qué gas producen las plantas durante la fotosíntesis?', opts:['Dióxido de carbono','Nitrógeno','Oxígeno','Hidrógeno'], a:2, ex:'Las plantas producen oxígeno durante la fotosíntesis, al convertir dióxido de carbono y agua en glucosa usando la energía solar.'},
    {q:'¿A qué velocidad viaja la luz en el vacío?', opts:['300,000 km/s','150,000 km/s','500,000 km/s','30,000 km/s'], a:0, ex:'La luz viaja a aproximadamente 299,792 km/s en el vacío (≈300,000 km/s). Esta velocidad es una constante fundamental de la física.'},
    {q:'¿Cuál es la fórmula química del agua?', opts:['H₃O','H₂O','HO₂','H₂O₂'], a:1, ex:'El agua es H₂O: dos átomos de hidrógeno y uno de oxígeno unidos por enlaces covalentes.'},
    {q:'¿Quién propuso la teoría de la evolución por selección natural?', opts:['Gregor Mendel','Louis Pasteur','Charles Darwin','Albert Einstein'], a:2, ex:'Charles Darwin publicó "El origen de las especies" en 1859, describiendo la evolución por selección natural como el mecanismo que explica la diversidad de la vida.'},
    {q:'¿Qué es el ADN?', opts:['Una proteína que da energía','La molécula que contiene la información genética de los seres vivos','Una vitamina esencial','Un tipo de grasa corporal'], a:1, ex:'El ADN (ácido desoxirribonucleico) es la molécula que almacena la información genética. Se encuentra en el núcleo de las células y contiene las instrucciones para construir y hacer funcionar un organismo.'},
    {q:'¿Cuántos planetas tiene nuestro sistema solar?', opts:['7','8','9','10'], a:1, ex:'Desde 2006, el sistema solar tiene 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón fue reclasificado como planeta enano.'},
    {q:'¿Qué es la gravedad?', opts:['Una fuerza eléctrica','La fuerza de atracción que ejercen los cuerpos con masa entre sí','Una forma de energía lumínica','La resistencia del aire al movimiento'], a:1, ex:'La gravedad es la fuerza de atracción que existe entre todos los objetos con masa. Isaac Newton la describió matemáticamente, y Albert Einstein la explicó como curvatura del espacio-tiempo.'},
    {q:'¿Cuántos elementos hay en la tabla periódica (hasta 2024)?', opts:['92','108','118','130'], a:2, ex:'La tabla periódica tiene 118 elementos confirmados. Los elementos del 1 al 92 son naturales; los del 93 al 118 son sintéticos, creados en laboratorio mediante reacciones nucleares.'},
    {q:'¿Qué es una célula eucariota?', opts:['Una célula sin núcleo definido','Una célula con núcleo definido y organelos membranosos','Una célula sin pared celular','Una célula solo de plantas'], a:1, ex:'Las células eucariotas tienen núcleo definido con membrana nuclear y organelos como mitocondrias y retículo endoplásmico. Forman los organismos animales, vegetales, hongos y protistas.'},
    {q:'¿Cuál es la ley de Newton que dice "a toda acción le corresponde una reacción igual y opuesta"?', opts:['Primera ley (inercia)','Segunda ley (F=ma)','Tercera ley (acción-reacción)','Ley de gravitación universal'], a:2, ex:'La Tercera Ley de Newton establece que cuando un cuerpo ejerce una fuerza sobre otro, el segundo ejerce una fuerza igual en magnitud pero opuesta en dirección sobre el primero.'},
    {q:'¿Qué es la mitosis?', opts:['Reproducción sexual de organismos','División celular que produce dos células idénticas a la original','Fusión de dos células','Muerte programada de una célula'], a:1, ex:'La mitosis es el proceso de división celular por el cual una célula madre produce dos células hijas con el mismo número de cromosomas (46 en humanos). Es la base del crecimiento y la regeneración de tejidos.'},
    {q:'¿Qué es la energía cinética?', opts:['Energía almacenada en un objeto por su posición','Energía que tiene un objeto por estar en movimiento','Energía química almacenada en alimentos','Energía producida por el calor solar'], a:1, ex:'La energía cinética es la energía que posee un cuerpo debido a su movimiento. Se calcula con la fórmula Ec = ½mv², donde m es la masa y v es la velocidad.'},
    {q:'¿Qué órgano bombea la sangre en el cuerpo humano?', opts:['Los pulmones','El hígado','El cerebro','El corazón'], a:3, ex:'El corazón es el órgano muscular que bombea sangre a todo el cuerpo. Latiendo unas 70 veces por minuto en reposo, bombea unos 5 litros de sangre por minuto, y aproximadamente 200 millones de litros en toda una vida.'},
    {q:'¿Qué es un ecosistema?', opts:['Solo el conjunto de animales de una zona','El conjunto de seres vivos y su entorno físico que interactúan entre sí','Solo la flora de una región','El clima de una zona geográfica'], a:1, ex:'Un ecosistema es el conjunto de seres vivos (plantas, animales, microorganismos) que habitan en un área determinada y las relaciones que establecen entre sí y con su entorno físico (agua, suelo, clima).'}
  ],
  filosofia: [
    {q:'¿Qué filósofo dijo "Solo sé que no sé nada"?', opts:['Platón','Aristóteles','Sócrates','Descartes'], a:2, ex:'Esta frase se atribuye a Sócrates y refleja su método filosófico: reconocer la propia ignorancia como punto de partida para buscar el conocimiento verdadero.'},
    {q:'¿Qué es la ética?', opts:['El estudio del conocimiento','La rama de la filosofía que estudia el bien y la conducta moral','El estudio de la belleza','La lógica formal'], a:1, ex:'La ética es la rama de la filosofía que estudia los principios morales que guían la conducta humana: qué está bien, qué está mal, cómo debemos vivir.'},
    {q:'¿Qué filósofo escribió "El Príncipe"?', opts:['John Locke','Rousseau','Nicolás Maquiavelo','Thomas Hobbes'], a:2, ex:'"El Príncipe" (1513) fue escrito por Nicolás Maquiavelo. En él describe cómo un gobernante debe actuar para mantener el poder, separando la política de la moral.'},
    {q:'¿Qué es el método socrático?', opts:['Memorizar textos filosóficos','Una técnica de debate por preguntas para llegar a la verdad','Un sistema de lógica formal','La filosofía del deber moral'], a:1, ex:'El método socrático consiste en hacer preguntas progresivas para guiar al interlocutor a descubrir la verdad por sí mismo o revelar las contradicciones de su pensamiento.'},
    {q:'¿Cuál es el problema central del libre albedrío?', opts:['Si Dios existe','Si las acciones humanas son libres o determinadas por causas previas','Si el tiempo es lineal','Si la materia existe independientemente'], a:1, ex:'El problema del libre albedrío pregunta si los seres humanos toman decisiones genuinamente libres o si todas las acciones están determinadas por causas previas (genes, entorno, física).'},
    {q:'¿Qué es la metafísica?', opts:['El estudio de los metales','La rama que estudia la naturaleza de la realidad, la existencia y el ser','El estudio de la mente humana','La lógica matemática'], a:1, ex:'La metafísica es la rama filosófica que estudia las preguntas más fundamentales: ¿qué existe?, ¿qué es la realidad?, ¿existe Dios?, ¿qué es el tiempo? Va más allá de lo que la ciencia puede responder.'},
    {q:'¿Cuál fue el aporte principal de Platón a la filosofía?', opts:['El empirismo: solo el conocimiento sensorial es válido','La teoría de las Ideas: existe un mundo perfecto de formas eternas','El pragmatismo: solo importa lo útil','El nihilismo: nada tiene sentido'], a:1, ex:'Platón propuso la Teoría de las Ideas (o Formas): los objetos del mundo sensible son copias imperfectas de realidades perfectas e inmutables en un mundo inteligible. Su alegoría de la caverna ilustra esta distinción.'},
    {q:'¿Qué es el existencialismo?', opts:['La creencia de que Dios determina nuestro destino','La filosofía que afirma que la existencia precede a la esencia y que el ser humano se define por sus actos','La creencia en la perfección de la naturaleza humana','Una corriente que niega la existencia del yo'], a:1, ex:'El existencialismo (Sartre, Camus, Kierkegaard) sostiene que primero existimos y luego nos definimos mediante nuestras elecciones. "La existencia precede a la esencia": no hay una naturaleza humana fija; nos construimos a nosotros mismos.'},
    {q:'¿Qué planteó René Descartes con "Pienso, luego existo"?', opts:['Que el pensamiento es una ilusión','Que la única certeza indudable es que si pienso, existo','Que el cuerpo y la mente son lo mismo','Que Dios nos da la capacidad de pensar'], a:1, ex:'Descartes buscaba una verdad indudable usando la duda metódica. Llegó a la conclusión de que aunque podía dudar de todo, no podía dudar de que estaba dudando y, por tanto, pensando. "Cogito ergo sum" fue su certeza fundamental.'},
    {q:'¿Qué es la epistemología?', opts:['El estudio de las costumbres','La rama filosófica que estudia el conocimiento, sus límites y su validez','El estudio de los valores estéticos','La filosofía del lenguaje'], a:1, ex:'La epistemología (o teoría del conocimiento) estudia qué es el conocimiento, cómo lo adquirimos, cuáles son sus límites y cómo diferenciamos el conocimiento verdadero de la opinión o la creencia.'},
    {q:'¿Qué propuso Immanuel Kant como imperativo categórico?', opts:['Actúa siempre buscando tu propio beneficio','Actúa solo según la máxima que puedas querer que sea ley universal','Obedece siempre a la autoridad','Busca el mayor placer posible'], a:1, ex:'El imperativo categórico de Kant dice: "Actúa solo según aquella máxima que puedas, al mismo tiempo, querer que sea una ley universal." Es una prueba para evaluar si una acción es moralmente correcta.'},
    {q:'¿Qué es el utilitarismo?', opts:['La creencia de que lo útil es siempre lo más bello','La teoría ética que juzga las acciones por sus consecuencias: lo bueno es lo que produce la mayor felicidad para el mayor número','La filosofía que solo valora la utilidad del trabajo','Una corriente nihilista'], a:1, ex:'El utilitarismo (Bentham, Mill) sostiene que una acción es moralmente correcta si produce el mayor bienestar para el mayor número de personas. Juzga las acciones por sus consecuencias, no por las intenciones.'},
    {q:'¿Qué es la dialéctica de Hegel?', opts:['Un método de debate en la antigua Grecia','El proceso de desarrollo del pensamiento: tesis → antítesis → síntesis','Una forma de democracia directa','La lógica matemática aplicada a la filosofía'], a:1, ex:'Hegel propone que el pensamiento y la historia avanzan mediante contradicciones: una idea (tesis) genera su opuesto (antítesis), y el conflicto entre ambas produce una idea superior (síntesis), que a su vez se convierte en nueva tesis.'},
    {q:'¿Qué defendía Friedrich Nietzsche con el concepto del "superhombre" (Übermensch)?', opts:['La superioridad racial','Un ser humano que supera los valores tradicionales y crea sus propios valores','Un dictador benevolente','Un científico que domina la naturaleza'], a:1, ex:'El "superhombre" de Nietzsche es el individuo que supera la moral convencional y los valores heredados ("Dios ha muerto") para crear sus propios valores con creatividad y voluntad de poder. No es un concepto racial, sino filosófico.'},
    {q:'¿Qué es la estética como rama de la filosofía?', opts:['El estudio de los cosméticos y la belleza física','La rama que estudia la naturaleza de la belleza, el arte y la experiencia estética','El estudio de los sentidos físicos','La filosofía del lenguaje artístico'], a:1, ex:'La estética es la rama filosófica que estudia la naturaleza de la belleza, el arte y la experiencia artística. Pregunta: ¿qué es lo bello?, ¿existe la belleza objetiva?, ¿qué distingue el arte del no-arte?'}
  ],
  espanol: [
    {q:'¿Cuál de estas palabras es un sustantivo?', opts:['Correr','Rápido','Ciudad','Azul'], a:2, ex:'"Ciudad" es un sustantivo porque denomina una cosa o entidad. "Correr" es verbo, "rápido" y "azul" son adjetivos.'},
    {q:'¿Qué es un adverbio?', opts:['Palabra que sustituye al sustantivo','Palabra que modifica al verbo, adjetivo u otro adverbio','Palabra que conecta oraciones','Palabra que expresa acción'], a:1, ex:'El adverbio modifica al verbo, a un adjetivo u otro adverbio. Ejemplos: "rápidamente", "muy", "aquí", "siempre".'},
    {q:'¿Cuál de estas palabras lleva tilde (acento escrito)?', opts:['Examen','Lapiz','Mesa','Libro'], a:1, ex:'"Lápiz" lleva tilde porque es una palabra esdrújula (acento en la antepenúltima sílaba: LÁ-piz). Todas las esdrújulas se acentúan.'},
    {q:'¿Qué es una metáfora?', opts:['Una comparación con "como"','Una figura retórica que identifica una cosa con otra sin usar "como"','Una exageración con fines expresivos','Una pregunta sin respuesta esperada'], a:1, ex:'La metáfora identifica directamente dos cosas diferentes: "Sus ojos son estrellas" (no dice "son COMO estrellas"). La comparación usa "como": "Sus ojos son COMO estrellas" — eso es un símil.'},
    {q:'¿Cuál es el plural correcto de "análisis"?', opts:['Análisises','Análisis','Analisises','Anális'], a:1, ex:'"Análisis" es una palabra que no cambia en plural: "el análisis" / "los análisis". Las palabras agudas y esdrújulas terminadas en -s no varían en plural.'},
    {q:'¿Qué tipo de palabra es "pero" en la oración "Quiero ir, pero no puedo"?', opts:['Adverbio','Sustantivo','Conjunción adversativa','Preposición'], a:2, ex:'"Pero" es una conjunción adversativa: une dos oraciones expresando oposición o contraste. Otras conjunciones adversativas: "sin embargo", "aunque", "no obstante".'},
    {q:'¿Cuándo se usa la coma antes de "que"?', opts:['Siempre','Nunca','Cuando "que" introduce una oración subordinada explicativa','Solo en preguntas'], a:2, ex:'Se coloca coma antes de "que" en oraciones explicativas (entre comas): "Mi hermano, que vive en Madrid, llega mañana." En las especificativas no se usa coma: "El libro que leí era interesante."'},
    {q:'¿Qué es un oxímoron?', opts:['Una figura que repite sonidos','Una figura que combina dos términos contradictorios','Una exageración extrema','Una palabra de doble sentido'], a:1, ex:'El oxímoron combina dos palabras con significados contrarios para crear un efecto expresivo. Ejemplos: "silencio ensordecedor", "luz oscura", "dulce amargura". Es diferente a la paradoja, que contradice la lógica.'},
    {q:'¿Qué es el gerundio?', opts:['Una forma verbal que indica acción terminada','Una forma verbal que indica acción en progreso (-ando, -iendo)','Un tipo de sustantivo verbal','Un adjetivo derivado del verbo'], a:1, ex:'El gerundio es una forma no personal del verbo que expresa acción en curso. Se forma añadiendo -ando (verbos -ar) o -iendo (verbos -er/-ir): "corriendo", "comiendo", "escribiendo".'},
    {q:'¿Qué es la sinonimia?', opts:['El uso de palabras opuestas','La relación entre palabras con significado igual o muy similar','El significado literal de una palabra','El estudio del origen de las palabras'], a:1, ex:'La sinonimia es la relación entre palabras con el mismo o similar significado. Sinónimos de "rápido": veloz, ligero, ágil. Los sinónimos perfectos son raros; suelen haber matices de diferencia.'},
    {q:'¿Cuál de estas oraciones tiene un error ortográfico?', opts:['"El niño fue al parque"','"Voy a ver a mi amigo"','"Haber si puedes venir"','"El libro está sobre la mesa"'], a:2, ex:'"Haber si puedes" es incorrecto. Lo correcto es "A ver si puedes". "Haber" es el verbo auxiliar (haber comido) o existencial (hay gente). "A ver" significa "esperar a ver" y se escribe separado.'},
    {q:'¿Qué es la hipérbole?', opts:['Una comparación directa','Una figura retórica que exagera desproporcionadamente para dar énfasis','Una pregunta sin respuesta','Una descripción muy detallada'], a:1, ex:'La hipérbole es una exageración deliberada con fines expresivos o humorísticos. Ejemplos: "Te lo he dicho mil veces", "Tengo un hambre que me muero", "Es más alto que un edificio".'},
    {q:'¿Qué es el sujeto en una oración?', opts:['La acción que realiza alguien','La persona, animal o cosa de quien se dice algo','El complemento del verbo','La parte que modifica al verbo'], a:1, ex:'El sujeto es quien realiza o padece la acción del verbo, o de quien se dice algo. En "María lee el libro", "María" es el sujeto. Para encontrarlo, preguntamos al verbo: ¿Quién lee? → María.'},
    {q:'¿Cuándo llevan tilde las palabras agudas?', opts:['Siempre','Nunca','Cuando terminan en vocal, -n o -s','Solo cuando terminan en consonante'], a:2, ex:'Las palabras agudas (acento en la última sílaba) llevan tilde cuando terminan en vocal, -n o -s. Ejemplos: "café", "canción", "compás". Sin tilde: "reloj", "ciudad", "papel".'},
    {q:'¿Qué es la voz pasiva?', opts:['Cuando el sujeto realiza la acción','Cuando el sujeto recibe la acción del verbo','Cuando no hay sujeto explícito','Cuando el verbo está en infinitivo'], a:1, ex:'En la voz pasiva el sujeto recibe la acción en lugar de realizarla. "El libro fue escrito por García Márquez" (pasiva) vs. "García Márquez escribió el libro" (activa). Se forma con "ser" + participio.'},
    {q:'¿Qué diferencia hay entre "haya" y "halla"?', opts:['"Haya" es del verbo hallar; "halla" del verbo haber','"Haya" es del verbo haber (subjuntivo); "halla" es del verbo hallar (encontrar)','Son la misma palabra con ortografía alternativa','Solo se diferencian en el registro formal'], a:1, ex:'"Haya" viene del verbo haber (subjuntivo): "Espero que haya llegado." "Halla" viene del verbo hallar (encontrar): "Ella halla la solución." Es un error frecuente por la ausencia de distinción fonética en el español de América.'}
  ],
  politica: [
    {q:'¿Qué es la democracia representativa?', opts:['El pueblo vota directamente cada ley','Los ciudadanos eligen representantes que toman decisiones por ellos','El gobierno es elegido por los militares','Una monarquía con elecciones'], a:1, ex:'En la democracia representativa, los ciudadanos eligen periódicamente a representantes (diputados, presidente) que legislan y gobiernan en su nombre.'},
    {q:'¿Qué separa los poderes del Estado en una democracia?', opts:['El ejército','La Iglesia','La división de poderes (ejecutivo, legislativo, judicial)','El mercado'], a:2, ex:'La separación de poderes divide al Estado en tres ramas independientes: el ejecutivo (gobierno), el legislativo (parlamento) y el judicial (tribunales), para evitar la concentración del poder.'},
    {q:'¿Cuál es la diferencia entre izquierda y derecha política?', opts:['La izquierda es religiosa y la derecha laica','La izquierda prioriza igualdad social/estado activo; la derecha prioriza libertad individual/mercado','La izquierda es militar y la derecha civil','Son términos sin significado real'], a:1, ex:'Históricamente: la izquierda prioriza la igualdad, la intervención del Estado y los derechos colectivos; la derecha prioriza la libertad individual, el mercado libre y el orden tradicional. Hoy el espectro es más complejo.'},
    {q:'¿Qué es el Estado de Derecho?', opts:['Un país gobernado por militares','Sistema donde todos, incluido el gobierno, están sujetos a la ley','Un tipo de monarquía absoluta','El gobierno más poderoso de la región'], a:1, ex:'El Estado de Derecho significa que ninguna persona ni institución está por encima de la ley. El gobierno actúa según leyes establecidas y los ciudadanos tienen garantías jurídicas.'},
    {q:'¿Cuál fue el primer país en adoptar una constitución escrita moderna?', opts:['Francia','Reino Unido','Estados Unidos','México'], a:2, ex:'Estados Unidos adoptó su Constitución en 1787, la primera constitución escrita y codificada de una nación moderna, aún vigente hoy con enmiendas.'},
    {q:'¿Qué es el populismo?', opts:['Una democracia perfecta','Un estilo político que apela directamente al pueblo enfrentándolo contra una élite corrupta','Una forma de socialismo radical','Una monarquía disfrazada'], a:1, ex:'El populismo es un estilo político que divide a la sociedad entre "el pueblo puro" y una "élite corrupta", y que afirma encarnar directamente la voluntad popular. Puede ser de izquierda o de derecha y está asociado a líderes carismáticos.'},
    {q:'¿Qué es la soberanía nacional?', opts:['El poder del ejército sobre el gobierno','El poder supremo que tiene un Estado para gobernarse sin interferencias externas','El control de otro país sobre el territorio','La independencia del banco central'], a:1, ex:'La soberanía es el poder supremo de un Estado para legislar, gobernarse y aplicar sus leyes en su propio territorio sin someterse a ninguna autoridad externa. Es uno de los principios fundamentales del derecho internacional.'},
    {q:'¿Qué es un golpe de Estado?', opts:['Una elección muy competida','La toma del poder por medios inconstitucionales, generalmente por militares o grupos dentro del gobierno','El cambio pacífico de gobierno','Una revolución popular'], a:1, ex:'Un golpe de Estado es la toma del poder político de forma repentina e ilegal por parte de militares, facciones del gobierno u otros grupos, sin seguir los procedimientos constitucionales establecidos.'},
    {q:'¿Qué es el federalismo?', opts:['Un gobierno centralizado absoluto','Un sistema donde el poder se divide entre un gobierno central y gobiernos regionales o estatales','Solo aplica a los Estados Unidos','Un sistema de gobierno militar'], a:1, ex:'El federalismo distribuye el poder entre un gobierno central (federal) y unidades territoriales autónomas (estados, provincias). EE.UU., México y Brasil son federaciones. Contrasta con el unitarismo, donde el poder central domina.'},
    {q:'¿Qué son los derechos humanos?', opts:['Privilegios otorgados por el gobierno','Derechos inherentes a toda persona por su condición humana, independientemente de su nacionalidad o gobierno','Solo los derechos civiles de los ciudadanos','Los derechos de los trabajadores en un contrato'], a:1, ex:'Los derechos humanos son derechos universales, inalienables e inherentes a toda persona. Están recogidos en la Declaración Universal de Derechos Humanos de la ONU (1948) e incluyen la vida, la libertad y la dignidad.'},
    {q:'¿Qué es la corrupción política?', opts:['Una política económica fallida','El abuso del poder público para obtener beneficios privados ilegítimos','Una forma de protesta política','El desacuerdo entre partidos'], a:1, ex:'La corrupción política ocurre cuando funcionarios públicos abusan de su posición para obtener beneficios personales (sobornos, malversación, nepotismo). Debilita las instituciones, aumenta la desigualdad y erosiona la confianza ciudadana.'},
    {q:'¿Qué es la ONU?', opts:['Una organización de países americanos','La Organización de las Naciones Unidas, foro mundial para la paz, seguridad y cooperación internacional','Un tratado económico europeo','Una alianza militar occidental'], a:1, ex:'La ONU (Organización de las Naciones Unidas) fue fundada en 1945 tras la Segunda Guerra Mundial con el objetivo de mantener la paz y seguridad internacional, promover los derechos humanos y el desarrollo sostenible. Tiene 193 países miembros.'},
    {q:'¿Qué es la diplomacia?', opts:['El uso de la fuerza militar para resolver conflictos','La gestión de las relaciones entre países mediante negociación, diálogo y acuerdos','La política económica internacional','El espionaje entre naciones'], a:1, ex:'La diplomacia es el arte y la práctica de gestionar las relaciones internacionales mediante la negociación. Los diplomáticos representan a su país en el exterior y trabajan para resolver conflictos, firmar tratados y promover los intereses nacionales.'},
    {q:'¿Qué es la opinión pública?', opts:['La opinión de los medios de comunicación','El conjunto de actitudes y posiciones que la ciudadanía tiene sobre temas políticos y sociales','La decisión de un tribunal','La posición oficial del gobierno'], a:1, ex:'La opinión pública es el conjunto de percepciones, actitudes y preferencias que tiene la población sobre asuntos públicos. Influye en los políticos y es medida por encuestas. Los medios de comunicación y las redes sociales la moldean significativamente.'},
    {q:'¿Qué es el autoritarismo?', opts:['Una democracia sin elecciones','Sistema de gobierno donde el poder se concentra en un líder o grupo sin control democrático real','Un sistema parlamentario muy estricto','Una dictadura siempre militar'], a:1, ex:'El autoritarismo es un sistema político en el que el poder está concentrado en un líder o grupo que lo ejerce sin controles democráticos efectivos, restringiendo libertades civiles, la oposición y la libertad de prensa.'},
    {q:'¿En qué se diferencia una república de una monarquía?', opts:['En una república hay un rey electo; en una monarquía no','En una república el jefe de Estado es un cargo electivo o representativo; en una monarquía es hereditario','Son términos sinónimos','La monarquía es siempre más democrática'], a:1, ex:'En una república, el jefe de Estado (generalmente presidente) es elegido o designado, no hereditario. En una monarquía, el cargo pasa por línea sucesoria familiar. Puede existir monarquías constitucionales muy democráticas (Reino Unido) y repúblicas autoritarias.'}
  ],
  migraciones: [
    {q:'¿Por qué a los inmigrantes árabes en Honduras se les llama "turcos"?', opts:['Porque venían de Turquía directamente','Porque viajaban con pasaportes del Imperio Otomano','Porque hablaban turco','Por un tratado entre Honduras y Turquía'], a:1, ex:'Los árabes (principalmente libaneses, palestinos y sirios) emigraron cuando sus territorios eran parte del Imperio Otomano (Turquía). Presentaban pasaportes otomanos, por lo que se les llamó "turcos", un apodo que persiste aunque son de origen árabe.'},
    {q:'¿Cuándo colapsó el Imperio Otomano?', opts:['Al final de la Primera Guerra Mundial (1918-1923)','Durante la Segunda Guerra Mundial','En la Revolución Francesa','En 1850'], a:0, ex:'El Imperio Otomano colapsó tras su derrota en la Primera Guerra Mundial. El Tratado de Lausana (1923) reconoció la República de Turquía, poniendo fin formalmente al Imperio.'},
    {q:'¿Cómo se conformó el Medio Oriente moderno?', opts:['Siempre existió igual','Fue dividido principalmente por Francia e Inglaterra con los Acuerdos Sykes-Picot (1916)','Fue dividido por EE.UU. después de la Segunda Guerra Mundial','Cada país se independizó por su propia revolución'], a:1, ex:'Los Acuerdos Sykes-Picot (1916) fueron un tratado secreto entre Francia e Inglaterra que trazó las fronteras del Medio Oriente moderno sin considerar las etnias o tribus locales, sembrando conflictos que persisten hoy.'},
    {q:'¿Cuál es la religión con más seguidores en el mundo?', opts:['Islam','Hinduismo','Cristianismo','Budismo'], a:2, ex:'El Cristianismo es la religión más extendida con aproximadamente 2,400 millones de seguidores, seguido del Islam con 1,900 millones.'},
    {q:'¿De dónde salieron los primeros humanos modernos (Homo sapiens)?', opts:['De Asia','Del Medio Oriente','De África','De Europa'], a:2, ex:'El Homo sapiens surgió en África hace unos 300,000 años. Las primeras migraciones fuera de África ocurrieron hace 60,000-70,000 años, poblando gradualmente todo el planeta.'},
    {q:'¿Qué fue el Holocausto?', opts:['Una guerra entre países europeos','El genocidio de 6 millones de judíos y otros grupos por el régimen nazi (1933-1945)','Una epidemia en Europa durante la Segunda Guerra Mundial','Un campo de trabajo en Siberia'], a:1, ex:'El Holocausto fue el genocidio sistemático perpetrado por la Alemania nazi: 6 millones de judíos y millones más de romaníes, discapacitados, homosexuales y opositores políticos fueron asesinados en campos de exterminio.'},
    {q:'¿Cuáles fueron las principales causas de la migración europea a América entre 1880-1930?', opts:['Turismo y aventura','Pobreza, guerras, persecución religiosa y búsqueda de oportunidades económicas','Obligación por tratados internacionales','Programas de intercambio cultural'], a:1, ex:'Entre 1880 y 1930, más de 30 millones de europeos emigraron a América. Las causas fueron la pobreza rural, guerras, persecución (judíos en Rusia, por ejemplo), la Revolución Industrial que desplazó trabajadores y la promesa de tierras y prosperidad en el "Nuevo Mundo".'},
    {q:'¿Qué es la diáspora?', opts:['Un tipo de visa de trabajo','La dispersión de un pueblo fuera de su territorio de origen, manteniendo su identidad cultural','Una ruta migratoria específica','Un tratado de refugiados'], a:1, ex:'La diáspora es la dispersión de una comunidad o pueblo fuera de su territorio original. El término viene del griego ("dispersión"). La diáspora judía (2,000 años), africana (esclavitud) y libanesa son algunos ejemplos notables.'},
    {q:'¿Qué es el Islam?', opts:['Una secta del judaísmo','Una religión monoteísta fundada por el profeta Mahoma en el siglo VII en Arabia','Una corriente filosófica árabe','Una religión politeísta del Oriente Medio'], a:1, ex:'El Islam es una religión monoteísta fundada por Mahoma en el siglo VII d.C. en la Península Arábiga. Sus seguidores son los musulmanes. El libro sagrado es el Corán. Es la segunda religión más extendida del mundo con unos 1,900 millones de fieles.'},
    {q:'¿Qué son los refugiados?', opts:['Personas que emigran por razones económicas','Personas que huyen de su país por persecución, guerra o catástrofe y no pueden regresar con seguridad','Trabajadores temporales en otro país','Estudiantes universitarios en el extranjero'], a:1, ex:'Los refugiados son personas que han huido de su país por fundados temores de persecución (por raza, religión, nacionalidad, opinión política o pertenencia a un grupo social) o por conflictos y no pueden regresar de forma segura. Su estatus está protegido por la Convención de Ginebra de 1951.'},
    {q:'¿Cuándo y por qué emigraron masivamente los judíos a Israel?', opts:['Solo después de la Segunda Guerra Mundial y el Holocausto','Desde el siglo XIX (sionismo) y masivamente tras el Holocausto y la fundación del Estado de Israel en 1948','Solo en tiempos medievales','Por razones únicamente religiosas desde el siglo XV'], a:1, ex:'La migración judía a Palestina comenzó con el movimiento sionista en el siglo XIX. Se intensificó tras el Holocausto. En 1948 se fundó el Estado de Israel, lo que provocó la llegada masiva de judíos de todo el mundo y el desplazamiento de la población árabe palestina.'},
    {q:'¿Qué fue la Ruta de la Seda?', opts:['Solo una ruta comercial de China a Europa','Una red de rutas terrestres y marítimas que conectaban Asia, Medio Oriente, África y Europa, facilitando el comercio y el intercambio cultural','Un ferrocarril antiguo de la India','Un tratado de libre comercio medieval'], a:1, ex:'La Ruta de la Seda fue una red de rutas comerciales que conectó China con el Mediterráneo desde el siglo II a.C. hasta el siglo XV d.C. Por ella circularon no solo la seda sino especias, ideas, religiones (budismo, islam) y enfermedades (como la peste negra).'},
    {q:'¿Por qué millones de centroamericanos emigran a Estados Unidos?', opts:['Por el clima','Por violencia, pobreza extrema, corrupción, falta de oportunidades y los efectos del cambio climático','Solo por razones familiares','Por un programa migratorio oficial'], a:1, ex:'La emigración centroamericana a EE.UU. tiene múltiples causas: violencia de pandillas (maras), pobreza estructural, corrupción gubernamental, falta de empleo, desastres naturales agravados por el cambio climático, y redes familiares ya establecidas en EE.UU.'},
    {q:'¿Qué es la xenofobia?', opts:['El miedo a los espacios cerrados','El rechazo, odio o discriminación hacia personas de otro país o cultura','El estudio de culturas extranjeras','Un tipo de política migratoria'], a:1, ex:'La xenofobia es el miedo, rechazo u hostilidad hacia personas extranjeras o de culturas diferentes. Puede manifestarse en discriminación, violencia o políticas restrictivas de migración. Es considerada una violación de los derechos humanos.'},
    {q:'¿Cuándo llegaron los primeros humanos a América?', opts:['Hace 500 años, con Colón','Hace 3,000-5,000 años','Hace 15,000-25,000 años, por el estrecho de Bering','Hace 50,000 años desde África directamente'], a:2, ex:'Los primeros humanos llegaron a América hace aproximadamente 15,000-25,000 años (algunos estudios sugieren hasta 30,000 años) cruzando el estrecho de Bering desde Siberia, cuando el nivel del mar era más bajo. Gradualmente poblaron todo el continente.'}
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
  if(typeof lucide !== 'undefined') lucide.createIcons();
  initProgress();
  selectQuiz(document.querySelector('.quiz-subj-btn'), 'historia');
  renderQuizQuestion();
});
