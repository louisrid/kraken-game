# KRAKEN — rarity trivia for 1–8 divers

Name something. The rarer your answer, the deeper you sink.
One static folder, no server of our own. Live at https://kraken-game.netlify.app/ (Netlify deploys every push to `main`).

Open the link and you're straight into a solo dive with the answer box ready. Everyone gets a random lowercase name and a diver; tap your diver to change them. No sound.

## Multiplayer
No codes. The home screen lists four public lobbies (Lobby 1–4) with live player counts. Tap one to open or join it. The host picks a mode, everyone taps **Ready**, and a 3-2-1 countdown starts the dive. Late joiners watch, then play the next game.

| Mode | Prompts | Timer | Win |
|---|---|---|---|
| Versus | 10 | none | deepest diver |
| Team | 10 | none | shared depth, beat your team best |
| Blitz | 12 | 20 s each | deepest diver |

### Scoring
- Tiers: Shallows 100 m · Fool's gold 150 m · Open sea 300 m · Deep water 600 m · The abyss 850 m · Kraken 1,000 m.
- Shallows is only the handful of answers everyone says first. Almost everything else lands deep, so thinking past the obvious pays.
- **Same answer as someone else: you split the depth** (2 people = half each).
- **Deepest single dive of each prompt: +100 m** (not in Team; ties get nothing).
- The last prompt counts double.
- Pace: once everyone else has answered, the last diver gets 15 s. After each reveal the game descends by itself after about 10 s (the host can tap Descend sooner).

## Answers
`bank.js` holds 47 hand-written prompts. `bank-gen.js` is **generated** and adds 17 more prompts plus big extensions, about 45,000 accepted answers in total, so almost any real answer counts:
- word games (rhymes, Q-words, -ology, double Z) tiered by word frequency (SCOWL), rhymes from the CMU dictionary, profanity filtered
- cities (30k, tiered by population), any Pokémon (by generation), comic heroes and villains, birds, music genres, fruit, veg, tech companies, car brands, countries in Asia
- extra dog breeds, dinosaurs, programming languages and Google Fonts typefaces added to the existing prompts

Rebuild after editing `tools/build-bank.mjs`:
```
cd tools && npm i && node build-bank.mjs
```

## How multiplayer works
- The host's browser runs the game; everyone else sends intents and renders the host's state.
- Messages go over 5 public MQTT relays at once; guests keep whichever answers first. The port-443 relay gets through strict networks.
- Refresh = rejoin your seat. If the host leaves, everyone is sent home within a couple of seconds.

## Files
index.html (layout + styles), game.js (host/guest logic + UI), engine.js (answer matching + scoring), bank.js + bank-gen.js (prompts), art.js (kraken, avatars, icons), net.js (relays), mqtt.min.js, tools/ (bank generator).

## Local testing
Run a local MQTT-over-WebSocket broker (e.g. aedes on :8890), serve the folder, then open
`http://localhost:8767/index.html?relay=ws://localhost:8890`. The `?relay=` override only works on localhost.
