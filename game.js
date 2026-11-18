/* Kraken: game rules (host), client view and UI. Host is fully authoritative; everyone else renders its state. */
(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const now = () => Date.now();
const pnow = () => performance.now();
const rid = NET.rid;
const mk = (kind) => ({
  get(k, d) { try { const v = window[kind].getItem('kr.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { window[kind].setItem('kr.' + k, JSON.stringify(v)); } catch {} },
  del(k) { try { window[kind].removeItem('kr.' + k); } catch {} },
});
const LS = mk('localStorage'), SS = mk('sessionStorage');

const BANK = BANK_SRC.map(parseQuestion);
const QMAP = Object.fromEntries(BANK.map(q => [q.id, q]));
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const MAXP = 8, GRACE = 30000, OFF_AFTER = 7000, PING_MS = 2500, HOST_SILENT = 9000, GIVEUP = 45000;
const INTRO = 2200, STRIKES = 3, MAXSUBS = 24;
const SECS = [0, 30, 60], ROUNDS = [5, 7, 10];
const M = (pts) => (pts * 10).toLocaleString('en-GB') + ' m';
const secLbl = (n) => (n ? n + 's' : 'Off');
const EMOS = ['🔥', '😂', '😱', '🐙'];
const TCLS = { c: 't0', h: 't1', o: 't2', r: 't3', f: 't4', x: 't5' };
const CATINFO = {
  geo: ['Geography', 'Countries, capitals, cities'], food: ['Food & drink', 'Pasta, cheese, cocktails'],
  screen: ['Film & TV', 'Oscars, Bond, Ghibli'], music: ['Music', 'Beatles, MJ, Eurovision'],
  sport: ['Sport', 'Football, F1, tennis'], games: ['Gaming', 'Pokémon, Zelda, Minecraft'],
  sci: ['Science & nature', 'Elements, bones, dinosaurs'], words: ['Words & culture', 'Fonts, gods, board games'],
  sea: ['High seas', 'Pirates, seas, sea creatures'],
};
const THEMES = [{ id: 'light', bg: '#ffffff', n: 'Foam' }, { id: 'grey', bg: '#e4e4e4', n: 'Fog' }, { id: 'deep', bg: '#0f2230', n: 'Deep sea' }, { id: 'abyss', bg: '#07090c', n: 'Abyss' }];

/* ───────── me ───────── */
const ME = { id: SS.get('id', null) || rid(10), name: LS.get('name', ''), av: LS.get('av', null) };
const NAMES = ['riptide', 'barnacle', 'undertow', 'saltbeard', 'inkblot', 'fathom', 'bilgerat', 'cutlass', 'harpoon', 'maelstrom', 'sharkbait', 'seadog', 'doubloon', 'urchin', 'nautilus', 'briny', 'marlin', 'shipwreck', 'limpet', 'squall', 'grog', 'kraklet', 'tidepool', 'driftwood', 'plunder', 'anchor', 'swabbie', 'mudskipper', 'angler', 'cuttlefish', 'bluefin', 'stingray', 'coralbite', 'lagoon', 'starboard', 'jellyjam', 'blowhole', 'flotsam', 'jetsam', 'gullet', 'squidge', 'tentacle', 'wreckdiver', 'saltwater', 'deepjaw'];
const randName = () => NAMES[Math.floor(Math.random() * NAMES.length)];
const randAv = () => ART.AV_IDS[Math.floor(Math.random() * ART.AV_IDS.length)];
if (!ART.AV_IDS.includes(ME.av)) { ME.av = randAv(); LS.set('av', ME.av); }
if (!ME.name) { ME.name = randName(); LS.set('name', ME.name); }
SS.set('id', ME.id);
const SID = rid(8);
let QSEQ = 0;
const cleanName = (s) => String(s || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 14) || 'Player';

/* ───────── client state ───────── */
const C = { role: null, code: null, hub: null, link: null, view: null, lastStateAt: 0, deadline: 0, introUntil: 0, timeKey: '',
  joined: false, joinDeadline: 0, recovering: 0, myLock: null, mySubs: [], fb: null, revealAt: 0, revealKey: '', finalSig: '', emoSeen: {}, lastTickSec: -1 };
let H = null;

/* ───────── sound ───────── */
const SFX = (() => {
  let ac = null, on = LS.get('snd', true);
  const ctx = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } if (ac && ac.state === 'suspended') ac.resume(); return ac; };
  function tone(f, d = 0.12, type = 'square', vol = 0.05, when = 0, slide = 0) {
    if (!on) return; const a = ctx(); if (!a) return;
    const t = a.currentTime + when, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + 0.02);
  }
  function roar() {
    if (!on) return; const a = ctx(); if (!a) return;
    const t = a.currentTime, len = 1.2, buf = a.createBuffer(1, Math.floor(a.sampleRate * len), a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = a.createBufferSource(); src.buffer = buf;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(1500, t); lp.frequency.exponentialRampToValueAtTime(110, t + len);
    const g = a.createGain(); g.gain.setValueAtTime(0.34, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    src.connect(lp).connect(g).connect(a.destination); src.start(t);
    tone(55, 1, 'sine', 0.3); tone(90, 0.8, 'sawtooth', 0.05, 0, 0.45);
  }
  return {
    unlock: () => ctx(),
    tick: () => tone(880, 0.05, 'square', 0.035), lock: () => { tone(520, 0.07, 'square', 0.05); tone(780, 0.1, 'square', 0.05, 0.07); },
    bad: () => tone(170, 0.2, 'sawtooth', 0.06, 0, 0.6), dup: () => tone(300, 0.14, 'triangle', 0.07, 0, 0.8),
    plink: (i) => tone([1040, 900, 760, 560, 380, 220][i] || 500, 0.18, 'triangle', 0.09, 0, 0.7),
    start: () => { tone(392, 0.1, 'square', 0.05); tone(523, 0.1, 'square', 0.05, 0.1); tone(659, 0.18, 'square', 0.05, 0.2); },
    sunk: () => { tone(330, 0.3, 'sawtooth', 0.06, 0, 0.3); tone(220, 0.4, 'sawtooth', 0.05, 0.2, 0.4); },
    win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.2, 'square', 0.05, i * 0.12)),
    bubble: () => tone(380 + Math.random() * 380, 0.09, 'sine', 0.06, 0, 1.9),
    roar, on: () => on, set: (v) => { on = v; LS.set('snd', v); },
  };
})();
/* no sound in this game: every effect is a no-op */
for (const k of Object.keys(SFX)) SFX[k] = () => {};
SFX.on = () => false;
(() => {
})();
const vib = (p) => { try { if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return; navigator.vibrate && navigator.vibrate(p); } catch {} };
let wake = null;
async function wakeLock(onoff) {
  try {
    if (onoff && !wake && navigator.wakeLock) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => (wake = null)); }
    if (!onoff && wake) { await wake.release(); wake = null; }
  } catch {}
}

