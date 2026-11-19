/* Builds ../bank-gen.js: big answer lists from open datasets, so almost any real answer is accepted.
   Hand-picked answers set the shallow tiers (what everyone says); the datasets fill the deep tiers,
   ranked by word frequency, city population or Pokémon generation.
   Run:  cd tools && npm i && node build-bank.mjs */
import fs from 'fs';
import vm from 'vm';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ROOT = new URL('..', import.meta.url).pathname;

/* load the engine + hand-written bank so we can dedupe against it */
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(ROOT + 'engine.js', 'utf8') + '\n' + fs.readFileSync(ROOT + 'bank.js', 'utf8') + '\nthis.BANK_SRC=BANK_SRC;this.keyOf=keyOf;this.parseQuestion=parseQuestion;this.pluralVariants=pluralVariants;', ctx);
const { keyOf, pluralVariants } = ctx;
/* a key counts as taken if it, or any singular form of it, is taken (Potatoes = Potato) */
const taken = (used, k) => used.has(k) || used.has(sing(k)) || pluralVariants(k).some(v => used.has(v));
const sing = (k) => (k.length > 4 && /(ch|sh|x|ss)es$/.test(k) ? k.slice(0, -2) : k.length > 4 && k.endsWith('s') && !k.endsWith('ss') ? k.slice(0, -1) : k);

const clean = (s) => String(s).replace(/[,/]/g, ' ').replace(/\s+/g, ' ').trim();
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* keys already used by a question's text (answers + aliases + decoys), so new items never collide */
function usedKeys(aText, noText) {
  const used = new Set();
  for (const line of aText.split('\n')) {
    const m = line.match(/^([CHORFX]):\s*(.*)$/); if (!m) continue;
    for (const item of m[2].split(',')) for (const n of item.split('/')) { const k = keyOf(n); if (k) { used.add(k); used.add(sing(k)); } }
  }
  for (const part of (noText || '').split(/;\s*/)) { const at = part.indexOf(': '); if (at < 0) continue; for (const n of part.slice(0, at).split('/')) { const k = keyOf(n); if (k) { used.add(k); used.add(sing(k)); } } }
  return used;
}
/* add items into tier buckets, skipping anything already used */
function bucketise(used, items) {
  const out = { C: [], H: [], O: [], R: [], F: [], X: [] };
  for (const [name, tier] of items) {
    const n = clean(name); const k = keyOf(n); const kb = keyOf(n.replace(/\s*\([^)]*\)\s*/g, ' ').trim());
    if (!n || !k || k.length < 2 || taken(used, k) || (kb && kb !== k && taken(used, kb))) continue;
    used.add(k); used.add(sing(k)); if (kb) { used.add(kb); used.add(sing(kb)); }
    out[tier].push(n);
  }
  return Object.entries(out).filter(([, v]) => v.length).map(([t, v]) => `${t}: ${v.join(', ')}`).join('\n');
}

/* Ranked data (most familiar first): ~half Open sea, ~30% Deep water, the rest Abyss,
   and only the most obscure ~3% Kraken (when the ranking really measures obscurity). */
function bucketRanked(used, names, allowX) {
  const fresh = [];
  for (const name of names) {
    const n = clean(name); const k = keyOf(n); const kb = keyOf(n.replace(/\s*\([^)]*\)\s*/g, ' ').trim());
    if (!n || !k || k.length < 2 || taken(used, k) || (kb && kb !== k && taken(used, kb))) continue;
    used.add(k); used.add(sing(k)); if (kb) { used.add(kb); used.add(sing(kb)); }
    fresh.push(n);
  }
  const N = fresh.length; const out = { O: [], R: [], F: [], X: [] };
  fresh.forEach((n, i) => { const f = i / N; out[f < 0.35 ? 'O' : f < 0.7 ? 'R' : (!allowX || f < 0.96) ? 'F' : 'X'].push(n); });
  return Object.entries(out).filter(([, v]) => v.length).map(([t, v]) => `${t}: ${v.join(', ')}`).join('\n');
}

/* ───────── datasets ───────── */
const WL = require('wordlist-english');
const LEVEL = new Map();
for (const lv of [10, 20, 35, 40, 50, 55, 60, 70]) for (const v of ['english', 'english/british', 'english/american']) {
  for (const w0 of WL[`${v}/${lv}`] || []) { if (!/^[A-Za-z]+$/.test(w0) || /[A-Z].*[A-Z]/.test(w0)) continue; const w = w0.toLowerCase(); if (!LEVEL.has(w)) LEVEL.set(w, lv); }
}
/* party-safe: drop profanity and slurs from the word games */
const BAD = new Set([...require('naughty-words').en.map(w => w.toLowerCase()), 'crap', 'crappy', 'crappie', 'shitty', 'jizz', 'jew', 'homo', 'queer', 'quim', 'quickie', 'id', 'twat', 'gay']);
for (const w of [...LEVEL.keys()]) if (BAD.has(w) || [...BAD].some(b => b.length > 3 && !b.includes(' ') && w.startsWith(b) && /^(s|es|ed|ing|er|ers|y|ier|iest)$/.test(w.slice(b.length)))) LEVEL.delete(w);
/* an inflected form is no rarer than its base word (huzzahed ≈ huzzah) */
for (const [w, lv] of LEVEL) for (const suf of ['s', 'es', 'ed', 'd', 'ing', 'er', 'est', 'ly']) { if (w.endsWith(suf) && w.length - suf.length >= 3) { const b = w.slice(0, -suf.length); if (LEVEL.has(b) && LEVEL.get(b) < lv) LEVEL.set(w, LEVEL.get(b)); } }
const wordTier = (lv) => (lv <= 10 ? 'O' : lv <= 35 ? 'R' : lv <= 55 ? 'F' : 'X');
const CMU = require('cmu-pronouncing-dictionary').dictionary;
const rhymePart = (pron, w) => { const ph = pron.split(' '); let i = -1; for (let j = ph.length - 1; j >= 0; j--) { if (!/[12]$/.test(ph[j])) continue; if (ph[j] === 'IY2' && j === ph.length - 1 && /(y|ie|ey|phe|ope|ole)$/.test(w) && ph.some((p, x) => x < j && /1$/.test(p))) continue; i = j; break; } if (i < 0) return null; return ph.slice(i).map(p => p.replace(/\d/, '')).join(' '); };
const RHYME = new Map();
for (const [k, pron] of Object.entries(CMU)) { const w = k.replace(/\(\d+\)$/, ''); if (!LEVEL.has(w)) continue; const r = rhymePart(pron, w); if (!r) continue; if (!RHYME.has(r)) RHYME.set(r, new Set()); RHYME.get(r).add(w); }
const byFamiliar = (a, b) => LEVEL.get(a) - LEVEL.get(b) || a.length - b.length || a.localeCompare(b);
const rhymesOf = (part, self) => [...(RHYME.get(part) || [])].filter(w => w !== self).sort(byFamiliar);
const words = (pred) => [...LEVEL.keys()].filter(pred).sort(byFamiliar);

const pokemon = require('pokemon').all('en');
const dinos = require('dinosaurs').default || require('dinosaurs');
const linguist = Object.values(require('linguist-languages').default || require('linguist-languages'));
const { faker } = await import('@faker-js/faker');
const FD = faker.rawDefinitions || faker.definitions;
const heroes = (await import('superheroes')).default; const villains = (await import('supervillains')).default;
const cities = require('all-the-cities');
const gfonts = Object.values(JSON.parse(fs.readFileSync(new URL('./node_modules/google-font-metadata/data/google-fonts-v2.json', import.meta.url))));

const OUT = []; const EXT = {};
const add = (src, gen) => { src.a = src.a.trim() + '\n' + gen; OUT.push(src); };

