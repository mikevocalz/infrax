import React from "react";
import {
  ShieldCheck,
  HeartPulse,
  Building,
  ShoppingBag,
  Landmark,
  ArrowUpRight,
} from "lucide-react";

const SolutionsPage: React.FC = () => {
  const industries = [
    {
      title: "Healthcare",
      icon: <HeartPulse className="w-12 h-12 text-[#f37021]" />,
      description:
        "Securing patient data and medical infrastructure with HIPAA-compliant SOC services and continuous threat monitoring.",
      metrics: [
        "100% HIPAA Compliance",
        "24/7 Endpoint Protection",
        "Rapid Incident Containment",
      ],
    },
    {
      title: "Finance & Banking",
      icon: <Landmark className="w-12 h-12 text-[#002b5c]" />,
      description:
        "Military-grade defense for financial transactions and sensitive institutional data against sophisticated cyber adversaries.",
      metrics: [
        "Zero-Trust Architecture",
        "Real-time Fraud Detection",
        "Regulatory Audit Readiness",
      ],
    },
    {
      title: "Retail & E-commerce",
      icon: <ShoppingBag className="w-12 h-12 text-[#f37021]" />,
      description:
        "Protecting consumer trust and payment infrastructure during peak traffic and high-volume transaction periods.",
      metrics: [
        "PCI-DSS Alignment",
        "DDOS Mitigation",
        "Supply Chain Security",
      ],
    },
    {
      title: "Public Sector",
      icon: <Building className="w-12 h-12 text-[#002b5c]" />,
      description:
        "Sovereign cybersecurity for government agencies, ensuring the integrity of public services and citizen data.",
      metrics: [
        "NIST Framework Integration",
        "Secure Cloud Operations",
        "Multi-Agency SOC",
      ],
    },
  ];

  return (
    <div className="pt-40 bg-white selection:bg-[#f37021] selection:text-white">
      <div className="container mx-auto px-6 space-y-32 mb-32">
        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-end max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="section-label">Tailored Defense</div>
            <h1 className="text-5xl md:text-8xl font-black text-[#002b5c] uppercase tracking-tighter leading-[0.85]">
              INDUSTRY <br />
              <span className="text-[#f37021]">SOLUTIONS.</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#64748b] font-light leading-relaxed">
            Every industry faces unique threats. InfraX provides specialized
            security frameworks designed for the specific regulatory and
            technical challenges of your sector.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#002b5c]/10 border border-[#002b5c]/10">
          {industries.map((industry) => (
            <div
              key={industry.title}
              className="bg-white p-12 lg:p-16 hover:bg-[#f8fafc] transition-all group border-b md:border-b-0 border-[#002b5c]/5"
            >
              <div className="mb-10">{industry.icon}</div>
              <h3 className="text-3xl font-black text-[#002b5c] uppercase tracking-tighter mb-6">
                {industry.title}
              </h3>
              <p className="text-[#64748b] font-light leading-relaxed mb-10 text-lg">
                {industry.description}
              </p>

              <div className="space-y-3 mb-12">
                {industry.metrics.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[#002b5c]"
                  >
                    <div className="w-1.5 h-1.5 bg-[#f37021]" />
                    {m}
                  </div>
                ))}
              </div>

              <button className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[0.2em] text-[#002b5c] group-hover:text-[#f37021] transition-all border-t border-[#002b5c]/10 pt-8">
                <span>View Full Roadmap</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Specialized Feature */}
        <section className="bg-[#002b5c] text-white p-12 lg:p-24 relative overflow-hidden industrial-grid-dark">
          <div className="max-w-4xl relative z-10 space-y-8">
            <ShieldCheck className="w-16 h-16 text-[#f37021]" />
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
              The Zero-Trust <br />
              Foundation.
            </h2>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              Regardless of industry, we implement a comprehensive Zero-Trust
              framework. We never trust, always verify, ensuring that your
              perimeter is not your only line of defense.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
              {["Identity", "Endpoints", "Data", "Apps"].map((item) => (
                <div key={item}>
                  <div className="text-2xl font-black text-white">{item}</div>
                  <div className="text-[10px] text-[#f37021] font-bold uppercase mt-2">
                    Verified
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SolutionsPage;
