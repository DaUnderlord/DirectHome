import React, { useState } from 'react';
import {
  isFlutterwaveConfigured,
  openFlutterwaveCheckout,
} from '../../services/flutterwave';
import {
  PaidToolId,
  TOOL_REPORT_PRICE_NGN,
  isToolUnlocked,
  unlockTool,
} from '../../constants/toolPricing';

interface ResultPaywallProps {
  toolId: PaidToolId;
  title?: string;
  onUnlocked: () => void;
}

const ResultPaywall: React.FC<ResultPaywallProps> = ({
  toolId,
  title = 'Unlock your results',
  onUnlocked,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email so we can send your receipt.');
      return;
    }

    setBusy(true);
    try {
      if (!isFlutterwaveConfigured()) {
        if (import.meta.env.DEV) {
          unlockTool(toolId);
          onUnlocked();
          return;
        }
        setError('Payments are not configured yet. Add a Flutterwave public key.');
        return;
      }

      const result = await openFlutterwaveCheckout({
        amount: TOOL_REPORT_PRICE_NGN,
        email: trimmed,
        name: name.trim() || 'DirectHome customer',
        title: 'DirectHome',
        description: `${title} — ₦${TOOL_REPORT_PRICE_NGN}`,
        meta: { toolId },
      });

      if (result.status === 'successful') {
        unlockTool(toolId);
        onUnlocked();
        return;
      }

      if (result.status === 'cancelled') {
        setError('Payment was cancelled. Results stay locked until payment is complete.');
        return;
      }

      setError('Payment did not go through. Try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 border border-brass-500/30 bg-paper-100 p-6 md:p-8 text-center">
      <p className="text-courtyard-700 text-[11px] tracking-[0.28em] uppercase mb-3">Unlock report</p>
      <h3 className="font-display text-2xl font-semibold text-ink-950 mb-2">{title}</h3>
      <p className="text-ink-600 max-w-md mx-auto mb-6">
        Your estimate is ready. Pay <span className="text-courtyard-700 font-semibold">₦{TOOL_REPORT_PRICE_NGN}</span> to
        view the full breakdown. One payment unlocks this tool for the rest of your session.
      </p>

      <form onSubmit={handlePay} className="max-w-sm mx-auto space-y-3 text-left">
        <label className="block text-sm text-ink-800">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-sm bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700"
            placeholder="you@email.com"
          />
        </label>
        <label className="block text-sm text-ink-800">
          Name <span className="text-ink-400">(optional)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-sm bg-paper-50 border border-paper-300 text-ink-950 focus:ring-2 focus:ring-courtyard-500 focus:border-courtyard-700"
            placeholder="Full name"
          />
        </label>
        {error && <p className="text-sm text-laterite-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full mt-2 py-3 rounded-sm bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600 disabled:opacity-50"
        >
          {busy ? 'Opening checkout…' : `Pay ₦${TOOL_REPORT_PRICE_NGN}`}
        </button>
      </form>
    </div>
  );
};

export function useToolUnlock(toolId: PaidToolId) {
  const [unlocked, setUnlocked] = useState(() => isToolUnlocked(toolId));
  return {
    unlocked,
    unlock: () => {
      unlockTool(toolId);
      setUnlocked(true);
    },
  };
}

interface PaidResultsGateProps {
  toolId: PaidToolId;
  title: string;
  ready: boolean;
  children: React.ReactNode;
}

export function PaidResultsGate({ toolId, title, ready, children }: PaidResultsGateProps) {
  const { unlocked, unlock } = useToolUnlock(toolId);
  if (!ready) return null;
  if (!unlocked) {
    return <ResultPaywall toolId={toolId} title={title} onUnlocked={unlock} />;
  }
  return <>{children}</>;
}

export default ResultPaywall;
