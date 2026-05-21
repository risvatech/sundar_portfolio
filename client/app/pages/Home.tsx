"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    ArrowUpRight,
    CheckCircle,
    Briefcase,
    Globe,
    Target,
    ChevronLeft,
    ChevronRight,
    Clock,
    ArrowRight,
    Linkedin, Facebook, Twitter, MessageCircle
} from "lucide-react";
import api from "../service/api";
import {Button} from "@/app/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import img2 from "../../public/sundara-moorthy.jpg";
import ExperienceSection from "@/app/components/sections/ExperienceSection";
import ValuePropositionSection from "@/app/components/sections/Valuepropositionsection";
import PhotoSection from "@/app/components/PhotoSection";

interface Category {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GalleryItem {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    imageUrls: string[];
    categoryId?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    category?: Category;
}

// Article interfaces
interface ArticleCategory {
    id: number;
    name: string;
}

interface Article {
    id: string | number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category?: ArticleCategory;
    created_at?: string;
    publishDate?: string | null;  // ✅ Added publishDate
    status: string;
}

export default function HomePage() {
    const [latestGalleries, setLatestGalleries] = useState<GalleryItem[]>([]);
    const [latestArticles, setLatestArticles] = useState<Article[]>([]);
    const [articleLoading, setArticleLoading] = useState(true);
    const [galleryLoading, setGalleryLoading] = useState(true);
    const [currentArticleSlide, setCurrentArticleSlide] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    // FIX: Change from useState to useRef
    const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);

