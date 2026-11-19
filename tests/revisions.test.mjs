import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

// Exercise the actual authoritative host handler without starting network/UI loops.
const source = readFileSync(new URL('../game.js', import.meta.url), 'utf8');
function host() {
  const messages = [];
  let clock = 1000;
  const players = [{id:'me',seen:1000}, {id:'other',seen:1000}];
  const H = {phase:'play', set:{mode:'vs'}, players, round:2, introEnd:0, endsAt:5000, answers:{me:{aid:1}}};
  const ctx = vm.createContext({ H, ME:{id:'me'}, OFF_AFTER:7000, now:()=>clock,
    activePlayers:()=>players.filter(p=>!p.spec&&!p.gone),
    curQH:()=>({}),
    matchAnswer:(_,text)=> text === 'valid' ? {ok:true,id:2} : {ok:false,kind:'unknown',msg:'Try again'},
    direct:(id,m)=>messages.push({id,...m}),
  });
  vm.runInContext(source.slice(source.indexOf('function hostAnswer('), source.indexOf('function hostCrewSub(')),ctx);
  return { H, players, messages, answer:(text='valid')=>ctx.hostAnswer(players[0],text), setClock:t=>{clock=t;} };
}
test('a saved answer can change repeatedly while another player is choosing',()=>{
  const h=host(); h.answer();
  assert.equal(h.H.answers.me.aid,2);
  h.H.answers.me.aid=1; h.answer();
  assert.equal(h.H.answers.me.aid,2);
  assert.equal(h.messages.at(-1).kind,'locked');
});
test('all players locked prevents a last-moment answer replacement',()=>{
  const h=host(); h.H.answers.other={aid:3}; h.answer();
  assert.equal(h.H.answers.me.aid,1);
  assert.equal(h.messages.at(-1).aid,1);
});
test('expired rounds, reveals, spectators and crew mode reject revisions',()=>{
  for(const change of [h=>h.setClock(5000),h=>h.H.phase='reveal',h=>h.players[0].spec=1,h=>h.H.set.mode='crew']){
    const h=host(); change(h); h.answer(); assert.equal(h.H.answers.me.aid,1);
  }
});
test('invalid replacements preserve the saved answer',()=>{
  const h=host(); h.answer('invalid');
  assert.equal(h.H.answers.me.aid,1);
  assert.equal(h.messages.at(-1).kind,'unknown');
});
test('offline and departed players do not extend the revision window',()=>{
  for(const change of [h=>h.players[1].gone=1,h=>h.players[1].seen=-10000]){
    const h=host(); change(h); h.answer(); assert.equal(h.H.answers.me.aid,1);
  }
});
test('a rejected submission restores the last confirmed answer and allows editing',()=>{
  for(const saved of [null,{aid:1}]){
    const C={view:{r:2,q:'test'},myLock:{aid:2,pending:true},pendingLock:saved};
    const ctx=vm.createContext({C,QMAP:{test:{}},esc:s=>s,render:()=>{},shake:()=>{},SFX:{bad:()=>{}}});
    vm.runInContext(source.slice(source.indexOf('function onDirect('),source.indexOf('function shake(')),ctx);
    ctx.onDirect({t:'fb',r:2,kind:'unknown',msg:'Try again'});
    assert.equal(C.myLock,saved);
    assert.equal(C.editing,!!saved);
    assert.equal(C.pendingLock,null);
  }
});
