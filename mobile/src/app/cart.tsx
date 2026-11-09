import { metadataFor } from '../components/page-metadata';
import { randomUUID } from 'expo-crypto';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Screen, Heading, Empty, Button, s } from '../components/ui';
import { Field, Notice } from '../components/form';
import { useStore } from '../store';
import { useAuth } from '../auth';
import { requireSupabase } from '../lib/supabase';
import { money, type StoreSettings } from '../lib/domain';
import { colors as c } from '../theme';

export default function Cart() {
  const { mode, cart, setQuantity, refresh } = useStore();
  const { session } = useAuth();
  return <Screen><Heading title="Your cart" subtitle={mode === 'delivery' ? 'Shopping for delivery' : 'Shopping for store pickup'}/>{!cart.length ? <Empty icon="shopping-bag" title="Your cart is empty" copy="The items you choose will appear here" action="Browse the store" onAction={() => router.navigate('/browse')}/> : <>
    {cart.map(item => <View key={item.product.id} style={{ borderBottomWidth: 1, borderColor: c.divider, paddingVertical: 16 }}><Text style={s.productName}>{item.product.name}</Text><Text style={s.subtitle}>{item.product.unit} — {money(item.product.price_paisa)}</Text><View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}><Button title="−" quiet onPress={() => setQuantity(item.product.id, item.quantity - 1)}/><Text accessibilityLabel={`Quantity ${item.quantity}`} style={{ color: c.textPrimary, marginTop: 24 }}>{item.quantity}</Text><Button title="+" quiet onPress={() => setQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}/></View></View>)}
    <Button title="Refresh prices and stock" onPress={refresh} quiet/>{session ? <Checkout key={session.user.id}/> : <Button title="Log in to checkout" onPress={() => router.navigate('/account')}/>}
  </>}</Screen>;
}
function Checkout() {
  const { mode, cart, clearCart, refresh } = useStore();
  const { session } = useAuth();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [name, setName] = useState(String(session?.user.user_metadata.full_name ?? ''));
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const request = useRef<string | null>(null);
  const fingerprint = useRef('');
  useFocusEffect(useCallback(() => {
    let active = true;
    requireSupabase().from('store_settings').select('*').eq('id', 1).single().then(({ data, error }) => { if (active) { setSettings(error ? null : data); if (error) setMessage('Couldn’t load checkout. Reopen your cart to try again'); } });
    return () => { active = false; };
  }, []));
  const subtotal = cart.reduce((sum, item) => sum + item.product.price_paisa * item.quantity, 0);
  const fee = mode === 'delivery' ? settings?.delivery_fee_paisa : 0;
  async function reloadCheckout() {
    refresh(); setMessage(''); setSettings(null);
    const { data, error } = await requireSupabase().from('store_settings').select('*').eq('id', 1).single();
    if (error) setMessage('Couldn’t refresh checkout. Please try again');
    else setSettings(data);
  }
  async function placeOrder() {
    if (busy) return;
    setMessage('');
    try {
      if (!name.trim() || phone.trim().length < 7 || (mode === 'delivery' && address.trim().length < 8)) throw new Error('Enter your name, phone number and complete delivery address');
      setBusy(true);
      const input = { p_expected_total_paisa: subtotal + (fee ?? 0), p_fulfilment: mode, p_name: name.trim(), p_phone: phone.trim(), p_address: address.trim(), p_items: cart.map(item => ({ id: item.product.id, quantity: item.quantity, price_paisa: item.product.price_paisa })) };
      const next = JSON.stringify(input);
      if (!request.current || fingerprint.current !== next) { request.current = randomUUID(); fingerprint.current = next; }
      const { error } = await requireSupabase().rpc('place_order', { ...input, p_request_id: request.current });
      if (error) throw error;
      clearCart(); refresh(); router.navigate({pathname:'/orders',params:{placed:'1'}});
    } catch (error) { setMessage(error instanceof Error ? error.message : typeof error === 'object' && error && 'message' in error ? String(error.message) : 'Couldn’t place your order. Try again'); }
    finally { setBusy(false); }
  }
  const available = settings?.ordering_enabled && (mode === 'delivery' ? settings.delivery_enabled : settings.pickup_enabled) && fee != null && settings.minimum_order_paisa != null;
  return <View><Text style={[s.emptyTitle, { textAlign: 'left', marginTop: 24 }]}>Checkout</Text><Text style={s.subtitle}>Items: {money(subtotal)}</Text><Text style={s.subtitle}>Delivery: {fee == null ? 'Not configured' : money(fee)}</Text>{fee != null && <Text style={s.price}>Total: {money(subtotal + fee)}</Text>}
    <Text style={s.subtitle}>{mode === 'delivery' ? 'Pay cash on delivery' : 'Pay cash at pickup'}</Text>
    {mode === 'pickup' && settings?.address && <Text style={s.subtitle}>Collect from: {settings.address}</Text>}
    {settings && !available && <Notice text="The store is not accepting this type of order yet"/>}
    {settings?.minimum_order_paisa != null && subtotal < settings.minimum_order_paisa && <Notice text={`Minimum order: ${money(settings.minimum_order_paisa)}`}/>}
    <Field label="Full name" value={name} onChangeText={setName} maxLength={160}/><Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={30}/>{mode === 'delivery' && <Field label="Delivery address" value={address} onChangeText={setAddress} multiline maxLength={1000}/>}
    <Notice text={message} error/><Button title="Refresh checkout" onPress={() => void reloadCheckout()} quiet disabled={busy}/><Button title={busy ? 'Placing order…' : 'Place order'} onPress={placeOrder} disabled={busy || !available || subtotal < (settings?.minimum_order_paisa ?? 0)}/>
  </View>;
}

export function generateMetadata() { return metadataFor('/cart'); }