    const resetAutoSlide = () => {
        if (autoSlideTimer.current) {
            clearInterval(autoSlideTimer.current);
        }
        autoSlideTimer.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 2); // 2 slides
        }, 3000);
    };

    // Initialize auto-slide on component mount
    useEffect(() => {
        resetAutoSlide();

        // Cleanup on unmount
        return () => {
            if (autoSlideTimer.current) {
                clearInterval(autoSlideTimer.current);
            }
        };
    }, []);

    // Fetch latest 3 gallery items
    const fetchLatestGalleries = async () => {
        setGalleryLoading(true);
        try {
            const response = await api.get("/gallery", {
                params: {
                    limit: 3,
                    sort: 'createdAt',
                    order: 'desc'
                }
            });

            if (response.data.success) {
                setLatestGalleries(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching latest galleries:", error);
        } finally {
            setGalleryLoading(false);
        }
    };

    // Fetch latest 4 articles
    const fetchLatestArticles = async () => {
        setArticleLoading(true);
        try {
            // Fetch categories first
            const categoriesRes = await api.get("/categories");
            const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.categories || categoriesRes.data.data || [];

            const categoryMap: Record<number, ArticleCategory> = {};
            categoriesData.forEach((cat: any) => {
                categoryMap[cat.id] = {
                    id: cat.id,
                    name: cat.name || "Uncategorized"
                };
            });

            // Fetch articles
            const response = await api.get("/posts");
            const articlesData = Array.isArray(response.data) ? response.data : response.data.posts || [];

            // Transform and filter only published articles
            const publishedArticles = articlesData
                .filter((article: any) => article.status === "published")
                .map((article: any) => ({
                    id: article.id,
                    slug: article.slug || article.id?.toString(),
                    title: article.title,
                    excerpt: article.excerpt || article.metaExcerpt || article.description || "",
                    content: article.content,
                    coverImage: article.coverImage,
                    category: article.categoryId ? categoryMap[article.categoryId] : undefined,
                    created_at: article.createdAt || article.created_at,
                    publishDate: article.publishDate || article.publish_date || null,  // ✅ Get publish date
                    status: article.status || "published",
                }))
                .sort((a: Article, b: Article) => {
                    // ✅ Sort by publish date if available, fallback to created date
                    const dateA = a.publishDate ? new Date(a.publishDate).getTime() :
                        a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.publishDate ? new Date(b.publishDate).getTime() :
                        b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA; // Newest first
                })
                .slice(0, 4); // Get latest 4 articles

            setLatestArticles(publishedArticles);
        } catch (error) {
            console.error("Error fetching latest articles:", error);
        } finally {
            setArticleLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestGalleries();
        fetchLatestArticles();
    }, []);

    // ✅ Updated formatDate function to prioritize publish date
    const formatDate = (article: Article): string => {
        // First try to use publish date
        if (article.publishDate) {
            try {
                const date = new Date(article.publishDate);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch {
                // Fall through to created date
            }
        }

        // Fallback to created date
        if (article.created_at) {
            try {
                const date = new Date(article.created_at);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch {
                return "Recent";
            }
        }

        return "Recent";
    };

    const calculateReadTime = (content: string) => {
        if (!content) return "1 min read";
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
        return `${minutes} min read`;
    };

    const nextArticleSlide = () => {
        setCurrentArticleSlide((prev) => (prev + 1) % latestArticles.length);
    };

    const prevArticleSlide = () => {
        setCurrentArticleSlide((prev) => (prev - 1 + latestArticles.length) % latestArticles.length);
    };

    const getArticleImage = (article: Article) => {
        if (article.coverImage) {
            return article.coverImage;
        }
        return "/insights/default.jpg";
    };

    return (
        <div className="container-wide  pt-6 md:pt-20 ">
            {/* Hero Section */}
            <section className="md:py-5 lg:py-8  pt-20 pb-16 ">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left Content */}
                        <div className="space-y-8">
                            {/* Experience Badge */}
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">18+ Years of Business Excellence</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-2xl  text-primary">
                                Strategy & Growth Advisor | Design Thinking Practitioner
                            </h1>

                            {/* Description */}
                            <div className="space-y-6">
                                <p className="text-lg text-gray-700">
                                    I help founders, CXOs, and MSMEs turn complex business problems into clear growth strategies—using market intelligence, structured thinking, and design-led problem solving.
                                </p>
                            </div>

                            <Button size="sm" variant="secondary">
                                <Link href="/about">View More</Link>
                            </Button>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-6 pt-6">
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">18+</div>
                                    <div className="text-sm text-gray-600 mt-1">Years Experience</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">250+</div>
                                    <div className="text-sm text-gray-600 mt-1">Assignments</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">25+</div>
                                    <div className="text-sm text-gray-600 mt-1">Countries Served</div>
                                </div>
                            </div>


                            {/* Services */}
                            <div className="pt-8">
                                <h3 className="text-xl font-semibold text-primary mb-4">Core Services</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Target className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Strategic Growth Planning</h4>
                                            <p className="text-sm text-gray-600 mt-1">Identify and capitalize on growth opportunities</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Market Strategy Development</h4>
                                            <p className="text-sm text-gray-600 mt-1">Improve competitiveness and market positioning</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Global Investment Decisions</h4>
                                            <p className="text-sm text-gray-600 mt-1">Strategic investment planning across geographies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative pt-16">
                            <div className="relative flex flex-col items-center justify-start">

                                {/* Image */}
                                <div className="relative w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[28rem] rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src={img2}
                                        alt="Sundar - Business Consultant"
                                        width={480}
                                        height={650}
                                        className="w-full h-auto object-cover object-top"
                                        priority
                                    />
                                </div>

                                {/* Name + Title */}
                                <div className="pt-6 w-full justify-items-center">
                                    <h3 className="text-2xl font-bold text-primary">
                                        S. Sundara Moorthy
                                    </h3>

                                    <p className="text-md text-gray-600 mt-2">
                                        Strategy & Growth Advisor | Design Thinking Practitioner
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex gap-4 mt-4 ">
                                        <a href="https://whatsapp.com/channel/0029VbBzqZV3AzNRM1WRIR27" target="_blank" rel="noopener noreferrer">
                                            <MessageCircle size={20} className="text-primary hover:text-amber-400" />
                                        </a>
                                        <a href="https://www.linkedin.com/in/sundaramoorthy15/" target="_blank" rel="noopener noreferrer">
                                            <Linkedin size={20} className="text-primary hover:text-amber-400" />
                                        </a>
                                        <a href="https://www.facebook.com/profile.php?id=100064303444109" target="_blank" rel="noopener noreferrer">
                                            <Facebook size={20} className="text-primary hover:text-amber-400" />
                                        </a>
                                        <a href="https://x.com/sundara_sethu" target="_blank" rel="noopener noreferrer">
                                            <Twitter size={20} className="text-primary hover:text-amber-400" />
                                        </a>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-6 mt-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="text-sm">18+ Years Experience</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm">250+ Assignments</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements - Adjusted positioning */}
                            <div className="absolute top-10 left-4 w-28 h-28 bg-primary/10 rounded-full -z-10"></div>
                            <div className="absolute bottom-20 right-4 w-36 h-36 bg-primary/5 rounded-full -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <ValuePropositionSection/>
            </div>
            <div>
            </div>
            <ExperienceSection/>

            {/* Latest Articles Section */}
            {latestArticles.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                                Latest Insights
                            </h2>
                            <p className="text-gray-700 max-w-2xl mx-auto">
                                Strategic thinking and practical wisdom from business transformation experiences
                            </p>
                        </div>

                        {articleLoading ? (
                            <div className="py-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-20 w-12 border-4 border-primary border-t-transparent"></div>
                                <p className="mt-4 text-gray-600">Loading articles...</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Articles Slider */}
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                                    <div
                                        className="flex transition-transform duration-500 ease-out"
                                        style={{ transform: `translateX(-${currentArticleSlide * 100}%)` }}
                                    >
                                        {latestArticles.map((article, index) => (
                                            <div key={article.id} className="w-full flex-shrink-0">
                                                <div className="grid md:grid-cols-2 gap-0 items-stretch">
                                                    {/* Article Image */}
                                                    <div className="relative h-64 md:h-96">
                                                        <Image
                                                            src={getArticleImage(article)}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                            priority={index === 0}
                                                        />
                                                        <div className="absolute top-4 left-4">
                                                            <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                                                                Latest #{index + 1}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Article Content */}
                                                    <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            {article.category && (
                                                                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                                                    {article.category.name}
                                                                </span>
                                                            )}
                                                            {/* ✅ Updated date display - shows publish date or created date */}
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={14} className="text-gray-500" />
                                                                <span className="text-sm text-gray-600">
                                                                    {formatDate(article)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                                            {article.title}
                                                        </h3>

                                                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                                            {article.excerpt}
                                                        </p>

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                                <Clock size={14} />
                                                                {calculateReadTime(article.content)}
                                                            </span>
                                                            <Link href={`/insights/${article.slug}`}>
                                                                <Button variant="secondary" className="hover:bg-primary hover:text-white transition-colors">
                                                                    Read Insight
                                                                    <ArrowRight className="ml-2" size={16} />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Navigation Buttons */}
                                    <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2">
                                        <button
                                            onClick={prevArticleSlide}
                                            className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                            aria-label="Previous article"
                                        >
                                            <ChevronLeft size={20} className="text-gray-700" />
                                        </button>
                                        <button
                                            onClick={nextArticleSlide}
                                            className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                            aria-label="Next article"
                                        >
                                            <ChevronRight size={20} className="text-gray-700" />
                                        </button>
                                    </div>

                                    {/* Slide Dots */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {latestArticles.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentArticleSlide(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    currentArticleSlide === index
                                                        ? "bg-primary w-6"
                                                        : "bg-gray-300 hover:bg-gray-400"
                                                }`}
                                                aria-label={`Go to article ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* View All Articles Button */}
                                <div className="text-center mt-12">
                                    <Link href="/insights">
                                        <Button size="lg" variant="secondary">
                                            View All Insights
                                            <ArrowUpRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}
            <PhotoSection/>
        </div>
    );
}