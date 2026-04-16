export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
  if (days > 1) return `${days} days ago`;
  if (days === 1) return 'Yesterday';
  if (hours >= 1) return `${hours}h ago`;
  if (minutes >= 1) return `${minutes}m ago`;
  return 'Just now';
}

export function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Tag Colors ──────────────────────────────────────────
const TAG_COLOR_MAP: Record<string, { bg: string; color: string; border: string }> = {
  work:         { bg: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', border: 'rgba(124, 58, 237, 0.3)' },
  personal:     { bg: 'rgba(6, 182, 212, 0.15)',  color: '#67e8f9', border: 'rgba(6, 182, 212, 0.3)' },
  ideas:        { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  important:    { bg: 'rgba(239, 68, 68, 0.15)',  color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
  todo:         { bg: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },
  learning:     { bg: 'rgba(236, 72, 153, 0.15)', color: '#f9a8d4', border: 'rgba(236, 72, 153, 0.3)' },
  devops:       { bg: 'rgba(6, 182, 212, 0.15)',  color: '#67e8f9', border: 'rgba(6, 182, 212, 0.3)' },
  azure:        { bg: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', border: 'rgba(59, 130, 246, 0.3)' },
  terraform:    { bg: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd', border: 'rgba(124, 58, 237, 0.3)' },
  planning:     { bg: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' },
  default:      { bg: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: 'rgba(99, 102, 241, 0.3)' },
};

export function getTagStyle(tag: string) {
  return TAG_COLOR_MAP[tag.toLowerCase()] ?? TAG_COLOR_MAP.default;
}

// ── Note Accent Colors ──────────────────────────────────
export const NOTE_COLORS = [
  '#7c3aed', // violet
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#ec4899', // pink
  '#6366f1', // indigo
  '#f97316', // orange
];

export function getRandomNoteColor(): string {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
}

// ── ID Generation ───────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// ── Word count ──────────────────────────────────────────
export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
