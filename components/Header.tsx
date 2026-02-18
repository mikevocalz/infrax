import React, { useState, useEffect } from 'react';
import { Menu, X, Radio } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine header appearance based on scroll or page type
  const isLightBackgroundPage = currentPath !== 'home' && currentPath !== 'intelligence';
  const showSolidHeader = isScrolled || isLightBackgroundPage;

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <Radio className="w-6 h-6 text-orange-accent" />
            <span className={`text-xl font-black tracking-tighter uppercase transition-colors ${
              (showSolidHeader && !mobileMenuOpen) ? 'text-navy' : 'text-white'
            }`}>
              InFra<span className="text-orange-accent">X</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all hover:text-orange-accent relative py-2 group ${
                  currentPath === item.href 
                  ? 'text-orange-accent' 
                  : showSolidHeader ? 'text-navy/70' : 'text-white/70'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${currentPath === item.href ? 'scale-x-100' : ''}`} />
              </button>
            ))}
            <div className={`h-6 w-px ${showSolidHeader ? 'bg-navy/10' : 'bg-white/20'}`} />
            <button 
              onClick={() => handleNavClick('contact')}
              className="px-6 py-2.5 bg-orange-accent text-white hover:bg-[#d95d12] transition-all text-[10px] font-bold uppercase tracking-widest rounded-none shadow-lg shadow-orange-500/20"
            >
              Request Audit
            </button>
          </nav>

          {/* Mobile Toggle Button - High Priority Z-Index */}
          <button 
            className={`xl:hidden p-3 transition-colors relative z-[110] focus:outline-none ${
              (showSolidHeader && !mobileMenuOpen) ? "text-navy" : "text-white"
            }`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Outside header for cleaner z-stacking */}
      <div 
        className={`fixed inset-0 z-[90] bg-navy transition-all duration-500 ease-in-out xl:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-10'
        }`}
      >
        {/* Decorative Grid Background for Mobile Menu */}
        <div className="absolute inset-0 industrial-grid-dark opacity-10 pointer-events-none" />
        
        <div className="h-full flex flex-col p-8 pt-32 overflow-y-auto relative z-10">
          <div className="flex flex-col gap-6">
            <span className="text-orange-accent font-black text-[10px] uppercase tracking-[0.5em] mb-4">Navigation Index</span>
            {NAV_ITEMS.map((item, idx) => (
              <button
                key={item.label}
                className={`text-4xl font-black uppercase tracking-tighter text-left transition-all duration-300 transform ${
                  currentPath === item.href 
                    ? 'text-orange-accent translate-x-4' 
                    : 'text-white/80 hover:text-white hover:translate-x-2'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-8">
            <button 
              onClick={() => handleNavClick('contact')}
              className="w-full py-6 bg-orange-accent text-white rounded-none font-black text-xl uppercase tracking-widest text-center shadow-2xl shadow-orange-500/30 active:scale-95 transition-transform"
            >
              Request Strategic Audit
            </button>
            
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
};

export default Header;