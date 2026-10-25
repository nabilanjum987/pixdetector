/* PixDetector Timer Suite — one shared engine for the timer family:
   countdown-timer, timer-online, online-alarm-clock, stopwatch-online, pomodoro-timer.
   Every countdown is deadline-based (Date.now()), NOT tick-counting, so timers stay
   accurate when the tab is in the background — the #1 real complaint about online
   timers. Sound is generated with the Web Audio API (no audio files, no CDN). */
(function (global) {
  'use strict';

  var Suite = {};

  function $(id) { return document.getElementById(id); }
  function pad(n, w) { n = String(n); while (n.length < (w || 2)) n = '0' + n; return n; }

  /* "HH:MM:SS" or "MM:SS" from milliseconds */
  function fmtHMS(ms) {
    ms = Math.max(0, ms);
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? pad(h) + ':' + pad(m) + ':' + pad(sec) : pad(m) + ':' + pad(sec);
  }
  /* stopwatch display with hundredths: "MM:SS.cc" (or "HH:MM:SS.cc") */
  function fmtStopwatch(ms) {
    ms = Math.max(0, ms);
    var s = Math.floor(ms / 1000), cs = Math.floor((ms % 1000) / 10);
    var m = Math.floor(s / 60), sec = s % 60, h = Math.floor(m / 60);
    return (h > 0 ? pad(h) + ':' : '') + pad(m % 60) + ':' + pad(sec) + '.' + pad(cs);
  }
  /* split ms into { days, hms } for date countdowns */
  function splitDHMS(ms) {
    ms = Math.max(0, ms);
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60), sec = s % 60;
    return { days: d, hms: pad(h) + ':' + pad(m) + ':' + pad(sec) };
  }

  /* ---------------- sound (Web Audio, created on user gesture) ---------------- */
  var audioCtx = null;
  function ctx() {
    if (!audioCtx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') { audioCtx.resume(); }
    return audioCtx;
  }
  function beep(freq, dur, delay) {
    var ac = ctx();
    if (!ac) return;
    var t = ac.currentTime + (delay || 0);
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = freq || 880;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.5));
    o.connect(g);
    g.connect(ac.destination);
    o.start(t);
    o.stop(t + (dur || 0.5) + 0.05);
  }
  /* three short two-tone rings */
  var soundOn = true;
  function alarmSound(times) {
    if (!soundOn) return;
    var n = times || 3;
    for (var i = 0; i < n; i++) {
      beep(880, 0.4, i * 0.7);
      beep(1174, 0.4, i * 0.7 + 0.35);
    }
  }
  function testSound() { alarmSound(1); }

  /* ---------------- wake lock (best effort, browsers may refuse) ---------------- */
  var wakeLock = null;
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; }).catch(function () {});
    } catch (e) { /* ignore */ }
  }
  function releaseWakeLock() {
    if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
  }

  /* ---------------- tab title ---------------- */
  var baseTitle = document.title;
  function setTitle(t) { document.title = t ? t + ' - PixDetector' : baseTitle; }

  /* ---------------- toast (pages provide #toast) ---------------- */
  function toast(msg) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------------- fullscreen ---------------- */
  function toggleFullscreen(el) {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (el && el.requestFullscreen) { el.requestFullscreen(); }
  }

  /* ---------------- deadline countdown ---------------- */
  function Countdown(opts) {
    opts = opts || {};
    this.displayEl = opts.displayEl || null;
    this.onTick = opts.onTick || null;
    this.onDone = opts.onDone || null;
    this.tickMs = opts.tickMs || 200;
    this.endAt = 0;
    this.totalMs = 0;
    this.running = false;
    this.timer = null;
    this._bound = this._tick.bind(this);
  }
  Countdown.prototype._render = function (rem) {
    if (this.displayEl) { this.displayEl.textContent = fmtHMS(rem); }
    if (this.onTick) { this.onTick(rem, this.totalMs); }
  };
  Countdown.prototype._tick = function () {
    var rem = this.endAt - Date.now();
    if (rem <= 0) {
      this.stop();
      this._render(0);
      if (this.onDone) { this.onDone(); }
      return;
    }
    this._render(rem);
  };
  Countdown.prototype.start = function (ms) {
    this.totalMs = ms;
    this.endAt = Date.now() + ms;
    this.running = true;
    this._clear();
    this.timer = setInterval(this._bound, this.tickMs);
    this._tick();
    requestWakeLock();
  };
  Countdown.prototype.pause = function () {
    if (!this.running) return 0;
    var rem = Math.max(0, this.endAt - Date.now());
    this._clear();
    this.running = false;
    releaseWakeLock();
    return rem;
  };
  Countdown.prototype.resume = function (ms) { this.start(ms); };
  Countdown.prototype._clear = function () {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  };
  Countdown.prototype.stop = function () {
    this._clear();
    this.running = false;
    releaseWakeLock();
    setTitle(null);
  };
  Countdown.prototype.reset = function () {
    this.stop();
    this._render(this.totalMs);
  };

  /* ---------------- date countdown (to a calendar date/time) ---------------- */
  function DateCountdown(opts) {
    opts = opts || {};
    this.daysEl = opts.daysEl || null;
    this.timeEl = opts.timeEl || null;
    this.onDone = opts.onDone || null;
    this.target = null;
    this.running = false;
    this.timer = null;
    this._bound = this._tick.bind(this);
  }
  DateCountdown.prototype._tick = function () {
    if (!this.target) return;
    var rem = this.target.getTime() - Date.now();
    if (rem <= 0) {
      this.stop();
      if (this.daysEl) { this.daysEl.textContent = '0'; }
      if (this.timeEl) { this.timeEl.textContent = '00:00:00'; }
      if (this.onDone) { this.onDone(); }
      return;
    }
    var p = splitDHMS(rem);
    if (this.daysEl) { this.daysEl.textContent = String(p.days); }
    if (this.timeEl) { this.timeEl.textContent = p.hms; }
    setTitle(p.days + 'd ' + p.hms + ' left');
  };
  DateCountdown.prototype.start = function (date) {
    this.target = date;
    this.running = true;
    this._clear();
    this.timer = setInterval(this._bound, 250);
    this._tick();
    requestWakeLock();
  };
  DateCountdown.prototype._clear = function () {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  };
  DateCountdown.prototype.stop = function () {
    this._clear();
    this.running = false;
    releaseWakeLock();
    setTitle(null);
  };

  /* ---------------- stopwatch (count-up, hundredths) ---------------- */
  function Stopwatch(opts) {
    opts = opts || {};
    this.displayEl = opts.displayEl || null;
    this.onTick = opts.onTick || null;
    this.accum = 0;
    this.startAt = 0;
    this.running = false;
    this.timer = null;
    this.laps = [];
    this._bound = this._tick.bind(this);
  }
  Stopwatch.prototype.elapsed = function () {
    return this.accum + (this.running ? Date.now() - this.startAt : 0);
  };
  Stopwatch.prototype._tick = function () {
    var e = this.elapsed();
    if (this.displayEl) { this.displayEl.textContent = fmtStopwatch(e); }
    if (this.onTick) { this.onTick(e); }
  };
  Stopwatch.prototype.start = function () {
    if (this.running) return;
    this.startAt = Date.now();
    this.running = true;
    this.timer = setInterval(this._bound, 47);
    this._tick();
    requestWakeLock();
  };
  Stopwatch.prototype.pause = function () {
    if (!this.running) return;
    this.accum = this.elapsed();
    this.running = false;
    clearInterval(this.timer);
    this.timer = null;
    releaseWakeLock();
  };
  Stopwatch.prototype.lap = function () {
    var total = this.elapsed();
    var prev = this.laps.length ? this.laps[this.laps.length - 1].total : 0;
    var entry = { n: this.laps.length + 1, split: total - prev, total: total };
    this.laps.push(entry);
    return entry;
  };
  Stopwatch.prototype.reset = function () {
    this.pause();
    this.accum = 0;
    this.laps = [];
    if (this.displayEl) { this.displayEl.textContent = fmtStopwatch(0); }
    setTitle(null);
  };

  /* ---------------- alarm clock (clock-time alarms) ---------------- */
  function AlarmClock(opts) {
    opts = opts || {};
    this.onRing = opts.onRing || null;
    this.alarms = [];
    this.nextId = 1;
    this.ringing = null;
    this.ringTimer = null;
    this._bound = this._check.bind(this);
    this.checker = setInterval(this._bound, 500);
  }
  AlarmClock.prototype.add = function (minutesOfDay, label) {
    var a = { id: this.nextId++, minutes: minutesOfDay, label: label || '', enabled: true, lastFired: '' };
    this.alarms.push(a);
    return a;
  };
  AlarmClock.prototype.addIn = function (inMinutes, label) {
    var d = new Date(Date.now() + inMinutes * 60000);
    return this.add(d.getHours() * 60 + d.getMinutes(), label);
  };
  AlarmClock.prototype.remove = function (id) {
    this.alarms = this.alarms.filter(function (a) { return a.id !== id; });
  };
  AlarmClock.prototype._check = function () {
    if (this.ringing) return;
    var now = new Date();
    var cur = now.getHours() * 60 + now.getMinutes();
    var today = now.toDateString();
    for (var i = 0; i < this.alarms.length; i++) {
      var a = this.alarms[i];
      if (a.enabled && a.minutes === cur && a.lastFired !== today) {
        a.lastFired = today;
        this._ring(a);
        return;
      }
    }
  };
  AlarmClock.prototype._ring = function (alarm) {
    this.ringing = alarm;
    alarmSound(3);
    this.ringTimer = setInterval(function () { alarmSound(2); }, 4000);
    if (this.onRing) { this.onRing(alarm); }
  };
  AlarmClock.prototype.stopRinging = function () {
    if (this.ringTimer) { clearInterval(this.ringTimer); this.ringTimer = null; }
    this.ringing = null;
  };
  AlarmClock.prototype.snooze = function (minutes) {
    var a = this.ringing;
    this.stopRinging();
    if (a) { this.addIn(minutes || 5, (a.label ? a.label + ' ' : '') + '(snoozed)'); }
  };

  /* ---------------- pomodoro cycle ---------------- */
  function Pomodoro(opts) {
    opts = opts || {};
    this.displayEl = opts.displayEl || null;
    this.phaseEl = opts.phaseEl || null;
    this.onPhase = opts.onPhase || null;
    this.onTick = opts.onTick || null;
    this.focusMin = 25;
    this.shortMin = 5;
    this.longMin = 15;
    this.roundsBeforeLong = 4;
    this.autoStart = false;
    this.phase = 'focus';
    this.completed = 0;
    this.focusedMinutes = 0;
    this.running = false;
    this.cd = new Countdown({
      displayEl: this.displayEl,
      onTick: this._onTick.bind(this),
      onDone: this._onDone.bind(this)
    });
  }
  Pomodoro.prototype.phaseMinutes = function () {
    if (this.phase === 'focus') return this.focusMin;
    if (this.phase === 'short') return this.shortMin;
    return this.longMin;
  };
  Pomodoro.prototype.phaseName = function () {
    if (this.phase === 'focus') return 'Focus';
    if (this.phase === 'short') return 'Short break';
    return 'Long break';
  };
  Pomodoro.prototype._renderPhase = function () {
    if (this.phaseEl) { this.phaseEl.textContent = this.phaseName(); }
    if (this.onPhase) { this.onPhase(this.phase, this.completed); }
  };
  Pomodoro.prototype._onTick = function (rem, total) {
    setTitle(fmtHMS(rem) + ' - ' + this.phaseName());
    if (this.onTick) { this.onTick(rem, total); }
  };
  Pomodoro.prototype._onDone = function () {
    alarmSound(3);
    if (this.phase === 'focus') {
      this.completed++;
      this.focusedMinutes += this.focusMin;
      this.phase = (this.completed % this.roundsBeforeLong === 0) ? 'long' : 'short';
    } else {
      this.phase = 'focus';
    }
    this._renderPhase();
    this.cd.totalMs = this.phaseMinutes() * 60000;
    this.cd._render(this.cd.totalMs);
    this.running = false;
    if (this.autoStart) { this.start(); }
  };
  Pomodoro.prototype.start = function () {
    this.running = true;
    this.cd.start(this.phaseMinutes() * 60000);
    this._renderPhase();
  };
  Pomodoro.prototype.pause = function () {
    if (!this.running) return 0;
    this.running = false;
    return this.cd.pause();
  };
  Pomodoro.prototype.resume = function (ms) {
    this.running = true;
    this.cd.resume(ms);
  };
  Pomodoro.prototype.skip = function () {
    this.cd.stop();
    this._onDone();
  };
  Pomodoro.prototype.reset = function () {
    this.cd.stop();
    this.phase = 'focus';
    this.completed = 0;
    this.focusedMinutes = 0;
    this.running = false;
    this.cd.totalMs = this.focusMin * 60000;
    this.cd._render(this.cd.totalMs);
    this._renderPhase();
  };

  Suite.$ = $;
  Suite.pad = pad;
  Suite.fmtHMS = fmtHMS;
  Suite.fmtStopwatch = fmtStopwatch;
  Suite.splitDHMS = splitDHMS;
  Suite.beep = beep;
  Suite.alarmSound = alarmSound;
  Suite.setSoundOn = function (v) { soundOn = !!v; };
  Suite.testSound = testSound;
  Suite.toast = toast;
  Suite.setTitle = setTitle;
  Suite.toggleFullscreen = toggleFullscreen;
  Suite.requestWakeLock = requestWakeLock;
  Suite.Countdown = Countdown;
  Suite.DateCountdown = DateCountdown;
  Suite.Stopwatch = Stopwatch;
  Suite.AlarmClock = AlarmClock;
  Suite.Pomodoro = Pomodoro;

  global.TimerSuite = Suite;
})(window);