/* ───────── WORD GAMES ───────── */
let LOOSE_IY = false;
function rhymeQ(id, word, part, head, xName, fact, no) {
  const src = { id, cat: 'words', exact: 1, q: `Name a word that rhymes with ${word.toUpperCase()}`, a: head, fact, no: `${cap(word)}: That's the word itself!; ${no || ''}`.replace(/;\s*$/, '') };
  const used = usedKeys(src.a, src.no);
  let list = rhymesOf(part, word);
  if (LOOSE_IY && part === 'IY') { const extra = [...LEVEL.keys()].filter(w => w !== word && /y$/.test(w) && w.length > 3 && CMU[w] && /IY\d$/.test(CMU[w])); list = [...new Set([...list, ...extra])].sort(byFamiliar); LOOSE_IY = false; }
  // the featured Kraken word is hand-checked; some aren't in the CMU dictionary
  add(src, bucketRanked(used, list.map(cap), true));
}
rhymeQ('rh_day', 'day', 'EY', `
C: Play, Say, Way, May, Stay, Pay
H: Ballet, Bouquet, Hooray
O: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Norway, Broadway, Santa Fe, Bombay, Malay, Mandalay, Chevrolet, Beyoncé/Beyonce, Doris Day
X: Sobriquet`, 'Sobriquet', 'A nickname. It comes from French, where it once meant a chuck under the chin.');
LOOSE_IY = true;
rhymeQ('rh_bee', 'bee', 'IY', `
C: See, Tree, Me, Sea, Free, Key
H: Referee, Guarantee, Chimpanzee
X: Jamboree`, 'Jamboree', 'Nobody knows where the word comes from, but the 1920 World Scout Jamboree made it famous.');
rhymeQ('rh_night', 'night', 'AY T', `
C: Light, Bite, Kite, Right, White, Fight
H: Dynamite, Satellite, Parasite
X: Troglodyte`, 'Troglodyte', 'A cave dweller. From the Greek for "one who creeps into holes".');
rhymeQ('rh_blue', 'blue', 'UW', `
C: Shoe, True, New, Two, Zoo, Glue
H: Shampoo, Tattoo, Bamboo
X: Kangaroo`, 'Kangaroo', 'It doesn\'t mean "I don\'t understand", as the myth goes. It comes from gangurru in the Guugu Yimithirr language.');

function patternQ(id, q, head, pred, xName, fact, no) {
  const src = { id, cat: 'words', exact: 1, q, a: head, fact, no };
  const used = usedKeys(src.a, src.no);
  add(src, bucketRanked(used, words(pred).map(cap), true));
  if (!src.a.toLowerCase().includes(xName.toLowerCase())) throw new Error('missing ' + xName);
}
patternQ('w_q', 'Name a word that starts with Q', `
C: Queen, Quick, Quiet, Question, Quiz, Quite
H: Quixotic, Quarantine, Quinoa
X: Quidnunc`, (w) => w.startsWith('q') && w.length > 2, 'Quidnunc', 'A nosy gossip. It\'s Latin for "what now?"', 'Q: Just the letter, sorry; QR: An abbreviation');
patternQ('w_ology', 'Name a word ending in -OLOGY', `
C: Biology, Psychology, Technology, Geology, Sociology, Archaeology/Archeology
H: Astrology, Mythology, Apology
X: Oology`, (w) => w.endsWith('ology') && w.length > 6, 'Oology', 'The study (and once the collecting) of birds\' eggs.', 'Ology: Just the ending — name a whole word');
patternQ('w_zz', 'Name a word with a double Z in it', `
C: Pizza, Buzz, Jazz, Puzzle, Fizz, Dizzy
H: Pizzazz, Blizzard, Mezzanine
X: Razzmatazz`, (w) => w.includes('zz') && !/zzz/.test(w), 'Razzmatazz', 'Probably a jazzed-up form of "razzle-dazzle", first recorded in the 1890s.', 'Zzz: That\'s a snore, not a word');

/* ───────── POKÉMON ───────── */
{
  const src = { id: 'anypoke', cat: 'games', q: 'Name any Pokémon', a: `
C: Pikachu, Charizard, Eevee, Mewtwo, Bulbasaur, Squirtle
H: Lucario, Greninja, Mimikyu, Magikarp
X: Spinda`, fact: 'Every Spinda\'s spots are different. There are over four billion possible patterns.',
    no: 'Digimon: Wrong franchise; Agumon: That\'s a Digimon; MissingNo/Missingno: A glitch, not a Pokémon; Ash/Ash Ketchum: He\'s a trainer; Misty: She\'s a trainer; Brock: He\'s a trainer; Professor Oak/Oak: He\'s a professor; Team Rocket: They\'re villains, not Pokémon' };
  const used = usedKeys(src.a, src.no);
  const seen = new Set();
  const names = pokemon.map(n => n.replace(/[♀♂]/g, '').trim()).filter(n => { const k = keyOf(n); if (seen.has(k)) return false; seen.add(k); return true; });
  add(src, bucketRanked(used, names, false));
}

/* ───────── CITIES ───────── */
{
  const src = { id: 'city', cat: 'geo', q: 'Name a city', a: `
C: London, Paris, New York City/New York/NYC, Tokyo, Los Angeles/LA, Rome
H: Timbuktu/Tombouctou, Reykjavik/Reykjavík, Kathmandu
O: Mumbai/Bombay, Kolkata/Calcutta, Chennai/Madras, Bengaluru/Bangalore, Beijing/Peking, Ho Chi Minh City/Saigon, Kyiv/Kiev, Saint Petersburg/St Petersburg/Leningrad, Yangon/Rangoon, Washington DC/Washington/DC, Rio de Janeiro/Rio, Mexico City, Hong Kong, Singapore, Dubai, Istanbul/Constantinople, Sydney, Berlin, Madrid, Barcelona, Amsterdam, Moscow, Cairo, Chicago, San Francisco/SF, Las Vegas/Vegas, Miami, Toronto, Bangkok, Seoul, Shanghai, Delhi/New Delhi, Lagos, Buenos Aires, Lisbon, Venice, Dublin, Edinburgh, Manchester, Liverpool, Birmingham, Glasgow, Boston, Seattle, New Orleans, Vancouver, Montreal, Melbourne, Cape Town, Johannesburg, Nairobi, Marrakesh/Marrakech, Jerusalem, Athens, Vienna, Prague, Budapest, Warsaw, Stockholm, Copenhagen, Oslo, Helsinki, Brussels, Zurich/Zürich, Geneva, Milan, Naples, Florence, Munich, Hamburg, Kyoto, Osaka, Manila, Jakarta, Kuala Lumpur, Hanoi, Havana, Lima, Bogotá/Bogota, Santiago, São Paulo/Sao Paulo, Tehran, Baghdad, Karachi, Dhaka, Kabul
R: St Davids/St David's, St Asaph, Vatican City, City of London
X: Ushuaia`, fact: 'Usually called the southernmost city in the world, at the tip of Argentina\'s Tierra del Fuego.',
    no: 'Atlantis: Sunk, and fictional; Gotham/Gotham City: Fictional; Springfield: Which one? There are dozens — and it\'s fictional in The Simpsons; Narnia: Fictional; Hogwarts: A school, not a city; England: A country, not a city; Texas: A state, not a city; California: A state, not a city; Europe: A continent' };
  { const wc = require('world-countries'); const cityKeys = new Set(cities.filter(c => c.population >= 10000).map(c => keyOf(c.name))); const extra = wc.filter(c => c.unMember).map(c => c.name.common).filter(n => !cityKeys.has(keyOf(n)) && !/^(Singapore|Monaco|Djibouti|Luxembourg|San Marino|Vatican City|Kuwait|Panama|Guatemala|Mexico)$/.test(n)).map(n => `${n.replace(/[,/;:]/g, ' ')}: That's a country — name a city in it`); src.no += '; ' + extra.join('; '); }
  const used = usedKeys(src.a, src.no);
  const best = new Map();
  for (const c of cities) {
    if (c.population < 10000 || /\d/.test(c.name) || c.name.length > 28) continue;
    const k = keyOf(c.name); if (!k) continue;
    if (!best.has(k) || best.get(k).population < c.population) best.set(k, c);
  }
  const ranked = [...best.values()].sort((a, b) => b.population - a.population);
  add(src, bucketRanked(used, ranked.map(c => c.name), false));
}

