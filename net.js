/* Kraken networking. No server of our own: browsers meet on public MQTT relays.
   The host's browser holds the game. Everyone else sends intents and renders the host's state. */
const NET = (() => {
  const RELAYS = [
    { url: 'wss://broker.hivemq.com:8884/mqtt' },
    { url: 'wss://test.mosquitto.org:8081/mqtt' },
    { url: 'wss://broker.emqx.io:8084/mqtt' },
    { url: 'wss://broker-cn.emqx.io:8084/mqtt' },
    { url: 'wss://public.cloud.shiftr.io:443', username: 'public', password: 'public' }, // port 443 gets through VPNs and strict networks
  ];
  const NS = 'krakengame/v1/';
  /* local testing only: ?relay=ws://localhost:PORT on a localhost page */
  function relays() {
    try {
      const p = new URLSearchParams(location.search).get('relay');
      if (p && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return [{ url: p }];
    } catch {}
    return RELAYS;
  }
  const rid = (n) => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };

  /* A Hub is one connection per relay, all subscribed to the same topics. */
  class Hub {
    constructor(subs, onMsg) { this.subs = subs; this.onMsg = onMsg; this.clients = []; this.onUp = null; this.dead = false; }
    connect() {
      if (typeof mqtt === 'undefined') return;
      for (const r of relays()) {
        let c;
        try {
          c = mqtt.connect(r.url, { clean: true, connectTimeout: 8000, reconnectPeriod: 2500, keepalive: 30, clientId: 'kr_' + rid(12), username: r.username, password: r.password, protocolVersion: 4 });
        } catch { continue; }
        c._relay = r.url;
        c.on('connect', () => { if (this.dead) return; c.subscribe(this.subs, { qos: 1 }, () => { this.onUp && this.onUp(c); }); });
        c.on('message', (topic, buf) => { if (this.dead) return; let m; try { m = JSON.parse(buf.toString()); } catch { return; } if (m && typeof m === 'object') this.onMsg(topic, m, c); });
        c.on('error', () => {});
        this.clients.push(c);
      }
    }
    pub(topic, obj, qos = 0) {
      const s = JSON.stringify(obj);
      for (const c of this.clients) { if (c.connected) { try { c.publish(topic, s, { qos }); } catch {} } }
    }
    up() { return this.clients.filter(c => c.connected).length; }
    keepOnly(keep) { for (const c of this.clients) if (c !== keep) { try { c.end(true); } catch {} } this.clients = [keep]; }
    end() { this.dead = true; for (const c of this.clients) { try { c.end(true); } catch {} } this.clients = []; }
  }
  return { Hub, NS, rid, relays };
})();
