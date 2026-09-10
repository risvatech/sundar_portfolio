// app/insights/page.tsx
import { Layout } from "@/app/components/layout/Layout";
import BlogClient from "./BlogClient";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import api from "@/app/service/api";

// ---------- Types ----------
interface RawCategory {
    id: number;
    name: string;
}

interface RawPost {
    id: string | number;
    slug?: string;
    title: string;
    excerpt?: string;
    metaExcerpt?: string;
    description?: string;
    content: string;
    coverImage?: string;
    tags?: string | string[];
    categoryId?: number;
    createdAt?: string;
    created_at?: string;
    publishDate?: string;
    publish_date?: string;
    status?: string;
}

interface Category {
    id: number;
    name: string;
    count?: number;
}

interface Post {
    id: string | number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    tags?: string[];
    categoryId?: number;
    category?: { id: number; name: string };
    created_at?: string;
    publishDate?: string | null;
    status: string;
}

// ---------- Helpers ----------

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

function parseTags(tagsData: string | string[] | undefined | null): string[] {
    if (!tagsData) return [];
    if (Array.isArray(tagsData)) return tagsData;
    const cleanString = tagsData
        .replace(/[{}[\]\\]/g, '')
        .replace(/"/g, '')
        .trim();
    if (cleanString.includes(',')) {
        return cleanString.split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0);
    }
    return cleanString ? [cleanString] : [];
}

// ---------- Server data fetcher ----------
async function fetchPostsAndCategories(): Promise<{ posts: Post[]; categories: Category[] }> {
    try {
        const categoriesRes = await api.get<{ data?: RawCategory[]; categories?: RawCategory[] }>("/blog/categories/get/all");
        const categoriesData = Array.isArray(categoriesRes.data)
            ? categoriesRes.data
            : categoriesRes.data?.categories || categoriesRes.data?.data || [];

        const categoryMap: Record<number, Category> = {};
        categoriesData.forEach((cat: RawCategory) => {
            categoryMap[cat.id] = {
                id: cat.id,
                name: cat.name || "Uncategorized",
            };
        });

        const postsRes = await api.get<{ data?: RawPost[]; posts?: RawPost[] }>("/blog/get");
        const postsData = Array.isArray(postsRes.data)
            ? postsRes.data
            : postsRes.data?.posts || postsRes.data?.data || [];

        const transformedPosts: Post[] = postsData.map((post: RawPost) => {
            const category = post.categoryId ? categoryMap[post.categoryId] : undefined;
            return {
                id: post.id,
                slug: post.slug || post.id?.toString(),
                title: post.title,
                excerpt: post.excerpt || post.metaExcerpt || post.description || "",
                content: post.content,
                // ✅ Use getFullImageUrl for coverImage
                coverImage: getFullImageUrl(post.coverImage),
                tags: parseTags(post.tags),
                categoryId: post.categoryId,
                category: category || { id: post.categoryId || 0, name: "Uncategorized" },
                created_at: post.createdAt || post.created_at,
                publishDate: post.publishDate || post.publish_date || null,
                status: post.status || "published",
            };
        });

        const sortedPosts = transformedPosts.sort((a, b) => {
            const dateA = a.publishDate ? new Date(a.publishDate).getTime()
                : a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.publishDate ? new Date(b.publishDate).getTime()
                : b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });

        const categoryCountMap = new Map<string, number>();
        sortedPosts.forEach((post: Post) => {
            const catName = post.category?.name || "Uncategorized";
            categoryCountMap.set(catName, (categoryCountMap.get(catName) || 0) + 1);
        });

        const categoryItems: Category[] = [
            { id: 0, name: "All", count: sortedPosts.length }
        ];
        Object.values(categoryMap).forEach((cat) => {
            const count = categoryCountMap.get(cat.name) || 0;
            categoryItems.push({ ...cat, count });
        });
        categoryCountMap.forEach((count, name) => {
            if (!categoryItems.some(cat => cat.name === name && cat.id !== 0)) {
                categoryItems.push({
                    id: categoryItems.length,
                    name,
                    count,
                });
            }
        });
        categoryItems.sort((a, b) => {
            if (a.id === 0) return -1;
            if (b.id === 0) return 1;
            return a.name.localeCompare(b.name);
        });

        return { posts: sortedPosts, categories: categoryItems };
    } catch (error) {
        console.error("Failed to fetch insights data:", error);
        return { posts: [], categories: [{ id: 0, name: "All", count: 0 }] };
    }
}

// ---------- Metadata ----------
export async function generateMetadata() {
    return {
        title: "Insights & Ideas – Sundara Moorthy Blog",
        description: "Practical wisdom, strategic insights, and lessons learned from helping businesses reach their full potential.",
        openGraph: {
            title: "Insights & Ideas – Sundara Moorthy Blog",
            description: "Practical wisdom, strategic insights, and lessons learned from helping businesses reach their full potential.",
            url: "https://www.sundara-moorthy.com/insights",
            siteName: "Future Indias",
            images: [
                {
                    url: "https://www.sundara-moorthy.com/default-blog-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Insights & Ideas – Sundara Moorthy Blog",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Insights & Ideas – Sundara Moorthy Blog",
            description: "Practical wisdom, strategic insights, and lessons learned from helping businesses reach their full potential.",
            images: ["https://www.sundara-moorthy.com/default-blog-image.jpg"],
        },
    };
}

// ---------- Page Component ----------
export default async function InsightsPage() {
    const { posts, categories } = await fetchPostsAndCategories();
    return (
        <Layout>
            <BreadcrumbSchema
                items={[
                    { name: "Home", item: "https://www.sundara-moorthy.com/" },
                    { name: "Insights", item: "https://www.sundara-moorthy.com/insights" },
                ]}
            />
            <BlogClient initialPosts={posts} initialCategories={categories} />
        </Layout>
    );
}