import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  repoUrl: text('repo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});