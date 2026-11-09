/* BuryatGo — аккаунты (логин + пароль) и сохранение прогресса в облаке.
   Сервер: Firebase (Authentication + Cloud Firestore), запросы через REST — без SDK и сторонних библиотек.
   Ключи проекта задаются в js/cloud-config.js. Если ключей нет, игра работает только с локальным сохранением. */
window.BG_CLOUD = (function () {
  const CFG = window.BG_CLOUD_CONFIG || {};
  const SKEY = 'buryatgo_cloud_session_v1';
  const DOMAIN = '@buryatgo.app';
  const Store = () => window.BG_STORE;
  let timer = null, busy = false, again = false;
  const listeners = [];

  const configured = () => !!(CFG.apiKey && CFG.projectId);
  const readSess = () => { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { return null; } };
  let sess = readSess();
  /* Снимок до запуска игры: app.js сохраняет состояние при старте, это не должно перебивать свежий прогресс из облака */
  /* Отпечаток содержимого прогресса (без времени сохранения): понять, что реально изменилось */
  function sig(st) {
    let json = '';
    try { const c = Object.assign({}, st); delete c._savedAt; json = JSON.stringify(c); } catch (e) {}
    let h = 5381;
    for (let i = 0; i < json.length; i++) h = ((h * 33) ^ json.charCodeAt(i)) >>> 0;
    return h.toString(36) + '.' + json.length;
  }
  const bootAt = (window.BG_STORE && window.BG_STORE.state && window.BG_STORE.state._savedAt) || 0;
  const bootSig = window.BG_STORE ? sig(window.BG_STORE.state) : '';
  function writeSess(s) {
    sess = s;
    try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch (e) {}
  }
  function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

  const normLogin = l => String(l || '').trim().toLowerCase();
  const validLogin = l => /^[a-z0-9_.-]{3,20}$/.test(l);

  const ERR = {
    EMAIL_EXISTS: 'Такой логин уже занят — придумайте другой',
    EMAIL_NOT_FOUND: 'Неверный логин или пароль',
    INVALID_PASSWORD: 'Неверный логин или пароль',
    INVALID_LOGIN_CREDENTIALS: 'Неверный логин или пароль',
    USER_DISABLED: 'Аккаунт заблокирован',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'Слишком много попыток. Попробуйте через несколько минут',
    WEAK_PASSWORD: 'Пароль — минимум 6 символов',
    BAD_LOGIN: 'Логин: латинские буквы, цифры, точка, _ или -, от 3 до 20 символов',
    INVALID_EMAIL: 'Логин: латинские буквы, цифры, точка, _ или -, от 3 до 20 символов',
    OPERATION_NOT_ALLOWED: 'Вход по паролю не включён на сервере (Firebase → Authentication)',
    PERMISSION_DENIED: 'Сервер отклонил сохранение — проверьте правила Firestore',
    NOT_CONFIGURED: 'Облако ещё не подключено (js/cloud-config.js)',
    NO_SESSION: 'Войдите в аккаунт',
    TOKEN_EXPIRED: 'Сессия устарела — войдите снова',
    USER_NOT_FOUND: 'Аккаунт не найден — войдите снова',
    INVALID_REFRESH_TOKEN: 'Сессия устарела — войдите снова'
  };
  function fail(code) {
    const k = String(code || '').split(' ')[0].split(':')[0].trim();
    const e = new Error(ERR[k] || 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз');
    e.code = k || 'NETWORK';
    return e;
  }

  async function request(url, opts) {
    let r;
    try { r = await fetch(url, opts); } catch (e) { throw fail('NETWORK'); }
    const j = await r.json().catch(() => ({}));
    return { r, j };
  }
  const errCode = j => (j && j.error && (j.error.message || j.error.status)) || '';
  const idt = p => 'https://identitytoolkit.googleapis.com/v1/accounts:' + p + '?key=' + encodeURIComponent(CFG.apiKey);

  function fromAuth(j, login) {
    const secs = parseInt(j.expiresIn || j.expires_in, 10) || 3600;
    return {
      login,
      uid: j.localId || j.user_id,
      idToken: j.idToken || j.id_token,
      refreshToken: j.refreshToken || j.refresh_token,
      exp: Date.now() + secs * 1000 - 60000,
      syncedAt: sess && sess.login === login ? sess.syncedAt || 0 : 0
    };
  }

  async function token() {
    if (!configured()) throw fail('NOT_CONFIGURED');
    if (!sess) throw fail('NO_SESSION');
    if (sess.idToken && sess.exp > Date.now()) return sess.idToken;
    const { r, j } = await request('https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(CFG.apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(sess.refreshToken)
    });
    if (!r.ok) {
      if (r.status === 400) { writeSess(null); emit(); }
      throw fail(errCode(j));
    }
    writeSess(fromAuth(j, sess.login));
    return sess.idToken;
  }

  const docUrl = () => 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(CFG.projectId) +
    '/databases/(default)/documents/users/' + encodeURIComponent(sess.uid);

  /* Загрузка сохранения из облака: { state, updatedAt } или null, если сохранения ещё нет */
  async function pull() {
    const t = await token();
    const { r, j } = await request(docUrl(), { headers: { Authorization: 'Bearer ' + t } });
    if (r.status === 404) return null;
    if (!r.ok) throw fail(errCode(j));
    const f = j.fields || {};
    try {
      return { state: JSON.parse(f.data.stringValue), updatedAt: parseInt((f.updatedAt || {}).integerValue, 10) || 0 };
    } catch (e) { return null; }
  }

  /* Отправка текущего прогресса в облако */
  async function push(keepalive) {
    if (!configured() || !sess) return false;
    if (busy) { again = true; return false; }
    busy = true;
    clearTimeout(timer); timer = null;
    try {
      const t = await token();
      const st = Store().state;
      const data = JSON.stringify(st), sentSig = sig(st);
      const body = JSON.stringify({ fields: {
        data: { stringValue: data },
        updatedAt: { integerValue: String(st._savedAt || Date.now()) },
        login: { stringValue: sess.login },
        name: { stringValue: String(st.name || '') }
      } });
      const mask = ['data', 'updatedAt', 'login', 'name'].map(f => 'updateMask.fieldPaths=' + f).join('&');
      const { r, j } = await request(docUrl() + '?' + mask, {
        method: 'PATCH',
        keepalive: !!keepalive && body.length < 60000,
        headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
        body
      });
      if (!r.ok) throw fail(errCode(j));
      if (sess) { sess.syncedAt = Date.now(); sess.hash = sentSig; sess.dirty = sig(Store().state) !== sentSig; writeSess(sess); }
      emit();
      return true;
    } finally {
      busy = false;
      if (again) { again = false; schedule(); }
    }
  }

  /* Вызывается при каждом сохранении: отправка в облако с небольшой задержкой */
  function schedule() {
    if (!configured() || !sess) return;
    if (sess.hash && sig(Store().state) === sess.hash) {
      if (sess.dirty && !timer) { sess.dirty = false; writeSess(sess); }
      return;
    }
    if (!sess.dirty) { sess.dirty = true; writeSess(sess); }
    clearTimeout(timer);
    timer = setTimeout(() => { push().catch(() => {}); }, 2500);
  }

  /* Подмена прогресса на устройстве сохранением из облака */
  function applyRemote(state) {
    const S = Store();
    if (sess) { sess.hash = sig(state); sess.dirty = false; writeSess(sess); }
    S.state = state;
    S.save();
  }

  async function signUp(login, password) {
    if (!configured()) throw fail('NOT_CONFIGURED');
    login = normLogin(login);
    if (!validLogin(login)) throw fail('BAD_LOGIN');
    if (String(password || '').length < 6) throw fail('WEAK_PASSWORD');
    const { r, j } = await request(idt('signUp'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login + DOMAIN, password, returnSecureToken: true })
    });
    if (!r.ok) throw fail(errCode(j));
    writeSess(fromAuth(j, login));
    await push();
    emit();
    return { login };
  }

  /* Вход. Если в облаке есть прогресс — он загружается на устройство (restored: true) */
  async function signIn(login, password) {
    if (!configured()) throw fail('NOT_CONFIGURED');
    login = normLogin(login);
    if (!validLogin(login)) throw fail('BAD_LOGIN');
    if (!password) throw fail('INVALID_PASSWORD');
    const { r, j } = await request(idt('signInWithPassword'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login + DOMAIN, password, returnSecureToken: true })
    });
    if (!r.ok) throw fail(errCode(j));
    writeSess(fromAuth(j, login));
    let remote = null;
    try { remote = await pull(); } catch (e) { writeSess(null); emit(); throw e; }
    if (remote && remote.state) {
      applyRemote(remote.state);
      sess.syncedAt = Date.now(); writeSess(sess);
      emit();
      return { login, restored: true };
    }
    await push();
    emit();
    return { login, restored: false };
  }

  /* Выход: последний прогресс отправляется в облако, на устройстве данные удаляются */
  async function signOut() {
    if (sess) { try { await push(); } catch (e) {} }
    writeSess(null);
    clearTimeout(timer); timer = null;
    emit();
  }

  /* При запуске: подтянуть более свежий прогресс (например, с другого телефона) или отправить свой */
  async function startupSync() {
    if (!configured() || !sess || navigator.onLine === false) return;
    try {
      const remote = await pull();
      if (!remote || !remote.state) { await push(); return; }
      const rs = sig(remote.state);
      if (rs === sig(Store().state)) {
        sess.hash = rs; sess.dirty = false; sess.syncedAt = Date.now(); writeSess(sess); emit();
        return;
      }
      const localChanged = !sess.hash || bootSig !== sess.hash;
      const remoteChanged = rs !== sess.hash;
      /* В облаке новее (играли на другом устройстве) — загружаем. Если меняли и там, и тут — побеждает более свежее */
      if (remoteChanged && (!localChanged || remote.updatedAt > bootAt)) {
        let reloaded = false;
        try { reloaded = sessionStorage.getItem('bg_cloud_reload') === rs; } catch (e) {}
        if (!reloaded) {
          try { sessionStorage.setItem('bg_cloud_reload', rs); } catch (e) {}
          applyRemote(remote.state);
          sess.syncedAt = Date.now(); writeSess(sess);
          location.reload();
          return;
        }
      }
      await push();
    } catch (e) { /* нет сети — синхронизируемся позже */ }
  }

  window.addEventListener('online', () => { if (sess && sess.dirty) push().catch(() => {}); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && sess && (timer || sess.dirty)) push(true).catch(() => {});
  });
  window.addEventListener('pagehide', () => { if (sess && timer) push(true).catch(() => {}); });
  window.addEventListener('load', () => setTimeout(startupSync, 400));

  return {
    configured,
    user: () => (sess ? sess.login : null),
    syncedAt: () => (sess ? sess.syncedAt || 0 : 0),
    pending: () => !!(sess && (sess.dirty || timer)),
    signUp, signIn, signOut, push, pull, schedule, startupSync,
    onChange(fn) { listeners.push(fn); }
  };
})();
