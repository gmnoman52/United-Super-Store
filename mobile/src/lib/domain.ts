export type StoreSettings = { id: number; name: string; address: string; phone: string; email: string; ordering_enabled: boolean; delivery_enabled: boolean; pickup_enabled: boolean; delivery_fee_paisa: number | null; minimum_order_paisa: number | null };
export type OrderItem = { id: string; name: string; unit: string; price_paisa: number; quantity: number };
export type Order = { id: string; user_id: string; fulfilment: 'delivery' | 'pickup'; customer_name: string; phone: string; address: string; items: OrderItem[]; subtotal_paisa: number; delivery_fee_paisa: number; total_paisa: number; status: string; created_at: string };
export const money = (paisa: number) => `Rs ${(paisa / 100).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const statusLabel = (status: string) => status.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());
