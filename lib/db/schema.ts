import { pgTable, text, timestamp, boolean, serial, integer, json } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- RPG Game Tables -------------------------------------------------------

export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  level: integer('level').notNull().default(1),
  experience: integer('experience').notNull().default(0),
  health: integer('health').notNull().default(100),
  maxHealth: integer('maxHealth').notNull().default(100),
  mana: integer('mana').notNull().default(50),
  maxMana: integer('maxMana').notNull().default(50),
  attack: integer('attack').notNull().default(10),
  defense: integer('defense').notNull().default(5),
  speed: integer('speed').notNull().default(8),
  critChance: integer('critChance').notNull().default(10),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const spells = pgTable('spells', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'attack', 'heal', 'buff', 'debuff'
  manaCost: integer('manaCost').notNull(),
  power: integer('power').notNull(), // Base damage or healing amount
  element: text('element').notNull(), // 'fire', 'ice', 'lightning', 'nature', 'holy', 'dark'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const characterSpells = pgTable('character_spells', {
  id: serial('id').primaryKey(),
  characterId: integer('characterId').notNull(),
  spellId: integer('spellId').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const enemies = pgTable('enemies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  health: integer('health').notNull(),
  maxHealth: integer('maxHealth').notNull(),
  mana: integer('mana').notNull(),
  maxMana: integer('maxMana').notNull(),
  attack: integer('attack').notNull(),
  defense: integer('defense').notNull(),
  speed: integer('speed').notNull(),
  spellIds: json('spellIds').$type<number[]>().notNull().default([]),
  experienceReward: integer('experienceReward').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const battles = pgTable('battles', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  characterId: integer('characterId').notNull(),
  enemyId: integer('enemyId').notNull(),
  winner: text('winner').notNull(), // 'character', 'enemy', 'draw'
  characterFinalHealth: integer('characterFinalHealth').notNull(),
  enemyFinalHealth: integer('enemyFinalHealth').notNull(),
  experienceGained: integer('experienceGained').notNull().default(0),
  battleLog: json('battleLog').$type<string[]>().notNull().default([]),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
