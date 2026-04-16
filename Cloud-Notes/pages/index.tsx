import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const FEATURES = [
  {
    icon: '☁️',
    bg: 'rgba(124, 58, 237, 0.12)',
    title: 'Cloud-Native Architecture',
    desc:  'Containerized with Docker and deployed on Azure Container Instances — production-ready from day one.',
  },
  {
    icon: '⚡',
    bg: 'rgba(6, 182, 212, 0.12)',
    title: 'Lightning Fast',
    desc:  'Built on Next.js 14 with server-side rendering for instant page loads and optimal SEO performance.',
  },
  {
    icon: '🏗️',
    bg: 'rgba(245, 158, 11, 0.12)',
    title: 'Infrastructure as Code',
    desc:  'Full Azure stack — resource groups, ACR, and container groups — provisioned in one Terraform apply.',
  },
  {
    icon: '🔍',
    bg: 'rgba(16, 185, 129, 0.12)',
    title: 'Smart Search & Tags',
    desc:  'Instant full-text search and a color-coded tag system to keep every note organized and findable.',
  },
  {
    icon: '✏️',
    bg: 'rgba(236, 72, 153, 0.12)',
    title: 'Full CRUD',
    desc:  'Create, read, update, and delete notes with autosave. A file-based store that swaps for Prisma/PostgreSQL.',
  },
  {
    icon: '🎨',
    bg: 'rgba(99, 102, 241, 0.12)',
    title: 'Premium Dark UI',
    desc:  'Glassmorphism design with animated gradients, micro-interactions, and a cohesive visual identity.',
  },
];

const STACK = [
  { label: 'Next.js 14',  color: '#f1f5f9' },
  { label: 'TypeScript',  color: '#3b82f6' },
  { label: 'Docker',      color: '#06b6d4' },
  { label: 'Azure',       color: '#60a5fa' },
  { label: 'Terraform',   color: '#a78bfa' },
  { label: 'Prisma',      color: '#10b981' },
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Cloud Notes — Your thoughts, beautifully organized</title>
      </Head>

      {/* ── Hero ── */}
      <section className="hero container">
        <div className="hero-badge animate-fade-in">
          <span>✦</span> Full-Stack DevOps Demo
        </div>

        <h1 className="hero-title">
          Your thoughts,<br />
          <span className="gradient-text">beautifully organized</span>
        </h1>

        <p className="hero-desc">
          A premium cloud notes app built with Next.js — containerized, deployed on Azure,
          and provisioned with Terraform. The complete DevOps pipeline in one repo.
        </p>

        <div className="hero-cta">
          <Link href="/dashboard" className="btn btn-primary btn-lg" id="hero-get-started">
            Open Dashboard →
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
            id="hero-view-source"
          >
            <GithubIcon /> View Source
          </a>
        </div>

        {/* Tech stack badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '3rem', animation: 'fadeIn 0.7s ease 0.5s both' }}>
          {STACK.map((s) => (
            <span
              key={s.label}
              style={{
                padding: '5px 14px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: s.color,
                letterSpacing: '0.02em',
              }}
            >
              {s.label}
            </span>
          ))}
        </div>

        {/* Down arrow */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.25, animation: 'fadeIn 1s 1s both' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <p className="section-label">What's inside</p>
        <h2 className="section-title">Everything you need, nothing you don't</h2>
        <p className="section-subtitle">
          Cloud Notes is both a beautiful productivity tool and a showcase of modern DevOps practices.
        </p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card glass animate-fade-in stagger-${Math.min(i + 1, 6)}`}
            >
              <div className="feature-icon" style={{ background: f.bg }}>
                <span role="img" aria-label={f.title}>{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: '4rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.10))',
          border: '1px solid rgba(124,58,237,0.25)',
          backdropFilter: 'blur(20px)',
        }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Ready to take notes in the cloud?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Your personal workspace is one click away — fully deployed, no setup required.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg" id="cta-open-app">
            Start Writing →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--text-muted)',
        fontSize: 13,
        position: 'relative',
        zIndex: 1,
      }}>
        <span>Cloud Notes &copy; {new Date().getFullYear()} — Built with Next.js · Docker · Azure · Terraform</span>
      </footer>
    </Layout>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