/* ───────── COMICS ───────── */
{
  const src = { id: 'comics', cat: 'screen', q: 'Name a comic-book hero or villain', a: `
C: Spider-Man/Spiderman/Spider Man, Batman, Superman, Iron Man/Ironman, Wonder Woman, Captain America
H: Deadpool, The Joker/Joker, Thanos, Harley Quinn
O: Hulk/The Hulk/Incredible Hulk, Thor, Black Widow, Wolverine, The Flash/Flash, Aquaman, Green Lantern, Black Panther, Doctor Strange/Dr Strange, Captain Marvel, Ant-Man/Antman, Hawkeye, Venom, Magneto, Loki, Lex Luthor, Catwoman, Robin, Batgirl, Supergirl, Green Arrow, Cyborg, Storm, Cyclops, Jean Grey/Phoenix, Rogue, Gambit, Professor X/Charles Xavier, Daredevil, The Punisher/Punisher, Ghost Rider, Silver Surfer, Doctor Doom/Dr Doom, Galactus, Green Goblin, Doctor Octopus/Doc Ock, Bane, The Riddler/Riddler, The Penguin/Penguin, Two-Face, Scarecrow, Poison Ivy, Darkseid, Brainiac, Doomsday, Shazam, Nightwing, Hellboy, Star-Lord/Starlord, Groot, Rocket/Rocket Raccoon, Gamora, Drax, Vision, Scarlet Witch/Wanda, Quicksilver, Falcon, Winter Soldier/Bucky, Black Adam, Sinestro, Ultron, Red Skull, Kingpin, Mysterio, Sandman, Carnage, Mystique, Juggernaut, Sabretooth, Apocalypse, Deathstroke, Reverse-Flash, Zatanna, Raven, Starfire, Beast Boy, Ms. Marvel/Ms Marvel, She-Hulk, Moon Knight, Blade, Elektra, Luke Cage, Jessica Jones, Iron Fist, Spawn, Invincible, Omni-Man, Judge Dredd, Wasp, Beast, Iceman, Nick Fury, War Machine, Black Canary, Martian Manhunter, Mr. Freeze/Mr Freeze, Killer Croc, Ra's al Ghul, Mera, Cable, Bishop, Colossus, Nightcrawler, Kitty Pryde/Shadowcat, Emma Frost, Psylocke, Domino, X-23, Mister Fantastic/Mr Fantastic/Reed Richards, Invisible Woman/Sue Storm, Human Torch/Johnny Storm, The Thing/Thing, Thanos, Hela, Mephisto, Dormammu, Electro, Rhino, Vulture, Lizard, Kraven, Shocker, Scorpion, Hobgoblin, Bullseye, Taskmaster, Baron Zemo/Zemo, MODOK, Kang, Ego, Dr Manhattan/Doctor Manhattan, Rorschach, Silk Spectre, Nite Owl, Ozymandias, The Comedian, Swamp Thing, Constantine/John Constantine, The Spectre, Static Shock/Static, Blue Beetle, Booster Gold, Plastic Man, Hawkman, Hawkgirl, Firestorm, Jonah Hex, Lobo, Mxyzptlk/Mister Mxyzptlk, Parallax, Bizarro, General Zod/Zod, Metallo, Toyman, Cheetah, Ares, Grodd/Gorilla Grodd, Captain Cold, Mirror Master, Black Manta, Ocean Master, Atrocitus, Larfleeze, Hulkling, America Chavez, Miles Morales, Spider-Gwen/Ghost-Spider/Gwen Stacy, Spider-Woman, Silver Sable, Black Cat, Morbius, Man-Thing, Howard the Duck, Adam Warlock, Nova, Quasar, Sentry, Namor, Black Bolt, Medusa, Crystal, Lockjaw, Cosmo, Squirrel Girl
X: Squirrel Girl`, fact: 'Marvel\'s Unbeatable Squirrel Girl really is unbeatable: she has defeated Doctor Doom, Thanos and Galactus.',
    no: 'Shrek: An ogre from a film, not a comic; Harry Potter: A wizard from books; Sonic: A video-game hedgehog; Mario: A video-game plumber; Zorro: From pulp fiction and film first; Robin Hood: A legend, not a comic; Tintin: A comic character, but not a hero in capes — we\'ll allow heroes and villains only' };
  // Squirrel Girl appears twice above on purpose? keep the X only
  src.a = src.a.replace(', Squirrel Girl\nX:', '\nX:').replace(', Thanos, Hela', ', Hela');
  const used = usedKeys(src.a, src.no);
  add(src, bucketise(used, [...heroes, ...villains].map(n => [n, 'R'])));
}

/* ───────── BIRDS ───────── */
{
  const src = { id: 'bird', cat: 'sci', q: 'Name a bird', a: `
C: Eagle, Robin, Pigeon, Owl, Penguin, Parrot
H: Dodo, Kiwi, Puffin, Toucan
O: Sparrow, Crow, Raven, Magpie, Blackbird, Thrush, Starling, Wren, Swallow, Swift, Seagull/Gull, Duck, Goose, Swan, Chicken/Hen/Rooster/Cockerel, Turkey, Ostrich, Emu, Peacock/Peafowl/Peahen, Pelican, Heron, Stork, Crane, Flamingo, Hummingbird, Woodpecker, Kingfisher, Falcon, Hawk, Kestrel, Buzzard, Vulture, Condor, Albatross, Kookaburra, Cockatoo, Budgie/Budgerigar, Canary, Finch, Goldfinch, Bullfinch, Chaffinch, Jay, Blue jay, Cardinal, Lark, Skylark, Nightingale, Cuckoo, Pheasant, Partridge, Quail, Grouse, Macaw, Lovebird, Cockatiel, Parakeet, Mynah/Myna, Hornbill, Roadrunner, Bird of paradise, Lyrebird, Cassowary, Kakapo, Kea, Mallard, Barn owl, Snowy owl, Tawny owl, Bald eagle, Golden eagle, Peregrine falcon/Peregrine, Osprey, Kite, Red kite, Robin redbreast, Bluebird, Mockingbird, Warbler, Blue tit, Great tit, Tit, Nuthatch, Wagtail, Pied wagtail, Coot, Moorhen, Gannet, Cormorant, Tern, Sandpiper, Plover, Lapwing, Curlew, Oystercatcher, Kittiwake, Puffin, Rook, Jackdaw, Dove, Turtle dove, Wood pigeon, Collared dove, Egret, Ibis, Spoonbill, Penguin, Emperor penguin, King penguin, Guinea fowl/Guineafowl, Canada goose, Mute swan, Black swan, Greylag goose, Woodcock, Snipe, Lorikeet, Galah, Rosella
R: Shoebill, Secretary bird, Marabou stork, Sunbird, Weaverbird/Weaver, Honeyeater, Fairywren, Bowerbird, Frogmouth, Potoo, Oilbird, Sandgrouse, Bustard, Capercaillie, Black grouse, Ptarmigan, Merlin, Hobby, Gyrfalcon, Harpy eagle, Sea eagle, Teal, Wigeon, Pintail, Shoveler, Eider, Merganser, Goosander, Smew, Scoter, Goldeneye, Canvasback, Wood duck, Mandarin duck, Muscovy duck, Barnacle goose, Brent goose, Snow goose, Whooper swan, Trumpeter swan, Grebe, Great crested grebe, Little grebe, Loon/Diver, Avocet, Godwit, Dunlin, Turnstone, Fulmar, Shearwater, Petrel, Storm petrel, Frigatebird, Booby, Blue-footed booby, Bittern, Hoopoe, Bee-eater, Roller, Nightjar, Tanager, Grosbeak, Junco, Chickadee, Titmouse, Vireo, Flycatcher, Kinglet, Goldcrest, Firecrest, Crossbill, Siskin, Linnet, Redstart, Stonechat, Wheatear, Fieldfare, Redwing, Chough, Nutcracker, Quetzal, Trogon, Motmot, Jacana, Rhea, Takahe, Tui, Weka, Pukeko, Kakariki, Moa, Great auk, Passenger pigeon, Yellowhammer, Bunting, Waxwing, Shrike, Dipper, Treecreeper, Pipit, Swiftlet, Whydah, Sugarbird, Pardalote, Spoonbill, Water rail/Rail, Corncrake, Hen harrier/Harrier, Sparrowhawk, Goshawk, Red-tailed hawk, Turkey vulture, Andean condor, California condor, Wandering albatross, Kiwi, Saker falcon, Lammergeier/Bearded vulture, Hornero, Cock-of-the-rock, Manakin, Antbird, Tinamou, Seriema, Kagu, Sunbittern, Hamerkop, Mousebird, Wallcreeper, Bearded tit/Bearded reedling, Firecrest
X: Hoatzin`, fact: 'Its chicks have claws on their wings, so they can clamber back up into the trees.',
    no: 'Bat: A mammal, not a bird; Pterodactyl: A flying reptile; Butterfly: An insect; Bird: Name a kind!; Big Bird: Sesame Street doesn\'t count; Tweety: Name the species — he\'s a canary; Angry Birds: That\'s a game' };
  src.a = src.a.replace(', Puffin, Rook', ', Rook').replace(', Penguin, Emperor', ', Emperor').replace(', Spoonbill, Water rail', ', Water rail').replace(', Kiwi, Saker', ', Saker').replace(', Bearded tit/Bearded reedling, Firecrest', ', Bearded tit/Bearded reedling');
  const used = usedKeys(src.a, src.no);
  add(src, bucketise(used, FD.animal.bird.map(n => [n, 'R'])));
}

