import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import HomePage from './components/pages/HomePage';
import PlatformPage from './components/pages/PlatformPage';
import IntelligencePage from './components/pages/IntelligencePage';
import MetricsPage from './components/pages/MetricsPage';
import WhyInfraXPage from './components/pages/WhyInfraXPage';
import ServicesPage from './components/pages/ServicesPage';
import AboutPage from './components/pages/AboutPage';
import PartnersPage from './components/pages/PartnersPage';
import ContactPage from './components/pages/ContactPage';
import { SERVICES } from './constants';
import { Mail, Phone, Twitter, Linkedin, Facebook } from 'lucide-react';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  const renderContent = () => {
    switch (currentPath) {
      case 'home':
        return <HomePage onNavigate={setCurrentPath} />;
      case 'platform':
        return <PlatformPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'metrics':
        return <MetricsPage />;
      case 'why-infrax':
        return <WhyInfraXPage />;
      case 'services':
        return <ServicesPage />;
      case 'about':
        return <AboutPage />;
      case 'partners':
        return <PartnersPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={setCurrentPath} />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#f37021] selection:text-white">
      <Header currentPath={currentPath} onNavigate={setCurrentPath} />
      
      <main className="animate-in fade-in duration-700 fill-mode-both">
        {renderContent()}

        {/* Global CTA - Visible except on contact/intelligence pages */}
        {currentPath !== 'contact' && currentPath !== 'intelligence' && (
          <section className="py-32 lg:py-40 bg-[#000d1a] text-white relative overflow-hidden">
            <div className="absolute inset-0 industrial-grid-dark opacity-10 pointer-events-none" />
            <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
              <h2 className="text-4xl md:text-8xl font-black leading-none tracking-tighter uppercase max-w-5xl mx-auto">
                Ready to <br /><span className="text-[#f37021]">Align?</span>
              </h2>
              <p className="text-xl lg:text-2xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                Connect with our strategic infrastructure team to architect your next deployment using the InFraAlign™ model.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={() => setCurrentPath('contact')}
                  className="px-10 py-6 lg:px-16 lg:py-8 btn-primary text-lg lg:text-xl"
                >
                  Request A Match
                </button>
                <button 
                  onClick={() => setCurrentPath('intelligence')}
                  className="px-10 py-6 lg:px-16 lg:py-8 btn-outline-navy !border-white !text-white hover:!bg-white hover:!text-[#000d1a] text-lg lg:text-xl transition-all"
                >
                  Market Signals
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-[#000d1a] text-white border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="text-3xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => setCurrentPath('home')}>
                InFra<span className="text-[#f37021]">X</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed font-light max-w-xs">
                Strategic infrastructure advisory and delivery. Built for signal, not noise. Enforcing disciplined evaluation through implementation.
              </p>
              <div className="flex gap-6">
                <Twitter className="w-5 h-5 text-white/40 hover:text-[#f37021] cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-white/40 hover:text-[#f37021] cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 text-white/40 hover:text-[#f37021] cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Infrastructure</h5>
              <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">
                {SERVICES.map(s => (
                  <li key={s.id} onClick={() => setCurrentPath('services')} className="hover:text-white cursor-pointer transition-colors flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white/10" />
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Resources</h5>
              <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">
                <li onClick={() => setCurrentPath('platform')} className="hover:text-white cursor-pointer transition-colors">InfraAlign™ Platform</li>
                <li onClick={() => setCurrentPath('intelligence')} className="hover:text-white cursor-pointer transition-colors">Market Intelligence</li>
                <li onClick={() => setCurrentPath('metrics')} className="hover:text-white cursor-pointer transition-colors">Education Metrics</li>
                <li onClick={() => setCurrentPath('why-infrax')} className="hover:text-white cursor-pointer transition-colors">Why InFraX</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Connection</h5>
              <div className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                <div className="flex items-center gap-5 group">
                  <Phone className="w-4 h-4 text-[#f37021] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">1-800-INFRAX</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <Mail className="w-4 h-4 text-[#f37021] group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">info@infrax.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
            <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2025 InFraX Strategic Advisory. Decisions Predictable.
            </div>
            <div className="flex gap-10 text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
              <span className="hover:text-white cursor-pointer transition-colors">Legal</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App;