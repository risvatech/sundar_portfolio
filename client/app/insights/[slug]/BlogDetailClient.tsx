'use client'

import { useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import {
    Calendar,
    Clock,
    ArrowLeft,
    Tag,
    Twitter,
    Linkedin,
    Facebook,
    Check,
    ChevronRight,
    Sparkles,
    ArrowRight,
    Eye,
    Share2,
    Layers,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Layout } from "@/app/components/layout/Layout"

// Define interfaces - Updated to accept null values
interface BlogPost {
    id: string | number;
    title: string;
    slug: string;
    excerpt: string | null | undefined;
    content: string;
    coverImage?: string | null | undefined;
    description?: string | null | undefined;
    tags?: string | null | undefined;
    categoryId?: number | null | undefined;
    createdAt?: string | null | undefined;
    publishDate?: string | null | undefined;
    updatedAt?: string | null | undefined;
    status: string;
    metaExcerpt?: string | null | undefined;
    metaDescription?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaKeywords?: string | null | undefined;
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
    category?: string;
}

interface BlogDetailClientProps {
    slug: string
    initialPost: BlogPost
    initialCategory?: Category | null
    initialRelatedPosts?: RelatedPost[]
}

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
            let cleanString = tags
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

// Function to safely extract text from HTML content
const extractTextFromHTML = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

// Function to safely render HTML content
const renderHTMLContent = (html: string) => {
    if (!html) return null;
    return <div className="html-content" dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function BlogDetailClient({
                                             slug,
                                             initialPost,
                                             initialCategory,
                                             initialRelatedPosts = []
                                         }: BlogDetailClientProps) {
    const [copied, setCopied] = useState(false)
    const [viewCount] = useState(1428)

    const handleShare = async (platform: string) => {
        const url = window.location.href
        const text = `Check out this article: ${initialPost.title}`

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                break
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
                break
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                break
            case 'copy':
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                break
        }
    }

    const formatDate = (post: BlogPost): string => {
        if (post.publishDate) {
            try {
                const date = new Date(post.publishDate)
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            } catch {
                // Fall through
            }
        }

        if (post.createdAt) {
            try {
                const date = new Date(post.createdAt)
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            } catch {
                return "Recent"
            }
        }

        return "Recent"
    }

    const calculateReadTime = (content: string) => {
        const textContent = extractTextFromHTML(content)
        const wordsPerMinute = 200
        const words = textContent.split(/\s+/).length
        const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
        return `${minutes} min read`
    }

    const postTags = parseTags(initialPost.tags)
    const displayExcerpt = initialPost.excerpt || initialPost.description || initialPost.metaExcerpt || "";

    const getDisplayDate = (): string => {
        if (initialPost.publishDate) return initialPost.publishDate;
        if (initialPost.createdAt) return initialPost.createdAt;
        return new Date().toISOString();
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": initialPost.metaTitle || initialPost.title,
                        "description": initialPost.metaDescription || initialPost.description || initialPost.excerpt,
                        "image": initialPost.coverImage || "",
                        "datePublished": getDisplayDate(),
                        "dateModified": initialPost.updatedAt || getDisplayDate(),
                        "author": {
                            "@type": "Person",
                            "name": "Future Indias"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Future Indias"
                        }
                    })
                }}
            />

            <Layout>
                <article className="max-w-6xl mx-auto px-4 sm:px-6 py-12 mt-16">
                    {/* Back button */}
                    <div className="mb-4">
                        <Link href="/insights">
                            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Insights
                            </Button>
                        </Link>
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-4 py-1.5 text-sm">
                            {initialCategory?.name || "Insights"}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {initialPost.metaTitle || initialPost.title}
                    </h1>

                    {/* Meta info bar */}
                    <div className="flex flex-wrap items-center gap-4 py-2 border-y border-gray-200 dark:border-gray-800 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(initialPost)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{calculateReadTime(initialPost.content)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Layers className="w-4 h-4" />
                            <span>{initialCategory?.name || "Uncategorized"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span>{viewCount.toLocaleString()} views</span>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleShare('copy')}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {initialPost.coverImage && (
                        <div className="relative aspect-video w-full mb-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                                src={initialPost.coverImage}
                                alt={initialPost.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                unoptimized={initialPost.coverImage?.includes('localhost')}
                            />
                        </div>
                    )}

                    {/* Excerpt */}
                    {displayExcerpt && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border-l-4 border-primary">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                {displayExcerpt}
                            </p>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-12">
                        <style jsx global>{`
                            .html-content {
                                font-size: 1.125rem;
                                line-height: 1.75;
                                color: var(--foreground);
                            }
                            .html-content h1 {
                                font-size: 2.25rem;
                                font-weight: 700;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                line-height: 1.3;
                            }
                            .html-content h2 {
                                font-size: 1.875rem;
                                font-weight: 600;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                padding-bottom: 0.5rem;
                                border-bottom: 2px solid var(--primary);
                            }
                            .html-content h3 {
                                font-size: 1.5rem;
                                font-weight: 600;
                                margin-top: 1.5rem;
                                margin-bottom: 0.75rem;
                            }
                            .html-content h4 {
                                font-size: 1.25rem;
                                font-weight: 600;
                                margin-top: 1.25rem;
                                margin-bottom: 0.5rem;
                            }
                            .html-content a {
                                color: var(--primary);
                                text-decoration: none;
                                border-bottom: 1px solid transparent;
                                transition: all 0.2s ease;
                            }
                            .html-content a:hover {
                                border-bottom-color: var(--primary);
                            }
                            .html-content ul, .html-content ol {
                                margin-left: 1.5rem;
                                margin-bottom: 1.5rem;
                            }
                            .html-content li {
                                margin-bottom: 0.5rem;
                            }
                            .html-content li::marker {
                                color: var(--primary);
                            }
                            .html-content blockquote {
                                border-left: 4px solid var(--primary);
                                padding-left: 1.5rem;
                                margin: 1.5rem 0;
                                font-style: italic;
                                color: var(--muted-foreground);
                            }
                            .html-content img {
                                border-radius: 0.75rem;
                                margin: 1.5rem 0;
                                max-width: 100%;
                                height: auto;
                            }
                            .html-content code {
                                background: var(--secondary);
                                padding: 0.2rem 0.4rem;
                                border-radius: 0.375rem;
                                font-size: 0.875em;
                            }
                            .html-content pre {
                                background: var(--secondary);
                                border-radius: 0.75rem;
                                padding: 1rem;
                                overflow-x: auto;
                                margin: 1.5rem 0;
                            }
                            .html-content pre code {
                                background: transparent;
                                padding: 0;
                            }
                            .html-content table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 1.5rem 0;
                            }
                            .html-content th, .html-content td {
                                border: 1px solid var(--border);
                                padding: 0.75rem;
                                text-align: left;
                            }
                            .html-content th {
                                background: var(--secondary);
                                font-weight: 600;
                            }
                            @media (max-width: 640px) {
                                .html-content {
                                    font-size: 1rem;
                                }
                                .html-content h1 { font-size: 1.875rem; }
                                .html-content h2 { font-size: 1.5rem; }
                                .html-content h3 { font-size: 1.25rem; }
                            }
                        `}</style>
                        {renderHTMLContent(initialPost.content)}
                    </div>

                    {/* Tags */}
                    {postTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 mb-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                            {postTags.map((tag: string, index: number) => (
                                <Link key={index} href={`/insights?tag=${encodeURIComponent(tag)}`}>
                                    <Badge variant="secondary" className="hover:bg-primary/20 cursor-pointer transition-colors">
                                        #{tag}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Share Section */}
                    <Card className="mb-12 border border-gray-200 dark:border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-lg font-semibold mb-1">Share this article</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Help others discover this insight
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleShare('twitter')}
                                        className="gap-2"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleShare('linkedin')}
                                        className="gap-2"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleShare('facebook')}
                                        className="gap-2"
                                    >
                                        <Facebook className="w-4 h-4" />
                                        Facebook
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Posts */}
                    {initialRelatedPosts.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <h2 className="text-2xl font-bold">Related Insights</h2>
                                </div>
                                <Link href="/insights">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {initialRelatedPosts.map((related) => (
                                    <Link href={`/insights/${related.slug}`} key={related.id}>
                                        <Card className="group hover:shadow-lg transition-all duration-300 h-full border border-gray-200 dark:border-gray-800 hover:border-primary/50">
                                            <CardContent className="p-6">
                                                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-0">
                                                    {related.category || "Insights"}
                                                </Badge>
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {related.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                                    {related.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {calculateReadTime(related.excerpt)}
                                                    </div>
                                                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Read More
                                                        <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </Layout>
        </>
    )
}