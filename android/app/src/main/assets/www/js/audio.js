/* BuryatGo — звуковые эффекты, фоновая музыка (синтез Web Audio) и озвучка слов */
window.BG_AUDIO = (function () {
  'use strict';
  let ctx = null, master = null, sfxBus = null, musicBus = null;
  let musicOn = false, musicTimer = null, nextTime = 0, step = 0, drone = null, musicVol = 0.35, paused = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(master);
      musicBus = ctx.createGain(); musicBus.gain.value = musicVol * 0.5; musicBus.connect(master);
    }
    if (ctx.state === 'suspended' && !paused) ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, vol, dest, slideTo) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, start);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest || sfxBus);
    o.start(start); o.stop(start + dur + 0.05);
  }

  const sounds = {
    click(t) { tone(1500, t, 0.045, 'triangle', 0.12); },
    pop(t) { tone(520, t, 0.08, 'sine', 0.18, null, 980); },
    correct(t) { tone(784, t, 0.13, 'sine', 0.28); tone(1175, t + 0.09, 0.26, 'sine', 0.28); tone(1568, t + 0.09, 0.2, 'sine', 0.06); },
    wrong(t) { tone(320, t, 0.18, 'square', 0.07, null, 200); tone(220, t + 0.14, 0.26, 'square', 0.07, null, 130); },
    complete(t) { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.1, 0.32, 'triangle', 0.22)); },
    coin(t) { tone(1319, t, 0.07, 'square', 0.05); tone(1976, t + 0.07, 0.18, 'square', 0.05); },
    streak(t) { [392, 523, 659, 784].forEach((f, i) => tone(f, t + i * 0.08, 0.22, 'sawtooth', 0.05)); }
  };

  function play(name) {
    if (!ensure() || !sounds[name]) return;
    try { sounds[name](ctx.currentTime + 0.005); } catch (e) {}
  }

  /* Фоновая мелодия: пентатоника в стиле степных напевов */
  const N = { A3: 220, C4: 261.6, D4: 293.7, E4: 329.6, G4: 392, A4: 440, C5: 523.3, D5: 587.3, E5: 659.3, G5: 784 };
  const melody = ['E5', null, 'D5', 'E5', 'G5', null, 'E5', 'D5', 'C5', null, 'A4', 'C5', 'D5', null, null, null,
    'A4', null, 'C5', 'D5', 'E5', null, 'D5', 'C5', 'A4', null, 'G4', 'A4', 'A4', null, null, null];
  const bass = ['A3', null, null, null, 'A3', null, null, null, 'C4', null, null, null, 'D4', null, null, null];
  const STEP = 60 / 84 / 2;

  function scheduler() {
    if (!ctx || !musicOn) return;
    while (nextTime < ctx.currentTime + 0.35) {
      const m = melody[step % melody.length], b = bass[step % bass.length];
      if (m) tone(N[m], nextTime, STEP * 1.8, 'triangle', 0.16, musicBus);
      if (b) tone(N[b] / 2, nextTime, STEP * 3.6, 'sine', 0.2, musicBus);
      nextTime += STEP; step++;
    }
  }

  function startMusic() {
    if (!ensure()) return;
    if (musicTimer) return;
    nextTime = ctx.currentTime + 0.1;
    drone = ctx.createOscillator();
    const dg = ctx.createGain();
    drone.type = 'sine'; drone.frequency.value = 110; dg.gain.value = 0.05;
    drone.connect(dg); dg.connect(musicBus); drone.start();
    musicTimer = setInterval(scheduler, 90);
  }
  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (drone) { try { drone.stop(); } catch (e) {} drone = null; }
  }

  function setMusic(on) { musicOn = !!on; if (musicOn && !paused) startMusic(); else stopMusic(); }
  function setMusicVolume(v) { musicVol = v; if (musicBus) musicBus.gain.setTargetAtTime(v * 0.5, ctx.currentTime, 0.05); }
  function pauseAll() { paused = true; stopMusic(); if (ctx && ctx.state === 'running') ctx.suspend(); }
  function resumeAll() { paused = false; if (ctx) ctx.resume(); if (musicOn) startMusic(); }

  /* Озвучка: нативный TTS Android → Web Speech API. Записи носителей кладутся в www/audio/<id>.mp3 */
  function ttsText(t) {
    return String(t).replace(/Һ/g, 'Х').replace(/һ/g, 'х').replace(/Ү/g, 'У').replace(/ү/g, 'у').replace(/Ө/g, 'О').replace(/ө/g, 'о');
  }
  let recorded = null, playToken = 0;
  const missingAudio = {};
  /* Два голоса: «Женский» (Irina — по умолчанию) и «Мужской» (Pavel). На Android — подбор среди установленных голосов. */
  const FEMALE = /irina|ирина|milena|милена|svetlana|светлана|dariya|дария|anna|анна|female|женск/i;
  const MALE = /pavel|павел|yuri|юрий|dmitr|дмитр|maxim|максим|\bmale|мужск/i;
  let nativeGender = null;
  function gender(g) {
    if (g !== 'male' && g !== 'female') { try { g = window.BG_STORE.state.settings.voice; } catch (e) { g = 'female'; } }
    return g === 'male' ? 'male' : 'female';
  }
  function pickVoice(g) {
    const ru = speechSynthesis.getVoices().filter(x => /ru/i.test(x.lang));
    if (!ru.length) return { v: null, pitch: g === 'male' ? 0.75 : 1 };
    if (g === 'male') {
      const m = ru.find(v => MALE.test(v.name) && !/female/i.test(v.name));
      return m ? { v: m, pitch: 1 } : { v: ru.find(v => !FEMALE.test(v.name)) || ru[0], pitch: 0.75 };
    }
    return { v: ru.find(v => FEMALE.test(v.name)) || ru.find(v => !MALE.test(v.name)) || ru[0], pitch: 1 };
  }
  function setVoice(g) {
    g = gender(g); nativeGender = null;
    try { if (window.AndroidBridge && window.AndroidBridge.setVoiceGender) { window.AndroidBridge.setVoiceGender(g); nativeGender = g; } } catch (e) {}
  }
  function listVoices() {
    return Promise.resolve([{ id: 'female', label: 'Женский голос' }, { id: 'male', label: 'Мужской голос' }]);
  }
  function speak(text, rate, audioFile, voice) {
    rate = rate || 0.85;
    const g = gender(voice);
    let list = audioFile ? (Array.isArray(audioFile) ? audioFile : [audioFile]) : [];
    list = list.filter(f => f && !missingAudio[f]);
    if (list.length) {
      const token = ++playToken;
      const tryAt = i => {
        if (token !== playToken) return;
        if (i >= list.length) { synth(text, rate, g); return; }
        const f = list[i];
        let done = false;
        const next = () => { if (done) return; done = true; missingAudio[f] = true; tryAt(i + 1); };
        try {
          if (recorded) { recorded.onerror = null; recorded.pause(); }
          const el = new Audio(f);
          recorded = el;
          el.playbackRate = rate < 0.7 ? 0.75 : 1;
          el.onerror = next;
          const pr = el.play();
          if (pr && pr.catch) pr.catch(err => { if (err && err.name === 'NotAllowedError') { done = true; return; } next(); });
        } catch (e) { next(); }
      };
      tryAt(0);
      return;
    }
    synth(text, rate, g);
  }
  function synth(text, rate, g) {
    const t = ttsText(text);
    try {
      const b = window.AndroidBridge;
      if (b && b.speak) {
        if (b.setVoiceGender && nativeGender !== g) { b.setVoiceGender(g); nativeGender = g; }
        b.speak(t, rate); return;
      }
    } catch (e) {}
    if ('speechSynthesis' in window) {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'ru-RU'; u.rate = rate;
        const p = pickVoice(g);
        if (p.v) u.voice = p.v;
        u.pitch = p.pitch;
        speechSynthesis.speak(u);
      } catch (e) {}
    }
  }

  return { play, unlock: ensure, setMusic, setMusicVolume, pauseAll, resumeAll, speak, setVoice, listVoices, ttsText };
})();
