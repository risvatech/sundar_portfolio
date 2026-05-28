// app/insights/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetailClient from './BlogDetailClient'
import serverApi from '../../service/server-api'

// Define types
interface Post {
    id: string | number;
    slug: string;
    title: string;
    metaTitle: string | null;
    metaDescription: string | null;
    description: string | null;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    tags: string | null;
    categoryId: number | null;
    createdAt: string;
    updatedAt: string;
    status: string;
    metaKeywords: string | null;
    publishDate?: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface RelatedPost {
    id: string | number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
}

// Define API response types
interface SinglePostApiResponse {
    success: boolean;
    post?: Post;
    data?: Post;
}

interface PostsListApiResponse {
    success: boolean;
    posts?: Post[];
    data?: Post[];
}

interface CategoriesListApiResponse {
    success: boolean;
    categories?: Category[];
    data?: Category[];
}

// ✅ FOR DYNAMIC ROUTING
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Helper function to convert null to undefined and format for BlogPost
const formatPostForClient = (post: Post) => {
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? undefined,  // Convert null to undefined
        content: post.content,
        coverImage: post.coverImage ?? undefined,  // Convert null to undefined
        description: post.description ?? undefined,  // Convert null to undefined
        tags: post.tags ?? undefined,  // Convert null to undefined
        categoryId: post.categoryId ?? undefined,  // Convert null to undefined
        createdAt: post.createdAt ?? undefined,  // Convert null to undefined
        publishDate: post.publishDate ?? undefined,  // Convert null to undefined
        updatedAt: post.updatedAt ?? undefined,  // Convert null to undefined
        status: post.status,
        metaExcerpt: post.excerpt ?? undefined,  // Convert null to undefined
        metaDescription: post.metaDescription ?? undefined,  // Convert null to undefined
        metaTitle: post.metaTitle ?? undefined,  // Convert null to undefined
        metaKeywords: post.metaKeywords ?? undefined,  // Convert null to undefined
    };
};

// Helper function to parse tags
const parseTags = (tags: string | null | undefined): string[] => {
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

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        console.log(`📄 Generating metadata for slug: ${params.slug}`);

        const response = await serverApi.get<SinglePostApiResponse>(`/posts/slug/${params.slug}`);
        const post = response.data?.post || response.data?.data;

        if (!post || post.status !== 'published') {
            console.log(`❌ Post not found or not published for slug: ${params.slug}`);
            return {
                title: "Blog Post Not Found",
                description: "The requested blog post could not be found.",
                robots: "noindex, nofollow",
            };
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sundara-moorthy.com';
        const pageUrl = `${siteUrl}/insights/${post.slug}`;

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
                publishedTime: post.publishDate || post.createdAt,
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
            robots: "noindex, nofollow",
        };
    }
}

// Main page component
interface PageProps {
    params: {
        slug: string;
    };
}

export default async function BlogDetailPage({ params }: PageProps) {
    try {
        console.log(`🚀 Loading page for slug: ${params.slug}`);

        // Fetch the post
        const response = await serverApi.get<SinglePostApiResponse>(`/posts/slug/${params.slug}`);
        const post = response.data?.post || response.data?.data;

        // Check if post exists AND is published
        if (!post || post.status !== 'published') {
            console.log(`❌ Post not found or not published for slug: ${params.slug}`);
            notFound();
        }

        // Fetch category if exists
        let category: Category | null = null;
        let relatedPosts: RelatedPost[] = [];

        if (post.categoryId) {
            try {
                // Fetch categories
                const categoriesResponse = await serverApi.get<CategoriesListApiResponse>("/categories");
                const categories = categoriesResponse.data?.categories || categoriesResponse.data?.data || [];
                category = categories.find((cat: Category) => cat.id === post.categoryId) || null;

                // Fetch published posts for related content
                const postsResponse = await serverApi.get<PostsListApiResponse>("/posts/published");
                const allPosts = postsResponse.data?.posts || postsResponse.data?.data || [];

                relatedPosts = allPosts
                    .filter((p: Post) =>
                        p.categoryId === post.categoryId &&
                        p.id !== post.id &&
                        p.status === "published"
                    )
                    .slice(0, 3)
                    .map((p: Post) => ({
                        id: p.id,
                        slug: p.slug,
                        title: p.title,
                        excerpt: p.excerpt || p.description || "",
                        category: category?.name || "Uncategorized"
                    }));
            } catch (error) {
                console.error('Error fetching related data:', error);
            }
        }

        console.log(`✅ Successfully loaded post: ${post.title}`);

        // ✅ Format the post to convert null to undefined before passing to client
        const formattedPost = formatPostForClient(post);

        return (
            <BlogDetailClient
                slug={params.slug}
                initialPost={formattedPost}
                initialCategory={category}
                initialRelatedPosts={relatedPosts}
            />
        );

    } catch (error) {
        console.error(`❌ Error loading page for ${params.slug}:`, error);
        notFound();
    }
}