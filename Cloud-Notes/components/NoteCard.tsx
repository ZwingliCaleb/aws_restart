import { useRouter } from 'next/router';
import TagChip from './TagChip';
import { Note } from '../types';
import { formatDate } from '../lib/utils';

interface NoteCardProps {
  note:      Note;
  onDelete:  (id: string) => void;
  animDelay?: number;
}

export default function NoteCard({ note, onDelete, animDelay = 0 }: NoteCardProps) {
  const router = useRouter();

  const handleOpen = () => router.push(`/notes/${note.id}`);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/notes/${note.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${note.title || 'Untitled'}"?`)) onDelete(note.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open note: ${note.title || 'Untitled'}`}
      className="note-card glass animate-fade-in"
      style={{ animationDelay: `${animDelay}ms`, cursor: 'pointer' }}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
    >
      {/* Colored accent top bar */}
      <div
        className="note-card-accent"
        style={{ background: `linear-gradient(90deg, ${note.color}, ${note.color}88)` }}
      />

      <div className="note-card-body">
        <h3 className="note-card-title">
          {note.title || <span style={{ color: 'var(--text-muted)' }}>Untitled</span>}
        </h3>

        {note.body && (
          <p className="note-card-preview">{note.body}</p>
        )}

        {note.tags.length > 0 && (
          <div className="note-card-tags">
            {note.tags.slice(0, 4).map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
            {note.tags.length > 4 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>
                +{note.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.updatedAt)}</span>

        <div className="note-card-actions">
          <button
            id={`edit-note-${note.id}`}
            className="btn btn-icon btn-ghost"
            onClick={handleEdit}
            title="Edit note"
            aria-label="Edit note"
          >
            <EditIcon />
          </button>
          <button
            id={`delete-note-${note.id}`}
            className="btn btn-icon btn-danger"
            onClick={handleDelete}
            title="Delete note"
            aria-label="Delete note"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
