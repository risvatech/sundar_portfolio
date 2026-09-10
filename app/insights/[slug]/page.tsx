// app/insights/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetailClient from './BlogDetailClient'
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import api from "@/app/service/api";

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
    slug?: string;
    description?: string;
    image?: string;
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

// Helper function to get full image URL
const getFullImageUrl = (imagePath: string | null | undefined): string | undefined => {
    if (!imagePath) return undefined;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Get the base URL from environment or use localhost
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    // If the path already starts with /uploads, just prepend the base URL
    if (imagePath.startsWith('/uploads')) {
        return `${baseUrl}${imagePath}`;
    }

    // If the path starts with uploads/ (no leading slash), add it
    if (imagePath.startsWith('uploads/')) {
        return `${baseUrl}/${imagePath}`;
    }

    // Otherwise, assume it's a relative path from uploads
    return `${baseUrl}/uploads/${imagePath}`;
};

// Helper function to convert null to undefined and format for BlogPost
const formatPostForClient = (post: Post) => {
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? undefined,
        content: post.content,
        coverImage: getFullImageUrl(post.coverImage), // ✅ Convert to full URL
        description: post.description ?? undefined,
        tags: post.tags ?? undefined,
        categoryId: post.categoryId ?? undefined,
        createdAt: post.createdAt ?? undefined,
        publishDate: post.publishDate ?? undefined,
        updatedAt: post.updatedAt ?? undefined,
        status: post.status,
        metaExcerpt: post.excerpt ?? undefined,
        metaDescription: post.metaDescription ?? undefined,
        metaTitle: post.metaTitle ?? undefined,
        metaKeywords: post.metaKeywords ?? undefined,
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

        const response = await api.get<SinglePostApiResponse>(`/blog/slug/${params.slug}`);
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
        // ✅ Use full image URL for metadata
        const imageUrl = getFullImageUrl(post.coverImage) || `${siteUrl}/default-blog-image.jpg`;
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

        const response = await api.get<SinglePostApiResponse>(`/blog/slug/${params.slug}`);
        const post = response.data?.post || response.data?.data;

        if (!post || post.status !== 'published') {
            console.log(`❌ Post not found or not published for slug: ${params.slug}`);
            notFound();
        }

        let category: Category | null = null;
        let relatedPosts: RelatedPost[] = [];

        if (post.categoryId) {
            try {
                const categoriesResponse = await api.get<CategoriesListApiResponse>("/blog/categories/get");
                const categories = categoriesResponse.data?.categories || categoriesResponse.data?.data || [];
                category = categories.find((cat: Category) => cat.id === post.categoryId) || null;

                const postsResponse = await api.get<PostsListApiResponse>("/blog/get/all");
                const allPosts = postsResponse.data?.posts || postsResponse.data?.data || [];

                const publishedPosts = allPosts.filter((p: Post) => p.status === "published");

                relatedPosts = publishedPosts
                    .filter((p: Post) =>
                        p.categoryId === post.categoryId &&
                        p.id !== post.id
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

        const formattedPost = formatPostForClient(post);

        return (
            <>
                <BreadcrumbSchema
                    items={[
                        {
                            name: "Home",
                            item: "https://www.sundara-moorthy.com/"
                        },
                        {
                            name: "Insights",
                            item: "https://www.sundara-moorthy.com/insights"
                        },
                        {
                            name: post.title,
                            item: `https://www.sundara-moorthy.com/insights/${post.slug}`
                        },
                    ]}
                />
                <BlogDetailClient
                    slug={params.slug}
                    initialPost={formattedPost}
                    initialCategory={category}
                    initialRelatedPosts={relatedPosts}
                />
            </>
        );

    } catch (error) {
        console.error(`❌ Error loading page for ${params.slug}:`, error);
        notFound();
    }
}