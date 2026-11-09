import Head from 'expo-router/head';
import { usePathname } from 'expo-router';
const pages: Record<string, [string, string]> = {
  '/': ['Home', 'Shop United Super Store for home delivery or store pickup.'],
  '/browse': ['Browse products', 'Search products and categories at United Super Store.'],
  '/cart': ['Your cart', 'Review your United Super Store cart and choose delivery or pickup.'],
  '/orders': ['Your orders', 'View your private United Super Store order history and status.'],
  '/account': ['Your account', 'Log in, sign up or manage your United Super Store customer account.'],
};
export function PageMetadata() {
  const path = usePathname();
  const {title, description} = metadataFor(path);
  return <Head><title>{title}</title><meta name="description" content={description}/></Head>;
}
export function metadataFor(path: string) {
  const [title, description] = pages[path] ?? ['Page not found', 'This United Super Store page could not be found. Return home to continue shopping.'];
  return { title: `${title} | United Super Store`, description };
}
