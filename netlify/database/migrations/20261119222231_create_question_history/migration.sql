CREATE TABLE "question_history" (
	"player_id" text,
	"question_id" text,
	"seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_history_pkey" PRIMARY KEY("player_id","question_id")
);
--> statement-breakpoint
CREATE INDEX "question_history_seen_at_idx" ON "question_history" ("seen_at");