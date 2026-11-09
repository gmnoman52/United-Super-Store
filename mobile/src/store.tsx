import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { fetchProducts, requireSupabase, type Product } from './lib/supabase';

type Store = {
  contact: { name: string; address: string; phone: string; email: string } | null;
  mode: 'delivery' | 'pickup'; setMode: (mode: 'delivery' | 'pickup') => void;
  products: Product[]; loading: boolean; error: boolean; refresh: () => void;
  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<Store['mode']>('delivery');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState<Store['contact']>(null);
  const [cart, setCart] = useState<Store['cart']>([]);
  const addToCart = (product: Product) => setCart(items => {
    if (product.stock < 1) return items;
    const existing = items.find(item => item.product.id === product.id);
    return existing ? items.map(item => item.product.id === product.id ? { product, quantity: Math.min(product.stock, item.quantity + 1) } : item) : [...items, { product, quantity: 1 }];
  });
  const setQuantity = (id: string, quantity: number) => setCart(items => items.map(item => item.product.id === id ? { ...item, quantity: Math.min(item.product.stock, Math.max(0, Math.floor(quantity))) } : item).filter(item => item.quantity > 0));
  const active = useRef<AbortController | null>(null);
  const load = useCallback(() => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    void requireSupabase().from('store_settings').select('name,address,phone,email').eq('id',1).abortSignal(controller.signal).single().then(({data}) => { if (active.current === controller) setContact(data); });
    fetchProducts(controller.signal).then(data => {
      if (active.current === controller) {
        setProducts(data);
        setCart(items => items.map(item => ({ ...item, product: data.find(product => product.id === item.product.id) ?? { ...item.product, stock: 0 } })));
      }
    }).catch(() => {
      if (active.current === controller) { setProducts([]); setError(true); }
    }).finally(() => {
      clearTimeout(timeout);
      if (active.current === controller) setLoading(false);
    });
  }, []);
  const refresh = useCallback(() => { setLoading(true); setError(false); load(); }, [load]);
  useEffect(() => { load(); return () => { const request = active.current; active.current = null; request?.abort(); }; }, [load]);
  return <Context.Provider value={{ contact, mode, setMode, products, loading, error, refresh, cart, addToCart, setQuantity, clearCart: () => setCart([]) }}>{children}</Context.Provider>;
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error('StoreProvider is required');
  return store;
}