/* ───────── MUSIC GENRES ───────── */
{
  const src = { id: 'genre', cat: 'music', q: 'Name a music genre', a: `
C: Pop, Rock, Hip hop/Hip-hop/Rap, Jazz, Classical, Country
H: K-pop/Kpop, Grime, Drill
O: Blues, Heavy metal/Metal, Punk/Punk rock, Reggae, R&B/RnB/Rhythm and blues, Soul, Funk, Techno, House, EDM/Electronic dance music, Electronic, Dubstep, Drum and bass/DnB, Indie, Folk, Gospel, Opera, Grunge, Ska, Salsa, Reggaeton, Afrobeats, Trap, UK garage/Garage, Trance, Ambient, Lo-fi/Lofi, Synthwave, Britpop, New wave, Motown, Bluegrass, Swing, Disco, Emo, Indie rock, Alternative/Alt rock/Alternative rock, Hard rock, Soft rock, Prog rock/Progressive rock, Psychedelic rock, Glam rock, Death metal, Black metal, Thrash metal, Nu metal, Hardcore, Pop punk, Post-punk, Shoegaze, Dream pop, Synth-pop/Synthpop, Electropop, Bubblegum pop, J-pop, Latin, Bossa nova, Samba, Tango, Flamenco, Calypso, Soca, Dancehall, Dub, Afrobeat, Highlife, Amapiano, Bhangra, Bollywood, Qawwali, Fado, Polka, Cumbia, Merengue, Bachata, Mariachi, Zydeco, Cajun, Americana, Rockabilly, Doo-wop, Big band, Bebop, Smooth jazz, Acid jazz, Neo soul, Hip house, Jungle, Breakbeat, Big beat, Hardstyle, Happy hardcore, Gabber, Acid house, Deep house, Tech house, Progressive house, Electro, Industrial, Krautrock, Trip hop, Chillwave, Vaporwave, Hyperpop, Phonk, Drill, Bounce, Crunk, Gangsta rap, Boom bap, Conscious rap, Mumble rap, Cloud rap, Musical theatre/Musicals/Show tunes, Film score/Soundtrack, Baroque, Romantic, Minimalism, Choral, A cappella, Barbershop, Chiptune, Muzak/Elevator music, Yacht rock, Surf rock, Garage rock, Math rock, Post-rock, Stoner rock, Doom metal, Power metal, Folk metal, Metalcore, Deathcore, Screamo, Skiffle, Northern soul, Two-tone/2 Tone, Oi!, Celtic, Sea shanty/Shanty/Sea shanties
X: Sea shanty`, fact: 'Work songs that kept sailors hauling ropes in time. TikTok brought them back in 2021.',
    no: 'Music: Name a genre!; Guitar: That\'s an instrument; Beyoncé/Beyonce: That\'s an artist; Taylor Swift: That\'s an artist; Spotify: That\'s an app' };
  src.a = src.a.replace(', Celtic, Sea shanty/Shanty/Sea shanties\nX: Sea shanty', ', Celtic\nX: Sea shanty/Shanty/Sea shanties').replace(', Phonk, Drill, Bounce', ', Phonk, Bounce');
  const used = usedKeys(src.a, src.no);
  add(src, bucketise(used, FD.music.genre.map(n => [n, 'R'])));
}

/* ───────── FRUIT & VEG (hand-written, big) ───────── */
OUT.push({ id: 'fruit', cat: 'food', q: 'Name a fruit', a: `
C: Apple, Banana, Orange, Strawberry, Grape, Mango
H: Tomato, Avocado, Dragon fruit/Dragonfruit/Pitaya, Durian
O: Pear, Peach, Plum, Cherry, Pineapple, Watermelon, Melon, Lemon, Lime, Kiwi/Kiwi fruit/Kiwifruit, Blueberry, Raspberry, Blackberry, Apricot, Coconut, Pomegranate, Papaya, Fig, Grapefruit, Nectarine, Lychee/Litchi, Passion fruit/Passionfruit, Guava, Cranberry, Date, Persimmon/Sharon fruit, Clementine, Tangerine, Mandarin, Satsuma, Cantaloupe, Honeydew/Honeydew melon, Plantain, Kumquat, Quince, Gooseberry, Elderberry, Redcurrant/Red currant, Blackcurrant/Black currant, Mulberry, Starfruit/Star fruit/Carambola, Jackfruit, Rambutan, Mangosteen, Pomelo, Yuzu, Olive, Rhubarb, Physalis/Cape gooseberry, Damson, Greengage, Crab apple, Grape fruit, Granny Smith, Blood orange, Goji berry/Goji, Acai/Açaí, Sultana, Raisin, Prune, Currant
R: Loganberry, Tayberry, Boysenberry, Cloudberry, Lingonberry, Huckleberry, Longan, Tamarind, Soursop/Guanabana/Graviola, Custard apple/Cherimoya, Sapodilla, Jabuticaba, Feijoa, Medlar, Sloe, Kiwano/Horned melon, Salak/Snake fruit, Acerola/Barbados cherry, Ugli fruit/Ugli, Finger lime, Breadfruit, Ackee, Mamey/Mamey sapote, Pawpaw, Loquat, Bilberry, Dewberry, Chokeberry/Aronia, Saskatoon berry/Serviceberry/Juneberry, Rowan berry/Rowan, Hawthorn berry, Salmonberry, Thimbleberry, Marionberry, Jostaberry, Ugni/Chilean guava, Pepino, Tamarillo/Tree tomato, Black sapote/Chocolate pudding fruit, White sapote, Canistel/Egg fruit, Rose apple, Wax apple, Jujube/Red date, Bael, Wood apple, Santol, Langsat, Duku, Pulasan, Marang, Cempedak, Lucuma, Cupuaçu/Cupuacu, Pequi, Camu camu, Bacuri, Buriti, Açaí berry, Monstera deliciosa/Fruit salad plant, Ice cream bean, Marula, Baobab fruit/Baobab, Safou/African pear, Horned cucumber, Calamansi, Bergamot, Citron, Buddha's hand, Etrog, Key lime, Meyer lemon, Tangelo, Minneola, Navel orange, Seville orange, Cara cara, Sumo citrus/Dekopon, Pluot, Plumcot, Aprium, Peacotum, Saturn peach/Flat peach/Donut peach, Paraguayo, Galia melon, Charentais melon, Crenshaw melon, Casaba melon, Bitter melon, Cucumber, Pumpkin, Aubergine/Eggplant, Pepper/Bell pepper, Courgette/Zucchini, Squash, Chilli/Chili, Okra, Pea pod, Grape tomato, Muscadine, Concord grape, Barberry, Sea buckthorn, Cornelian cherry, Morello cherry, Maraschino cherry, Sour cherry, Bing cherry, Rainier cherry, Wild strawberry/Alpine strawberry, Pineberry, White currant, Red banana, Lady finger banana, Cavendish, Gros Michel, Medjool date, Deglet Nour, Hala fruit/Pandanus, Noni, Pitanga/Surinam cherry, Grumichama, Jaboticaba, Abiu, Rollinia/Biribá, Atemoya, Sugar apple/Sweetsop, Ilama, Pond apple, Mabolo, Velvet apple, Kepel, Gac fruit/Gac, Rambai, Kedondong/Ambarella, Bignay, Kundang, Matoa
X: Miracle fruit/Miracle berry`, fact: 'A West African berry that makes sour things taste sweet for up to an hour afterwards.',
  no: 'Potato: A vegetable; Carrot: A root vegetable; Broccoli: A vegetable; Lettuce: A vegetable; Onion: A vegetable; Fruit: Name one!; Nut: Name a fruit, not a nut; Peanut: A legume, not a fruit; Chocolate: Made from cacao seeds — not a fruit; Jam: A spread made from fruit; Fruit Pastilles: Sweets' });

