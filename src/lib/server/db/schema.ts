import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contactMessages = sqliteTable('contact_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  email: text('email'),
  message: text('message').notNull(),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  isBlocked: integer('is_blocked', { mode: 'boolean' }).notNull().default(false),
});
