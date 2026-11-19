/* ───────── Outlier engine: tiers, parsing, matching, orders (pure; runs in browser and node) ───────── */
const TIERS = {
  c: { key: 'c', name: 'Shallows',    pts: 10,  i: 0, line: 'Everyone’s first thought.' },
  h: { key: 'h', name: 'Fool’s gold', pts: 15,  i: 1, line: 'Looks rare. Everyone picks it.' },
  o: { key: 'o', name: 'Open sea',    pts: 30,  i: 2, line: 'A step off the beaten path.' },
  r: { key: 'r', name: 'Deep water',  pts: 60,  i: 3, line: 'Few people get down here.' },
  f: { key: 'f', name: 'The abyss',   pts: 85,  i: 4, line: 'Proper deep knowledge.' },
  x: { key: 'x', name: 'Kraken',      pts: 100, i: 5, line: 'The one the kraken wanted.' },
};
const TORDER = ['c', 'h', 'o', 'r', 'f', 'x'];
const CATS = {
  geo: 'Geography', food: 'Food & drink', screen: 'Film & TV', music: 'Music',
  sport: 'Sport', games: 'Gaming', sci: 'Science & nature', words: 'Words & culture', sea: 'High seas', brands: 'Brands',
};

function normText(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\+\+/g, 'pp').replace(/#/g, 'sharp')
    .replace(/&/g, ' and ')
    .replace(/[’'`´".!?]/g, '')
    .replace(/[^a-z0-9*]+/g, ' ')
    .trim()
    .replace(/^(the|a|an) /, '')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\bmount\b/g, 'mt');
}
function keyOf(s) { return normText(s).replace(/[ *]/g, ''); }
function singular(k) {
  if (k.length > 4 && k.endsWith('es') && /(ch|sh|x|ss)es$/.test(k)) return k.slice(0, -2);
  if (k.length > 4 && k.endsWith('s') && !k.endsWith('ss')) return k.slice(0, -1);
  return k;
}

function parseQuestion(src) {
  const q = { id: src.id, cat: src.cat, prompt: src.q, fact: src.fact || '', answers: [], idx: new Map(), loose: new Map(), sur: new Map(), no: new Map(), counts: {} };
  TORDER.forEach(t => (q.counts[t] = 0));
  const addIdx = (map, k, v) => { if (!k) return; if (!map.has(k)) map.set(k, new Set()); map.get(k).add(v); };
  for (const line of src.a.split('\n')) {
    const m = line.match(/^([CHORFX]):\s*(.*)$/);
    if (!m) continue;
    const t0 = m[1].toLowerCase(); let pos = 0;
    for (const raw of m[2].split(',')) {
      const item = raw.trim();
      if (!item) continue;
      /* only the six most obvious answers count as common; the rest of that list is "decent" */
      const t = t0 === 'c' && pos++ >= 6 ? 'o' : t0;
      const names = item.split('/').map(s => s.trim()).filter(Boolean);
      const id = q.answers.length;
      q.answers.push({ id, name: names[0], tier: t });
      q.counts[t]++;
      for (const n of names) {
        const variants = [n];
        const noParen = n.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
        if (noParen && noParen !== n) variants.push(noParen);
        const noSub = n.includes(':') ? n.split(':').slice(1).join(':').trim() : '';
        if (noSub && noSub.length > 4) variants.push(noSub);
        if (src.strip) { for (const v of variants.slice()) { const s = normText(v).split(' ').filter(w => !src.strip.includes(w)).join(' '); if (s && s !== normText(v)) variants.push(s); } }
        for (const v of variants) { const k = keyOf(v); addIdx(q.idx, k, id); addIdx(q.loose, singular(k), id); }
      }
      if (src.ppl) {
        const words = normText(names[0]).split(' ');
        if (words.length >= 2) addIdx(q.sur, words[words.length - 1], id);
      }
    }
  }
  if (src.no) {
    for (const part of src.no.split(/;\s*/)) {
      const at = part.indexOf(': ');
      if (at < 0) continue;
      const reason = part.slice(at + 2).trim();
      for (const n of part.slice(0, at).split('/')) {
        const vs = [n];
        if (src.strip) { const s = normText(n).split(' ').filter(w => !src.strip.includes(w)).join(' '); if (s) vs.push(s); }
        for (const v of vs) { const k = keyOf(v); if (k && !q.idx.has(k)) { q.no.set(k, reason); q.no.set(singular(k), reason); } }
      }
    }
  }
  q.keys = [...q.idx.keys()];
  q.noKeys = [...q.no.keys()];
  return q;
}

function dlDist(a, b, max) {
  const al = a.length, bl = b.length;
  if (Math.abs(al - bl) > max) return max + 1;
  let prev2 = null, prev = Array.from({ length: bl + 1 }, (_, j) => j);
  for (let i = 1; i <= al; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev; prev = cur;
  }
  return prev[bl];
}
function fuzzBudget(len) { return len < 5 ? 0 : len < 8 ? 1 : len < 12 ? 2 : 3; }

/* Returns {ok:true,id,tier,name,fuzzy} | {ok:false, kind:'empty'|'decoy'|'ambiguous'|'unknown', msg} */
function matchAnswer(q, input) {
  const k = keyOf(input);
  if (!k) return { ok: false, kind: 'empty', msg: '' };
  const hit = (set, fuzzy) => {
    if (set.size === 1) { const a = q.answers[[...set][0]]; return { ok: true, id: a.id, tier: a.tier, name: a.name, fuzzy: !!fuzzy }; }
    return { ok: false, kind: 'ambiguous', msg: 'More than one answer fits that. Be more specific.' };
  };
  if (q.idx.has(k)) return hit(q.idx.get(k));
  const s = singular(k);
  if (q.idx.has(s)) return hit(q.idx.get(s));
  if (q.loose.has(k)) return hit(q.loose.get(k));
  if (q.loose.has(s)) return hit(q.loose.get(s));
  if (q.no.has(k)) return { ok: false, kind: 'decoy', msg: q.no.get(k) };
  if (q.no.has(s)) return { ok: false, kind: 'decoy', msg: q.no.get(s) };
  const words = normText(input).split(' ');
  if (q.sur.size && words.length === 1 && q.sur.has(k)) {
    const set = q.sur.get(k);
    if (set.size === 1) return hit(set);
    return { ok: false, kind: 'ambiguous', msg: 'More than one answer has that name. Add a first name.' };
  }
  const budget = fuzzBudget(k.length);
  if (budget > 0) {
    const digits = (x) => x.replace(/[^0-9]/g, '');
    const kd = digits(k);
    let best = 99, found = [];
    const consider = (cand, val) => {
      const b = fuzzBudget(Math.min(k.length, cand.length));
      if (!b) return;
      if (cand[0] !== k[0] && b < 2) return;
      if (digits(cand) !== kd) return;
      const d = dlDist(k, cand, Math.min(b, best));
      if (d > b) return;
      if (d < best) { best = d; found = [val]; } else if (d === best) found.push(val);
    };
    for (const cand of q.keys) consider(cand, { type: 'a', set: q.idx.get(cand) });
    for (const [cand, set] of q.sur) if (set.size === 1) consider(cand, { type: 'a', set });
    for (const cand of q.noKeys) consider(cand, { type: 'n', msg: q.no.get(cand) });
    if (found.length) {
      const ids = new Set(); let decoy = null;
      for (const f of found) { if (f.type === 'a') f.set.forEach(i => ids.add(i)); else decoy = f.msg; }
      if (ids.size === 1 && !decoy) return hit(ids, true);
      if (!ids.size && decoy) return { ok: false, kind: 'decoy', msg: decoy };
    }
  }
  return { ok: false, kind: 'unknown', msg: 'Not on our list. Check the spelling or try another.' };
}

/* Seeded RNG for deterministic choices */
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = hashStr(String(seed)) || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* Co-op order: which tiers the team must hit this round */
const ORDER_SIZES = [3, 3, 4, 4, 4, 5, 5];
const ORDER_W = { c: [3, 2, 2, 1, 1, 1, 1], h: [0, 1, 1, 1, 1, 1, 1], o: [3, 3, 2, 2, 2, 2, 2], r: [2, 2, 3, 3, 3, 3, 3], f: [0, 0, 1, 1, 2, 2, 3] };
function makeOrder(q, round, players, seed) {
  const R = rng(seed + ':' + q.id + ':' + round);
  const r = Math.min(round, 6);
  let size = ORDER_SIZES[r] + (players >= 4 ? 1 : 0);
  const left = {}; ['c', 'h', 'o', 'r', 'f'].forEach(t => (left[t] = q.counts[t]));
  const out = [];
  const pick = (allowed) => {
    const pool = allowed.filter(t => left[t] > 0 && ORDER_W[t][r] > 0);
    if (!pool.length) return null;
    const tot = pool.reduce((s, t) => s + ORDER_W[t][r], 0);
    let x = R() * tot;
    for (const t of pool) { x -= ORDER_W[t][r]; if (x <= 0) return t; }
    return pool[pool.length - 1];
  };
  const deep = pick(['r', 'f']) || pick(['o']);
  if (deep) { out.push(deep); left[deep]--; }
  while (out.length < size) {
    const t = pick(['c', 'h', 'o', 'r', 'f']);
    if (!t) break;
    out.push(t); left[t]--;
  }
  return out.sort((a, b) => TIERS[a].i - TIERS[b].i);
}
function coopDuration(slots) { return (20 + 13 * slots) * 1000; }

function pickQuestions(bank, cats, n, mode, avoid, seed) {
  const R = rng(seed);
  let pool = bank.filter(q => !cats || !cats.length || cats.includes(q.cat));
  if (mode === 'coop') { const rich = pool.filter(q => q.counts.c >= 2 && q.counts.o >= 3 && q.counts.r >= 2); if (rich.length >= n) pool = rich; }
  const fresh = pool.filter(q => !avoid.includes(q.id));
  if (fresh.length >= n) pool = fresh;
  pool = pool.slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const out = [];
  while (out.length < n && pool.length) {
    let idx = pool.findIndex(q => !out.length || q.cat !== out[out.length - 1].cat);
    if (idx < 0) idx = 0;
    out.push(pool.splice(idx, 1)[0]);
  }
  return out.map(q => q.id);
}

if (typeof module !== 'undefined') module.exports = { TIERS, TORDER, CATS, normText, keyOf, parseQuestion, matchAnswer, makeOrder, coopDuration, pickQuestions, rng, hashStr, dlDist };
