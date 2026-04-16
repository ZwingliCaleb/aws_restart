import { getTagStyle } from '../lib/utils';

interface TagChipProps {
  tag:       string;
  onRemove?: () => void;
  onClick?:  () => void;
  active?:   boolean;
  size?:     'sm' | 'md';
}

export default function TagChip({ tag, onRemove, onClick, active = false, size = 'sm' }: TagChipProps) {
  const s = getTagStyle(tag);

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`tag-chip${onClick ? ' tag-chip-filter' : ''}${active ? ' active' : ''}`}
      style={{
        backgroundColor: s.bg,
        color:           s.color,
        borderColor:     s.border,
        fontSize:  size === 'md' ? '12px' : '11px',
        padding:   size === 'md' ? '4px 12px' : '3px 9px',
      }}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {tag}
      {onRemove && (
        <button
          aria-label={`Remove tag ${tag}`}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            background: 'none', border: 'none', color: 'inherit',
            cursor: 'pointer', padding: 0, lineHeight: 1,
            opacity: 0.65, marginLeft: 3, fontSize: '13px',
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
