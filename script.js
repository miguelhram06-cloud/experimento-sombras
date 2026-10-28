const Q = [
    ["Una sombra distorsionada bloquea la puerta del laboratorio. Sientes que tu mente intenta unir la figura para darle sentido. ¿Qué ley o enfoque psicológico explica cómo el cerebro organiza los elementos visuales en un 'todo' estructurado?", "Leyes de la Gestalt", "Conductismo Radical", "Psicoanálisis", "Leyes de la Gestalt (¿cómo se organiza el 'todo' visual?)"],
    ["Un timbre suena en el pasillo y tu corazón se dispara de pánico, como si algo terrible fuera a pasar. ¿Qué proceso explica que un estímulo neutro provoque miedo tras asociarse con algo aversivo?", "Condicionamiento Clásico (Pavlov)", "Aprendizaje por Insight", "Condicionamiento Operante", "Condicionamiento Clásico (timbre que genera pánico / Pavlov)"],
    ["Gritas que las sombras 'quieren hacerte daño', pero esos impulsos oscuros son tuyos. ¿Qué mecanismo de defensa es atribuir a otros tus propios impulsos?", "Negación", "Proyección", "Sublimación", "Proyección (atribuir impulsos oscuros a otros)"],
    ["Una voz por el altavoz te ordena presionar un botón que lastima a otra persona. ¿Qué experimento estudió la obediencia a la autoridad y el daño?", "Experimento de Milgram", "Experimento de Asch", "Muñeco Bobo de Bandura", "Experimento de Milgram (obediencia a la autoridad y daño)"],
    ["Algo dentro de ti exige romper la puerta ahora, sin pensar en consecuencias. ¿Qué instancia psíquica freudiana es impulsiva e inconsciente?", "El Superyó", "El Yo (Ego)", "El Ello (Id)", "El Ello (Id) (instancia psíquica impulsiva e inconsciente)"],
    ["Un niño-sombra cree que al verter agua en un vaso más alto hay 'más' agua. ¿Qué etapa de Piaget carece de noción de conservación?", "Etapa Preoperacional", "Operaciones Concretas", "Etapa Sensoriomotora", "Etapa Preoperacional (falta de noción de 'conservación' de Piaget)"],
    ["Una sombra intenta hablarte pero no logra articular palabras, aunque entiende lo que oye. ¿Qué área cerebral se asocia con esa dificultad?", "Área de Wernicke", "Área de Broca", "Hipocampo", "Área de Broca (dificultad para articular palabras)"],
    ["Te falta el aire, sientes palpitaciones y terror intenso sin peligro real. ¿Qué cuadro describe esto?", "Ataque de Pánico", "Episodio Depresivo", "Trastorno Obsesivo-Compulsivo", "Ataque de Pánico (palpitaciones, falta de aire y terror)"],
    ["Una nota en un casillero habla de necesidades fisiológicas, seguridad, afiliación, estima y autorrealización. ¿Quién propuso esta pirámide?", "Carl Rogers", "Abraham Maslow", "B. F. Skinner", "Abraham Maslow (pirámide de necesidades y autorrealización)"],
    ["Hay una bicicleta oxidada en el pasillo. Aunque llevas años sin usarla, tu cuerpo recuerda cómo andar en ella. ¿Qué tipo de memoria es esa?", "Memoria Episódica", "Memoria Procedimental", "Memoria Semántica", "Memoria Procedimental (habilidades motoras como andar en bici)"]
];

const BG_IMAGES = [
    'pasillo.jpg',
    'pasillo1.jpg',
    'pasillo2.jpg',
    'pasillo3.jpg',
    'pasillo4.jpg',
    'pasillo5.jpg',
    'pasillo6.jpg',
    'pasillo7.jpg',
    'pasillo8.jpg',
    'pasillo10.jpg'
];

const $ = id => document.getElementById(id);
const cv = $('c');
const g = cv.getContext('2d');

const bgImg = new Image();

