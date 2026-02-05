'use client'

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Clock, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import api from "../service/api"
import { Layout } from "../components/layout/Layout"
import SEOHead from "@/app/components/SEOHead"

// Define interfaces for our data
interface Post {
    id: string | number
    slug: string
    title: string
    excerpt: string
    content: string
    coverImage?: string
    tags?: string[]
    categoryId?: number
    category?: {
        id: number
        name: string
    }
    created_at?: string
    status: string
}

interface Category {
    id: number
    name: string
    count?: number
}

// Helper function to safely parse tags
const parseTags = (tagsData: any): string[] => {
    if (!tagsData) return []

    if (Array.isArray(tagsData)) {
        return tagsData
    }

    if (typeof tagsData === 'string') {
        let cleanString = tagsData
            .replace(/[{}[\]\\]/g, '')
            .replace(/"/g, '')
            .trim()

        if (cleanString.includes(',')) {
            return cleanString.split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0)
        }

        return cleanString ? [cleanString] : []
    }

    return []
}

const Blog = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [activeCategory, setActiveCategory] = useState("All")
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([
        { id: 0, name: "All" }
    ])
    const [categoryMap, setCategoryMap] = useState<Record<number, Category>>({})

    // Fetch categories from API
    const fetchCategories = useCallback(async () => {
        try {
            console.log("📡 Fetching categories...")
            const { data } = await api.get("/categories")
            console.log("📦 Categories API response:", data)

            // Handle different response structures
            const categoriesData = Array.isArray(data) ? data : data.categories || data.data || []

            // Create a map for easy lookup
            const map: Record<number, Category> = {}
            categoriesData.forEach((cat: any) => {
                map[cat.id] = {
                    id: cat.id,
                    name: cat.name || "Uncategorized"
                }
            })

            console.log("🗺️ Category map:", map)
            setCategoryMap(map)

            return map
        } catch (err) {
            console.error("❌ Error fetching categories:", err)
            return {}
        }
    }, [])

    // Fetch posts from API
    const fetchPosts = useCallback(async () => {
        try {
            console.log("📡 Fetching blog posts...")
            setLoading(true)
            setError(null)

            // First fetch categories
            const categoryMap = await fetchCategories()

            // Then fetch posts
            const { data } = await api.get("/posts")
            console.log("📦 Posts API response:", data)

            const postsData = Array.isArray(data) ? data : data.posts || []
            console.log(`📊 Processing ${postsData.length} posts`)

            // Transform API data - Use category map to get category names
            const transformedPosts = postsData.map((post: any) => {
                // Get category from map using categoryId
                const category = post.categoryId ? categoryMap[post.categoryId] : undefined

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
                    status: post.status || "published",
                }
            })

            console.log("✅ Transformed posts:", transformedPosts)

            // Sort posts by creation date (newest first)
            const sortedPosts = transformedPosts.sort((a: Post, b: Post) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
                return dateB - dateA // Newest first
            })

            setPosts(sortedPosts)

            // Extract categories from posts with counts
            const categoryCountMap = new Map<string, number>()

            sortedPosts.forEach((post: Post) => {
                const categoryName = post.category?.name || "Uncategorized"
                const currentCount = categoryCountMap.get(categoryName) || 0
                categoryCountMap.set(categoryName, currentCount + 1)
            })

            // Create categories list including "All"
            const categoryItems: Category[] = [{ id: 0, name: "All", count: sortedPosts.length }]

            // Add categories from the category map (to include all categories, even if empty)
            Object.values(categoryMap).forEach((cat, index) => {
                const count = categoryCountMap.get(cat.name) || 0
                categoryItems.push({
                    id: cat.id,
                    name: cat.name,
                    count
                })
            })

            // Also add any categories from posts that might not be in the category map
            categoryCountMap.forEach((count, name) => {
                if (!categoryItems.some(cat => cat.name === name && cat.id !== 0)) {
                    categoryItems.push({
                        id: categoryItems.length,
                        name,
                        count
                    })
                }
            })

            // Sort categories by name for consistency
            categoryItems.sort((a, b) => {
                if (a.id === 0) return -1 // "All" first
                if (b.id === 0) return 1
                return a.name.localeCompare(b.name)
            })

            setCategories(categoryItems)

            console.log("📋 Categories list:", categoryItems)

        } catch (err: any) {
            console.error("❌ Error fetching posts:", err)
            setError("Failed to load blog posts. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [fetchCategories])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    // Filter posts based on category
    const filteredPosts = activeCategory === "All"
        ? posts
        : posts.filter(post => post.category?.name === activeCategory)

    // Get LATEST 3 published posts for Featured Articles
    const featuredPosts = posts
        .filter(post => post.status === "published")
        .slice(0, 3) // Get first 3 (already sorted newest first)

    const getPostImage = (post: Post) => {
        if (post.coverImage) {
            return post.coverImage
        }
        return "/articles/default.jpg"
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recent"
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    const calculateReadTime = (content: string) => {
        if (!content) return "1 min read"
        const wordsPerMinute = 200
        const words = content.split(/\s+/).length
        const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
        return `${minutes} min read`
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length)
    }

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                        <p className="mt-4 text-lg">Loading blog posts...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-4">{error}</div>
                        <Button onClick={() => fetchPosts()}>Try Again</Button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <>
            <SEOHead page="blog" />
            <Layout>
                {/* Hero */}
                <section className="pt-32 pb-8 bg-primary/5 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto max-w-6xl text-center px-4">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            Insights & Ideas
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                            The <span className="text-primary">Growth</span> Blog
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Practical wisdom, strategic insights, and lessons learned from helping businesses reach their full potential.
                        </p>
                    </div>
                </section>

                {/* Featured Carousel - Only show if there are featured posts */}
                {featuredPosts.length > 0 && (
                    <section className="py-12 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-semibold text-foreground">
                                    Latest Articles
                                </h2>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={prevSlide}>
                                        <ChevronLeft size={20} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={nextSlide}>
                                        <ChevronRight size={20} />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {featuredPosts.map((post, index) => (
                                        <div key={post.id} className="w-full flex-shrink-0">
                                            <div className="grid md:grid-cols-2 gap-0">
                                                <div className="relative h-64 md:h-96">
                                                    <Image
                                                        src={getPostImage(post)}
                                                        alt={post.title}
                                                        fill
                                                        className="w-full h-full object-cover"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        priority
                                                    />
                                                    <div className="absolute top-4 left-4">
                                                        <Badge className="bg-primary text-white">
                                                            Latest #{index + 1}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="bg-white dark:bg-gray-900 p-8 md:p-12 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Badge variant="secondary" className="rounded-lg bg-primary/10 text-primary">
                                                            {post.category?.name || "Uncategorized"}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(post.created_at)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {calculateReadTime(post.content)}
                                                        </span>
                                                        <Link href={`/articles/${post.slug}`}>
                                                            <Button variant="secondary" className="hover:bg-primary hover:text-white transition-colors">
                                                                Read Article
                                                                <ArrowRight className="ml-2" size={16} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Dots */}
                                <div className="absolute bottom-4 left-4 md:left-auto md:right-4 flex gap-2">
                                    {featuredPosts.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                currentSlide === index ? "bg-primary w-6" : "bg-muted-foreground/30"
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Category Filter */}
                <section className="py-8 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.name)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        activeCategory === category.name
                                            ? "bg-secondary text-white shadow-md"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {category.name}
                                    {category.count !== undefined && (
                                        <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                                            activeCategory === category.name
                                                ? "bg-white/20"
                                                : "bg-gray-200 dark:bg-gray-700"
                                        }`}>
                                            {category.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className="py-12 px-4">
                    <div className="container mx-auto max-w-6xl">
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
                                <p className="text-muted-foreground mb-6">Try selecting a different category</p>
                                <Button variant="secondary" onClick={() => setActiveCategory("All")}>
                                    View All Posts
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredPosts.map((post) => (
                                        <Link key={post.id} href={`/articles/${post.slug}`}>
                                            <Card className="group hover:-translate-y-1 h-full transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-lg">
                                                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                                    <Image
                                                        src={getPostImage(post)}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Badge variant="secondary" className="rounded-lg bg-primary/10 text-primary">
                                                            {post.category?.name || "Uncategorized"}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(post.created_at)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {calculateReadTime(post.content)}
                                                        </span>
                                                        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                            Read More
                                                            <ArrowRight size={14} />
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                {/* Load More */}
                                {filteredPosts.length > 9 && (
                                    <div className="text-center mt-12">
                                        <Button variant="outline" size="lg" className="hover:bg-primary hover:text-white">
                                            Load More Articles
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </Layout>
        </>
    )
}

export default Blog