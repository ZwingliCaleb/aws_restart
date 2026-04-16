import fs from 'fs';
import path from 'path';
import { generateId } from './utils';
import type { Note } from '../types';

export type { Note };

const DATA_DIR  = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'notes.json');

// ── Types ────────────────────────────────────────────────
export type NoteCreateInput = Pick<Note, 'title' | 'body' | 'tags' | 'color'>;
export type NoteUpdateInput = Partial<Pick<Note, 'title' | 'body' | 'tags' | 'color'>>;

// ── Helpers ──────────────────────────────────────────────
function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

function readNotes(): Note[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

function writeNotes(notes: Note[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

// ── CRUD ─────────────────────────────────────────────────
export function getAllNotes(): Note[] {
  return readNotes();
}

export function getNoteById(id: string): Note | null {
  return readNotes().find((n) => n.id === id) ?? null;
}

export function createNote(input: NoteCreateInput): Note {
  const notes = readNotes();
  const now   = new Date().toISOString();
  const note: Note = {
    id:        generateId(),
    title:     input.title,
    body:      input.body ?? '',
    tags:      input.tags ?? [],
    color:     input.color,
    createdAt: now,
    updatedAt: now,
  };
  notes.unshift(note);
  writeNotes(notes);
  return note;
}

export function updateNote(id: string, input: NoteUpdateInput): Note | null {
  const notes = readNotes();
  const idx   = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  notes[idx] = { ...notes[idx], ...input, updatedAt: new Date().toISOString() };
  writeNotes(notes);
  return notes[idx];
}

export function deleteNote(id: string): boolean {
  const notes    = readNotes();
  const filtered = notes.filter((n) => n.id !== id);
  if (filtered.length === notes.length) return false;
  writeNotes(filtered);
  return true;
}
