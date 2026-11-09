import { metadataFor } from '../components/page-metadata';
import { router } from 'expo-router';
import { Screen, Heading, Empty } from '../components/ui';
export default function NotFound() {
  return <Screen><Heading title="Page not found" subtitle="This page may have moved or the link may be incorrect"/><Empty icon="map-pin" title="Let’s get you back to the store" copy="Browse products or return to the home screen" action="Back to home" onAction={() => router.replace('/')}/></Screen>;
}

export function generateMetadata() { return metadataFor('/404'); }
