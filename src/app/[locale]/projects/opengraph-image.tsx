import { contentType, size } from '@/lib/og';
import { pageCard } from '@/lib/og-page';

// Sayfanın başlıklı paylaşım kartı; asıl alt metni `buildMetadata` basıyor.
export const alt = 'YTÜ Blockchain';
export { size, contentType };

export default pageCard('projects');
