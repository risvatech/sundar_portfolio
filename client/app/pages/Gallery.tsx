"use client";

import { useState, useEffect } from "react";
import {
    ArrowUpRight,
    X,
    ChevronLeft,
    ChevronRight,
    Star,
    Tag
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

export default function GalleryPage() {
    // Gallery Items State
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Categories State
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Slider Modal State
    const [showSlider, setShowSlider] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch gallery items
    const fetchGalleryItems = async () => {
        setLoading(true);
        try {
            const params: any = {};

            if (selectedCategory !== "all") params.categoryId = selectedCategory;

            const response = await api.get("/gallery", { params });

            if (response.data.success) {
                setGalleryItems(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load gallery");
            console.error("Error fetching gallery items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await api.get("/gallery/categories");
            if (response.data.success) {
                setCategories(response.data.data.filter((cat: Category) => cat.isActive));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchGalleryItems();
        fetchCategories();
    }, []);

    // Handle category change
    useEffect(() => {
        fetchGalleryItems();
    }, [selectedCategory]);

    // Open slider with item
    const openSlider = (item: GalleryItem) => {
        setSelectedItem(item);
        setCurrentImageIndex(0);
        setShowSlider(true);
        // Prevent body scroll when slider is open
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

    // Get item count by category
    const getItemCountByCategory = (categoryId: number) => {
        return galleryItems.filter(item => item.categoryId === categoryId).length;
    };

    // Get total item count
    const totalItems = galleryItems.length;

    // Prepare data for grid layout
    const getGridItems = () => {
        if (galleryItems.length === 0) return [];

        const items = [...galleryItems].filter(item => item.isActive);

        // Assign sizes based on position
        return items.map((item, index) => {
            let size: 'medium' | 'small' = 'small';

            if (index === 0) size = 'medium'; // First item is large
            else if (index % 5 === 0) size = 'medium'; // Every 5th item is medium
            else size = 'medium'; // Rest are small

            return {
                ...item,
                size,
                itemCount: item.imageUrls.length
            };
        });
    };

    const gridItems = getGridItems();

    return (
        <div className="min-h-screen">
            {/* Gallery Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 lg:mb-16">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                                Our Gallery
                            </h1>
                            <p className="text-gray-600 text-lg max-w-2xl">
                                Explore our collection of images and moments captured with care
                            </p>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === "all"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All ({totalItems})
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id.toString())}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedCategory === category.id.toString()
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category.name} ({getItemCountByCategory(category.id)})
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        // Loading State
                        <div className="py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading gallery...</p>
                        </div>
                    ) : gridItems.length === 0 ? (
                        // Empty State
                        <div className="py-20 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
                            <p className="text-gray-600">Check back later for updates</p>
                        </div>
                    ) : (
                        // Masonry Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {gridItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                                    onClick={() => openSlider(item)}
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                        {/* Main Image */}
                                        <img
                                            src={item.thumbnailUrl || item.imageUrls[0]}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading="lazy"
                                        />

                                        {/* Multiple Images Badge */}
                                        {item.imageUrls.length > 1 && (
                                            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 20l4-9 4 9" />
                                                </svg>
                                                <span>{item.imageUrls.length} images</span>
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        {item.category && (
                                            <div className="absolute top-4 left-4 bg-blue-600/90 text-white text-xs px-3 py-1.5 rounded-full">
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    {item.category.name}
                                                </div>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">
                                                        {item.title}
                                                    </h3>
                                                    {item.description && (
                                                        <p className="text-sm md:text-base text-primary group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs md:text-sm text-gray-300">
                                    {item.imageUrls.length} {item.imageUrls.length === 1 ? 'image' : 'images'}
                                </span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs md:text-sm text-gray-300">
                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>                    )}

                    {/* Footer Stats */}
                    {!loading && gridItems.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-center md:text-left">
                                    <p className="text-gray-600">
                                        Showing <span className="font-semibold text-gray-900">{totalItems}</span> gallery items
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
                                        <div className="text-sm text-gray-600">Total Items</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {categories.length}
                                        </div>
                                        <div className="text-sm text-gray-600">Categories</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {gridItems.reduce((sum, item) => sum + item.imageUrls.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Images</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Image Slider Modal */}
            {showSlider && selectedItem && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        onClick={closeSlider}
                    />

                    {/* Close Button */}
                    <button
                        onClick={closeSlider}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Main Content */}
                    <div className="relative h-full flex flex-col">
                        {/* Image Container */}
                        <div className="flex-1 flex items-center justify-center p-4">
                            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
                                <img
                                    src={selectedItem.imageUrls[currentImageIndex]}
                                    alt={`${selectedItem.title} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="h-32 md:h-40 bg-black/50 backdrop-blur-sm border-t border-white/10">
                            <div className="container mx-auto px-4 h-full">
                                <div className="h-full flex items-center overflow-x-auto py-4">
                                    <div className="flex gap-2 md:gap-3">
                                        {selectedItem.imageUrls.map((url, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                    index === currentImageIndex
                                                        ? 'border-blue-500 scale-105'
                                                        : 'border-transparent hover:border-white/30 hover:scale-105'
                                                }`}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {index === 0 && selectedItem.thumbnailUrl === url && (
                                                    <div className="absolute top-1 right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                                        <Star className="w-3 h-3 text-white fill-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Panel */}
                        {/*  <div className="bg-white border-t border-gray-200">*/}
                        {/*      <div className="container mx-auto px-4 py-4 md:py-6">*/}
                        {/*          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">*/}
                        {/*              <div>*/}
                        {/*                  <div className="flex items-center gap-3 mb-2">*/}
                        {/*                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">*/}
                        {/*                          {selectedItem.title}*/}
                        {/*                      </h2>*/}
                        {/*                      {selectedItem.category && (*/}
                        {/*                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-1">*/}
                        {/*    <Tag className="w-3 h-3" />*/}
                        {/*                              {selectedItem.category.name}*/}
                        {/*  </span>*/}
                        {/*                      )}*/}
                        {/*                  </div>*/}
                        {/*                  {selectedItem.description && (*/}
                        {/*                      <p className="text-gray-600 max-w-3xl">*/}
                        {/*                          {selectedItem.description}*/}
                        {/*                      </p>*/}
                        {/*                  )}*/}
                        {/*                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">*/}
                        {/*<span>*/}
                        {/*  Image {currentImageIndex + 1} of {selectedItem.imageUrls.length}*/}
                        {/*</span>*/}
                        {/*                      <span>•</span>*/}
                        {/*                      <span>*/}
                        {/*  Added {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {*/}
                        {/*                          month: 'long',*/}
                        {/*                          day: 'numeric',*/}
                        {/*                          year: 'numeric'*/}
                        {/*                      })}*/}
                        {/*</span>*/}
                        {/*                  </div>*/}
                        {/*              </div>*/}

                        {/*              /!* Image Counter *!/*/}
                        {/*              <div className="flex items-center gap-3">*/}
                        {/*                  <div className="text-center">*/}
                        {/*                      <div className="text-2xl font-bold text-gray-900">*/}
                        {/*                          {currentImageIndex + 1}/{selectedItem.imageUrls.length}*/}
                        {/*                      </div>*/}
                        {/*                      <div className="text-sm text-gray-600">Images</div>*/}
                        {/*                  </div>*/}
                        {/*              </div>*/}
                        {/*          </div>*/}
                        {/*      </div>*/}
                        {/*  </div>*/}
                    </div>

                    {/* Keyboard Shortcuts Hint */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm opacity-0 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <span>← → Navigate</span>
                            <span className="text-gray-400">•</span>
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
            `}</style>
        </div>
    );
}