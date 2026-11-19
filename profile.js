/* Kraken profile: lifetime stats tied to your network's public IP, so any device on the same connection shares them.
   The IP is never stored or sent: it's hashed (SHA-256 with a salt) into an id. Stats live in this browser and are
   mirrored as a retained message on the public relays, keyed by that id. */
const PROFILE = (() => {
  const KEY = 'kr_profile', SALT = 'kraken-deep-salt-v1';
  const blank = () => ({ games: 0, total: 0, best: 0, krakens: 0, rounds: 0, at: 0 });
  let st = blank(), id = null, hub = null; const subs = [];
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s.games === 'number') st = Object.assign(blank(), s); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} };
  const emit = () => subs.forEach(f => { try { f(st); } catch {} });
  const topic = () => NET.NS + 'prof/' + id;
  /* keep the record that has seen more games; on a tie, the newer one */
  const merge = (r) => {
    if (!r || typeof r.games !== 'number') return;
    if (r.games > st.games || (r.games === st.games && (r.at || 0) > st.at)) { st = Object.assign(blank(), r); save(); emit(); }
    else if (st.games > r.games && hub) hub.pub(topic(), st, 1, true);
  };
  async function init() {
    try {
      const ctl = new AbortController(); setTimeout(() => ctl.abort(), 5000);
      const ip = (await (await fetch('https://api.ipify.org?format=json', { signal: ctl.signal })).json()).ip;
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(SALT + ip));
      id = [...new Uint8Array(buf)].slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch { return; } // offline or blocked: stats stay on this device only
    hub = new NET.Hub([NET.NS + 'prof/' + id], (t, m) => merge(m));
    hub.onUp = () => { if (st.games) setTimeout(() => hub && hub.pub(topic(), st, 1, true), 1500); };
    hub.connect();
  }
  function record(pts, krakens, rounds) { /* pts: game units (×10 = metres) */
    st.games++; st.total += pts; st.best = Math.max(st.best, pts); st.krakens += krakens; st.rounds += rounds; st.at = Date.now();
    save(); emit(); if (hub) hub.pub(topic(), st, 1, true);
  }
  const avg = () => (st.games ? Math.round(st.total / st.games) : 0);
  setTimeout(init, 1200);
  return { record, get: () => st, avg, on: (f) => subs.push(f), linked: () => !!id, hubUp: () => (hub ? hub.up() : 0) };
})();
