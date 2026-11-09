import { useState } from 'react';
import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store';
import { colors as c } from '../theme';

export function Footer() {
  const { contact } = useStore();
  const [year] = useState(() => new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Karachi' }).format(new Date()));
  return <View style={styles.footer}>
    <Text style={styles.name}>{contact?.name || 'United Super Store'}</Text>
    <View style={styles.links}>{[['/', 'Home'], ['/browse', 'Browse'], ['/cart', 'Cart'], ['/orders', 'Orders'], ['/account', 'Account']].map(([path,label]) => <Link key={path} href={path as Href} style={styles.link}>{label}</Link>)}</View>
    {!!contact?.address && <Text style={styles.copy}>{contact.address}</Text>}
    {!!contact?.phone && <Link href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} style={styles.link}>{contact.phone}</Link>}
    {!!contact?.email && <Link href={`mailto:${contact.email}`} style={styles.link}>{contact.email}</Link>}
    <Text style={styles.copy}>© {year} {contact?.name || 'United Super Store'}</Text>
    <Text style={styles.credit}>Powerd by GEN ALPHA DEVELOPERS</Text>
  </View>;
}
const styles = StyleSheet.create({ footer: { marginTop: 40, paddingTop: 24, gap: 8, borderTopWidth: 1, borderColor: c.divider, alignItems: 'flex-start' }, name: { color: c.textPrimary, fontSize: 16, fontWeight: '500' }, links: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }, link: { color: c.brand, fontSize: 14, paddingVertical: 12, minHeight: 44, flexShrink: 1, textDecorationLine: 'underline' }, copy: { color: c.textSecondary, fontSize: 13, lineHeight: 20, flexShrink: 1 }, credit: { color: c.textSecondary, fontSize: 13, lineHeight: 20, flexShrink: 1 } });
