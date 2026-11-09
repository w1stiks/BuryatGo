/* BuryatGo — общая графика сцен: юрта (по референсу), сэргэ, овцы, солнце, горы со снежными шапками. */
window.BG_ART = (function () {
  'use strict';
  let uid = 0;
  const BLUE = '#2F5FB3', LINE = '#B9C3CF';
  const r1 = n => Math.round(n * 10) / 10;

  /* Бурятский орнамент «меандр» (үльзы хээ) в полосе */
  function meander(x0, x1, y, h, step, c) {
    let d = '';
    for (let x = x0; x <= x1 - step + 0.01; x += step) {
      d += `M${r1(x)} ${r1(y + h)}V${r1(y)}H${r1(x + step * 0.78)}V${r1(y + h * 0.68)}H${r1(x + step * 0.36)}V${r1(y + h * 0.36)}`;
    }
    return `<path d="${d}" stroke="${c || BLUE}" stroke-width=".9" fill="none" stroke-linejoin="miter"/>`;
  }
  function band(x0, x1, y, h) {
    return `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="#fff"/>
      <path d="M${x0} ${y + 0.6}H${x1}M${x0} ${y + h - 0.6}H${x1}" stroke="${BLUE}" stroke-width="1.3"/>
      ${meander(x0 + 2, x1 - 1, y + 2, h - 4, 6)}`;
  }

  /* Юрта в стиле референса: белый войлок, синий меандр, оранжевая дверь с орнаментом. Локальные координаты 140×100, основание y=92. */
  function yurt() {
    const doorOrn = [0, 1, 2].map(i => `<rect x="62.5" y="${67 + i * 7}" width="5" height="3.2" rx=".6" fill="#FBD9B8"/><rect x="72.5" y="${67 + i * 7}" width="5" height="3.2" rx=".6" fill="#FBD9B8"/>`).join('');
    const vstrip = x => `<rect x="${x}" y="61" width="5" height="19" fill="#fff"/><path d="M${x + 0.5} 61V80M${x + 4.5} 61V80" stroke="${BLUE}" stroke-width="1"/>` +
      [0, 1, 2, 3].map(i => `<path d="M${x + 1.2} ${63 + i * 4.5}h2.6v2.4h-1.4" stroke="${BLUE}" stroke-width=".8" fill="none"/>`).join('');
    return `<g class="yurt">
      <ellipse cx="70" cy="93" rx="66" ry="5" fill="rgba(0,0,0,.14)"/>
      <path d="M14 52H126V88Q70 95 14 88Z" fill="#FAFAF7" stroke="${LINE}" stroke-width="1"/>
      <path d="M102 52H126V88Q114 91 102 92Z" fill="rgba(110,130,165,.13)"/>
      ${band(14, 126, 52, 9)}
      ${band(14, 126, 79, 7)}
      <path d="M14 86Q70 93 126 86" stroke="${BLUE}" stroke-width="1.3" fill="none"/>
      ${vstrip(50)}${vstrip(85)}
      <rect x="57" y="61" width="26" height="30" rx="1.5" fill="#E0662E" stroke="#A8431B" stroke-width="1.6"/>
      <rect x="60" y="64" width="20" height="24" rx="1" fill="none" stroke="#F6B48A" stroke-width="1"/>
      ${doorOrn}
      <path d="M70 64.5l3 3-3 3-3-3z" fill="${BLUE}"/><path d="M70 81l2.4 2.4-2.4 2.4-2.4-2.4z" fill="${BLUE}"/>
      <path d="M8 54Q34 31 60 20Q70 16 80 20Q106 31 132 54Q70 47 8 54Z" fill="#FFFFFF" stroke="${LINE}" stroke-width="1"/>
      <path d="M84 21Q106 32 132 54Q114 50 98 49Z" fill="rgba(110,130,165,.12)"/>
      <path d="M9 53.6Q70 46.5 131 53.6" stroke="${BLUE}" stroke-width="3" fill="none"/>
      <path d="M15 49.6Q70 42.6 125 49.6" stroke="${BLUE}" stroke-width="2" stroke-dasharray="3 2" fill="none"/>
      <path d="M20 46.4Q70 39.6 120 46.4" stroke="${BLUE}" stroke-width=".9" fill="none"/>
      <g fill="none" stroke="${BLUE}" stroke-width="1.4">
        <circle cx="66.4" cy="31" r="3"/><circle cx="73.6" cy="31" r="3"/><circle cx="70" cy="27.4" r="3"/><circle cx="70" cy="34.6" r="3"/>
        <path d="M60 33q-5 0-5-4t4-3M80 33q5 0 5-4t-4-3"/>
      </g>
      <path d="M70 29l2 2-2 2-2-2z" fill="${BLUE}"/>
      <ellipse cx="70" cy="19.6" rx="10" ry="3" fill="#E9EEF5" stroke="${LINE}" stroke-width="1"/>
      <path d="M66 18.6Q70 13.5 74 18.6" fill="#fff" stroke="${BLUE}" stroke-width="1.2"/>
    </g>`;
  }

  /* Сэргэ — коновязь, украшенная хадаками. Основание в (0,0), высота ≈ 96. */
  function serge() {
    const rib = (c, d, dl) => `<path class="serge-rib" style="animation-delay:${dl}s" d="${d}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    return `<g class="serge">
      <ellipse cx="0" cy="0" rx="10" ry="2.6" fill="rgba(0,0,0,.16)"/>
      <rect x="-7.5" y="-11" width="15" height="11" rx="1.6" fill="#8A5A34" stroke="#5E3A1E" stroke-width=".9"/>
      <path d="M-4.2 -11L-2.6 -79H2.6L4.2 -11Z" fill="#A8713F" stroke="#6B4423" stroke-width=".8"/>
      <path d="M1 -12L1.9 -78" stroke="rgba(255,255,255,.25)" stroke-width="1.2"/>
      ${[-28, -52, -70].map(y => `<rect x="-4.6" y="${y}" width="9.2" height="3.2" rx="1" fill="#6B4423"/>`).join('')}
      <circle cx="0" cy="-81.5" r="3" fill="#F2B705" stroke="#B98700" stroke-width=".8"/>
      <path d="M-3.2 -83.5L0 -100L3.2 -83.5Z" fill="#3E6FC1" stroke="#24467F" stroke-width=".8"/>
      ${rib('#3D7BD9', 'M2 -46q10 3 8 13q-2 7 5 12', 0)}
      ${rib('#F4F6FA', 'M2 -45q7 5 4 14q-2 6 3 11', -.6)}
      ${rib('#F2C230', 'M-2 -46q-9 4-7 13q2 6-3 11', -1.1)}
      ${rib('#D9443A', 'M-2 -45q-5 6-3 13', -1.6)}
      ${rib('#3FA34D', 'M2 -44q4 6 1 12', -2.1)}
      <rect x="-4.8" y="-48" width="9.6" height="4" rx="1.5" fill="#F4F6FA" stroke="#C9D2DE" stroke-width=".6"/>
    </g>`;
  }

  /* Пасущаяся овца, смотрит влево, начало координат — центр туловища */
  function sheep(x, y, s, flip, delay) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="sheep" style="animation-delay:${delay}s">
      <ellipse cx="0" cy="14.5" rx="15" ry="2.6" fill="rgba(0,0,0,.13)"/>
      ${[-8, -3.5, 4, 8.5].map(lx => `<rect x="${lx}" y="4" width="2.6" height="10.5" rx="1.2" fill="#3B3B44"/>`).join('')}
      <g fill="#FBFBF7" stroke="#D9D6CC" stroke-width=".8">
        <circle cx="-8" cy="0" r="6"/><circle cx="-2" cy="-3.5" r="7"/><circle cx="5" cy="-2.5" r="7"/><circle cx="10" cy="2" r="5.5"/>
        <circle cx="0" cy="3" r="7"/><circle cx="-7" cy="4.5" r="5"/><circle cx="13.5" cy="-1.5" r="2.8"/>
      </g>
      <g class="sh-head" style="animation-delay:${delay}s">
        <ellipse cx="-15" cy="6" rx="4.2" ry="5.8" transform="rotate(32 -15 6)" fill="#3B3B44"/>
        <g class="sh-ear" style="animation-delay:${delay * .7}s"><ellipse cx="-11.5" cy="1.2" rx="3.4" ry="1.5" transform="rotate(-20 -11.5 1.2)" fill="#2E2E36"/></g>
        <circle cx="-12.5" cy="2" r="3" fill="#FBFBF7" stroke="#D9D6CC" stroke-width=".6"/>
        <circle cx="-16.4" cy="6.4" r=".9" fill="#fff"/>
      </g></g></g>`;
  }

  /* Солнце нового стиля: мягкое сияние, лучи-лепестки, мерцание */
  function sun(cx, cy, sc) {
    const k = 'sn' + (++uid);
    let rays = '';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, w = 0.09, ro = i % 2 ? 35 : 42, ri = 27;
      const p = (ang, r) => r1(Math.cos(ang) * r) + ' ' + r1(Math.sin(ang) * r);
      rays += `<path d="M${p(a - w, ri)}L${p(a, ro)}L${p(a + w, ri)}Z" fill="${i % 2 ? '#FFD45C' : '#FFC21A'}"/>`;
    }
    return `<g transform="translate(${cx} ${cy}) scale(${sc || 1})"><g class="sc-sun">
      <defs><radialGradient id="${k}h"><stop offset=".35" stop-color="#FFF3BF" stop-opacity=".95"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient>
      <radialGradient id="${k}c" cx="40%" cy="38%"><stop offset="0" stop-color="#FFF6B8"/><stop offset=".55" stop-color="#FFD43B"/><stop offset="1" stop-color="#FFAA00"/></radialGradient></defs>
      <circle class="sun-halo" r="52" fill="url(#${k}h)"/>
      <g class="sun-rays">${rays}</g>
      <circle r="24" fill="url(#${k}c)" stroke="#F2A600" stroke-width="1.4"/>
      <ellipse cx="-8" cy="-9" rx="7" ry="4.5" fill="#fff" opacity=".45" transform="rotate(-30 -8 -9)"/>
    </g></g>`;
  }

  /* Хребет с острыми пиками, гранями и детальными снежными шапками. pts — вершины ломаной. */
  function range(pts, base, fill, face, snow) {
    let d = `M${pts[0][0]} ${base}`;
    pts.forEach(p => { d += `L${p[0]} ${p[1]}`; });
    d += `L${pts[pts.length - 1][0]} ${base}Z`;
    let extra = '';
    for (let i = 1; i < pts.length - 1; i++) {
      const P = pts[i], L = pts[i - 1], R = pts[i + 1];
      if (!(P[1] < L[1] && P[1] < R[1])) continue;
      const hgt = Math.min(L[1], R[1]) - P[1];
      if (hgt < 18) continue;
      extra += `<path d="M${P[0]} ${P[1]}L${R[0]} ${R[1]}L${r1(P[0] + (R[0] - P[0]) * 0.18)} ${base}Z" fill="${face}"/>`;
      const t = Math.min(0.42, 22 / hgt + 0.12);
      const at = (Q, f) => [P[0] + (Q[0] - P[0]) * f, P[1] + (Q[1] - P[1]) * f];
      const a = at(L, t), b = at(R, t), n = 5;
      let s = `M${P[0]} ${P[1]}L${r1(a[0])} ${r1(a[1])}`;
      for (let j = 1; j < n; j++) {
        const f = j / n, x = a[0] + (b[0] - a[0]) * f, yb = a[1] + (b[1] - a[1]) * f;
        s += `L${r1(x)} ${r1(yb + (j % 2 ? 5 : -2))}`;
      }
      s += `L${r1(b[0])} ${r1(b[1])}Z`;
      const mx = P[0] + (b[0] - P[0]) * 0.1;
      extra += `<path d="${s}" fill="#FFFFFF"/>`;
      extra += `<path d="M${P[0]} ${P[1]}L${r1(b[0])} ${r1(b[1])}L${r1(a[0] + (b[0] - a[0]) * 0.6)} ${r1(a[1] + (b[1] - a[1]) * 0.6 + 4)}L${r1(mx)} ${r1(P[1] + hgt * t * 0.55)}Z" fill="${snow}"/>`;
    }
    return `<path d="${d}" fill="${fill}"/>${extra}`;
  }

  function tufts(list) {
    return list.map((t, i) => `<g transform="translate(${t[0]} ${t[1]}) scale(${t[2] || 1})"><g class="sc-grass" style="animation-delay:${-(i * 0.37).toFixed(2)}s"><path d="M0 0Q-3 -7 -6 -11M0 0Q0 -8 1 -13M0 0Q3 -6 7 -10" stroke="${t[3] || '#4E9A2E'}" stroke-width="2" fill="none" stroke-linecap="round"/></g></g>`).join('');
  }

  /* Полная сцена магазина 400×300 (Бато в центре). opts.compact — для модального окна. */
  /* Конь (вид сбоку, смотрит влево). Начало координат — земля под серединой корпуса.
     h = {coat, dark, mane, blaze, sock} */
  function horse(x, y, s, h, delay, flip) {
    h = h || {};
    const c = h.coat || '#B4622D', d = h.dark || '#8A4519', m = h.mane || '#3E1E0C';
    const hoof = '#3A2A20', line = 'rgba(30,20,10,.25)';
    const blaze = h.blaze ? `<path d="M-30 -77Q-36 -70 -46 -58L-49 -56Q-42 -66 -32 -78Z" fill="#FFF7EC"/>` : '';
    const sock = h.sock ? `<rect x="-16.5" y="-12" width="7.5" height="8" fill="#FFF7EC"/><rect x="18.5" y="-12" width="7" height="8" fill="#FFF7EC"/>` : '';
    return `<g class="horse" transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <ellipse cx="0" cy="0" rx="36" ry="4.5" fill="rgba(0,0,0,.16)"/>
      <path d="M12 -30L17 -4H11.5L7 -28Z" fill="${d}"/><path d="M-22 -30L-24 -4H-18.5L-16 -28Z" fill="${d}"/>
      <rect x="10.5" y="-5" width="7.5" height="5" rx="1.5" fill="${hoof}"/><rect x="-25" y="-5" width="7.5" height="5" rx="1.5" fill="${hoof}"/>
      <path class="hr-tail" style="animation-delay:${delay || 0}s" d="M29 -46Q45 -44 42 -24Q40 -12 47 -3Q33 -6 32 -22Q31 -34 26 -40Z" fill="${m}"/>
      <path d="M-25 -47Q-10 -55 16 -53Q33 -51 33 -37Q32 -24 20 -24L-17 -24Q-30 -26 -30 -37Q-30 -43 -25 -47Z" fill="${c}" stroke="${line}" stroke-width="1"/>
      <path d="M-26 -30Q0 -22 30 -30Q28 -24 20 -24L-17 -24Q-24 -25 -26 -30Z" fill="rgba(0,0,0,.08)"/>
      <path d="M22 -32Q28 -18 26 -4H19.5Q20 -16 13 -27Z" fill="${c}" stroke="${line}" stroke-width="1"/>
      <path d="M-17 -30L-16 -4H-9.5L-8.5 -28Z" fill="${c}" stroke="${line}" stroke-width="1"/>
      ${sock}
      <rect x="19" y="-5" width="7.5" height="5" rx="1.5" fill="${hoof}"/><rect x="-17" y="-5" width="7.5" height="5" rx="1.5" fill="${hoof}"/>
      <path d="M-9 -55Q3 -57 15 -55L17 -36Q3 -32 -10 -36Z" fill="#1E6BC6" stroke="#F2B705" stroke-width="1.6"/>
      <path d="M-6 -46H13" stroke="#F2B705" stroke-width="1.2" stroke-dasharray="3 2"/>
      <path d="M-6 -56Q4 -63 15 -56Q10 -51 4 -51Q-2 -51 -6 -56Z" fill="#7A4A21"/>
      <path d="M4 -40V-29" stroke="#7A4A21" stroke-width="1.4"/><rect x="1.5" y="-30" width="5" height="3" rx="1" fill="#C9A227"/>
      <g class="hr-head" style="animation-delay:${delay || 0}s">
        <path d="M-27 -41Q-34 -58 -36 -71L-24 -78Q-18 -62 -13 -49Z" fill="${c}" stroke="${line}" stroke-width="1"/>
        <path d="M-24 -79Q-30 -85 -37 -80L-53 -60Q-56 -53 -49 -51L-42 -51Q-36 -57 -28 -64Q-22 -70 -24 -79Z" fill="${c}" stroke="${line}" stroke-width="1"/>
        ${blaze}
        <path d="M-29 -80L-27 -91L-23 -80Z" fill="${c}" stroke="${line}" stroke-width="1"/>
        <path d="M-25 -83Q-15 -70 -11 -49L-18 -51Q-21 -66 -29 -78Z" fill="${m}"/>
        <path d="M-27 -82Q-35 -82 -36 -75Q-31 -77 -27 -78Z" fill="${m}"/>
        <circle cx="-34" cy="-71" r="1.8" fill="#1E1E24"/><circle cx="-33.4" cy="-71.6" r=".6" fill="#fff"/>
        <circle cx="-49.5" cy="-55.5" r="1.1" fill="${d}"/>
        <path d="M-37 -79L-47 -58M-32 -66L-50 -58" stroke="#7A4A21" stroke-width="1.5" fill="none"/>
        <circle cx="-46" cy="-56" r="1.6" fill="#C9A227"/>
      </g>
    </g>`;
  }
  function horseSvg(h, cls) {
    return `<svg class="${cls || 'horse-svg'}" viewBox="-60 -96 114 104" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${horse(0, 0, 1, h, 0)}</svg>`;
  }
  /* Позиции коней у правой коновязи (от дальних к ближним) */
  /* Кони привязаны к сэргэ рядом с юртой (сэргэ в точке 132,252), стоят перед юртой и смотрят вправо, к столбу */
  const HORSE_POS = { 1: [[90, 286, .78]], 2: [[62, 270, .6], [92, 288, .78]], 3: [[40, 258, .46], [66, 272, .6], [94, 290, .78]] };
  const SERGE_RING = [133, 214];
  function herd(list) {
    if (!list || !list.length) return '';
    list = list.slice(0, 3);
    const pos = HORSE_POS[list.length];
    let out = '';
    list.forEach((h, i) => {
      const [x, y, s] = pos[i];
      const mx = x + 47 * s, my = y - 56 * s;
      out += `<path d="M${SERGE_RING[0]} ${SERGE_RING[1]}Q${(SERGE_RING[0] + mx) / 2} ${Math.max(SERGE_RING[1], my) + 8} ${mx} ${my}" stroke="#8B5A2B" stroke-width="1.6" fill="none"/>`;
      out += horse(x, y, s, h, -i * 1.3, true);
    });
    return out;
  }

  function sheepSvg(cls) {
    return `<svg class="sheep-pv ${cls || ''}" viewBox="-22 -14 42 32" aria-hidden="true">${sheep(0, 0, 1, 0, 0)}</svg>`;
  }

  function scene(opts) {
    opts = opts || {};
    const k = 'sc' + (++uid);
    /* v1.8.1: все овцы пасутся на берегах — ни одна не стоит в ручье */
    const sheepList = [[282, 250, .62, 1, -.4], [312, 256, .62, 0, -1.2], [300, 236, .48, 1, -.8], [272, 268, .78, 0, -.6], [379, 246, .46, 0, -2],
      [306, 274, .78, 1, -1.4], [311, 240, .46, 0, -1.6], [334, 281, .62, 0, -2.2], [268, 236, .5, 0, 0], [388, 252, .44, 1, -2.4],
      [294, 287, .84, 1, -1], [328, 294, .82, 0, -1.8], [314, 266, .52, 1, -2.6]];
    const nSheep = typeof opts.sheep === 'number' ? Math.max(0, Math.min(13, Math.floor(opts.sheep))) : 10;
    const shown = sheepList.slice(0, nSheep).sort((p, q) => p[1] - q[1]);
    return `<svg class="scene-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="${k}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FA8EC"/><stop offset=".6" stop-color="#B9D6FA"/><stop offset="1" stop-color="#E6F1FF"/></linearGradient>
      <linearGradient id="${k}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD266"/><stop offset="1" stop-color="#5FA83A"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#${k}s)"/>
      ${sun(338, opts.compact ? 118 : 64, opts.compact ? .8 : 1)}
      ${range([[-10, 200], [30, 150], [62, 176], [112, 104], [158, 166], [196, 128], [236, 178], [280, 96], [326, 160], [362, 122], [410, 176]], 300, '#A9BCE6', '#94A9D8', '#DCE6F6')}
      ${range([[-10, 236], [24, 196], [58, 224], [104, 160], [150, 222], [196, 184], [232, 226], [262, 178], [300, 228], [340, 170], [380, 220], [410, 200]], 300, '#7F97CF', '#6C84BE', '#D6E2F5')}
      <path d="M0 236Q60 222 130 232T260 228T400 230V300H0Z" fill="url(#${k}g)"/>
      <path d="M0 258Q100 246 200 256T400 252V300H0Z" fill="#7CC24C"/>
      <g class="stream" aria-hidden="true">
        <path d="M342 230Q326 248 352 262Q382 276 378 304" fill="none" stroke="#5E9A45" stroke-width="18" stroke-linecap="round" opacity=".45"/>
        <path d="M342 175Q335 192 344 206Q351 219 342 231" fill="none" stroke="#7FC4F5" stroke-width="5" stroke-linecap="round"/>
        <path d="M342 230Q326 248 352 262Q382 276 378 304" fill="none" stroke="#4FA6E8" stroke-width="12" stroke-linecap="round"/>
        <path d="M342 230Q326 248 352 262Q382 276 378 304" fill="none" stroke="#8FD0FF" stroke-width="6" stroke-linecap="round" opacity=".7"/>
        <path class="stream-flow" d="M342 175Q335 192 344 206Q351 219 342 231" fill="none" stroke="#F2FAFF" stroke-width="1.6" stroke-linecap="round"/>
        <path class="stream-flow slow" d="M340 232Q324 248 350 262Q380 276 376 304" fill="none" stroke="#F2FAFF" stroke-width="2" stroke-linecap="round"/>
        <path class="stream-flow slow b" d="M345 234Q331 249 355 261Q384 275 381 304" fill="none" stroke="#E3F4FF" stroke-width="1.3" stroke-linecap="round"/>
        <ellipse class="stream-glint" cx="342" cy="231" rx="5" ry="2.4" fill="#fff" opacity=".8"/>
        <circle cx="333" cy="244" r="2.6" fill="#8E9AAF"/><circle cx="364" cy="270" r="3.2" fill="#8E9AAF"/><circle cx="367" cy="271" r="2" fill="#A7B2C4"/>
      </g>
      <g transform="translate(14 178) scale(.78)">${yurt()}</g>
      <g transform="translate(132 252) scale(.9)">${serge()}</g>
      ${herd(opts.horses)}
      ${shown.map(p => sheep(p[0], p[1], p[2], p[3], p[4])).join('')}
      ${tufts([[30, 272, 1], [96, 266, .9], [130, 286, 1.1], [176, 262, .8], [250, 288, 1], [292, 284, .9], [340, 288, 1.1], [384, 276, 1], [60, 292, 1.2], [214, 292, 1], [6, 258, .8, '#5A9E36']])}
    </svg>`;
  }

  /* Степь на главной: 360×150, всё помещается целиком (meet), только новые юрты, сэргэ, барашки и река. */
  function steppe() {
    const sh = [[176, 128, .26, 0, 0], [196, 131, .3, 1, -.7], [218, 127, .25, 0, -1.4], [238, 132, .3, 1, -2.1], [260, 128, .24, 0, -.3], [282, 131, .28, 1, -1.1]];
    return `<svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${sun(306, 44, .5)}
      ${range([[-10, 112], [30, 80], [62, 98], [104, 46], [146, 94], [186, 64], [222, 102], [262, 72], [300, 100], [340, 78], [370, 106]], 150, '#C7D9F3', '#B3C9EC', '#E4EDFA')}
      ${range([[-10, 122], [40, 96], [84, 114], [132, 86], [184, 116], [236, 92], [284, 118], [330, 100], [370, 116]], 150, '#94B4E6', '#82A3DA', '#DCE7F7')}
      <path d="M0 124Q90 112 180 122T360 120V150H0Z" fill="#9CCB5B"/>
      <g transform="translate(52 99) scale(.32)">${yurt()}</g>
      <g transform="translate(104 107) scale(.23)">${yurt()}</g>
      <g transform="translate(146 131) scale(.3)">${serge()}</g>
      ${sh.map(p => sheep(p[0], p[1], p[2], p[3], p[4])).join('')}
      <rect x="0" y="138" width="360" height="12" fill="#6FA8EC"/>
      <path d="M0 138Q30 133 60 138T120 138T180 138T240 138T300 138T360 138V142H0Z" fill="#8DBDF0"/>
      <path d="M20 144h22M110 146h18M200 144h26M290 146h20" stroke="rgba(255,255,255,.6)" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`;
  }

  /* Отдельная юрта (для мест, где раньше был GER_SVG) */
  function yurtSvg(cls) {
    return `<svg class="${cls || 'ger-svg'}" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${yurt()}</svg>`;
  }

  return { yurt, yurtSvg, serge, sheep, sun, range, scene, steppe, meander, horse, horseSvg, sheepSvg };
})();
