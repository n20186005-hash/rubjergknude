'use client';

import { useLocale, useTranslations } from 'next-intl';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { getLocalePath, type AppLocale } from '@/i18n/config';
import labels from '@/content/nearby/labels';

export default function Header({ solid = false }: { solid?: boolean }) {
  const t = useTranslations('header');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const navSections = ['tickets', 'transport', 'practicalInfo', 'faq', 'gallery', 'reviews', 'map'] as const;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    const useSolidPalette = solid || scrolled;

  return () => window.removeEventListener('scroll', handler);
  }, []);

  const useSolidPalette = solid || scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: useSolidPalette ? 'var(--bg-secondary)' : 'transparent',
        borderBottom: useSolidPalette ? '1px solid var(--border-color)' : 'none',
        backdropFilter: useSolidPalette ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href={getLocalePath(locale, '/')} className="font-display text-lg font-semibold tracking-tight" style={{ color: useSolidPalette ? 'var(--text-primary)' : '#fff' }}>
          Rubjerg Knude
        </a>

        <nav className="hidden md:flex items-center gap-3 lg:gap-4 overflow-x-auto whitespace-nowrap max-w-[55vw]">
          <a
            className="text-xs font-medium lg:text-sm"
            href={getLocalePath(locale, '/nearby')}
            style={{ color: useSolidPalette ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}
          >
            {labels[locale as AppLocale].menu}
          </a>
          {navSections.map((section) => (
            <a
              key={section}
              href={`${getLocalePath(locale, '/')}#${section}`}
              className="text-xs lg:text-sm font-medium transition-colors"
              style={{ color: useSolidPalette ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}
            >
              {t(section)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