const bgAudio = new Audio('ambiente.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.85;

const errorAudio = new Audio('error.mp3');
errorAudio.volume = 0.9;

let musicStarted = false;
function startContinuousMusic() {
    if (!musicStarted && !muted) {
        bgAudio.play().then(() => {
            musicStarted = true;
        }).catch(() => {});
    }
}

$('ol').innerHTML = Q.map((q, i) => `<li id="n${i}">${q[4]}</li>`).join('');

let qi = 0, t = 0, hp = 100, state = 'walk', walking = false, time = 0, fade = 0;
let shadowScale = 1, shadowOpacity = 1, flashFlicker = false;
let muted = false;
const W = 640, H = 360, cx = W / 2, cy = H / 2 + 10;

function show() {
    const imgPath = BG_IMAGES[qi] || 'pasillo.jpg';
    bgImg.src = imgPath;

    $('n' + qi).className = 'cur';
    $('txt').textContent = qi == 0 ? 'Despiertas solo en los pasillos a oscuras del plantel... Mantén presionado para avanzar.' : 'Sigues avanzando por una nueva zona del pasillo…';
    $('opts').innerHTML = '';
    $('walk').style.display = 'block';
    state = 'walk';
    t = 0;
    fade = 0;
    shadowScale = 1;
    shadowOpacity = 1;
}

function ask() {
    state = 'ask';
    walking = false;
    $('walk').style.display = 'none';
    const q = Q[qi];
    $('txt').textContent = q[0];
    const o = [q[1], q[2], q[3]].map((x, i) => ({ x, c: i == 0 }));
    for (let i = 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [o[i], o[j]] = [o[j], o[i]];
    }
    $('opts').innerHTML = '';
    o.forEach((a, i) => {
        const b = document.createElement('button');
        b.textContent = 'ABC'[i] + ') ' + a.x;
        b.onclick = () => answer(b, a.c);
        b.dataset.c = a.c;
        $('opts').appendChild(b);
    });
}

function answer(b, ok) {
    if (state != 'ask') return;
    state = 'fb';
    [...$('opts').children].forEach(x => {
        x.disabled = true;
        if (x.dataset.c == 'true') x.classList.add('ok');
    });

    if (ok) {
        $('n' + qi).className = 'done';
        $('txt').textContent = '✔ Correcto. La sombra pierde fuerza y se disuelve en la penumbra…';
        state = 'dissolve';
        setTimeout(next, 2200);
    } else {
        if (!muted) {
            errorAudio.currentTime = 0;
            errorAudio.play().catch(() => {});
        }

        b.classList.add('bad');
        hp = Math.max(0, hp - 12);
        upd();
        
        $('frame').classList.remove('shake');
        void $('frame').offsetWidth;
        $('frame').classList.add('shake');
        
        $('flash').style.opacity = .8;
        flashFlicker = true; 
        state = 'attack';   

        setTimeout(() => {
            $('flash').style.opacity = 0;
            flashFlicker = false;
        }, 600);

        $('txt').textContent = '✘ Incorrecto. ¡La entidad se abalanza sobre ti! La respuesta era: ' + Q[qi][1];
        setTimeout(next, 2600);
    }
}

function upd() {
    $('hpn').textContent = hp;
    $('hpb').style.width = hp + '%';
    if (hp >= 70) $('hpb').style.background = '#3c9';
    else if (hp >= 40) $('hpb').style.background = '#d6b84a';
    else $('hpb').style.background = '#c4161c';
}

function next() {
    qi++;
    if (hp <= 0 || qi >= Q.length) return finish();
    show();
}

function finish() {
    state = 'end';
    let T, P;
    if (hp >= 70) {
        T = 'FINAL BUENO';
        P = 'Tu mente se mantuvo firme. La puerta del laboratorio se abre y la luz del amanecer te recibe: logras escapar del plantel. Salud mental final: ' + hp + '%.';
    } else if (hp >= 40) {
        T = 'FINAL NEUTRO';
        P = 'Sales tambaleándote, pero algo de ti se queda en el pasillo. Escapas, aunque las sombras te seguirán en sueños. Salud mental final: ' + hp + '%.';
    } else {
        T = 'FINAL MALO';
        P = 'Las sombras ya tienen tu forma. La puerta se cierra detrás de ti y el experimento continúa… ahora tú eres parte de él. Salud mental final: ' + hp + '%.';
    }
    $('et').textContent = T;
    $('et').style.color = hp >= 70 ? '#7fd' : hp >= 40 ? '#d6b84a' : '#c4161c';
    $('ep').textContent = P;
    $('end').style.display = 'flex';
}

const w = $('walk');
w.addEventListener('pointerdown', e => { 
    e.preventDefault();
    startContinuousMusic(); 
    walking = true; 
});
w.addEventListener('pointerup', () => walking = false);
w.addEventListener('pointerleave', () => walking = false);
w.addEventListener('touchstart', e => e.preventDefault(), {passive: false});

addEventListener('keydown', e => {
    startContinuousMusic();
    if (['ArrowRight', 'ArrowUp', 'd', 'w'].includes(e.key)) walking = true;
    if (state == 'ask' && '123abc'.includes(e.key.toLowerCase())) {
        const i = 'abc'.indexOf(e.key.toLowerCase());
        const k = i >= 0 ? i : +e.key - 1;
        $('opts').children[k]?.click();
    }
});

addEventListener('keyup', e => {
    if (['ArrowRight', 'ArrowUp', 'd', 'w'].includes(e.key)) walking = false;
});

$('mute').onclick = () => { 
    muted = !muted; 
    bgAudio.muted = muted;
    errorAudio.muted = muted;
    $('mute').textContent = muted ? '🔇' : '🔊'; 
};

function draw() {
    g.fillStyle = '#050607'; 
    g.fillRect(0, 0, W, H);

    if (state == 'attack') {
        shadowScale += 0.08;
    } else if (state == 'dissolve') {
        shadowOpacity = Math.max(0, shadowOpacity - 0.03);
    }

    if (bgImg.complete && bgImg.naturalWidth !== 0) {
        const zoom = (1 + (t * 0.25)) * (state == 'attack' ? shadowScale : 1); 
        const wZoom = W * zoom;
        const hZoom = H * zoom;
        const xOffset = (W - wZoom) / 2;
        const yOffset = (H - hZoom) / 2 + (Math.sin(time * 8) * (state == 'walk' && walking ? 3 : 0)); 

        g.save();
        if (state == 'dissolve') g.globalAlpha = shadowOpacity;
        g.drawImage(bgImg, xOffset, yOffset, wZoom, hZoom);
        g.restore();
    }

    const fg = g.createRadialGradient(cx, cy, 10, cx, cy, 320);
    fg.addColorStop(0, 'rgba(100,110,120,0.12)');
    fg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = fg; 
    g.fillRect(0, 0, W, H);

    let flickerAlpha = 0.82;
    let lightRadius = 350;

    if (flashFlicker) {
        flickerAlpha = 0.99;
    } else if (state == 'walk' && walking) {
        if (Math.random() < 0.35) { 
            flickerAlpha = 0.94 + Math.random() * 0.05; 
            lightRadius = 260 + Math.random() * 80;     
        }
    } else if (Math.random() < 0.05) {
        flickerAlpha = 0.90; 
    }

    const fl = g.createRadialGradient(cx, cy, 20, cx, cy, lightRadius);
    fl.addColorStop(0, 'rgba(0,0,0,0)');
    fl.addColorStop(0.4, `rgba(0,0,0,${flickerAlpha * 0.5})`);
    fl.addColorStop(1, `rgba(0,0,0,${flickerAlpha})`);
    g.fillStyle = fl; 
    g.fillRect(0, 0, W, H);

    g.fillStyle = '#111'; g.save();
    g.translate(520, H - 30 + Math.sin(time * 6) * (state == 'walk' && walking ? 5 : 0));
    g.rotate(-.3); g.fillRect(-60, -14, 90, 28);
    g.fillStyle = '#d8d8c8'; g.fillRect(24, -18, 12, 36); g.restore();

    for (let i = 0; i < 90; i++) {
        g.fillStyle = `rgba(255,255,255,${Math.random() * .08})`;
        g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
}

let last = 0;
function loop(ts) {
    const dt = Math.min(.05, (ts - last) / 1000);
    last = ts;
    time += dt;

    if (state == 'walk' && walking) {
        t += dt * 0.35;
        if (t >= 1) { 
            t = 1; 
            ask(); 
        }
    }

    draw();
    requestAnimationFrame(loop);
}

show();
requestAnimationFrame(loop);
