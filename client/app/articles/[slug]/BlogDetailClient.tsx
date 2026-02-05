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
import {Layout} from "@/app/components/layout/Layout";

// Define interfaces
interface BlogPost {
    id: string | number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    description?: string;
    tags?: string;
    categoryId?: number;
    createdAt?: string;
    updatedAt?: string;
    status: string;
    metaExcerpt?: string;
    metaDescription?: string;
    metaTitle?: string;
    metaKeywords?: string;
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

// Function to safely render HTML content with proper styling
const renderHTMLContent = (html: string) => {
    if (!html) return null;

    const StyledHTMLContent = () => (
        <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );

    return <StyledHTMLContent />;
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recent"
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "Yesterday"
        if (diffDays <= 7) return `${diffDays} days ago`

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const calculateReadTime = (content: string) => {
        const textContent = extractTextFromHTML(content)
        const wordsPerMinute = 200
        const words = textContent.split(/\s+/).length
        const minutes = Math.ceil(words / wordsPerMinute)
        return `${minutes} min read`
    }

    const getPostTags = () => {
        return initialPost ? parseTags(initialPost.tags) : []
    }

    const postTags = getPostTags();
    const displayExcerpt = initialPost.excerpt || initialPost.description || initialPost.metaExcerpt || "";

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
                        "datePublished": initialPost.createdAt,
                        "dateModified": initialPost.updatedAt,
                        "author": {
                            "@type": "Person",
                            "name": "Admin"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Future Indias",
                            "logo": {
                                "@type": "ImageObject",
                                "url": typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : ''
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": typeof window !== 'undefined' ? window.location.href : ''
                        }
                    })
                }}
            />

            <Layout>
                <div className="min-h-screen mt-20">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="md:hidden flex items-center justify-between">
                                <Link href="/articles">
                                    <Button variant="ghost" className="gap-2 hover:bg-purple-500/10">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Articles
                                    </Button>
                                </Link>
                            </div>
                            {/*<div className="w-24 h-1.5 bg-[hsl(21_90%_48%)] mb-6" />*/}
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-primary mb-3 animate-fade-in">
                                {initialPost.metaTitle || initialPost.title}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 md:pl-4">
                                    <div className="hidden md:block mb-4">
                                        <Link href="/articles">
                                            <Button variant="ghost" className="gap-2 hover:bg-purple-500/10 hover:text-black">
                                                <ArrowLeft className="w-4 h-4" />
                                                Back to Articles
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="max-w-4xl mx-auto">
                                        <div className="mb-5">
                                            <div className="flex flex-wrap items-center gap-4 p-4 bg-secondary-light backdrop-blur-sm rounded-xl border mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">{initialCategory?.name || "Uncategorized"}</span>
                                                </div>
                                                <Separator orientation="vertical" className="h-4" />
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">{calculateReadTime(initialPost.content)}</span>
                                                </div>
                                                <Separator orientation="vertical" className="h-4" />
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">{formatDate(initialPost.createdAt)}</span>
                                                </div>
                                                <Separator orientation="vertical" className="h-4" />
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">{viewCount.toLocaleString()} views</span>
                                                </div>
                                                <Separator orientation="vertical" className="h-4" />
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1.5 h-8 px-3"
                                                        onClick={() => handleShare('copy')}
                                                    >
                                                        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                                                        <span className="text-sm">{copied ? 'Copied!' : 'Share'}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
                                            <style jsx global>{`
                                            .html-content {
                                                font-size: 1rem;
                                                line-height: 1;
                                                color: var(--foreground);
                                            }
                                            .html-content p {
                                                margin-bottom: 0.4rem;
                                            }
                                            .html-content h1,
                                            .html-content h2,
                                            .html-content h3,
                                            .html-content h4,
                                            .html-content h5,
                                            .html-content h6 {
                                                font-weight: bold;
                                                line-height: 1.2;
                                                margin-top: 1.2rem;
                                                margin-bottom: 1rem;
                                                color: var(--foreground);
                                                scroll-margin-top: 2rem;
                                            }
                                            .html-content h1 {
                                                font-size: 2.5rem;
                                                margin-top: 3rem;
                                                margin-bottom: 1.5rem;
                                            }
                                            .html-content h2 {
                                                font-size: 1.5rem;
                                                margin-top: 1rem;
                                                margin-bottom: 0.5rem;
                                                padding-bottom: 0.5rem;
                                                border-bottom: 2px solid var(--primary);
                                                position: relative;
                                            }
                                            .html-content h2::after {
                                                content: '';
                                                position: absolute;
                                                bottom: -2px;
                                                left: 0;
                                                width: 60px;
                                                height: 2px;
                                                background: linear-gradient(90deg, var(--primary), var(--secondary));
                                            }
                                            .html-content h3 {
                                                font-size: 1.5rem;
                                            }
                                            .html-content h4 {
                                                font-size: 1.2rem;
                                            }
                                            .html-content h5 {
                                                font-size: 1rem;
                                            }
                                            .html-content h6 {
                                                font-size: 1rem;
                                            }
                                            .html-content a {
                                                color: var(--primary);
                                                text-decoration: none;
                                                border-bottom: 1px solid transparent;
                                                transition: all 0.2s ease;
                                            }
                                            .html-content a:hover {
                                                border-bottom-color: var(--primary);
                                                opacity: 0.9;
                                            }
                                            .html-content ol,
                                            .html-content ul {
                                                margin-left: 1.5rem;
                                                margin-bottom: 0.5rem;
                                                padding-left: 0.5rem;
                                            }
                                            .html-content li {
                                                margin-bottom: 0.5rem;
                                                position: relative;
                                                padding-left: 0.5rem;
                                                color: var(--foreground);
                                            }
                                            .html-content ol {
                                                list-style-type: decimal;
                                            }
                                            .html-content ol li::marker {
                                                font-weight: 600;
                                                color: var(--primary);
                                            }
                                            .html-content ul {
                                                list-style-type: disc;
                                            }
                                            .html-content ul li::marker {
                                                color: var(--primary);
                                            }
                                            .html-content ul ul,
                                            .html-content ol ol {
                                                margin-top: 0.5rem;
                                                margin-bottom: 0.5rem;
                                            }
                                            .html-content ul ul {
                                                list-style-type: circle;
                                            }
                                            .html-content ul ul ul {
                                                list-style-type: square;
                                            }
                                            .html-content ol ol {
                                                list-style-type: lower-alpha;
                                            }
                                            .html-content ol ol ol {
                                                list-style-type: lower-roman;
                                            }
                                            .html-content li strong {
                                                color: var(--primary);
                                                font-weight: 600;
                                            }
                                            .html-content li + li {
                                                margin-top: 0.25rem;
                                            }
                                            .html-content pre {
                                                background: var(--secondary);
                                                border-radius: 0.75rem;
                                                padding: 1.5rem;
                                                margin: 1.5rem 0;
                                                overflow-x: auto;
                                                border: 1px solid var(--border);
                                            }
                                            .html-content code {
                                                background: var(--secondary);
                                                padding: 0.2rem 0.4rem;
                                                border-radius: 0.375rem;
                                                font-family: 'Monaco', 'Consolas', monospace;
                                                font-size: 0.9em;
                                                border: 1px solid var(--border);
                                            }
                                            .html-content pre code {
                                                background: transparent;
                                                padding: 0;
                                                border: none;
                                            }
                                            .html-content blockquote {
                                                border-left: 4px solid var(--primary);
                                                padding-left: 1.5rem;
                                                margin: 2rem 0;
                                                font-style: italic;
                                                background: linear-gradient(90deg, rgba(var(--primary-rgb, 147, 51, 234), 0.1), transparent);
                                                border-radius: 0 0.75rem 0.75rem 0;
                                            }
                                            .html-content blockquote p {
                                                margin: 0;
                                                color: var(--foreground);
                                                opacity: 0.9;
                                            }
                                            .html-content img {
                                                max-width: 100%;
                                                height: auto;
                                                border-radius: 0.75rem;
                                                margin: 2rem 0;
                                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                                                border: 1px solid var(--border);
                                            }
                                            .html-content table {
                                                width: 100%;
                                                border-collapse: collapse;
                                                margin: 1.5rem 0;
                                                background: var(--secondary);
                                                border-radius: 0.75rem;
                                                overflow: hidden;
                                                border: 1px solid var(--border);
                                            }
                                            .html-content th,
                                            .html-content td {
                                                padding: 0.5rem;
                                                text-align: left;
                                                border-bottom: 1px solid var(--border);
                                            }
                                            .html-content th {
                                                background: var(--primary);
                                                color: white;
                                                font-weight: 600;
                                            }
                                            .html-content tr:last-child td {
                                                border-bottom: none;
                                            }
                                            .html-content tr:hover {
                                                background: rgba(var(--primary-rgb, 147, 51, 234), 0.05);
                                            }
                                            .html-content hr {
                                                border: none;
                                                height: 2px;
                                                background: linear-gradient(90deg, transparent, var(--primary), transparent);
                                                margin: 3rem 0;
                                            }
                                            .html-content strong {
                                                color: var(--primary);
                                                font-weight: 700;
                                            }
                                            .html-content em {
                                                color: var(--foreground);
                                                opacity: 0.9;
                                            }
                                            @media (max-width: 768px) {
                                                .html-content {
                                                    font-size: 1rem;
                                                    line-height: 1.7;
                                                }
                                                .html-content h1 {
                                                    font-size: 1.75rem;
                                                }
                                                .html-content h2 {
                                                    font-size: 1.5rem;
                                                }
                                                .html-content h3 {
                                                    font-size: 1.25rem;
                                                }
                                                .html-content h4 {
                                                    font-size: 1rem;
                                                }
                                                .html-content ol,
                                                .html-content ul {
                                                    margin-left: 1rem;
                                                }
                                                .html-content pre {
                                                    padding: 1rem;
                                                }
                                                .html-content table {
                                                    font-size: 0.9rem;
                                                }
                                            }
                                            .html-content :target {
                                                scroll-margin-top: 5rem;
                                            }
                                            @media (min-width: 1200px) {
                                                .html-content {
                                                    font-size: 1.15rem;
                                                    line-height: 1.9;
                                                }
                                            }
                                        `}</style>

                                            {initialPost.coverImage && (
                                                <div className="relative aspect-video w-full mb-12 rounded-2xl overflow-hidden border">
                                                    <Image
                                                        src={initialPost.coverImage}
                                                        alt={initialPost.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        unoptimized={initialPost.coverImage?.startsWith('http://localhost:5002')}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                </div>
                                            )}

                                            {displayExcerpt && (
                                                <div className="p-4 bg-secondary-light rounded-2xl border border-primary mb-12">
                                                    <p className="text-xl font-medium text-foreground leading-relaxed">
                                                        {displayExcerpt}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="html-content">
                                                {renderHTMLContent(initialPost.content)}
                                            </div>

                                            {postTags.length > 0 && (
                                                <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-secondary">
                                                    <div className="flex items-center gap-2 w-full mb-4">
                                                        <Tag className="w-5 h-5 text-muted-foreground" />
                                                        <span className="font-medium">Tags:</span>
                                                    </div>
                                                    {postTags.map((tag: string, index: number) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="gap-2 px-4 py-2 hover:bg-purple-500/20 cursor-pointer transition-colors"
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </article>

                                        <Card className="mb-16 border border-secondary">
                                            <CardContent className="p-8">
                                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-2">Share this article</h3>
                                                        <p className="text-muted-foreground">
                                                            Help others discover this insightful content
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleShare('twitter')}
                                                            className="gap-2 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500"
                                                        >
                                                            <Twitter className="w-5 h-5" />
                                                            Twitter
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleShare('linkedin')}
                                                            className="gap-2 rounded-xl hover:bg-blue-700/10 hover:text-blue-700 hover:border-blue-700"
                                                        >
                                                            <Linkedin className="w-5 h-5" />
                                                            LinkedIn
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleShare('facebook')}
                                                            className="gap-2 rounded-xl hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600"
                                                        >
                                                            <Facebook className="w-5 h-5" />
                                                            Facebook
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {initialRelatedPosts.length > 0 && (
                                            <div className="mb-16">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary">
                                                            <Sparkles className="w-6 h-6 text-white" />
                                                        </div>
                                                        <h2 className="text-3xl font-bold">Related Articles</h2>
                                                    </div>
                                                    <Link href="/articles">
                                                        <Button variant="ghost" className="gap-2 hover:bg-purple-500/10">
                                                            View All
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {initialRelatedPosts.map((related) => (
                                                        <Link href={`/articles/${related.slug}`} key={related.id}>
                                                            <Card className="group hover:shadow-2xl transition-all duration-300 h-full border hover:border-purple-500/50">
                                                                <CardContent className="p-6">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                                                                    >
                                                                        {related.category}
                                                                    </Badge>
                                                                    <h4 className="font-bold mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                                                                        {related.title}
                                                                    </h4>
                                                                    <p className="text-muted-foreground mb-4 line-clamp-3">
                                                                        {related.excerpt}
                                                                    </p>
                                                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-3 h-3" />
                                                                            {calculateReadTime(related.excerpt)}
                                                                        </div>
                                                                        <Button
                                                                            size="sm"
                                                                            className="gap-2 hover:text-primary"
                                                                        >
                                                                            Read
                                                                            <ArrowRight className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-center mt-12">
                                            <Link href="/articles">
                                                <Button
                                                    variant="outline"
                                                    className="gap-3 px-8 py-6 rounded-xl bg-primary text-white transition-all duration-300"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                    Back to All Articles
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}