OUT.push({ id: 'veg', cat: 'food', q: 'Name a vegetable', a: `
C: Carrot, Potato, Broccoli, Onion, Pea/Peas, Cabbage
H: Sweetcorn/Corn/Sweet corn, Mushroom, Avocado
O: Cauliflower, Lettuce, Spinach, Cucumber, Pepper/Bell pepper/Capsicum, Courgette/Zucchini, Aubergine/Eggplant, Celery, Leek, Garlic, Beetroot/Beet, Parsnip, Turnip, Swede/Rutabaga, Sweet potato/Yam, Kale, Asparagus, Artichoke/Globe artichoke, Green bean/French bean/String bean, Broad bean/Fava bean, Runner bean, Brussels sprout/Sprout/Sprouts/Brussel sprout, Radish, Pumpkin, Squash, Butternut squash, Okra/Ladies' fingers, Pak choi/Bok choy, Chard/Swiss chard, Rocket/Arugula, Watercress, Fennel, Kohlrabi, Celeriac, Cassava/Yuca/Manioc, Taro, Shallot, Spring onion/Scallion/Green onion, Chilli/Chili/Chilli pepper, Tomato, Beansprouts/Bean sprouts, Red cabbage, Savoy cabbage, Iceberg lettuce, Romaine/Cos lettuce, Little gem, Mangetout/Snow pea, Sugar snap/Sugar snap pea, Edamame, Lentil, Chickpea, Kidney bean, Baby corn, New potato, Jacket potato, Red onion
R: Salsify, Scorzonera, Jerusalem artichoke/Sunchoke, Jicama, Daikon/Mooli, Lotus root, Bamboo shoot, Water chestnut, Fiddlehead/Fiddlehead fern, Samphire, Sea kale, Purslane, Endive, Chicory, Radicchio, Frisée/Frisee, Romanesco, Cavolo nero/Black kale/Tuscan kale, Kai lan/Chinese broccoli/Gai lan, Choy sum, Tatsoi, Mizuna, Burdock, Yacón/Yacon, Oca, Ulluco, Malanga, Chayote/Christophene, Bitter melon/Karela/Bitter gourd, Drumstick/Moringa, Bottle gourd/Calabash, Snake gourd, Ridge gourd, Luffa/Loofah, Tindora/Ivy gourd, Winged bean, Yardlong bean/Snake bean, Lima bean/Butter bean, Borlotti bean, Cannellini bean, Black-eyed pea, Pinto bean, Mung bean, Adzuki bean, Soybean/Soya bean, Okra, Nettle, Dandelion greens, Collard greens/Collards, Mustard greens, Turnip greens, Beet greens, Spring greens, Sorrel, Lamb's lettuce/Corn salad/Mâche, Land cress, Celtuce, Kohlrabi, Rapini/Broccoli rabe, Tenderstem/Broccolini, Purple sprouting broccoli, Cardoon, Horseradish, Wasabi, Ginger, Galangal, Turmeric root, Parsley root, Hamburg parsley, Skirret, Crosne/Chinese artichoke, Mashua, Arracacha, Celery root, Leek greens, Ramps/Wild garlic/Ramsons, Garlic scapes, Elephant garlic, Pearl onion, Cipollini, Vidalia onion, Shiitake, Portobello, Chestnut mushroom, Oyster mushroom, Enoki, Truffle, Kelp/Seaweed, Nori, Laverbread, Kohl, Okahijiki, Fat hen, Good King Henry, Orache, Ice plant, Sea beet, Agretti, Puntarelle, Tromboncino, Delicata squash, Acorn squash, Spaghetti squash, Kabocha, Hubbard squash, Pattypan squash, Marrow, Gherkin, Cornichon, Pickle
X: Romanesco`, fact: 'Its spirals are a natural fractal: every bud is made of smaller buds in the same pattern.',
  no: 'Apple: That\'s a fruit; Banana: That\'s a fruit; Strawberry: That\'s a fruit; Rice: A grain; Bread: Not a vegetable; Chips/Fries: Nice try; Vegetable: Name one!; Ketchup: Not since the 1980s' });
{ const v = OUT.find(q => q.id === 'veg'); v.a = v.a.replace(', Okra, Nettle', ', Nettle').replace(', Celtuce, Kohlrabi, Rapini', ', Celtuce, Rapini').replace(', Romanesco, Cavolo', ', Cavolo').replace(', Kohl, Okahijiki', ', Okahijiki'); }
{ const f = OUT.find(q => q.id === 'fruit'); f.a = f.a.replace(', Grape fruit, Granny Smith', ', Granny Smith').replace(', Açaí berry, Monstera', ', Monstera').replace(', Jaboticaba, Abiu', ', Abiu'); }
{ const used = usedKeys(OUT.find(q => q.id === 'fruit').a, ''); const g = bucketise(used, FD.food.fruit.map(n => [cap(n), 'R'])); if (g) OUT.find(q => q.id === 'fruit').a += '\n' + g; }
{ const used = usedKeys(OUT.find(q => q.id === 'veg').a, ''); const g = bucketise(used, FD.food.vegetable.map(n => [cap(n), 'R'])); if (g) OUT.find(q => q.id === 'veg').a += '\n' + g; }

/* ───────── BRANDS ───────── */
OUT.push({ id: 'tech', cat: 'brands', q: 'Name a tech company', a: `
C: Apple, Google/Alphabet, Microsoft, Amazon, Meta/Facebook, Tesla
H: Nokia, BlackBerry/RIM, Myspace/MySpace
O: Netflix, Samsung, Sony, IBM, Intel, Nvidia, AMD, Oracle, Cisco, Dell, HP/Hewlett-Packard, Lenovo, Huawei, Xiaomi, Spotify, Uber, Airbnb, X/Twitter, ByteDance/TikTok, Snap/Snapchat, Pinterest, Reddit, LinkedIn, PayPal, eBay, Adobe, Salesforce, OpenAI, Anthropic, SpaceX, Zoom, Slack, Dropbox, Shopify, Stripe, Canva, Atlassian, Discord, Twitch, Valve, Epic Games, Nintendo, Electronic Arts/EA, Activision/Activision Blizzard, Blizzard, Ubisoft, Roblox, Unity, Qualcomm, Arm/ARM, TSMC, ASML, Siemens, Philips, LG, Panasonic, Toshiba, Canon, Nikon, Fujitsu, Asus, Acer, Logitech, GoPro, Fitbit, Garmin, Yahoo, AOL, Baidu, Alibaba, Tencent, Rakuten, Booking.com/Booking, Expedia, Tripadvisor, Deliveroo, Just Eat, DoorDash, Instacart, Lyft, Revolut, Monzo, Klarna, Wise/TransferWise, Coinbase, Binance, Robinhood, Palantir, Snowflake, Databricks, MongoDB, GitHub, GitLab, Figma, Notion, Airtable, Asana, Trello, Miro, Zapier, HubSpot, Mailchimp, Squarespace, Wix, Automattic/WordPress, Cloudflare, Akamai, Twilio, Okta, Workday, SAP, ServiceNow, Intuit, Block/Square, Sage, Xero, Tinder, Bumble, Hinge, Match Group, WhatsApp, Telegram, Signal, Skype, Duolingo, Grammarly, DeepMind/Google DeepMind, Mistral/Mistral AI, Hugging Face, Perplexity, xAI, Midjourney, Stability AI, Character.AI, Patreon, Substack, Medium, Quora, Wikipedia/Wikimedia, Mozilla/Firefox, Opera, DuckDuckGo, Brave, Proton/ProtonMail, Raspberry Pi, Arduino, Sonos, Bose, Dyson, Peloton, Ring, Nest, Instagram, YouTube, Waymo, Rivian, BYD, Arm Holdings, Micron, Western Digital, Seagate, Broadcom, Texas Instruments, Dell Technologies, VMware, Red Hat, Canonical/Ubuntu, Accenture, Infosys, Tata Consultancy Services/TCS, Wipro, Capgemini, Deloitte, Atari, Sega, Commodore, Sinclair, Amstrad, Psion, Compaq, Gateway, Sun Microsystems, Silicon Graphics/SGI, Xerox, Kodak, Polaroid, Motorola, Ericsson, Sony Ericsson, HTC, OnePlus, Oppo, Vivo, Realme, Honor, ZTE, Alcatel, Vodafone, BT, EE, O2, Three, Verizon, AT&T, T-Mobile, Comcast, Sky, Virgin Media, Ocado, Rightmove, Zoopla, Trainline, Skyscanner, Farfetch, ASOS, Depop, Vinted, Etsy, Gumtree, Craigslist, Groupon, Yelp, Glassdoor, Indeed, Fiverr, Upwork, Monday.com, ClickUp, Calendly, DocuSign, Box, Evernote, LastPass, 1Password, NordVPN, Kaspersky, Norton, McAfee, Avast, CrowdStrike, Palo Alto Networks, Fortinet, Darktrace, Arm, Graphcore, Ocado Technology, Improbable, Babylon, Deliveroo, Bolt, Grab, Gojek, Sea Limited/Shopee, Flipkart, Paytm, Ola, Zomato, Swiggy, Jio, MercadoLibre/Mercado Libre, Nubank, Rappi, Kakao, Naver, Line, Coupang, Nexon, Krafton, NetEase, Sony Interactive, Square Enix, Capcom, Konami, Bandai Namco, FromSoftware, Rockstar/Rockstar Games, Take-Two, Bungie, Riot Games, Mojang, Supercell, Rovio, King, Zynga, CD Projekt, Paradox, Frontier, Rare, Codemasters, Sumo Digital, Jagex, Fanvue
X: Fairchild Semiconductor/Fairchild`, fact: 'Its breakaway engineers — the "Fairchildren" — went on to found Intel, AMD and much of Silicon Valley.',
  no: 'Coca-Cola/Coke: A drinks company; McDonald\'s/McDonalds: A fast-food chain; Nike: Sportswear; Toyota: A carmaker; Disney: Entertainment, not tech; Tech: Name a company!; Silicon Valley: That\'s a place' });
