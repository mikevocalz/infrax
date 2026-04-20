'use client';

import { useState } from 'react';
import type { UserType } from '@/types';
import Link from 'next/link';
import { CheckCircle2, Building2, TrendingUp, Cpu, Users, ChevronRight, ArrowLeft } from 'lucide-react';

type Step = 'type' | 'requirements' | 'confirm';

const USER_TYPES: { value: UserType; label: string; description: string; icon: typeof Building2 }[] = [
  { value: 'developer', label: 'Developer / Operator', description: 'I need to deploy AI or HPC infrastructure and require site selection, power sourcing, or execution support.', icon: Cpu },
  { value: 'investor', label: 'Capital / Investor', description: 'I am deploying or underwriting infrastructure capital and require feasibility modeling or asset diligence.', icon: TrendingUp },
  { value: 'operator', label: 'Operator / Supplier', description: 'I operate data center capacity and want to participate in the InfraX supply network.', icon: Building2 },
  { value: 'advisor', label: 'Advisor / Consultant', description: 'I represent a client or project and need infrastructure intelligence or mandate support.', icon: Users },
];

const DEPLOYMENT_SIZES = ['< 1 MW', '1–5 MW', '5–20 MW', '20–100 MW', '> 100 MW'];
const TIMELINES = ['< 6 months', '6–12 months', '12–24 months', '> 24 months'];
const REGIONS_LIST = ['Northern Virginia', 'Dallas-Fort Worth', 'Columbus, OH', 'Chicago, IL', 'Atlanta, GA', 'Phoenix, AZ', 'Portland, OR', 'Multiple / Flexible'];

interface FormData {
  userType: UserType | null;
  organization: string;
  name: string;
  email: string;
  deploymentSize: string;
  timeline: string;
  regions: string[];
  notes: string;
  // Investor-specific
  assetType: string;
  capitalAmount: string;
  // Operator-specific
  availableMW: string;
  market: string;
}

const EMPTY: FormData = {
  userType: null, organization: '', name: '', email: '',
  deploymentSize: '', timeline: '', regions: [], notes: '',
  assetType: '', capitalAmount: '', availableMW: '', market: '',
};

