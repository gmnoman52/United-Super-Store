import { metadataFor } from '../components/page-metadata';
import { Notice } from '../components/form';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Screen, Heading, Empty, Button, s } from '../components/ui';
import { useAuth } from '../auth';
import { requireSupabase } from '../lib/supabase';
import { money, statusLabel, type Order } from '../lib/domain';
import { colors as c } from '../theme';
export default function Orders() {
  const { session } = useAuth();
  const {placed}=useLocalSearchParams<{placed?:string}>();
  const [success,setSuccess]=useState(false);
  useEffect(()=>{if(placed==='1') queueMicrotask(()=>{setSuccess(true);router.setParams({placed:undefined});});},[placed]);
  return <Screen><Heading title="Your orders" subtitle="Keep your shopping in one place"/>{success && session && <Notice text="Order placed successfully. You can follow its status below"/>}{session ? <History key={session.user.id} userId={session.user.id}/> : <Empty icon="file-text" title="Log in to see your orders" copy="Your orders are private to your account" action="Log in" onAction={() => router.navigate('/account')}/>}</Screen>;
}
function History({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const load = useCallback(async (next = 0) => {
    setLoading(true); setError(false);
    try {
      const { data, error } = await requireSupabase().from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(next * 20, next * 20 + 19);
      if (error) throw error;
      setOrders(previous => next ? [...previous, ...data] : data); setHasMore(data.length === 20); setPage(next);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, [userId]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (loading && !orders.length) return <ActivityIndicator accessibilityLabel="Loading orders" color={c.brand}/>;
  if (error) return <Empty icon="wifi-off" title="Couldn’t load your orders" copy="Check your connection and try again" action="Try again" onAction={() => void load()}/>;
  if (!orders.length) return <Empty icon="file-text" title="No orders to show" copy="Your delivery and pickup orders will appear here" action="Browse the store" onAction={() => router.navigate('/browse')}/>;
  return <><Button title="Refresh orders" onPress={() => void load()} quiet disabled={loading}/>{orders.map(order => <View key={order.id} style={{ paddingVertical: 24, borderBottomWidth: 1, borderColor: c.divider }}><Text style={s.productName}>Order {order.id.slice(0, 8)}</Text><Text style={s.price}>{statusLabel(order.status)}</Text><Text style={s.subtitle}>{new Date(order.created_at).toLocaleString()} / {order.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}</Text>{order.items.map(item => <Text key={item.id} style={s.subtitle}>{item.quantity} × {item.name} ({item.unit})</Text>)}<Text style={s.price}>{money(order.total_paisa)}</Text></View>)}{hasMore && <Button title={loading ? 'Loading…' : 'Load more'} onPress={() => void load(page + 1)} disabled={loading}/>}</>;
}

export function generateMetadata() { return metadataFor('/orders'); }
