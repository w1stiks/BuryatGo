/* BuryatGo — логика приложения: навигация, уроки, магазин, профиль, лиги, настройки, paywall */
(function () {
  'use strict';
  const D = window.BG_DATA, S = window.BG_STORE, A = window.BG_AUDIO, M = window.BG_MASCOT;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const st = () => S.state;
  const NAME_MAX = 10;
  if (S.state && S.state.name && Array.from(S.state.name).length > NAME_MAX) { S.state.name = Array.from(S.state.name).slice(0, NAME_MAX).join('').trim(); S.save(); }

  /* ───────────────── Утилиты ───────────────── */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function shuffle(a, rnd) { rnd = rnd || Math.random; a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  const sample = (a, n) => shuffle(a).slice(0, n);
  const uniq = a => Array.from(new Set(a));
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  function plural(n, f) { const a = Math.abs(n) % 100, b = a % 10; if (a > 10 && a < 20) return f[2]; if (b > 1 && b < 5) return f[1]; if (b === 1) return f[0]; return f[2]; }
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  function humanDate(k) { const d = S.parseDay(k); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  const norm = s => String(s).toLowerCase().replace(/ё/g, 'е').replace(/[.,!?;:«»"—–-]/g, '').replace(/\s+/g, ' ').trim();
  const BZ_IMG = '<img class=bz-img src=assets/images/buuza.png alt=Бууза draggable=false>';
  const GER_SVG = window.BG_ART.yurtSvg('ger-svg');
  const STEPPE_SVG = window.BG_ART.steppe();

  /* Огонёк (анимированное пламя) — замена свечи в окне серии */
  function flameSvg(on, size) {
    size = size || 92;
    return `<svg class="flame ${on ? 'on' : 'off'}" width="${size}" height="${Math.round(size * 1.2)}" viewBox="0 0 100 120" role="img" aria-label="Огонёк">
      <defs><radialGradient id="flG" cx="50%" cy="72%" r="62%"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".45" stop-color="#FFC21A"/><stop offset="1" stop-color="#FF5A00"/></radialGradient></defs>
      <ellipse class="fl-glow" cx="50" cy="110" rx="30" ry="6" fill="rgba(255,110,0,.28)"/>
      <g class="fl-body"><path class="fl-outer" d="M50 6 C62 30 86 44 84 74 C82 98 66 110 50 110 C34 110 18 98 16 74 C15 56 26 46 32 34 C34 48 40 54 46 56 C44 36 42 22 50 6 Z" fill="url(#flG)"/>
      <path class="fl-inner" d="M50 50 C58 64 68 72 66 88 C64 100 57 104 50 104 C43 104 36 100 34 88 C33 78 40 72 44 64 C46 72 49 74 52 74 C50 66 48 58 50 50 Z" fill="#FFF6C8"/></g></svg>`;
  }
  /* Флаг и герб Республики Бурятия (стилизованные SVG) */
  let flagUid = 0;
  function flagSvg(cls) {
    const k = 'rbf' + (++flagUid);
    const w1 = 'M7 5C22 1 34 9 50 5S66 2 70 4V34C62 32 56 37 46 36S22 30 7 35Z';
    const w2 = 'M7 4C20 7 34 1 50 5S64 8 70 5V35C60 38 54 32 44 34S20 38 7 34Z';
    const anim = `<animate attributeName="d" values="${w1};${w2};${w1}" dur="3.6s" repeatCount="indefinite"/>`;
    return `<svg class="rb-flag ${cls || ''}" viewBox="0 0 72 40" role="img" aria-label="Флаг Республики Бурятия">
      <defs><clipPath id="${k}c"><path d="${w1}">${anim}</path></clipPath>
        <linearGradient id="${k}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".25" stop-color="#fff" stop-opacity=".3"/><stop offset=".45" stop-color="#000" stop-opacity=".12"/><stop offset=".7" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".14"/>
          <animateTransform attributeName="gradientTransform" type="translate" values="-.25 0;.25 0;-.25 0" dur="3.6s" repeatCount="indefinite"/></linearGradient>
        <linearGradient id="${k}p" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE28A"/><stop offset=".5" stop-color="#E0A800"/><stop offset="1" stop-color="#9C7300"/></linearGradient></defs>
      <rect x="2" y="3" width="3.2" height="37" rx="1.6" fill="url(#${k}p)"/><circle cx="3.6" cy="2.9" r="2.6" fill="#F2B705" stroke="#B88A00" stroke-width=".6"/>
      <g clip-path="url(#${k}c)">${window.BG_MASCOT.flagRect(4, 1, 76)}<rect x="4" y="0" width="68" height="40" fill="url(#${k}g)"/></g>
      <path d="${w1}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width=".7">${anim}</path></svg>`;
  }
  function flagPoleSvg() {
    return `<svg class="flag-pole" viewBox="0 0 52 84" aria-hidden="true"><path d="M4 6 V84" stroke="#8B5A2B" stroke-width="3.5" stroke-linecap="round"/><circle cx="4" cy="5" r="3.5" fill="#F2B705"/><g class="wave">${window.BG_MASCOT.flagRect(6, 7, 44)}</g></svg>`;
  }
  function gerbSvg(cls) {
    const M_ = window.BG_MASCOT;
    return `<svg class="rb-gerb ${cls || ''}" viewBox="0 0 100 112" role="img" aria-label="Герб Бурятии">
      <path d="M34 88 Q26 102 30 112 L40 104 L44 92 Z M66 88 Q74 102 70 112 L60 104 L56 92 Z" fill="#74C0FC" stroke="#fff" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="47" fill="#74C0FC" stroke="#F2B705" stroke-width="3"/>
      <circle cx="50" cy="50" r="41" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="6 4"/>
      <clipPath id="gerbClip"><circle cx="50" cy="50" r="36"/></clipPath>
      <g clip-path="url(#gerbClip)"><rect x="0" y="0" width="100" height="100" fill="#0F5BB5"/>
        <path d="M10 74 L28 56 L40 66 L54 50 L68 62 L80 54 L92 66 V100 H10 Z" fill="#2F9E44"/>
        <path d="M54 50 L59 55 L54 54 L49 56 Z M28 56 L32 60 L24 60 Z" fill="#fff"/>
        <rect x="0" y="74" width="100" height="30" fill="#1E6BC6"/>
        <path d="M12 80 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 M12 87 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0" stroke="#fff" stroke-opacity=".7" stroke-width="1.8" fill="none"/></g>
      ${M_.soyombo(39, 16, 1.1)}
      <circle cx="50" cy="50" r="36" fill="none" stroke="#F2B705" stroke-width="2.5"/></svg>`;
  }
  /* Фон сцены магазина: облака у солнца и горы за персонажем */
  const CLOUD = '<svg viewBox="0 0 120 50" aria-hidden="true"><path d="M18 44 Q2 44 4 32 Q6 22 20 24 Q22 8 42 10 Q54 0 68 10 Q84 4 90 20 Q110 18 114 32 Q116 44 100 44 Z" fill="#fff"/><path d="M24 36 q8 -6 16 0 M58 32 q8 -7 16 0" stroke="#CFE0F7" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
  const STAGE_SKY = `<div class="clouds" aria-hidden="true"><div class="cloud c1">${CLOUD}</div><div class="cloud c2">${CLOUD}</div><div class="cloud c3">${CLOUD}</div></div>`;
  const horseState = () => { const s = st(); if (!s.horses || !Array.isArray(s.horses.owned)) s.horses = { owned: [], main: null, freeUsed: false }; if (s.horses.owned.length && !s.horses.freeUsed) s.horses.freeUsed = true; return s.horses; };
  const petsState = () => { const s = st(); if (!s.pets || typeof s.pets.sheep !== 'number' || !isFinite(s.pets.sheep)) s.pets = { sheep: 10, starter: true }; if (!s.pets.starter) { s.pets.starter = true; s.pets.sheep = Math.max(10, s.pets.sheep); S.save(); } s.pets.sheep = Math.max(0, Math.min(D.sheepMax || 13, Math.floor(s.pets.sheep))); return s.pets; };
  const BZI = '<img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>';
  const DEV_PASS = '2014';
  const stageHorses = () => {
    const hs = horseState();
    if (!S.isPremium()) { const lh = hs.lucky && D.horses.find(h => h.id === hs.lucky); return lh ? [lh] : []; }
    const ids = hs.owned.filter(id => id !== hs.main).concat(hs.owned.indexOf(hs.main) >= 0 ? [hs.main] : []);
    if (hs.lucky && ids.indexOf(hs.lucky) < 0 && ids.length < 3) ids.unshift(hs.lucky);
    return ids.map(id => D.horses.find(h => h.id === id)).filter(Boolean);
  };
  /* v1.8.3: дошёл ли игрок до n-го модуля (все уроки предыдущих модулей пройдены) */
  const reachedUnit = (n) => D.units.slice(0, Math.max(0, n - 1)).every(u => u.lessons.every(l => ((st().lessons || {})[l.id] || {}).done));
  const stageScene = (compact) => `<div class="scene" aria-hidden="true">${window.BG_ART.scene({ compact: !!compact, horses: stageHorses(), sheep: petsState().sheep })}</div>`;

  if (D.words && D.words.buuza) D.words.buuza.emoji = BZ_IMG;
  D.units.forEach(u => { if (u.icon === '\u{1F95F}' || u.icon === '🥟') u.icon = BZ_IMG; });
  const audioOf = w => (w && w.audio ? 'audio/' + w.audio : null);
  const leagueAcc = n => n.replace(/ая$/, 'ую');
  const leaguePrep = n => n.replace(/ая$/, 'ой');

  /* ───────────────── Нативный мост Android ───────────────── */
  function bridge(fn) {
    const args = Array.prototype.slice.call(arguments, 1);
    try { if (window.AndroidBridge && typeof window.AndroidBridge[fn] === 'function') return window.AndroidBridge[fn].apply(window.AndroidBridge, args); } catch (e) { console.warn('bridge', fn, e); }
    return undefined;
  }
  const native = bridge('isNative') === true;
  /* iOS-сборка (Capacitor): плагины доступны через window.Capacitor.Plugins */
  const capPlugin = name => (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins) ? window.Capacitor.Plugins[name] : null;

  /* ───────────────── Звук, вибрация, озвучка ───────────────── */
  const SFX_GROUP = { click: 'sfxClick', pop: 'sfxClick', correct: 'sfxCorrect', complete: 'sfxCorrect', coin: 'sfxCorrect', streak: 'sfxCorrect', wrong: 'sfxWrong' };
  function sfx(n) { if (st().settings[SFX_GROUP[n]] !== false) A.play(n); }
  function haptic(kind) {
    if (!st().settings.haptics) return;
    if (native) { bridge('haptic', kind); return; }
    const hp = capPlugin('Haptics');
    if (hp) {
      try { if (kind === 'error' || kind === 'success') hp.notification({ type: kind === 'error' ? 'ERROR' : 'SUCCESS' }); else hp.impact({ style: 'LIGHT' }); } catch (e) {}
      return;
    }
    if (navigator.vibrate) { try { navigator.vibrate(kind === 'error' ? [30, 40, 30] : kind === 'success' ? [15, 30, 25] : 8); } catch (e) {} }
  }
  /* Текст на экране не меняется; синтезатор получает фонетическую запись («Баяртай» → «Баяртэ»). */
  const PRON_RULES = Object.keys(D.pron || {}).map(k => ({
    re: new RegExp('(^|[^а-яёөүһ])(' + k + ')(?=$|[^а-яёөүһ])', 'giu'),
    to: D.pron[k]
  }));
  function pronounce(text) {
    let t = String(text == null ? '' : text);
    PRON_RULES.forEach(r => {
      t = t.replace(r.re, (m, pre, w) => pre + (w[0] !== w[0].toLowerCase() ? r.to[0].toUpperCase() + r.to.slice(1) : r.to));
    });
    return t;
  }
  function speak(text, slow, audio) {
    if (!st().settings.tts) return;
    const cfg = st().settings;
    const base = cfg.ttsRate === 0.85 ? 0.92 : (cfg.ttsRate || 0.92);
    A.speak(pronounce(text), base * (slow ? 0.75 : 1), audio, cfg.voice || '');
  }

  /* ───────────────── Тосты, конфетти, модалки ───────────────── */
  let toastTimer = null;
  function toast(msg, ms) {
    const t = $('#toast');
    t.innerHTML = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), ms || 2200);
  }

  let confettiRun = 0;
  function confetti() {
    const c = $('#confetti');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    const x = c.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF', '#FF9600'];
    const P = [];
    for (let i = 0; i < 110; i++) P.push({ x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 4,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length] });
    const id = ++confettiRun, t0 = performance.now();
    function frame(t) {
      if (id !== confettiRun) return;
      const el = t - t0;
      x.clearRect(0, 0, W, H);
      P.forEach(p => {
        p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - el / 2600);
        x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore();
      });
      if (el < 2600) requestAnimationFrame(frame); else x.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
  }

  let modalOpts = null;
  function openModal(html, opts) {
    opts = opts || {};
    modalOpts = opts;
    const o = $('#overlay');
    o.className = 'overlay show' + (opts.full ? ' full' : '');
    o.innerHTML = (opts.full ? '' : '<div class="backdrop"></div>') + '<div class="modal' + (opts.center ? ' center' : '') + '">' + html + '</div>';
    const bd = $('.backdrop', o);
    if (bd) bd.addEventListener('click', () => { if (!(modalOpts && modalOpts.locked)) closeModal(); });
    return $('.modal', o);
  }
  function closeModal() {
    const o = $('#overlay');
    o.className = 'overlay'; o.innerHTML = '';
    const cb = modalOpts && modalOpts.onClose;
    modalOpts = null;
    if (cb) cb();
  }
  const modalOpen = () => $('#overlay').classList.contains('show');

  function confirmBox(o) {
    const m = openModal(`<div class="big-emo">${o.emoji || '🤔'}</div><h2>${o.title}</h2><p>${o.text || ''}</p>
      <div class="stack"><button class="btn ${o.okClass || ''}" data-ok>${o.ok || 'Да'}</button>
      <button class="btn ghost dark" data-cancel>${o.cancel || 'Отмена'}</button></div>`, { center: true });
    $('[data-ok]', m).onclick = () => { closeModal(); if (o.onOk) o.onOk(); };
    $('[data-cancel]', m).onclick = () => { closeModal(); if (o.onCancel) o.onCancel(); };
  }

  function bump(id) { const e = document.getElementById(id); if (e) { e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); } }
  const mini = () => M.svg(st().equip, { cls: 'static' });

  /* ───────────────── Навигация ───────────────── */
  const ui = { tab: 'home', view: 'home', shopSlot: 'hat', lesson: null, lbTimer: null, onbStep: 0, onbName: '', onbGoal: 20 };

  function setChrome(top, tabs) {
    $('#topbar').classList.toggle('hidden', !top);
    $('#tabbar').classList.toggle('hidden', !tabs);
    $('#screen').classList.toggle('full', !tabs);
  }
  function go(view) {
    ui.view = view;
    if (['home', 'shop', 'profile', 'leagues'].indexOf(view) >= 0) ui.tab = view;
    render();
  }
  function render() {
    if (ui.lbTimer) { clearInterval(ui.lbTimer); ui.lbTimer = null; }
    const scr = $('#screen');
    scr.scrollTop = 0;
    document.body.dataset.view = ui.view;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === ui.tab));
    switch (ui.view) {
      case 'home': setChrome(true, true); renderHome(scr); break;
      case 'shop': setChrome(true, true); renderShop(scr); break;
      case 'profile': setChrome(true, true); renderProfile(scr); break;
      case 'leagues': setChrome(true, true); renderLeagues(scr); break;
      case 'settings': setChrome(false, true); renderSettings(scr); break;
      case 'developer': setChrome(false, true); renderDeveloper(scr); break;
      case 'onboarding': setChrome(false, false); renderOnboarding(scr); break;
      case 'lesson': setChrome(false, false); renderLessonShell(scr); break;
      default: ui.view = 'home'; setChrome(true, true); renderHome(scr);
    }
    renderTop();
  }

  function renderTop() {
    const s = st();
    const active = s.lastActive === S.today();
    const prem = S.isPremium();
    $('#topbar').innerHTML = `
      <button class="stat-chip chip-streak ${active ? '' : 'off'}" id="tStreak"><span class="ic">🔥</span><span>${s.streak}</span></button>
      <button class="stat-chip chip-buzzy" id="tBuzzy"><span class="ic"><img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false></span><span>${fmt(s.buzzy)}</span></button>
      <button class="stat-chip chip-xp" id="tXp"><span class="ic">⚡</span><span>${fmt(s.xp)}</span></button>
      <button class="stat-chip chip-super" id="tSuper">${prem ? 'SUPER ✓' : 'SUPER'}</button>`;
    $('#tStreak').onclick = () => streakModal();
    $('#tBuzzy').onclick = () => go('shop');
    $('#tXp').onclick = () => go('profile');
    $('#tSuper').onclick = () => (prem ? go('settings') : openPaywall());
  }

  /* ───────────────── Главная / карта ───────────────── */
  function lessonState(gi) {
    const unit = D.lessonIndex[gi].unit, lesson = D.lessonIndex[gi].lesson;
    const rec = st().lessons[lesson.id];
    const done = !!(rec && rec.done);
    const open = gi === 0 || unit.lessons[0] === lesson || !!((st().lessons[D.lessonIndex[gi - 1].lesson.id] || {}).done);
    return { done, open, premiumLocked: !!(unit.superOnly || unit.premium) && !S.isPremium(), times: rec ? rec.times : 0 };
  }
  function currentGi() {
    for (let i = 0; i < D.lessonIndex.length; i++) { const x = lessonState(i); if (!x.done && x.open) return i; }
    return -1;
  }
  function ring(p, color) {
    const r = 24, c = 2 * Math.PI * r, v = Math.min(1, p);
    return `<svg class="ring" viewBox="0 0 56 56"><circle cx="28" cy="28" r="${r}" stroke="#E5E5E5" stroke-width="7" fill="none"/>
      <circle cx="28" cy="28" r="${r}" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}"
      stroke-dashoffset="${(c * (1 - v)).toFixed(1)}" transform="rotate(-90 28 28)"/>
      <text x="28" y="33" text-anchor="middle" font-size="14" font-weight="900" fill="#3C3C3C" font-family="sans-serif">${v >= 1 ? '✓' : Math.round(v * 100) + '%'}</text></svg>`;
  }

  function renderHome(scr) {
    const s = st();
    const today = S.todayXp(), goal = s.settings.dailyGoal;
    const cur = currentGi();
    const offsets = [0, 46, 72, 46, 0, -46, -72, -46];
    let gi = 0, html = '';
    D.units.forEach((u, ui_) => {
      const locked = !!(u.superOnly || u.premium) && !S.isPremium();
      html += `${u.superOnly && (ui_ === 0 || !D.units[ui_ - 1].superOnly) ? `<div class="super-divider"><span>👑 Модули для Суперпользователей</span><small>Усложнённые уроки · доступны в BuryatGo Super</small></div>` : ''}<section class="unit${u.superOnly ? ' super-unit' : ''}"><div class="unit-head" style="background:${u.color}">
        <div><div class="u-t">Модуль ${ui_ + 1}${u.superOnly ? ' · 👑 SUPER · сложный' : ''}</div><div class="u-n">${esc(u.title)}</div><div class="u-s">${esc(u.subtitle)}</div></div>
        ${locked ? '<button class="lock-badge" data-pw>👑 SUPER</button>' : `<div class="u-ic">${u.icon}</div>`}</div>
        <div class="path">`;
      u.lessons.forEach((l, li) => {
        const x = lessonState(gi);
        const isCur = gi === cur;
        let cls = '', style = '', icon = '★';
        if (x.open && x.premiumLocked) { cls = 'premium-lock'; icon = '👑'; }
        else if (x.done) { cls = 'done'; icon = '✔'; }
        else if (x.open) { style = `background:${u.color};box-shadow:0 7px 0 ${u.shade}`; icon = '★'; }
        else { cls = 'locked'; icon = '🔒'; }
        html += `<div class="node-wrap" style="transform:translateX(${offsets[gi % offsets.length]}px)">
          ${isCur && !x.premiumLocked ? '<div class="start-bubble">Старт</div><div class="node-current-ring"></div>' : ''}
          <button class="node ${cls}" data-gi="${gi}" style="${style}" aria-label="${esc(l.title)}">${icon}${x.done ? `<span class="crown">×${x.times}</span>` : ''}</button>
          <div class="node-label">${esc(l.title)}</div></div>`;
        gi++;
      });
      if (ui_ === 0) html += `<div class="map-mascot" style="left:6px;top:232px">${M.svg(s.equip, { mood: 'happy' })}</div>`;
      html += '</div></section>';
    });
    scr.innerHTML = `<div class="view">
      <div class="rb-banner">${gerbSvg()}<div class="rb-t"><b>Буряад Республика</b><span>Буряад хэлэ — манай баялиг</span></div>${flagSvg('waving')}</div>
      <div class="goal-card">${ring(today / goal, '#FFC800')}<div><b>Дневная цель</b><div class="muted" style="font-weight:700">${today} из ${goal} XP сегодня</div></div></div>
      ${html}
      <div class="steppe">${STEPPE_SVG}</div>
      <div class="info-plate" role="note"><span class="ip-ic">📣</span><p>В скором времени ожидается обновление приложений. Следите за нами в MAX или <b>Instagram</b> (ссылки добавим позже при релизе)</p></div></div>`;
    $$('.node', scr).forEach(b => { b.onclick = () => openLessonStart(+b.dataset.gi); });
    $$('[data-pw]', scr).forEach(b => { b.onclick = () => openPaywall(); });
    const curEl = $('.node-current-ring', scr);
    if (curEl && cur > 1) setTimeout(() => curEl.parentElement.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
  }

  function openLessonStart(gi) {
    const x = lessonState(gi);
    const unit = D.lessonIndex[gi].unit, lesson = D.lessonIndex[gi].lesson;
    if (x.premiumLocked) { openPaywall(); return; }
    if (!x.open) { toast('🔒 Сначала пройдите предыдущий урок'); haptic('error'); return; }
    const words = lesson.words.map(w => `<span style="display:inline-block;border:2px solid var(--line);border-radius:10px;padding:4px 9px;margin:3px;font-weight:800">${D.words[w].emoji} ${esc(D.words[w].bu)}</span>`).join('');
    const m = openModal(`<div class="big-emo">${unit.icon}</div><h2>${esc(lesson.title)}</h2>
      <p>${esc(unit.title)} · урок ${unit.lessons.indexOf(lesson) + 1} из ${unit.lessons.length}</p>
      <div style="text-align:center;margin:-6px 0 16px">${words}</div>
      <p style="margin-bottom:14px">${x.done ? 'Повторение: +5 XP · +4 <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>' : 'Награда: +10 XP · +10 <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>'}</p>
      <div class="stack"><button class="btn" id="goLesson" style="background:${unit.color};box-shadow:0 4px 0 ${unit.shade}">${x.done ? 'Повторить' : 'Начать'}</button></div>`);
    $('#goLesson', m).onclick = () => { closeModal(); startLesson(gi); };
  }

  /* ───────────────── Движок урока ───────────────── */
  function wordPoolFor(unit, lesson) {
    let p = uniq(unit.lessons.reduce((a, l) => a.concat(l.words), []).concat(lesson.review));
    if (p.length < 4) p = uniq(p.concat(D.units[0].lessons.reduce((a, l) => a.concat(l.words), [])));
    return p;
  }
  function optionsFor(w, pool, n) {
    const ru = D.words[w].ru;
    return shuffle([w].concat(sample(pool.filter(x => x !== w && D.words[x].ru !== ru), n - 1)));
  }
  function buildQueue(unit, lesson) {
    const pool = wordPoolFor(unit, lesson);
    const first = !((st().lessons[lesson.id] || {}).done);
    const q = [];
    lesson.words.forEach(w => {
      if (first || !st().words[w]) q.push({ type: 'intro', w });
      q.push({ type: 'choose_ru', w, opts: optionsFor(w, pool, 4) });
    });
    const mid = [];
    sample(lesson.words, Math.min(2, lesson.words.length)).forEach(w => mid.push({ type: 'listen', w, opts: optionsFor(w, pool, 4) }));
    sample(lesson.words, Math.min(3, lesson.words.length)).forEach(w => mid.push({ type: 'choose_bu', w, opts: optionsFor(w, pool, 3) }));
    sample(lesson.review, Math.min(2, lesson.review.length)).forEach(w => mid.push({ type: 'choose_ru', w, opts: optionsFor(w, pool, 4) }));
    shuffle(mid).forEach(e => q.push(e));
    lesson.phrases.forEach((p, i) => q.push({ type: 'build', phrase: p, dir: i % 2 === 0 ? 'bu2ru' : 'ru2bu' }));
    const mp = uniq(lesson.words.concat(lesson.review));
    if (mp.length >= 3) q.push({ type: 'match', pairs: sample(mp, Math.min(5, mp.length)) });
    return q;
  }

  function startLesson(gi) {
    const unit = D.lessonIndex[gi].unit, lesson = D.lessonIndex[gi].lesson;
    ui.lesson = { gi, unit, lesson, queue: buildQueue(unit, lesson), done: 0, mistakes: 0, combo: 0, maxCombo: 0, answered: 0, correct: 0,
      cur: null, ready: false, answer: null, checked: false, evaluate: null, finished: false, onContinue: null };
    go('lesson');
    nextExercise();
  }

  function renderLessonShell(scr) {
    scr.innerHTML = `<div class="lesson view" style="position:relative">
      <div class="lesson-top"><button class="x-btn" id="lQuit" aria-label="Выйти">✕</button><div class="progress"><i id="lProg"></i></div><div class="combo" id="lCombo"></div></div>
      <div class="lesson-body" id="lBody"></div>
      <div class="lesson-foot" id="lFoot"></div>
      <div class="sheet" id="lSheet"></div></div>`;
    $('#lQuit').onclick = quitLesson;
  }

  function quitLesson() {
    confirmBox({ emoji: '😢', title: 'Подождите, не уходите!', text: 'Если выйдете сейчас, прогресс этого урока пропадёт.',
      ok: 'Продолжить урок', cancel: 'Выйти', onCancel: () => { ui.lesson = null; go('home'); } });
  }

  function updateProgress() {
    const L = ui.lesson, p = $('#lProg');
    if (!p) return;
    const total = L.done + L.queue.length + (L.cur ? 1 : 0);
    p.style.width = (total ? (L.done / total) * 100 : 100) + '%';
  }
  function updateCombo() {
    const L = ui.lesson, c = $('#lCombo');
    if (!c) return;
    c.textContent = L.combo >= 2 ? '🔥' + L.combo : '';
    if (L.combo >= 2) bump('lCombo');
  }
  function setReady(b) { ui.lesson.ready = b; const c = $('#lCheck'); if (c) c.disabled = !b; }

  function nextExercise() {
    const L = ui.lesson;
    if (!L) return;
    L.cur = L.queue.shift() || null;
    if (!L.cur) { updateProgress(); setTimeout(finishLesson, 250); return; }
    L.checked = false; L.ready = false; L.answer = null; L.evaluate = null;
    updateProgress();
    renderExercise();
  }

  function renderExercise() {
    const L = ui.lesson, ex = L.cur, body = $('#lBody'), foot = $('#lFoot');
    body.style.pointerEvents = '';
    body.scrollTop = 0;
    foot.innerHTML = '<button class="btn" id="lCheck" data-silent disabled>Проверить</button>';
    body.innerHTML = '<div class="ex-anim" id="exRoot"></div>';
    const R = { intro: exIntro, choose_ru: exChooseRu, listen: exListen, choose_bu: exChooseBu, build: exBuild, match: exMatch }[ex.type];
    R(ex, $('#exRoot'), foot);
    $('#lCheck').onclick = onCheck;
  }

  function onCheck() {
    const L = ui.lesson;
    if (!L || !L.cur) return;
    if (L.cur.type === 'intro') { L.done++; sfx('pop'); nextExercise(); return; }
    if (!L.ready || L.checked || !L.evaluate) return;
    doCheck();
  }

  function requeue(ex) { const c = Object.assign({}, ex); if (c.opts) c.opts = shuffle(c.opts); return c; }

  function doCheck() {
    const L = ui.lesson;
    const r = L.evaluate();
    L.checked = true; L.answered++;
    $('#lBody').style.pointerEvents = 'none';
    if (r.ok) {
      L.correct++; L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo); L.done++;
      sfx('correct'); haptic('success');
      if (r.onOk) r.onOk();
    } else {
      L.mistakes++; L.combo = 0;
      L.queue.push(requeue(L.cur));
      sfx('wrong'); haptic('error');
    }
    if (r.mark) r.mark(r.ok);
    updateCombo();
    showSheet(r.ok, r);
  }

  const PRAISE = ['Отлично!', 'Правильно!', 'Супер!', 'Молодец!', 'Һайн! Хорошо!', 'Так держать!'];
  function showSheet(ok, r) {
    const L = ui.lesson, sh = $('#lSheet');
    const combo = ok && L.combo >= 3 ? `<div style="font-size:14px;font-weight:800;color:var(--orange)">🔥 ${L.combo} правильных подряд</div>` : '';
    const bodyTxt = ok ? (r.okText ? esc(r.okText) : '') : (r.correctText ? 'Правильный ответ: <b>' + esc(r.correctText) + '</b>' : '');
    sh.className = 'sheet ' + (ok ? 'good' : 'wrong');
    sh.innerHTML = `<div class="s-head"><div class="s-ic">${ok ? '✅' : '❌'}</div><div>${ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Ошибка'}${combo}</div></div>
      <div class="s-body">${bodyTxt}</div>
      <button class="btn ${ok ? '' : 'wrongbtn'}" id="sNext">Продолжить</button>`;
    void sh.offsetWidth;
    sh.classList.add('show');
    $('#sNext').onclick = () => { sh.classList.remove('show'); nextExercise(); };
  }

  function bindSay(root, text, audio) {
    const say = $('[data-say]', root), slow = $('[data-slow]', root);
    const anim = b => { b.classList.remove('playing'); void b.offsetWidth; b.classList.add('playing'); };
    if (say) say.onclick = () => { anim(say); speak(text, false, audio); };
    if (slow) slow.onclick = () => { anim(slow); speak(text, true, audio); };
  }

  function bindChoice(root, sel, correctId, info, onPick) {
    const L = ui.lesson;
    $$(sel, root).forEach(b => {
      b.onclick = () => {
        $$(sel, root).forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        L.answer = b.dataset.id;
        setReady(true);
        if (onPick) onPick(b.dataset.id);
      };
    });
    L.evaluate = () => {
      const ok = L.answer === correctId;
      return Object.assign({
        ok,
        mark() {
          $$(sel, root).forEach(x => {
            x.classList.remove('sel');
            if (x.dataset.id === correctId) x.classList.add('ok');
            else if (x.dataset.id === L.answer) x.classList.add('bad');
            else x.classList.add('dim');
          });
        }
      }, info());
    };
  }

  function exIntro(ex, root, foot) {
    const w = D.words[ex.w];
    root.innerHTML = `<div class="ex-kind">✨ Новое слово</div><div class="ex-title">Запомните</div>
      <div class="intro-card"><div class="emo">${w.emoji}</div><div class="bu">${esc(w.bu)}</div><div class="ru">${esc(w.ru)}</div>
      ${pronounce(w.bu) !== w.bu ? `<div class="pron-hint">🔊 Звучит как «${esc(pronounce(w.bu))}»</div>` : ''}
      ${w.note ? `<div class="note">💡 ${esc(w.note)}</div>` : ''}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:18px">
        <button class="spk" data-silent data-say aria-label="Прослушать">🔊</button>
        <button class="spk" data-silent data-slow aria-label="Медленно" style="background:#fff;border:2px solid var(--line);box-shadow:0 3px 0 var(--line)">🐢</button></div></div>`;
    bindSay(root, w.bu, audioOf(w));
    setTimeout(() => speak(w.bu, false, audioOf(w)), 350);
    const b = $('#lCheck', foot);
    b.disabled = false; b.textContent = 'Продолжить';
    ui.lesson.ready = true;
  }

  function exChooseRu(ex, root) {
    const w = D.words[ex.w];
    root.innerHTML = `<div class="ex-kind">🧩 Выберите перевод</div><div class="ex-title">Что это значит?</div>
      <div class="speech"><div class="mini-m">${mini()}</div><div class="bubble"><button class="spk" data-silent data-say>🔊</button><span>${esc(w.bu)}</span></div></div>
      <div class="grid2">${ex.opts.map(id => { const o = D.words[id]; return `<button class="card-opt" data-id="${id}"><span class="emo">${o.emoji}</span><span>${esc(o.ru)}</span></button>`; }).join('')}</div>`;
    bindSay(root, w.bu, audioOf(w));
    setTimeout(() => speak(w.bu, false, audioOf(w)), 300);
    bindChoice(root, '.card-opt', ex.w, () => ({ correctText: w.ru, okText: w.bu + ' — ' + w.ru }));
  }

  function exListen(ex, root, foot) {
    const w = D.words[ex.w];
    root.innerHTML = `<div class="ex-kind">🎧 Аудирование</div><div class="ex-title">Что вы услышали?</div>
      <div class="listen-btns"><button class="big-spk" data-silent data-say aria-label="Прослушать">🔊</button><button class="big-spk slow" data-silent data-slow aria-label="Медленно">🐢</button></div>
      <div class="grid2">${ex.opts.map(id => { const o = D.words[id]; return `<button class="card-opt" data-id="${id}"><span class="emo">${o.emoji}</span><span>${esc(o.ru)}</span></button>`; }).join('')}</div>`;
    bindSay(root, w.bu, audioOf(w));
    setTimeout(() => speak(w.bu, false, audioOf(w)), 350);
    bindChoice(root, '.card-opt', ex.w, () => ({ correctText: w.bu + ' — ' + w.ru, okText: w.bu + ' — ' + w.ru }));
    foot.insertAdjacentHTML('afterbegin', '<button class="btn ghost dark skip" id="lSkip">Не могу слушать</button>');
    $('#lSkip', foot).onclick = () => { if (ui.lesson.checked) return; ui.lesson.done++; nextExercise(); };
  }

  function exChooseBu(ex, root) {
    const w = D.words[ex.w];
    root.innerHTML = `<div class="ex-kind">💬 Выберите ответ</div><div class="ex-title">Как сказать «${esc(w.ru)}» ${w.emoji}?</div>
      <div class="list-opt">${ex.opts.map((id, i) => `<button class="row-opt" data-id="${id}"><span class="num">${i + 1}</span><span>${esc(D.words[id].bu)}</span></button>`).join('')}</div>`;
    bindChoice(root, '.row-opt', ex.w, () => ({ correctText: w.bu, okText: w.bu + ' — ' + w.ru }),
      id => speak(D.words[id].bu, false, audioOf(D.words[id])));
  }

  function exBuild(ex, root) {
    const L = ui.lesson, p = ex.phrase;
    const toRu = ex.dir === 'bu2ru';
    const src = toRu ? p.bu : p.ru, tgt = toRu ? p.ru : p.bu, lang = toRu ? 'ru' : 'bu';
    const tnorm = tgt.map(norm);
    const pool = wordPoolFor(L.unit, L.lesson);
    const distract = uniq(shuffle(pool).reduce((a, id) => a.concat(D.words[id][lang].split(/\s+/)), [])
      .map(t => t.replace(/[.,!?]/g, '')).filter(t => t && tnorm.indexOf(norm(t)) < 0)).slice(0, 2);
    const tiles = shuffle(tgt.concat(distract)).map(t => ({ t }));
    const srcText = src.join(' '), tgtText = tgt.join(' ');
    root.innerHTML = `<div class="ex-kind">🧱 Конструктор фраз</div><div class="ex-title">${toRu ? 'Переведите на русский' : 'Переведите на бурятский'}</div>
      <div class="speech"><div class="mini-m">${mini()}</div><div class="bubble">${toRu ? '<button class="spk" data-silent data-say>🔊</button>' : ''}<span>${esc(srcText)}</span></div></div>
      <div class="answer-area" id="ans"></div>
      <div class="bank" id="bank">${tiles.map((o, i) => `<button class="tile" data-i="${i}">${esc(o.t)}</button>`).join('')}</div>`;
    if (toRu) { bindSay(root, srcText); setTimeout(() => speak(srcText), 300); }
    const ans = $('#ans', root), bank = $('#bank', root);
    const chosen = [];
    function draw() {
      ans.innerHTML = chosen.map(i => `<button class="tile" data-i="${i}">${esc(tiles[i].t)}</button>`).join('');
      $$('.tile', bank).forEach(b => b.classList.toggle('ghost', chosen.indexOf(+b.dataset.i) >= 0));
      $$('.tile', ans).forEach(b => { b.onclick = () => { const k = chosen.indexOf(+b.dataset.i); if (k >= 0) chosen.splice(k, 1); draw(); }; });
      setReady(chosen.length > 0);
    }
    $$('.tile', bank).forEach(b => {
      b.onclick = () => {
        const i = +b.dataset.i;
        if (chosen.indexOf(i) >= 0) return;
        chosen.push(i);
        if (lang === 'bu') speak(tiles[i].t);
        draw();
      };
    });
    L.evaluate = () => {
      const given = chosen.map(i => tiles[i].t).join(' ');
      const ok = norm(given) === norm(tgtText);
      return {
        ok, correctText: tgtText,
        okText: toRu ? srcText + ' — ' + tgtText : tgtText + ' — ' + srcText,
        mark(good) { $$('.tile', ans).forEach(t => t.classList.add(good ? 'ok' : 'bad')); },
        onOk() { if (!toRu) setTimeout(() => speak(tgtText), 200); }
      };
    };
  }

  function exMatch(ex, root, foot) {
    const L = ui.lesson, ids = ex.pairs;
    const left = shuffle(ids), right = shuffle(ids);
    root.innerHTML = `<div class="ex-kind">🔗 Пары</div><div class="ex-title">Соедините пары слов</div>
      <div class="match-grid">${left.map((id, i) => `<button class="row-opt" data-side="l" data-id="${id}">${esc(D.words[id].bu)}</button><button class="row-opt" data-side="r" data-id="${right[i]}">${D.words[right[i]].emoji} ${esc(D.words[right[i]].ru)}</button>`).join('')}</div>`;
    $('#lCheck', foot).textContent = 'Найдите все пары';
    let selL = null, selR = null, matched = 0, busy = false;
    $$('.row-opt', root).forEach(b => {
      b.onclick = () => {
        if (busy || b.classList.contains('done')) return;
        const side = b.dataset.side;
        $$(`.row-opt[data-side="${side}"]`, root).forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        if (side === 'l') { selL = b; speak(D.words[b.dataset.id].bu, false, audioOf(D.words[b.dataset.id])); } else selR = b;
        if (!selL || !selR) return;
        const a = selL, c = selR; selL = null; selR = null;
        a.classList.remove('sel'); c.classList.remove('sel');
        if (a.dataset.id === c.dataset.id) {
          a.classList.add('ok'); c.classList.add('ok');
          sfx('pop'); haptic('light');
          setTimeout(() => { a.classList.add('done'); c.classList.add('done'); }, 300);
          matched++;
          if (matched === ids.length) {
            setTimeout(() => {
              L.evaluate = () => ({ ok: true, okText: 'Все пары найдены!' });
              L.ready = true;
              doCheck();
            }, 450);
          }
        } else {
          a.classList.add('bad'); c.classList.add('bad');
          L.mistakes++; L.combo = 0; updateCombo();
          sfx('wrong'); haptic('error');
          busy = true;
          setTimeout(() => { a.classList.remove('bad'); c.classList.remove('bad'); busy = false; }, 550);
        }
      };
    });
  }

  function finishLesson() {
    const L = ui.lesson, s = st();
    if (!L || L.finished) return;
    const rec = s.lessons[L.lesson.id] || { done: false, times: 0, best: 0 };
    const first = !rec.done;
    const acc = L.answered ? Math.round((L.correct / L.answered) * 100) : 100;
    const perfect = L.mistakes === 0;
    let xp = first ? 10 : 5;
    if (perfect) xp += 5;
    if (L.maxCombo >= 5) xp += 3;
    const beforeToday = S.todayXp();
    const streakGrew = S.bumpStreak();
    let bz = first ? 10 : 4;
    if (perfect) bz += 5;
    const streakBonus = streakGrew ? Math.min(s.streak, 10) * 2 : 0;
    bz += streakBonus;
    const prem = S.isPremium();
    if (prem) bz *= 2;
    S.addXp(xp);
    s.buzzy += bz; s.buzzyEarned += bz;
    rec.done = true; rec.times++; rec.best = Math.max(rec.best, acc); rec.last = S.today();
    s.lessons[L.lesson.id] = rec;
    L.lesson.words.forEach(w => { s.words[w] = (s.words[w] || 0) + 1; });
    s.stats.lessons++; s.stats.answers += L.answered; s.stats.correct += L.correct;
    if (perfect) s.stats.perfect++;
    const goal = s.settings.dailyGoal;
    const goalHit = beforeToday < goal && S.todayXp() >= goal;
    S.save();
    L.finished = true;
    renderResult({ xp, bz, acc, perfect, streakGrew, streakBonus, goalHit, first, prem, combo: L.maxCombo });
  }

  function renderResult(res) {
    const L = ui.lesson, scr = $('#screen');
    const extras = [];
    if (res.perfect) extras.push('🎯 Без ошибок: +5 XP, +5 <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>');
    if (res.combo >= 5) extras.push('🔥 Комбо ×' + res.combo + ': +3 XP');
    if (res.streakBonus) extras.push('📅 Бонус за серию: +' + res.streakBonus + ' <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>');
    if (res.prem) extras.push('👑 Super: Буузы ×2');
    scr.innerHTML = `<div class="view result">
      <div class="r-m jump">${M.svg(st().equip, { mood: 'happy', cls: 'wave' })}</div>
      <h1>${res.perfect ? 'Идеально! 🎯' : 'Урок пройден!'}</h1>
      <div class="muted" style="font-weight:800">${esc(L.lesson.title)} · ${esc(L.unit.title)}</div>
      <div class="r-stats">
        <div class="r-stat" style="border-color:#FFC800"><div class="h" style="background:#FFC800">Опыт</div><div class="v" style="color:#E0A800">⚡ ${res.xp}</div></div>
        <div class="r-stat" style="border-color:#FF9600"><div class="h" style="background:#FF9600">Буузы</div><div class="v" style="color:#E08600"><img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${res.bz}</div></div>
        <div class="r-stat" style="border-color:#58CC02"><div class="h" style="background:#58CC02">Точность</div><div class="v" style="color:#46A302">🎯 ${res.acc}%</div></div>
      </div>
      ${extras.length ? `<div style="margin:-12px 0 24px;font-weight:800;color:var(--muted);font-size:14px;line-height:1.8">${extras.join('<br>')}</div>` : ''}
      <button class="btn" id="rNext">Продолжить</button></div>`;
    sfx('complete'); haptic('success');
    setTimeout(confetti, 150);
    L.onContinue = () => {
      const lessonId = L.lesson.id;
      ui.lesson = null;
      go('home');
      const chain = [];
      if (res.streakGrew) chain.push(cb => streakModal(cb, true));
      if (res.goalHit) chain.push(cb => goalModal(cb));
      if (res.first && lessonId === 'u1l3' && !S.isPremium()) chain.push(cb => { openPaywall(); cb(); });
      const run = i => { if (i < chain.length) chain[i](() => run(i + 1)); else checkAchievements(); };
      run(0);
    };
    $('#rNext').onclick = () => L.onContinue();
  }

  function weekRow() {
    const s = st(), start = S.dayKey(S.weekStart()), today = S.today();
    let h = '<div style="display:flex;justify-content:space-between;gap:4px;margin:0 0 18px">';
    for (let i = 0; i < 7; i++) {
      const k = S.addDays(start, i), on = (s.xpByDay[k] || 0) > 0, isT = k === today;
      h += `<div style="flex:1;text-align:center"><div style="font-size:12px;font-weight:900;color:${isT ? 'var(--orange)' : '#AFAFAF'}">${WD[S.parseDay(k).getDay()]}</div>
        <div style="margin:4px auto 0;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;background:${on ? 'var(--orange)' : 'var(--line)'};color:#fff">${on ? '🔥' : ''}</div></div>`;
    }
    return h + '</div>';
  }

  function streakModal(onClose, celebrate) {
    const s = st();
    if (celebrate) { sfx('streak'); haptic('success'); }
    const active = s.lastActive === S.today();
    const m = openModal(`<div class="big-emo flame-wrap">${flameSvg(active)}</div>
      <h2 style="font-size:44px;color:var(--orange);margin:0">${s.streak}</h2>
      <p>${plural(s.streak, ['день', 'дня', 'дней'])} подряд! ${active ? 'Сегодня вы уже позанимались — возвращайтесь завтра.' : 'Пройдите урок сегодня, чтобы продлить серию.'}</p>
      ${weekRow()}
      <p style="font-size:14px;margin-top:-6px">🧊 Заморозок: ${s.freezes} · Рекорд: ${s.bestStreak}</p>
      <button class="btn gold" data-ok>${celebrate ? 'Так держать!' : 'Понятно'}</button>`, { center: true, onClose });
    $('[data-ok]', m).onclick = () => closeModal();
  }

  function goalModal(onClose) {
    const s = st();
    const m = openModal(`<div class="big-emo">🎯</div><h2>Дневная цель выполнена!</h2>
      <p>${S.todayXp()} XP из ${s.settings.dailyGoal}. Бато вами гордится!</p>
      <button class="btn" data-ok>Ура!</button>`, { center: true, onClose });
    sfx('coin'); confetti();
    $('[data-ok]', m).onclick = () => closeModal();
  }

  function checkAchievements() {
    const s = st(), got = [];
    D.achievements.forEach(a => {
      if (s.unlockedAchievements.indexOf(a.id) < 0 && a.metric(s) >= a.goal) {
        s.unlockedAchievements.push(a.id);
        s.buzzy += 20; s.buzzyEarned += 20;
        got.push(a);
      }
    });
    if (!got.length) return;
    S.save();
    renderTop();
    got.forEach((a, i) => setTimeout(() => { toast(a.icon + ' Достижение «' + a.title + '»! +20 <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>', 2600); sfx('coin'); bump('tBuzzy'); }, i * 2800 + 400));
  }

  /* ───────────────── Магазин персонажа ───────────────── */
  function itemPreview(it) {
    if (it.slot === 'bonus') return `<div class="bonus-icon">${it.icon || '🧊'}</div>`;
    return M.preview(it.id);
  }
  function renderShop(scr) {
    const s = st();
    const items = D.items.filter(i => (i.cat || i.slot) === ui.shopSlot);
    scr.innerHTML = `<div class="view">
      <div class="mascot-stage v4" id="stage">${stageScene()}${STAGE_SKY}
        <div class="say" id="say"></div>
        <div class="mascot-hold" id="mHold">${M.svg(s.equip, { mood: 'happy', cls: 'wave' })}</div></div>
      <div class="wallet">
        <div><span class="big"><img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false></span><div><div class="big" id="wBuzzy">${fmt(s.buzzy)}</div><div class="muted" style="font-size:12px;font-weight:800">Буузы</div></div></div>
        <div><span class="big">🧊</span><div><div class="big">${s.freezes}</div><div class="muted" style="font-size:12px;font-weight:800">Заморозки</div></div></div>
      </div>
      <div class="seg">${D.slots.map(sl => `<button data-slot="${sl.id}" class="${ui.shopSlot === sl.id ? 'on' : ''}">${sl.icon} ${esc(sl.name)}</button>`).join('')}<button data-slot="pets" class="${ui.shopSlot === 'pets' ? 'on' : ''}">🐾 Питомцы</button></div>
      <div class="shop-grid">${ui.shopSlot === 'pets' ? petsGrid() : items.map(it => {
        const owned = s.owned.indexOf(it.id) >= 0, eq = s.equip[it.slot] === it.id;
        let tag = '';
        if (eq) tag = '<span class="tag">Надето</span>';
        else if (owned && !it.consumable) tag = '<span class="tag" style="background:var(--blue)">Есть</span>';
        else if (it.premiumOnly) tag = '<span class="tag super">SUPER</span>';
        const price = it.consumable ? `<img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${it.price}` : owned ? (eq ? '✔ Надето' : 'Надеть') : `<img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${it.price}`;
        return `<button class="item-card ${eq ? 'equipped' : ''}" data-id="${it.id}">${tag}<div class="pv">${itemPreview(it)}</div><div class="nm">${esc(it.name)}</div><div class="price">${price}</div></button>`;
      }).join('')}</div>
      <p class="disclaimer">Нажмите на Бато — он скажет что-нибудь по-бурятски! Буузы зарабатываются за уроки, серии и достижения.</p></div>`;
    $$('.seg button', scr).forEach(b => { b.onclick = () => { ui.shopSlot = b.dataset.slot; renderShop(scr); }; });
    $$('.item-card', scr).forEach(b => { b.onclick = () => b.dataset.lucky ? luckyModal() : b.dataset.pet ? sheepModal() : b.dataset.horse ? horseModal(b.dataset.horse) : itemModal(b.dataset.id); });
    const hold = $('#mHold', scr);
    hold.onclick = () => mascotTalk();
  }

  let sayTimer = null;
  function mascotTalk() {
    const hold = $('#mHold'), say = $('#say');
    if (!hold || !say) return;
    const ph = D.mascotPhrases[Math.floor(Math.random() * D.mascotPhrases.length)];
    hold.classList.remove('jump'); void hold.offsetWidth; hold.classList.add('jump');
    say.innerHTML = `${esc(ph.bu)}<small>${esc(ph.ru)}</small>`;
    say.classList.add('show');
    speak(ph.bu);
    haptic('light');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => say.classList.remove('show'), 2600);
  }

  function itemModal(id) {
    const s = st(), it = D.itemsById[id];
    if (!it) return;
    const owned = s.owned.indexOf(id) >= 0, eq = s.equip[it.slot] === id;
    let preview;
    if (it.slot === 'bonus') preview = `<div class="bonus-icon" style="font-size:84px">${it.icon || '🧊'}</div>`;
    else { const tryOn = Object.assign({}, s.equip); tryOn[it.slot] = id; preview = M.svg(tryOn, { mood: 'happy', cls: 'wave' }); }
    let btn = '';
    if (it.consumable) {
      btn = s.freezes >= 2 ? '<button class="btn" disabled>Максимум 2 заморозки</button>'
        : `<button class="btn gold" data-act="buy">Купить за <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${it.price}</button>`;
    } else if (!owned) {
      if (it.premiumOnly && !S.isPremium()) btn = '<button class="btn purple" data-act="super">👑 Доступно в Super</button>';
      else btn = `<button class="btn gold" data-act="buy">Купить за <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${it.price}</button>`;
    } else if (eq) {
      btn = it.slot === 'outfit' && id === 'tshirt_green' ? '<button class="btn" disabled>Базовая одежда</button>' : '<button class="btn ghost dark" data-act="unequip">Снять</button>';
    } else btn = '<button class="btn blue" data-act="equip">Надеть</button>';
    const m = openModal(`<div class="mascot-stage v4" style="height:190px;margin:0 0 14px">${stageScene(true)}${STAGE_SKY}<div class="mascot-hold">${preview}</div></div>
      <h2>${esc(it.name)}</h2><p>${esc(it.desc || (it.slot === 'outfit' ? 'Одежда для Бато' : 'Аксессуар для Бато'))}</p>
      ${it.consumable ? `<p style="margin-top:-6px">У вас: ${s.freezes} из 2</p>` : ''}
      <div class="stack">${btn}<button class="btn ghost dark" data-act="close">Закрыть</button></div>`);
    $$('[data-act]', m).forEach(b => {
      b.onclick = () => {
        const act = b.dataset.act;
        if (act === 'close') closeModal();
        else if (act === 'super') { closeModal(); openPaywall(); }
        else if (act === 'buy') buyItem(it);
        else if (act === 'equip') { s.equip[it.slot] = id; S.save(); closeModal(); sfx('pop'); refreshShop(true); }
        else if (act === 'unequip') { s.equip[it.slot] = it.slot === 'outfit' ? 'tshirt_green' : null; S.save(); closeModal(); refreshShop(false); }
      };
    });
  }

  function buyItem(it) {
    const s = st();
    if (s.buzzy < it.price) {
      haptic('error'); sfx('wrong');
      toast(`Не хватает ${it.price - s.buzzy} <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>. Пройдите урок!`);
      return;
    }
    s.buzzy -= it.price;
    s.stats.purchases++;
    if (it.consumable) { s.freezes = Math.min(2, s.freezes + 1); }
    else { if (s.owned.indexOf(it.id) < 0) s.owned.push(it.id); s.equip[it.slot] = it.id; }
    S.save();
    closeModal();
    sfx('coin'); haptic('success'); confetti();
    toast(it.consumable ? '🧊 Заморозка серии куплена!' : '🎉 Куплено: ' + esc(it.name));
    refreshShop(true);
    checkAchievements();
  }

  /* ───────── Кони (Super) ───────── */
  function horseGrid() {
    const prem = S.isPremium(), hs = horseState();
    return D.horses.map(h => {
      const own = hs.owned.indexOf(h.id) >= 0, main = hs.main === h.id;
      let tag = '';
      if (main) tag = '<span class="tag">Главный</span>';
      else if (own) tag = '<span class="tag" style="background:var(--blue)">Есть</span>';
      else if (!prem) tag = '<span class="tag super">SUPER</span>';
      const price = own ? '✔ У сэргэ' : !prem ? '👑 Super' : (!hs.owned.length && !hs.freeUsed) ? '🎁 Бесплатно' : `<img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${D.horsePrice}`;
      return `<button class="item-card horse-card ${own ? 'equipped' : ''}" data-horse="${h.id}">${tag}<div class="pv">${window.BG_ART.horseSvg(h)}</div><div class="nm">${esc(h.name)}</div><div class="price">${price}</div></button>`;
    }).join('');
  }

  /* Питомцы: овцы (до 13) и кони */
  function petsGrid() {
    const n = petsState().sheep, max = D.sheepMax, prem = S.isPremium();
    const sheepCard = `<button class="item-card pet-card ${n ? 'equipped' : ''}" data-pet="sheep">${n ? `<span class="tag" style="background:var(--blue)">${n} из ${max}</span>` : ''}<div class="pv">${window.BG_ART.sheepSvg()}</div><div class="nm">Хонин — овца</div><div class="price">${n >= max ? '✔ Полное стадо' : `${BZI} ${D.sheepPrice}`}</div></button>`;
    return `<div class="pets-h">🐑 Овцы · ${n} из ${max}</div>${sheepCard}<div class="pets-h">🐎 Кони · ${prem ? horseState().owned.length + ' из 3' : (horseState().lucky ? 'случайный конь у сэргэ' : '1 случайный с ' + D.luckyHorseUnit + '-го модуля, остальные в Super')}</div>${prem ? '' : luckyCard()}${horseGrid()}`;
  }

  function sheepModal() {
    const s = st(), p = petsState(), n = p.sheep, max = D.sheepMax;
    const m = openModal(`<div class="horse-pv">${window.BG_ART.sheepSvg('big')}</div>
      <h2>Хонин — овца</h2><p>Барашки пасутся на лугу справа от Бато. Каждая купленная овца сразу появляется в стаде, проданная — исчезает.</p>
      <p class="muted" style="margin-top:-6px">В стаде: <b id="shCount">${n} из ${max}</b></p>
      <div class="stack">${n < max ? `<button class="btn gold" data-act="buy">Купить овцу за ${BZI} ${D.sheepPrice}</button>` : `<button class="btn" disabled>Стадо полное: ${max} из ${max}</button>`}
      ${n > 0 ? `<button class="btn red" data-act="sell">Продать овцу за ${BZI} ${D.sheepSell}</button>` : ''}
      <button class="btn ghost dark" data-act="close">Закрыть</button></div>`);
    $$('[data-act]', m).forEach(b => {
      b.onclick = () => {
        const act = b.dataset.act;
        if (act === 'close') return closeModal();
        if (act === 'buy') {
          if (p.sheep >= max) { toast(`В стаде уже ${max} овец — это максимум`); return; }
          if (s.buzzy < D.sheepPrice) { haptic('error'); sfx('wrong'); toast(`Не хватает ${D.sheepPrice - s.buzzy} ${BZI}. Пройдите урок!`); return; }
          s.buzzy -= D.sheepPrice; s.stats.purchases++; p.sheep++; S.save();
          sfx('coin'); haptic('success'); toast(`🐑 Новая овца в стаде! ${p.sheep} из ${max}`);
        } else if (act === 'sell') {
          if (p.sheep <= 0) return;
          p.sheep--; s.buzzy += D.sheepSell; S.save();
          sfx('coin'); haptic('light'); toast(`Овца продана: +${D.sheepSell} ${BZI}`);
        }
        refreshShop(false);
        sheepModal();
      };
    });
  }

  /* v1.8.3: случайный конь для игроков без Super — один раз, после выхода на 5-й модуль */
  function luckyCard() {
    const hs = horseState(), ok = reachedUnit(D.luckyHorseUnit), got = hs.lucky && D.horses.find(h => h.id === hs.lucky);
    const tag = got ? '<span class="tag">Ваш</span>' : ok ? '<span class="tag" style="background:var(--green)">Открыто</span>' : '<span class="tag" style="background:#868E96">🔒</span>';
    const pv = got ? window.BG_ART.horseSvg(got) : '<div class="lucky-q">🎲</div>';
    const price = got ? '✔ У сэргэ' : ok ? `${BZI} ${D.luckyHorsePrice}` : `🔒 Модуль ${D.luckyHorseUnit}`;
    return `<button class="item-card pet-card lucky-card ${got ? 'equipped' : ''}" data-lucky="1">${tag}<div class="pv">${pv}</div><div class="nm">${got ? esc(got.name) : 'Случайный конь'}</div><div class="price">${price}</div></button>`;
  }
  function luckyModal() {
    const s = st(), hs = horseState(), ok = reachedUnit(D.luckyHorseUnit), got = hs.lucky && D.horses.find(h => h.id === hs.lucky);
    const unit = D.units[D.luckyHorseUnit - 1];
    let body, btn = '';
    if (got) body = `<div class="horse-pv">${window.BG_ART.horseSvg(got, 'horse-svg big')}</div><h2>${esc(got.name)} — ${esc(got.ru)}</h2><p>${esc(got.desc)}</p><p class="muted">Это ваш случайный конь — он пасётся у сэргэ. Выбирать породу и держать до 3 коней можно в Super.</p>`;
    else {
      body = `<div class="horse-pv lucky-pv"><div class="lucky-q big">🎲</div></div><h2>Случайный конь</h2><p>Один конь на удачу: порода выпадет случайно из ${D.horses.length}.</p>` +
        (ok ? '' : `<p class="muted">🔒 Откроется, когда вы дойдёте до ${D.luckyHorseUnit}-го модуля${unit ? ' «' + esc(unit.title) + '»' : ''}.</p>`);
      btn = ok ? `<button class="btn gold" data-act="roll">🎲 Купить за ${BZI} ${D.luckyHorsePrice}</button>` : `<button class="btn" disabled>🔒 Нужен ${D.luckyHorseUnit}-й модуль</button>`;
    }
    const m = openModal(`${body}<div class="stack">${btn}<button class="btn ghost dark" data-act="close">Закрыть</button></div>`);
    let rolling = false;
    $$('[data-act]', m).forEach(b => {
      b.onclick = () => {
        if (rolling) return;
        if (b.dataset.act === 'close') return closeModal();
        if (hs.lucky || !reachedUnit(D.luckyHorseUnit)) return;
        if (s.buzzy < D.luckyHorsePrice) { haptic('error'); sfx('wrong'); toast(`Не хватает ${D.luckyHorsePrice - s.buzzy} ${BZI}. Пройдите урок!`); return; }
        const pick = D.horses[Math.floor(Math.random() * D.horses.length)];
        s.buzzy -= D.luckyHorsePrice; s.stats.purchases = (s.stats.purchases || 0) + 1; hs.lucky = pick.id; S.save();
        rolling = true; b.disabled = true; b.textContent = 'Крутим…';
        const pv = m.querySelector('.lucky-pv'); let i = 0;
        const t = setInterval(() => { if (pv) pv.innerHTML = window.BG_ART.horseSvg(D.horses[i++ % D.horses.length], 'horse-svg big'); }, 110);
        setTimeout(() => {
          clearInterval(t); rolling = false;
          if (pv) pv.innerHTML = window.BG_ART.horseSvg(pick, 'horse-svg big');
          const h2 = m.querySelector('h2'); if (h2) h2.textContent = pick.name + ' — ' + pick.ru; const pp = m.querySelector('h2 + p'); if (pp) pp.textContent = pick.desc;
          b.remove(); sfx('coin'); haptic('success'); confetti();
          toast(`🐎 Выпал ${esc(pick.name)}! Конь привязан к сэргэ`);
          refreshShop(true); renderTop();
        }, 1700);
      };
    });
  }

  function horseModal(id) {
    const s = st(), hs = horseState(), h = D.horses.find(x => x.id === id);
    if (!h) return;
    const prem = S.isPremium(), own = hs.owned.indexOf(id) >= 0;
    let btn;
    if (!prem) btn = '<button class="btn purple" data-act="super">👑 Конь доступен в Super</button>';
    else if (!hs.owned.length && !hs.freeUsed) btn = '<button class="btn gold" data-act="free">🎁 Выбрать бесплатно</button>';
    else if (!own) btn = `<button class="btn gold" data-act="buy">Докупить за <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> ${D.horsePrice}</button>${hs.owned.length ? '<button class="btn blue" data-act="swap">Поменять главного коня на этого</button>' : ''}`;
    else if (hs.main !== id) btn = '<button class="btn blue" data-act="main">Сделать главным</button>';
    else btn = '<button class="btn" disabled>Это ваш главный конь</button>';
    if (prem && own) btn += `<button class="btn red" data-act="sell">Продать за ${BZI} ${D.horseSell}</button>`;
    const note = prem && hs.owned.length && !own ? `<p class="muted" style="margin-top:-6px">К сэргэ можно привязать до 3 коней. Сейчас: ${hs.owned.length} из 3</p>` : '';
    const m = openModal(`<div class="horse-pv">${window.BG_ART.horseSvg(h, 'horse-svg big')}</div>
      <h2>${esc(h.name)} — ${esc(h.ru)}</h2><p>${esc(h.desc)}</p>${note}
      <div class="stack">${btn}<button class="btn ghost dark" data-act="close">Закрыть</button></div>`);
    $$('[data-act]', m).forEach(b => {
      b.onclick = () => {
        const act = b.dataset.act;
        if (act === 'close') return closeModal();
        if (act === 'super') { closeModal(); return openPaywall(); }
        if (act === 'buy') {
          if (hs.owned.length >= 3) { haptic('error'); toast('К сэргэ можно привязать не больше 3 коней'); return; }
          if (s.buzzy < D.horsePrice) { haptic('error'); sfx('wrong'); toast(`Не хватает ${D.horsePrice - s.buzzy} <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>. Пройдите урок!`); return; }
          s.buzzy -= D.horsePrice; s.stats.purchases++;
          hs.owned.push(id);
        } else if (act === 'free') { hs.owned = [id]; hs.main = id; hs.freeUsed = true; }
        else if (act === 'sell') { hs.owned = hs.owned.filter(x => x !== id); if (hs.main === id) hs.main = hs.owned.length ? hs.owned[hs.owned.length - 1] : null; s.buzzy += D.horseSell; }
        else if (act === 'swap') { const i = hs.owned.indexOf(hs.main); if (i >= 0) hs.owned[i] = id; else hs.owned.push(id); hs.main = id; }
        else if (act === 'main') hs.main = id;
        S.save(); closeModal();
        sfx('coin'); haptic('success'); if (act !== 'main' && act !== 'sell') confetti();
        toast(act === 'sell' ? `${esc(h.name)} продан: +${D.horseSell} ${BZI}` : `🐎 ${esc(h.name)} привязан к сэргэ!`);
        refreshShop(true);
      };
    });
  }

  /* Выбор коня сразу после покупки Super */
  function horsePicker(after) {
    const m = openModal(`<h2>Выберите своего коня 🐎</h2>
      <p>Подарок Super: конь встанет у коновязи-сэргэ возле юрты. Поменять, продать или докупить коней можно в магазине, во вкладке «Питомцы».</p>
      <div class="horse-pick">${D.horses.map(h => `<button class="horse-opt" data-h="${h.id}"><div class="pv">${window.BG_ART.horseSvg(h)}</div><b>${esc(h.name)}</b><span>${esc(h.ru)}</span></button>`).join('')}</div>`,
      { center: true, locked: true, onClose: after });
    $$('.horse-opt', m).forEach(b => {
      b.onclick = () => {
        const hs = horseState(), h = D.horses.find(x => x.id === b.dataset.h);
        hs.owned = [h.id]; hs.main = h.id; hs.freeUsed = true; S.save();
        sfx('coin'); haptic('success'); confetti();
        closeModal();
        toast(`🐎 ${esc(h.name)} ждёт вас у сэргэ в магазине!`);
      };
    });
  }

  function refreshShop(jump) {
    if (ui.view !== 'shop') return;
    const y = $('#screen').scrollTop;
    renderShop($('#screen'));
    renderTop();
    $('#screen').scrollTop = y;
    bump('tBuzzy');
    if (jump) setTimeout(mascotTalk, 120);
  }

  /* ───────────────── Профиль ───────────────── */
  function renderProfile(scr) {
    const s = st(), lg = D.leagues[s.league];
    const acc = s.stats.answers ? Math.round((s.stats.correct / s.stats.answers) * 100) : 0;
    const learned = Object.keys(s.words).length;
    const prem = S.isPremium();
    const days = [];
    for (let i = 6; i >= 0; i--) { const k = S.addDays(S.today(), -i); days.push({ k, v: s.xpByDay[k] || 0, t: i === 0 }); }
    const max = Math.max(s.settings.dailyGoal, ...days.map(d => d.v));
    const stats = [
      ['🔥', s.streak, 'Дней подряд'], ['⚡', fmt(s.xp), 'Всего XP'], ['🏆', lg.name, 'Лига'],
      ['📚', learned, 'Слов изучено'], ['✅', s.stats.lessons, 'Уроков'], ['🎯', acc + '%', 'Точность'],
      ['<img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>', fmt(s.buzzyEarned), 'Заработано'], ['🌟', s.bestStreak, 'Рекорд серии'], ['💎', s.stats.perfect, 'Идеальных'],
      ['🐑', petsState().sheep + ' / ' + D.sheepMax, 'Овец в стаде'], ['🐎', (S.isPremium() ? horseState().owned.length + ' / 3' : (horseState().lucky ? 1 : 0) + ' / 1'), 'Коней у сэргэ'], ['🛍️', s.stats.purchases || 0, 'Покупок']
    ];
    scr.innerHTML = `<div class="view pad">
      <div class="profile-head"><span class="corner-flag">${flagSvg()}</span><div class="avatar">${M.svg(s.equip, { cls: 'static', mood: 'happy' })}</div>
        <div style="flex:1;min-width:0"><div class="nm" id="pName">${esc(s.name || 'Ученик')} ✏️</div><div class="since">С нами с ${humanDate(s.createdAt)}${prem ? ' · 👑 Super' : ''}</div></div>
        <button class="icon-btn" id="pSet" aria-label="Настройки">⚙️</button></div>
      ${prem ? `<div class="super-banner" id="pSuper"><div class="t">👑 BuryatGo Super активна</div><div class="d">Действует до ${humanDate(s.premium.until)} · управление в настройках</div></div>`
        : `<div class="super-banner" id="pSuper"><div class="t">👑 Попробуйте BuryatGo Super</div><div class="d">Все модули, двойные Буузы и праздничный дэгэл</div></div>`}
      <h2 class="sub">Статистика</h2>
      <div class="stats-grid">${stats.map(x => `<div class="stat-box"><div class="i">${x[0]}</div><div class="v">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('')}</div>
      <h2 class="sub">Опыт за неделю</h2>
      <div class="chart">${days.map(d => `<div class="bar ${d.t ? 'today' : ''}"><b>${d.v || ''}</b><i style="height:${Math.max(4, (d.v / max) * 100)}%"></i><span>${WD[S.parseDay(d.k).getDay()]}</span></div>`).join('')}</div>
      <h2 class="sub">Достижения</h2>
      ${D.achievements.map(a => {
        const got = s.unlockedAchievements.indexOf(a.id) >= 0, v = Math.min(a.goal, a.metric(s));
        return `<div class="ach ${got ? 'got' : 'lock'}"><div class="ai">${a.icon}</div><div style="flex:1"><div class="at">${esc(a.title)}</div><div class="ad">${esc(a.desc)}</div>
          <div class="minibar"><i style="width:${(v / a.goal) * 100}%"></i></div></div><div style="font-weight:900;color:var(--muted);font-size:13px">${v}/${a.goal}</div></div>`;
      }).join('')}
    </div>`;
    $('#pSet').onclick = () => go('settings');
    $('#pName').onclick = editName;
    $('#pSuper').onclick = () => (prem ? go('settings') : openPaywall());
  }

  function editName() {
    const m = openModal(`<h2>Ваше имя</h2><p>Оно отображается в профиле и в лидерборде.</p>
      <input type="text" id="nmIn" maxlength="10" value="${esc(st().name)}" style="width:100%;margin-bottom:14px">
      <div class="stack"><button class="btn" id="nmOk">Сохранить</button></div>`);
    const inp = $('#nmIn', m);
    const save = () => { const v = Array.from(inp.value.trim()).slice(0, NAME_MAX).join('').trim(); if (!v) { toast('Введите имя'); return; } st().name = v; S.save(); closeModal(); render(); };
    $('#nmOk', m).onclick = save;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
  }

  /* ───────────────── Лиги и лидерборд ───────────────── */
  const AV_COLORS = ['#FF9600', '#1CB0F6', '#CE82FF', '#FF4B4B', '#58CC02', '#2B70C9', '#FFC800', '#00CD9C'];
  function weekFraction() {
    const f = (Date.now() - S.weekStart().getTime()) / (7 * 86400000);
    return Math.max(0, Math.min(1, f));
  }
  function board(weekKey, league, f, playerXp) {
    const r = mulberry32(hash(weekKey + '|' + league));
    const names = shuffle(D.botNames, r).slice(0, 14);
    const rows = names.map((n, i) => {
      const target = Math.round((30 + r() * 390) * (1 + league * 0.35));
      const curve = 0.6 + r() * 1.2;
      return { name: n, xp: Math.round(target * Math.pow(f, curve)), color: AV_COLORS[i % AV_COLORS.length], me: false };
    });
    rows.push({ name: st().name || 'Вы', xp: playerXp, me: true });
    rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0));
    return rows;
  }
  function timeLeft() {
    const end = S.weekStart(); end.setDate(end.getDate() + 7);
    const ms = Math.max(0, end.getTime() - Date.now());
    const d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000), m = Math.floor((ms % 3600000) / 60000);
    return d > 0 ? `${d} ${plural(d, ['день', 'дня', 'дней'])} ${h} ч` : `${h} ч ${m} мин`;
  }
  function processWeek() {
    const s = st(), wk = S.weekKey();
    if (s.week && s.week.key === wk) return;
    const old = s.week || { key: wk, xp: 0 };
    if (old.key && old.xp > 0) {
      const rows = board(old.key, s.league, 1, old.xp);
      const rank = rows.findIndex(x => x.me) + 1;
      let to = s.league;
      if (rank <= 5 && s.league < D.leagues.length - 1) to++;
      else if (rank >= rows.length - 2 && s.league > 0) to--;
      s.pendingLeagueResult = { from: s.league, to, rank };
      s.league = to;
    }
    s.week = { key: wk, xp: 0 };
    S.save();
  }
  function leagueResultModal(onClose) {
    const r = st().pendingLeagueResult;
    if (!r) { if (onClose) onClose(); return; }
    st().pendingLeagueResult = null; S.save();
    const up = r.to > r.from, down = r.to < r.from, name = D.leagues[r.to].name;
    const m = openModal(`<div class="big-emo">${up ? '🚀' : down ? '😔' : '🏅'}</div><h2>${up ? 'Повышение!' : down ? 'Понижение' : 'Неделя завершена'}</h2>
      <p>Вы заняли ${r.rank}-е место. ${up ? `Добро пожаловать в ${leagueAcc(name)} лигу!` : down ? `Вы переходите в ${leagueAcc(name)} лигу. Всё получится!` : `Вы остаётесь в ${leaguePrep(name)} лиге.`}</p>
      <button class="btn" data-ok>Отлично</button>`, { center: true, onClose });
    if (up) { sfx('complete'); confetti(); }
    $('[data-ok]', m).onclick = () => closeModal();
  }

  function renderLeagues(scr) {
    processWeek();
    const s = st(), lg = D.leagues[s.league];
    scr.innerHTML = `<div class="view">
      <div class="league-hero"><div class="hero-gerb">${gerbSvg()}</div><div class="league-badges">${D.leagues.map((l, i) => `<div class="lbadge ${i === s.league ? 'cur' : ''}" style="background:${i <= s.league ? l.color : '#E5E5E5'}">${i < s.league ? '✔' : i === s.league ? '🏆' : '🔒'}</div>`).join('')}</div>
        <h1 class="title" style="margin:6px 0 4px">${esc(lg.name)} лига</h1>
        <div class="tm">${s.league < D.leagues.length - 1 ? `Топ-5 перейдут в ${leagueAcc(D.leagues[s.league + 1].name)} лигу` : 'Вы в высшей лиге!'}</div>
        <div class="tm" style="margin-top:4px">⏳ До конца недели: <b id="lgTime">${timeLeft()}</b></div></div>
      <div id="lbList"></div>
      <p class="disclaimer">Соперники — виртуальные участники офлайн-режима. Их очки растут в течение недели, рейтинг обновляется автоматически.</p></div>`;
    drawBoard();
    ui.lbTimer = setInterval(() => {
      if (ui.view !== 'leagues') return;
      drawBoard();
      const t = $('#lgTime'); if (t) t.textContent = timeLeft();
    }, 15000);
  }
  function drawBoard() {
    const s = st(), box = $('#lbList');
    if (!box) return;
    const rows = board(S.weekKey(), s.league, weekFraction(), s.week.xp);
    const canUp = s.league < D.leagues.length - 1, canDown = s.league > 0;
    let h = '';
    rows.forEach((r, i) => {
      const rank = i + 1;
      if (rank === 6 && canUp) h += '<div class="zone up">⬆ Зона повышения</div>';
      if (rank === rows.length - 2 && canDown) h += '<div class="zone down">⬇ Зона понижения</div>';
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
      h += `<div class="lb-row ${r.me ? 'me' : ''}"><div class="rk ${rank <= 3 ? 'top' : ''}">${medal}</div>
        <div class="av" style="background:${r.me ? '#DDF4FF' : r.color}">${r.me ? M.svg(s.equip, { cls: 'mini' }) : esc(r.name.charAt(0))}</div>
        <div class="nm">${esc(r.name)}${r.me ? ' (вы)' : ''}</div><div class="xp">${fmt(r.xp)} XP</div></div>`;
    });
    box.innerHTML = h;
  }

  /* ───────────────── Настройки ───────────────── */
  function applyReminder() {
    const s = st().settings;
    const parts = String(s.notifTime || '19:00').split(':');
    const h = parseInt(parts[0], 10) || 0, m = parseInt(parts[1], 10) || 0;
    if (native) { bridge('setReminder', !!s.notif, h, m); return; }
    const ln = capPlugin('LocalNotifications');
    if (ln) {
      ln.cancel({ notifications: [{ id: 1 }] }).catch(() => {}).then(() => {
        if (!s.notif) return;
        return ln.schedule({ notifications: [{ id: 1, title: 'BuryatGo', body: 'Амар мэндэ! Пора позаниматься, чтобы не потерять серию 🔥', schedule: { on: { hour: h, minute: m }, repeats: true, allowWhileIdle: true } }] });
      }).catch(() => {});
    }
  }
  function toggleNotif(on) {
    const s = st().settings;
    s.notif = on; S.save();
    if (!on) { applyReminder(); toast('Напоминания выключены'); return; }
    if (native) { applyReminder(); toast('🔔 Напомню каждый день в ' + s.notifTime); return; }
    const ln = capPlugin('LocalNotifications');
    if (ln) {
      ln.requestPermissions().then(r => {
        if (r && r.display === 'granted') { applyReminder(); toast('🔔 Напомню каждый день в ' + s.notifTime); }
        else { s.notif = false; S.save(); toast('Разрешите уведомления в настройках iPhone'); if (ui.view === 'settings') render(); }
      }).catch(() => {});
      return;
    }
    if ('Notification' in window) {
      Notification.requestPermission().then(p => {
        toast(p === 'granted' ? '🔔 Расписание напоминаний работает в Android-приложении' : 'Разрешите уведомления в настройках');
      }).catch(() => {});
    } else toast('🔔 Напоминания работают в Android-приложении');
  }
  function testNotification() {
    if (native) { bridge('testNotification'); toast('Отправлено тестовое уведомление'); return; }
    const ln = capPlugin('LocalNotifications');
    if (ln) {
      ln.schedule({ notifications: [{ id: 2, title: 'BuryatGo', body: 'Так будет выглядеть напоминание. Баярлаа! 👍', schedule: { at: new Date(Date.now() + 3000) } }] })
        .then(() => toast('Уведомление придёт через 3 секунды')).catch(() => toast('Разрешите уведомления'));
      return;
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification('BuryatGo', { body: 'Амар мэндэ! Пора позаниматься 🔥' }); } catch (e) { toast('Уведомления недоступны в этом браузере'); }
    } else toast('Тест доступен в Android-приложении');
  }

  /* ---------- Аккаунт (логин + пароль) и облачное сохранение ---------- */
  function cloudSubText() {
    const C = window.BG_CLOUD;
    if (!C || !C.user()) return '';
    if (C.pending()) return navigator.onLine === false ? 'Нет интернета — сохраним позже' : 'Сохраняем…';
    const t = C.syncedAt();
    if (!t) return 'Синхронизация…';
    const d = new Date(t), p = n => String(n).padStart(2, '0');
    const same = new Date().toDateString() === d.toDateString();
    return '☁️ Сохранено ' + (same ? 'сегодня' : p(d.getDate()) + '.' + p(d.getMonth() + 1)) + ' в ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function cloudRow(row) {
    const C = window.BG_CLOUD;
    if (!C || !C.configured()) return '';
    if (C.user()) return `<div class="set-row"><div class="lb">🔐 ${esc(C.user())}<small id="cloudSub">${cloudSubText()}</small></div><button class="btn small ghost dark" id="cloudOut">Выйти</button></div>`;
    return row('🔐 Логин и пароль', 'Прогресс не пропадёт и перенесётся на любой телефон', '<button class="btn small blue" id="cloudIn">Войти</button>');
  }
  function cloudModal(mode) {
    const C = window.BG_CLOUD;
    if (!C || !C.configured()) { toast('Облако ещё не подключено'); return; }
    const isIn = mode !== 'up';
    const label = isIn ? 'Войти' : 'Создать аккаунт';
    const m = openModal(`<div class="big-emo">${isIn ? '🔐' : '✨'}</div>
      <h2>${isIn ? 'Вход в аккаунт' : 'Новый аккаунт'}</h2>
      <p>${isIn ? 'Ваш прогресс загрузится на этом устройстве.' : 'Текущий прогресс сохранится в аккаунт. Запомните логин и пароль!'}</p>
      <form class="cloud-form" id="cForm" autocomplete="on">
        <input class="cloud-in" id="cLogin" name="username" placeholder="Логин (латиница, 3–20)" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="20">
        <input class="cloud-in" id="cPass" name="password" type="password" placeholder="Пароль (от 6 символов)" autocomplete="${isIn ? 'current-password' : 'new-password'}" maxlength="64">
        <p class="cloud-err" id="cErr"></p>
        <div class="stack"><button class="btn" id="cGo" type="submit">${label}</button>
        <button class="btn ghost dark" id="cSwitch" type="button">${isIn ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}</button>
        <button class="btn ghost dark" id="cClose" type="button">Закрыть</button></div>
      </form>`, { center: true });
    const err = t => { $('#cErr', m).textContent = t || ''; };
    $('#cClose', m).onclick = closeModal;
    $('#cSwitch', m).onclick = () => cloudModal(isIn ? 'up' : 'in');
    const btn = $('#cGo', m);
    $('#cForm', m).onsubmit = async ev => {
      ev.preventDefault();
      if (btn.disabled) return;
      const login = $('#cLogin', m).value, pass = $('#cPass', m).value;
      err(''); btn.disabled = true; btn.textContent = '⏳ Подождите…';
      try {
        if (!isIn) {
          await C.signUp(login, pass);
          closeModal(); haptic('success');
          toast('☁️ Аккаунт создан! Прогресс сохраняется', 2600);
          render();
        } else {
          const r = await C.signIn(login, pass);
          closeModal(); haptic('success');
          if (r.restored) { toast('☁️ Прогресс загружен!', 1500); setTimeout(() => location.reload(), 900); }
          else { toast('☁️ Вы вошли. Прогресс сохранён в аккаунт', 2600); render(); }
        }
      } catch (e) {
        haptic('error'); err(e.message);
        btn.disabled = false; btn.textContent = label;
      }
    };
    setTimeout(() => { const l = $('#cLogin', m); if (l) l.focus(); }, 60);
  }
  function cloudLogout() {
    const C = window.BG_CLOUD;
    confirmBox({ emoji: '👋', title: 'Выйти из аккаунта?',
      text: 'Прогресс сохранён в аккаунте. На этом устройстве он будет удалён — войдите снова, чтобы вернуть его.',
      ok: 'Остаться', cancel: 'Выйти',
      onCancel: () => {
        toast('☁️ Сохраняем…');
        C.signOut().then(() => { A.setMusic(false); S.reset(); location.reload(); });
      } });
  }
  function installHelp() {
    const m = openModal(`<div class="big-emo">📲</div><h2>Установите BuryatGo</h2>
      <ol class="install-steps">
        <li>Нажмите кнопку <b>«Поделиться»</b> ⬆️ внизу Safari</li>
        <li>Выберите <b>«На экран Домой»</b> ➕</li>
        <li>Нажмите <b>«Добавить»</b> — игра появится среди приложений</li>
      </ol>
      <p>Открывайте BuryatGo с иконки: во весь экран, без интернета и с надёжным сохранением.</p>
      <div class="stack"><button class="btn" id="pwaOk">Понятно</button></div>`, { center: true });
    $('#pwaOk', m).onclick = closeModal;
  }
  if (window.BG_CLOUD) BG_CLOUD.onChange(() => { const e = document.getElementById('cloudSub'); if (e) e.textContent = cloudSubText(); });
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#onbLogin')) cloudModal('in'); });

  function renderSettings(scr) {
    const s = st(), cfg = s.settings, prem = S.isPremium();
    const sw = (key, on) => `<button class="switch ${on ? 'on' : ''}" data-sw="${key}" role="switch" aria-checked="${on}"></button>`;
    const row = (lb, small, ctl) => `<div class="set-row"><div class="lb">${lb}${small ? `<small>${small}</small>` : ''}</div>${ctl}</div>`;
    const pills = (name, vals, cur) => `<div class="pills">${vals.map(v => `<button data-${name}="${v[0]}" class="${String(v[0]) === String(cur) ? 'on' : ''}">${v[1]}</button>`).join('')}</div>`;
    let subRow;
    if (prem) subRow = row('👑 BuryatGo Super', `${s.premium.plan === 'year' ? 'Годовой' : 'Месячный'} тариф · до ${humanDate(s.premium.until)}${s.premium.autoRenew === false ? ' · автопродление выкл.' : ''}`,
      s.premium.autoRenew === false ? '<button class="btn small blue" id="subRenew">Возобновить</button>' : '<button class="btn small ghost dark" id="subCancel">Отменить</button>');
    else subRow = row('👑 BuryatGo Super', 'Не оформлена', '<button class="btn small purple" id="subBuy">Оформить</button>');
    scr.innerHTML = `<div class="view pad">
      <div class="back-head"><button class="icon-btn" id="setBack" aria-label="Назад">←</button><h1 class="title" style="margin:0">Настройки</h1></div>
      <h2 class="sub">Звуковые эффекты</h2>
      <div class="set-group">
        ${row('🔘 Нажатия', 'Звук кнопок', sw('sfxClick', cfg.sfxClick))}
        ${row('✅ Правильный ответ', 'И награды', sw('sfxCorrect', cfg.sfxCorrect))}
        ${row('❌ Ошибка', '', sw('sfxWrong', cfg.sfxWrong))}
      </div>
      <h2 class="sub">Музыка и озвучка</h2>
      <div class="set-group">
        ${row('🎵 Фоновая музыка', 'Спокойная мелодия степи', sw('music', cfg.music))}
        ${row('🔉 Громкость музыки', '', `<input type="range" id="musVol" min="0" max="1" step="0.05" value="${cfg.musicVol}" style="width:130px">`)}
        ${row('🗣️ Озвучка слов', 'Синтез речи устройства', sw('tts', cfg.tts))}
        <div class="set-row" style="flex-wrap:wrap"><div class="lb">🐢 Скорость речи</div>${pills('rate', [[0.6, 'Медленно'], [0.85, 'Нормально'], [1.05, 'Быстро']], cfg.ttsRate)}</div>
        ${row('🎙️ Голос', 'По умолчанию — женский голос (Irina)', '<select id="voiceSel" class="voice-sel"><option value="female">Женский голос</option><option value="male">Мужской голос</option></select>')}
        ${row('🔊 Проверить озвучку', '«Амар мэндэ!»', '<button class="btn small blue" id="ttsTest">Слушать</button>')}
        ${row('👋 Проверить прощание', '«Баяртай!» звучит как «Баяртэ»', '<button class="btn small blue" id="ttsBye">Слушать</button>')}
        ${row('📳 Вибрация', 'Тактильный отклик', sw('haptics', cfg.haptics))}
      </div>
      <p class="disclaimer" style="margin-top:-4px">Учебные материалы составлены для начинающих. Рекомендуем сверять произношение с носителем языка.</p>
      <h2 class="sub">Уведомления</h2>
      <div class="set-group">
        ${row('🔔 Ежедневное напоминание', 'Чтобы не потерять серию', sw('notif', cfg.notif))}
        ${row('⏰ Время', '', `<input type="time" id="notifTime" value="${esc(cfg.notifTime)}">`)}
        ${row('🧪 Тестовое уведомление', '', '<button class="btn small blue" id="notifTest">Отправить</button>')}
      </div>
      <h2 class="sub">Обучение</h2>
      <div class="set-group">
        <div class="set-row" style="flex-wrap:wrap"><div class="lb">🎯 Дневная цель<small>XP в день</small></div>${pills('goal', [[10, '10'], [20, '20'], [30, '30'], [50, '50']], cfg.dailyGoal)}</div>
      </div>
      <h2 class="sub">Аккаунт</h2>
      <div class="set-group">
        ${cloudRow(row)}
        ${window.BG_PWA && BG_PWA.needsInstall() ? row('📲 На экран «Домой»', 'Игра откроется как приложение', '<button class="btn small blue" id="pwaHow">Как?</button>') : ''}
        ${row('👤 Имя', esc(s.name), '<button class="btn small ghost dark" id="setName">Изменить</button>')}
        ${subRow}
        ${row('♻️ Восстановить покупки', '', '<button class="btn small ghost dark" id="restore">Восстановить</button>')}
        ${row('🗑️ Сбросить прогресс', 'Удалить все данные на устройстве', '<button class="btn small red" id="reset">Сброс</button>')}
      </div>
      <button class="btn dev-open" id="devOpen">🛠️ Панель разработчика</button>
      <p class="disclaimer"><span id="verTap" class="ver-tap">BuryatGo 1.9</span> · ${window.BG_CLOUD && BG_CLOUD.user() ? 'Прогресс сохраняется в аккаунте.' : 'Данные хранятся на устройстве.'}<br>Баярлаа! — Спасибо, что учите бурятский язык ❤️</p>
    </div>`;

    $('#setBack').onclick = () => go('profile');
    $('#verTap').onclick = onVersionTap;
    $('#devOpen').onclick = openDeveloper;
    $$('[data-sw]', scr).forEach(b => {
      b.onclick = () => {
        const key = b.dataset.sw, on = !cfg[key];
        b.classList.toggle('on', on); b.setAttribute('aria-checked', on);
        if (key === 'notif') { toggleNotif(on); return; }
        cfg[key] = on; S.save();
        if (key === 'music') A.setMusic(on);
        if (key === 'haptics' && on) haptic('success');
      };
    });
    const vol = $('#musVol');
    vol.oninput = () => A.setMusicVolume(parseFloat(vol.value));
    vol.onchange = () => { cfg.musicVol = parseFloat(vol.value); S.save(); };
    $$('[data-rate]', scr).forEach(b => { b.onclick = () => { cfg.ttsRate = parseFloat(b.dataset.rate); S.save(); $$('[data-rate]', scr).forEach(x => x.classList.toggle('on', x === b)); speak('Амар мэндэ!'); }; });
    $$('[data-goal]', scr).forEach(b => { b.onclick = () => { cfg.dailyGoal = parseInt(b.dataset.goal, 10); S.save(); $$('[data-goal]', scr).forEach(x => x.classList.toggle('on', x === b)); toast('🎯 Цель: ' + cfg.dailyGoal + ' XP в день'); }; });
    $('#ttsTest').onclick = () => { if (!cfg.tts) { toast('Включите озвучку слов'); return; } speak('Амар мэндэ!'); };
    $('#ttsBye').onclick = () => { if (!cfg.tts) { toast('Включите озвучку слов'); return; } speak('Баяртай!'); };
    const vs = $('#voiceSel');
    vs.value = cfg.voice === 'male' ? 'male' : 'female';
    vs.onchange = () => { cfg.voice = vs.value; S.save(); A.setVoice(cfg.voice); speak('Амар мэндэ!'); };
    const nt = $('#notifTime');
    nt.onchange = () => { if (!nt.value) return; cfg.notifTime = nt.value; S.save(); if (cfg.notif) { applyReminder(); toast('⏰ Напоминание в ' + nt.value); } };
    $('#notifTest').onclick = testNotification;
    $('#setName').onclick = editName;
    const cIn = $('#cloudIn'); if (cIn) cIn.onclick = () => cloudModal('in');
    const cOut = $('#cloudOut'); if (cOut) cOut.onclick = cloudLogout;
    const pwh = $('#pwaHow'); if (pwh) pwh.onclick = installHelp;
    $('#restore').onclick = restorePurchases;
    const sb = $('#subBuy'); if (sb) sb.onclick = () => openPaywall();
    const sc = $('#subCancel');
    if (sc) sc.onclick = () => confirmBox({ emoji: '😿', title: 'Отменить подписку?', text: `Автопродление будет отключено. Super продолжит работать до ${humanDate(s.premium.until)}.`,
      ok: 'Оставить Super', cancel: 'Отменить подписку',
      onCancel: () => { s.premium.autoRenew = false; saveReceipt(); S.save(); toast('Автопродление отключено'); render(); } });
    const sr = $('#subRenew');
    if (sr) sr.onclick = () => { s.premium.autoRenew = true; saveReceipt(); S.save(); toast('Автопродление включено 👑'); render(); };
    $('#reset').onclick = () => confirmBox({ emoji: '⚠️', title: 'Сбросить весь прогресс?', text: 'Уроки, XP, Буузы, серия и покупки в магазине будут удалены. Это нельзя отменить.',
      ok: 'Сбросить', okClass: 'red', cancel: 'Отмена',
      onOk: () => { A.setMusic(false); if (native) bridge('setReminder', false, 0, 0); S.reset(); ui.onbStep = 0; ui.onbName = ''; ui.tab = 'home'; go('onboarding'); toast('Прогресс сброшен'); } });
  }

  /* ───────────────── Панель разработчика ─────────────────
     Вход: Настройки → 7 нажатий на «BuryatGo 1.0» внизу экрана.
     Логин и пароль хранятся не текстом, а в виде SHA-256 хэша с солью. */
  /* Панель разработчика открывается сразу, без логина и пароля */
  function openDeveloper() {
    if (ui.devAuth) { sfx('pop'); haptic('success'); go('developer'); return; }
    sfx('pop');
    const m = openModal(`<div class="dev-lock"><div class="dl-ic">🔐</div><h2>Панель разработчика</h2><p class="muted">Введите секретный пароль</p>
      <input type="password" id="devPass" class="dev-pass" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="Secret-Password" aria-label="Secret-Password"></div>
      <div class="stack"><button class="btn ghost dark" data-act="close">Отмена</button></div>`, { center: true });
    const inp = $('#devPass', m);
    $('[data-act=close]', m).onclick = () => closeModal();
    setTimeout(() => { if (inp) inp.focus(); }, 80);
    inp.oninput = () => {
      const v = inp.value.trim();
      if (v === DEV_PASS) {
        ui.devAuth = true; inp.blur(); closeModal();
        sfx('coin'); haptic('success'); toast('🔓 Доступ администратора открыт');
        go('developer');
        setTimeout(() => { const d = $('#devDock'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 900);
        return;
      }
      if (v.length >= DEV_PASS.length) {
        haptic('error'); sfx('wrong'); toast('Неверный пароль');
        inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake');
        setTimeout(() => { inp.value = ''; }, 260);
      }
    };
  }
  function onVersionTap() { openDeveloper(); }

  function renderDeveloper(scr) {
    if (!ui.devAuth) { scr.innerHTML = ''; setTimeout(() => { go('profile'); openDeveloper(); }, 0); return; }
    const s = st();
    const head = `<div class="back-head"><button class="icon-btn" id="devBack" aria-label="Назад">←</button><h1 class="title" style="margin:0">Для разработчика</h1></div>`;
    const prem = S.isPremium();
    scr.innerHTML = `<div class="view pad">${head}
      <div class="dev-balance"><span class="big"><img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false></span><div><div class="big" id="devBz">${fmt(s.buzzy)}</div><div class="muted" style="font-size:12px;font-weight:800">Буузы на устройстве</div></div></div>
      <h2 class="sub">Буузы</h2>
      <div class="set-group dev-pad">
        <div class="dev-grid">${[-100, -10, 10, 100, 500, 1000].map(v => `<button class="btn small ${v < 0 ? 'red' : 'blue'}" data-dz="${v}">${v > 0 ? '+' : '−'}${Math.abs(v)}</button>`).join('')}</div>
        <div class="dev-row"><input type="number" id="devAmt" inputmode="numeric" min="1" step="1" placeholder="Сумма"><button class="btn small" id="devAdd">Начислить</button><button class="btn small red" id="devSub">Списать</button></div>
      </div>
      <h2 class="sub">Подписка</h2>
      <div class="set-group">
        <div class="set-row"><div class="lb">👑 BuryatGo Super<small>${prem ? 'Активна до ' + humanDate(s.premium.until) : 'Выключена'}</small></div><button class="switch ${prem ? 'on' : ''}" id="devPrem" role="switch" aria-checked="${prem}"></button></div>
      </div>
      <p class="disclaimer">Изменения сохраняются только на этом устройстве. При включении Super здесь бонус +500 не начисляется.</p>
      <button class="btn ghost dark" id="devOut">Закрыть панель</button>
      <div id="devDock" class="dev-dock is-loading" aria-busy="true"><div class="dock-title">⚙️ Расширенная панель управления</div><div class="dev-skel"></div><div class="dev-skel"></div><div class="dev-skel short"></div></div></div>`;
    const change = (d) => {
      d = Math.trunc(d); if (!d) return;
      const before = s.buzzy;
      s.buzzy = Math.max(0, s.buzzy + d); S.save();
      const real = s.buzzy - before;
      $('#devBz').textContent = fmt(s.buzzy); renderTop();
      sfx(real > 0 ? 'coin' : 'click');
      toast((real >= 0 ? '+' : '−') + Math.abs(real) + ' <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> · баланс ' + fmt(s.buzzy));
    };
    $$('[data-dz]', scr).forEach(b => { b.onclick = () => change(+b.dataset.dz); });
    const amt = () => { const v = Math.abs(parseInt($('#devAmt').value, 10)); if (!v) { toast('Введите сумму'); return 0; } return Math.min(v, 1000000); };
    $('#devAdd').onclick = () => { const v = amt(); if (v) change(v); };
    $('#devSub').onclick = () => { const v = amt(); if (v) change(-v); };
    $('#devPrem').onclick = () => {
      if (S.isPremium()) s.premium = null;
      else s.premium = { plan: 'year', since: S.today(), until: S.addDays(S.today(), 365), autoRenew: true, dev: true };
      saveReceipt(); S.save();
      toast(S.isPremium() ? '👑 Super включён' : 'Super выключен');
      render();
    };
    $('#devBack').onclick = () => go('settings');
    $('#devOut').onclick = () => go('settings');
    loadDevDock();
  }

  /* Дополнительная панель (подгружается после входа): точный баланс + живые игроки */
  function setExactBuzzy(v) {
    const s = st();
    v = Math.trunc(Number(v));
    if (!isFinite(v) || v < 0) { toast('Введите число от 0'); return false; }
    s.buzzy = Math.min(v, 10000000); S.save();
    const b = $('#devBz'); if (b) b.textContent = fmt(s.buzzy);
    renderTop(); sfx('coin'); haptic('success');
    toast('Баланс установлен: ' + fmt(s.buzzy) + ' <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false>');
    return true;
  }
  function agoText(ms) {
    const m = Math.max(0, Math.round((Date.now() - (ms || 0)) / 60000));
    if (m < 3) return 'онлайн';
    if (m < 60) return m + ' мин назад';
    if (m < 1440) return Math.round(m / 60) + ' ч назад';
    return Math.round(m / 1440) + ' дн назад';
  }
  function loadDevDock() {
    const dock = $('#devDock'); if (!dock) return;
    const s = st();
    S.fetchPlayers().then(res => {
      if (!$('#devDock')) return;
      const list = (res.players || []).slice().sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
      ui.devPlayers = list;
      dock.classList.remove('is-loading'); dock.removeAttribute('aria-busy');
      dock.innerHTML = `<div class="dock-title">⚙️ Расширенная панель управления</div>
        <h2 class="sub">Точный баланс Бууз</h2>
        <div class="set-group dev-pad"><div class="dev-row"><input type="number" id="devSet" inputmode="numeric" min="0" step="1" value="${s.buzzy}"><button class="btn small blue" id="devSetBtn">Установить</button></div>
          <div class="muted dock-note">Задаёт ровно такое количество Бууз на этом устройстве (0 — 10 000 000).</div></div>
        <h2 class="sub">Живые игроки · ${list.length}</h2>
        <div class="set-group dev-players">${list.map(p => `<button class="dev-player" data-pid="${esc(p.id)}">
            <span class="dp-av">${M.svg(p.equip || {}, { cls: 'static' })}</span>
            <span class="dp-main"><b>${esc(p.name || 'Игрок')}${p.id === s.playerId ? ' <em>(вы)</em>' : ''}${p.premium ? ' 👑' : ''}</b>
              <small><i class="dot ${agoText(p.lastSeen) === 'онлайн' ? 'on' : ''}"></i>${agoText(p.lastSeen)} · ${fmt(p.xp || 0)} XP · 🔥 ${p.streak || 0}</small></span>
            <span class="dp-bz">${fmt(p.buzzy || 0)} <img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false></span></button>`).join('') || '<div class="set-row">Активных игроков нет</div>'}</div>
        <p class="disclaimer">Источник: ${res.source === 'server' ? 'сервер игроков' : 'локальный реестр устройства. Для игроков с других телефонов укажите адрес сервера в BG_PLAYERS_API'}.</p>
        <button class="btn ghost dark" id="devReload">↻ Обновить список</button>`;
      $('#devSetBtn').onclick = () => { if (setExactBuzzy($('#devSet').value)) $('#devSet').value = st().buzzy; };
      $('#devReload').onclick = () => { dock.classList.add('is-loading'); loadDevDock(); };
      $$('.dev-player', dock).forEach(b => { b.onclick = () => { const p = ui.devPlayers.find(x => x.id === b.dataset.pid); if (p) devPlayerModal(p); }; });
    });
  }
  function devPlayerModal(p) {
    const me = p.id === st().playerId;
    const acc = p.answers ? Math.round((p.correct || 0) / p.answers * 100) + '%' : '—';
    const lg = D.leagues[p.league || 0] || D.leagues[0];
    const cells = [
      ['⚡ Опыт', fmt(p.xp || 0) + ' XP'], ['📅 За неделю', fmt(p.weekXp || 0) + ' XP'],
      ['🥟 Буузы', fmt(p.buzzy || 0)], ['💰 Заработано', fmt(p.buzzyEarned || 0)],
      ['🔥 Серия', (p.streak || 0) + ' · рекорд ' + (p.bestStreak || 0)], ['🧊 Заморозки', p.freezes || 0],
      ['🏆 Лига', esc(lg.name)], ['📘 Уроков', (p.lessonsDone || 0) + ' из ' + D.lessonIndex.length],
      ['📖 Слов', p.words || 0], ['🎯 Точность', acc],
      ['✨ Идеальных', p.perfect || 0], ['🛍️ Покупок', (p.purchases || 0) + ' · предметов ' + (p.owned || 0)],
      ['👑 Super', p.premium ? 'до ' + humanDate(p.premiumUntil) : 'нет'], ['🎯 Цель', (p.dailyGoal || 0) + ' XP/день'],
      ['🗓️ С нами с', p.createdAt ? humanDate(p.createdAt) : '—'], ['🟢 Активность', agoText(p.lastSeen)]
    ];
    const m = openModal(`<div class="dp-modal"><div class="dp-head"><span class="dp-av big">${M.svg(p.equip || {}, { cls: 'static', mood: 'happy' })}</span>
        <div><div class="title" style="margin:0">${esc(p.name || 'Игрок')}</div><div class="muted" style="font-size:12px;font-weight:700">ID ${esc(String(p.id).slice(0, 12))} · ${esc(p.device || '')}</div></div></div>
      <div class="dp-grid">${cells.map(c => `<div class="dp-cell"><small>${c[0]}</small><b>${c[1]}</b></div>`).join('')}</div>
      ${me ? `<div class="dev-row" style="margin-top:12px"><input type="number" id="dpSet" min="0" step="1" value="${st().buzzy}"><button class="btn small blue" id="dpSetBtn">Установить Буузы</button></div>` : '<p class="disclaimer">Баланс можно точно изменить только на устройстве игрока.</p>'}
      <button class="btn" data-ok style="margin-top:12px">Закрыть</button></div>`);
    $('[data-ok]', m).onclick = closeModal;
    if (me) $('#dpSetBtn', m).onclick = () => { if (setExactBuzzy($('#dpSet', m).value)) { closeModal(); loadDevDock(); } };
  }

  /* ───────────────── Paywall / подписка ───────────────── */
  const RECEIPT_KEY = 'buryatgo_receipt_v1';
  function saveReceipt() { try { localStorage.setItem(RECEIPT_KEY, JSON.stringify(st().premium)); } catch (e) {} }
  function restorePurchases() {
    let r = null;
    try { r = JSON.parse(localStorage.getItem(RECEIPT_KEY) || 'null'); } catch (e) { r = null; }
    if (r && r.until && S.diffDays(S.today(), r.until) >= 0) {
      st().premium = r; S.save();
      toast('♻️ Подписка восстановлена до ' + humanDate(r.until));
      if (modalOpen()) closeModal();
      render();
    } else toast('Активных покупок не найдено');
  }

  function openPaywall() {
    if (S.isPremium()) { toast('👑 BuryatGo Super уже активна'); return; }
    const P = D.prices, perMonth = Math.round(P.year / 12), save = P.month * 12 - P.year;
    let plan = 'year';
    const m = openModal(`<div class="paywall">
      <button class="x-btn" id="pwClose" style="position:absolute;top:14px;left:14px;color:#fff" aria-label="Закрыть">✕</button>
      <div class="pw-hero"><div class="pm">${M.svg({ hat: 'malgai_gold', outfit: 'degel_gold', hand: null, acc: null }, { mood: 'happy', cls: 'wave' })}</div>
        <h1>BuryatGo <span>Super</span></h1><p>Учите бурятский без ограничений</p></div>
      <div class="pw-feats">
        <div class="pw-feat"><div class="fi">🔓</div><div><b>+5 эксклюзивных модулей</b><br><small>Праздники, Числа, Байкал, Чувства и Путешествие — итого 15 модулей</small></div></div>
        <div class="pw-feat"><div class="fi"><img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false></div><div><b>Двойные Буузы + 500 сразу</b><br><small>Бонус при оформлении, далее ×2 за уроки и серии</small></div></div>
        <div class="pw-feat"><div class="fi">🧥</div><div><b>Праздничный дэгэл</b><br><small>Эксклюзивная одежда для Бато</small></div></div>
        <div class="pw-feat"><div class="fi">❤️</div><div><b>Поддержка языка</b><br><small>Помогаете создавать новые уроки</small></div></div>
      </div>
      <div class="plans">
        <button class="plan on" data-plan="year"><span class="best">Выгоднее · −${fmt(save)} ₽</span><span class="radio"></span>
          <span class="pn"><b>12 месяцев</b><small>${fmt(perMonth)} ₽/мес</small></span><span class="pp">${fmt(P.year)} ₽<small>в год</small></span></button>
        <button class="plan" data-plan="month"><span class="radio"></span>
          <span class="pn"><b>1 месяц</b><small>Можно отменить в любой момент</small></span><span class="pp">${fmt(P.month)} ₽<small>в месяц</small></span></button>
      </div>
      <button class="btn gold" id="pwBuy" data-silent>Оформить за ${fmt(P.year)} ₽</button>
      <div class="pw-links"><button class="link" id="pwRestore">Восстановить покупки</button></div>
      <p class="pw-legal">Демо-версия: деньги не списываются. В релизной версии оплата проходит через Google Play. Подписка продлевается автоматически; отменить можно в любой момент в настройках.</p>
    </div>`, { full: true });
    const buy = $('#pwBuy', m);
    $$('.plan', m).forEach(b => {
      b.onclick = () => {
        plan = b.dataset.plan;
        $$('.plan', m).forEach(x => x.classList.toggle('on', x === b));
        buy.textContent = 'Оформить за ' + fmt(plan === 'year' ? P.year : P.month) + ' ₽';
      };
    });
    $('#pwClose', m).onclick = () => closeModal();
    $('#pwRestore', m).onclick = restorePurchases;
    buy.onclick = () => purchase(plan);
  }

  function purchase(plan) {
    sfx('pop');
    const m = openModal(`<div class="spinner"></div><h2>Обработка платежа…</h2><p>Пожалуйста, не закрывайте приложение</p>`, { center: true, locked: true });
    setTimeout(() => {
      const s = st();
      s.premium = { plan, since: S.today(), until: S.addDays(S.today(), plan === 'year' ? 365 : 30), autoRenew: true };
      const bonus = D.premiumBonus || 500;
      s.buzzy += bonus; s.buzzyEarned += bonus;
      saveReceipt(); S.save(); renderTop();
      if (!modalOpen()) return;
      const ok = openModal(`<div class="r-m jump" style="width:140px;margin:0 auto">${M.svg({ hat: 'malgai_gold', outfit: 'degel_gold', hand: null, acc: null }, { mood: 'happy', cls: 'wave' })}</div>
        <h2>Добро пожаловать в Super! 👑</h2>
        <p>Все модули открыты до ${humanDate(s.premium.until)}. Баярлаа!</p>
        <div class="bonus-pill"><img class=bz-ic src=assets/images/buuza-icon.png alt=Буузы draggable=false> +${bonus} ${plural(bonus, ['Бууза', 'Буузы', 'Бууз'])} на счёт</div>
        <button class="btn gold" data-ok>${(horseState().owned.length || horseState().freeUsed) ? 'Начать учиться' : '🐎 Выбрать коня'}</button>`, { center: true, onClose: () => { if (ui.view !== 'lesson') render(); } });
      sfx('complete'); setTimeout(() => sfx('coin'), 450); haptic('success'); confetti();
      $('[data-ok]', ok).onclick = () => { if (horseState().owned.length || horseState().freeUsed) closeModal(); else horsePicker(() => { if (ui.view !== 'lesson') render(); }); };
    }, 1600);
    return m;
  }

  /* ───────────────── Онбординг ───────────────── */
  function renderOnboarding(scr) {
    const step = ui.onbStep;
    let body = '';
    if (step === 0) {
      body = `<div class="om jump">${M.svg({ hat: 'malgai_blue', outfit: 'degel_blue', hand: 'hadak', acc: null }, { mood: 'happy', cls: 'wave' })}</div>
        <h1>Амар мэндэ!</h1><p>Я Бато. Вместе мы выучим бурятский язык — по 5 минут в день, весело и без стресса.</p>
        <div class="grow"></div>
        <div class="stack"><button class="btn" id="onbNext">Начать</button>${window.BG_CLOUD && BG_CLOUD.configured() ? '<button class="btn ghost" id="onbLogin">У меня уже есть аккаунт</button>' : ''}</div>`;
    } else if (step === 1) {
      body = `<div class="om">${M.svg(st().equip, { mood: 'happy', cls: 'static' })}</div>
        <h1>Как вас зовут?</h1><p>Имя будет в профиле и в таблице лиги.</p>
        <input type="text" id="onbName" maxlength="10" placeholder="Ваше имя" value="${esc(ui.onbName)}" style="width:100%">
        <div class="grow"></div>
        <div class="stack"><button class="btn" id="onbNext">Дальше</button></div>`;
    } else {
      const goals = [[10, 'Легко', '5 мин/день'], [20, 'Нормально', '10 мин/день'], [30, 'Серьёзно', '15 мин/день'], [50, 'Интенсивно', '20+ мин/день']];
      body = `<h1>Ваша дневная цель</h1><p>Её можно изменить позже в настройках.</p>
        <div class="stack">${goals.map(g => `<button class="btn ghost dark goal-opt ${ui.onbGoal === g[0] ? 'on' : ''}" data-g="${g[0]}" style="${ui.onbGoal === g[0] ? 'border-color:var(--blue);color:var(--blue);background:#DDF4FF' : ''}"><span>${g[1]} · ${g[2]}</span><span>${g[0]} XP</span></button>`).join('')}</div>
        <div class="grow"></div>
        <div class="stack"><button class="btn" id="onbNext">Поехали! 🚀</button></div>`;
    }
    scr.innerHTML = `<div class="onb">${body}</div>`;
    const inp = $('#onbName', scr);
    if (inp) {
      inp.oninput = () => { ui.onbName = inp.value; };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') onbNext(); });
      setTimeout(() => inp.focus(), 200);
    }
    $$('[data-g]', scr).forEach(b => { b.onclick = () => { ui.onbGoal = parseInt(b.dataset.g, 10); renderOnboarding(scr); }; });
    $('#onbNext', scr).onclick = onbNext;
  }
  function onbNext() {
    if (ui.onbStep === 0) { ui.onbStep = 1; render(); return; }
    if (ui.onbStep === 1) {
      const v = (ui.onbName || '').trim();
      if (!v) { toast('Введите имя'); haptic('error'); return; }
      ui.onbStep = 2; render(); return;
    }
    const s = st();
    s.name = Array.from((ui.onbName || '').trim()).slice(0, NAME_MAX).join('').trim() || 'Ученик';
    s.settings.dailyGoal = ui.onbGoal;
    s.onboarded = true;
    S.save();
    sfx('complete'); confetti();
    ui.tab = 'home';
    go('home');
    toast('Сайн байна, ' + esc(s.name) + '! Начнём с первого урока 👋');
  }

  /* ───────────────── Кнопка «Назад» и жизненный цикл ───────────────── */
  window.__onBack = function () {
    if (modalOpen()) {
      if (modalOpts && modalOpts.locked) return true;
      closeModal();
      return true;
    }
    if (ui.view === 'lesson' && ui.lesson) {
      if (ui.lesson.finished && ui.lesson.onContinue) ui.lesson.onContinue();
      else quitLesson();
      return true;
    }
    if (ui.view === 'settings') { go('profile'); return true; }
    if (ui.view === 'developer') { go('settings'); return true; }
    if (ui.view === 'onboarding') {
      if (ui.onbStep > 0) { ui.onbStep--; render(); return true; }
      return false;
    }
    if (ui.view !== 'home') { go('home'); return true; }
    return false;
  };

  window.BG = {
    onPause() { try { A.pauseAll(); } catch (e) {} S.save(); },
    onResume() {
      try { A.resumeAll(); } catch (e) {}
      processWeek();
      const r = S.checkStreak();
      if (r === 'lost') toast('💔 Серия прервалась. Начните новую сегодня!');
      if (ui.view !== 'lesson' && !modalOpen()) render();
      if (st().pendingLeagueResult && !modalOpen()) leagueResultModal();
    },
    onNotifPermission(granted) {
      if (!granted) {
        st().settings.notif = false; S.save();
        toast('Уведомления запрещены. Разрешите их в настройках телефона');
        if (ui.view === 'settings') render();
      }
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (native) return; // нативное приложение вызывает BG.onPause/onResume само
    if (document.hidden) window.BG.onPause(); else window.BG.onResume();
  });

  /* ───────────────── Инициализация ───────────────── */
  function init() {
    document.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || b.disabled || b.hasAttribute('data-silent')) return;
      sfx('click'); haptic('light');
    }, true);

    const unlock = () => {
      try { A.unlock(); if (st().settings.music) A.setMusic(true); } catch (e) {}
      document.removeEventListener('pointerdown', unlock, true);
    };
    document.addEventListener('pointerdown', unlock, true);

    $$('#tabbar .tab').forEach(t => {
      t.addEventListener('click', () => {
        if (ui.view === 'lesson' || ui.view === 'onboarding') return;
        const tab = t.dataset.tab;
        if (ui.view === tab) { $('#screen').scrollTo({ top: 0, behavior: 'smooth' }); return; }
        go(tab);
      });
    });

    processWeek();
    const sr = S.checkStreak();
    applyReminder();

    ui.view = st().onboarded ? 'home' : 'onboarding';
    ui.tab = 'home';
    render();

    setTimeout(() => {
      const sp = $('#splash');
      if (sp) { sp.classList.add('hide'); setTimeout(() => sp.remove(), 600); }
      if (!st().onboarded) return;
      if (sr === 'frozen') {
        const m = openModal(`<div class="big-emo">🧊</div><h2>Серия спасена!</h2><p>Вы пропустили день, но заморозка сохранила вашу серию: ${st().streak} ${plural(st().streak, ['день', 'дня', 'дней'])} 🔥</p><button class="btn blue" data-ok>Ура!</button>`,
          { center: true, onClose: () => leagueResultModal() });
        $('[data-ok]', m).onclick = () => closeModal();
      } else {
        if (sr === 'lost') toast('💔 Серия прервалась. Начните новую сегодня!');
        leagueResultModal();
      }
    }, 800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
