import { metadataFor } from '../components/page-metadata';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen, Heading, Catalogue, Icon } from '../components/ui';
import { colors as c } from '../theme';
import { requireSupabase } from '../lib/supabase';
export default function Browse() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<{id: string; name: string}[]>([]);
  const [category, setCategory] = useState('');
  useFocusEffect(useCallback(() => {
    let active = true;
    requireSupabase().from('categories').select('id,name').eq('is_active', true).order('name').then(({data}) => { if (active) { setCategories(data ?? []); setCategory(previous => data?.some(item => item.id === previous) ? previous : ''); } });
    return () => { active = false; };
  }, []));
  return <Screen><Heading title="Browse the store" subtitle="Find your everyday essentials"/><View style={s.search}><Icon name="search"/><TextInput accessibilityLabel="Search products" value={query} onChangeText={setQuery} placeholderTextColor={c.textMuted} style={s.input} returnKeyType="search"/>{!!query && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={s.clear}><Text style={s.clearText}>Clear</Text></Pressable>}</View>{categories.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>{[{id:'',name:'All'},...categories].map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: category === item.id }} onPress={() => setCategory(item.id)} style={{ minHeight:44, justifyContent:'center', paddingHorizontal:16, borderRadius:8, borderWidth:1, borderColor: category === item.id ? c.brand : c.controlBorder, backgroundColor: category === item.id ? c.selectedSurface : c.surface }}><Text style={{ color: category === item.id ? c.brand : c.textPrimary }}>{item.name}</Text></Pressable>)}</View>}<Catalogue query={query} category={category}/></Screen>;
}
const s = StyleSheet.create({ search: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: c.background, borderWidth: 1, borderColor: c.controlBorder, borderRadius: 12 }, input: { flex: 1, minWidth: 0, minHeight: 56, fontSize: 16, color: c.textPrimary }, clear: { minHeight: 44, minWidth: 44, justifyContent: 'center' }, clearText: { color: c.brand } });

export function generateMetadata() { return metadataFor('/browse'); }
