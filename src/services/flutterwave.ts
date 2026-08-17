const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string | undefined;

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

export function isFlutterwaveConfigured(): boolean {
  return Boolean(FLUTTERWAVE_PUBLIC_KEY);
}

export async function openFlutterwaveCheckout(
  options: FlutterwaveCheckoutOptions
): Promise<FlutterwaveCheckoutResult> {
  const txRef = options.txRef || `DH-${Date.now()}`;

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
        logo: '/dh-pin-mark.png',
      },
      meta: options.meta,
      callback: (response: { status?: string; transaction_id?: string }) => {
        settle({
          status: response?.status === 'successful' ? 'successful' : 'failed',
          transactionId: response?.transaction_id ? String(response.transaction_id) : undefined,
          txRef,
        });
      },
      onclose: () => settle({ status: 'cancelled', txRef }),
    });
  });
}
