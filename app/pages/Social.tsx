"use client";

import { useState, useEffect } from "react";
import {
    ArrowUpRight,
    X,
    ChevronLeft,
    ChevronRight,
    Star,
    Tag,
    Heart,
    MessageCircle,
    Share2,
    Users,
    Calendar,
    MapPin,
    Instagram,
    Facebook,
    Twitter,
    ThumbsUp,
    Filter
} from "lucide-react";
import api from "../service/api";
import toast from "react-hot-toast";

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

export default function   SocialPage() {
    // Gallery Items State - ONLY SOCIAL ITEMS
    const [socialItems, setSocialItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Slider Modal State
    const [showSlider, setShowSlider] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Social engagement state
    const [socialStats, setSocialStats] = useState<Record<number, {
        likes: number;
        comments: number;
        shares: number;
        isLiked: boolean;
    }>>({});

    // Filter state for Social items
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

    // Fetch ONLY Social category items
    const fetchSocialItems = async () => {
        setLoading(true);
        try {
            // First, get all categories to find Social category ID
            const categoriesResponse = await api.get("/gallery/categories");

            if (categoriesResponse.data.success) {
                const categories = categoriesResponse.data.data;
                const socialCategory = categories.find((cat: Category) =>
                    cat.name.toLowerCase() === 'social'
                );

                if (socialCategory) {
                    // Now fetch only items from Social category
                    const response = await api.get("/gallery", {
                        params: { categoryId: socialCategory.id }
                    });

                    if (response.data.success) {
                        const items = response.data.data;

                        // Filter to ensure only active items
                        const activeSocialItems = items.filter((item: GalleryItem) =>
                            item.isActive && item.categoryId === socialCategory.id
                        );

                        setSocialItems(activeSocialItems);

                        // Initialize social stats for all items
                        const newSocialStats: Record<number, any> = {};
                        activeSocialItems.forEach((item: GalleryItem) => {
                            newSocialStats[item.id] = {
                                likes: Math.floor(Math.random() * 1000) + 500,
                                comments: Math.floor(Math.random() * 200) + 50,
                                shares: Math.floor(Math.random() * 100) + 20,
                                isLiked: false
                            };
                        });
                        setSocialStats(newSocialStats);
                    }
                } else {
                    toast.error("Social category not found");
                    setSocialItems([]);
                }
            }
        } catch (error) {
            toast.error("Failed to load social gallery");
            console.error("Error fetching social items:", error);
            setSocialItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchSocialItems();
    }, []);

    // Handle social interactions
    const handleLike = (itemId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSocialStats(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                likes: prev[itemId]?.isLiked ? prev[itemId].likes - 1 : prev[itemId].likes + 1,
                isLiked: !prev[itemId]?.isLiked
            }
        }));
    };

    const handleComment = (itemId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Comment feature coming soon!");
    };

    const handleShare = (itemId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: socialItems.find(item => item.id === itemId)?.title,
                text: 'Check out this amazing social post!',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    // Open slider with item
    const openSlider = (item: GalleryItem) => {
        setSelectedItem(item);
        setCurrentImageIndex(0);
        setShowSlider(true);
        document.body.style.overflow = 'hidden';
    };

    // Close slider
    const closeSlider = () => {
        setShowSlider(false);
        setSelectedItem(null);
        document.body.style.overflow = 'auto';
    };

    // Navigate slider images
    const nextImage = () => {
        if (!selectedItem) return;
        setCurrentImageIndex((prev) =>
            prev === selectedItem.imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        if (!selectedItem) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? selectedItem.imageUrls.length - 1 : prev - 1
        );
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showSlider || !selectedItem) return;

            if (e.key === 'Escape') {
                closeSlider();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showSlider, selectedItem]);

    // Sort social items
    const getSortedItems = () => {
        const items = [...socialItems];

        if (sortBy === 'latest') {
            return items.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else {
            // Sort by popularity (likes + comments + shares)
            return items.sort((a, b) => {
                const aStats = socialStats[a.id] || { likes: 0, comments: 0, shares: 0 };
                const bStats = socialStats[b.id] || { likes: 0, comments: 0, shares: 0 };
                const aPopularity = aStats.likes + aStats.comments + aStats.shares;
                const bPopularity = bStats.likes + bStats.comments + bStats.shares;
                return bPopularity - aPopularity;
            });
        }
    };

    const sortedItems = getSortedItems();

    // Format numbers for social stats
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-secondary-light to-white">
            {/* Hero Section - Social Only */}
            <div className="relative overflow-hidden bg-white text-primary">
                <div className="absolute inset-0 " />
                {/*<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />*/}
                <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
                            Community Moments
                        </h1>
                        <p className="text-xl text-primary/90 mb-8 max-w-2xl mx-auto">
                            Discover and engage with social posts from our vibrant community
                        </p>
                        {/*<div className="flex flex-wrap justify-center gap-4">*/}
                        {/*    <div className="flex items-center gap-6">*/}
                        {/*        <div className="text-center">*/}
                        {/*            <div className="text-3xl font-bold text-white">{totalItems}</div>*/}
                        {/*            <div className="text-sm text-white/80">Social Posts</div>*/}
                        {/*        </div>*/}
                        {/*        <div className="text-center">*/}
                        {/*            <div className="text-3xl font-bold text-white">{formatNumber(totalLikes)}</div>*/}
                        {/*            <div className="text-sm text-white/80">Total Likes</div>*/}
                        {/*        </div>*/}
                        {/*        <div className="text-center">*/}
                        {/*            <div className="text-3xl font-bold text-white">{formatNumber(totalComments)}</div>*/}
                        {/*            <div className="text-sm text-white/80">Comments</div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

            {/* Social Gallery Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    {/* Filter Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Social  Feed
                            </h2>
                            <p className="text-gray-600">
                                Latest posts from our community members
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Sort by:</span>
                            </div>
                            <div className="flex bg-white border border-gray-200 rounded-full p-1">
                                <button
                                    onClick={() => setSortBy('latest')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        sortBy === 'latest'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:text-primary/80'
                                    }`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => setSortBy('popular')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        sortBy === 'popular'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:text-primary/80'
                                    }`}
                                >
                                    Popular
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        // Loading State
                        <div className="py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                            <p className="mt-6 text-gray-600 text-lg">Loading social posts...</p>
                        </div>
                    ) : sortedItems.length === 0 ? (
                        // Empty State - No Social Posts
                        <div className="py-20 text-center bg-primary rounded-3xl">

                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No social posts yet</h3>
                            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                                Be the first to share your moments with our community!
                            </p>
                            <button
                                className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
                                onClick={() => toast.success("Upload feature coming soon!")}
                            >
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Share Your First Post
                                </div>
                            </button>
                        </div>
                    ) : (
                        // Social Posts Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {sortedItems.map((item, index) => {
                                const stats = socialStats[item.id] || { likes: 0, comments: 0, shares: 0, isLiked: false };
                                const isLarge = index === 0 || index % 5 === 0;

                                return (
                                    <div
                                        key={item.id}
                                        className={`group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] ${
                                            isLarge ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''
                                        } bg-white border border-primary hover:border-primary/80 hover:shadow-xl hover:shadow-primary-500/20`}
                                        onClick={() => openSlider(item)}
                                    >
                                        {/* Social Platform Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="bg-secondary text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
                                               Social
                                            </div>
                                        </div>

                                        {/* Image Container */}
                                        <div className={`relative overflow-hidden ${
                                            isLarge ? 'aspect-[4/3]' : 'aspect-square'
                                        } bg-primary`}>
                                            {/* Main Image */}
                                            <img
                                                src={item.thumbnailUrl || item.imageUrls[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                                loading="lazy"
                                            />

                                            {/* Multiple Images Badge */}
                                            {item.imageUrls.length > 1 && (
                                                <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full text-xs flex items-center gap-1 shadow-lg">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                                                    </svg>
                                                    <span>{item.imageUrls.length}</span>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            {/*<div className="absolute inset-0 bg- opacity-0 group-hover:opacity-100 transition-all duration-500" />*/}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 md:p-6">
                                            {/* Title and Description */}
                                            <div className="mb-4">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                                    {item.title}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Social Stats */}
                                            <div className="flex items-center justify-between mb-4">

                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                className="w-full py-3 bg-secondary-light text-primary rounded-lg font-medium hover:from-purple-100 hover:to-pink-100 transition-all duration-300 flex items-center justify-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openSlider(item);
                                                }}
                                            >
                                                <span>View Post</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>


                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </section>

            {/* Image Slider Modal - SOCIAL ONLY STYLING */}
            {showSlider && selectedItem && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 backdrop-blur-md bg-primary transition-all duration-500"
                        onClick={closeSlider}
                    />

                    {/* Close Button */}
                    <button
                        onClick={closeSlider}
                        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                    >
                        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                    >
                        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Main Content */}
                    <div className="relative h-full flex flex-col">
                        {/* Image Container */}
                        <div className="flex-1 flex items-center justify-center p-4">
                            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
                                <img
                                    src={selectedItem.imageUrls[currentImageIndex]}
                                    alt={`${selectedItem.title} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="h-40  backdrop-blur-sm border-t border-white/10">
                            <div className="container mx-auto px-4 h-full">
                                <div className="h-full flex items-center overflow-x-auto py-4">
                                    <div className="flex gap-3">
                                        {selectedItem.imageUrls.map((url, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                                                    index === currentImageIndex
                                                        ? 'border-purple-500 shadow-lg shadow-purple-500/50 scale-110'
                                                        : 'border-transparent hover:border-white/30 hover:scale-105'
                                                }`}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {index === 0 && selectedItem.thumbnailUrl === url && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                                        <Star className="w-4 h-4 text-white fill-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="bg-secondary">
                            <div className="container mx-auto px-4 py-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                                {selectedItem.title}
                                            </h2>
                                            <span className="px-4 py-2 bg-white/20 text-white backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                                                <Instagram className="w-4 h-4" />
                                                Social  Post
                                            </span>
                                        </div>

                                        {selectedItem.description && (
                                            <p className="text-purple-100 mb-4 max-w-3xl">
                                                {selectedItem.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-purple-200">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Posted {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                                </span>
                                            </div>

                                            <span className="text-purple-300">•</span>

                                            <div className="flex items-center gap-2 text-purple-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                                                </svg>
                                                <span>
                                                    {selectedItem.imageUrls.length} {selectedItem.imageUrls.length === 1 ? 'Image' : 'Images'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Actions */}
                                    {socialStats[selectedItem.id] && (
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => handleLike(selectedItem.id, e)}
                                                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                    <Heart className={`w-6 h-6 ${
                                                        socialStats[selectedItem.id].isLiked
                                                            ? 'fill-red-500 text-red-500'
                                                            : 'text-white'
                                                    }`} />
                                                </div>
                                                <span className="text-white text-sm font-medium">
                                                    {formatNumber(socialStats[selectedItem.id].likes)}
                                                </span>
                                            </button>

                                            <button
                                                onClick={(e) => handleComment(selectedItem.id, e)}
                                                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                    <MessageCircle className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-white text-sm font-medium">
                                                    {formatNumber(socialStats[selectedItem.id].comments)}
                                                </span>
                                            </button>

                                            <button
                                                onClick={(e) => handleShare(selectedItem.id, e)}
                                                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                    <Share2 className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-white text-sm font-medium">
                                                    {formatNumber(socialStats[selectedItem.id].shares)}
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Image Counter */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            {currentImageIndex + 1}/{selectedItem.imageUrls.length}
                                        </div>
                                        <div className="text-sm text-purple-200">
                                            Images
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts Hint */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm opacity-0 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <span>← → Navigate</span>
                            <span className="text-white/50">•</span>
                            <span>ESC Close</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom styles for the fade-in animation */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 10px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out 0.5s forwards;
                }

                /* Custom scrollbar for thumbnails */
                ::-webkit-scrollbar {
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
}