function ProgressBar({ step }: { step: Step }) {
  const steps: Step[] = ['type', 'requirements', 'confirm'];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-black transition-colors ${
            i < idx ? 'bg-emerald-500 text-white' : i === idx ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {i < idx ? '✓' : i + 1}
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block ${
            i === idx ? 'text-navy' : 'text-slate-400'
          }`}>
            {s === 'type' ? 'Profile' : s === 'requirements' ? 'Requirements' : 'Submit'}
          </span>
          {i < steps.length - 1 && <div className="w-8 h-px bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}

export default function IntakeFlow() {
  const [step, setStep] = useState<Step>('type');
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function update(key: keyof FormData, val: unknown) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function toggleRegion(r: string) {
    setForm(prev => ({
      ...prev,
      regions: prev.regions.includes(r) ? prev.regions.filter(x => x !== r) : [...prev.regions, r],
    }));
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 py-16">
        <div className="w-20 h-20 bg-emerald-500 mx-auto flex items-center justify-center">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <div className="space-y-4">
          <div className="text-3xl font-black text-navy uppercase tracking-tighter">Request Received</div>
          <p className="text-slate-500 font-light leading-relaxed">
            Your infrastructure intake has been logged. An InfraX analyst will respond within one business day to schedule an initial scoping call.
          </p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 text-left space-y-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">What Happens Next</div>
          {[
            'Analyst reviews your requirements (1 business day)',
            'Scoping call to validate constraints and priorities',
            'Infra-Align™ modeling initiated within 3 business days',
            'Scored candidate shortlist delivered within 7 business days',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <div className="w-5 h-5 bg-navy text-white flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">{i + 1}</div>
              {item}
            </div>
          ))}
        </div>
        <Link href="/" className="inline-block px-8 py-4 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  // Step 1: User type
  if (step === 'type') {
    return (
      <div className="max-w-3xl mx-auto">
        <ProgressBar step={step} />
        <div className="space-y-6 mb-10">
          <div className="section-label">Intake</div>
          <h2 className="text-3xl md:text-5xl font-black text-navy uppercase tracking-tighter leading-none">
            How can<br /><span className="text-orange-accent">InfraX help?</span>
          </h2>
          <p className="text-slate-500 font-light">Select the profile that best describes your role and intent.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {USER_TYPES.map(({ value, label, description, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { update('userType', value); setStep('requirements'); }}
              className={`text-left p-8 border-2 transition-all group hover:border-navy ${
                form.userType === value ? 'border-navy bg-slate-50' : 'border-slate-200 bg-white'
              }`}
            >
              <Icon size={28} className="text-orange-accent mb-4" />
              <div className="font-black text-navy uppercase tracking-tight mb-2">{label}</div>
              <div className="text-sm text-slate-500 font-light leading-relaxed">{description}</div>
              <div className="flex items-center gap-1 mt-4 text-[10px] font-black uppercase tracking-widest text-orange-accent opacity-0 group-hover:opacity-100 transition-opacity">
                Select <ChevronRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Requirements (branched by type)
  if (step === 'requirements') {
    const isDeveloper = form.userType === 'developer' || form.userType === 'advisor';
    const isInvestor = form.userType === 'investor';
    const isOperator = form.userType === 'operator';
    const typeMeta = USER_TYPES.find(t => t.value === form.userType)!;

    return (
      <div className="max-w-2xl mx-auto">
        <ProgressBar step={step} />
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setStep('type')} className="text-slate-400 hover:text-navy transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-orange-accent">{typeMeta.label}</div>
            <div className="text-xl font-black text-navy uppercase tracking-tight">Your Requirements</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Contact info */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
              { key: 'email', label: 'Work Email', placeholder: 'you@company.com', type: 'email' },
              { key: 'organization', label: 'Organization', placeholder: 'Company name', type: 'text', full: true },
            ].map(field => (
              <div key={field.key} className={`space-y-2 ${field.full ? 'sm:col-span-2' : ''}`}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof FormData] as string}
                  onChange={e => update(field.key as keyof FormData, e.target.value)}
                  className="w-full border-b border-slate-200 focus:border-orange-accent bg-transparent py-3 outline-none text-navy font-light placeholder:text-slate-300"
                />
              </div>
            ))}
          </div>

          {/* Developer/Advisor fields */}
          {(isDeveloper) && (
            <>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Size</label>
                <div className="flex flex-wrap gap-2">
                  {DEPLOYMENT_SIZES.map(s => (
                    <button key={s} onClick={() => update('deploymentSize', s)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                        form.deploymentSize === s ? 'bg-navy text-white border-navy' : 'border-slate-200 text-slate-600 hover:border-navy'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Required Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map(t => (
                    <button key={t} onClick={() => update('timeline', t)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                        form.timeline === t ? 'bg-navy text-white border-navy' : 'border-slate-200 text-slate-600 hover:border-navy'
                      }`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Regions <span className="font-normal text-slate-400">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS_LIST.map(r => (
                    <button key={r} onClick={() => toggleRegion(r)}
                      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        form.regions.includes(r) ? 'bg-orange-accent text-white border-orange-accent' : 'border-slate-200 text-slate-500 hover:border-slate-400'
                      }`}>{r}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Investor fields */}
          {isInvestor && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Greenfield Development', 'Existing Asset Acquisition', 'Portfolio Diligence', 'Fund Deployment'].map(t => (
                    <button key={t} onClick={() => update('assetType', t)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                        form.assetType === t ? 'bg-navy text-white border-navy' : 'border-slate-200 text-slate-600 hover:border-navy'
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capital Range</label>
                <div className="flex flex-wrap gap-2">
                  {['< $50M', '$50–250M', '$250M–1B', '> $1B'].map(t => (
                    <button key={t} onClick={() => update('capitalAmount', t)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                        form.capitalAmount === t ? 'bg-navy text-white border-navy' : 'border-slate-200 text-slate-600 hover:border-navy'
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Operator fields */}
          {isOperator && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Capacity (MW)</label>
                <input
                  type="text" placeholder="e.g. 15"
                  value={form.availableMW}
                  onChange={e => update('availableMW', e.target.value)}
                  className="w-full border-b border-slate-200 focus:border-orange-accent bg-transparent py-3 outline-none text-navy font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Market</label>
                <input
                  type="text" placeholder="e.g. Northern Virginia"
                  value={form.market}
                  onChange={e => update('market', e.target.value)}
                  className="w-full border-b border-slate-200 focus:border-orange-accent bg-transparent py-3 outline-none text-navy font-light"
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Context</label>
            <textarea
              rows={3}
              placeholder="Cooling requirements, certifications needed, special constraints..."
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              className="w-full border-b border-slate-200 focus:border-orange-accent bg-transparent py-3 outline-none text-navy font-light resize-none placeholder:text-slate-300"
            />
          </div>

          <button
            onClick={() => setStep('confirm')}
            disabled={!form.name || !form.email || !form.organization}
            className="w-full py-5 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            Review & Submit <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Confirm
  const typeMeta = USER_TYPES.find(t => t.value === form.userType)!;
  return (
    <div className="max-w-xl mx-auto">
      <ProgressBar step={step} />
      <div className="mb-8 flex items-center gap-3">
        <button onClick={() => setStep('requirements')} className="text-slate-400 hover:text-navy transition-colors"><ArrowLeft size={16} /></button>
        <div className="text-xl font-black text-navy uppercase tracking-tight">Confirm & Submit</div>
      </div>

      <div className="space-y-4 mb-10">
        <div className="p-6 bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Intake Summary</div>
          {[
            { label: 'Profile', val: typeMeta.label },
            { label: 'Name', val: form.name },
            { label: 'Email', val: form.email },
            { label: 'Organization', val: form.organization },
            form.deploymentSize && { label: 'Deployment', val: form.deploymentSize },
            form.timeline && { label: 'Timeline', val: form.timeline },
            form.regions.length > 0 && { label: 'Regions', val: form.regions.join(', ') },
            form.capitalAmount && { label: 'Capital', val: form.capitalAmount },
            form.assetType && { label: 'Asset Type', val: form.assetType },
          ].filter(Boolean).map((row: any, i) => (
            <div key={i} className="flex justify-between border-b border-slate-100 pb-2 text-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{row.label}</span>
              <span className="font-bold text-navy text-right max-w-xs">{row.val}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-navy/5 border border-navy/10 text-[10px] text-slate-500 leading-relaxed">
          By submitting, you agree that InfraX will use this information solely to scope and respond to your infrastructure inquiry. All data is handled under strict confidentiality.
        </div>
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="w-full py-5 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-[#d95d12] transition-colors"
      >
        Submit Intake Request
      </button>
    </div>
  );
}
