import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 250 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  assigneeId: integer('assignee_id').references(() => users.id),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: varchar('status', { length: 20 }).default('in_progress'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
