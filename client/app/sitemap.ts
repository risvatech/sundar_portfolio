// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.risva.app';

    console.log('🔧 Generating sitemap at build time...');

    // 1. Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/web-apps`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/mobile-apps`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ai-solutions`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/get-started`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/seo-questionnaire`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/hybrid-cms-vs-wordpress`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/hybrid-customized-cms-website`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/nextjs-website-design`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/seo-friendly-website-design`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/web-design-company-bangalore`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/web-design-company-hosur`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },{
            url: `${baseUrl}/web-design-company-tamilnadu`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },{
            url: `${baseUrl}/website-design-to-boost-sales`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/web-design-development`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/website-maintenance`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/website-speed-optimization`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    // 2. Blog posts - fetch at build time
    let blogPosts: MetadataRoute.Sitemap = [];

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.risva.app/api';
        const response = await fetch(`${apiUrl}/posts?status=published&limit=1000`, {
            // This will be cached at build time
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (response.ok) {
            const data = await response.json();

            // Handle response format
            const posts = Array.isArray(data) ? data :
                data?.data || data?.posts || data?.items || [];

            blogPosts = posts.map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug || post.id}`,
                lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }

    // 3. Portfolio items
    let portfolioItems: MetadataRoute.Sitemap = [];

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.risva.app/api';
        const response = await fetch(`${apiUrl}/apps/all`, {
            next: { revalidate: 3600 }
        });

        if (response.ok) {
            const data = await response.json();
            const apps = Array.isArray(data) ? data : data?.data || [];

            portfolioItems = apps
                .filter((app: any) => app.isActive && app.seoSlug)
                .map((app: any) => ({
                    url: `${baseUrl}/portfolio/${app.seoSlug}`,
                    lastModified: new Date(app.updatedAt || app.createdAt || new Date()),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                }));
        }
    } catch (error) {
        console.error('Error fetching portfolio items:', error);
    }

    // Combine all
    return [...staticPages, ...blogPosts, ...portfolioItems];
}