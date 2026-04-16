import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const router = useRouter();
  const isApp   = router.pathname.startsWith('/dashboard') || router.pathname.startsWith('/notes');

  return (
    <>
      {/* Atmospheric orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Fixed top header */}
      <header className="app-header glass">
        <div className="app-header-inner">

          <Link href="/" className="logo-link" aria-label="Cloud Notes Home">
            <div className="logo">
              <CloudNoteIcon />
              <span className="logo-text">
                Cloud<span className="gradient-text">Notes</span>
              </span>
            </div>
          </Link>

          <nav className="header-nav">
            {isApp && router.pathname !== '/dashboard' && (
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
            )}
            {!isApp && (
              <>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/dashboard" className="btn btn-primary btn-sm" id="hero-open-app">
                  Open App →
                </Link>
              </>
            )}
            {isApp && title && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {title}
              </span>
            )}
          </nav>

        </div>
      </header>

      {/* Content area */}
      <div className="page-wrapper">
        {children}
      </div>
    </>
  );
}

function CloudNoteIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="icon-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Cloud shape */}
      <path
        d="M24 20H8C6.3 20 5 18.7 5 17C5 15.4 6.2 14.1 7.8 14C8.1 11 10.5 9 13.5 9C15.7 9 17.6 10.2 18.6 12C19.1 12 19.5 12 20 12.1C21.8 12.6 23 14.2 23 16C23 18 21.9 20 24 20Z"
        fill="url(#icon-grad)"
        opacity="0.85"
      />
      {/* Rain drops / note lines */}
      <line x1="11" y1="20" x2="11" y2="24" stroke="url(#icon-grad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="16" y1="20" x2="16" y2="25" stroke="url(#icon-grad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="21" y1="20" x2="21" y2="24" stroke="url(#icon-grad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
