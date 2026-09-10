// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sundara-moorthy.com';

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
            url: `${baseUrl}/insights`,
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
            url: `${baseUrl}/what-i-do`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // 2. Blog posts (insights) - fetch at build time
    let blogPosts: MetadataRoute.Sitemap = [];

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.sundara-moorthy.com/api';
        console.log('📡 Fetching blog posts from:', `${apiUrl}/posts/published`);

        const response = await fetch(`${apiUrl}/posts/published`, {
            next: { revalidate: 3600 }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('📦 Blog posts response:', data);

            const posts = Array.isArray(data) ? data :
                data?.posts || data?.data || data?.items || [];

            console.log(`📊 Found ${posts.length} published blog posts`);

            blogPosts = posts
                .filter((post: any) => post.status === 'published' && post.slug)
                .map((post: any) => ({
                    url: `${baseUrl}/insights/${post.slug}`,
                    lastModified: new Date(post.publishDate || post.updatedAt || post.createdAt || new Date()),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                }));

            console.log(`✅ Generated ${blogPosts.length} blog post URLs for sitemap`);
        } else {
            console.error('❌ Failed to fetch blog posts:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
    }

    // 3. Portfolio items
    let portfolioItems: MetadataRoute.Sitemap = [];

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.sundara-moorthy.com/api';
        console.log('📡 Fetching portfolio items from:', `${apiUrl}/apps/all`);

        const response = await fetch(`${apiUrl}/apps/all`, {
            next: { revalidate: 3600 }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('📦 Portfolio response:', data);

            const apps = Array.isArray(data) ? data : data?.data || data?.apps || [];

            console.log(`📊 Found ${apps.length} portfolio items`);

            portfolioItems = apps
                .filter((app: any) => app.isActive && app.seoSlug)
                .map((app: any) => ({
                    url: `${baseUrl}/portfolio/${app.seoSlug}`,
                    lastModified: new Date(app.updatedAt || app.createdAt || new Date()),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                }));

            console.log(`✅ Generated ${portfolioItems.length} portfolio URLs for sitemap`);
        } else {
            console.error('❌ Failed to fetch portfolio items:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ Error fetching portfolio items:', error);
    }

    // Combine all
    const allUrls = [...staticPages, ...blogPosts, ...portfolioItems];
    console.log(`📊 Total sitemap URLs generated: ${allUrls.length}`);

    return allUrls;
}