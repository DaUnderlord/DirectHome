import { supabase } from '../lib/supabase';
import { PaidToolId } from '../constants/toolPricing';

export interface ToolPaymentRecord {
  id?: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  amount: number;
  currency: string;
  tool_id: PaidToolId | string;
  status: string;
  tx_ref: string;
  flutterwave_transaction_id: string;
  payment_type: string | null;
  user_id: string | null;
}

export async function fetchToolPayments(): Promise<{
  success: boolean;
  payments: ToolPaymentRecord[];
  error?: string;
  warning?: string;
}> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const response = await fetch('/api/tool-payments', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    payments?: ToolPaymentRecord[];
    error?: string;
    warning?: string;
  } | null;

  if (!response.ok || !payload?.ok) {
    return {
      success: false,
      payments: [],
      error: payload?.error || 'Could not load payments.',
    };
  }

  return {
    success: true,
    payments: payload.payments || [],
    warning: payload.warning,
  };
}
