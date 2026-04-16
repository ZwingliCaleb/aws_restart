import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import TagChip from '../../components/TagChip';
import { Note } from '../../types';
import { NOTE_COLORS, formatFullDate } from '../../lib/utils';

// ── Server-side data ─────────────────────────────────────────────────────────
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { getNoteById } = await import('../../lib/notesStore');
  const note = getNoteById(params?.id as string);
  if (!note) return { notFound: true };
  return { props: { initialNote: note } };
};

// ── Save status type ─────────────────────────────────────────────────────────
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ── Component ────────────────────────────────────────────────────────────────
export default function NotePage({ initialNote }: { initialNote: Note }) {
  const router = useRouter();

  const [title,      setTitle]      = useState(initialNote.title);
  const [body,       setBody]       = useState(initialNote.body);
  const [tags,       setTags]       = useState<string[]>(initialNote.tags);
  const [color,      setColor]      = useState(initialNote.color);
  const [tagInput,   setTagInput]   = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isDirty,    setIsDirty]    = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [showColors, setShowColors] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef  = useRef<HTMLTextAreaElement>(null);

  const noteId = initialNote.id;

  // ── Auto-resize textareas ─────────────────────────────────────────────────
  const resize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  useEffect(() => { resize(titleRef.current); }, [title]);
  useEffect(() => { resize(bodyRef.current);  }, [body]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await fetch(`/api/notes/${noteId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title, body, tags, color }),
      });
      setSaveStatus('saved');
      setIsDirty(false);
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
    }
  }, [noteId, title, body, tags, color]);

  // ── Autosave debounce (1.5 s) ─────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(save, 1500);
    return () => clearTimeout(timer);
  }, [isDirty, save]);

  // ── Keyboard shortcut: Ctrl+S / Cmd+S ────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty) save();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isDirty, save]);

  // ── Field changes ─────────────────────────────────────────────────────────
  const change = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setIsDirty(true);
  };

  const changeColor = (c: string) => {
    setColor(c);
    setIsDirty(true);
    setShowColors(false);
  };

  // ── Tags ─────────────────────────────────────────────────────────────────
  const commitTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (t && !tags.includes(t)) {
      setTags((prev) => {
        const next = [...prev, t];
        setIsDirty(true);
        return next;
      });
    }
    setTagInput('');
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
    setIsDirty(true);
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm(`Delete "${title || 'Untitled'}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    router.push('/dashboard');
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  const pageTitle = title ? `${title} — Cloud Notes` : 'Untitled — Cloud Notes';

  return (
    <Layout title={title || 'Untitled'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      {/* ── Sticky action bar ── */}
      <div style={{
        position: 'sticky',
        top: 'var(--header-height)',
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(7,7,15,0.7)',
      }}>
        <div style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          justifyContent: 'space-between',
        }}>

          {/* Back button */}
          <button
            id="back-to-dashboard"
            className="btn btn-ghost btn-sm"
            onClick={() => router.push('/dashboard')}
          >
            <BackIcon /> Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* Save status */}
            <SaveIndicator status={saveStatus} />

            {/* Manual save */}
            <button
              id="save-note-manual"
              className="btn btn-ghost btn-sm"
              onClick={save}
              disabled={!isDirty || saveStatus === 'saving'}
            >
              <SaveIcon /> Save
            </button>

            {/* Delete */}
            <button
              id="delete-note"
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <TrashIcon /> {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Editor ── */}
      <div className="editor-wrap">

        {/* Color accent & picker */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${color}, ${color}55)`,
              marginBottom: '0.75rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onClick={() => setShowColors(!showColors)}
            title="Click to change accent color"
          />
          {showColors && (
            <div className="color-picker" style={{ marginBottom: '0.5rem' }}>
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch${color === c ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => changeColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
          id="note-title"
          className="editor-title"
          placeholder="Untitled note…"
          value={title}
          rows={1}
          onChange={(e) => { change(setTitle)(e.target.value); resize(e.target); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); bodyRef.current?.focus(); } }}
        />

        {/* Meta bar */}
        <div className="editor-meta">
          <span className="editor-meta-item">
            <CalIcon />
            <span>Created {formatFullDate(initialNote.createdAt)}</span>
          </span>
          <span className="editor-meta-item" style={{ marginLeft: 'auto' }}>
            {body.trim() ? `${body.trim().split(/\s+/).length} words` : '0 words'}
          </span>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            className="tags-input-wrap"
            onClick={() => document.getElementById('editor-tag-input')?.focus()}
            style={{ minHeight: 40 }}
          >
            {tags.map((t) => (
              <TagChip key={t} tag={t} size="md" onRemove={() => removeTag(t)} />
            ))}
            <input
              id="editor-tag-input"
              className="tags-input-field"
              placeholder={tags.length === 0 ? 'Add tags…' : ''}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={commitTag}
            />
          </div>
        </div>

        {/* Divider */}
        <hr className="divider" style={{ marginBottom: '1.5rem' }} />

        {/* Body */}
        <textarea
          ref={bodyRef}
          id="note-body"
          className="editor-body"
          placeholder="Start writing your note here…"
          value={body}
          rows={12}
          onChange={(e) => { change(setBody)(e.target.value); resize(e.target); }}
        />
      </div>
    </Layout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  const map: Record<SaveStatus, { text: string; color: string }> = {
    idle:   { text: '',          color: 'var(--text-muted)' },
    saving: { text: 'Saving…',  color: 'var(--warning)' },
    saved:  { text: '✓ Saved',  color: 'var(--success)' },
    error:  { text: '✗ Error',  color: 'var(--danger)' },
  };
  const { text, color } = map[status];
  return (
    <span className="save-indicator" style={{ color, fontSize: 13, fontFamily: 'var(--font-mono)' }}>
      {text}
    </span>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
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

function CalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}
