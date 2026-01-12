import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetailClient from './BlogDetailClient'
import serverApi from '../../service/server-api'

// Define types
type Post = {
    id: string;
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    description: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    metaKeywords: string;
}

type Category = {
    id: number;
    name: string;
}

type RelatedPost = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
}

// Helper function to parse tags
const parseTags = (tags: any): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.filter((tag: any) => typeof tag === 'string');

    if (typeof tags === 'string') {
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                return parsed.filter((tag: any) => typeof tag === 'string');
            }
        } catch {
            const cleanString = tags
                .replace(/[{}[\]\\"]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            if (cleanString.includes(',')) {
                return cleanString.split(',')
                    .map((tag: string) => tag.trim())
                    .filter((tag: string) => tag.length > 0);
            }
            return cleanString ? [cleanString] : [];
        }
    }
    return [];
};

// CRITICAL: For static export
export const dynamicParams = false; // Don't generate pages on-demand

// Generate static paths
export async function generateStaticParams() {
    console.log('📦 Generating static params for blog posts...');

    try {
        const { data } = await serverApi.get("/posts");
        const posts = data?.posts || data?.data || data || [];

        console.log(`📊 Found ${posts.length} total posts from API`);

        // Filter only published posts
        const publishedPosts = posts.filter((post: any) =>
            post.slug &&
            post.slug.trim() !== '' &&
            post.status === 'published'
        );

        console.log(`✅ Generating ${publishedPosts.length} published posts`);

        // Return only the slugs
        return publishedPosts.map((post: any) => ({
            slug: post.slug.trim(),
        }));

    } catch (error: any) {
        console.error('❌ Error in generateStaticParams:', error.message);
        // Return empty array to prevent build failure
        console.log('⚠️ Returning empty array for static paths');
        return [];
    }
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        console.log(`📄 Generating metadata for slug: ${params.slug}`);

        const { data } = await serverApi.get(`/posts/slug/${params.slug}`);
        const post = data?.post || data;

        if (!post) {
            console.log(`❌ Post not found for slug: ${params.slug}`);
            return {
                title: "Blog Post Not Found",
                description: "The requested blog post could not be found.",
            };
        }

        const siteUrl = 'https://www.futureindias.com';
        const pageUrl = `${siteUrl}/articles/${post.slug}`;

        const title = post.metaTitle || post.title || "Blog Post";
        const description = post.metaDescription || post.description || post.excerpt || "Read this interesting blog post";
        const keywords = post.metaKeywords || "";
        const imageUrl = post.coverImage || `${siteUrl}/default-blog-image.jpg`;
        const tagsArray = parseTags(post.tags);

        return {
            title,
            description,
            keywords: keywords ? keywords.split(',').map((k: string) => k.trim()) : undefined,
            authors: [{ name: "Future Indias" }],
            creator: "Future Indias",
            publisher: "Future Indias",
            robots: "index, follow",

            openGraph: {
                type: "article",
                url: pageUrl,
                title,
                description,
                siteName: "Future Indias",
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                publishedTime: post.createdAt,
                modifiedTime: post.updatedAt,
                authors: ["Future Indias"],
                tags: tagsArray,
            },

            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [imageUrl],
                creator: "@FutureIndias",
                site: "@FutureIndias",
            },

            alternates: {
                canonical: pageUrl,
            },
        };
    } catch (error) {
        console.error(`❌ Error generating metadata for ${params.slug}:`, error);
        return {
            title: "Blog Post",
            description: "Read this interesting blog post",
        };
    }
}

// Main page component
export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    try {
        console.log(`🚀 Loading page for slug: ${params.slug}`);

        // Fetch the post
        const { data } = await serverApi.get(`/posts/slug/${params.slug}`);
        const post = data?.post || data;

        if (!post) {
            console.log(`❌ Post not found for slug: ${params.slug}`);
            notFound();
        }

        // Fetch related data
        let category: Category | null = null;
        let relatedPosts: RelatedPost[] = [];

        if (post.categoryId) {
            try {
                // Fetch categories
                const { data: categoriesData } = await serverApi.get("/categories");
                const categories = categoriesData?.categories || categoriesData?.data || categoriesData || [];

                category = categories.find((cat: any) => cat.id === post.categoryId);

                // Fetch all posts for related posts
                const { data: allPostsData } = await serverApi.get("/posts");
                const allPosts = allPostsData?.posts || allPostsData?.data || allPostsData || [];

                relatedPosts = allPosts
                    .filter((p: any) =>
                        p.categoryId === post.categoryId &&
                        p.id !== post.id &&
                        p.status === "published"
                    )
                    .slice(0, 3)
                    .map((p: any) => ({
                        id: p.id,
                        slug: p.slug,
                        title: p.title,
                        excerpt: p.excerpt || p.description || "",
                        category: category?.name || "Uncategorized"
                    }));
            } catch (error) {
                console.error('Error fetching related data:', error);
                // Continue without related data
            }
        }

        console.log(`✅ Successfully loaded post: ${post.title}`);

        return (
            <BlogDetailClient
                slug={params.slug}
                initialPost={post}
                initialCategory={category}
                initialRelatedPosts={relatedPosts}
            />
        );

    } catch (error) {
        console.error(`❌ Error loading page for ${params.slug}:`, error);
        notFound();
    }
}