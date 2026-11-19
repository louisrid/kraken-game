import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
const ctx = vm.createContext({});
for (const file of ['bank.js', 'bank-gen.js', 'bank-fun.js', 'bank-extra.js', 'engine.js']) vm.runInContext(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), ctx);
const { bank, pick, match } = vm.runInContext('({ bank: BANK_SRC.map(parseQuestion), pick: pickQuestions, match: matchAnswer })', ctx);
test('all 112 unique prompts have valid answers and new prompts cover every tier', () => {
  assert.equal(bank.length, 112);
  assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
  assert.equal(new Set(bank.map(q => q.prompt)).size, bank.length);
  for (const q of bank) {
    assert.ok(q.answers.length >= 10, q.id);
    if (bank.indexOf(q) >= bank.length - 40) for (const tier of ['c','h','o','r','f','x']) assert.ok(q.counts[tier], q.id + ':' + tier);
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