const splitTier = (q, from, keep, to) => { q.a = q.a.split('\n').map(line => { const m = line.match(new RegExp('^' + from + ':\\s*(.*)$')); if (!m) return line; const it = m[1].split(',').map(x => x.trim()); return it.length > keep ? `${from}: ${it.slice(0, keep).join(', ')}\n${to}: ${it.slice(keep).join(', ')}` : line; }).join('\n'); };
{ const t = OUT.find(q => q.id === 'tech'); t.a = t.a.replace(', Darktrace, Arm, Graphcore', ', Darktrace, Graphcore').replace(', Babylon, Deliveroo, Bolt', ', Babylon, Bolt').replace(', Jagex, Fanvue\nX: Fairchild Semiconductor/Fairchild', ', Jagex\nX: Fairchild Semiconductor/Fairchild, Fanvue'); splitTier(t, 'O', 120, 'R'); }

OUT.push({ id: 'cars', cat: 'brands', q: 'Name a car brand', a: `
C: Ford, BMW, Toyota, Mercedes-Benz/Mercedes/Merc, Audi, Volkswagen/VW
H: Lamborghini/Lambo, Ferrari, DeLorean
O: Honda, Nissan, Tesla, Porsche, Volvo, Jaguar, Land Rover, Range Rover, Mini, Fiat, Renault, Peugeot, Citroën/Citroen, Vauxhall, Opel, Kia, Hyundai, Mazda, Subaru, Mitsubishi, Suzuki, Lexus, Skoda/Škoda, SEAT/Seat, Cupra, Dacia, Alfa Romeo, Maserati, Bentley, Rolls-Royce/Rolls Royce, Aston Martin, McLaren, Bugatti, Lotus, Chevrolet/Chevy, Cadillac, Jeep, Dodge, Chrysler, Buick, GMC, Lincoln, Ram, Infiniti, Acura, Genesis, Polestar, BYD, Rivian, Lucid, MG, Smart, Saab, Abarth, Alpine, DS/DS Automobiles, Lada, Koenigsegg, Pagani, Rimac, Hummer, Pontiac, Plymouth, Oldsmobile, Saturn, Mercury, Isuzu, Daihatsu, Datsun, Proton, Tata, Mahindra, Maruti Suzuki/Maruti, Geely, Chery, Great Wall, Nio, Xpeng, Li Auto, SsangYong/KGM, Holden, TVR, Morgan, Caterham, Triumph, Rover, Austin, Morris, Reliant, Trabant, Lancia, Maybach, Jaguar Land Rover/JLR, Leapmotor, Omoda, Jaecoo, Zeekr, Lynk & Co/Lynk and Co, VinFast
R: Noble, Ariel, Bristol, Hillman, Talbot, Sunbeam, Wartburg, Zastava, Yugo, Tatra, Spyker, De Tomaso, Hispano-Suiza, Studebaker, Packard, Hudson, Nash, AMC/American Motors, Tucker, Duesenberg, Cord, Auburn, Edsel, Scion, Fisker, Togg, Hongqi, Borgward, Wiesmann, Apollo/Gumpert, Hennessey, SSC, Czinger, Vector, Saleen, Shelby, Panoz, Ginetta, Radical, Westfield, Marcos, Jensen, AC/AC Cars, Gordon Murray/GMA, Perodua, Daewoo, Ssangyong, Wolseley, Riley, Singer, Humber, Vanden Plas, Lagonda, Invicta, Allard, Healey/Austin-Healey, Frazer Nash, Lanchester, Daimler, Armstrong Siddeley, Alvis, Standard, Jowett, Bond, Gilbern, Rochdale, Ginetta, DKW, NSU, Horch, Wanderer, Glas, Messerschmitt, Heinkel, Isetta, Goggomobil, Simca, Panhard, Facel Vega, Delahaye, Delage, Talbot-Lago, Matra, Venturi, Iso, Bizzarrini, Autobianchi, Innocenti, Cisitalia, Siata, Moskvitch, Volga/GAZ, ZIL, UAZ, Aurus, Dacia, Kaiser, Willys, Crosley, Checker, DeSoto, LaSalle, Imperial, Eagle, Geo, Excalibur, Avanti, Stutz, Pierce-Arrow, Peerless, Marmon, Mercer, Elio, Aptera, Polestar, Ineos, Lotus Cars, Brabus, Alpina, Ruf, Gemballa, Mansory, Donkervoort, Vencer, W Motors, Lykan, Zenvo, Arash, Keating, Elfin, Bolwell, HSV, FPV, Troller, Gurgel, Hindustan/Hindustan Ambassador, Premier, Force Motors, Kia Motors, Sinclair C5/C5
X: Peel/Peel P50`, fact: 'The Peel P50, built on the Isle of Man, is the smallest production car ever made.',
  no: 'Harley-Davidson/Harley: Motorbikes; Ducati: Motorbikes; Yamaha: Motorbikes (and pianos); Kawasaki: Motorbikes; Vespa: A scooter; Boeing: Planes; Michelin: Tyres; Shell: Fuel; Uber: A ride app; Batmobile: Fictional; Herbie: A Volkswagen Beetle — name the brand; KITT: A Pontiac — name the brand' });
{ const c = OUT.find(q => q.id === 'cars'); c.a = c.a.replace(', Daewoo, Ssangyong, Wolseley', ', Daewoo, Wolseley').replace(', Rochdale, Ginetta, DKW', ', Rochdale, DKW').replace(', Aurus, Dacia, Kaiser', ', Aurus, Kaiser').replace(', Ineos, Lotus Cars, Brabus', ', Ineos, Brabus').replace(', Elio, Aptera, Polestar, Ineos', ', Elio, Aptera, Ineos').replace(', Premier, Force Motors, Kia Motors, Sinclair', ', Premier, Force Motors, Sinclair'); }
{ const c = OUT.find(q => q.id === 'cars'); const used = usedKeys(c.a, c.no); const g = bucketise(used, FD.vehicle.manufacturer.map(n => [n, 'R'])); if (g) c.a += '\n' + g; }

