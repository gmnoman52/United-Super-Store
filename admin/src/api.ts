import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key);
export const db = createClient(url || 'https://unconfigured.supabase.co', key || 'unconfigured');
export type Product = { id: string; name: string; description: string; unit: string; price_paisa: number; stock: number; image_url: string | null; is_active: boolean; category_id: string | null; updated_at: string };
export type Category = { id: string; name: string; is_active: boolean };
export type Settings = { id: number; name: string; address: string; phone: string; email: string; ordering_enabled: boolean; delivery_enabled: boolean; pickup_enabled: boolean; delivery_fee_paisa: number | null; minimum_order_paisa: number | null };
export type Order = { id: string; customer_name: string; phone: string; address: string; fulfilment: 'delivery' | 'pickup'; status: string; total_paisa: number; delivery_fee_paisa: number; subtotal_paisa: number; created_at: string; items: { id: string; name: string; unit: string; price_paisa: number; quantity: number }[] };
export const money = (value: number) => `Rs ${(value / 100).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const label = (value: string) => value.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());
export const errorText = (error: unknown) => error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Something went wrong. Please try again';
export function paisa(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Enter a non-negative price with up to two decimal places');
  const [whole, fraction = ''] = value.split('.');
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(result) || result > 2147483647) throw new Error('Price is too large');
  return result;
}
export const rupees = (value: number | null) => value == null ? '' : (value / 100).toFixed(2);
export function nextStatuses(order: Order): string[] {
  switch (order.status) {
    case 'pending': return ['accepted', 'cancelled'];
    case 'accepted': return ['preparing', 'cancelled'];
    case 'preparing': return [order.fulfilment === 'pickup' ? 'ready' : 'out_for_delivery', 'cancelled'];
    case 'ready': case 'out_for_delivery': return ['completed', 'cancelled'];
    default: return [];
  }
}
