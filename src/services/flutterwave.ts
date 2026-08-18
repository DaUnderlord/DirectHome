const FLUTTERWAVE_PUBLIC_KEY = String(
  import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || ''
).trim();

export type FlutterwaveKeyMode = 'live' | 'test' | 'missing';

export function flutterwaveKeyMode(): FlutterwaveKeyMode {
  if (!FLUTTERWAVE_PUBLIC_KEY) return 'missing';
  return /_TEST-/i.test(FLUTTERWAVE_PUBLIC_KEY) ? 'test' : 'live';
}

if (import.meta.env.DEV && flutterwaveKeyMode() === 'test') {
  console.warn(
    'DirectHome: VITE_FLUTTERWAVE_PUBLIC_KEY is a TEST key. Flutterwave checkout will show test mode on localhost until you set live keys in .env and restart the dev server.'
  );
}
export interface FlutterwaveCheckoutOptions {
  amount: number;
  currency?: string;
  email: string;
  name?: string;
  phone?: string;
  title: string;
  description?: string;
  txRef?: string;
  meta?: Record<string, string | number>;
}

export interface FlutterwaveCheckoutResult {
  status: 'successful' | 'cancelled' | 'failed';
  transactionId?: string;
  txRef: string;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: Record<string, unknown>) => void;
  }
}

function loadFlutterwaveScript(): Promise<void> {
  if (window.FlutterwaveCheckout) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-flutterwave]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Flutterwave')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.dataset.flutterwave = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Flutterwave'));
    document.head.appendChild(script);
  });
}

function isPaidStatus(status?: string) {
  return status === 'successful' || status === 'completed';
}

export function isFlutterwaveConfigured(): boolean {
  return FLUTTERWAVE_PUBLIC_KEY.length > 0;
}

export function createPaymentRef(toolId: string) {
  const nonce = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `DH-${toolId}-${nonce}`;
}

export async function verifyPaidReport(params: {
  transactionId: string;
  txRef: string;
  toolId: string;
  customerEmail?: string;
  customerName?: string;
  userId?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch('/api/verify-flutterwave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !payload?.ok) {
    return { ok: false, error: payload?.error || 'Payment could not be verified.' };
  }
  return { ok: true };
}

export async function openFlutterwaveCheckout(
  options: FlutterwaveCheckoutOptions
): Promise<FlutterwaveCheckoutResult> {
  const txRef = options.txRef || createPaymentRef('report');

  if (!FLUTTERWAVE_PUBLIC_KEY) {
    console.warn('DirectHome: VITE_FLUTTERWAVE_PUBLIC_KEY is not set. Payment checkout skipped.');
    return { status: 'failed', txRef };
  }

  await loadFlutterwaveScript();

  return new Promise((resolve) => {
    let settled = false;
    const settle = (result: FlutterwaveCheckoutResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    window.FlutterwaveCheckout?.({
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: txRef,
      amount: options.amount,
      currency: options.currency || 'NGN',
      payment_options: 'card,banktransfer,ussd,opay',
      customer: {
        email: options.email,
        name: options.name || 'DirectHome customer',
        phone_number: options.phone,
      },
      customizations: {
        title: options.title,
        description: options.description || 'DirectHome',
        logo: '/favicon.png',
      },
      meta: options.meta,
      callback: (response: { status?: string; transaction_id?: string | number }) => {
        settle({
          status: isPaidStatus(response?.status) ? 'successful' : 'failed',
          transactionId: response?.transaction_id ? String(response.transaction_id) : undefined,
          txRef,
        });
      },
      onclose: () => {
        window.setTimeout(() => {
          if (!settled) settle({ status: 'cancelled', txRef });
        }, 400);
      },
    });
  });
}
