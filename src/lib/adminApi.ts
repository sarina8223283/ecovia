// Shared helper for password-gated admin data access via the secure backend function.
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sarina-admin`;

export const ADMIN_PASSWORD = '7524';

export const callAdminFn = async <T = any>(body: Record<string, unknown>): Promise<T> => {
  const resp = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ password: ADMIN_PASSWORD, ...body }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error((data as any).error || 'Request failed');
  return data as T;
};

export const fetchAdminOrders = async (): Promise<any[]> => {
  const data = await callAdminFn<{ orders: any[] }>({ action: 'list_orders' });
  return data.orders || [];
};

export const updateAdminOrder = async (id: string, update: Record<string, unknown>) => {
  await callAdminFn({ action: 'update_order', tool_call: { id, update } });
};
