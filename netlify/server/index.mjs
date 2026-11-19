import { randomUUID } from 'node:crypto';
import questionBank from '../../db/question-bank.json' with { type: 'json' };
import '../../engine.js';
import { drizzle } from 'drizzle-orm/netlify-db';
import { sql } from 'drizzle-orm';
const { parseQuestion, pickQuestions: pick } = globalThis.KRAKEN_ENGINE;
const bank = questionBank.map(parseQuestion);
const db = drizzle();
const validId = id => typeof id === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(id);
export default async function handler(req) {
  const url = new URL(req.url);
  const headers = { 'Cache-Control': 'no-store' };
  const respond = (data, status = 200) => Response.json(data, { status, headers });
  if (req.headers.get('origin') && req.headers.get('origin') !== url.origin) return respond({ error: 'Invalid origin' }, 403);
  if (url.pathname === '/api/diver' && req.method === 'GET') {
    const existing = req.headers.get('cookie')?.match(/(?:^|;\s*)kr_diver=([a-zA-Z0-9_-]{8,64})(?:;|$)/)?.[1];
    const id = existing || randomUUID();
    if (!existing) headers['Set-Cookie'] = `kr_diver=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${url.protocol === 'https:' ? '; Secure' : ''}`;
    return respond({ id });
  }
  if (!['/api/questions', '/api/questions/seen'].includes(url.pathname) || req.method !== 'POST') return respond({ error: 'Not found' }, 404);
  try {
    if (Number(req.headers.get('content-length')) > 8192) return respond({ error: 'Request too large' }, 413);
    const input = await req.json();
    if (!Array.isArray(input.players) || !input.players.length || input.players.length > 8 || !input.players.every(validId)) return respond({ error: 'Invalid divers' }, 400);
    const players = [...new Set(input.players)].sort();
    if (url.pathname === '/api/questions/seen') {
      if (!bank.some(q => q.id === input.question)) return respond({ error: 'Invalid question' }, 400);
      await db.transaction(async tx => {
        for (const id of players) await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${id}))`);
        const values = players.map(id => sql`(${id}, ${input.question}, now())`);
        await tx.execute(sql`insert into question_history (player_id, question_id, seen_at) values ${sql.join(values, sql`, `)} on conflict (player_id, question_id) do update set seen_at = excluded.seen_at`);
      });
      return respond({ ok: true });
    }
    const n = Number(input.rounds);
    if (![5, 7, 10].includes(n)) return respond({ error: 'Invalid round count' }, 400);
    const topics = Array.isArray(input.topics) ? input.topics.filter(t => typeof t === 'string' && t.length < 20).slice(0, 10) : [];
    const result = await db.transaction(async tx => {
      // Serialise overlapping games for any shared diver, including separate tabs.
      for (const id of players) await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${id}))`);
      const ids = sql.join(players.map(id => sql`${id}`), sql`, `);
      const recent = await tx.execute(sql`select question_id, seen_at from question_history where player_id in (${ids}) and seen_at > now() - interval '1 hour'`);
      const rows = Array.from(recent.rows || recent);
      const questions = pick(bank, topics, n, input.mode === 'coop' ? 'coop' : 'vs', rows.map(r => r.question_id), randomUUID());
      if (questions.length < n) {
        const earliest = rows.reduce((min, r) => Math.min(min, new Date(r.seen_at).getTime() + 3600000), Date.now() + 3600000);
        return { error: 'All fresh questions in these topics have been used. Try more topics or return after the cooldown.', retryAt: earliest };
      }
      const values = players.flatMap(id => questions.map(q => sql`(${id}, ${q}, now())`));
      await tx.execute(sql`insert into question_history (player_id, question_id, seen_at) values ${sql.join(values, sql`, `)} on conflict (player_id, question_id) do update set seen_at = excluded.seen_at`);
      await tx.execute(sql`delete from question_history where seen_at < now() - interval '1 hour'`);
      return { questions };
    });
    return respond(result, result.error ? 409 : 200);
  } catch {
    return respond({ error: 'Question history is unavailable. Please try again.' }, 503);
  }
}
export const config = { path: '/api/*' };
