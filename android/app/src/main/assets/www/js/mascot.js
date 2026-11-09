/* BuryatGo — маскот «Бато»: векторная отрисовка со слоями одежды */
window.BG_MASCOT = (function () {
  'use strict';
  const SKIN = '#D9A273', SKIN_D = '#BF8556', HAIR = '#241A13';

  /* Соёмбо (огонь, солнце, луна) — символ с флага и герба Бурятии. Рамка 20x30 */
  function soyombo(x, y, s, c) {
    c = c || '#FFD200';
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
      <path d="M10 0 Q13.2 4 11.6 7.2 Q15 5.2 14.6 9.6 Q13.4 12.6 10 12.6 Q6.6 12.6 5.4 9.6 Q5 5.2 8.4 7.2 Q6.8 4 10 0 Z"/>
      <circle cx="10" cy="17.6" r="3.9"/>
      <path d="M3.2 22 A6.8 6.8 0 0 0 16.8 22 A6.8 3.6 0 0 1 3.2 22 Z"/></g>`;
  }
  /* Флаг Республики Бурятия: синяя (1/2), белая (1/4), жёлтая (1/4) полосы, Соёмбо у древка */
  function flagRect(x, y, w) {
    return `<image href="assets/images/flag-rb.png" x="${x}" y="${y}" width="${w}" height="${w / 2}" preserveAspectRatio="none"/>`;
  }

  function item(id) { return id ? window.BG_DATA.itemsById[id] : null; }

  function hatSvg(h) {
    if (!h) return '';
    switch (h.id) {
      case 'cap':
        return `<path d="M55 62 Q55 24 100 24 Q145 24 145 62 Q100 52 55 62 Z" fill="${h.color}"/>
          <path d="M118 57 Q158 54 172 66 Q150 72 124 66 Z" fill="#1385BD"/>
          <circle cx="100" cy="25" r="4.5" fill="#1385BD"/>`;
      case 'ushanka':
        return `<rect x="41" y="60" width="18" height="40" rx="9" fill="#D9C7B0"/>
          <rect x="141" y="60" width="18" height="40" rx="9" fill="#D9C7B0"/>
          <path d="M53 56 Q55 18 100 18 Q145 18 147 56 Z" fill="${h.color}"/>
          <path d="M48 52 Q100 34 152 52 L152 62 Q100 45 48 62 Z" fill="#E6D7C3"/>
          <path d="M50 61 Q100 44 150 61" stroke="#E6D7C3" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round" stroke-dasharray="2.5 3"/>
          <path d="M58 50 Q100 37 142 50" stroke="rgba(160,135,105,.35)" stroke-width="1.4" fill="none"/>`;
      case 'malgai_blue':
      case 'malgai_gold': {
        const brim = h.id === 'malgai_gold' ? '#7A1F1F' : '#2A2A35';
        return `<path d="M60 60 Q64 14 100 8 Q136 14 140 60 Q100 46 60 60 Z" fill="${h.color}"/>
          <path d="M70 50 Q100 40 130 50" stroke="#FFD43B" stroke-width="3" fill="none"/>
          <path d="M46 64 Q100 42 154 64 Q153 74 148 77 Q100 58 52 77 Q47 74 46 64 Z" fill="${brim}"/>
          <path d="M100 12 L86 36 M100 12 L95 40 M100 12 L105 40 M100 12 L114 36" stroke="#E03131" stroke-width="3" stroke-linecap="round"/>
          <circle cx="100" cy="9" r="7" fill="#E03131"/><circle cx="98" cy="7" r="2" fill="#FF8787"/>`;
      }
      case 'beanie':
        return `<path d="M55 68 Q56 22 100 22 Q144 22 145 68 Z" fill="${h.color}"/>
          <path d="M70 30 L70 62 M85 24 L85 62 M100 22 L100 62 M115 24 L115 62 M130 30 L130 62" stroke="rgba(0,0,0,.12)" stroke-width="3"/>
          <rect x="51" y="58" width="98" height="15" rx="7.5" fill="#C2410C"/><circle cx="100" cy="20" r="10" fill="#FFF4E6"/>`;
      case 'fox_hat':
        return `<path d="M64 50 Q72 8 100 6 Q128 8 136 50 Z" fill="#0F5BB5"/><path d="M100 6 L100 50" stroke="#F2B705" stroke-width="3"/>
          <circle cx="100" cy="6" r="6" fill="#E03131"/>
          <rect x="48" y="44" width="104" height="26" rx="13" fill="${h.color}"/>
          <path d="M56 52 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0" stroke="#FFB37A" stroke-width="3" fill="none"/>
          <path d="M56 62 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0" stroke="#9C3A0A" stroke-width="2.5" fill="none"/>`;
      case 'headband':
        return `<path d="M55 52 Q100 41 145 52 L145 62 Q100 51 55 62 Z" fill="${h.color}" stroke="rgba(0,0,0,.18)" stroke-width="1"/>
          <path d="M64 56 h4 v-3 h4 v3 h4 M88 52.5 h4 v-3 h4 v3 h4 M108 52.5 h4 v-3 h4 v3 h4 M124 56 h4 v-3 h4 v3 h4" stroke="#FFD43B" stroke-width="1.6" fill="none"/>
          <circle cx="100" cy="50.5" r="3.4" fill="#FFD43B" stroke="#C77700" stroke-width="1"/>
          <path d="M145 56 q12 6 8 22 M145 59 q16 2 18 15" stroke="${h.color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      case 'straw':
        return `<path d="M55 72 Q55 60 60 57 H140 Q145 60 145 72 Q132 62 116 63 Q100 59 84 63 Q68 62 55 72 Z" fill="${HAIR}"/>
          <ellipse cx="100" cy="53" rx="64" ry="10" fill="#F2D486" stroke="#C9A043" stroke-width="1.5"/>
          <path d="M70 52 Q71 20 100 19 Q129 20 130 52 Q100 58 70 52 Z" fill="#E9C46A" stroke="#C9A043" stroke-width="1.5"/>
          <path d="M71 42 Q100 48 129 42 L130 51 Q100 57 70 51 Z" fill="#C92A2A"/>
          <path d="M80 28 Q100 24 120 28 M76 36 Q100 32 124 36" stroke="rgba(150,110,30,.35)" stroke-width="1.4" fill="none"/>
          <path d="M44 54 Q100 64 156 54" stroke="rgba(150,110,30,.35)" stroke-width="1.2" fill="none"/>`;
      case 'toortsog':
        return `<path d="M62 72 q-9 16 -5 34 M68 72 q-4 18 2 32" stroke="#C92A2A" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M58 62 Q60 18 100 15 Q140 18 142 62 Q100 50 58 62 Z" fill="${h.color}"/>
          <path d="M100 15 L100 52 M80 22 Q76 40 74 56 M120 22 Q124 40 126 56" stroke="rgba(0,0,0,.14)" stroke-width="2" fill="none"/>
          <path d="M48 64 Q100 44 152 64 L150 76 Q100 58 50 76 Z" fill="#1F2A44"/>
          <path d="M54 68 Q100 52 146 68" stroke="#F2B705" stroke-width="1.8" fill="none" stroke-dasharray="5 3"/>
          <circle cx="100" cy="14" r="6.5" fill="#F2B705" stroke="#C77700" stroke-width="1.2"/><circle cx="98" cy="12" r="2" fill="#FFF3BF"/>`;
      case 'hasarta':
        return `<path d="M44 58 Q38 84 48 104 Q58 108 62 98 L60 60 Z" fill="#8B5E3C"/><path d="M156 58 Q162 84 152 104 Q142 108 138 98 L140 60 Z" fill="#8B5E3C"/>
          <path d="M48 66 Q46 84 52 98 M152 66 Q154 84 148 98" stroke="#A9784F" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M58 58 Q60 14 100 12 Q140 14 142 58 Z" fill="${h.color}"/>
          <path d="M100 12 V56 M64 34 Q100 26 136 34" stroke="#F2B705" stroke-width="2.6" fill="none"/>
          <path d="M46 56 Q100 38 154 56 Q156 66 150 74 Q100 56 50 74 Q44 66 46 56 Z" fill="#A9784F"/>
          <path d="M56 60 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 M120 56 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0" stroke="#C99A6B" stroke-width="2" fill="none"/>
          <circle cx="100" cy="12" r="5.5" fill="#E03131"/>`;
      case 'duulga':
        return `<path d="M100 0 Q88 6 92 16 Q96 8 100 12 Q104 8 108 16 Q112 6 100 0 Z" fill="#E03131"/>
          <path d="M96 16 L100 4 L104 16 Z" fill="#F2B705"/>
          <path d="M57 64 Q57 15 100 13 Q143 15 143 64 Z" fill="#ADB5BD" stroke="#6C757D" stroke-width="2"/>
          <path d="M74 24 Q66 40 66 58" stroke="rgba(255,255,255,.65)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M100 15 V58" stroke="#6C757D" stroke-width="2"/>
          <rect x="52" y="56" width="96" height="13" rx="5" fill="#F2B705" stroke="#C77700" stroke-width="1.4"/>
          ${[64, 82, 118, 136].map(x => `<circle cx="${x}" cy="62.5" r="2.4" fill="#FFF3BF"/>`).join('')}
          <circle cx="100" cy="62.5" r="4" fill="#1E6BC6" stroke="#FFF3BF" stroke-width="1"/>`;
      case 'newyear':
        return `<path d="M58 62 Q62 22 100 20 Q138 22 152 46 Q160 60 160 76 L150 74 Q146 56 136 48 Q140 56 142 62 Z" fill="${h.color}"/>
          <path d="M78 30 Q72 44 70 58" stroke="rgba(255,255,255,.25)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <rect x="50" y="56" width="100" height="16" rx="8" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1.4"/>
          <circle cx="158" cy="80" r="9" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1.4"/>
          <path d="M90 38l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#FFE066"/>`;
      case 'crown':
        return `<g class="crown-big" transform="translate(100 64) scale(1.42) translate(-100 -56)"><path d="M62 50 L66 14 L84 34 L100 6 L116 34 L134 14 L138 50 Z" fill="#F2B705" stroke="#C99400" stroke-width="2.5" stroke-linejoin="round"/>
          <rect x="60" y="44" width="80" height="12" rx="5" fill="#E0A800"/>
          <circle cx="100" cy="50" r="4.5" fill="#1E6BC6"/><circle cx="80" cy="50" r="3.5" fill="#E03131"/><circle cx="120" cy="50" r="3.5" fill="#E03131"/>
          <circle cx="66" cy="14" r="4" fill="#FFF3BF"/><circle cx="100" cy="6" r="4.5" fill="#FFF3BF"/><circle cx="134" cy="14" r="4" fill="#FFF3BF"/>
          <path d="M70 47H130" stroke="#FFF3BF" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></g>`;
      default: return '';
    }
  }

  function accSvg(a) {
    if (!a) return '';
    if (a.id === 'glasses') return `<g fill="rgba(255,255,255,.25)" stroke="#2B2B2B" stroke-width="3"><circle cx="82" cy="84" r="11"/><circle cx="118" cy="84" r="11"/></g><path d="M93 83 h14" stroke="#2B2B2B" stroke-width="3"/>`;
    if (a.id === 'sunglasses') return `<g fill="#1E1E24" stroke="#1E1E24" stroke-width="2"><rect x="68" y="76" width="27" height="17" rx="7"/><rect x="105" y="76" width="27" height="17" rx="7"/></g><path d="M95 82 h10" stroke="#1E1E24" stroke-width="3"/><path d="M72 80 l8 0" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/>`;
    if (a.id === 'headphones') return `<path d="M52 86 Q52 26 100 26 Q148 26 148 86" stroke="#22252E" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="42" y="72" width="20" height="30" rx="9" fill="#E03131"/><rect x="138" y="72" width="20" height="30" rx="9" fill="#E03131"/>
      <rect x="47" y="78" width="6" height="18" rx="3" fill="#FFD8D8"/><rect x="147" y="78" width="6" height="18" rx="3" fill="#FFD8D8"/>`;
    return '';
  }

  function medalSvg(a) {
    if (!a) return '';
    if (a.id === 'scarf') return `<path d="M70 116 Q100 134 130 116 L132 128 Q100 146 68 128 Z" fill="#E03131"/>
      <path d="M112 130 L122 168 L108 170 L102 134 Z" fill="#C92A2A"/><path d="M110 162 l12 -2 M108 166 l13 -2" stroke="#FFD43B" stroke-width="2"/>
      <path d="M74 122 Q100 138 126 122" stroke="#FFD43B" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`;
    if (a.id === 'erikhe') {
      let b = '';
      for (let i = 0; i <= 12; i++) { const ang = Math.PI * (i / 12); const x = 100 - Math.cos(ang) * 22, y = 120 + Math.sin(ang) * 26;
        b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="${i % 3 ? '#8B5A2B' : '#1E6BC6'}"/>`; }
      return b + `<circle cx="100" cy="152" r="5" fill="#F2B705"/><path d="M100 156 L100 166" stroke="#E03131" stroke-width="3"/>`;
    }
    if (a.id === 'soyombo_pin') return `<circle cx="119" cy="146" r="11" fill="#0F5BB5" stroke="#F2B705" stroke-width="2.5"/>${soyombo(113.4, 137.5, 0.56)}`;
    if (a.id !== 'medal') return '';
    return `<path d="M92 120 L100 146 L108 120" stroke="#1CB0F6" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <circle cx="100" cy="150" r="10" fill="#FFC800" stroke="#E0A800" stroke-width="2"/><path d="M96 150 l3 3 l5 -6" stroke="#fff" stroke-width="2" fill="none"/>`;
  }

  /* Предметы в руке: рисуются относительно кисти (0,0) и находятся снаружи от туловища.
     over: true — предмет лежит поверх ладони (тарелка, хадак), иначе кисть обхватывает предмет. */
  function cupSvg(liquid, empty, rim) {
    const steam = (pts) => `<path d="${pts}" stroke="rgba(150,165,190,.75)" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    return `${empty || !rim ? '' : steam('M17 -18 q-4 -6 0 -12 q4 -6 0 -12') + steam('M26 -18 q-3 -5 0 -10')}
        <path d="M8 -6 q-10 0 -10 7 q0 7 10 6" stroke="#1E6BC6" stroke-width="3" fill="none"/>
        <path d="M7 -13 H35 Q34 8 21 10 Q8 8 7 -13 Z" fill="#FFFFFF" stroke="#1E6BC6" stroke-width="2.4"/>
        <path d="M9 -6 H33" stroke="#F2B705" stroke-width="3"/>
        <ellipse class="m-cup-in" cx="21" cy="-13" rx="14" ry="3.2" fill="${empty ? '#EEF3FA' : liquid}" stroke="#1E6BC6" stroke-width="1.6"/>
        ${empty ? '<path d="M12 -12.4 Q21 -10.6 30 -12.4" stroke="#C9D6E8" stroke-width="1.2" fill="none"/>' : ''}
        <ellipse cx="21" cy="12" rx="17" ry="3" fill="#E7F0FB" stroke="#1E6BC6" stroke-width="1.6"/>`;
  }
  function handSvg(h, empty) {
    if (!h) return null;
    const steam = (pts) => `<path d="${pts}" stroke="rgba(150,165,190,.75)" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    switch (h.id) {
      case 'ball': return { svg: `<circle cx="17" cy="-4" r="13" fill="#FF6B6B" stroke="#D94848" stroke-width="1.2"/><path d="M4 -4 Q17 -12 30 -4" stroke="#fff" stroke-width="2.6" fill="none"/><path d="M17 -17 Q11 -4 17 9" stroke="#fff" stroke-width="2.6" fill="none"/><circle cx="12" cy="-10" r="3" fill="rgba(255,255,255,.35)"/>` };
      case 'hadak': return { over: true, svg: `<path d="M-6 -4 Q8 -10 14 2 Q20 18 14 34 Q10 46 16 58" stroke="#74C0FC" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-4 2 Q4 16 0 30 Q-3 40 2 50" stroke="#A5D8FF" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M10 8 Q14 20 11 32" stroke="rgba(255,255,255,.6)" stroke-width="1.6" fill="none"/>` };
      case 'bow': return { svg: `<path d="M6 -62 Q38 0 6 62" stroke="#8B5A2B" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M6 -62 Q36 0 6 62" stroke="#B07A44" stroke-width="2" fill="none"/><path d="M6 -62 L6 62" stroke="#CED4DA" stroke-width="1.4"/>` };
      case 'khur': return { svg: `<rect x="1" y="-74" width="7" height="96" rx="3" fill="#7A4A21"/>
        <path d="M-1 -70 Q-6 -86 5 -92 Q17 -90 15 -78 L8 -70 Z" fill="#7A4A21"/><circle cx="9" cy="-82" r="1.7" fill="#1E1E24"/>
        <path d="M-8 18 L18 18 L15 54 L-5 54 Z" fill="#B0703A" stroke="#6B3E1F" stroke-width="2"/>
        <path d="M3.5 -68 L3.5 50 M6 -68 L6 50" stroke="#F1E0C5" stroke-width="1"/>` };
      case 'flag_rb': return { svg: `<path d="M2 -86 L2 40" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><circle cx="2" cy="-87" r="4" fill="#F2B705"/>
        <g class="m-flag">${flagRect(4, -84, 40)}</g>` };
      case 'umbrella': return { svg: `<g class="m-umb"><path d="M4 10Q8 22 -2 24Q-8 24 -9 18" stroke="#5B3A1E" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M4 10L-56 -146" stroke="#5B3A1E" stroke-width="4" stroke-linecap="round"/><g transform="translate(-58 -150) rotate(-22)"><path d="M-92 0Q-90 -64 0 -68Q90 -64 92 0Q77 -12 61 0Q46 -12 31 0Q15 -12 0 0Q-15 -12 -31 0Q-46 -12 -61 0Q-77 -12 -92 0Z" fill="#E03131"/><path d="M-61 0Q-52 -52 0 -68Q-28 -40 -31 0Q-46 -12 -61 0ZM31 0Q28 -40 0 -68Q52 -52 61 0Q46 -12 31 0Z" fill="#F2B705"/><path d="M0 -68V0" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/><circle cx="0" cy="-70" r="4" fill="#5B3A1E"/></g></g>` };
      case 'tea': return { svg: cupSvg('#E2C597', empty, true) };
      case 'milk': return { svg: cupSvg('#FFFDF5', empty, false) };
      case 'tea_old': return { svg: `${steam('M17 -18 q-4 -6 0 -12 q4 -6 0 -12')}${steam('M26 -18 q-3 -5 0 -10')}
        <path d="M8 -6 q-10 0 -10 7 q0 7 10 6" stroke="#1E6BC6" stroke-width="3" fill="none"/>
        <path d="M7 -13 H35 Q34 8 21 10 Q8 8 7 -13 Z" fill="#FFFFFF" stroke="#1E6BC6" stroke-width="2.4"/>
        <path d="M9 -6 H33" stroke="#F2B705" stroke-width="3"/><ellipse cx="21" cy="-13" rx="14" ry="3.2" fill="#E2C597" stroke="#1E6BC6" stroke-width="1.6"/>
        <ellipse cx="21" cy="12" rx="17" ry="3" fill="#E7F0FB" stroke="#1E6BC6" stroke-width="1.6"/>` };
      case 'buuza_plate': {
        const bz = (x, y) => `<path d="M${x - 8} ${y} Q${x - 8} ${y - 11} ${x} ${y - 12} Q${x + 8} ${y - 11} ${x + 8} ${y} Z" fill="#FBF3E4" stroke="#D9C3A0" stroke-width="1.4"/>
          <path d="M${x - 4.5} ${y - 2} Q${x - 2} ${y - 8} ${x} ${y - 12} M${x + 4.5} ${y - 2} Q${x + 2} ${y - 8} ${x} ${y - 12}" stroke="#D9C3A0" stroke-width="1.1" fill="none"/><circle cx="${x}" cy="${y - 12}" r="1.8" fill="#E8D6B5"/>`;
        return { over: true, svg: `<ellipse cx="16" cy="-6" rx="25" ry="7" fill="#FFFFFF" stroke="#1E6BC6" stroke-width="2.4"/><ellipse cx="16" cy="-7" rx="17" ry="4" fill="none" stroke="#F2B705" stroke-width="1.4"/>
          ${bz(7, -7)}${bz(25, -7)}${bz(16, -10)}${steam('M6 -26 q-3 -5 0 -10')}${steam('M18 -30 q-3 -5 0 -10')}${steam('M30 -26 q-3 -5 0 -10')}` };
      }
      case 'drum': return { svg: `<circle cx="22" cy="-12" r="21" fill="#F1D9A6" stroke="#8B5A2B" stroke-width="5"/>
        <circle cx="22" cy="-12" r="13" fill="none" stroke="#E03131" stroke-width="2" stroke-dasharray="5 3"/>${soyombo(16.5, -21, 0.55, '#1E6BC6')}
        <path d="M8 6 l-4 12 M36 6 l4 12" stroke="#74C0FC" stroke-width="4" stroke-linecap="round"/>` };
      default: return null;
    }
  }

  /* Обувь: унты (меховые сапоги с загнутым носком и орнаментом) и кроссовки */
  function feetSvg(f) {
    if (f.id === 'skates') {
      const one = `<path d="M75 198 H96 V224 Q96 228 92 228 H72 Q67 228 67 223 Q67 216 75 213 Z" fill="#F8F9FA" stroke="#868E96" stroke-width="1.4"/>
        <path d="M78 203 h14 M78 208 h14 M78 213 h14" stroke="#E03131" stroke-width="1.6"/><path d="M74 198 H97" stroke="#1E6BC6" stroke-width="3"/>
        <path d="M72 228V233M92 228V233" stroke="#868E96" stroke-width="2"/><path d="M64 234 H98 Q102 234 101 230" stroke="#CED4DA" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      return `${one}<g transform="translate(200 0) scale(-1 1)">${one}</g>`;
    }
    if (f.id === 'sneakers') {
      const one = `<path d="M74 214 H97 V224 Q97 229 92 229 H74 Q68 229 68 223 Q68 214 74 214 Z" fill="#FFFFFF" stroke="#ADB5BD" stroke-width="1.5"/>
        <path d="M72 226 H97" stroke="#1E6BC6" stroke-width="3"/><path d="M80 219 l6 -3 M84 221 l6 -3" stroke="#E03131" stroke-width="2"/>`;
      return `${one}<g transform="translate(200 0) scale(-1 1)">${one}</g>`;
    }
    const fest = f.id === 'unty_fest';
    const c = fest ? '#1B4F9C' : '#7B4A2B', dk = fest ? '#10306A' : '#4E2C17';
    const fur = fest ? '#FFFFFF' : '#F3E6D2', bnd = fest ? '#F2B705' : '#F1DDBF', orn = fest ? '#F2B705' : '#F1DDBF';
    const mz = window.BG_ART ? window.BG_ART.meander(77, 98.5, 193.2, 3.6, 3.6, dk) : '';
    const one = `<path d="M59.6 221.5Q59.6 229.6 70 229.6H92.6Q100.5 229.6 100.5 219V212H99V219Q99 227 92 227H70Q61 227 61 221.5Z" fill="#3B2A22"/>
      <path d="M76 194H99V219Q99 227 92 227H70Q61 227 61 221.5Q61 216 69 215L76 213Z" fill="${c}" stroke="${dk}" stroke-width="1.2"/>
      <path d="M62.6 225.4Q65 227.6 70 227.6H92.2Q97.6 227.6 98.8 223.5" stroke="rgba(0,0,0,.35)" stroke-width="1" fill="none"/>
      <path d="M80 201l2 4M86 203l2 5M93 200l1.6 4M79 214l2 4M89 214l2 4M67 219l2 3M75 220l2 4M95 217l1.5 3" stroke="${dk}" stroke-width="1.1" stroke-linecap="round"/>
      <path d="M79 211q0-4 4-4q3 0 3 3q0 2-2 2M85.5 209.5q1-3.5 4.5-3.5q3.5 0 3.5 3.3q0 3.2-4.2 3.2q-5 0-9.5 3.2" stroke="${orn}" stroke-width="1.9" fill="none" stroke-linecap="round"/>
      <rect x="76" y="192" width="23" height="5.6" fill="${bnd}" stroke="${dk}" stroke-width=".8"/>${mz}
      <path d="M72.5 193q-2.5-5 1.5-8q1-5 6-4q3-4 7-2q4-3 7 0q5-1 6 4q4 3 1.5 8q-1.5 2.5-4.5 1.6q-3 2-6 0q-3 2-6 0q-3 2-6 0q-3.5 1.4-6.5-.6Z" fill="${fur}" stroke="#CDB596" stroke-width="1"/>
      <path d="M77 188q2-2 4 0M85 186.5q2-2 4 0M93 188q2-2 4 0" stroke="#CDB596" stroke-width="1" fill="none"/>`;
    return `${one}<g transform="translate(200 0) scale(-1 1)">${one}</g>`;
  }


  /* v1.8: орнаменты дэгэла */
  function degelOrn(o) {
    const t = o.trim || '#FFD43B';
    if (o.orn === 'olzy') return [70, 84, 116, 130].map(x => `<path d="M${x} 185l4.5 4.5-4.5 4.5-4.5-4.5z" fill="none" stroke="${t}" stroke-width="1.6"/><circle cx="${x}" cy="189.5" r="1.3" fill="${t}"/>`).join('') +
      `<path d="M121 144l5.5 5.5-5.5 5.5-5.5-5.5zM121 146.5v6M118 149.5h6" fill="none" stroke="${t}" stroke-width="1.4"/>`;
    if (o.orn === 'meander') { let d = 'M58 197'; for (let x = 58; x < 140; x += 8) d += ' h4 v-4 h4 v4'; return `<path d="${d}" fill="none" stroke="${t}" stroke-width="1.7" stroke-linejoin="round"/><path d="M84 186h32" stroke="${t}" stroke-width="1.3" stroke-dasharray="3 2"/>`; }
    if (o.orn === 'dots') return Array.from({ length: 11 }, (_, i) => `<circle cx="${60 + i * 8}" cy="${194 + Math.abs(i - 5) * 0.4}" r="1.9" fill="${t}" stroke="rgba(0,0,0,.15)" stroke-width=".5"/>`).join('') +
      [0, 1, 2].map(i => `<circle cx="124" cy="${150 + i * 8}" r="1.7" fill="${t}" stroke="rgba(0,0,0,.15)" stroke-width=".5"/>`).join('');
    return '';
  }
  /* v1.8: кушак / пояс поверх любой одежды */
  /* v1.8.1: головные уборы, при которых брови видны */
  const BROWS_OK = ['cap', 'headband', 'straw', 'ushanka'];
  function beltSvg(b, robe) {
    if (!b) return '';
    const c = b.color, by = robe ? 160 : 170;
    const band = robe ? 'M59.6 158Q100 166 140.4 158L141 171Q100 179 59 171Z' : 'M61.7 168Q100 176 138.3 168L138 180Q100 188 62 180Z';
    const hi = robe ? 'M60 161Q100 169 140 161' : 'M62 171Q100 179 138 171';
    const ends = b.studs
      ? [70, 82, 118, 130].map(x => `<circle cx="${x}" cy="${by + 4 + (Math.abs(x - 100) < 25 ? 1.6 : 0)}" r="2.6" fill="#DEE2E6" stroke="#868E96" stroke-width=".8"/>`).join('')
      : `<path d="M104 ${by + 9}l4 13M108 ${by + 9}l7 11" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/><path d="M106 ${by + 20}l3 3M113 ${by + 18}l3 2" stroke="#FFD43B" stroke-width="1.4" stroke-linecap="round"/>`;
    return `<path d="${band}" fill="${c}" stroke="rgba(0,0,0,.28)" stroke-width="1"/><path d="${hi}" stroke="rgba(255,255,255,.3)" stroke-width="1.2" fill="none"/>${ends}
      <rect x="93.5" y="${by}" width="13" height="12" rx="3" fill="${b.studs ? '#DEE2E6' : '#FFE066'}" stroke="${b.studs ? '#868E96' : '#C77700'}" stroke-width="1.4"/>`;
  }
  /* Туловище: одна аккуратная форма с плечами, обводкой и мягкими тенями */
  const TORSO = 'M68 124Q100 110 132 124Q139 128 139 142L137 186Q100 195 63 186L61 142Q61 128 68 124Z';
  const ROBE = 'M68 124Q100 110 132 124Q139 128 140 142L147 208Q100 220 53 208L60 142Q61 128 68 124Z';
  const LINE = 'rgba(40,30,20,.18)';
  function bodySvg(o) {
    const c = o.color;
    if (o.style === 'degel') {
      const trim = o.trim || '#FFD43B';
      return `<path d="${ROBE}" fill="${c}" stroke="${LINE}" stroke-width="1.5"/>
        <path d="M118 120Q134 124 138 140L146 207Q136 211 126 213Q134 160 118 120Z" fill="rgba(0,0,0,.09)"/>
        <path d="M86 118Q98 129 112 129Q127 130 139 138L139.6 146Q126 138 111 137.5Q95 137 84 124Z" fill="${trim}"/>
        <path d="M139 144L145.5 206" stroke="${trim}" stroke-width="5" stroke-linecap="round"/>
        <path d="M55 204Q100 216 146 204" stroke="${trim}" stroke-width="6" fill="none"/>
        <path d="M60 158Q100 166 140 158L140.6 170Q100 178 59.4 170Z" fill="${o.belt || '#E8590C'}"/>
        <path d="M60 160.5Q100 168.5 140 160.5" stroke="rgba(255,255,255,.25)" stroke-width="1.2" fill="none"/>
        <rect x="94" y="161" width="12" height="12" rx="3" fill="#FFE066" stroke="#C77700" stroke-width="1.5"/>
        <circle cx="121" cy="133.5" r="2.4" fill="#FFE066" stroke="#C77700" stroke-width=".8"/><circle cx="132" cy="138" r="2.4" fill="#FFE066" stroke="#C77700" stroke-width=".8"/>
        <path d="M86 114Q100 109 114 114L113 123Q100 119.5 87 123Z" fill="${trim}"/>${degelOrn(o)}`;
    }
    if (o.style === 'vest') {
      const sh = o.shirt || '#FBF4E6', tr = o.trim || '#F2B705';
      return `<path d="${TORSO}" fill="${sh}" stroke="${LINE}" stroke-width="1.5"/>
        <path d="M100 123V184" stroke="rgba(0,0,0,.12)" stroke-width="1.6"/>
        <path d="M68 124Q79 118 90 116L98 150L96 189Q78 188 63 185L61 142Q61 128 68 124Z" fill="${c}" stroke="${LINE}" stroke-width="1.2"/>
        <path d="M132 124Q121 118 110 116L102 150L104 189Q122 188 137 185L139 142Q139 128 132 124Z" fill="${c}" stroke="${LINE}" stroke-width="1.2"/>
        <path d="M118 124Q133 128 137 140L137 184Q130 186 124 187Q128 150 118 124Z" fill="rgba(0,0,0,.1)"/>
        <path d="M90 116L98 150L96 189M110 116L102 150L104 189" stroke="${tr}" stroke-width="${o.fur ? 6 : 3}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M63 184Q80 188 96 189M104 189Q122 188 137 184" stroke="${tr}" stroke-width="${o.fur ? 5 : 3}" fill="none" stroke-linecap="round"/>
        ${[0, 1, 2].map(i => `<circle cx="94" cy="${138 + i * 14}" r="2" fill="${tr}" stroke="rgba(0,0,0,.2)" stroke-width=".5"/>`).join('')}
        <path d="M73 148l5 5-5 5-5-5zM127 148l5 5-5 5-5-5z" fill="none" stroke="${tr}" stroke-width="1.6"/>`;
    }
    const dk = o.dark || 'rgba(0,0,0,.2)';
    let s = `<path d="${TORSO}" fill="${c}" stroke="${LINE}" stroke-width="1.5"/>
      <path d="M118 120Q133 124 137 138L137 186Q130 189 122 190Q130 152 118 120Z" fill="rgba(0,0,0,.08)"/>
      <path d="M64 182Q100 191 136 182" stroke="rgba(0,0,0,.12)" stroke-width="2" fill="none"/>`;
    if (o.style === 'samsa') {
      return s + `<path d="M85 115Q100 110 115 115L113.5 124.5Q100 121 86.5 124.5Z" fill="${dk}"/>
        <path d="M100 123V172" stroke="${dk}" stroke-width="2.4"/>
        ${[132, 143, 154, 165].map(y => `<circle cx="100" cy="${y}" r="2" fill="#7A4E0E"/>`).join('')}
        <path d="M108 139h12v9q-6 3-12 0z" fill="none" stroke="${dk}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M78 140Q80 160 78 178" stroke="rgba(0,0,0,.07)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    }
    if (o.style === 'hoodie') {
      return s + `<path d="M78 119Q100 138 122 119" stroke="rgba(0,0,0,.2)" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M93 128L91 150M107 128L109 150" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M80 162h40v13q-20 6-40 0z" fill="rgba(0,0,0,.12)"/>`;
    }
    return s + `<path d="M88 117Q100 129 112 117" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="3"/>
      <text x="100" y="163" text-anchor="middle" font-size="18" font-weight="900" fill="rgba(255,255,255,.88)" font-family="sans-serif">Б</text>`;
  }

  /* Рука: рукав с обводкой, манжета и кисть с большим пальцем */
  function armSvg(d, cuff, hx, hy, sleeve, cuffC, thumbDir) {
    return `<path d="${d}" stroke="${LINE}" stroke-width="19.5" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="${sleeve}" stroke-width="17" fill="none" stroke-linecap="round"/>
      <path d="${cuff}" stroke="${cuffC}" stroke-width="17.5" fill="none"/>
      <circle cx="${hx}" cy="${hy}" r="8.6" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="1.2"/>
      <ellipse cx="${hx + thumbDir * 6}" cy="${hy - 3}" rx="3" ry="4" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="1"/>`;
  }

  /**
   * @param equip {hat, outfit, hand, acc, feet}
   * @param opts {mood:'happy'|'normal'|'sad', cls:string}
   */
  function svg(equip, opts) {
    equip = equip || {}; opts = opts || {};
    const out = item(equip.outfit) || item('tshirt_green');
    const hat = item(equip.hat), hand = item(equip.hand), acc = item(equip.acc), feet = item(equip.feet), belt = item(equip.belt);
    const sleeve = out.style === 'vest' ? (out.shirt || '#FBF4E6') : out.color;
    const cuffC = out.style === 'degel' ? (out.trim || '#FFD43B') : (out.dark || 'rgba(0,0,0,.16)');
    const robe = out.style === 'degel';
    const cupEmpty = !!(hand && hand.cup && !opts.full && typeof api.cupEmpty === 'function' && api.cupEmpty(hand.id));
    const held = handSvg(hand, cupEmpty);
    const mood = opts.mood || 'normal';
    const mouth = mood === 'happy'
      ? `<path d="M87 100Q100 118 113 100Z" fill="#8F2D2D"/><path d="M93 109Q100 114 107 109" fill="#FF8787"/><path d="M89 100.5H111" stroke="#fff" stroke-width="2.2" opacity=".85"/>`
      : mood === 'sad'
        ? `<path d="M90 109Q100 101 110 109" stroke="#5A2A2A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
        : `<path d="M89 102Q100 112 111 102" stroke="#5A2A2A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const pants = out.pants || '#34405E';
    const sc = out.socks, scd = '#D9A436';
    const SOCK = '#FBF7EE', SOCK_L = '#6E604C', SOCK_C = '#2F5FB3', SOCK_P = '#CFE0F7';
    const socks = sc && !robe ? `<rect x="79.5" y="198" width="16" height="22" rx="6" fill="${SOCK}" stroke="${SOCK_L}" stroke-width="1.3"/><rect x="104.5" y="198" width="16" height="22" rx="6" fill="${SOCK}" stroke="${SOCK_L}" stroke-width="1.3"/>
        <path d="M81 210h13M106 210h13" stroke="#E03131" stroke-width="1.2"/><path d="M81 213h13M106 213h13" stroke="${SOCK_C}" stroke-width="1"/>
        <path d="M90 200v18M115 200v18" stroke="rgba(0,0,0,.08)" stroke-width="4"/>
        <rect x="78" y="195" width="19" height="7" rx="3" fill="${SOCK_C}" stroke="${SOCK_L}" stroke-width="1"/><rect x="103" y="195" width="19" height="7" rx="3" fill="${SOCK_C}" stroke="${SOCK_L}" stroke-width="1"/>
        <path d="M80 198.5h15M105 198.5h15" stroke="#F2B705" stroke-width="1.3" stroke-dasharray="2 1.5"/>` : '';
    const boots = feet ? feetSvg(feet) : (sc && !robe)
      ? `<path d="M96 214V221Q96 227 89 227H78Q70 227 70 222Q70 217 78 216L80 214Z" fill="${SOCK}"/><path d="M79 216Q70 217 70 222Q70 227 77 227H81V216Z" fill="${SOCK_P}"/><path d="M96 222V221Q96 227 89 227H87V222Z" fill="${SOCK_P}"/>
         <path d="M96 214V221Q96 227 89 227H78Q70 227 70 222Q70 217 78 216L80 214Z" fill="none" stroke="${SOCK_L}" stroke-width="1.4" stroke-linejoin="round"/>
         <path d="M104 214V221Q104 227 111 227H122Q130 227 130 222Q130 217 122 216L120 214Z" fill="${SOCK}"/><path d="M121 216Q130 217 130 222Q130 227 123 227H119V216Z" fill="${SOCK_P}"/><path d="M104 222V221Q104 227 111 227H113V222Z" fill="${SOCK_P}"/>
         <path d="M104 214V221Q104 227 111 227H122Q130 227 130 222Q130 217 122 216L120 214Z" fill="none" stroke="${SOCK_L}" stroke-width="1.4" stroke-linejoin="round"/>`
      : robe
      ? `<path d="M72 216Q72 226 86 226Q98 226 99 220L97 212L76 212Z" fill="#6B3E1F"/><path d="M72 218Q66 214 68 210" stroke="#6B3E1F" stroke-width="4" stroke-linecap="round" fill="none"/>
         <path d="M128 216Q128 226 114 226Q102 226 101 220L103 212L124 212Z" fill="#6B3E1F"/><path d="M128 218Q134 214 132 210" stroke="#6B3E1F" stroke-width="4" stroke-linecap="round" fill="none"/>`
      : `<ellipse cx="86" cy="222" rx="13" ry="7" fill="#3A3A48"/><ellipse cx="114" cy="222" rx="13" ry="7" fill="#3A3A48"/>`;
    const armL = armSvg('M70 128Q57 146 56 166', 'M56.4 159L56 168', 56, 175, sleeve, cuffC, 1);
    const armR = held
      ? armSvg('M130 128Q149 140 152 157', 'M151.3 151L152.6 159.5', 154, 166, sleeve, cuffC, -1)
      : armSvg('M130 128Q143 146 144 166', 'M143.6 159L144 168', 144, 175, sleeve, cuffC, -1);
    const heldSvg = held ? `<g class="m-held" transform="translate(154 166)">${held.svg}</g>` : '';
    const coverHair = !!(hat && ['malgai_blue', 'malgai_gold', 'ushanka', 'beanie', 'fox_hat', 'toortsog', 'hasarta', 'duulga', 'newyear', 'straw'].indexOf(hat.id) >= 0);
    const hair = coverHair ? '' : `<path d="M55 72 Q57 30 100 30 Q143 30 145 72 Q132 52 114 57 Q102 46 88 57 Q70 52 55 72 Z" fill="${HAIR}"/>`;

    return `<svg overflow="visible" class="mascot-svg ${held ? 'holding' : ''} ${opts.cls || ''}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-label="Бато">
      <ellipse cx="100" cy="230" rx="54" ry="7" fill="rgba(0,0,0,.12)"/>
      <g class="m-body">
        <rect x="79" y="176" width="17" height="44" rx="8" fill="${pants}"/>
        <rect x="104" y="176" width="17" height="44" rx="8" fill="${pants}"/>
        <path d="M100 182V200" stroke="rgba(0,0,0,.15)" stroke-width="1.4"/>
        ${socks}
        ${boots}
        <rect x="91" y="106" width="18" height="16" rx="5" fill="${SKIN_D}"/>
        ${bodySvg(out)}
        ${beltSvg(belt, robe)}
        ${medalSvg(acc)}
        <g class="m-arm-l">${armL}</g>
        <g class="m-arm-r">${held && held.over ? armR + heldSvg : heldSvg + armR}</g>
        <g class="m-head">
          <circle cx="55" cy="86" r="9" fill="${SKIN_D}"/><circle cx="145" cy="86" r="9" fill="${SKIN_D}"/>
          <circle cx="55" cy="86" r="4.5" fill="${SKIN}"/><circle cx="145" cy="86" r="4.5" fill="${SKIN}"/>
          <circle cx="100" cy="78" r="46" fill="${SKIN}"/>
          <path d="M60 100Q72 122 100 124Q128 122 140 100Q128 116 100 117Q72 116 60 100Z" fill="rgba(0,0,0,.05)"/>
          ${hair}
          ${hat && !BROWS_OK.includes(hat.id) ? '' : `<path class="m-brows" d="M73 70 Q82 66 91 70M109 70 Q118 66 127 70" stroke="${HAIR}" stroke-width="3" fill="none" stroke-linecap="round"/>`}
          <g class="m-eyes">
            <ellipse cx="82" cy="85" rx="5.5" ry="6.5" fill="#1E1E24"/><ellipse cx="118" cy="85" rx="5.5" ry="6.5" fill="#1E1E24"/>
            <circle cx="84" cy="82.5" r="2" fill="#fff"/><circle cx="120" cy="82.5" r="2" fill="#fff"/>
          </g>
          <path d="M97 94Q100 97 103 94" stroke="${SKIN_D}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <ellipse cx="70" cy="99" rx="9" ry="6" fill="#FF8A8A" opacity=".5"/><ellipse cx="130" cy="99" rx="9" ry="6" fill="#FF8A8A" opacity=".5"/>
          ${mouth}
          ${accSvg(acc)}
          <g class="m-back"><circle cx="100" cy="78" r="47" fill="${HAIR}"/><path d="M70 60 Q100 44 130 60 M66 80 Q100 66 134 80 M72 102 Q100 92 128 102" stroke="rgba(255,255,255,.12)" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M88 122 Q100 128 112 122" stroke="${HAIR}" stroke-width="7" fill="none" stroke-linecap="round"/></g>
          ${hatSvg(hat)}
        </g>
      </g>
    </svg>`;
  }

  /* Иконка предмета для карточек магазина: маскот только с этим предметом */
  function preview(itemId) {
    const it = item(itemId);
    if (!it) return '';
    if (it.slot === 'bonus') return `<div class="bonus-icon">🧊</div>`;
    const eq = { hat: null, outfit: 'tshirt_green', feet: null, hand: null, acc: null, belt: null };
    eq[it.slot] = it.id;
    return svg(eq, { cls: 'mini', full: true });
  }

  const api = { svg, preview, soyombo, flagRect, cupEmpty: null };
  return api;
})();
