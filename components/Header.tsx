'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Radio } from 'lucide-react';
import { NAV_ITEMS } from '@/constants';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showSolidHeader = isScrolled || pathname !== '/';

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          showSolidHeader && !mobileMenuOpen
            ? 'glass-nav py-3'
            : mobileMenuOpen
            ? 'bg-navy py-4 border-b border-white/10'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Radio className="w-6 h-6 text-orange-accent" />
            <span
              className={`text-xl font-black tracking-tighter uppercase transition-colors ${
                showSolidHeader && !mobileMenuOpen ? 'text-navy' : 'text-white'
              }`}
            >
              InFra<span className="text-orange-accent">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] transition-all hover:text-orange-accent relative py-2 group ${
                  isActive(item.href)
                    ? 'text-orange-accent'
                    : showSolidHeader
                    ? 'text-navy/70'
                    : 'text-white/70'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${
                    isActive(item.href) ? 'scale-x-100' : ''
                  }`}
                />
              </Link>
            ))}
            <div className={`h-6 w-px flex-shrink-0 ${showSolidHeader ? 'bg-navy/10' : 'bg-white/20'}`} />
            <Link
              href="/platform"
              className={`whitespace-nowrap px-4 py-2 border border-orange-accent text-orange-accent hover:bg-orange-accent hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest rounded-none ${
                showSolidHeader ? 'border-navy/20 text-navy hover:border-orange-accent hover:text-white' : ''
              }`}
            >
              Explore Infra-Align™
            </Link>
            <Link
              href="/contact"
              className="whitespace-nowrap px-4 py-2 bg-orange-accent text-white hover:bg-[#d95d12] transition-all text-[9px] font-bold uppercase tracking-widest rounded-none shadow-lg shadow-orange-500/20"
            >
              Request Audit
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className={`xl:hidden p-3 transition-colors relative z-[110] focus:outline-none ${
              showSolidHeader && !mobileMenuOpen ? 'text-navy' : 'text-white'
            }`}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-navy transition-all duration-500 ease-in-out xl:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-10'
        }`}
      >
        <div className="absolute inset-0 industrial-grid-dark opacity-10 pointer-events-none" />

        <div className="h-full flex flex-col p-8 pt-32 overflow-y-auto relative z-10">
          <div className="flex flex-col gap-6">
            <span className="text-orange-accent font-black text-[10px] uppercase tracking-[0.5em] mb-4">
              Navigation Index
            </span>
            {NAV_ITEMS.map((item, idx) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-4xl font-black uppercase tracking-tighter text-left transition-all duration-300 transform ${
                  isActive(item.href)
                    ? 'text-orange-accent translate-x-4'
                    : 'text-white/80 hover:text-white hover:translate-x-2'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-8">
            <Link
              href="/contact"
              className="w-full py-6 bg-orange-accent text-white rounded-none font-black text-xl uppercase tracking-widest text-center shadow-2xl shadow-orange-500/30 active:scale-95 transition-transform"
            >
              Request Infrastructure Audit
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Direct Link</span>
                <span className="text-white text-xs font-bold">1-800-INFRAX-GOV</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Support Line</span>
                <span className="text-white text-xs font-bold">ops@infrax.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
