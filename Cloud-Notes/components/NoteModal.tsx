import { useState, useRef, useEffect } from 'react';
import { NOTE_COLORS } from '../lib/utils';
import TagChip from './TagChip';

interface NoteModalProps {
  onClose:  () => void;
  onCreate: (data: { title: string; body: string; tags: string[]; color: string }) => Promise<void>;
}

export default function NoteModal({ onClose, onCreate }: NoteModalProps) {
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [tags,     setTags]     = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [color,    setColor]    = useState(NOTE_COLORS[0]);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const titleRef = useRef<HTMLInputElement>(null);

  // Focus title on open
  useEffect(() => { titleRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const commitTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    setError('');
    setSaving(true);
    try {
      await onCreate({ title: title.trim(), body, tags, color });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Create new note">
      <div className="modal-box glass" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">✦ New Note</h2>
          <button id="modal-close" className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-title">Title *</label>
            <input
              ref={titleRef}
              id="modal-title"
              className="input"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {error && (
              <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{error}</span>
            )}
          </div>

          {/* Body */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-body">Content</label>
            <textarea
              id="modal-body"
              className="input textarea"
              placeholder="Start writing…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div
              className="tags-input-wrap"
              onClick={() => document.getElementById('modal-tag-input')?.focus()}
            >
              {tags.map((t) => (
                <TagChip
                  key={t}
                  tag={t}
                  onRemove={() => setTags(tags.filter((x) => x !== t))}
                />
              ))}
              <input
                id="modal-tag-input"
                className="tags-input-field"
                placeholder={tags.length === 0 ? 'work, personal, ideas…' : ''}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                onBlur={commitTag}
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="form-group">
            <label className="form-label">Accent Color</label>
            <div className="color-picker">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch${color === c ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                  title={c}
                />
              ))}
            </div>
            {/* Preview strip */}
            <div style={{
              height: 3,
              marginTop: 8,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${color}, ${color}66)`,
              transition: 'background 0.3s ease',
            }} />
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button id="modal-cancel" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            id="modal-save-note"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!title.trim() || saving}
          >
            {saving
              ? <><SpinIcon /> Saving…</>
              : <><PlusIcon /> Create Note</>}
          </button>
        </div>

      </div>
    </div>
  );
}

function SpinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: 'spin 0.7s linear infinite' }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