/* ───────── helpers ───────── */
let toastT = 0;
function toast(msg, kind = '') { const t = $('toast'); t.textContent = msg; t.className = 'toast ' + kind; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 3200); }
function busy(msg) { $('busyM').hidden = !msg; if (msg) $('busyT').textContent = msg; }
function scr(name) { document.body.dataset.scr = name; }
const avatar = (id, cls = '') => `<span class="av ${cls}">${ART.avatar(id)}</span>`;
const tierPill = (t) => `<span class="tp ${TCLS[t]}">${esc(TIERS[t].name)}</span>`;
function splitPrompt(p) { const m = p.match(/^Name (an?|the) (.*)$/i); return m ? ['Name ' + m[1].toLowerCase() + '…', m[2]] : ['', p]; }
function makeCode() { let s = ''; for (let i = 0; i < 4; i++) s += ALPHA[Math.floor(Math.random() * ALPHA.length)]; return s; }
function shuffled(a, seed) { const R = rng(seed); a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function needName() {
  let v = $('nm').value.trim();
  if (!v) { v = ME.name && ME.name !== 'Player' ? ME.name : randName(); $('nm').value = v; }
  ME.name = cleanName(v); LS.set('name', ME.name); return true;
}
function meIn(v = C.view) { return v ? v.pl.find(p => p.id === ME.id) : null; }
function pinfo(id, v = C.view) { return (v && v.pl.find(p => p.id === id)) || { id, nm: 'Player', av: 'pirate', pts: 0 }; }

/* ═════════════════ HOST ═════════════════ */
function newHost(code, solo) {
  return { code, solo, hub: null, loop: 0, players: [], set: { mode: 'vs', rounds: 7, secs: 0, topics: [] }, phase: 'lobby', round: 0, qs: [], seed: '',
    endsAt: 0, introEnd: 0, revealEnds: 0, answers: {}, res: null, hist: [], crew: null, lastQ: {}, banned: new Set(),
    tot: LS.get('tot', {}), recent: LS.get('recent', []), dirty: true, lastCast: 0, lastSeenCheck: 0 };
}
function hostHandle(m) {
  if (!H || !m || typeof m.from !== 'string' || m.from.length > 24) return;
  const t = now();
  if (m.sid && typeof m.q === 'number') { if ((H.lastQ[m.sid] ?? -1) >= m.q) return; H.lastQ[m.sid] = m.q; }
  if (H.banned.has(m.from)) { direct(m.from, { t: 'err', msg: 'The host removed you from this lobby.' }); return; }
  let p = H.players.find(x => x.id === m.from);
  if (m.t === 'join') {
    const name = cleanName(m.name), av = ART.AV_IDS.includes(m.av) ? m.av : 'pirate';
    if (!p) {
      if (H.players.filter(x => !x.gone).length >= MAXP) { direct(m.from, { t: 'err', msg: 'That lobby is full. Eight is the most.' }); return; }
      p = { id: m.from, name, av, pts: 0, seen: t, spec: H.phase !== 'lobby' ? 1 : 0, gone: 0 };
      H.players.push(p);
    } else { p.name = name; p.av = av; p.gone = 0; }
    p.seen = t; p.sid = m.sid; H.dirty = true; return;
  }
  if (!p) { if (m.t !== 'bye') direct(m.from, { t: 'rejoin' }); return; }
  p.seen = t;
  switch (m.t) {
    case 'ping': if (p.gone) { p.gone = 0; H.dirty = true; } break;
    case 'bye':
      if (m.sid && p.sid && m.sid !== p.sid) break;
      if (H.phase === 'lobby') H.players = H.players.filter(x => x !== p); else p.gone = 1;
      H.dirty = true; break;
    case 'ans': hostAnswer(p, m.text); break;
    case 'sub': hostCrewSub(p, m.text); break;
    case 'call': if (H.crew && H.phase === 'play') { H.crew.calls[p.id] = Number.isInteger(m.slot) ? m.slot : null; H.dirty = true; } break;
    case 'draft': if (H.crew && H.phase === 'play') { H.crew.drafts[p.id] = String(m.text || '').slice(0, 24); H.dirty = true; } break;
    case 'ty': p.ty = m.on ? t : 0; H.dirty = true; break;
    case 'emo': if (EMOS.includes(m.e)) { p.emo = [m.e, t]; H.dirty = true; } break;
  }
}
const curQH = () => QMAP[H.qs[H.round]];
function hostAnswer(p, text) {
  if (H.phase !== 'play' || H.set.mode !== 'vs' || p.spec) return;
  if (H.answers[p.id]) { direct(p.id, { t: 'fb', kind: 'locked', aid: H.answers[p.id].aid, r: H.round }); return; }
  if (now() < H.introEnd - 300) return;
  const r = matchAnswer(curQH(), String(text || '').slice(0, 80));
  if (!r.ok) { direct(p.id, { t: 'fb', kind: r.kind, msg: r.msg, text: String(text || '').slice(0, 40), r: H.round }); return; }
  H.answers[p.id] = { aid: r.id }; p.ty = 0; H.dirty = true;
  direct(p.id, { t: 'fb', kind: 'locked', aid: r.id, r: H.round });
}
function hostCrewSub(p, text) {
  if (H.phase !== 'play' || H.set.mode !== 'crew' || p.spec) return;
  if (now() < H.introEnd - 300) return;
  const r = matchAnswer(curQH(), String(text || '').slice(0, 80));
  if (!r.ok) { direct(p.id, { t: 'fb', kind: r.kind, msg: r.msg, text: String(text || '').slice(0, 40), r: H.round }); return; }
  const cr = H.crew;
  let kind;
  if (cr.used.includes(r.id)) kind = 'dup';
  else {
    cr.used.push(r.id);
    if (r.tier === 'x') { cr.gem = 1; cr.lives = Math.min(5, cr.lives + 1); kind = 'gem'; }
    else {
      const si = cr.ord.findIndex((t, i) => t === r.tier && !cr.sl[i]);
      if (si >= 0) { cr.sl[si] = [r.id, p.id]; kind = 'fill'; for (const k in cr.calls) if (cr.calls[k] === si) delete cr.calls[k]; }
      else { cr.miss++; kind = 'miss'; }
    }
  }
  cr.log.push([p.id, r.id, kind]); if (cr.log.length > 10) cr.log.shift();
  cr.drafts[p.id] = '';
  direct(p.id, { t: 'fb', kind: 'crew', res: kind, aid: r.id, r: H.round });
  H.dirty = true;
  if (cr.sl.every(Boolean)) crewResolve(true);
  else if (cr.miss >= STRIKES) crewResolve(false);
}
function activePlayers() { return H.players.filter(p => !p.spec && !p.gone); }
function startGame() {
  for (const p of H.players) { p.spec = p.gone ? p.spec : 0; p.pts = 0; }
  H.players = H.players.filter(p => !p.gone);
  H.seed = rid(6);
  const mode = H.set.mode === 'crew' ? 'coop' : 'vs';
  H.qs = pickQuestions(BANK, H.set.topics, H.set.rounds, mode, H.recent, H.seed);
  H.recent = [...H.qs, ...H.recent].slice(0, 40); LS.set('recent', H.recent);
  H.round = 0; H.hist = [];
  H.crew = H.set.mode === 'crew' ? { lives: 3, stars: 0, cl: 0, misses: 0 } : null;
  setupRound(); broadcast();
}
function setupRound() {
  H.phase = 'play'; H.answers = {}; H.res = null;
  const t = now(); H.introEnd = t + INTRO;
  for (const p of H.players) p.ty = 0;
  if (H.set.mode === 'crew') {
    const q = curQH(); const n = activePlayers().length;
    const ord = makeOrder(q, H.round, n, H.seed);
    Object.assign(H.crew, { ord, sl: ord.map(() => 0), used: [], log: [], pen: 0, miss: 0, out: '', rs: 0, gem: 0, calls: {}, drafts: {} });
    H.endsAt = Infinity;
  } else H.endsAt = H.set.secs ? t + INTRO + H.set.secs * 1000 + 800 : Infinity;
  H.dirty = true;
}
function resolveVs() {
  const q = curQH(); const act = H.players.filter(p => !p.spec);
  const cnt = {};
  for (const id in H.answers) { const a = H.answers[id].aid; cnt[a] = (cnt[a] || 0) + 1; }
  const multi = act.length > 1, mult = multi && H.round === H.qs.length - 1 ? 2 : 1;
  H.res = act.map(p => {
    const a = H.answers[p.id];
    if (!a) return [p.id, -1, 0, 0];
    const sunk = multi && cnt[a.aid] > 1 ? 1 : 0;
    const pts = sunk ? 0 : TIERS[q.answers[a.aid].tier].pts * mult;
    p.pts += pts;
    return [p.id, a.aid, pts, sunk];
  });
  H.hist.push({ q: q.id, res: H.res });
  H.phase = 'reveal'; H.revealEnds = Infinity; H.dirty = true;
}
function crewResolve(full) {
  const cr = H.crew;
  if (full) { cr.out = 'clear'; cr.rs = cr.miss === 0 ? 3 : cr.miss <= 2 ? 2 : 1; cr.stars += cr.rs; cr.cl++; }
  else { cr.out = 'fail'; cr.rs = 0; cr.lives = Math.max(0, cr.lives - 1); }
  cr.misses += cr.miss;
  H.hist.push({ q: curQH().id, out: cr.out, rs: cr.rs, gem: cr.gem, sl: cr.sl, ord: cr.ord });
  H.phase = 'reveal'; H.revealEnds = Infinity; H.dirty = true;
}
function forceReveal() {
  if (!H || H.phase !== 'play') return;
  if (H.set.mode === 'crew') crewResolve(false); else resolveVs();
  broadcast();
}
function nextRound() {
  if (!H || H.phase !== 'reveal') return;
  const last = H.round >= H.qs.length - 1 || (H.set.mode === 'crew' && H.crew.lives <= 0);
  if (last) { finishGame(); return; }
  H.round++; setupRound(); broadcast();
}
function finishGame() {
  H.phase = 'final';
  if (H.set.mode === 'vs' && !H.solo) {
    for (const p of H.players) if (!p.spec) { const k = p.name.toLowerCase(); H.tot[k] = (H.tot[k] || 0) + p.pts; }
    LS.set('tot', H.tot);
  }
  H.dirty = true; broadcast();
}
function backToLobby() {
  H.phase = 'lobby'; H.players = H.players.filter(p => !p.gone);
  for (const p of H.players) { p.pts = 0; p.spec = 0; }
  H.crew = null; H.res = null; H.hist = []; H.dirty = true; broadcast();
}
function hostTick() {
  if (!H) return;
  const t = now();
  if (t - H.lastSeenCheck > 2500) {
    H.lastSeenCheck = t;
    for (const p of H.players.slice()) {
      if (p.id === ME.id || p.gone) continue;
      if (t - p.seen > GRACE) { if (H.phase === 'lobby') H.players = H.players.filter(x => x !== p); else p.gone = 1; H.dirty = true; }
    }
  }
  if (H.phase === 'play') {
    if (H.set.mode === 'vs') {
      const act = activePlayers().filter(p => p.id === ME.id || t - p.seen < OFF_AFTER);
      const all = act.length > 0 && act.every(p => H.answers[p.id]);
      if (t >= H.endsAt || (all && t >= H.introEnd)) resolveVs();
    } else if (t >= H.endsAt - H.crew.pen) crewResolve(false);
  } else if (H.phase === 'reveal' && t >= H.revealEnds) nextRound();
  if ((H.dirty && t - H.lastCast > 110) || t - H.lastCast > 2000) broadcast();
}
function view() {
  const t = now(), cr = H.crew;
  return {
    code: H.code, ph: H.phase, host: ME.id, solo: H.solo ? 1 : 0, set: H.set, r: H.round, n: H.qs.length, q: H.qs[H.round] || null,
    pl: H.players.map(p => ({ id: p.id, nm: p.name, av: p.av, pts: p.pts, tot: H.tot[p.name.toLowerCase()] || 0,
      off: p.id !== ME.id && t - p.seen > OFF_AFTER ? 1 : 0, gone: p.gone ? 1 : 0, spec: p.spec ? 1 : 0,
      lk: H.phase === 'play' && H.answers[p.id] ? 1 : 0, ty: p.ty && t - p.ty < 2600 ? 1 : 0, emo: p.emo && t - p.emo[1] < 5000 ? p.emo : null })),
    rem: H.phase === 'play' && isFinite(H.endsAt) ? Math.max(0, H.endsAt - t) : -1,
    intro: H.phase === 'play' ? Math.max(0, H.introEnd - t) : 0,
    dur: H.phase === 'play' && isFinite(H.endsAt) ? H.endsAt - H.introEnd : 0,
    res: (H.phase === 'reveal' || H.phase === 'final') && H.set.mode === 'vs' ? H.res : null,
    hist: H.phase === 'final' || H.phase === 'reveal' ? H.hist : null,
    cr: H.set.mode === 'crew' && cr && H.phase !== 'lobby' ? cr : null,
  };
}
function broadcast() {
  if (!H) return;
  const v = view();
  H.lastCast = now(); H.dirty = false;
  if (H.hub) H.hub.pub(NET.NS + H.code + '/s', { t: 'state', v }, 0);
  onState(JSON.parse(JSON.stringify(v)));
}
function direct(id, msg) {
  if (id === ME.id) { onDirect(msg); return; }
  if (H && H.hub) H.hub.pub(NET.NS + H.code + '/p/' + id, msg, 1);
}
function startHostLoop() { clearInterval(H.loop); H.loop = setInterval(hostTick, 200); }

/* ───────── host: create / practice ───────── */
function createLobby() {
  if (!needName()) return;
  teardown();
  const code = makeCode();
  H = newHost(code, false);
  C.role = 'host'; C.code = code;
  busy('Opening lobby…');
  let opened = false;
  H.hub = new NET.Hub([NET.NS + code + '/h'], (topic, m) => hostHandle(m));
  H.hub.onUp = () => {
    if (opened || !H) return; opened = true; busy(null);
    hostHandle({ t: 'join', from: ME.id, name: ME.name, av: ME.av });
    startHostLoop(); broadcast();
  };
  H.hub.connect();
  setTimeout(() => { if (!opened && C.role === 'host') { busy(null); toast('Couldn’t reach the game servers. Check your connection and try again.'); teardown(); render(); } }, 15000);
}
function practice() {
  if (!needName()) return;
  teardown();
  H = newHost('SOLO', true);
  C.role = 'solo'; C.code = 'SOLO';
  hostHandle({ t: 'join', from: ME.id, name: ME.name, av: ME.av });
  H.set = { mode: 'vs', rounds: 7, secs: 0, topics: [] };
  startHostLoop(); startGame();
}

/* ═════════════════ GUEST ═════════════════ */
function connectGuest(code) {
  if (C.hub) C.hub.end();
  C.link = null;
  const base = NET.NS + code + '/';
  const hub = new NET.Hub([base + 's', base + 'p/' + ME.id], (topic, m, client) => {
    if (C.hub !== hub) return;
    if (topic === base + 's') {
      if (m.t === 'end') { hostEnded(m.msg); return; }
      if (m.t !== 'state' || !m.v || m.v.code !== code) return;
      if (!C.link) { C.link = client; hub.keepOnly(client); }
      if (client !== C.link) return;
      onState(m.v);
    } else if (topic === base + 'p/' + ME.id) {
      if (!C.link && m.t === 'err') { C.link = client; hub.keepOnly(client); }
      onDirect(m);
    }
  });
  hub.onUp = (c) => { try { c.publish(base + 'h', JSON.stringify({ t: 'join', from: ME.id, sid: SID, q: ++QSEQ, name: ME.name, av: ME.av }), { qos: 1 }); } catch {} };
  C.hub = hub;
  hub.connect();
}
function joinLobby(code, quiet) {
  code = String(code || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  if (code.length !== 4) { toast('Lobby codes are four letters'); return; }
  if (!quiet && !needName()) return;
  teardown();
  C.role = 'guest'; C.code = code; C.joined = false; C.view = null;
  C.joinDeadline = pnow() + (quiet ? 9000 : 13000);
  busy((quiet ? 'Rejoining ' : 'Finding lobby ') + code + '…');
  connectGuest(code);
  saveRejoin(code);
  startGuestLoop();
}
function send(t, data = {}) {
  const m = { t, from: ME.id, sid: SID, q: ++QSEQ, ...data };
  if (C.role === 'host' || C.role === 'solo') { hostHandle(m); return; }
  if (C.hub) C.hub.pub(NET.NS + C.code + '/h', m, 1);
}
let guestLoop = 0;
function startGuestLoop() {
  clearInterval(guestLoop);
  let lastPing = 0, lastJoin = pnow();
  guestLoop = setInterval(() => {
    if (C.role !== 'guest') return;
    const t = pnow();
    if (!C.joined) {
      if (t - lastJoin > 2000) { lastJoin = t; send('join', { name: ME.name, av: ME.av }); }
      if (t > C.joinDeadline) { busy(null); toast('Couldn’t find lobby ' + C.code + '. Check the code.'); clearRejoin(); teardown(); render(); }
      return;
    }
    if (t - lastPing > PING_MS) { lastPing = t; send('ping'); }
    if (!C.recovering && t - C.lastStateAt > HOST_SILENT) { C.recovering = t; busy('Reconnecting…'); connectGuest(C.code); }
    if (C.recovering && t - C.recovering > GIVEUP) { busy(null); toast('Lost the lobby. The host may have left.'); clearRejoin(); teardown(); render(); }
    if (C.recovering && t - lastJoin > 2500) { lastJoin = t; send('join', { name: ME.name, av: ME.av }); }
  }, 400);
}
function hostEnded(msg) { if (C.role !== 'guest') return; toast(msg || 'The host closed the game.'); clearRejoin(); teardown(); render(); }
function saveRejoin(code) { const rj = { code, id: ME.id, at: now() }; LS.set('rj', rj); SS.set('rj', rj); }
function clearRejoin() { LS.del('rj'); SS.del('rj'); }
function relayQ() { try { const r = new URLSearchParams(location.search).get('relay'); return r && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? r : ''; } catch { return ''; } }
function buildQ(code) { const p = new URLSearchParams(); if (code) p.set('join', code); const r = relayQ(); if (r) p.set('relay', r); const s = p.toString(); return s ? '?' + s : ''; }
function setUrl(code) { try { history.replaceState(null, '', location.pathname + buildQ(code)); } catch {} }

/* ───────── leaving ───────── */
function teardown() {
  clearInterval(guestLoop);
  if (H) { clearInterval(H.loop); if (H.hub) H.hub.end(); }
  if (C.hub) C.hub.end();
  H = null;
  Object.assign(C, { role: null, code: null, hub: null, link: null, view: null, joined: false, recovering: 0, myLock: null, mySubs: [], fb: null, timeKey: '', revealKey: '', finalSig: '' });
  busy(null); wakeLock(false);
}
function leave() {
  if (C.role === 'host' && H && H.hub) { H.hub.pub(NET.NS + H.code + '/s', { t: 'end', msg: 'The host closed the game.' }, 1); }
  if (C.role === 'guest') send('bye');
  clearRejoin();
  const hub = (H && H.hub) || C.hub;
  if (hub) { const keep = hub; setTimeout(() => keep.end(), 400); if (H) H.hub = null; C.hub = null; }
  teardown(); setUrl(''); render();
}
window.addEventListener('pagehide', () => {
  if (C.role === 'host' && H && H.hub) H.hub.pub(NET.NS + H.code + '/s', { t: 'end', msg: 'The host closed the game.' }, 0);
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && H) { const t = now(); for (const p of H.players) p.seen = Math.max(p.seen, t - 2000); }
});

/* ═════════════════ CLIENT VIEW ═════════════════ */
function onState(v) {
  C.view = v; C.lastStateAt = pnow();
  if (C.recovering) { C.recovering = 0; busy(null); }
  if (!C.joined && v.pl.some(p => p.id === ME.id)) { C.joined = true; busy(null); if (C.role === 'guest') setUrl(C.code); }
  if (C.role === 'guest' && C.joined && !v.pl.some(p => p.id === ME.id)) send('join', { name: ME.name, av: ME.av });
  const key = v.ph + ':' + v.r + ':' + (v.q || '');
  const d = pnow() + v.rem, di = pnow() + v.intro;
  if (key !== C.timeKey || Math.abs(d - C.deadline) > 450) C.deadline = d;
  if (key !== C.timeKey || Math.abs(di - C.introUntil) > 450) C.introUntil = di;
  if (key !== C.timeKey) { const prev = C.timeKey; C.timeKey = key; onPhase(v, prev); }
  checkEmotes(v);
  render();
}
function onPhase(v, prev) {
  if (v.ph === 'play') {
    C.myLock = null; C.mySubs = []; C.fb = null; C.lastTickSec = -1;
    $('ans').value = '';
    vib(40); wakeLock(true);
    if (v.r === 0 || !C.myTiers) C.myTiers = {};
    DV.sink = null; $('land').hidden = true; $('playScr').classList.remove('landed');
    setTimeout(() => { const i = $('ans'); if (i && !i.disabled && !matchMedia('(pointer: coarse)').matches) i.focus(); }, Math.max(0, C.introUntil - pnow()) + 40);
  }
  if (v.ph === 'reveal') { C.revealAt = pnow(); startSink(v); }
  if (v.ph === 'final') {
    C.finalSig = ''; bubbles(26);
    if (v.solo) { const me = meIn(v); if (me && me.pts > LS.get('best', 0)) LS.set('best', me.pts); }
  }
  if (v.ph === 'lobby') { wakeLock(false); C.finalSig = ''; }
}
function onDirect(m) {
  const v = C.view;
  if (m.t === 'err') { busy(null); toast(m.msg || 'Something went wrong.'); clearRejoin(); teardown(); render(); return; }
  if (m.t === 'rejoin') { send('join', { name: ME.name, av: ME.av }); return; }
  if (m.t !== 'fb' || !v || m.r !== v.r) return;
  const q = QMAP[v.q];
  if (m.kind === 'locked') { C.myLock = { aid: m.aid }; render(); return; }
  if (m.kind === 'crew') {
    const a = q.answers[m.aid];
    const txt = { fill: 'Filled a slot!', miss: 'Wrong depth. That’s a strike.', gem: 'The kraken’s pick! +1 plank', dup: 'Already in this order' }[m.res];
    C.fb = { kind: m.res === 'miss' || m.res === 'dup' ? 'no' : 'ok', html: `<span class="tag ${m.res === 'miss' || m.res === 'dup' ? 'no' : 'ok'}">${esc(a.name)}</span> ${tierPill(a.tier)} ${esc(txt)}` };
    if (m.res === 'miss') { SFX.bad(); vib([30, 40, 30]); } else if (m.res === 'gem') { SFX.roar(); vib([60, 40, 120]); } else if (m.res === 'dup') SFX.dup(); else SFX.lock();
    renderFb(); return;
  }
  C.myLock = null;
  C.fb = { kind: 'no', html: m.kind === 'decoy' ? `<span class="tag no">${esc(m.text)}</span> ${esc(m.msg)}` : esc(m.msg) };
  renderFb(); shake(); SFX.bad();
}
function shake() { const i = $('ans'); i.classList.remove('shk'); void i.offsetWidth; i.classList.add('shk'); }
function submit() {
  const v = C.view; const inp = $('ans'); const text = inp.value.trim();
  if (!text || !v || v.ph !== 'play') return;
  if (pnow() < C.introUntil - 200) return;
  const me = meIn(); if (!me || me.spec) return;
  const q = QMAP[v.q]; const r = matchAnswer(q, text);
  if (!r.ok) {
    if (r.kind === 'empty') return;
    C.fb = { kind: 'no', html: r.kind === 'decoy' ? `<span class="tag no">${esc(text)}</span> ${esc(r.msg)}` : esc(r.msg) };
    renderFb(); shake(); SFX.bad(); vib(30); return;
  }
  if (v.set.mode === 'vs') {
    if (C.myLock) return;
    C.myLock = { aid: r.id, pending: true }; C.fb = null;
    send('ans', { text }); inp.value = ''; SFX.lock(); vib(30);
  } else {
    if ((v.cr.used || []).includes(r.id) || C.mySubs.includes(r.id)) { C.fb = { kind: 'no', html: `<span class="tag no">${esc(r.name)}</span> Already in this order.` }; renderFb(); SFX.dup(); inp.value = ''; return; }
    if (C.mySubs.length >= MAXSUBS) return;
    clearTimeout(drT); lastDr = '';
    C.mySubs.push(r.id); send('sub', { text }); inp.value = '';
    C.fb = { kind: '', html: `<span class="tag">${esc(r.name)}</span> Sent to the crew…` };
  }
  render();
}
let tyT = 0, lastTy = 0, drT = 0, lastDr = '';
function onTyping() {
  const v = C.view; if (!v || v.ph !== 'play' || C.role === 'solo') return;
  const val = $('ans').value;
  if (v.set.mode === 'vs') {
    if (pnow() - lastTy > 1500 && val) { lastTy = pnow(); send('ty', { on: 1 }); }
    clearTimeout(tyT); tyT = setTimeout(() => send('ty', { on: 0 }), 2200);
  } else {
    clearTimeout(drT); drT = setTimeout(() => { const d = val.trim().slice(0, 24); if (d !== lastDr) { lastDr = d; send('draft', { text: d }); } }, 280);
  }
}

/* ───────── emotes ───────── */
function checkEmotes(v) {
  for (const p of v.pl) {
    if (!p.emo) continue;
    if (C.emoSeen[p.id] !== p.emo[1]) { C.emoSeen[p.id] = p.emo[1]; floater(p, p.emo[0]); }
  }
}
function floater(p, e) {
  const el = document.createElement('div'); el.className = 'fl';
  el.style.left = (10 + Math.random() * 70) + '%';
  el.innerHTML = `${avatar(p.av)}<span>${esc(p.nm)}</span><span class="e">${esc(e)}</span>`;
  $('floaters').appendChild(el); setTimeout(() => el.remove(), 2700); SFX.bubble();
}

/* ───────── moments: RELEASE THE KRAKEN / SUNK / EATEN ───────── */
function burstPath(n, r1, r2, seed) {
  const R = rng(seed); let d = '';
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2; const rr = (i % 2 ? r2 : r1) * (0.9 + R() * 0.18); d += (i ? 'L' : 'M') + (200 + Math.cos(a) * rr).toFixed(1) + ' ' + (200 + Math.sin(a) * rr).toFixed(1); }
  return d + 'Z';
}
let momentT = 0;
function showMoment(v) {
  const q = QMAP[v.q]; const m = $('moment');
  let big = '', line = '', small = '', sound = null;
  if (v.set.mode === 'vs' && v.res) {
    const mine = v.res.find(r => r[0] === ME.id);
    if (mine && mine[1] >= 0) { showDive(v, mine); return; }
    const kr = v.res.filter(r => r[1] >= 0 && !r[3] && q.answers[r[1]].tier === 'x');
    if (kr.length) { big = 'Release<br>the kraken!'; line = kr.map(r => pinfo(r[0], v).nm).join(' & ') + ' found ' + q.answers[kr[0][1]].name; small = 'The one the kraken wanted.'; sound = 'roar'; }
    else if (mine && mine[3]) { big = 'Sunk!'; line = 'Someone said ' + q.answers[mine[1]].name + ' too'; small = 'Same answer, zero points each.'; sound = 'sunk'; }
    else if (mine && mine[1] < 0) { big = 'Eaten!'; line = 'No answer in time'; small = 'The kraken got you this round.'; sound = 'roar'; }
  } else if (v.cr) {
    if (v.cr.out === 'fail') { big = 'Lost<br>a plank!'; line = v.cr.miss >= STRIKES ? 'Three wrong depths' : 'The crew gave up the order'; small = v.cr.lives + (v.cr.lives === 1 ? ' plank left.' : ' planks left.'); sound = 'roar'; }
    else if (v.cr.gem) { big = 'Release<br>the kraken!'; line = 'Your crew found ' + q.answers.find(a => a.tier === 'x').name; small = 'Bonus plank.'; sound = 'roar'; }
  }
  m.className = 'moment';
  if (!big) { m.hidden = true; return; }
  m.innerHTML = `<div class="mb"><div class="burst"><svg viewBox="0 0 400 400" aria-hidden="true"><path d="${burstPath(15, 178, 118, v.q + v.r)}"/><path class="in" d="${burstPath(15, 138, 98, v.r + v.q)}"/></svg><b>${big}</b></div><p>${esc(line)}</p><small>${esc(small)}</small></div>`;
  m.hidden = false; vib([80, 50, 160]);
  if (sound) SFX[sound]();
  clearTimeout(momentT); momentT = setTimeout(() => { m.hidden = true; C.revealAt = pnow(); render(); }, 1900);
  C.revealAt = pnow() + 1900;
}

