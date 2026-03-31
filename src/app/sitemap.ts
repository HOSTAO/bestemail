import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bestemail.in';

  const pages = [
    '',
    '/about',
    '/features',
    '/pricing',
    '/blog',
    '/contact',
    '/integrations',
    '/careers',
    '/partners',
    '/press',
    '/solutions',
    '/security',
    '/docs',
    '/support',
    '/faq',
    '/terms',
    '/privacy',
    '/refund',
    '/cancellation',
    '/cookie-policy',
    '/dpa',
    '/changelog',
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : page === '/pricing' || page === '/features' ? 0.9 : 0.7,
  }));
}
