/* BuryatGo — локальная база данных (localStorage, версионирование, резервная копия) */
window.BG_STORE = (function () {
  'use strict';
  const KEY = 'buryatgo_state_v1';
  const BACKUP_KEY = 'buryatgo_state_v1_backup';
  const PLAYERS_KEY = 'buryatgo_players_v1';
  const pad = n => String(n).padStart(2, '0');

  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseDay(k) { const p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function addDays(k, n) { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); }
  function diffDays(a, b) {
    const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
    return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
  }
  function weekStart(d) { d = d || new Date(); const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  function weekKey(d) { return dayKey(weekStart(d)); }

  function defaults() {
    return {
      version: 1,
      name: 'Ученик',
      createdAt: dayKey(),
      onboarded: false,
      xp: 0,
      buzzy: 100,
      buzzyEarned: 0,
      streak: 0,
      bestStreak: 0,
      lastActive: null,
      freezes: 0,
      xpByDay: {},
      lessons: {},
      words: {},
      stats: { answers: 0, correct: 0, perfect: 0, lessons: 0, purchases: 0 },
      owned: ['tshirt_green'],
      equip: { hat: null, outfit: 'tshirt_green', feet: null, hand: null, acc: null },
      playerId: 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      premium: null,
      horses: { owned: [], main: null, freeUsed: false },
      pets: { sheep: 10, starter: true },
      league: 0,
      week: { key: weekKey(), xp: 0 },
      pendingLeagueResult: null,
      unlockedAchievements: [],
      settings: {
        sfxClick: true, sfxCorrect: true, sfxWrong: true,
        music: false, musicVol: 0.35,
        tts: true, ttsRate: 0.85, voice: 'female',
        haptics: true,
        notif: false, notifTime: '19:00',
        dailyGoal: 20
      }
    };
  }

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function merge(base, obj) {
    Object.keys(obj || {}).forEach(k => {
      if (isObj(obj[k]) && isObj(base[k])) base[k] = merge(base[k], obj[k]);
      else base[k] = obj[k];
    });
    return base;
  }

  function load() {
    const tryParse = key => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } };
    const saved = tryParse(KEY) || tryParse(BACKUP_KEY);
    const st = saved ? merge(defaults(), saved) : defaults();
    /* Миграции: возврат прежней озвучки, голос по умолчанию — женский (Irina) */
    if (st.settings.voice !== 'male') st.settings.voice = 'female';
    if ([0.6, 0.85, 1.05].indexOf(st.settings.ttsRate) < 0) st.settings.ttsRate = 0.85;
    if (!('feet' in st.equip)) st.equip.feet = null;
    return st;
  }

  const api = {
    state: load(),
    today: () => dayKey(),
    dayKey, addDays, diffDays, weekStart, weekKey, parseDay,
    save() {
      try {
        api.state._savedAt = Date.now();
        const json = JSON.stringify(api.state);
        const prev = localStorage.getItem(KEY);
        if (prev) localStorage.setItem(BACKUP_KEY, prev);
        localStorage.setItem(KEY, json);
      } catch (e) { console.warn('save failed', e); }
      if (window.BG_CLOUD) window.BG_CLOUD.schedule();
      api.syncPlayer();
    },
    /* Реестр живых игроков: снимок профиля сохраняется при каждом сохранении.
       При подключении сервера (window.BG_PLAYERS_API) снимок отправляется туда же. */
    playerSnapshot() {
      const s = api.state, done = Object.keys(s.lessons).filter(k => s.lessons[k] && s.lessons[k].done).length;
      return {
        id: s.playerId, name: s.name || 'Ученик', createdAt: s.createdAt, lastSeen: Date.now(), lastActive: s.lastActive,
        xp: s.xp, weekXp: s.week ? s.week.xp : 0, buzzy: s.buzzy, buzzyEarned: s.buzzyEarned, streak: s.streak, bestStreak: s.bestStreak,
        freezes: s.freezes, league: s.league, lessonsDone: done, lessonsTotal: s.stats.lessons, words: Object.keys(s.words).length,
        answers: s.stats.answers, correct: s.stats.correct, perfect: s.stats.perfect, purchases: s.stats.purchases,
        owned: s.owned.length, equip: s.equip, premium: api.isPremium() ? (s.premium.plan || 'year') : null,
        premiumUntil: api.isPremium() ? s.premium.until : null, dailyGoal: s.settings.dailyGoal,
        device: (navigator.userAgent.match(/\(([^)]+)\)/) || [, 'Устройство'])[1].split(';').slice(0, 2).join(';')
      };
    },
    syncPlayer() {
      try {
        const snap = api.playerSnapshot();
        const reg = JSON.parse(localStorage.getItem(PLAYERS_KEY) || '{}');
        reg[snap.id] = snap;
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(reg));
        if (window.BG_PLAYERS_API && window.fetch) fetch(window.BG_PLAYERS_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snap) }).catch(() => {});
      } catch (e) {}
    },
    /* Список живых игроков: с сервера (если настроен) или из локального реестра */
    fetchPlayers() {
      const local = () => { let reg = {}; try { reg = JSON.parse(localStorage.getItem(PLAYERS_KEY) || '{}'); } catch (e) {}
        reg[api.state.playerId] = api.playerSnapshot(); return Object.keys(reg).map(k => reg[k]); };
      if (window.BG_PLAYERS_API && window.fetch) {
        return fetch(window.BG_PLAYERS_API).then(r => r.json()).then(list => ({ source: 'server', players: list }))
          .catch(() => ({ source: 'local', players: local() }));
      }
      return Promise.resolve({ source: 'local', players: local() });
    },
    reset() {
      try { localStorage.removeItem(KEY); localStorage.removeItem(BACKUP_KEY); } catch (e) {}
      api.state = defaults();
      api.save();
    },
    isPremium() {
      const p = api.state.premium;
      return !!(p && p.until && p.until >= dayKey());
    },
    addXp(n) {
      const s = api.state, t = dayKey();
      s.xp += n;
      s.xpByDay[t] = (s.xpByDay[t] || 0) + n;
      if (s.week.key !== weekKey()) s.week = { key: weekKey(), xp: 0 };
      s.week.xp += n;
    },
    todayXp() { return api.state.xpByDay[dayKey()] || 0; },
    /* Проверка ударного режима при запуске. Возвращает 'frozen' | 'lost' | null */
    checkStreak() {
      const s = api.state;
      if (!s.lastActive || s.streak === 0) return null;
      const gap = diffDays(s.lastActive, dayKey());
      if (gap <= 1) return null;
      if (gap === 2 && s.freezes > 0) {
        s.freezes -= 1;
        s.lastActive = addDays(dayKey(), -1);
        api.save();
        return 'frozen';
      }
      s.streak = 0;
      api.save();
      return 'lost';
    },
    /* Обновление серии после урока. Возвращает true, если серия выросла сегодня */
    bumpStreak() {
      const s = api.state, t = dayKey();
      if (s.lastActive === t) return false;
      if (s.lastActive && diffDays(s.lastActive, t) === 1) s.streak += 1;
      else s.streak = 1;
      s.lastActive = t;
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      return true;
    }
  };
  return api;
})();
