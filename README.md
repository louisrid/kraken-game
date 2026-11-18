# KRAKEN — rarity trivia for 2–8 pirates

Name something. The rarer your answer, the deeper it sinks and the more it scores.
Same build model as Pass the Bomb: one static folder, no server of our own.

## Deploy (1 minute)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder (or the unzipped zip) onto the page.
3. Share the link. Friends join with the 4-letter code or the `?join=CODE` link.

Any static host works (GitHub Pages, Vercel, Cloudflare Pages).

## How multiplayer works
- The host's browser runs the game (host-authoritative). Everyone else sends intents and renders the host's state.
- Messages travel over 5 public MQTT relays at once (HiveMQ, Mosquitto, EMQX x2, shiftr on port 443). Guests keep whichever relay answers first.
- Refresh = rejoin your seat. Players drop after 30s gone. If the host leaves, everyone is told.

## Modes
- **Versus**: everyone answers the same prompt. Matching someone = JINX (0). Depth tiers: Shallows 10, Fool's gold 15, Open sea 30, Deep water 60, Abyss 85, Kraken 100. Last round doubles.
- **Crew** (co-op): the kraken orders answers at specific depths; the crew calls slots and fills them before the timer. Wrong depth costs a plank (−6s).
- **Practice**: solo, no network.

## Playing
1. One person picks a name + character and hits **Create lobby**; share the 4-letter code or the invite link.
2. Friends open the link (or type the code). 2–8 players. Late joiners spectate until the next game.
3. Host picks mode, rounds, timer and topics, then **Start**. Nobody to wait for? Hit **Practice** for solo.
4. If a relay is down, the game still works as long as one of the five is reachable. Strict networks usually let the port-443 relay through.

## Files
index.html (layout + styles; favicon.svg = tab icon + styles), game.js (host/guest logic + UI), engine.js (answer matching + scoring),
bank.js (47 prompts, ~4,200 answers), art.js (kraken, avatars, icons), net.js (relays), mqtt.min.js.

## Local testing
Run a local MQTT-over-WebSocket broker (e.g. aedes on :8890), serve the folder, then open
`http://localhost:8766/index.html?relay=ws://localhost:8890`. The `?relay=` override only works on localhost.
