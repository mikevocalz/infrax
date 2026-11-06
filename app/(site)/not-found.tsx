import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 industrial-grid-dark opacity-10" />
      <div className="relative z-10 text-center space-y-10 px-6">
        <div className="section-label !text-orange-accent mx-auto">Error // 404</div>
        <h1 className="text-8xl md:text-[12rem] font-black text-white tracking-tighter leading-none">
          4<span className="text-orange-accent">0</span>4
        </h1>
        <p className="text-xl text-white/50 font-light max-w-md mx-auto leading-relaxed">
          This infrastructure node does not exist. Signal lost.
        </p>
        <Link
          href="/"
          className="inline-block px-12 py-6 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
}
