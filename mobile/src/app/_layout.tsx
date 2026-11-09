import { View, Text, Pressable } from 'react-native';
import type { ErrorBoundaryProps } from 'expo-router';
import { PageMetadata } from '../components/page-metadata';
import { AuthProvider } from '../auth';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors as c } from '../theme';
import { StoreProvider } from '../store';
import { BrandHeader, Icon, type IconName } from '../components/ui';

function Navigation() {
  const insets = useSafeAreaInsets();
  const tabs: { name: string; title: string; icon: IconName }[] = [
    { name: 'index', title: 'Home', icon: 'home' }, { name: 'browse', title: 'Browse', icon: 'grid' },
    { name: 'cart', title: 'Cart', icon: 'shopping-bag' }, { name: 'orders', title: 'Orders', icon: 'file-text' }, { name: 'account', title: 'Account', icon: 'user' },
  ];
  return <Tabs screenOptions={{ header: () => <BrandHeader/>, tabBarActiveTintColor: c.brand, tabBarInactiveTintColor: c.textMuted, tabBarActiveBackgroundColor: c.selectedSurface, tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.divider, height: 72 + insets.bottom, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8) }, tabBarItemStyle: { borderRadius: 12, marginHorizontal: 4 }, tabBarLabelStyle: { fontSize: 12, marginBottom: 4 } }}>
    {tabs.map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{ title: `${tab.title} | United Super Store`, tabBarLabel: tab.title, tabBarAccessibilityLabel: tab.title, tabBarIcon: ({ color }) => <Icon name={tab.icon} color={typeof color === 'string' ? color : c.textSecondary}/> }}/>) }
  <Tabs.Screen name="+not-found" options={{href:null,title:"Page not found"}}/></Tabs>;
}
export default function Layout() {
  return <SafeAreaProvider><SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.surface }}><PageMetadata/><StatusBar style="dark"/><AuthProvider><StoreProvider><Navigation/></StoreProvider></AuthProvider></SafeAreaView></SafeAreaProvider>;
}

export function ErrorBoundary({retry}:ErrorBoundaryProps) { return <View style={{flex:1,padding:24,justifyContent:'center',backgroundColor:c.surface}}><Text style={{fontSize:24,color:c.textPrimary}}>Something went wrong</Text><Text style={{color:c.textSecondary,marginTop:12}}>Please try opening this screen again</Text><Pressable accessibilityRole="button" onPress={retry} style={{padding:16,marginTop:24,backgroundColor:c.brand,borderRadius:12}}><Text style={{color:c.onBrand}}>Try again</Text></Pressable><Text style={{marginTop:32,color:c.textSecondary}}>Powerd by GEN ALPHA DEVELOPERS</Text></View>; }
