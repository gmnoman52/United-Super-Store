import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors as c } from '../theme';
import { useStore } from '../store';
import type { Product } from '../lib/supabase';

export function AddToCartButton({ product }: { product: Product }) {
  const { cart, addToCart } = useStore();
  const quantity = cart.find(item => item.product.id === product.id)?.quantity ?? 0;
  const full = quantity >= product.stock;
  const [progress] = useState(() => new Animated.Value(0));
  const reduceMotion = useRef(true);
  const locked = useRef(false);
  const release = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [added, setAdded] = useState(false);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) reduceMotion.current = value; }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      reduceMotion.current = value;
      if (value) { progress.stopAnimation(); progress.setValue(0); }
    });
    return () => { mounted = false; subscription.remove(); progress.stopAnimation(); clearTimeout(release.current); clearTimeout(reset.current); };
  }, [progress]);
  function add() {
    if (full || locked.current) return;
    locked.current = true;
    addToCart(product);
    setAdded(true); setAnimating(true);
    clearTimeout(release.current); clearTimeout(reset.current);
    progress.stopAnimation(); progress.setValue(0);
    if (!reduceMotion.current) Animated.timing(progress, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true, isInteraction: false }).start();
    if (Platform.OS !== 'web') AccessibilityInfo.announceForAccessibility(`${product.name} added to cart`);
    release.current = setTimeout(() => { locked.current = false; setAnimating(false); }, 420);
    reset.current = setTimeout(() => setAdded(false), 1400);
  }
  const disabled = full || animating;
  return <Animated.View style={[styles.wrapper, { transform: [{ scale: progress.interpolate({ inputRange: [0,.2,.55,1], outputRange: [1,.96,1.03,1] }) }] }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={added ? `${product.name} added to cart` : full ? `${product.name}: ${product.stock ? 'maximum quantity in cart' : 'out of stock'}` : `Add ${product.name} to cart`} accessibilityState={{ disabled }} disabled={disabled} onPress={add} style={({ pressed }) => [styles.button, full && !added && styles.full, pressed && styles.pressed]}>
      <Animated.View style={{ transform: [{ rotate: progress.interpolate({ inputRange: [0,.3,.65,1], outputRange: ['0deg','-8deg','6deg','0deg'] }) }] }}><Feather name={added ? 'check' : 'shopping-bag'} size={20} color={full && !added ? c.textSecondary : c.onBrand} accessible={false}/></Animated.View>
      <Text accessibilityLiveRegion="polite" style={[styles.label, full && !added && styles.fullText]}>{added ? 'Added to cart' : full ? product.stock ? 'Max in cart' : 'Out of stock' : 'Add to cart'}</Text>
    </Pressable>
    <Animated.Text pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.plus, { opacity: progress.interpolate({ inputRange: [0,.15,.65,1], outputRange: [0,1,1,0] }), transform: [{ translateY: progress.interpolate({ inputRange: [0,1], outputRange: [0,-20] }) }] }]}>+1</Animated.Text>
  </Animated.View>;
}
const styles = StyleSheet.create({
  wrapper: { marginTop: 24, position: 'relative' },
  button: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: c.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontSize: 16, fontWeight: '500', color: c.onBrand },
  full: { backgroundColor: c.disabledSurface }, fullText: { color: c.textSecondary }, pressed: { opacity: .8 },
  plus: { position: 'absolute', right: 12, top: -12, fontSize: 16, fontWeight: '600', color: c.brand },
});
