import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { mkdirSync } from "node:fs";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "rsvps.sqlite");

let database: DatabaseSync | undefined;

function getDatabase() {
  if (!database) {
    mkdirSync(dataDirectory, { recursive: true });
    database = new DatabaseSync(databasePath);
    database.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS party_rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        party TEXT NOT NULL CHECK (party IN ('bachelor', 'bachelorette')),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS wedding_rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  return database;
}

export function createPartyRsvp(input: { party: "bachelor" | "bachelorette"; firstName: string; lastName: string }) {
  const statement = getDatabase().prepare(`
    INSERT INTO party_rsvps (party, first_name, last_name)
    VALUES (?, ?, ?)
  `);

  const result = statement.run(input.party, input.firstName, input.lastName);
  return { id: Number(result.lastInsertRowid) };
}

export function listPartyRsvps() {
  return getDatabase().prepare(`
    SELECT id, party, first_name AS firstName, last_name AS lastName, created_at AS createdAt
    FROM party_rsvps
    ORDER BY created_at DESC, id DESC
  `).all();
}

export function createWeddingRsvp(input: { firstName: string; lastName: string }) {
  const statement = getDatabase().prepare(`
    INSERT INTO wedding_rsvps (first_name, last_name)
    VALUES (?, ?)
  `);

  const result = statement.run(input.firstName, input.lastName);
  return { id: Number(result.lastInsertRowid) };
}

export function getWeddingRsvpCount() {
  const result = getDatabase().prepare("SELECT COUNT(*) AS count FROM wedding_rsvps").get() as { count: number };
  return Number(result.count);
}

export function listWeddingRsvps() {
  return getDatabase().prepare(`
    SELECT id, first_name AS firstName, last_name AS lastName, created_at AS createdAt
    FROM wedding_rsvps
    ORDER BY created_at DESC, id DESC
  `).all() as Array<{ id: number; firstName: string; lastName: string; createdAt: string }>;
}
