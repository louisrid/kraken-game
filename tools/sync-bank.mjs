// Keep the server's question bank identical to the browser's authored scripts.
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const ctx = vm.createContext({});
for (const file of ['bank.js', 'bank-gen.js', 'bank-fun.js', 'bank-extra.js']) {
  vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), ctx);
}
const json = JSON.stringify(vm.runInContext('BANK_SRC', ctx));
const target = new URL('db/question-bank.json', root);
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== json) throw new Error('Server question bank is stale. Run node tools/sync-bank.mjs.');
} else fs.writeFileSync(target, json);
