// components/PhotoGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const PhotoGallery = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const photos = [
        {
            id: 1,
            title: 'Strategy Session',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&q=80'
        },
        {
            id: 2,
            title: 'Market Research',
            imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1800&q=80'
        },
        {
            id: 3,
            title: 'Industry Conference',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&q=80'
        },
        {
            id: 4,
            title: 'Client Workshop',
            imageUrl: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=1800&q=80'
        },
        {
            id: 5,
            title: 'Strategic Planning',
            imageUrl: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=1800&q=80'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % photos.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const goToSlide = (index: number) => {
        setActiveIndex(index);
    };

    // Get previous and next indices for side images
    const prevIndex = (activeIndex - 1 + photos.length) % photos.length;
    const nextIndex = (activeIndex + 1) % photos.length;

    // Get far previous and next for additional side images
    const prev2Index = (activeIndex - 2 + photos.length) % photos.length;
    const next2Index = (activeIndex + 2) % photos.length;

    return (
        <div className="py-8 sm:py-12 bg-gradient-to-b from-background to-gray-50">
            <div className="container-wide">
                <div className="max-w-7xl mx-auto">
                    {/* Gallery Container */}
                    <div className="relative">
                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Main Gallery */}
                        <div className="relative h-[500px] sm:h-[600px] flex items-center justify-center">
                            {/* Far Left Image */}
                            <motion.div
                                initial={{ opacity: 0, x: -100, scale: 0.7 }}
                                animate={{ opacity: 0.4, x: -320, scale: 0.6 }}
                                className="absolute left-1/4 z-10"
                            >
                                <div className="relative w-40 h-28 sm:w-48 sm:h-32 lg:w-56 lg:h-36 rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src={photos[prev2Index].imageUrl}
                                        alt={photos[prev2Index].title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                                    />
                                </div>
                            </motion.div>

                            {/* Left Image */}
                            <motion.div
                                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                animate={{ opacity: 0.7, x: -180, scale: 0.8 }}
                                className="absolute left-1/3 z-20 cursor-pointer"
                                onClick={() => goToSlide(prevIndex)}
                            >
                                <div className="relative w-56 h-36 sm:w-64 sm:h-40 lg:w-72 lg:h-44 rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={photos[prevIndex].imageUrl}
                                        alt={photos[prevIndex].title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                                    />
                                </div>
                            </motion.div>

                            {/* Center Active Image */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative z-30"
                                >
                                    <div className="relative w-full max-w-4xl mx-auto">
                                        <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                                            <Image
                                                src={photos[activeIndex].imageUrl}
                                                alt={photos[activeIndex].title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 1200px"
                                                priority
                                            />
                                            {/* Title Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                                <h3 className="text-white text-xl sm:text-2xl font-bold text-center">
                                                    {photos[activeIndex].title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Right Image */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                                animate={{ opacity: 0.7, x: 180, scale: 0.8 }}
                                className="absolute right-1/3 z-20 cursor-pointer"
                                onClick={() => goToSlide(nextIndex)}
                            >
                                <div className="relative w-56 h-36 sm:w-64 sm:h-40 lg:w-72 lg:h-44 rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={photos[nextIndex].imageUrl}
                                        alt={photos[nextIndex].title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                                    />
                                </div>
                            </motion.div>

                            {/* Far Right Image */}
                            <motion.div
                                initial={{ opacity: 0, x: 100, scale: 0.7 }}
                                animate={{ opacity: 0.4, x: 320, scale: 0.6 }}
                                className="absolute right-1/4 z-10"
                            >
                                <div className="relative w-40 h-28 sm:w-48 sm:h-32 lg:w-56 lg:h-36 rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src={photos[next2Index].imageUrl}
                                        alt={photos[next2Index].title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-3">
                                {photos.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === activeIndex
                                                ? 'bg-accent scale-125'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Slide Counter */}
                        <div className="mt-4 text-center">
                            <span className="text-gray-600 font-medium">
                                {activeIndex + 1} / {photos.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoGallery;