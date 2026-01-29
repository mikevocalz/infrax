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

  // Determine if we should force the "solid/scrolled" look.
  // We force it on all pages except 'home', because other pages have white backgrounds.
  const isLightBackgroundPage = currentPath !== 'home';
  const showSolidHeader = isScrolled || isLightBackgroundPage;

  // Safeguard: Always close mobile menu when currentPath changes
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolidHeader ? 'glass-nav py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          <div className="flex items-center">
            <Radio className="w-6 h-6 mr-2 text-[#f37021]" />
            <span className={`text-xl font-black tracking-tighter uppercase transition-colors ${
              showSolidHeader ? 'text-[#000d1a]' : 'text-white'
            }`}>
              InFra<span className="text-[#f37021]">X</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all hover:text-[#f37021] relative py-2 group ${
                currentPath === item.href 
                ? 'text-[#f37021]' 
                : showSolidHeader ? 'text-[#000d1a]/70' : 'text-white/70'
              }`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#f37021] scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${currentPath === item.href ? 'scale-x-100' : ''}`} />
            </button>
          ))}
          <div className={`h-6 w-px ${showSolidHeader ? 'bg-navy/10' : 'bg-white/20'}`} />
          <button 
            onClick={() => handleNavClick('contact')}
            className="px-6 py-2.5 bg-[#f37021] text-white hover:bg-[#d95d12] transition-all text-[10px] font-bold uppercase tracking-widest rounded-none shadow-lg shadow-orange-500/20"
          >
            Request A Match
          </button>
        </nav>

        {/* Mobile Toggle - Ensure high visibility */}
        <button 
          className={`xl:hidden z-50 p-2 transition-colors ${
            showSolidHeader ? "text-[#000d1a]" : "text-white"
          } ${mobileMenuOpen ? "text-[#000d1a]" : ""}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 xl:hidden flex flex-col p-8 pt-24 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`text-2xl font-black uppercase tracking-widest text-left transition-colors ${
                  currentPath === item.href ? 'text-[#f37021]' : 'text-[#000d1a] hover:text-[#f37021]'
                }`}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-8 mt-4 border-t border-[#000d1a]/10">
              <button 
                onClick={() => handleNavClick('contact')}
                className="w-full py-5 btn-primary text-white rounded-none font-bold text-center flex items-center justify-center"
              >
                Request InfraAlign™ Match
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;