/* ───────── THE DIVE: your answer sinks you by rarity ───────── */
let diveRAF = 0;
const WAVE = 'M0 20' + ' Q 12.5 4 25 20 T 50 20'.repeat(1) + Array.from({ length: 11 }, (_, i) => ` T ${75 + i * 25} 20`).join('') + ' V 44 H 0 Z';
function showDive(v, mine) {
  const q = QMAP[v.q]; const m = $('moment'); const me = meIn(v);
  const a = q.answers[mine[1]]; const tier = a.tier; const T = TIERS[tier];
  const sunk = !!mine[3], kr = tier === 'x' && !sunk;
  const target = T.pts / 100;
  const dur = 1100 + 1600 * target;
  const others = v.res.filter(r => r[0] !== ME.id && r[1] === mine[1]).map(r => pinfo(r[0], v).nm);
  const marks = TORDER.map(t => `<div class="dmk ${TCLS[t]}" style="--p:${TIERS[t].pts / 100}"><span>${esc(TIERS[t].name)}</span><b>${(TIERS[t].pts * 10).toLocaleString('en-GB')} m</b></div>`).join('');
  m.className = 'moment dive' + (sunk ? ' is-sunk' : '') + (kr ? ' is-kr' : '');
  m.innerHTML = `<div class="dsea" id="dSea"><svg class="dwave" viewBox="0 0 300 44" preserveAspectRatio="none" aria-hidden="true"><path d="${WAVE}"/></svg>${marks}<div class="dbed">${kr ? ART.kraken() : ''}</div></div>
    <div class="dhud"><span class="dlab" id="dLab">Descending…</span><span class="dm" id="dM">0 m</span></div>
    <div class="ddiver" id="dDiver">${avatar(me ? me.av : ME.av)}<span class="dans">${esc(a.name)}</span></div>
    <div class="dres" id="dRes" hidden></div>
    <div class="dfx" id="dFx" aria-hidden="true"></div>
    <button class="dskip" type="button" id="dSkip">Skip</button>`;
  if (kr) { try { ART.suckers(m.querySelector('.dbed svg')); } catch {} }
  m.hidden = false;
  const fx = $('dFx');
  for (let i = 0; i < 22; i++) { const b = document.createElement('i'); const sz = 6 + Math.random() * 20; b.style.cssText = `left:${30 + Math.random() * 40}%;width:${sz}px;height:${sz}px;animation-delay:${Math.round(Math.random() * dur)}ms;animation-duration:${800 + Math.round(Math.random() * 900)}ms`; fx.appendChild(b); }
  SFX.bubble(); vib(30);
  const t0 = pnow(); let zone = -1;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const land = () => {
    m.classList.add('landed');
    const lab = $('dLab'), res = $('dRes'); if (!lab || !res) return;
    lab.textContent = sunk ? 'Sunk!' : kr ? 'Release the kraken!' : 'Landed';
    res.hidden = false;
    if (sunk) {
      $('dM').classList.add('x'); $('dDiver').classList.add('yank');
      res.innerHTML = `<span class="stamp">Sunk</span><p>${esc(others.join(' & ') || 'Someone')} said it too</p><small>Same answer, so you both get +0 m</small>`;
      SFX.sunk(); vib([80, 50, 160]);
    } else {
      const dbl = mine[2] > T.pts;
      res.innerHTML = `<span class="stamp light ${TCLS[tier]}">${esc(T.name)}</span><p>+${M(mine[2])}${dbl ? ' · doubled' : ''}</p><small>${me ? 'You’re now ' + M(me.pts) + ' down' : ''}</small>`;
      if (kr) { SFX.roar(); vib([60, 40, 160]); } else { SFX.plink(T.i); vib(40); }
    }
  };
  const step = () => {
    const sea = $('dSea'), dm = $('dM'); if (!sea || !dm) return;
    const k = Math.min(1, (pnow() - t0) / dur); const f = ease(k) * target;
    sea.style.setProperty('--f', f.toFixed(4));
    dm.textContent = Math.round(f * 1000).toLocaleString('en-GB') + ' m';
    const z = TORDER.filter(t => TIERS[t].pts / 100 <= f + 1e-6).length - 1;
    if (z > zone) { zone = z; if (z >= 0 && k < 1) SFX.plink(z); }
    if (k < 1) diveRAF = requestAnimationFrame(step); else land();
  };
  cancelAnimationFrame(diveRAF); diveRAF = requestAnimationFrame(step);
  const total = dur + (kr ? 2700 : 2000);
  const close = () => { cancelAnimationFrame(diveRAF); clearTimeout(momentT); m.hidden = true; m.className = 'moment'; m.innerHTML = ''; C.revealAt = pnow(); render(); };
  $('dSkip').onclick = close;
  clearTimeout(momentT); momentT = setTimeout(close, total);
  C.revealAt = pnow() + total;
}

