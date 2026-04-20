import Link from 'next/link';
import { Mail, Phone, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 bg-[#000d1a] text-white border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase">
              InFra<span className="text-[#f37021]">X</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed font-light max-w-xs">
              The intelligence layer for AI-scale infrastructure deployment. Aligning power, land, capital, and operators before capital is exposed.
            </p>
            <div className="flex gap-6">
              <Twitter className="w-5 h-5 text-white/40 hover:text-[#f37021] cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-white/40 hover:text-[#f37021] cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-white/40 hover:text-[#f37021] cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Platform</h5>
            <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">
              <li>
                <Link href="/platform" className="hover:text-white transition-colors flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white/10" />
                  Infra-Align™ Engine
                </Link>
              </li>
              <li>
                <Link href="/intelligence" className="hover:text-white transition-colors flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white/10" />
                  Market Intelligence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Services</h5>
            <ul className="space-y-4 text-white/40 text-[11px] font-bold uppercase tracking-[0.2em]">
              <li><Link href="/execution" className="hover:text-white transition-colors">Execution Discipline</Link></li>
              <li><Link href="/capital" className="hover:text-white transition-colors">Capital Validation</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Leadership</Link></li>
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
  );
}
