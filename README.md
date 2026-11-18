# KRAKEN — rarity trivia for 2–8 pirates

Name something. The rarer your answer, the deeper it sinks and the more it scores.
Same build model as Pass the Bomb: one static folder, no server of our own.

Open the link and you're straight into a solo dive, answer box ready. It plays as one continuous descent: each answer becomes a glowing tag that sinks you past the depth lines and real ocean landmarks (332 m scuba record, the Titanic at 3,800 m, the hadal zone) down towards the kraken's trench. No timer, no sound. Everyone gets a random lowercase name (riptide, barnacle, saltbeard…) and a random character; tap **change** to edit them.

**Multiplayer has no codes.** The home screen lists four public lobbies (Lobby 1–4) with live player counts. Tap an empty one to open it (you host), tap a live one to join. You land straight in the game at the surface: friends' divers appear as they join, everyone taps READY, and a 3-2-1 countdown starts the dive. If two people open the same empty lobby at once, one hosts and the other joins automatically. Invite links look like `?lobby=2`.

Every screen has a big **Back** arrow; the browser/phone back gesture and Esc do the same.

## Deploy (1 minute)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder (or the unzipped zip) onto the page.
3. Share the link. Friends tap the same lobby (Lobby 1–4) on the home screen.

Any static host works (GitHub Pages, Vercel, Cloudflare Pages).

## How multiplayer works
- The host's browser runs the game (host-authoritative). Everyone else sends intents and renders the host's state.
- Messages travel over 5 public MQTT relays at once (HiveMQ, Mosquitto, EMQX x2, shiftr on port 443). Guests keep whichever relay answers first.
- Refresh = rejoin your seat. Players drop after 30s gone. If the host leaves, everyone is told.

## Modes
- **Versus**: everyone answers the same prompt, no timer (optional 30s/60s). Your answer's rarity decides how deep you dive: Shallows 100 m, Fool's gold 150 m, Open sea 300 m, Deep water 600 m, The abyss 850 m, Kraken 1,000 m. Same answer as someone else = sunk (+0 m). Deepest diver wins. Last round doubles. Host can hit Reveal now if someone's AFK.
- **Crew** (co-op): the captain orders answers at specific depths; the crew calls slots and fills them. No timer. Three wrong depths and the kraken takes a plank.
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
