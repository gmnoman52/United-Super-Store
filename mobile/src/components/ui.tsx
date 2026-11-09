import { ProductThumbnail } from './product-thumbnail';
import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, router, type Href } from 'expo-router';
import { colors as c } from '../theme';
import { useStore } from '../store';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Footer } from './footer';
import { useState, useSyncExternalStore } from 'react';
import { AddToCartButton } from './add-to-cart-button';

export type IconName = ComponentProps<typeof Feather>['name'];
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function Icon({ name, size = 24, color = c.textSecondary }: { name: IconName; size?: number; color?: string }) {
  // Icon fonts can finish loading between server rendering and client hydration.
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  if (!ready) return <View style={{ width: size, height: size }} accessible={false}/>;
  return <Feather name={name} size={size} color={color} accessible={false} />;
}
export function Button({ title, onPress, quiet = false, disabled = false }: { title: string; onPress: () => void; quiet?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={onPress} style={({ pressed }) => [s.button, quiet ? s.quiet : s.primary, (pressed || disabled) && s.pressed]}><Text style={[s.buttonText, { color: quiet ? c.brand : c.onBrand }]}>{title}</Text></Pressable>;
}
export function Screen({ children }: PropsWithChildren) {
  const { loading, refresh } = useStore();
  return <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.brand} colors={[c.brand]} />}>
    {children}<Footer/>
  </ScrollView>;
}
export function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return <View style={s.heading}><Text accessibilityRole="header" style={s.title}>{title}</Text>{/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subtitle) ? <Link href={`mailto:${subtitle}`} style={s.subtitle}>{subtitle}</Link> : <Text style={s.subtitle}>{subtitle}</Text>}</View>;
}
export function Empty({ icon, title, copy, action, onAction, compact }: { icon: IconName; title: string; copy: string; action?: string; onAction?: () => void; compact?: boolean }) {
  return <View style={[s.empty, compact && s.compact]}><Icon name={icon} size={48} color={c.brand}/><Text accessibilityRole="header" style={s.emptyTitle}>{title}</Text><Text style={s.emptyCopy}>{copy}</Text>{action && onAction && <Button title={action} onPress={onAction} quiet />}</View>;
}
export function Catalogue({ query = '', category = '', compact = false }: { query?: string; category?: string; compact?: boolean }) {
  const { products, loading, error, refresh } = useStore();
  if (loading) return <View style={s.loading} accessibilityLabel="Loading products" accessibilityLiveRegion="polite"><ActivityIndicator color={c.brand}/><Text style={s.subtitle}>Loading the store</Text></View>;
  if (error) return <Empty compact={compact} icon="wifi-off" title="Couldn’t load the store" copy="Check your connection and try again" action="Try again" onAction={refresh}/>;
  if (!products.length) return <Empty compact={compact} icon="shopping-bag" title="No products available yet" copy="Products will appear here when the store adds them"/>;
  const filtered = products.filter(p => (!category || p.category_id === category) && `${p.name} ${p.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  if (!filtered.length) return <Empty icon="search" title="No matching products" copy="Try another name or clear your search"/>;
  return <View>{filtered.map(product => <View key={product.id} style={s.product}>
    <ProductThumbnail key={product.image_url} uri={product.image_url} name={product.name}/>
    <View style={s.productDetails}><Text style={s.productName}>{product.name}</Text><Text style={s.subtitle}>{product.unit}</Text><Text style={s.price}>Rs {(product.price_paisa / 100).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text><Text style={s.subtitle}>{product.stock ? 'Available' : 'Out of stock'}</Text><AddToCartButton product={product}/></View>
  </View>)}</View>;
}
export function BrandHeader() {
  const [open,setOpen] = useState(false);
  const destinations = [['/','Home'],['/browse','Browse'],['/cart','Cart'],['/orders','Orders'],['/account','Account']];
  return <View><View style={s.header}><Pressable accessibilityRole="button" accessibilityLabel="United Super Store home" onPress={() => {setOpen(false);router.navigate('/');}} style={[s.brand,{flex:1,minWidth:0}]}><Image source={require('../../assets/logo-small.png')} style={s.logo} accessibilityLabel="United Super Store logo"/><View><Text style={s.brandName}>United</Text><Text style={s.brandSubtitle}>Super Store</Text></View></Pressable><Pressable accessibilityRole="button" accessibilityLabel={open?'Close menu':'Open menu'} accessibilityState={{expanded:open}} onPress={() => setOpen(!open)} style={s.account}><Icon name={open?'x':'menu'}/></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Open account" onPress={() => {setOpen(false);router.navigate('/account');}} style={s.account}><Icon name="user"/></Pressable></View>{open && <View style={{backgroundColor:c.surface,padding:16,gap:4}}>{destinations.map(([path,name]) => <Pressable key={path} accessibilityRole="button" onPress={() => {setOpen(false);router.navigate(path as Href);}} style={{minHeight:48,padding:12}}><Text style={{color:c.brand,fontSize:16}}>{name}</Text></Pressable>)}</View>}</View>;
}
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.surface }, content: { padding: 24, paddingBottom: 40, maxWidth: 640, width: '100%', alignSelf: 'center' },
  heading: { marginBottom: 24 }, title: { color: c.textPrimary, fontSize: 28, lineHeight: 36, fontWeight: '600' }, subtitle: { color: c.textSecondary, fontSize: 14, lineHeight: 22, marginTop: 8 },
  button: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 }, primary: { backgroundColor: c.brand }, quiet: { borderWidth: 1, borderColor: c.controlBorder }, pressed: { opacity: .75 }, buttonText: { fontSize: 16, fontWeight: '500' },
  empty: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 16 }, compact: { backgroundColor: c.background, borderRadius: 16, paddingVertical: 32 }, emptyTitle: { color: c.textPrimary, fontSize: 18, fontWeight: '500', textAlign: 'center', marginTop: 20 }, emptyCopy: { color: c.textSecondary, fontSize: 14, lineHeight: 22, maxWidth: 280, textAlign: 'center', marginTop: 8 },
  loading: { minHeight: 228, alignItems: 'center', justifyContent: 'center' },
  header: { padding: 16, paddingHorizontal: 16, gap: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: c.surface, borderBottomWidth: 1, borderColor: c.divider }, brand: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }, logo: { width: 52, height: 52, resizeMode: 'contain' }, brandName: { color: c.brand, fontSize: 20, fontWeight: '600' }, brandSubtitle: { color: c.brand, fontSize: 14 }, account: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.divider, borderRadius: 12 },
  product: { flexDirection: 'row', gap: 16, paddingVertical: 20, borderBottomWidth: 1, borderColor: c.divider }, productImage: { width: 80, height: 96, borderRadius: 12, backgroundColor: c.background }, productPlaceholder: { alignItems: 'center', justifyContent: 'center' }, productDetails: { flex: 1, minWidth: 0 }, productName: { flexShrink: 1, color: c.textPrimary, fontSize: 16, fontWeight: '500' }, price: { color: c.brand, fontSize: 18, fontWeight: '500', marginTop: 8 },
});
