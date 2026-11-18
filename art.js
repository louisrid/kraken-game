/* Kraken art: the mascot, the crew of characters and topic icons. All line art in the same 3px-outline style. */
const ART = (() => {
  /* ── the kraken ── */
  function blob(cx, cy, r, bumps, wob, seed) {
    let s = seed;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const pts = [];
    for (let i = 0; i < bumps; i++) {
      const a = (i / bumps) * Math.PI * 2;
      const rr = r * (1 + (rnd() - 0.5) * wob);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    let d = '';
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i - 1 + pts.length) % pts.length], p1 = pts[i], p2 = pts[(i + 1) % pts.length], p3 = pts[(i + 2) % pts.length];
      if (!i) d += `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  }
  const TENTS = [
    'M150 238 C118 272 70 268 78 318 C85 354 132 352 122 322',
    'M178 248 C168 300 140 330 164 356 C184 374 208 352 192 338',
    'M222 248 C232 300 260 330 236 356 C216 374 192 352 208 338',
    'M250 238 C282 272 330 268 322 318 C315 354 268 352 278 322',
    'M134 214 C96 216 58 192 54 152 C52 124 82 116 90 140',
    'M266 214 C304 216 342 192 346 152 C348 124 318 116 310 140',
  ];
  function kraken(opts = {}) {
    const ink = blob(200, 205, 150, 14, 0.22, 7);
    const drops = [[62, 92, 11], [344, 80, 8], [356, 300, 12], [42, 290, 7], [300, 372, 9]];
    const tent = TENTS.map(d => `<path d="${d}" class="kt-o"/>`).join('') + TENTS.map(d => `<path d="${d}" class="kt-i"/>`).join('');
    return `<svg class="kraken${opts.cls ? ' ' + opts.cls : ''}" viewBox="0 0 400 400" aria-hidden="true">
      <g class="k-ink"><path d="${ink}"/>${drops.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <g class="k-tent">${tent}<g class="k-suck"></g></g>
      <g class="k-body">
        <path class="k-mantle" d="M108 200 C102 108 150 58 200 58 C250 58 298 108 292 200 C290 238 250 252 200 252 C150 252 110 238 108 200 Z"/>
        <ellipse class="k-shine" cx="150" cy="118" rx="22" ry="11" transform="rotate(-38 150 118)"/>
        <g class="k-face">
          <path class="k-eye" d="M138 160 L190 178 L186 206 C168 212 146 206 140 190 Z"/>
          <path class="k-eye" d="M262 160 L210 178 L214 206 C232 212 254 206 260 190 Z"/>
          <circle class="k-pupil" cx="171" cy="192" r="9"/><circle class="k-pupil" cx="229" cy="192" r="9"/>
          <path class="k-brow" d="M128 146 L194 170"/><path class="k-brow" d="M272 146 L206 170"/>
          <path class="k-mouth" d="M164 226 Q200 244 236 226"/>
          <path class="k-fang" d="M178 232 l5 10 l5 -8 z"/><path class="k-fang" d="M222 232 l-5 10 l-5 -8 z"/>
        </g>
        <g class="k-hat">
          <path d="M92 104 C126 62 168 76 200 44 C232 76 274 62 308 104 C272 96 240 104 200 96 C160 104 128 96 92 104 Z"/>
          <circle class="k-skull" cx="200" cy="74" r="10"/>
          <path class="k-bones" d="M186 90 L214 98 M214 90 L186 98"/>
          <circle class="k-socket" cx="196.5" cy="73" r="2.6"/><circle class="k-socket" cx="203.5" cy="73" r="2.6"/>
        </g>
      </g>
    </svg>`;
  }
  /* suckers placed along each tentacle once the SVG is in the page */
  function suckers(svg) {
    const g = svg.querySelector('.k-suck'); if (!g || g.childNodes.length) return;
    const paths = svg.querySelectorAll('.kt-i');
    let html = '';
    paths.forEach((p, idx) => {
      const L = p.getTotalLength();
      for (let t = 0.32; t < 0.95; t += 0.15) {
        const a = p.getPointAtLength(L * t), b = p.getPointAtLength(Math.min(L, L * t + 1));
        const nx = -(b.y - a.y), ny = b.x - a.x, n = Math.hypot(nx, ny) || 1;
        const side = idx % 2 ? 1 : -1;
        html += `<circle cx="${(a.x + side * nx / n * 5).toFixed(1)}" cy="${(a.y + side * ny / n * 5).toFixed(1)}" r="${(5.2 - t * 2.2).toFixed(1)}"/>`;
      }
    });
    g.innerHTML = html;
  }

  /* ── characters (48×48) ── */
  const AV = {
    pirate: `<circle class="w" cx="24" cy="27" r="13"/><path class="r" d="M10.6 22.4C11.6 14.2 17.4 9.6 24 9.6s12.4 4.6 13.4 12.8c-4-1.5-8.6-2.3-13.4-2.3s-9.4.8-13.4 2.3z"/><path d="M37 21.6l4.4-2.8M37.4 22.8l3.8 3.2"/><path d="M12 26.6l24-2.6"/><ellipse class="k" cx="29.6" cy="27.6" rx="4.2" ry="3.7"/><circle class="k" cx="18.8" cy="28.2" r="1.8"/><path d="M19.6 33.6c2.6 2 6.6 2 9.2-.4"/>`,
    skull: `<path class="w" d="M24 8.6c-8 0-13 5.6-13 12.8 0 4.2 1.8 7.2 4.6 9v4.4c0 1.4 1.1 2.6 2.5 2.6h11.8c1.4 0 2.5-1.2 2.5-2.6v-4.4c2.8-1.8 4.6-4.8 4.6-9 0-7.2-5-12.8-13-12.8z"/><circle class="k" cx="19" cy="22" r="3.4"/><circle class="k" cx="29" cy="22" r="3.4"/><path class="k" d="M24 26.4l-2.1 3.4h4.2z"/><path d="M20.6 33v4.4M24 33v4.4M27.4 33v4.4"/>`,
    parrot: `<path class="r" d="M24 40c-7.7 0-13-5.6-13-13.6C11 17.6 16.6 9 24 9s13 8.6 13 17.4C37 34.4 31.7 40 24 40z"/><path class="w" d="M20 25.5c0-3.4 1.8-5.4 4-5.4s4 2 4 5.4c0 3.6-2 6.5-4 8.5-2-2-4-4.9-4-8.5z"/><path d="M24 26.5v5"/><circle class="w" cx="17.5" cy="19.5" r="3.3"/><circle class="w" cx="30.5" cy="19.5" r="3.3"/><circle class="k" cx="17.9" cy="19.8" r="1.4"/><circle class="k" cx="30.1" cy="19.8" r="1.4"/><path d="M20 9.8c1-2.6 2.6-4 4-4.6M28 9.8c-1-2.6-2.6-4-4-4.6"/>`,
    shark: `<path class="w" d="M19.6 16.4L25.6 6l3.6 10.8"/><path class="w" d="M10 30.2C10 21.2 16 14.4 24 14.4s14 6.8 14 15.8c0 5-6 8.2-14 8.2s-14-3.2-14-8.2z"/><circle class="k" cx="17.4" cy="25" r="1.9"/><circle class="k" cx="30.6" cy="25" r="1.9"/><path d="M15.4 30.2h17.2l-1.7 2.6-1.7-2-1.7 2.4-1.7-2.2-1.7 2.4-1.7-2.2-1.7 2.4-1.7-2.4-1.7 2.2z"/>`,
    crab: `<path d="M18 21v-6M30 21v-6M12.6 33l-4.6 3.4M35.4 33l4.6 3.4M13.4 29.4l-6 .4M34.6 29.4l6 .4"/><path class="r" d="M12 30c0-6 5.4-10 12-10s12 4 12 10c0 4-5 7-12 7s-12-3-12-7z"/><circle class="w" cx="18" cy="13" r="3.4"/><circle class="w" cx="30" cy="13" r="3.4"/><circle class="k" cx="18" cy="13.4" r="1.4"/><circle class="k" cx="30" cy="13.4" r="1.4"/><path class="r" d="M11 24.6c-4.6-.6-6.6-5-4.2-8.6.9 2.6 2.8 3.4 4.8 3-.8-2.7.2-5.2 2.8-6.1.4 3.8-1 7.6-2.2 10"/><path class="r" d="M37 24.6c4.6-.6 6.6-5 4.2-8.6-.9 2.6-2.8 3.4-4.8 3 .8-2.7-.2-5.2-2.8-6.1-.4 3.8 1 7.6 2.2 10"/><path d="M20.6 29.6c2 1.6 4.8 1.6 6.8 0"/>`,
    puffer: `<path d="M24 6.6v4.6M24 36.8v4.6M6.6 24h4.6M36.8 24h4.6M11.6 11.6l3.2 3.2M33.2 33.2l3.2 3.2M36.4 11.6l-3.2 3.2M11.6 36.4l3.2-3.2"/><circle class="w" cx="24" cy="24" r="13"/><circle class="k" cx="19.4" cy="21.4" r="1.9"/><circle class="k" cx="28.6" cy="21.4" r="1.9"/><ellipse class="r" cx="24" cy="29" rx="2.8" ry="2.4"/>`,
    jelly: `<path d="M16 28c-1.2 3 1.6 5 0 8.4M21.4 28c-1.2 3 1.6 5.4 0 9.4M26.6 28c-1.2 3 1.6 5.4 0 9.4M32 28c-1.2 3 1.6 5 0 8.4"/><path class="w" d="M11 25.6C11 17.4 16.8 11 24 11s13 6.4 13 14.6c-2.2 1.4-4.4 1.4-6.5 0-2.2 1.4-4.3 1.4-6.5 0-2.2 1.4-4.3 1.4-6.5 0-2.1 1.4-4.3 1.4-6.5 0z"/><circle class="k" cx="20" cy="20" r="1.7"/><circle class="k" cx="28" cy="20" r="1.7"/><path d="M22.4 23.2c1 .9 2.2.9 3.2 0"/>`,
    whale: `<path d="M22 13c0-3.2 1.4-5.4 3-6.6M22 13c-1.4-2.6-4-3.6-6-3.2M22 13c2-2.2 4.6-2.8 6.6-2.4"/><path class="w" d="M8 28.4c0-7.2 7-12.4 16-12.4 7 0 12 3 15 8 2.6-2 4.6-5 5-8 1.2 4 0 8-3 11.2 0 6-7 10.2-17 10.2S8 34.4 8 28.4z"/><circle class="k" cx="15.6" cy="26" r="1.8"/><path d="M10.4 31.4c6 3 14 3 20 0"/>`,
    turtle: `<path class="w" d="M9 30c0-10 6.7-17 15-17s15 7 15 17z"/><path d="M9 30h30M16.8 30l2.6-8.6h9.2L31.2 30M19.4 21.4L24 14l4.6 7.4"/><circle class="w" cx="24" cy="33.6" r="7"/><circle class="k" cx="21.3" cy="32.8" r="1.4"/><circle class="k" cx="26.7" cy="32.8" r="1.4"/><path d="M22 36.2c1.3.9 2.7.9 4 0"/>`,
    squid: `<path d="M17 27c-1.6 4-1 8 1.6 11M21.6 27c-.6 4-.2 8 .8 12M26.4 27c.6 4 .2 8-.8 12M31 27c1.6 4 1 8-1.6 11"/><path class="w" d="M24 6c5 4 8 9 8 15v6H16v-6c0-6 3-11 8-15z"/><circle class="w" cx="20.4" cy="21" r="2.9"/><circle class="w" cx="27.6" cy="21" r="2.9"/><circle class="k" cx="20.8" cy="21.3" r="1.3"/><circle class="k" cx="27.9" cy="21.3" r="1.3"/>`,
    angler: `<path d="M21.6 14c-2.2-6 2-9.4 7.4-8.2"/><circle class="r" cx="30.4" cy="6.4" r="2.8"/><path class="w" d="M8 27c0-8 7-14 16-14s16 6 16 14-7 13-16 13S8 35 8 27z"/><path class="w" d="M13 29.6h22c-1.6 4.6-6 7.2-11 7.2s-9.4-2.6-11-7.2z"/><path d="M15 29.8l1.8 3 1.8-3 1.8 3 1.8-3 1.8 3 1.8-3 1.8 3 1.8-3 1.8 3 1.8-3"/><circle class="w" cx="18" cy="22" r="3.5"/><circle class="k" cx="18.4" cy="22.4" r="1.7"/><path d="M26.6 20.6l5.4-1.6"/>`,
    diver: `<circle class="w" cx="24" cy="24" r="15.2"/><circle class="w" cx="24" cy="23" r="8.6"/><path d="M24 14.4v17.2M15.4 23h17.2"/><circle class="k" cx="12" cy="17" r="1.6"/><circle class="k" cx="36" cy="17" r="1.6"/><circle class="k" cx="12" cy="31" r="1.6"/><circle class="k" cx="36" cy="31" r="1.6"/><path d="M18 38.6h12"/>`,
    octo: `<path class="rs" d="M14.6 30c-2 3.2-5 4.2-7.2 3.2M19.4 31.2c-1 4-3 6.2-5.2 7.2M28.6 31.2c1 4 3 6.2 5.2 7.2M33.4 30c2 3.2 5 4.2 7.2 3.2"/><path class="r" d="M12 25c0-8 5.4-14 12-14s12 6 12 14c0 4-5.4 7-12 7s-12-3-12-7z"/><path class="w" d="M15.6 20.6l6.6 2.2-.6 3.6c-2.2.8-4.6 0-5.6-1.8z"/><path class="w" d="M32.4 20.6l-6.6 2.2.6 3.6c2.2.8 4.6 0 5.6-1.8z"/><circle class="k" cx="19.6" cy="23.8" r="1.3"/><circle class="k" cx="28.4" cy="23.8" r="1.3"/>`,
    seal: `<path class="w" d="M10 28c0-9 6.3-16 14-16s14 7 14 16-6.3 12-14 12-14-3-14-12z"/><circle class="k" cx="18.6" cy="24.4" r="2"/><circle class="k" cx="29.4" cy="24.4" r="2"/><ellipse class="k" cx="24" cy="29" rx="2.4" ry="1.7"/><path d="M24 30.6v2.2M21 32.6c1.8 1.4 4.2 1.4 6 0M14.6 29.6l-5.2-1M14.8 31.8l-5 1M33.4 29.6l5.2-1M33.2 31.8l5 1"/>`,
  };
  const AV_IDS = Object.keys(AV);
  const avatar = (id) => `<svg class="av-svg" viewBox="0 0 48 48" aria-hidden="true">${AV[id] || AV.pirate}</svg>`;

  /* ── topic icons (24×24) ── */
  const IC = {
    mix: '<path d="M3 7h3c4 0 6 10 10 10h4M17 14l3 3-3 3M3 17h3c1.5 0 2.7-1.4 3.6-3M14 7h6M17 4l3 3-3 3"/>',
    geo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18"/>',
    food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2.5 1.5-3 5-3 8h3v10"/>',
    screen: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 9l2.6-5 4.2 1.4L7.4 9.6M10 5.6l4.2 1.4-2.2 3.2M16 7.5l4.4 1.4"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    sport: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 2.9-1.5 4.6h-5L8 10.4z"/><path d="M12 3v4.5M16 10.4l4.4-1.6M14.5 15l2.6 4M9.5 15l-2.6 4M8 10.4L3.6 8.8"/>',
    games: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11" r=".6"/><circle cx="18.4" cy="14" r=".6"/>',
    sci: '<path d="M9 3h6M10 3v6l-5.4 9.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9V3M7.6 15h8.8"/>',
    words: '<path d="M4 5h16v11H9.5L4 20z"/><path d="M8 9h8M8 12.5h5"/>',
    sea: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M8 11h8M4 13c0 4.5 3.6 8 8 8s8-3.5 8-8M4 13l-1.6 2M4 13l2 1.4M20 13l1.6 2M20 13l-2 1.4"/>',
  };
  const icon = (id) => `<svg class="ic-svg" viewBox="0 0 24 24" aria-hidden="true">${IC[id] || IC.mix}</svg>`;
  const ui = {
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="kf" d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="kf" d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9.5l5 5M22 9.5l-5 5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    plank: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="kf" d="M3 8l17-3 1 4-17 3zM3 14l17-3 1 4-17 3z"/></svg>',
  };
  const mark = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 40 C10 50 4 50 6 56 M24 44 C22 54 18 58 22 60 M40 44 C42 54 46 58 42 60 M50 40 C54 50 60 50 58 56" stroke="#0a0a0a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M14 40 C10 50 4 50 6 56 M24 44 C22 54 18 58 22 60 M40 44 C42 54 46 58 42 60 M50 40 C54 50 60 50 58 56" stroke="#ff2b2b" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M10 34 C9 16 20 6 32 6 S55 16 54 34 C53 42 44 46 32 46 S11 42 10 34Z" fill="#ff2b2b" stroke="#0a0a0a" stroke-width="3.5"/><path d="M18 24l11 4-1 5c-4 1-8 0-9.5-3z M46 24l-11 4 1 5c4 1 8 0 9.5-3z" fill="#fff" stroke="#0a0a0a" stroke-width="2.5"/><circle cx="25" cy="29" r="2.2" fill="#0a0a0a"/><circle cx="39" cy="29" r="2.2" fill="#0a0a0a"/></svg>`;
  return { kraken, suckers, AV_IDS, avatar, icon, ui, mark };
})();
