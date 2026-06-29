// app/insights/page.tsx
import { Layout } from "@/app/components/layout/Layout";
import BlogClient from "./BlogClient";   // 👈 import the client component
import serverApi from "@/app/service/server-api";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

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
        const categoriesRes = await serverApi.get<{ data?: RawCategory[]; categories?: RawCategory[] }>("/categories");
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

        const postsRes = await serverApi.get<{ data?: RawPost[]; posts?: RawPost[] }>("/posts");
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
                coverImage: post.coverImage,
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
        },
        twitter: {
            card: "summary_large_image",
            title: "Insights & Ideas – Sundara Moorthy Blog",
            description: "Practical wisdom, strategic insights, and lessons learned from helping businesses reach their full potential.",
        },
    };
}

// ---------- Page Component (no props!) ----------
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
