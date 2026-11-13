import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconLock, IconSparkles } from '@tabler/icons-react';
import type { EstimatorLead, LeadPersona } from '../../services/constructionProjectService';
import { toolSelectClass } from '../UI/NumberField';

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara', 'Outside Nigeria',
];

export const PERSONA_OPTIONS: { value: LeadPersona; label: string }[] = [
  { value: 'homeowner', label: 'Building my own home' },
  { value: 'diaspora', label: 'Diaspora — building back home' },
  { value: 'developer', label: 'Property developer / investor' },
  { value: 'contractor', label: 'Contractor / builder / engineer' },
  { value: 'other', label: 'Something else' },
];

const fieldClass =
  'w-full min-h-12 px-4 py-3 text-base rounded-sm bg-paper-50 border border-paper-300 text-ink-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emptyLead(defaultState = ''): EstimatorLead {
  // Marketing consent must be an active opt-in (Nigeria Data Protection Act), so it starts unticked.
  return { fullName: '', email: '', phone: '', persona: '', state: defaultState, marketingConsent: false };
}

function validate(lead: EstimatorLead): string | null {
  if (lead.fullName.trim().length < 2) return 'Please enter your full name.';
  if (!EMAIL_RE.test(lead.email.trim())) return 'Please enter a valid email address.';
  const digits = lead.phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone or WhatsApp number.';
  if (!lead.persona) return 'Please tell us who you are.';
  if (!lead.state) return 'Please choose your state.';
  return null;
}

interface LeadCaptureFormProps {
  initial: EstimatorLead;
  submitting: boolean;
  serverError?: string | null;
  onBack: () => void;
  onSubmit: (lead: EstimatorLead) => void;
}

/** Freemium gate: visitors leave their details, then see their free estimate. */
const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  initial,
  submitting,
  serverError,
  onBack,
  onSubmit,
}) => {
  const [lead, setLead] = useState<EstimatorLead>(initial);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof EstimatorLead>(key: K, value: EstimatorLead[K]) =>
    setLead((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate(lead);
    setError(problem);
    if (problem) return;
    onSubmit({
      ...lead,
      fullName: lead.fullName.trim(),
      email: lead.email.trim().toLowerCase(),
      phone: lead.phone.trim(),
    });
  };

  const shownError = error || serverError;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-courtyard-700 font-semibold flex items-center gap-2">
          <IconSparkles size={14} /> Free during our launch
        </p>
        <h3 className="font-display text-xl md:text-2xl font-semibold text-ink-950 mt-2">
          Where should we send your estimate?
        </h3>
        <p className="text-sm text-ink-600 mt-2">
          Your full estimate and PDF are free. Tell us a little about you to see it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <span className="block text-sm font-medium text-ink-800 mb-2">Full name</span>
          <input
            className={fieldClass}
            value={lead.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            autoComplete="name"
            placeholder="e.g. Adaeze Okafor"
            maxLength={120}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink-800 mb-2">Email</span>
          <input
            className={fieldClass}
            type="email"
            inputMode="email"
            value={lead.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={200}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink-800 mb-2">Phone / WhatsApp</span>
          <input
            className={fieldClass}
            type="tel"
            inputMode="tel"
            value={lead.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
            placeholder="0803 000 0000"
            maxLength={30}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink-800 mb-2">Who are you?</span>
          <select
            className={toolSelectClass}
            value={lead.persona}
            onChange={(e) => set('persona', e.target.value as LeadPersona)}
          >
            <option value="">Choose one…</option>
            {PERSONA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink-800 mb-2">Your state</span>
          <select className={toolSelectClass} value={lead.state} onChange={(e) => set('state', e.target.value)}>
            <option value="">Choose your state…</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid grid-cols-[1.25rem_1fr] gap-3 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={lead.marketingConsent}
          onChange={(e) => set('marketingConsent', e.target.checked)}
          className="mt-0.5 !w-5 !h-5 !min-h-0 accent-courtyard-700"
        />
        <span className="text-sm text-ink-600">
          Send me building tips, price updates and DirectHome launch offers by email or WhatsApp. I
          can unsubscribe at any time.
        </span>
      </label>

      {shownError && (
        <div className="border border-laterite-500/30 bg-laterite-500/10 px-4 py-3 text-sm text-laterite-600">
          {shownError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="min-h-12 px-5 py-3 border border-paper-300 text-ink-800 hover:bg-paper-100 disabled:opacity-50 flex items-center gap-1"
        >
          <IconArrowLeft size={18} /> Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 sm:flex-none min-h-12 px-6 py-3 bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600 disabled:opacity-50"
        >
          {submitting ? 'Preparing your estimate…' : 'Show my free estimate'}
        </button>
      </div>

      <p className="text-xs text-ink-400 flex items-start gap-2">
        <IconLock size={14} className="mt-0.5 shrink-0" />
        <span>
          We keep your details private and never sell them. See our{' '}
          <Link to="/privacy" className="underline hover:text-ink-600">
            privacy policy
          </Link>
          . Have an account?{' '}
          <Link to="/auth/login?redirect=/construction-estimator" className="underline hover:text-ink-600">
            Sign in
          </Link>{' '}
          to skip this.
        </span>
      </p>
    </form>
  );
};

export default LeadCaptureForm;