/* ───────── depth gauge on the play screen ───────── */
function renderGauge(v) {
  const g = $('gauge'); const crew = v.set.mode === 'crew';
  g.hidden = crew; if (crew) return;
  const act = v.pl.filter(p => !p.spec);
  const full = Math.max(100, (v.n + (act.length > 1 ? 1 : 0)) * 100);
  const deepest = act.reduce((m, p) => Math.max(m, p.pts), 0);
  const max = Math.min(full, Math.max(200, Math.ceil(deepest * 1.35 / 50) * 50));
  if (g._max !== max) {
    g._max = max;
    g.innerHTML = `<div class="gticks">${[0, 0.25, 0.5, 0.75, 1].map(f => `<span style="top:${8 + f * 84}%">${(Math.round(max * 10 * f / 100) * 100).toLocaleString('en-GB')} m</span>`).join('')}</div><div class="gdiv" id="gdiv"></div><div class="geyes"><i></i><i></i></div>`;
  }
  const n = act.length;
  $('gdiv').innerHTML = act.map((p, i) => {
    const f = Math.min(1, p.pts / max);
    const left = n === 1 ? 58 : 30 + (i / (n - 1)) * 56;
    return `<span class="gd ${p.id === ME.id ? 'me' : ''} ${p.off || p.gone ? 'dim' : ''}" style="top:calc(${(8 + f * 84).toFixed(2)}% + ${(i % 2) * 12}px);left:${left.toFixed(1)}%" title="${esc(p.nm)} · ${M(p.pts)}">${avatar(p.av)}${p.lk ? `<i class="ck">${ART.ui.check}</i>` : ''}${p.id === ME.id ? `<b>You · ${M(p.pts)}</b>` : ''}</span>`;
  }).join('');
}

