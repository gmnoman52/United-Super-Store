import { metadataFor } from '../components/page-metadata';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, Catalogue, Icon } from '../components/ui';
import { useStore } from '../store';
import { colors as c } from '../theme';

export default function Home() {
  const { mode, setMode } = useStore();
  return <Screen><Text accessibilityRole="header" style={s.title}>Your neighbourhood.{ '\n' }Your store.</Text><Text style={s.subtitle}>Everyday shopping at United Super Store</Text>
    <Text style={s.label}>How would you like to shop?</Text><View accessibilityRole="radiogroup" style={s.modes}>
      {(['delivery', 'pickup'] as const).map(value => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: mode === value }} onPress={() => setMode(value)} style={({ pressed }) => [s.mode, mode === value && s.selected, pressed && { opacity: .75 }]}><Icon name={value === 'delivery' ? 'truck' : 'shopping-bag'} color={mode === value ? c.brand : c.textSecondary}/><Text style={[s.modeText, mode === value && { color: c.brand }]}>{value === 'delivery' ? 'Delivery' : 'Pickup'}</Text>{mode === value && <Icon name="check" size={16} color={c.brand}/>}</Pressable>)}
    </View><Text accessibilityLiveRegion="polite" style={s.hint}>{mode === 'delivery' ? 'Choose your delivery address at checkout' : 'Collect your order from United Super Store'}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Search the store" style={s.search} onPress={() => router.navigate('/browse')}><Icon name="search"/><Text style={s.searchText}>Search the store</Text><Icon name="chevron-right" size={16}/></Pressable>
    <View style={s.section}><Text accessibilityRole="header" style={s.heading}>In the store</Text><Pressable accessibilityRole="button" onPress={() => router.navigate('/browse')} style={s.browse}><Text style={s.browseText}>Browse all</Text></Pressable></View>
    <Catalogue compact/>
    <View style={s.signoff}><Icon name="shopping-bag"/><View style={{ flex: 1 }}><Text style={s.signoffTitle}>Your local United Super Store</Text><Text style={s.hint}>Home delivery or collect from the store</Text></View></View>
  </Screen>;
}
const s = StyleSheet.create({
  title: { fontSize: 30, lineHeight: 38, color: c.textPrimary, fontWeight: '600', marginTop: 8 }, subtitle: { color: c.textSecondary, fontSize: 14, lineHeight: 22, marginTop: 12 },
  label: { color: c.textPrimary, fontSize: 14, fontWeight: '500', marginTop: 28, marginBottom: 12 }, modes: { flexDirection: 'row', gap: 12 }, mode: { flex: 1, minHeight: 56, padding: 8, borderWidth: 1, borderColor: c.controlBorder, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }, selected: { backgroundColor: c.selectedSurface, borderColor: c.brand }, modeText: { flex: 1, color: c.textPrimary, fontSize: 16, fontWeight: '500' }, hint: { fontSize: 12, lineHeight: 20, color: c.textMuted, marginTop: 8 },
  search: { minHeight: 56, flexDirection: 'row', gap: 12, alignItems: 'center', padding: 16, borderWidth: 1, borderColor: c.controlBorder, borderRadius: 12, backgroundColor: c.background, marginTop: 24 }, searchText: { flex: 1, color: c.textSecondary, fontSize: 16 }, section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 }, heading: { fontSize: 20, color: c.textPrimary, fontWeight: '600' }, browse: { minHeight: 44, justifyContent: 'center', paddingLeft: 12 }, browseText: { color: c.brand, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' }, signoff: { marginTop: 24, flexDirection: 'row', gap: 12, alignItems: 'center' }, signoffTitle: { color: c.textPrimary, fontSize: 14, fontWeight: '500' },
});

export function generateMetadata() { return metadataFor('/'); }
