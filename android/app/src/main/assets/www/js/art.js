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
      ${HORSE_COAT}
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
  const HORSE_POS = { 1: [[66, 299, .55]], 2: [[40, 298, .5], [82, 299, .54]], 3: [[26, 297, .48], [58, 298, .5], [90, 299, .52]] };
  const SERGE_RING = [109, 217];
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
      <g class="snow-cover"><path d="M0 233Q60 219 130 229T260 225T400 227V300H0Z" fill="#F3F8FF"/><path d="M0 259Q100 247 200 257T400 253V300H0Z" fill="#E4EEFA"/><path d="M0 300V286Q80 280 160 288T320 284T400 290V300Z" fill="#D6E4F5"/></g>
      <g class="puddles"><ellipse cx="166" cy="288" rx="17" ry="3.2"/><ellipse cx="238" cy="294" rx="21" ry="3.8"/><ellipse cx="152" cy="266" rx="10" ry="2.2"/><ellipse cx="250" cy="268" rx="12" ry="2.4"/><ellipse cx="60" cy="262" rx="9" ry="2"/></g>
      <g class="ripples"><circle cx="166" cy="288" r="5" style="animation-delay:0s"/><circle cx="238" cy="294" r="6" style="animation-delay:0.5s"/><circle cx="152" cy="266" r="3" style="animation-delay:0.9s"/><circle cx="250" cy="268" r="3.5" style="animation-delay:0.3s"/><circle cx="60" cy="262" r="3" style="animation-delay:1.1s"/></g>
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
        <g class="stream-ice"><path d="M342 175Q335 192 344 206Q351 219 342 231" fill="none" stroke="#DDF1FF" stroke-width="6" stroke-linecap="round"/><path d="M342 230Q326 248 352 262Q382 276 378 304" fill="none" stroke="#C6E5FB" stroke-width="14" stroke-linecap="round"/><path d="M342 230Q326 248 352 262Q382 276 378 304" fill="none" stroke="#F4FBFF" stroke-width="6" stroke-linecap="round" opacity=".9"/><path d="M336 246L344 242M356 262L364 266M370 282L374 291" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></g>
      </g>
      <g transform="translate(10 184) scale(.66)">${yurt()}</g>
      <g transform="translate(108 252) scale(.82)">${serge()}</g>
      ${opts.kennel ? '<g transform="translate(136 238) scale(.38)">' + kennel() + '</g>' : ''}
      <g class="tufts">${tufts([[30, 272, 1], [96, 266, .9], [130, 286, 1.1], [176, 262, .8], [250, 288, 1], [292, 284, .9], [340, 288, 1.1], [384, 276, 1], [60, 292, 1.2], [214, 292, 1], [6, 258, .8, '#5A9E36']])}</g>
      ${herd(opts.horses)}
      ${shown.map(p => sheep(p[0], p[1], p[2], p[3], p[4])).join('')}
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

  /* ───────── v1.12: собака, будка и город Улан-Удэ ───────── */
  const DOG = { coat: '#C8894A', dark: '#8A5A2B', belly: '#F3D7AE', nose: '#2B1D14' };
  function bowl(liquid) {
    return `<g class="dg-bowl"><path d="M-11 0H11Q10 9 0 9Q-10 9 -11 0Z" fill="#FFFFFF" stroke="#1F6FD1" stroke-width="1.6"/>
      <path d="M-8 4H8" stroke="#1F6FD1" stroke-width="1.2"/><ellipse cx="0" cy="0" rx="10" ry="2.6" fill="${liquid || '#FFFFFF'}" stroke="#1F6FD1" stroke-width=".8"/></g>`;
  }
  /* v1.13: одежда для собаки (боковой вид: голова — круг 80,30 r16; туловище — эллипс 50,48) */
  const DOG_WEAR = {
    dog_beanie: '<path d="M65 20Q67 4 80 3Q94 4 95 20Q80 15 65 20Z" fill="#E8590C"/><path d="M64 21Q80 14 96 21" stroke="#FFD8A8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="80" cy="2" r="4" fill="#FFD8A8"/>',
    dog_malgai: '<path d="M64 21Q64 6 80 5Q96 6 96 21Z" fill="#1E6BC6"/><path d="M71 12H89" stroke="#F2B705" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M62 21Q80 15 98 21Q98 25 94 25Q80 20 66 25Q62 25 62 21Z" fill="#3E2C23"/><circle cx="80" cy="4" r="3.6" fill="#E03131"/><path d="M80 4Q86 8 88 15" stroke="#E03131" stroke-width="1.6" fill="none"/>',
    dog_ushanka: '<path d="M64 20Q64 5 80 4Q96 5 96 20Z" fill="#7A4A21"/><path d="M62 20Q80 13 98 20V24Q80 18 62 24Z" fill="#E9DCC9"/><path d="M63 21Q58 32 62 40Q68 36 68 24Z" fill="#E9DCC9"/>',
    dog_bandana: '<path d="M66 41Q80 50 91 42L84 58Q78 52 72 52Z" fill="#E03131"/><circle cx="76" cy="48" r="1.4" fill="#fff"/><circle cx="82" cy="51" r="1.2" fill="#fff"/><circle cx="79" cy="54" r="1" fill="#fff"/>',
    dog_glasses: '<g fill="rgba(30,40,60,.88)" stroke="#111" stroke-width="1.2"><rect x="80" y="21" width="10" height="8" rx="3"/><rect x="92" y="23" width="8" height="7" rx="3"/></g><path d="M90 25H92M80 24L70 22" stroke="#111" stroke-width="1.3"/><path d="M82 23L85 22" stroke="#fff" stroke-width="1" opacity=".7"/>',
    dog_hadag: '<path d="M65 40Q80 50 92 41Q92 46 86 48Q78 52 68 46Z" fill="#74C0FC"/><path d="M70 46Q66 58 70 64L76 62Q72 56 75 47Z" fill="#74C0FC"/><path d="M70 62L76 61M69 58L74 57" stroke="#fff" stroke-width="1.1"/>',
    dog_sweater: '<path d="M28 42Q34 33 52 33Q70 34 75 44L74 56Q52 62 30 56Q25 50 28 42Z" fill="#C92A2A"/><path d="M30 47H74M31 53H73" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>',
    dog_degel: '<path d="M27 42Q34 32 52 32Q70 33 76 44L75 57Q52 63 29 57Q24 50 27 42Z" fill="#1E6BC6"/><path d="M29 57Q52 63 75 57" stroke="#F2B705" stroke-width="3" fill="none"/><path d="M62 33Q66 45 64 60" stroke="#F2B705" stroke-width="2.4" fill="none"/><circle cx="64" cy="44" r="1.6" fill="#E03131"/><circle cx="65" cy="51" r="1.6" fill="#E03131"/>',
    dog_raincoat: '<path d="M26 42Q33 31 52 31Q71 32 77 44L76 58Q52 64 28 58Q23 50 26 42Z" fill="#FCC419" stroke="#E67700" stroke-width="1"/><path d="M40 34V60M56 32V62" stroke="#E67700" stroke-width=".8" opacity=".6"/>'
  };
  function dogWear(w) {
    w = w || {};
    const g = id => (id && DOG_WEAR[id]) || '';
    const hat = g(w.dhat);
    return { hat, acc: g(w.dacc), coat: g(w.dcoat), backHat: hat ? `<g transform="translate(-25 -2)">${hat}</g>` : '' };
  }
  /* v1.13: зимняя попона коня (видна только во время снега или в превью) */
  const HORSE_COAT = '<g class="h-coat"><path d="M-25 -47Q-9 -57 17 -55Q32 -52 32 -40L30 -28Q4 -23 -23 -28Q-30 -37 -25 -47Z" fill="#C92A2A"/><path d="M-24 -29Q4 -24 30 -29" stroke="#F8F0E3" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M-17 -50L-15 -29M25 -52L27 -30" stroke="#F2B705" stroke-width="1.6"/><path d="M-20 -38H26" stroke="#F2B705" stroke-width="1" stroke-dasharray="3 2"/></g>';
  function dogSvg(cls, liquid, wear) {
    const W = dogWear(wear);
    const c = DOG.coat, d = DOG.dark, b = DOG.belly;
    return `<svg class="${cls || 'dog-svg'}" viewBox="0 0 110 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="54" cy="79" rx="34" ry="4.5" fill="rgba(0,0,0,.18)"/>
      <g class="dg-side">
        <path class="dg-tail" d="M28 46Q12 40 14 22" stroke="${d}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <rect class="dg-leg l1" x="28" y="52" width="9" height="25" rx="4.5" fill="${d}"/>
        <rect class="dg-leg l2" x="62" y="52" width="9" height="25" rx="4.5" fill="${d}"/>
        <ellipse cx="50" cy="48" rx="27" ry="15" fill="${c}"/>
        <ellipse cx="52" cy="55" rx="18" ry="7" fill="${b}"/>${W.coat}
        <rect class="dg-leg l3" x="36" y="54" width="9" height="24" rx="4.5" fill="${c}"/>
        <rect class="dg-leg l4" x="70" y="54" width="9" height="24" rx="4.5" fill="${c}"/>
        <rect x="35" y="74" width="11" height="5" rx="2.5" fill="${b}"/><rect x="69" y="74" width="11" height="5" rx="2.5" fill="${b}"/>
        <g class="dg-head">
          <circle cx="80" cy="30" r="16" fill="${c}"/>
          <ellipse cx="93" cy="37" rx="10" ry="7.5" fill="${b}"/>
          <ellipse cx="101" cy="33.5" rx="3.6" ry="3" fill="${DOG.nose}"/>
          <path d="M92 43Q96 46 100 42" stroke="${DOG.nose}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <path class="dg-tongue" d="M95 44Q96 51 99 50Q101 49 99 43Z" fill="#F07C8C"/>
          <circle cx="85" cy="26" r="3" fill="${DOG.nose}"/><circle cx="86" cy="25" r="1" fill="#fff"/>
          <path d="M70 16Q62 30 68 42Q76 36 76 18Z" fill="${d}"/>
          <path d="M66 42Q80 49 90 43" stroke="#E03131" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="79" cy="48" r="3" fill="#F5C542" stroke="#C9961B" stroke-width=".8"/>${W.acc}${W.hat}
        </g>
        <g transform="translate(84 60)">${bowl(liquid)}</g>
      </g>
      <g class="dg-back">
        <rect x="36" y="56" width="10" height="22" rx="5" fill="${d}"/><rect x="64" y="56" width="10" height="22" rx="5" fill="${d}"/>
        <ellipse cx="55" cy="52" rx="20" ry="19" fill="${c}"/>
        <path class="dg-tail" d="M55 52Q55 34 62 26" stroke="${d}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <circle cx="55" cy="27" r="15" fill="${c}"/>${W.backHat}
        <path d="M42 17Q34 30 40 40Q47 33 47 19Z" fill="${d}"/><path d="M68 17Q76 30 70 40Q63 33 63 19Z" fill="${d}"/>
        <path d="M42 40Q55 46 68 40" stroke="#E03131" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g class="dg-paw"><path d="M70 46Q80 40 84 30" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>
          <g transform="translate(86 26)">${bowl(liquid)}</g></g>
      </g>
    </svg>`;
  }
  /* Будка: низ по центру — точка (0,0) */
  function kennel() {
    return `<g class="kennel"><ellipse cx="0" cy="1" rx="34" ry="4" fill="rgba(0,0,0,.16)"/>
      <rect x="-27" y="-36" width="54" height="36" fill="#C07F41"/>
      <path d="M-27 -27H27M-27 -18H27M-27 -9H27" stroke="#9C6230" stroke-width="1.2"/>
      <path d="M-34 -33L0 -60L34 -33L29 -30L0 -53L-29 -30Z" fill="#B83A2E"/><path d="M-29 -30L0 -53L29 -30L27 -36L0 -57L-27 -36Z" fill="#D9534A"/>
      <path d="M-12 0V-17A12 12 0 0 1 12 -17V0Z" fill="#3A2416"/>
      <rect x="-10" y="-46" width="20" height="7" rx="2" fill="#F2D49B" stroke="#9C6230" stroke-width=".8"/>
      <circle cx="18" cy="-6" r="4" fill="#F2F2F2" stroke="#9AA3AF" stroke-width="1"/></g>`;
  }
  /* Голова Ленина на Площади Советов (Улан-Удэ) */
  function leninHead(x, y) {
    return `<g class="lenin" transform="translate(${x} ${y})">
      <rect x="-40" y="-10" width="80" height="12" fill="#5E5A63"/><rect x="-34" y="-22" width="68" height="13" fill="#6E6A73"/>
      <rect x="-27" y="-62" width="54" height="41" fill="#857F8A"/><rect x="-27" y="-62" width="10" height="41" fill="#958F99"/>
      <rect x="-31" y="-66" width="62" height="6" fill="#6E6A73"/>
      <rect x="-14" y="-48" width="28" height="9" rx="1" fill="#C9A24A" opacity=".85"/>
      <g transform="translate(0 -66)">
        <path d="M-24 0Q-30 -14 -27 -34Q-25 -58 -2 -64Q22 -66 28 -44Q32 -26 26 -10Q22 0 10 0Z" fill="#3F454E"/>
        <path d="M-20 -38Q-16 -58 2 -60Q14 -60 20 -52Q6 -56 -6 -50Q-14 -46 -20 -38Z" fill="#6B7480" opacity=".8"/>
        <ellipse cx="25" cy="-28" rx="5" ry="8" fill="#353A42"/>
        <path d="M-22 -30Q-10 -36 2 -32" stroke="#22262C" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M6 -32Q12 -35 18 -32" stroke="#22262C" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M-14 -27Q-9 -25 -4 -27M8 -27Q12 -25 15 -27" stroke="#1B1E23" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M2 -30Q-3 -20 -1 -15Q2 -13 5 -15" stroke="#22262C" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-12 -12Q0 -16 12 -12Q8 -8 0 -9Q-8 -8 -12 -12Z" fill="#2A2E35"/>
        <path d="M-11 -10Q-12 2 0 6Q12 2 11 -10Q0 -5 -11 -10Z" fill="#2F343B"/>
      </g></g>`;
  }
  function city(opts) {
    opts = opts || {};
    const k = 'ct' + (++uid);
    let win = '';
    for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) {
      const x = 50 + i * 19; if (x > 168 && x < 232) continue;
      win += `<rect x="${x}" y="${138 + r * 24}" width="8" height="14" rx="1" fill="#8FB2D6"/>`;
    }
    let cols = '';
    for (let i = 0; i < 6; i++) cols += `<rect x="${172 + i * 11}" y="130" width="5" height="88" fill="#F4EEE2"/>`;
    let tiles = '';
    for (let i = -8; i <= 8; i++) tiles += `<path d="M${200 + i * 12} 226L${200 + i * 40} 300" stroke="#B5AFA4" stroke-width=".8"/>`;
    [236, 250, 268, 290].forEach(y => { tiles += `<path d="M0 ${y}H400" stroke="#B5AFA4" stroke-width=".8"/>`; });
    const lamp = x => `<g><rect x="${x - 1.5}" y="196" width="3" height="52" fill="#2F3640"/><path d="M${x - 9} 198H${x + 9}" stroke="#2F3640" stroke-width="2"/><circle cx="${x - 9}" cy="201" r="4" fill="#FFF4C2" stroke="#2F3640"/><circle cx="${x + 9}" cy="201" r="4" fill="#FFF4C2" stroke="#2F3640"/></g>`;
    const tree = (x, s) => `<g transform="translate(${x} 232) scale(${s})"><rect x="-3" y="-26" width="6" height="26" fill="#7A4E2A"/><circle cx="0" cy="-40" r="18" fill="#4E9A3A"/><circle cx="-10" cy="-32" r="12" fill="#5DAE45"/><circle cx="10" cy="-34" r="13" fill="#448A33"/></g>`;
    const bed = (x, w) => { let f = ''; for (let i = 0; i < w / 8; i++) f += `<circle cx="${x + 5 + i * 8}" cy="${244 + (i % 2) * 3}" r="2.4" fill="${['#E8434B', '#F5C542', '#F07CC0'][i % 3]}"/>`; return `<rect x="${x}" y="238" width="${w}" height="12" rx="6" fill="#5A9E36"/>${f}`; };
    const dove = (x, y, f) => `<g transform="translate(${x} ${y}) scale(${f ? -1 : 1} 1)"><ellipse cx="0" cy="0" rx="5" ry="3" fill="#8E96A3"/><circle cx="5" cy="-2" r="2" fill="#6E7683"/><path d="M7 -2L9 -1.4" stroke="#E0A030" stroke-width="1"/></g>`;
    return `<svg class="scene-svg city-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="${k}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#78AEEB"/><stop offset="1" stop-color="#DDEBFA"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#${k}s)"/>
      ${sun(338, 64, 1)}
      <path d="M0 170H18V150H40V176H0Z M352 176V146H372V160H400V176Z" fill="#B9C7DE"/>
      <rect x="30" y="122" width="340" height="104" fill="#E9E1D0"/>
      <rect x="26" y="116" width="348" height="8" fill="#D3C8B2"/>
      ${win}
      <rect x="164" y="112" width="72" height="114" fill="#F1EADC"/>
      <path d="M160 116L200 96L240 116Z" fill="#D3C8B2"/>
      ${cols}
      <rect x="164" y="124" width="72" height="6" fill="#D3C8B2"/>
      <rect x="199" y="62" width="2" height="36" fill="#5B6470"/>
      <g transform="translate(201 63)"><rect width="24" height="5" fill="#1F6FD1"/><rect y="5" width="24" height="5" fill="#FFFFFF"/><rect y="10" width="24" height="5" fill="#F5C542"/><circle cx="7" cy="2.6" r="1.6" fill="#F5C542"/></g>
      <path d="M0 226H400V300H0Z" fill="#CFC9BE"/>
      ${tiles}
      <g class="snow-cover"><path d="M0 226H400V300H0Z" fill="#F3F7FC"/><path d="M0 252Q100 244 200 254T400 248V300H0Z" fill="#E2EBF6"/><rect x="24" y="110" width="352" height="7" rx="3.5" fill="#FFFFFF"/><path d="M158 117L200 94L242 117L236 117L200 99L164 117Z" fill="#FFFFFF"/><ellipse cx="110" cy="270" rx="26" ry="3" fill="#FFFFFF"/><ellipse cx="300" cy="284" rx="34" ry="3.4" fill="#FFFFFF"/><ellipse cx="40" cy="292" rx="22" ry="2.6" fill="#FFFFFF"/></g>
      <g class="puddles"><ellipse cx="62" cy="262" rx="20" ry="3.4"/><ellipse cx="300" cy="258" rx="24" ry="3.6"/><ellipse cx="196" cy="284" rx="30" ry="4.4"/><ellipse cx="112" cy="292" rx="16" ry="3"/><ellipse cx="352" cy="288" rx="18" ry="3.2"/><ellipse cx="250" cy="244" rx="12" ry="2.2"/></g>
      <g class="ripples"><circle cx="62" cy="262" r="4" style="animation-delay:0s"/><circle cx="300" cy="258" r="5" style="animation-delay:0.4s"/><circle cx="196" cy="284" r="6" style="animation-delay:0.8s"/><circle cx="186" cy="283" r="3" style="animation-delay:0.2s"/><circle cx="112" cy="292" r="3.5" style="animation-delay:1s"/><circle cx="352" cy="288" r="4" style="animation-delay:0.6s"/><circle cx="250" cy="244" r="2.6" style="animation-delay:1.2s"/></g>
      ${bed(8, 70)}${bed(322, 70)}
      ${tree(14, 1)}${tree(388, 1.05)}${lamp(92)}${lamp(310)}
      ${leninHead(128, 236)}
      ${dove(232, 262)}${dove(250, 270, 1)}${dove(64, 280)}
    </svg>`;
  }

  return { yurt, yurtSvg, serge, sheep, sun, range, scene, steppe, meander, horse, horseSvg, sheepSvg, dogSvg, kennel, city, leninHead };
})();
