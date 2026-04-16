interface EmptyStateProps {
  query?: string;
  tag?:   string;
  onAdd?: () => void;
}

export default function EmptyState({ query, tag, onAdd }: EmptyStateProps) {
  const isFiltered = !!query || !!tag;

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {isFiltered ? <SearchIcon /> : <NoteIcon />}
      </div>

      <div>
        <h2 className="empty-state-title">
          {query
            ? `No results for "${query}"`
            : tag
              ? `No notes tagged "${tag}"`
              : 'No notes yet'}
        </h2>
        <p className="empty-state-desc">
          {isFiltered
            ? 'Try a different search term or clear the active filter.'
            : 'Create your first note — your thoughts deserve a beautiful home.'}
        </p>
      </div>

      {!isFiltered && onAdd && (
        <button id="empty-add-note" className="btn btn-primary btn-lg" onClick={onAdd}>
          <PlusIcon />
          Create your first note
        </button>
      )}
    </div>
  );
}

function NoteIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9"  y1="15" x2="15" y2="15" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
