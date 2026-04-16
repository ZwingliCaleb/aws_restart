import { useState, useMemo } from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import SearchBar from '../components/SearchBar';
import TagChip from '../components/TagChip';
import EmptyState from '../components/EmptyState';
import { Note } from '../types';

// ── Server-side data ────────────────────────────────────────────────────────
export const getServerSideProps: GetServerSideProps = async () => {
  const { getAllNotes } = await import('../lib/notesStore');
  const notes = getAllNotes();
  return { props: { initialNotes: notes } };
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function isToday(isoDate: string) {
  const d = new Date(isoDate);
  const now = new Date();
  return d.getDate() === now.getDate() &&
    d.getMonth()     === now.getMonth() &&
    d.getFullYear()  === now.getFullYear();
}

// ── Component ────────────────────────────────────────────────────────────────
interface Props { initialNotes: Note[]; }

export default function Dashboard({ initialNotes }: Props) {
  const [notes,     setNotes]     = useState<Note[]>(initialNotes);
  const [search,    setSearch]    = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Derived stats
  const totalNotes  = notes.length;
  const todayNotes  = notes.filter((n) => isToday(n.createdAt)).length;
  const allTags     = useMemo(
    () => Array.from(new Set(notes.flatMap((n) => n.tags))).sort(),
    [notes],
  );

  // Filtered notes
  const filtered = useMemo(() => {
    let result = notes;
    if (activeTag) result = result.filter((n) => n.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
      );
    }
    return result;
  }, [notes, search, activeTag]);

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleCreate = async (data: { title: string; body: string; tags: string[]; color: string }) => {
    const res  = await fetch('/api/notes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) return;
    const note: Note = await res.json();
    setNotes((prev) => [note, ...prev]);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const todayGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout title={`${totalNotes} note${totalNotes !== 1 ? 's' : ''}`}>
      <Head>
        <title>Dashboard — Cloud Notes</title>
      </Head>

      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {todayGreeting()} ✦
          </h1>
        </div>

        {/* ── Stats ── */}
        <div className="dash-stats">
          <StatCard label="Total Notes"  value={totalNotes}       icon="📝" />
          <StatCard label="Tags Created" value={allTags.length}   icon="🏷️" />
          <StatCard label="Added Today"  value={todayNotes}        icon="⚡" />
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="dash-toolbar">
            <SearchBar value={search} onChange={setSearch} />
            <button
              id="open-add-note-modal"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <PlusIcon /> New Note
            </button>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="dash-filters" style={{ paddingLeft: 2 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4, fontWeight: 600 }}>
                Filter:
              </span>
              <TagChip
                tag="all"
                size="md"
                onClick={() => setActiveTag(null)}
                active={activeTag === null}
              />
              {allTags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  size="md"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  active={activeTag === tag}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Notes grid ── */}
        {filtered.length === 0 ? (
          <EmptyState
            query={search || undefined}
            tag={activeTag || undefined}
            onAdd={() => setShowModal(true)}
          />
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
              {(search || activeTag) && ' found'}
            </p>
            <div className="notes-grid">
              {filtered.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  animDelay={i * 50}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <NoteModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </Layout>
  );
}

// ── Stat card sub-component ─────────────────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="stat-card glass">
      <div className="stat-label">
        <span role="img" aria-label={label} style={{ marginRight: 4 }}>{icon}</span>
        {label}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
