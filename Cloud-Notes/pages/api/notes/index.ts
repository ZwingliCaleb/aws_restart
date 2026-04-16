import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllNotes, createNote } from '../../../lib/notesStore';
import { getRandomNoteColor } from '../../../lib/utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const notes = getAllNotes();
    return res.status(200).json(notes);
  }

  if (req.method === 'POST') {
    const { title, body, tags, color } = req.body ?? {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = createNote({
      title: title.trim(),
      body:  typeof body === 'string' ? body : '',
      tags:  Array.isArray(tags) ? tags.map(String) : [],
      color: typeof color === 'string' ? color : getRandomNoteColor(),
    });
    return res.status(201).json(note);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
