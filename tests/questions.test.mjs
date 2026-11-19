import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
const ctx = vm.createContext({});
for (const file of ['bank.js', 'bank-gen.js', 'bank-fun.js', 'bank-extra.js', 'engine.js']) vm.runInContext(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), ctx);
const { bank, pick, match } = vm.runInContext('({ bank: BANK_SRC.map(parseQuestion), pick: pickQuestions, match: matchAnswer })', ctx);
test('all 168 unique prompts have valid answers and new prompts cover every tier', () => {
  assert.equal(bank.length, 168);
  assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
  assert.equal(new Set(bank.map(q => q.prompt)).size, bank.length);
  for (const q of bank) {
    assert.ok(q.answers.length >= 10, q.id);
    if (bank.indexOf(q) >= 72) for (const tier of ['c','h','o','r','f','x']) assert.ok(q.counts[tier], q.id + ':' + tier);
    for (const a of q.answers) assert.ok(match(q, a.name).ok, `${q.id}: ${a.name}`);
  }
});
test('each full game is unique and covers the category mix', () => {
  for (let i = 0; i < 50; i++) {
    const picked = Array.from(pick(bank, [], 10, 'vs', [], 'test-' + i));
    assert.equal(new Set(picked).size, 10);
    const cats = picked.map(id => bank.find(q => q.id === id).cat);
    assert.ok(new Set(cats).size >= 5);
    for (let j = 1; j < cats.length; j++) assert.notEqual(cats[j], cats[j - 1]);
  }
});
test('exhaustion never falls back to recently seen prompts', () => {
  const avoid = bank.slice(0, -3).map(q => q.id);
  const picked = Array.from(pick(bank, [], 10, 'vs', avoid, 'exhaustion'));
  assert.equal(picked.length, 3);
  assert.ok(picked.every(id => !avoid.includes(id)));
  assert.equal(pick(bank, [], 10, 'vs', bank.map(q => q.id), 'all').length, 0);
});
test('different seeds shuffle questions and filters are respected', () => {
  assert.notDeepEqual(Array.from(pick(bank, [], 10, 'vs', [], 'one')), Array.from(pick(bank, [], 10, 'vs', [], 'two')));
  const picked = Array.from(pick(bank, ['food'], 5, 'vs', [], 'food'));
  assert.equal(picked.length, 5);
  assert.ok(picked.every(id => bank.find(q => q.id === id).cat === 'food'));
});
test('server bank matches the browser bank', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('../db/question-bank.json', import.meta.url), 'utf8')), JSON.parse(vm.runInContext('JSON.stringify(BANK_SRC)', ctx)));
});

test('shared surnames, words, prefixes and tied typos require a distinct answer', () => {
  const parse = vm.runInContext('parseQuestion', ctx);
  const people = parse({id:'names', ppl:1, a:'C: John Smith, Jane Smith\nR: Maya Chen'});
  assert.equal(match(people, 'Smith').kind, 'ambiguous');
  assert.equal(match(people, 'Jane Smith').name, 'Jane Smith');
  assert.equal(match(people, 'Chen').name, 'Maya Chen');
  const films = parse({id:'films', a:'C: Star Wars, Star Trek\nR: Strawberry Fields'});
  assert.equal(match(films, 'Star').kind, 'ambiguous');
  assert.equal(match(films, 'Star Tr').name, 'Star Trek');
  const prefixes = parse({id:'prefixes', a:'C: Strawberry Fields, Strawberry Jam'});
  assert.equal(match(prefixes, 'Strawb').kind, 'ambiguous');
  assert.equal(match(films, 'Strawb').name, 'Strawberry Fields');
  assert.equal(match(films, 'Star Wars').name, 'Star Wars');
  assert.equal(match(films, 'nonsense star nonsense').ok, false);
  const typos = parse({id:'typos', exact:1, a:'C: Stare, Store'});
  assert.equal(match(typos, 'Stire').kind, 'ambiguous');
  assert.equal(match(typos, 'Stroe').name, 'Store');
});
test('new banks preserve distinct answer identities and complete finite lists', () => {
  for (const q of bank.slice(72)) for (const a of q.answers) {
    assert.equal(match(q, a.name).id, a.id, `${q.id}: ${a.name}`);
  }
  assert.equal(bank.find(q => q.id === 'usstate').answers.length, 50);
  assert.equal(bank.find(q => q.id === 'africountry').answers.length, 54);
  assert.equal(bank.find(q => q.id === 'ukcounty').answers.length, 48);
  const games = bank.find(q => q.id === 'videogame');
  for (const [a,b] of [['Final Fantasy','Final Fantasy VII'],['Forza Motorsport','Forza Horizon'],['RuneScape','Old School RuneScape']]) {
    assert.notEqual(match(games,a).id,match(games,b).id);
  }
  assert.equal(match(games,'GTA V').id,match(games,'Grand Theft Auto V').id);
});
