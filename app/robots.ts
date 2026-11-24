import type { MetadataRoute } from 'next';
import { site } from '@/lib/config';

/* Wpuszcza roboty na całą stronę (poza API formularza) i wskazuje mapę strony. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
