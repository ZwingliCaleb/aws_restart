import type { NextApiRequest, NextApiResponse } from 'next';
import { getNoteById, updateNote, deleteNote } from '../../../lib/notesStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  if (req.method === 'GET') {
    const note = getNoteById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json(note);
  }

  if (req.method === 'PUT') {
    const { title, body, tags, color } = req.body ?? {};
    const updated = updateNote(id, {
      ...(title !== undefined && { title: String(title).trim() }),
      ...(body  !== undefined && { body:  String(body) }),
      ...(tags  !== undefined && { tags:  Array.isArray(tags) ? tags.map(String) : [] }),
      ...(color !== undefined && { color: String(color) }),
    });
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const ok = deleteNote(id);
    if (!ok) return res.status(404).json({ error: 'Note not found' });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