/* ═════════════════ THE DIVE: one continuous descent ═════════════════ */
const DV = { S: 1.6, SKY: 500, built: false, anchor: 0.6, lastT: 0, sink: null, landShown: '', tlKey: '' };
const DV_MAX = 8200, DV_OFF = 64;
const DV_MARKS = [
  [30, 'r', 'most recreational divers turn back here'],
  [150, 'l', 'reef corals give up around here'],
  [200, 'z', 'The twilight zone', 'sunlight starts to run out'],
  [332, 'r', 'deepest scuba dive ever · 332 m'],
  [500, 'l', 'pressure: 50× the surface'],
  [650, 'r', 'swordfish hunt down to here'],
  [1000, 'z', 'The midnight zone', 'no sunlight reaches this far'],
  [1300, 'l', 'sperm whales chase giant squid'],
  [1800, 'r', 'anglerfish dangle glowing lures'],
  [2300, 'l', 'the water is barely above freezing'],
  [2992, 'r', 'deepest whale dive ever · 2,992 m'],
  [3800, 'l', 'the Titanic lies here · 3,800 m'],
  [4000, 'z', 'The abyss', '2°C and pitch black'],
  [4800, 'r', 'the abyssal plain runs flat for miles'],
  [6000, 'z', 'The hadal zone', 'named after Hades'],
  [6600, 'l', 'most submarines would crumple by now'],
  [7300, 'r', 'snailfish still live down here'],
  [7900, 'z', 'The kraken’s trench', 'a perfect dive ends here'],
];
const yOf = (m) => DV.SKY + m * DV.S;
const SHIP = `<svg viewBox="0 0 200 140" aria-hidden="true"><path d="M97 8 V98" stroke="#0a0a0a" stroke-width="6"/><path d="M97 8 L124 15 L97 22 Z" fill="#ff2b2b" stroke="#0a0a0a" stroke-width="4" stroke-linejoin="round"/><path d="M101 26 Q 152 56 101 90 Z" fill="#fff" stroke="#0a0a0a" stroke-width="5" stroke-linejoin="round"/><path d="M93 30 Q 50 58 93 88 Z" fill="#f1ebdc" stroke="#0a0a0a" stroke-width="5" stroke-linejoin="round"/><circle cx="116" cy="56" r="8" fill="#0a0a0a"/><path d="M110 66 l12 -2" stroke="#0a0a0a" stroke-width="4"/><path d="M16 98 H184 L162 130 H40 Z" fill="#3b2a21" stroke="#0a0a0a" stroke-width="6" stroke-linejoin="round"/><path d="M26 108 H176" stroke="#ff2b2b" stroke-width="6"/></svg>`;
function lifeHTML() {
  const R = rng('kraken-life'); let h = '';
  const school = (n) => { let s = ''; for (let i = 0; i < n; i++) { const x = (R() * 64) | 0, y = (R() * 34) | 0, sc = (0.7 + R() * 0.6).toFixed(2); s += `<path transform="translate(${x} ${y}) scale(${sc})" d="M0 6 Q8 0 16 6 Q8 12 0 6 Z M15 6 L22 1 L22 11 Z"/>`; } return `<svg viewBox="0 0 92 50">${s}</svg>`; };
  for (let i = 0; i < 10; i++) { const m = 30 + R() * 950; h += `<div class="dv-fish ${R() < 0.5 ? 'l' : 'r'}" style="top:${yOf(m).toFixed(0)}px;animation-duration:${(26 + R() * 34).toFixed(0)}s;animation-delay:-${(R() * 50).toFixed(0)}s">${school(4 + ((R() * 6) | 0))}</div>`; }
  for (let i = 0; i < 7; i++) { const m = 350 + R() * 1800; h += `<div class="dv-jelly" style="top:${yOf(m).toFixed(0)}px;left:${(10 + R() * 78).toFixed(0)}%;animation-delay:-${(R() * 6).toFixed(1)}s"><svg viewBox="0 0 40 62"><path class="b" d="M4 22 Q20 -4 36 22 Q20 17 4 22 Z"/><path class="t" d="M10 22 q-4 12 2 22 M17 22 q4 15 -2 32 M24 22 q-4 13 2 26 M31 22 q4 10 -1 18"/></svg></div>`; }
  for (let i = 0; i < 16; i++) { const m = 1300 + R() * 5900; h += `<i class="dv-lure" style="top:${yOf(m).toFixed(0)}px;left:${(6 + R() * 88).toFixed(0)}%;animation-delay:-${(R() * 4).toFixed(1)}s"></i>`; }
  h += `<div class="dv-whale" style="top:${yOf(1250).toFixed(0)}px"><svg viewBox="0 0 220 80"><path d="M0 40 Q40 4 120 10 Q190 14 200 40 L220 22 L214 44 L220 66 L200 50 Q170 76 100 72 Q30 70 0 40 Z"/></svg></div>`;
  return h;
}
function buildWorld() {
  const vh = innerHeight;
  DV.S = Math.min(2.2, Math.max(1.1, vh / 520)); DV.SKY = Math.round(vh * 0.64);
  const w = $('world');
  w.style.setProperty('--S', DV.S + 'px'); w.style.setProperty('--sky', DV.SKY + 'px');
  w.style.height = Math.round(yOf(DV_MAX) + 500) + 'px';
  let ruler = '';
  for (let m = 100; m <= 8000; m += 100) ruler += `<i style="top:${(m * DV.S).toFixed(1)}px"${m % 500 ? '' : ' class="big"'}><b>${m.toLocaleString('en-GB')} m</b></i>`;
  const marks = DV_MARKS.map(([m, side, a, b]) => side === 'z'
    ? `<div class="dv-mk z" style="top:${yOf(m).toFixed(0)}px"><b>${esc(a)}</b><span>${esc(b)}</span></div>`
    : `<div class="dv-mk ${side}" style="top:${yOf(m).toFixed(0)}px">${esc(a)}</div>`).join('');
  w.innerHTML = `<div class="dv-sun"></div><i class="dv-cloud c1"></i><i class="dv-cloud c2"></i><i class="dv-cloud c3"></i>
    <div class="dv-ship">${SHIP}</div><div class="dv-surf"></div><div class="dv-rays"></div>
    <div class="dv-ruler">${ruler}</div>${marks}${lifeHTML()}
    <div class="dv-kraken" style="top:${yOf(7600).toFixed(0)}px">${ART.kraken()}</div>
    <div id="tlines"></div><div id="divers"></div>`;
  try { ART.suckers(w.querySelector('.dv-kraken svg')); } catch {}
  DV.built = true; DV.tlKey = '';
  if (C.view && (C.view.ph === 'play' || C.view.ph === 'reveal')) { renderDivers(C.view); renderTierLines(C.view); }
}
function startSink(v) {
  const res = v.res || [];
  DV.sink = { t0: pnow() + 350, from: {}, to: {}, dur: {} };
  for (const p of v.pl) {
    const r = res.find(x => x[0] === p.id); const gain = r ? r[2] : 0;
    DV.sink.to[p.id] = p.pts * 10; DV.sink.from[p.id] = (p.pts - gain) * 10;
    DV.sink.dur[p.id] = gain > 0 ? 1600 + 1900 * Math.min(1, gain / 100) : 700;
  }
  DV.landShown = '';
  const mine = res.find(r => r[0] === ME.id); const q = QMAP[v.q];
  C.myTiers = C.myTiers || {};
  if (mine) C.myTiers[v.r] = mine[1] < 0 ? 'none' : mine[3] ? 'sunk' : q.answers[mine[1]].tier;
}
function dispDepth(p) {
  const s = DV.sink, v = C.view;
  if (!s || !v || v.ph !== 'reveal' || !(p.id in s.to)) return p.pts * 10;
  const k = Math.max(0, Math.min(1, (pnow() - s.t0) / s.dur[p.id]));
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  return s.from[p.id] + (s.to[p.id] - s.from[p.id]) * e;
}
function myBase(v) {
  const me = meIn(v); if (!me || me.spec) return 0;
  return v.ph === 'reveal' && DV.sink && ME.id in DV.sink.from ? DV.sink.from[ME.id] : me.pts * 10;
}
function renderTierLines(v) {
  if (v.set.mode === 'crew') { $('tlines').innerHTML = ''; DV.tlKey = ''; return; }
  const base = myBase(v); const key = base + ':' + DV.S + ':' + v.r;
  if (DV.tlKey === key) return; DV.tlKey = key;
  $('tlines').innerHTML = TORDER.map(t => { const m = base + TIERS[t].pts * 10; return `<div class="dv-tl ${TCLS[t]}" data-m="${m}" style="top:${(yOf(m) + DV_OFF).toFixed(1)}px"><span>${esc(TIERS[t].name)} · +${(TIERS[t].pts * 10).toLocaleString('en-GB')} m</span></div>`; }).join('');
}
function renderDivers(v) {
  const q = QMAP[v.q]; const rv = v.ph === 'reveal';
  const act = v.pl.filter(p => !p.spec && !p.gone); const n = act.length;
  const box = $('divers');
  const key = act.map(p => p.id + p.av + p.nm).join('|');
  if (box._key !== key) {
    box._key = key;
    box.innerHTML = act.map(p => `<div class="dvr ${p.id === ME.id ? 'me' : ''}" data-pid="${esc(p.id)}"><span class="bb"><i></i><i></i><i></i><i></i><i></i><i></i></span>${avatar(p.av)}<span class="nm">${esc(p.id === ME.id && n > 1 ? 'you' : p.nm)}</span><span class="tag" hidden></span></div>`).join('');
  }
  act.forEach((p, i) => {
    const el = box.querySelector(`[data-pid="${CSS.escape(p.id)}"]`); if (!el) return;
    const x = n === 1 ? 50 : 20 + (i / (n - 1)) * 60;
    el.style.left = x + '%'; el.classList.toggle('lt', x > 62); el.classList.toggle('dim', !!p.off);
    let txt = '', cls = '';
    if (rv && v.res) {
      const r = v.res.find(z => z[0] === p.id);
      if (r) { if (r[1] < 0) { txt = 'no answer'; cls = 'none'; } else { txt = q.answers[r[1]].name; cls = r[3] ? 'sunk' : TCLS[q.answers[r[1]].tier]; } }
    } else if (v.ph === 'play' && v.set.mode === 'vs') {
      if (p.id === ME.id && C.myLock && q.answers[C.myLock.aid]) { txt = q.answers[C.myLock.aid].name; cls = 'mine'; }
      else if (p.lk) { txt = 'locked in'; cls = 'lk'; }
      else if (p.ty) { txt = '…'; cls = 'ty'; }
    }
    const tag = el.querySelector('.tag');
    if (tag._t !== txt + cls) { tag._t = txt + cls; tag.hidden = !txt; tag.textContent = txt; tag.className = 'tag ' + cls; }
  });
}
function landHTML(v) {
  const q = QMAP[v.q]; const res = v.res || []; const mine = res.find(r => r[0] === ME.id); const me = meIn(v);
  let t1 = '', cls = '', a = '', gain = '', quip = '';
  if (!mine) { t1 = 'Watching'; quip = 'You’ll dive in the next game.'; }
  else if (mine[1] < 0) { t1 = 'No dive'; cls = 'none'; quip = 'No answer, so you stayed where you were.'; }
  else if (mine[3]) {
    const others = res.filter(r => r[0] !== ME.id && r[1] === mine[1]).map(r => pinfo(r[0], v).nm);
    t1 = 'Sunk'; cls = 'sunk'; a = q.answers[mine[1]].name; gain = '+0 m'; quip = `${others.join(' & ') || 'Someone'} said it too. Same answer, nobody moves.`;
  } else {
    const tr = q.answers[mine[1]].tier; t1 = TIERS[tr].name; cls = TCLS[tr]; a = q.answers[mine[1]].name;
    gain = `+${M(mine[2])}${mine[2] > TIERS[tr].pts ? ' · doubled' : ''}`; quip = TIERS[tr].line;
  }
  const board = res.length > 1 ? `<ol class="lboard">${res.slice().sort((x, y) => (pinfo(y[0], v).pts - pinfo(x[0], v).pts)).map(r => { const pl = pinfo(r[0], v); return `<li class="${r[0] === ME.id ? 'me' : ''}">${avatar(pl.av)}<span class="n">${esc(pl.nm)}<small>${r[1] < 0 ? 'no answer' : esc(q.answers[r[1]].name)}${r[3] ? ' · sunk' : ''}</small></span><b>+${M(r[2])}</b><em>${M(pl.pts)}</em></li>`; }).join('')}</ol>` : '';
  const X = q.answers.find(z => z.tier === 'x');
  const said = new Set(res.filter(r => r[1] >= 0).map(r => r[1]));
  const deep = shuffled(q.answers.filter(z => z.tier === 'f' && !said.has(z.id)), v.q + v.r).slice(0, 4).map(z => z.name);
  const last = v.r >= v.n - 1; const host = C.role === 'host' || C.role === 'solo';
  const btn = host ? `<button class="btn desc" type="button" data-act="next">${last ? 'Surface · see results' : 'Descend ▼'}</button>` : `<p class="lwait">Waiting for the host to descend…</p>`;
  return `<div class="lt-t ${cls}">${esc(t1)}</div>${a ? `<div class="lt-a">“${esc(a)}”</div>` : ''}${gain ? `<div class="lt-p">${esc(gain)}${me && !me.spec ? ` · now ${M(me.pts)} down` : ''}</div>` : ''}<p class="lt-q">${esc(quip)}</p>${board}
    <div class="lt-k"><span>The kraken’s pick</span><b>${esc(X.name)}</b><small>${esc(q.fact)}</small>${deep.length ? `<em>Other abyss answers: ${deep.map(esc).join(' · ')}</em>` : ''}</div>${btn}`;
}
function crewLandHTML(v) {
  const q = QMAP[v.q]; const cr = v.cr; const clear = cr.out === 'clear';
  const X = q.answers.find(z => z.tier === 'x');
  const host = C.role === 'host'; const last = v.r >= v.n - 1 || cr.lives <= 0;
  const btn = host ? `<button class="btn desc" type="button" data-act="next">${last ? 'Surface · see results' : 'Next order ▼'}</button>` : `<p class="lwait">Waiting for the host…</p>`;
  return `<div class="lt-t ${clear ? 't2' : 'sunk'}">${clear ? 'Order filled' : 'Lost a plank'}</div><div class="lt-p">${clear ? '★'.repeat(cr.rs) + '☆'.repeat(3 - cr.rs) : `${cr.lives} ${cr.lives === 1 ? 'plank' : 'planks'} left`}</div><p class="lt-q">${clear ? (cr.miss ? `${cr.miss} wrong ${cr.miss > 1 ? 'depths' : 'depth'} on the way.` : 'Not one wrong depth.') : cr.miss >= STRIKES ? 'Three wrong depths.' : 'The crew gave up the order.'}</p>
    <div class="lt-k"><span>${cr.gem ? 'You found the kraken’s pick' : 'The kraken’s pick'}</span><b>${esc(X.name)}</b><small>${esc(q.fact)}</small></div>${btn}`;
}
function showLand(v) {
  $('land').innerHTML = v.set.mode === 'crew' ? crewLandHTML(v) : landHTML(v);
  $('land').hidden = false; $('playScr').classList.add('landed');
  const me = meIn(v); const mine = v.res && v.res.find(r => r[0] === ME.id);
  if (mine && mine[3]) vib([60, 40, 120]); else if (me) vib(30);
  const b = $('land').querySelector('.desc'); if (b && !matchMedia('(pointer: coarse)').matches) setTimeout(() => b.focus({ preventScroll: true }), 50);
}
function renderDive(v) {
  const q = QMAP[v.q]; if (!q) return;
  if (!DV.built) buildWorld();
  C.myTiers = C.myTiers || {};
  const sec = $('playScr'); const rv = v.ph === 'reveal'; const crew = v.set.mode === 'crew';
  sec.classList.toggle('rv', rv); if (!rv) sec.classList.remove('landed');
  const me = meIn(v); const act = v.pl.filter(p => !p.spec);
  $('hDots').innerHTML = Array.from({ length: v.n }, (_, i) => { const tr = C.myTiers[i]; return `<i class="${i === v.r && !rv ? 'cur' : ''} ${tr ? 'done ' + (TCLS[tr] || tr) : ''}"></i>`; }).join('');
  $('hCount').textContent = `${crew ? 'Order' : 'Prompt'} ${v.r + 1} of ${v.n}`;
  if (crew) { $('hRL').textContent = 'Planks'; $('hR').textContent = String(v.cr.lives); }
  else if (act.length > 1) { const rank = act.slice().sort((a, b) => b.pts - a.pts).findIndex(p => p.id === ME.id) + 1; $('hRL').textContent = 'Rank'; $('hR').textContent = rank > 0 ? `${rank} of ${act.length}` : 'watching'; }
  else { $('hRL').textContent = 'Best dive'; $('hR').textContent = M(LS.get('best', 0)); }
  $('tbX').innerHTML = ART.ui.close;
  $('qN').textContent = `${crew ? 'Order' : 'Prompt'} ${v.r + 1} of ${v.n} · ${(CATINFO[q.cat] || ['Mix'])[0]}${!crew && act.length > 1 && v.r === v.n - 1 ? ' · double depth' : ''}`;
  $('qT').textContent = q.prompt;
  $('qS').textContent = crew ? '▼ fill the captain’s order ▼' : '▼ rarer answers sink deeper ▼';
  const watching = !me || me.spec;
  $('watching').hidden = !watching;
  $('ansF').hidden = watching || (!crew && !!C.myLock);
  $('ansB').textContent = crew ? 'Send' : 'Dive';
  const locked = act.filter(p => p.lk).length;
  const waitFor = act.filter(p => !p.lk && p.id !== ME.id && !p.gone).map(p => p.nm);
  const sealed = $('sealed');
  sealed.hidden = !(C.myLock && !crew && !watching) || rv;
  if (!sealed.hidden) sealed.innerHTML = `<span>Locked in</span><b>${esc((q.answers[C.myLock.aid] || {}).name || '')}</b><span>${waitFor.length ? 'waiting for ' + esc(waitFor.slice(0, 3).join(', ')) + (waitFor.length > 3 ? '…' : '') : 'diving…'}</span>`;
  $('status').textContent = crew ? `${v.cr.sl.filter(Boolean).length} of ${v.cr.ord.length} slots filled · strikes ${v.cr.miss}/${STRIKES}` : act.length > 1 && !C.myLock ? `${locked} of ${act.length} locked in` : '';
  const fz = $('force'); const isHost = C.role === 'host';
  const showF = !rv && isHost && act.length > 1 && (crew || (locked > 0 && locked < act.length));
  fz.hidden = !showF; if (showF) fz.innerHTML = `<button class="lnk" type="button" data-act="force">${crew ? 'Give up this order' : 'Reveal now'}</button>`;
  $('crewBox').hidden = !crew || rv;
  if (crew && !rv) { renderOrders(v, q); renderFeed(v, q); $('hull').innerHTML = `<span class="lbl">Planks</span>` + [...Array(Math.max(3, v.cr.lives)).keys()].map(i => `<i class="${i < v.cr.lives ? '' : 'off'}"></i>`).join(''); }
  $('dvMp').hidden = C.role !== 'solo';
  renderDivers(v); renderTierLines(v);
  if (!rv) $('land').hidden = true;
  else if (DV.landShown === C.timeKey && !$('land').hidden) {
    const b = $('land').querySelector('.desc, .lwait'); const host = C.role === 'host' || C.role === 'solo';
    if (b && (b.classList.contains('desc') !== host)) showLand(v);
  }
  renderFb(); live();
}
function dvFrame(v, t) {
  if (!DV.built) buildWorld();
  const me = meIn(v); const act = v.pl.filter(p => !p.spec && !p.gone);
  const mine = me && !me.spec;
  const follow = mine ? me : act.slice().sort((a, b) => b.pts - a.pts)[0];
  const rv = v.ph === 'reveal';
  let camD = 0;
  const box = $('divers');
  for (const p of act) {
    const d = dispDepth(p);
    const el = box.querySelector(`[data-pid="${CSS.escape(p.id)}"]`);
    if (el) { el.style.top = (yOf(d) + DV_OFF).toFixed(1) + 'px'; el.classList.toggle('sinking', rv && !!DV.sink && pnow() >= DV.sink.t0 && d < DV.sink.to[p.id] - 0.5); }
    if (follow && p.id === follow.id) camD = d;
  }
  const dt = DV.lastT ? Math.min(100, t - DV.lastT) : 16; DV.lastT = t;
  const want = rv ? 0.22 : v.set.mode === 'crew' ? 0.76 : 0.6;
  DV.anchor += (want - DV.anchor) * Math.min(1, dt / 1000 * 3.2);
  const camY = innerHeight * DV.anchor - (yOf(camD) + DV_OFF);
  $('world').style.transform = `translate3d(0,${camY.toFixed(1)}px,0)`;
  const dtxt = Math.round(camD).toLocaleString('en-GB') + ' m';
  if ($('hDepth')._t !== dtxt) { $('hDepth')._t = dtxt; $('hDepth').textContent = dtxt; }
  const myD = mine ? camD : -1;
  document.querySelectorAll('#tlines .dv-tl').forEach(l => { const hit = myD >= +l.dataset.m - 0.5; if (l._hit !== hit) { l._hit = hit; l.classList.toggle('hit', hit); } });
  if (rv && DV.landShown !== C.timeKey) {
    const done = !DV.sink || !mine || pnow() - DV.sink.t0 >= (DV.sink.dur[ME.id] || 0) + 150;
    if (done) { DV.landShown = C.timeKey; showLand(v); }
  }
}
function bubbles(n) {
  const box = $('bubbles');
  for (let i = 0; i < n; i++) {
    const b = document.createElement('i'); const s = 10 + Math.random() * 34;
    b.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;--dx:${(Math.random() - 0.5) * 120}px;animation-duration:${3 + Math.random() * 3}s;animation-delay:${Math.random() * 1.5}s`;
    box.appendChild(b); setTimeout(() => b.remove(), 8000);
  }
}

/* ═════════════════ RENDER ═════════════════ */
function renderRail() {
  const on = C.role === 'solo';
  document.body.classList.toggle('solo', on);
  $('mprail').hidden = !on; if (!on) return;
  if ($('mrAv')._av !== ME.av) { $('mrAv')._av = ME.av; $('mrAv').innerHTML = avatar(ME.av); }
  $('mrNm').textContent = ME.name;
}
function renderMe() {
  if (!$('avs2').firstChild) $('avs2').innerHTML = ART.AV_IDS.map(id => `<button type="button" class="avb" data-av="${id}" aria-label="${id}">${ART.avatar(id)}</button>`).join('');
  document.querySelectorAll('#avs2 .avb').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.av === ME.av)));
}
function setMe(nm, av) {
  if (nm !== null) { ME.name = cleanName(nm); LS.set('name', ME.name); $('nm').value = ME.name; }
  if (av) { ME.av = av; LS.set('av', av); }
  const p = H && H.players.find(x => x.id === ME.id);
  if (p) { p.name = ME.name; p.av = ME.av; H.dirty = true; }
  renderMe(); renderHome(); renderRail();
}
function openMe() { renderMe(); $('nm2').value = ME.name; $('meM').hidden = false; }
function render() {
  renderRail();
  const v = C.view;
  if (!C.role || !v) { if (!C.role) { scr('home'); renderHome(); } return; }
  const map = { lobby: 'lobby', play: 'play', reveal: 'play', final: 'final' };
  scr(map[v.ph] || 'home');
  if (v.ph === 'lobby') renderLobby(v);
  if (v.ph === 'play' || v.ph === 'reveal') renderDive(v);
  if (v.ph === 'final') renderFinal(v);
}

/* home */
let homeBuilt = false;
function renderHome() {
  if (!homeBuilt) {
    homeBuilt = true;
    $('homeKraken').innerHTML = ART.kraken(); ART.suckers($('homeKraken').querySelector('svg'));
    $('nm').value = ME.name;
    $('avs').innerHTML = ART.AV_IDS.map(id => `<button type="button" class="avb" data-av="${id}" aria-label="${id}">${ART.avatar(id)}</button>`).join('');
    $('howLadder').innerHTML = ladderHTML();
  }
  document.querySelectorAll('#avs .avb').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.av === ME.av)));
  const rj = SS.get('rj', null) || LS.get('rj', null);
  const rb = $('rejoin');
  if (rj && rj.code && now() - rj.at < 3 * 3600e3) { rb.hidden = false; rb.textContent = 'Rejoin ' + rj.code; } else rb.hidden = true;
}
function ladderHTML() { return TORDER.map(t => `<div class="${TCLS[t]}"><b>${esc(TIERS[t].name)}</b><span>${TIERS[t].pts * 10}m</span></div>`).join(''); }

/* lobby */
function renderLobby(v) {
  const host = C.role === 'host';
  $('lcode').textContent = v.code;
  const live = v.pl.filter(p => !p.gone);
  $('pc').textContent = `${live.length}/${MAXP}`;
  $('plist').innerHTML = live.map(p => `<li class="${p.off ? 'off' : ''}">${avatar(p.av)}<span class="nm">${esc(p.nm)}</span><span class="tags">${p.tot ? `<span class="pill sm">${M(p.tot)} all-time</span>` : ''}${p.id === v.host ? '<span class="pill k sm">Host</span>' : ''}${p.id === ME.id ? '<span class="you">You</span>' : ''}${host && p.id !== ME.id ? `<button class="kick" type="button" data-kick="${esc(p.id)}" aria-label="Remove ${esc(p.nm)}">${ART.ui.close}</button>` : ''}</span></li>`).join('')
    + (live.length < 2 ? `<li class="hint">Send friends the code or tap Invite friends.</li>` : '');
  $('rtot').hidden = !host || !live.some(p => p.tot);
  $('setup').hidden = !host; $('upnext').hidden = host; $('startbar').hidden = !host; $('waitHost').hidden = host;
  const s = v.set;
  if (host) {
    const sig = JSON.stringify(s);
    if ($('setup')._sig !== sig) {
      $('setup')._sig = sig;
      $('setup').innerHTML = `<h2>Game setup</h2>
        <div class="label">Mode</div>
        <div class="modes"><button type="button" class="modeb" data-mode="vs" aria-pressed="${s.mode === 'vs'}"><b>Versus</b><span>Everyone answers at once. Go deepest. Same answer sinks you both.</span></button>
        <button type="button" class="modeb" data-mode="crew" aria-pressed="${s.mode === 'crew'}"><b>Crew</b><span>Work together to fill the captain’s order at exact depths.</span></button></div>
        <div class="srow"><span class="label">Rounds</span><div class="seg" data-set="rounds">${ROUNDS.map(n => `<button type="button" data-v="${n}" aria-pressed="${s.rounds === n}">${n}</button>`).join('')}</div></div>
        ${s.mode === 'vs' ? `<div class="srow"><span class="label">Timer</span><div class="seg" data-set="secs">${SECS.map(n => `<button type="button" data-v="${n}" aria-pressed="${s.secs === n}">${secLbl(n)}</button>`).join('')}</div></div>` : `<p class="hint">No timer. Three wrong depths and the kraken takes a plank.</p>`}
        <div class="srow" style="margin-bottom:0"><span class="label">Topics</span></div>
        <p class="hint" id="topicHint" style="margin:6px 0 0">Tap topics to include them. Mix uses everything.</p>
        <div class="topics"><button type="button" class="tcard" data-topic="" aria-pressed="${!s.topics.length}"><i class="tick">${ART.ui.check}</i>${ART.icon('mix')}<b>Mix</b><span>A bit of everything</span></button>
        ${Object.entries(CATINFO).map(([k, [n, sub]]) => `<button type="button" class="tcard" data-topic="${k}" aria-pressed="${s.topics.includes(k)}"><i class="tick">${ART.ui.check}</i>${ART.icon(k)}<b>${esc(n)}</b><span>${esc(sub)}</span></button>`).join('')}</div>`;
    }
    const avail = BANK.filter(q => !s.topics.length || s.topics.includes(q.cat)).length;
    const hintEl = $('setup').querySelector('#topicHint');
    if (hintEl) hintEl.textContent = avail < s.rounds ? `These topics have ${avail} prompts, so the game will be ${avail} rounds.` : 'Tap topics to include them. Mix uses everything.';
    const need = 2;
    const sb = $('start');
    sb.disabled = live.length < need;
    sb.textContent = live.length < need ? 'Waiting for friends' : `Start ${s.mode === 'vs' ? 'Versus' : 'Crew'}`;
  } else {
    const topics = s.topics.length ? s.topics.map(k => CATINFO[k][0]).join(' · ') : 'Mix';
    $('upnext').innerHTML = `<div class="label">Up next</div>${ART.icon(s.topics.length === 1 ? s.topics[0] : 'mix')}<h2>${s.mode === 'vs' ? 'Versus' : 'Crew'}</h2><p class="hint" style="margin:0">${esc(topics)}</p>
      <div class="pills"><span class="pill sm">${s.rounds} rounds</span>${s.mode === 'vs' ? `<span class="pill sm">${s.secs ? s.secs + 's timer' : 'No timer'}</span>` : ''}<span class="pill sm">${live.length} player${live.length > 1 ? 's' : ''}</span></div>`;
  }
}

/* play */
function renderFb() { const f = C.fb; $('fb').innerHTML = f ? f.html : ''; }
function renderOrders(v, q) {
  const cr = v.cr; const box = $('orders');
  const prev = box._sig || '';
  const sig = cr.sl.map(s => (s ? 1 : 0)).join('');
  box.innerHTML = `<h3>Captain’s orders</h3><div class="slots">${cr.ord.map((t, i) => {
    const s = cr.sl[i];
    if (s) { const a = q.answers[s[0]]; const p = pinfo(s[1], v); return `<div class="slot ${TCLS[t]}${prev[i] === '0' ? ' pop' : ''}"><span class="sn">${esc(TIERS[t].name)}</span><span class="sv">${esc(a.name)}</span><span class="by">${avatar(p.av)}<span>${esc(p.id === ME.id ? 'You' : p.nm)}</span></span></div>`; }
    const callers = v.pl.filter(p => cr.calls && cr.calls[p.id] === i);
    return `<button type="button" class="slot empty" data-slot="${i}">${tierPill(t)}<span class="q">?</span><span class="callers">${callers.map(p => avatar(p.av)).join('') || '<span class="hint" style="font-size:.74rem">Tap to call it</span>'}</span></button>`;
  }).join('')}</div>`;
  box._sig = sig;
}
function renderFeed(v, q) {
  const cr = v.cr;
  const drafts = v.pl.filter(p => p.id !== ME.id && cr.drafts && cr.drafts[p.id]).map(p => `<li class="draft">${avatar(p.av)}<span class="a">${esc(p.nm)}: “${esc(cr.drafts[p.id])}”</span><span class="r">typing</span></li>`);
  const kinds = { fill: 'Filled', miss: 'Wrong depth · strike', dup: 'Already in', gem: 'Kraken! +1 plank' };
  const log = (cr.log || []).slice().reverse().map(([pid, aid, k]) => { const p = pinfo(pid, v); const a = q.answers[aid]; return `<li class="${k}">${avatar(p.av)}<span class="a">${esc(a.name)}</span>${tierPill(a.tier)}<span class="r">${kinds[k]}</span></li>`; });
  $('feed').innerHTML = drafts.concat(log).join('') || '<li class="draft"><span class="a">Your crew’s answers show up here with their depth.</span></li>';
}

/* reveal */
function renderReveal(v) {
  const box = $('revealScr');
  const host = C.role === 'host' || C.role === 'solo';
  const key = v.q + ':' + v.r;
  if (C.revealKey !== key) { C.revealKey = key; box.innerHTML = v.set.mode === 'crew' ? crewRevealHTML(v) : vsRevealHTML(v); }
  const nb = $('nextBox');
  if (nb) {
    const last = v.r >= v.n - 1 || (v.cr && v.cr.lives <= 0);
    const sig = [host, last, v.set.secs].join('|');
    if (nb._sig !== sig) {
      nb._sig = sig;
      nb.innerHTML = host
        ? `<button class="btn big red" type="button" data-act="next">${last ? 'See results' : v.set.mode === 'crew' ? 'Next order' : 'Next round'}</button><p class="wait" id="autoNext"></p>`
        : `<p class="wait">Waiting for the host…</p><p class="wait" id="autoNext"></p>`;
    }
  }
  live();
}
function scoresHTML(v, withAns) {
  const q = QMAP[v.q];
  const rows = v.pl.filter(p => !p.spec).slice().sort((a, b) => b.pts - a.pts);
  return rows.map((p, i) => {
    const r = withAns && v.res ? v.res.find(x => x[0] === p.id) : null;
    let ans = '';
    if (r) ans = r[1] < 0 ? 'No answer' : (q.answers[r[1]].name + (r[3] ? ' · sunk' : ''));
    return `<li class="${i === 0 && p.pts > 0 ? 'lead' : ''} out" data-at="${withAns ? 900 + rows.length * 650 + i * 120 : i * 120}"><span class="rk">${i + 1}</span>${avatar(p.av)}<span class="nm"><b>${esc(p.nm)}${p.id === ME.id && !v.solo ? ' (you)' : ''}</b>${ans ? `<small>${esc(ans)}</small>` : ''}</span><span class="meta">${[r && r[2] ? '+' + M(r[2]) : '', p.tot && !v.solo ? `${M(p.tot + (v.ph === 'final' ? 0 : p.pts))} all-time` : ''].filter(Boolean).join(' · ')}</span><span class="pts">${M(p.pts)}</span></li>`;
  }).join('');
}
function vsRevealHTML(v) {
  const q = QMAP[v.q]; const res = v.res || [];
  const mine = res.find(r => r[0] === ME.id);
  const me = meIn(v);
  let stamp = '', t1 = '', t2 = '', sub = '';
  if (!mine) { t1 = 'You were'; t2 = 'watching'; sub = 'You’ll be in the next game'; }
  else if (mine[1] < 0) { stamp = '<span class="stamp">Eaten</span>'; t1 = 'The kraken'; t2 = 'ate you'; sub = 'No answer in time · +0 m'; }
  else if (mine[3]) { stamp = '<span class="stamp">Sunk</span>'; t1 = 'You got'; t2 = 'sunk'; sub = 'Someone else said ' + q.answers[mine[1]].name + ' · +0 m'; }
  else { const t = q.answers[mine[1]].tier; stamp = `<span class="stamp light ${TCLS[t]}">${esc(TIERS[t].name)}</span>`; t1 = t === 'x' ? 'You found' : 'You hit'; t2 = t === 'x' ? 'the kraken' : TIERS[t].name; sub = `+${M(mine[2])} deeper${v.r === v.n - 1 && res.length > 1 ? ' (doubled)' : ''}`; }
  const sorted = res.slice().sort((a, b) => (a[1] < 0 ? -1 : TIERS[q.answers[a[1]].tier].i) - (b[1] < 0 ? -1 : TIERS[q.answers[b[1]].tier].i));
  const at = {}; sorted.forEach((r, i) => (at[r[0]] = 600 + i * 650));
  const bands = TORDER.map(t => {
    const here = res.filter(r => r[1] >= 0 && q.answers[r[1]].tier === t);
    return `<div class="band ${TCLS[t]}"><div class="bl"><b>${esc(TIERS[t].name)}</b><span>${M(TIERS[t].pts)}</span></div><div class="who-in">${here.map(r => { const p = pinfo(r[0], v); return `<span class="diver out ${r[3] ? 'sunk' : ''}" data-at="${at[r[0]]}" data-tier="${TIERS[t].i}">${avatar(p.av)}<span>${esc(q.answers[r[1]].name)}</span></span>`; }).join('')}</div>${t === 'x' ? '<span class="eyes"><i></i><i></i></span>' : ''}</div>`;
  }).join('');
  const said = new Set(res.filter(r => r[1] >= 0).map(r => r[1]));
  const X = q.answers.find(a => a.tier === 'x');
  const deep = shuffled(q.answers.filter(a => (a.tier === 'f' || a.tier === 'r') && !said.has(a.id)), v.q + v.r).sort((a, b) => TIERS[b.tier].i - TIERS[a.tier].i).slice(0, 12);
  const leftN = q.answers.length - said.size;
  const doneAt = 600 + sorted.length * 650 + 200;
  return `<div class="rgrid">
    <div class="rleft">
      <div class="pills"><span class="pill red">${v.solo ? 'Prompt' : 'Round'} ${v.r + 1} of ${v.n} done</span><span class="pill k">${esc((CATINFO[q.cat] || ['Mix'])[0])}</span></div>
      <div class="mebig">${avatar(me ? me.av : ME.av)}${stamp}</div>
      <h1 class="rtitle"><span>${esc(t1)}</span><span class="hl">${esc(t2)}</span></h1>
      <p class="label rsub">${esc(sub)}</p>
      <h2 style="font-size:2rem">${v.solo ? 'Your dive' : 'How deep'}</h2>
      <ol class="scores">${scoresHTML(v, true)}</ol>
      <div class="nextbox" id="nextBox"></div>
      ${v.solo ? '' : `<div class="reacts" role="group" aria-label="React">${EMOS.map(e => `<button type="button" data-emo="${e}" aria-label="React ${e}">${e}</button>`).join('')}</div>`}
      <button class="lnk" type="button" data-act="leave">Leave</button>
    </div>
    <div class="rright">
      <div class="card depth"><h3>${esc(q.prompt)}</h3><div class="dcol">${bands}</div></div>
      <div class="card pick out" data-at="${doneAt}"><div class="label">The kraken’s pick</div><div class="gn">${esc(X.name)}</div><p>${esc(q.fact)}</p></div>
      <div class="card leftover out c" data-at="${doneAt + 300}"><div class="label">Deep ones nobody got · ${leftN} left</div><div class="chips">${deep.map(a => `<span class="chip">${esc(a.name)}</span>`).join('')}</div></div>
    </div>
  </div>`;
}
function crewRevealHTML(v) {
  const q = QMAP[v.q]; const cr = v.cr;
  const clear = cr.out === 'clear';
  const used = new Set(cr.used || []);
  const slots = cr.ord.map((t, i) => {
    const s = cr.sl[i];
    if (s) { const a = q.answers[s[0]]; const p = pinfo(s[1], v); return `<div class="slot ${TCLS[t]}"><span class="sn">${esc(TIERS[t].name)}</span><span class="sv">${esc(a.name)}</span><span class="by">${avatar(p.av)}<span>${esc(p.nm)}</span></span></div>`; }
    const eg = shuffled(q.answers.filter(a => a.tier === t && !used.has(a.id)), v.q + i).slice(0, 2).map(a => a.name).join(' · ');
    return `<div class="slot empty">${tierPill(t)}<span class="q">Missed</span><span class="eg">${esc(eg ? 'Could have been ' + eg : '')}</span></div>`;
  }).join('');
  const X = q.answers.find(a => a.tier === 'x');
  const contrib = {}; (cr.log || []).forEach(([pid, , k]) => { if (k === 'fill' || k === 'gem') contrib[pid] = (contrib[pid] || 0) + 1; });
  return `<div class="rgrid">
    <div class="rleft">
      <div class="pills"><span class="pill red">Order ${v.r + 1} of ${v.n}</span><span class="pill k">${esc((CATINFO[q.cat] || ['Mix'])[0])}</span></div>
      <h1 class="rtitle">${clear ? `<span>Order</span><span class="hl">filled</span>` : `<span>The kraken</span><span class="hl">took a plank</span>`}</h1>
      <p class="label rsub">${clear ? '★'.repeat(cr.rs) + '☆'.repeat(3 - cr.rs) + (cr.miss ? ` · ${cr.miss} wrong ${cr.miss > 1 ? 'depths' : 'depth'}` : ' · not one wrong depth') : `${cr.lives} ${cr.lives === 1 ? 'plank' : 'planks'} left`}</p>
      <div class="hull">${[...Array(Math.max(3, cr.lives)).keys()].map(i => `<i class="${i < cr.lives ? '' : 'off'}"></i>`).join('')}</div>
      <h2 style="font-size:2rem">The crew</h2>
      <ol class="scores">${v.pl.filter(p => !p.spec).map((p, i) => `<li class="out" data-at="${i * 120}"><span class="rk">${i + 1}</span>${avatar(p.av)}<span class="nm"><b>${esc(p.nm)}${p.id === ME.id ? ' (you)' : ''}</b></span><span class="meta"></span><span class="pts">${contrib[p.id] || 0} found</span></li>`).join('')}</ol>
      <div class="nextbox" id="nextBox"></div>
      <div class="reacts" role="group" aria-label="React">${EMOS.map(e => `<button type="button" data-emo="${e}" aria-label="React ${e}">${e}</button>`).join('')}</div>
      <button class="lnk" type="button" data-act="leave">Leave</button>
    </div>
    <div class="rright">
      <div class="card orders"><h3>${esc(q.prompt)}</h3><div class="slots">${slots}</div></div>
      <div class="card pick"><div class="label">${cr.gem ? 'You found the kraken’s pick' : 'The kraken’s pick'}</div><div class="gn">${esc(X.name)}</div><p>${esc(q.fact)}</p></div>
    </div>
  </div>`;
}

/* final */
function renderFinal(v) {
  const host = C.role === 'host' || C.role === 'solo';
  const sig = JSON.stringify([v.ph, v.code, v.n, host, v.pl.map(p => p.id + p.pts)]);
  if (C.finalSig === sig) return; C.finalSig = sig;
  const box = $('finalScr');
  let body = '';
  if (v.solo) body = soloFinal(v);
  else if (v.set.mode === 'crew') body = crewFinal(v);
  else body = vsFinal(v);
  const acts = v.solo
    ? `<button class="btn big red" type="button" data-act="again">Dive again</button><div class="links"><button class="lnk" type="button" data-act="share">Copy result</button><button class="lnk" type="button" data-act="leave">Home</button></div>`
    : host
      ? `<button class="btn big red" type="button" data-act="rematch">Play again</button><div class="links"><button class="lnk" type="button" data-act="lobby">Back to lobby</button><button class="lnk" type="button" data-act="share">Copy results</button><button class="lnk" type="button" data-act="leave">Leave</button></div>`
      : `<p class="wait">Waiting for the host…</p><div class="links"><button class="lnk" type="button" data-act="share">Copy results</button><button class="lnk" type="button" data-act="leave">Leave</button></div>`;
  box.innerHTML = `<div class="fin"><div class="mascot" id="finKraken">${ART.kraken()}</div>${body}<div class="nextbox">${acts}</div>${v.solo ? '' : `<div class="reacts">${EMOS.map(e => `<button type="button" data-emo="${e}" aria-label="React ${e}">${e}</button>`).join('')}</div>`}</div>`;
  ART.suckers(box.querySelector('.kraken'));
  box.querySelectorAll('.out').forEach(n => n.classList.remove('out'));
}
function vsFinal(v) {
  const rows = v.pl.filter(p => !p.spec).slice().sort((a, b) => b.pts - a.pts);
  const tie = rows[1] && rows[1].pts === rows[0].pts;
  const head = tie ? `<span>It’s a</span><span class="hl">tie</span>` : `<span>${esc(rows[0].nm)}</span><span class="hl">rules the deep</span>`;
  return `<h1 class="rtitle">${head}</h1><ol class="scores">${scoresHTML(v, false)}</ol>${awardsHTML(v)}`;
}
function awardsHTML(v) {
  const all = [];
  (v.hist || []).forEach(h => { const q = QMAP[h.q]; (h.res || []).forEach(([pid, aid, pts, sunk]) => { if (aid >= 0) all.push({ pid, q, a: q.answers[aid], pts, sunk }); }); });
  if (!all.length) return '';
  const cards = [];
  const best = all.filter(x => !x.sunk).sort((a, b) => TIERS[b.a.tier].i - TIERS[a.a.tier].i)[0];
  if (best) cards.push(['Deepest dive', `${pinfo(best.pid, v).nm}: ${best.a.name}`, `${TIERS[best.a.tier].name} · ${best.q.prompt}`]);
  const sc = {}; all.filter(x => x.sunk).forEach(x => (sc[x.pid] = (sc[x.pid] || 0) + 1));
  const st = Object.entries(sc).sort((a, b) => b[1] - a[1])[0];
  if (st) cards.push(['Most sunk', pinfo(st[0], v).nm, `${st[1]} answer${st[1] > 1 ? 's' : ''} matched someone else’s.`]);
  const sh = {}; all.filter(x => x.a.tier === 'c' || x.a.tier === 'h').forEach(x => (sh[x.pid] = (sh[x.pid] || 0) + 1));
  const s2 = Object.entries(sh).sort((a, b) => b[1] - a[1])[0];
  if (s2 && s2[1] >= 2) cards.push(['Stayed in the shallows', pinfo(s2[0], v).nm, `${s2[1]} Shallows or Fool’s gold answers.`]);
  const kr = all.filter(x => x.a.tier === 'x' && !x.sunk);
  if (kr.length && cards.length < 3) cards.push(['Kraken spotter', pinfo(kr[0].pid, v).nm, `Found ${kr[0].a.name}.`]);
  return `<div class="awards">${cards.slice(0, 3).map(c => `<div class="award"><span class="label">${esc(c[0])}</span><b>${esc(c[1])}</b><p>${esc(c[2])}</p></div>`).join('')}</div>`;
}
function crewFinal(v) {
  const cr = v.cr || { cl: 0, stars: 0, lives: 0, misses: 0 };
  const title = cr.cl === v.n ? 'Legendary crew' : cr.cl >= v.n - 2 ? 'Seasoned crew' : cr.cl >= Math.ceil(v.n / 2) ? 'Decent haul' : 'Walk the plank';
  const log = (v.hist || []).map(h => `<li><span>${esc(QMAP[h.q].prompt)}</span><b>${h.out === 'clear' ? '★'.repeat(h.rs) + '☆'.repeat(3 - h.rs) : 'Missed'}${h.gem ? ' · Kraken' : ''}</b></li>`).join('');
  return `<h1 class="rtitle"><span>${cr.cl} of ${v.n}</span><span class="hl">orders filled</span></h1><p class="label rsub">${esc(title)} · ${cr.stars}★ · ${cr.lives} ${cr.lives === 1 ? 'plank' : 'planks'} left</p><ul class="runlog">${log}</ul>`;
}
function soloFinal(v) {
  const me = meIn(v); const pts = me ? me.pts : 0; const max = v.n * 100;
  const title = pts >= max * 0.74 ? 'Kraken whisperer' : pts >= max * 0.57 ? 'Abyss diver' : pts >= max * 0.4 ? 'Open-water swimmer' : pts >= max * 0.23 ? 'Paddling' : 'Stuck in the shallows';
  const cells = (v.hist || []).map(h => { const r = h.res && h.res[0]; return r && r[1] >= 0 ? `<i class="${TCLS[QMAP[h.q].answers[r[1]].tier]}"></i>` : '<i style="background:transparent"></i>'; }).join('');
  const log = (v.hist || []).map(h => { const q = QMAP[h.q]; const r = h.res && h.res[0]; return `<li><span>${esc(q.prompt)}</span><b>${r && r[1] >= 0 ? esc(q.answers[r[1]].name) + ' · ' + M(r[2]) : 'Eaten · 0 m'}</b></li>`; }).join('');
  return `<h1 class="rtitle"><span>${M(pts)}</span><span class="hl">${esc(title)}</span></h1><p class="label rsub">Out of a possible ${M(max)}</p><div class="cells">${cells}</div><ul class="runlog">${log}</ul>`;
}
function shareText() {
  const v = C.view; if (!v) return '';
  const sq = { c: '⬜', h: '🟨', o: '🟩', r: '🟦', f: '🟪', x: '🟥' };
  if (v.solo) { const me = meIn(v); return `Kraken · ${M(me ? me.pts : 0)}\n` + (v.hist || []).map(h => { const r = h.res && h.res[0]; return r && r[1] >= 0 ? sq[QMAP[h.q].answers[r[1]].tier] : '⬛'; }).join(''); }
  if (v.set.mode === 'crew') return `Kraken · crew · ${v.cr ? v.cr.cl : 0}/${v.n} orders · ${v.cr ? v.cr.stars : 0}★`;
  return 'Kraken · versus\n' + v.pl.filter(p => !p.spec).slice().sort((a, b) => b.pts - a.pts).map((p, i) => `${i + 1}. ${p.nm} ${M(p.pts)}`).join('\n');
}

/* ───────── per-frame: timers, rising kraken, staged reveal ───────── */
function live() {
  const v = C.view; if (!v) return;
  const t = pnow();
  if (v.ph === 'play') {
    const timed = v.rem >= 0;
    const left = timed ? Math.max(0, C.deadline - t) : 1e9, inIntro = t < C.introUntil;
    $('num').hidden = !timed; $('fuseW').hidden = !timed;
    const total = Math.max(1, v.dur);
    const frac = inIntro ? 1 : Math.min(1, left / total);
    const sec = Math.ceil(left / 1000);
    const ntxt = inIntro ? 'Ready' : String(sec);
    if ($('num')._t !== ntxt) { $('num')._t = ntxt; $('num').innerHTML = `<span>${ntxt}</span>`; }
    $('fill').style.transform = `scaleX(${frac})`;
    const panic = timed && !inIntro && left > 0 && left <= 3500;
    $('playScr').classList.toggle('panic', panic);
    document.body.classList.toggle('panic', panic);
    if (timed && !inIntro && sec <= 5 && sec > 0 && sec !== C.lastTickSec) { C.lastTickSec = sec; if (sec <= 3) vib(25); }
    const me = meIn(v);
    const can = !inIntro && left > 0 && me && !me.spec && (v.set.mode === 'crew' || !C.myLock);
    const inp = $('ans');
    if (inp.disabled === !!can) { inp.disabled = !can; $('ansB').disabled = !can; if (can && !matchMedia('(pointer: coarse)').matches) inp.focus(); }
    if (inIntro) inp.placeholder = 'descending…'; else inp.placeholder = v.set.mode === 'crew' ? 'answer for the crew…' : 'type one answer…';
  } else {
    document.body.classList.remove('panic');
  }
  if ((v.ph === 'play' || v.ph === 'reveal') && document.body.dataset.scr === 'play') dvFrame(v, t);
}
(function frame() { try { live(); } catch (e) { console.error(e); } requestAnimationFrame(frame); })();

/* ═════════════════ EVENTS ═════════════════ */
function setTheme(id) {
  const th = THEMES.find(x => x.id === id) || THEMES[0];
  document.documentElement.dataset.theme = th.id;
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', th.bg);
  LS.set('theme', th.id);
  document.querySelectorAll('#themes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.th === th.id)));
}
function renderSnd() {}
function toggleSnd() {}
async function copy(text, ok) { try { await navigator.clipboard.writeText(text); toast(ok, 'ok'); } catch { toast(text); } }
function inviteLink() { return location.origin + location.pathname + buildQ(C.code); }
function confirmLeave() {
  const v = C.view;
  if (C.role === 'solo' || !v || v.ph === 'final') { leave(); return; }
  $('leaveP').textContent = C.role === 'host' ? 'You’re the host. Leaving closes the lobby for everyone.' : 'You’ll leave this lobby. You can rejoin with the code.';
  $('leaveM').hidden = false; $('leaveYes').focus();
}
function bind() {
  $('themes').innerHTML = THEMES.map(t => `<button type="button" data-th="${t.id}" style="--sw:${t.bg}" aria-label="${t.n} theme"></button>`).join('');
  $('themes').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setTheme(b.dataset.th); });
  setTheme(LS.get('theme', 'deep'));
  renderSnd();
  document.addEventListener('pointerdown', () => SFX.unlock(), { once: true });
  $('nm').addEventListener('input', (e) => { ME.name = cleanName(e.target.value); LS.set('name', e.target.value.trim() ? ME.name : ''); });
  $('avs').addEventListener('click', (e) => { const b = e.target.closest('.avb'); if (!b) return; ME.av = b.dataset.av; LS.set('av', ME.av); renderHome(); SFX.bubble(); });
  $('create').addEventListener('click', createLobby);
  $('practice').addEventListener('click', practice);
  $('joinF').addEventListener('submit', (e) => { e.preventDefault(); joinLobby($('code').value, false); });
  $('code').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4); });
  $('rejoin').addEventListener('click', () => { const rj = SS.get('rj', null) || LS.get('rj', null); if (!rj) return; if (rj.id) { ME.id = rj.id; SS.set('id', ME.id); } if (!$('nm').value.trim()) $('nm').value = ME.name || 'Player'; joinLobby(rj.code, true); });
  $('how').addEventListener('click', () => { $('howM').hidden = false; $('howX').focus(); });
  $('mrJoin').addEventListener('submit', (e) => { e.preventDefault(); joinLobby($('mrCode').value, false); });
  $('mrCode').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4); });
  $('nm2').addEventListener('input', (e) => { if (e.target.value.trim()) setMe(e.target.value, null); });
  $('avs2').addEventListener('click', (e) => { const b = e.target.closest('.avb'); if (!b) return; setMe(null, b.dataset.av); SFX.bubble(); });
  $('meRnd').addEventListener('click', () => { const n = randName(); $('nm2').value = n; setMe(n, randAv()); SFX.bubble(); });
  $('meX').addEventListener('click', () => ($('meM').hidden = true));
  $('howX').addEventListener('click', () => ($('howM').hidden = true));
  $('busyX').addEventListener('click', () => { clearRejoin(); teardown(); setUrl(''); render(); });
  $('leaveNo').addEventListener('click', () => ($('leaveM').hidden = true));
  $('leaveYes').addEventListener('click', () => { $('leaveM').hidden = true; leave(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && C.view && C.view.ph === 'reveal' && H && !$('land').hidden && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); nextRound(); }
  });
  window.addEventListener('resize', () => { DV.built = false; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { $('howM').hidden = true; $('leaveM').hidden = true; $('meM').hidden = true; } });
  ['howM', 'leaveM', 'meM'].forEach(id => $(id).addEventListener('click', (e) => { if (e.target.id === id) $(id).hidden = true; }));
  $('share').addEventListener('click', async () => {
    const url = inviteLink();
    if (navigator.share && matchMedia('(pointer: coarse)').matches) { try { await navigator.share({ title: 'Kraken', text: 'Join my Kraken lobby: ' + C.code, url }); return; } catch {} }
    copy(url, 'Invite link copied');
  });
  $('rtot').addEventListener('click', () => { if (!H) return; H.tot = {}; LS.set('tot', {}); H.dirty = true; toast('Scores reset', 'ok'); });
  $('plist').addEventListener('click', (e) => { const b = e.target.closest('[data-kick]'); if (!b || !H) return; const id = b.dataset.kick; H.banned.add(id); H.players = H.players.filter(p => p.id !== id); direct(id, { t: 'err', msg: 'The host removed you from this lobby.' }); H.dirty = true; broadcast(); });
  $('setup').addEventListener('click', (e) => {
    if (!H) return;
    const mb = e.target.closest('[data-mode]'); if (mb) { H.set.mode = mb.dataset.mode; H.dirty = true; broadcast(); return; }
    const sb = e.target.closest('.seg button'); if (sb) { const k = sb.parentElement.dataset.set; H.set[k] = +sb.dataset.v; H.dirty = true; broadcast(); return; }
    const tb = e.target.closest('[data-topic]');
    if (tb) {
      const k = tb.dataset.topic; const s = new Set(H.set.topics);
      if (!k) s.clear(); else s.has(k) ? s.delete(k) : s.add(k);
      H.set.topics = s.size === Object.keys(CATINFO).length ? [] : [...s];
      H.dirty = true; broadcast();
    }
  });
  $('start').addEventListener('click', () => { if (H && H.phase === 'lobby') startGame(); });
  $('ansF').addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  $('ans').addEventListener('input', () => { if (C.fb && C.fb.kind === 'no') { C.fb = null; renderFb(); } onTyping(); });
  $('orders').addEventListener('click', (e) => { const b = e.target.closest('button.slot'); if (!b) return; const i = +b.dataset.slot; const v = C.view; const cur = v && v.cr && v.cr.calls ? v.cr.calls[ME.id] : null; send('call', { slot: cur === i ? null : i }); });
  document.addEventListener('click', (e) => {
    const em = e.target.closest('[data-emo]'); if (em) { if (C.role && C.role !== 'solo') { send('emo', { e: em.dataset.emo }); } return; }
    const sb = e.target.closest('#nextBox .seg button'); if (sb && H) { H.set.secs = +sb.dataset.v; H.dirty = true; broadcast(); $('nextBox')._sig = ''; renderReveal(C.view); return; }
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'leave') confirmLeave();
    if (act === 'next' && H) nextRound();
    if (act === 'force' && H) forceReveal();
    if (act === 'friends') createLobby();
    if (act === 'me') openMe();
    if (act === 'howto') { $('howM').hidden = false; $('howX').focus(); }
    if (act === 'joinopen') { $('mprail').classList.toggle('jo'); if ($('mprail').classList.contains('jo')) $('mrCode').focus(); }
    if (act === 'rematch' && H) { startGame(); }
    if (act === 'lobby' && H) backToLobby();
    if (act === 'again') practice();
    if (act === 'share') copy(shareText(), 'Results copied');
  });
  window.addEventListener('resize', () => {});
}

/* ═════════════════ BOOT ═════════════════ */
function boot() {
  try { const fav = 'data:image/svg+xml,' + encodeURIComponent(ART.mark); $('favicon').setAttribute('href', fav); } catch {}
  bind(); renderHome(); buildOcean(); render();
  const params = new URLSearchParams(location.search);
  const j = (params.get('join') || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const srj = SS.get('rj', null);
  if (srj && srj.code && (!j || j === srj.code) && now() - srj.at < 3 * 3600e3) { if (srj.id) { ME.id = srj.id; SS.set('id', ME.id); } joinLobby(srj.code, true); return; }
  if (j.length === 4) {
    $('code').value = j;
    joinLobby(j, false);
    return;
  }
  practice();
}
function buildOcean() {
  const b = $('oBub'); if (!b || b.firstChild) return;
  for (let i = 0; i < 16; i++) {
    const e = document.createElement('i'); const sz = 6 + Math.random() * 22;
    e.style.cssText = `left:${Math.random() * 100}%;width:${sz}px;height:${sz}px;--dx:${Math.round((Math.random() - 0.5) * 90)}px;animation-duration:${9 + Math.random() * 12}s;animation-delay:-${(Math.random() * 20).toFixed(1)}s`;
    b.appendChild(e);
  }
  const k = (d) => `<path class="kb" d="${d}"/><path class="kf" d="${d}"/>`;
  const strands = ['M34 440 C 14 370 62 330 40 262 C 22 204 64 160 44 92 C 40 70 50 50 44 30', 'M84 440 C 104 382 64 340 88 280 C 108 230 74 190 94 140 C 100 124 96 112 92 100', 'M122 440 C 112 400 138 368 120 326 C 110 300 126 284 120 262'];
  document.querySelectorAll('.o-kelp').forEach((svg, n) => { svg.innerHTML = `<g>${strands.map(k).join('')}</g>`; svg.querySelector('g').style.animationDelay = `-${n * 2.3}s`; });
}
boot();
})();