/* ───────── CAPITAL CITIES (every country's capital, ranked by city population) ───────── */
{
  const wc = require('world-countries').filter(c => c.unMember || ['Vatican City', 'Palestine', 'Kosovo', 'Taiwan'].includes(c.name.common));
  const pop = new Map(); for (const c of cities) { const k = keyOf(c.name) + ':' + c.country; if (!pop.has(k) || pop.get(k) < c.population) pop.set(k, c.population); }
  const ALIAS = { 'Washington D.C.': 'Washington DC/Washington/DC/Washington D.C.', 'Ulan Bator': 'Ulaanbaatar/Ulan Bator', 'Saint John\'s': 'St John\'s/Saint John\'s', 'St. George\'s': 'St George\'s', 'Luxembourg': 'Luxembourg City/Luxembourg', 'City of San Marino': 'San Marino/City of San Marino', 'South Tarawa': 'South Tarawa/Tarawa', 'Brasília': 'Brasília/Brasilia', 'Bogotá': 'Bogotá/Bogota', 'Chișinău': 'Chișinău/Chisinau', 'Kyiv': 'Kyiv/Kiev', 'Beijing': 'Beijing/Peking', 'New Delhi': 'New Delhi/Delhi', 'Reykjavik': 'Reykjavik/Reykjavík', 'Sana\'a': 'Sana\'a/Sanaa', 'Yaoundé': 'Yaoundé/Yaounde', 'Asunción': 'Asunción/Asuncion', 'Lomé': 'Lomé/Lome', 'Malé': 'Malé/Male', 'San José': 'San José/San Jose', 'Naypyidaw': 'Naypyidaw/Nay Pyi Taw', 'N\'Djamena': 'N\'Djamena/Ndjamena', 'Nuku\'alofa': 'Nuku\'alofa/Nukualofa', 'Port of Spain': 'Port of Spain/Port-of-Spain', 'Astana': 'Astana/Nur-Sultan' };
  const C = ['London', 'Paris', 'Rome', 'Tokyo', 'Berlin', 'Madrid'], H = ['Canberra', 'Ottawa', 'Brasília'];
  const FAMOUS = ['Washington D.C.', 'Wellington', 'Bern', 'Amsterdam', 'Brussels', 'Vienna', 'Dublin', 'Lisbon', 'Athens', 'Oslo', 'Stockholm', 'Copenhagen', 'Helsinki', 'Warsaw', 'Prague', 'Budapest', 'Moscow', 'Kyiv', 'Ankara', 'Cairo', 'Nairobi', 'Pretoria', 'Cape Town', 'New Delhi', 'Beijing', 'Seoul', 'Bangkok', 'Hanoi', 'Manila', 'Jakarta', 'Kuala Lumpur', 'Singapore', 'Buenos Aires', 'Santiago', 'Lima', 'Bogotá', 'Mexico City', 'Havana', 'Kingston', 'Reykjavik', 'Jerusalem', 'Tehran', 'Baghdad', 'Kabul', 'Islamabad', 'Riyadh', 'Abu Dhabi', 'Doha', 'Monaco', 'Vatican City', 'Luxembourg', 'Valletta', 'Nicosia', 'Taipei', 'Pyongyang', 'Kathmandu', 'Damascus', 'Beirut', 'Rabat', 'Tunis', 'Algiers', 'Accra', 'Abuja', 'Addis Ababa', 'Caracas', 'Montevideo', 'Quito', 'Belgrade', 'Bucharest', 'Sofia', 'Zagreb', 'Tallinn', 'Riga', 'Vilnius', 'Minsk', 'Tbilisi', 'Yerevan', 'Baku', 'Astana', 'Ulan Bator', 'Dhaka', 'Colombo', 'Canberra'];
  const rows = [];
  for (const c of wc) for (const cap of c.capital || []) rows.push({ name: cap, pop: pop.get(keyOf(cap) + ':' + c.cca2) || 0 });
  const used = new Set();
  const head = { C: [], H: [], X: ['Ngerulmud'] };
  for (const r of rows) { if (C.includes(r.name)) head.C.push(r.name); else if (H.includes(r.name)) head.H.push(ALIAS[r.name] || r.name); }
  const rest = rows.filter(r => !C.includes(r.name) && !H.includes(r.name) && r.name !== 'Ngerulmud').sort((a, b) => (FAMOUS.includes(b.name) - FAMOUS.includes(a.name)) || b.pop - a.pop);
  const src = { id: 'capital', cat: 'geo', q: 'Name a capital city', a: `C: ${C.join(', ')}\nH: ${head.H.join(', ')}\nX: Ngerulmud\nO: Edinburgh, Cardiff, Belfast`,
    fact: 'Palau\'s capital has only a few hundred residents: the least populated national capital in the world.',
    no: 'Sydney: Australia\'s capital is Canberra; Melbourne: Australia\'s capital is Canberra; Rio de Janeiro/Rio: Brazil\'s capital moved to Brasília in 1960; Istanbul: Turkey\'s capital is Ankara; Lagos: Nigeria\'s capital moved to Abuja in 1991; Toronto: Canada\'s capital is Ottawa; New York/New York City/NYC: The US capital is Washington, D.C.; Zurich/Zürich: Switzerland\'s capital is Bern; Geneva: Switzerland\'s capital is Bern; Auckland: New Zealand\'s capital is Wellington; Mumbai/Bombay: India\'s capital is New Delhi; Dubai: The UAE\'s capital is Abu Dhabi; Almaty: Kazakhstan\'s capital moved to Astana in 1997; Karachi: Pakistan\'s capital is Islamabad; Yangon/Rangoon: Myanmar\'s capital moved to Naypyidaw in 2006; Dar es Salaam: Tanzania\'s official capital is Dodoma; Casablanca: Morocco\'s capital is Rabat; Johannesburg: South Africa\'s capitals are Pretoria, Cape Town and Bloemfontein; Barcelona: Not a national capital; Milan: Not a capital; Munich: Not a capital; Saint Petersburg/St Petersburg: Russia\'s capital moved to Moscow in 1918; Ho Chi Minh City/Saigon: Vietnam\'s capital is Hanoi; Shanghai: China\'s capital is Beijing; Bonn: Germany\'s capital has been Berlin since reunification; The Hague: The seat of government — Amsterdam is the capital; Abidjan: Ivory Coast\'s capital is Yamoussoukro; Tel Aviv: Israel names Jerusalem as its capital, though most embassies are in Tel Aviv; Los Angeles/LA: Not a capital; Chicago: Not a capital; Manchester: Not a capital; Glasgow: Scotland\'s capital is Edinburgh' };
  const u = usedKeys(src.a, src.no);
  const extra = 'R: La Paz, Putrajaya, Sri Jayawardenepura Kotte/Kotte, Mbabane, Cotonou';
  src.a += '\n' + extra; for (const k of usedKeys(extra, '')) u.add(k);
  add(src, bucketRanked(u, rest.map(r => ALIAS[r.name] ? ALIAS[r.name].split('/')[0] : r.name), false));
  // put the aliases back on the generated names
  src.a = src.a.split('\n').map(line => line.replace(/^([ORF]):\s*(.*)$/, (m, t, items) => `${t}: ${items.split(', ').map(n => { const a = Object.values(ALIAS).find(v => v.split('/')[0] === n); return a || n; }).join(', ')}`)).join('\n');
}

