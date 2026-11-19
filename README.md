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
- Tiers: Common 100 m · Uncommon 200 m · Decent 400 m · Rare 800 m · Hyper rare 1,500 m · 1 in a Kraken 2,500 m.
- Common is only the handful of answers everyone says first. Rarer answers sink you deeper; Kraken is reserved for the genuinely obscure.
- **Versus and Blitz:** pure rarity, no adjustment for what others said.
- **Team:** depths add up, but matching a teammate sinks you both (0 m). Aliases count as the same answer (NYC = New York).
- The last prompt counts double. Solo is just the base tiers.
- Pace: once everyone else has answered, the last diver gets 15 s. After each reveal the game descends by itself after about 10 s (the host can tap Descend sooner).

## Answers
60 prompts and about 57,000 accepted answers. `bank.js` is hand-written (40 prompts). `bank-gen.js` is **generated** by `tools/build-bank.mjs` from open datasets and adds 20 prompts plus extensions:
- word games (rhymes, Q-words, -ology, double Z), ranked by word frequency (SCOWL), rhymes from the CMU dictionary, profanity filtered, exact spelling only
- cities (about 30,000, ranked by population), capitals, every country, any Pokémon, comic heroes and villains, birds, music genres, fruit, veg, tech companies, car brands
- extra dog breeds, dinosaurs, programming languages and Google Fonts added to hand-written prompts

Ranked data is split about half Decent, 30% Rare, the rest Hyper rare; Kraken is hand-picked (plus the rarest ~3% of words in the word games). Unranked extras (an obscure dinosaur, a little-known font) go to Rare.

Matching forgives capitals, accents, punctuation, plurals (strawberries, tomatoes), common aliases and small typos. In very big lists only famous answers get full typo tolerance, typos must keep the first letter, and word games need the exact word.

**Profile:** best dive, average, number of dives and Krakens are kept per player. They are tied to a hashed form of your public IP (the IP itself is never stored), so devices on the same connection share them; they are mirrored on the public relays. Changing networks (mobile data, VPN) starts a separate profile.

Questions are parsed the first time they are used and pre-parsed in idle time, so the big lists don't slow down loading.

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
