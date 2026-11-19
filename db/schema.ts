import { pgTable, text, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
export const questionHistory = pgTable('question_history', {
  playerId: text('player_id').notNull(),
  questionId: text('question_id').notNull(),
  seenAt: timestamp('seen_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [primaryKey({ columns: [t.playerId, t.questionId] }), index('question_history_seen_at_idx').on(t.seenAt)]);