/* ───────── ANY COUNTRY (all 193 UN members + Vatican, Palestine, Kosovo, Taiwan) ───────── */
{
  const wc = require('world-countries').filter(c => c.unMember || ['Vatican City', 'Palestine', 'Kosovo', 'Taiwan'].includes(c.name.common));
  const ALIAS = { 'United States': 'United States/USA/US/America/United States of America', 'United Kingdom': 'United Kingdom/UK/Britain/Great Britain', 'Vatican City': 'Vatican City/Vatican/Holy See', 'Czechia': 'Czechia/Czech Republic', 'DR Congo': 'DR Congo/Democratic Republic of the Congo/DRC/Congo-Kinshasa', 'Republic of the Congo': 'Republic of the Congo/Congo-Brazzaville', 'Ivory Coast': "Ivory Coast/Côte d'Ivoire/Cote d Ivoire", 'Myanmar': 'Myanmar/Burma', 'Eswatini': 'Eswatini/Swaziland', 'Timor-Leste': 'Timor-Leste/East Timor', 'Türkiye': 'Turkey/Türkiye', 'Cape Verde': 'Cape Verde/Cabo Verde', 'Netherlands': 'Netherlands/Holland', 'North Macedonia': 'North Macedonia/Macedonia', 'South Korea': 'South Korea/Korea', 'North Korea': 'North Korea/DPRK', 'United Arab Emirates': 'United Arab Emirates/UAE/Emirates', 'Bosnia and Herzegovina': 'Bosnia and Herzegovina/Bosnia', 'Micronesia': 'Micronesia/Federated States of Micronesia', 'Gambia': 'Gambia/The Gambia', 'Bahamas': 'Bahamas/The Bahamas', 'Philippines': 'Philippines/The Philippines', 'São Tomé and Príncipe': 'São Tomé and Príncipe/Sao Tome and Principe/Sao Tome', 'Palestine': 'Palestine/State of Palestine', 'Trinidad and Tobago': 'Trinidad and Tobago/Trinidad', 'Antigua and Barbuda': 'Antigua and Barbuda/Antigua', 'Saint Kitts and Nevis': 'Saint Kitts and Nevis/St Kitts and Nevis/St Kitts', 'Saint Lucia': 'Saint Lucia/St Lucia', 'Saint Vincent and the Grenadines': 'Saint Vincent and the Grenadines/St Vincent' };
  const C = ['United States', 'United Kingdom', 'France', 'China', 'Japan', 'Germany'];
  const H = ['Vatican City', 'Liechtenstein', 'Kazakhstan'];
  const O = ['Italy', 'Spain', 'Canada', 'Australia', 'Brazil', 'Mexico', 'India', 'Russia', 'Ireland', 'Portugal', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Poland', 'Greece', 'Türkiye', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Morocco', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Cuba', 'Jamaica', 'New Zealand', 'South Korea', 'North Korea', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Afghanistan', 'Iran', 'Iraq', 'Israel', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Ukraine', 'Czechia', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Ethiopia', 'Ghana', 'Algeria', 'Tunisia', 'Libya', 'Sudan', 'Somalia', 'Uganda', 'Tanzania', 'Zimbabwe', 'Madagascar', 'Mongolia', 'Bolivia', 'Ecuador', 'Uruguay', 'Paraguay', 'Haiti', 'Dominican Republic', 'Monaco', 'Luxembourg', 'Malta', 'Cyprus', 'Taiwan', 'Jordan', 'Lebanon', 'Syria', 'Kuwait', 'Fiji', 'Bahamas', 'Barbados', 'Costa Rica', 'Panama', 'Maldives', 'Bhutan', 'Cambodia', 'Laos', 'Myanmar'];
  const F = ['Nauru', 'Palau', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Saint Vincent and the Grenadines', 'Saint Kitts and Nevis', 'Comoros', 'São Tomé and Príncipe', 'Vanuatu', 'Solomon Islands', 'Equatorial Guinea', 'Djibouti', 'Eritrea'];
  const tierOf = (n) => (C.includes(n) ? 'C' : H.includes(n) ? 'H' : O.includes(n) ? 'O' : F.includes(n) ? 'F' : n === 'Tuvalu' ? 'X' : 'R');
  const lines = { C: [], H: [], O: [], R: [], F: [], X: [] };
  for (const c of wc) { const n = c.name.common; lines[tierOf(n)].push(ALIAS[n] || n); }
  lines.O.push('England', 'Scotland', 'Wales', 'Northern Ireland');
  for (const t of ['C', 'H', 'O', 'F']) { const want = { C, H, O, F }[t]; lines[t].sort((a, b) => want.indexOf(a.split('/')[0] === 'Turkey' ? 'Türkiye' : a.split('/')[0]) - want.indexOf(b.split('/')[0] === 'Turkey' ? 'Türkiye' : b.split('/')[0])); }
  OUT.push({ id: 'country', cat: 'geo', q: 'Name a country', a: Object.entries(lines).filter(([, v]) => v.length).map(([t, v]) => `${t}: ${v.join(', ')}`).join('\n'),
    fact: 'Its .tv internet domain brings in a big slice of the country\'s income.',
    no: 'Puerto Rico: A US territory; Greenland: Part of the Kingdom of Denmark; Hong Kong: Part of China; Macau/Macao: Part of China; Tibet: Part of China; Western Sahara: A disputed territory; Somaliland: Self-declared, not recognised; Gibraltar: A British overseas territory; Bermuda: A British overseas territory; Guam: A US territory; Hawaii: A US state; Texas: A US state; Antarctica: A continent; Africa: A continent; Europe: A continent; Asia: A continent; Catalonia: Part of Spain; Siam: Thailand\'s old name; Persia: Iran\'s old name; Ceylon: Sri Lanka\'s old name; Zaire: The old name for DR Congo; Rhodesia: The old name for Zimbabwe; Yugoslavia: No longer exists; USSR/Soviet Union: No longer exists; Czechoslovakia: No longer exists' });
}

/* ───────── ANY ANIMAL ───────── */
{
  const src = { id: 'animal', cat: 'sci', q: 'Name an animal', a: `
C: Dog, Cat, Lion, Elephant, Tiger, Giraffe
H: Platypus, Axolotl, Capybara, Quokka
O: Horse, Cow, Pig, Sheep, Goat, Chicken, Duck, Rabbit, Mouse, Rat, Hamster, Guinea pig, Monkey, Gorilla, Chimpanzee, Orangutan, Bear, Polar bear, Panda, Koala, Kangaroo, Wolf, Fox, Deer, Moose, Zebra, Hippo/Hippopotamus, Rhino/Rhinoceros, Camel, Llama, Alpaca, Cheetah, Leopard, Jaguar, Hyena, Crocodile, Alligator, Snake, Lizard, Turtle, Tortoise, Frog, Toad, Shark, Whale, Dolphin, Octopus, Squirrel, Hedgehog, Bat, Owl, Eagle, Penguin, Parrot, Flamingo, Ostrich, Sloth, Otter, Badger, Beaver, Raccoon, Skunk, Armadillo, Anteater, Meerkat, Lemur, Chameleon, Iguana, Gecko, Bee, Ant, Butterfly, Spider, Snail, Worm, Crab, Lobster, Jellyfish, Starfish, Seal, Walrus, Bison, Buffalo, Yak, Donkey, Mule, Reindeer, Elk, Gazelle, Antelope, Wildebeest, Warthog, Tapir, Okapi, Pangolin, Wombat, Tasmanian devil, Dingo, Mongoose, Porcupine, Mole, Ferret, Weasel, Stoat, Mink, Lynx, Puma/Cougar/Mountain lion, Panther, Ocelot, Jackal, Coyote, Baboon, Gibbon, Macaque, Mandrill
X: Aye-aye`, fact: 'A Madagascan lemur that taps on wood with a long, thin middle finger and listens for grubs inside.',
    no: 'Unicorn: Mythical; Dragon: Mythical (komodo dragons count, though); Mermaid: Mythical; Bigfoot/Yeti: Unproven; Dinosaur: Extinct — and a group, not one animal; Animal: Name one!; Pokémon: Fictional' };
  const used = usedKeys(src.a, src.no);
  const lists = ['cat', 'cetacean', 'crocodilia', 'fish', 'insect', 'rodent', 'rabbit', 'bear', 'lion', 'snake', 'horse', 'cow', 'bird', 'dog', 'type'];
  add(src, bucketise(used, lists.flatMap(l => (FD.animal[l] || []).map(n => [cap(n), 'R']))));
}
/* ───────── AIRLINES ───────── */
{
  const src = { id: 'airline', cat: 'brands', q: 'Name an airline', a: `
C: British Airways/BA, Ryanair, easyJet/Easyjet, Emirates, American Airlines, Lufthansa
H: Virgin Atlantic, Qantas, Air New Zealand
O: Delta/Delta Air Lines, United/United Airlines, Southwest, Air France, KLM, Qatar Airways, Etihad, Singapore Airlines, Cathay Pacific, Turkish Airlines, Aer Lingus, Iberia, Alitalia, ITA Airways, Swiss/Swiss International Air Lines, Austrian Airlines, SAS/Scandinavian Airlines, Finnair, Norwegian, Wizz Air, Jet2/Jet2.com, TUI/TUI Airways, Vueling, Air Canada, WestJet, JetBlue, Alaska Airlines, Spirit, Frontier, Hawaiian Airlines, Aeroméxico/Aeromexico, LATAM, Avianca, Copa Airlines, Japan Airlines/JAL, ANA/All Nippon Airways, Korean Air, Asiana, China Airlines, EVA Air, Air China, China Eastern, China Southern, Thai Airways, Malaysia Airlines, Garuda Indonesia, Philippine Airlines, Vietnam Airlines, AirAsia, Air India, IndiGo, Emirates (no), Saudia, Gulf Air, Oman Air, Royal Jordanian, El Al, EgyptAir, Ethiopian Airlines, Kenya Airways, South African Airways, Royal Air Maroc, Virgin Australia, Jetstar, Fiji Airways, Aeroflot, LOT/LOT Polish Airlines, Icelandair, Loganair, Flybe, Monarch, Thomas Cook Airlines, Pan Am, TWA, Concorde (no)
X: Pan Am (no)`.replace(', Emirates (no)', '').replace(', Concorde (no)', '').replace('X: Pan Am (no)', 'X: Braniff International/Braniff'),
    fact: 'A 1970s US airline that hired fashion designer Emilio Pucci for its uniforms and Alexander Calder to paint its planes.',
    no: 'Boeing: A plane maker; Airbus: A plane maker; Concorde: A plane, not an airline; Heathrow: An airport; Expedia: A booking site; Skyscanner: A booking site' };
  const used = usedKeys(src.a, src.no);
  add(src, bucketise(used, FD.airline.airline.map(a => [a.name, 'R'])));
}

/* ───────── EXTEND existing questions with dataset answers ───────── */
const src = (id) => ctx.BANK_SRC.find(q => q.id === id);
function extend(id, items) { const s = src(id); const used = usedKeys(s.a, s.no); const g = bucketise(used, items); if (g) EXT[id] = g; }
extend('dog', FD.animal.dog.map(n => [n, 'R']));
extend('seacreature', [...FD.animal.cetacean, ...FD.animal.crocodilia.filter(n => /salt|marine|sea/i.test(n))].map(n => [cap(n), 'R']));
extend('spice', FD.food.spice.map(n => [cap(n), 'R']));
extend('dino', dinos.map(n => [cap(n), 'R']));
extend('proglang', linguist.filter(l => l.type === 'programming').map(l => [l.name, 'R']));
extend('typeface', gfonts.map(f => [f.family, 'R']));
extend('element', FD.science.chemical_element.map(e => [e.name, 'R']));

/* ───────── write ───────── */
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
let js = '/* GENERATED by tools/build-bank.mjs — do not edit by hand. Big answer lists so almost any real answer counts. */\n';
js += 'BANK_SRC.push(\n' + OUT.map(q => `{id:${JSON.stringify(q.id)}, cat:${JSON.stringify(q.cat)},${q.exact ? ' exact:1,' : ''} q:${JSON.stringify(q.q)}, a:\`${esc(q.a.trim())}\`,\nfact:${JSON.stringify(q.fact)},\nno:${JSON.stringify(q.no || '')}}`).join(',\n') + '\n);\n';
js += 'const BANK_EXT = ' + JSON.stringify(EXT) + ';\nfor (const s of BANK_SRC) if (BANK_EXT[s.id]) s.a += "\\n" + BANK_EXT[s.id];\n';
fs.writeFileSync(ROOT + 'bank-gen.js', js);

/* report */
vm.runInContext(js, ctx);
for (const s of ctx.BANK_SRC) {
  if (!OUT.some(o => o.id === s.id) && !EXT[s.id]) continue;
  const q = ctx.parseQuestion(s); const c = q.counts;
  console.log(`${s.id.padEnd(10)} ${String(q.answers.length).padStart(5)} answers  C${c.c} H${c.h} O${c.o} R${c.r} F${c.f} X${c.x}`);
}
console.log('bank-gen.js', (js.length / 1024).toFixed(0) + ' KB');
