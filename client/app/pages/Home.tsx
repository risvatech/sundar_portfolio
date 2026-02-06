"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Calendar, Tag, CheckCircle, Briefcase, Globe, Target, Users, ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import api from "../service/api";
import {Button} from "@/app/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import img from "../../public/IMG-20260205-WA0012.jpg";
import img2 from "../../public/IMG-20260205-WA0011.jpg";
import ExperienceSection from "@/app/components/sections/ExperienceSection";
import ValuePropositionSection from "@/app/components/sections/Valuepropositionsection";
import PhotoGallery from "@/app/components/PhotoGallery";
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
                    status: article.status || "published",
                }))
                .sort((a: Article, b: Article) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recent";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
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
        return "/articles/default.jpg";
    };

    return (
        <div className="min-h-screen bg-white pt-6 md:pt-0">
            {/* Hero Section */}
            <section className="py-12 md:py-20 lg:py-28 bg-white ">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">18+</div>
                                    <div className="text-sm text-gray-600 mt-1">Years Experience</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">250+</div>
                                    <div className="text-sm text-gray-600 mt-1">Assignments</div>
                                </div>
                                <div className="text-center md:col-span-1 col-span-2">
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
                        <div className="relative">
                            <div className="w-full flex flex-col items-center justify-center p-8">
                                {/* Single Image Container */}
                                <div className="relative w-full max-w-[28rem] sm:max-w-[32rem] lg:max-w-[40rem] aspect-[3/2] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src={img2} // You can change this to img if you prefer the other image
                                        alt="Sundar - Business Consultant"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 448px"
                                        priority
                                    />
                                </div>

                                {/* Consultant Name and Title */}
                                <div className="text-center mt-15 pt-8 w-full max-w-md">
                                    <h3 className="text-2xl font-bold text-primary">S. Sundara Moorthy</h3>
                                    <p className="text-lg text-gray-600 mt-2">Strategy & Growth Advisor | Design Thinking Practitioner</p>
                                    <div className="flex items-center justify-center gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="text-sm">18+ Years Experience</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
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
                <ExperienceSection/>
            </div>


            {/* Latest Galleries Section */}
            {/*<section className="py-12 md:py-20 bg-primary">*/}
            {/*    <div className="container mx-auto px-4">*/}
            {/*        /!* Section Header *!/*/}
            {/*        <div className="text-center mb-12 md:mb-16">*/}
            {/*            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">*/}
            {/*                Latest Events & Insights*/}
            {/*            </h2>*/}
            {/*            <p className="text-white/80 max-w-2xl mx-auto">*/}
            {/*                Recent strategic assignments and business transformations*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        {galleryLoading ? (*/}
            {/*            // Loading State*/}
            {/*            <div className="py-12 text-center">*/}
            {/*                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>*/}
            {/*                <p className="mt-4 text-white/80">Loading latest Events...</p>*/}
            {/*            </div>*/}
            {/*        ) : latestGalleries.length === 0 ? (*/}
            {/*            // Empty State*/}
            {/*            <div className="text-center py-12">*/}
            {/*                <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">*/}
            {/*                    <Briefcase className="w-12 h-12 text-white" />*/}
            {/*                </div>*/}
            {/*                <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>*/}
            {/*                <p className="text-white/80">Check back soon for updates</p>*/}
            {/*            </div>*/}
            {/*        ) : (*/}
            {/*            // Gallery Grid*/}
            {/*            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">*/}
            {/*                {latestGalleries.map((item) => (*/}
            {/*                    <div*/}
            {/*                        key={item.id}*/}
            {/*                        className="group bg-white rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"*/}
            {/*                    >*/}
            {/*                        /!* Image *!/*/}
            {/*                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">*/}
            {/*                            {item.thumbnailUrl || item.imageUrls[0] ? (*/}
            {/*                                <img*/}
            {/*                                    src={item.thumbnailUrl || item.imageUrls[0]}*/}
            {/*                                    alt={item.title}*/}
            {/*                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"*/}
            {/*                                />*/}
            {/*                            ) : (*/}
            {/*                                <div className="w-full h-full flex items-center justify-center bg-primary/5">*/}
            {/*                                    <Briefcase className="w-16 h-16 text-primary/30" />*/}
            {/*                                </div>*/}
            {/*                            )}*/}
            {/*                        </div>*/}

            {/*                        /!* Content *!/*/}
            {/*                        <div className="p-6">*/}
            {/*                            /!* Category *!/*/}
            {/*                            {item.category && (*/}
            {/*                                <div className="inline-flex items-center gap-1 mb-3">*/}
            {/*                                    <Tag className="w-4 h-4 text-primary" />*/}
            {/*                                    <span className="text-sm font-medium text-primary">*/}
            {/*                                        {item.category.name}*/}
            {/*                                    </span>*/}
            {/*                                </div>*/}
            {/*                            )}*/}

            {/*                            /!* Title *!/*/}
            {/*                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">*/}
            {/*                                {item.title}*/}
            {/*                            </h3>*/}

            {/*                            /!* Description *!/*/}
            {/*                            {item.description && (*/}
            {/*                                <p className="text-gray-600 mb-4 line-clamp-2">*/}
            {/*                                    {item.description}*/}
            {/*                                </p>*/}
            {/*                            )}*/}

            {/*                            /!* Date & Images Count *!/*/}
            {/*                            <div className="flex items-center justify-between text-sm text-gray-500">*/}
            {/*                                <div className="flex items-center gap-2">*/}
            {/*                                    <Calendar className="w-4 h-4" />*/}
            {/*                                    <span>*/}
            {/*                                        {new Date(item.createdAt).toLocaleDateString('en-US', {*/}
            {/*                                            month: 'short',*/}
            {/*                                            day: 'numeric',*/}
            {/*                                            year: 'numeric'*/}
            {/*                                        })}*/}
            {/*                                    </span>*/}
            {/*                                </div>*/}
            {/*                                {item.imageUrls.length > 0 && (*/}
            {/*                                    <div className="flex items-center gap-1">*/}
            {/*                                        <span>{item.imageUrls.length} image{item.imageUrls.length !== 1 ? 's' : ''}</span>*/}
            {/*                                    </div>*/}
            {/*                                )}*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        )}*/}

            {/*        /!* View All Button *!/*/}
            {/*        <div className="text-center mt-12">*/}
            {/*            <a*/}
            {/*                href="/events"*/}
            {/*                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors"*/}
            {/*            >*/}
            {/*                <span>View All Events</span>*/}
            {/*                <ArrowUpRight className="w-5 h-5" />*/}
            {/*            </a>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Latest Articles Section */}
            {latestArticles.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                                Latest Articles
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
                                                <div className="grid md:grid-cols-2 gap-0">
                                                    {/* Article Image */}
                                                    <div className="relative h-64 md:h-96">
                                                        <Image
                                                            src={getArticleImage(article)}
                                                            alt={article.title}
                                                            fill
                                                            className="w-full h-full object-cover"
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
                                                            <span className="text-sm text-gray-600">
                                                                {formatDate(article.created_at)}
                                                            </span>
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
                                                            <Link href={`/articles/${article.slug}`}>
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
                                    <Link href="/articles">
                                        <Button size="lg" variant="secondary">
                                            View All Articles
                                            <ArrowUpRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}


            {/*/!* Expertise Section *!/*/}
            {/*<section className="py-12 md:py-20 bg-white">*/}
            {/*    <div className="container mx-auto px-4">*/}
            {/*        <div className="max-w-4xl mx-auto">*/}
            {/*            <div className="text-center mb-12">*/}
            {/*                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">*/}
            {/*                    Strategic Business Consulting*/}
            {/*                </h2>*/}
            {/*                <p className="text-gray-700 text-lg">*/}
            {/*                    Driving sustainable growth through data-driven strategies and market insights*/}
            {/*                </p>*/}
            {/*            </div>*/}

            {/*            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">*/}
            {/*                <div className="text-center p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors">*/}
            {/*                    <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">*/}
            {/*                        <Target className="w-8 h-8 text-primary" />*/}
            {/*                    </div>*/}
            {/*                    <h3 className="text-xl font-semibold text-primary mb-3">Market Analysis</h3>*/}
            {/*                    <p className="text-gray-600">*/}
            {/*                        Comprehensive market research and competitive analysis to identify growth opportunities*/}
            {/*                    </p>*/}
            {/*                </div>*/}

            {/*                <div className="text-center p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors">*/}
            {/*                    <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">*/}
            {/*                        <Briefcase className="w-8 h-8 text-primary" />*/}
            {/*                    </div>*/}
            {/*                    <h3 className="text-xl font-semibold text-primary mb-3">Strategy Development</h3>*/}
            {/*                    <p className="text-gray-600">*/}
            {/*                        Creating actionable business strategies that drive competitive advantage and growth*/}
            {/*                    </p>*/}
            {/*                </div>*/}

            {/*                <div className="text-center p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors">*/}
            {/*                    <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">*/}
            {/*                        <Globe className="w-8 h-8 text-primary" />*/}
            {/*                    </div>*/}
            {/*                    <h3 className="text-xl font-semibold text-primary mb-3">Global Expansion</h3>*/}
            {/*                    <p className="text-gray-600">*/}
            {/*                        Strategic planning for international market entry and global business optimization*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            <PhotoSection/>

        </div>
    );
}