import { SQLiteDatabase } from 'expo-sqlite';

export interface InsightEntry {
  id: string;
  text: string;
  tag: string;
  timestamp: number;
  createdAt: string;
}

export interface InsightTag {
  id: string;
  name: string;
  lastUsed: number;
}

const PREDEFINED_TAGS = ['belief-shift', 'clarity', 'freedom', 'trigger'];

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS insight_entries (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      tag TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS insight_tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      lastUsed INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_timestamp ON insight_entries(timestamp DESC);
  `);

  await insertPredefinedTags(db);
}

async function insertPredefinedTags(db: SQLiteDatabase): Promise<void> {
  for (const tag of PREDEFINED_TAGS) {
    try {
      await db.runAsync(
        'INSERT OR IGNORE INTO insight_tags (id, name, lastUsed) VALUES (?, ?, ?)',
        [tag, tag, 0]
      );
    } catch (error) {
      // Tag might already exist
    }
  }
}

export async function addInsightEntry(
  db: SQLiteDatabase,
  text: string,
  tag: string,
): Promise<InsightEntry> {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();
  const createdAt = new Date(timestamp).toISOString();

  await db.runAsync(
    'INSERT INTO insight_entries (id, text, tag, timestamp, createdAt) VALUES (?, ?, ?, ?, ?)',
    [id, text, tag, timestamp, createdAt]
  );

  await db.runAsync(
    'UPDATE insight_tags SET lastUsed = ? WHERE name = ?',
    [timestamp, tag]
  );

  return { id, text, tag, timestamp, createdAt };
}

export async function getInsightEntries(
  db: SQLiteDatabase,
  filterTag?: string,
): Promise<InsightEntry[]> {
  const query = filterTag
    ? 'SELECT * FROM insight_entries WHERE tag = ? ORDER BY timestamp DESC'
    : 'SELECT * FROM insight_entries ORDER BY timestamp DESC';

  const params = filterTag ? [filterTag] : [];
  const results = await db.getAllAsync<InsightEntry>(query, params);

  return results || [];
}

export async function getInsightTags(db: SQLiteDatabase): Promise<InsightTag[]> {
  const results = await db.getAllAsync<InsightTag>(
    'SELECT * FROM insight_tags ORDER BY lastUsed DESC, name ASC'
  );
  return results || [];
}

export async function createCustomTag(
  db: SQLiteDatabase,
  tagName: string,
): Promise<InsightTag | null> {
  const id = `tag-${Date.now()}`;
  const now = Date.now();

  try {
    await db.runAsync(
      'INSERT INTO insight_tags (id, name, lastUsed) VALUES (?, ?, ?)',
      [id, tagName, now]
    );
    return { id, name: tagName, lastUsed: now };
  } catch (error) {
    return null; // Tag already exists
  }
}

export async function getEntryCount(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM insight_entries'
  );
  return result?.count ?? 0;
}
