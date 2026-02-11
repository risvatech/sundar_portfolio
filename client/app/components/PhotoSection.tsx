"use client"
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import portfolio1 from "../../public/assets/sundar-moorthy-1.jpeg";
import portfolio2 from "../../public/assets/sundar-moorthy-2.jpg";
import portfolio3 from "../../public/assets/sundar-moorthy-5.jpg";
import portfolio4 from "../../public/assets/sundar-moorthy-3.jpeg";
import portfolio5 from "../../public/assets/sundar-moorthy-4.jpeg";
import portfolio6 from "../../public/assets/sundar-moorthy-6.jpg";
import heroWedding from "../../public/assets/sundar-moorthy-7.jpg";
import heroFashion from "../../public/assets/sundar-moorthy-8.jpg";

// Single row of images
const rowImages = [
    portfolio1, portfolio3, heroFashion, portfolio5, heroWedding,
    portfolio2, portfolio4, portfolio6, heroFashion,
];

const PhotoSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Number of images to show based on screen size
    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) setVisibleCount(1);
            else if (window.innerWidth < 1024) setVisibleCount(2);
            else setVisibleCount(3);
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    // Calculate total slides based on visible count
    const totalSlides = Math.ceil(rowImages.length / visibleCount);

    // Calculate how much to move for each slide
    const slideMovement = 100 / visibleCount;

    const goToPrevious = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentSlide(prev => {
            const newSlide = prev - 1;
            if (newSlide < 0) {
                // Go to the last slide
                return totalSlides - 1;
            }
            return newSlide;
        });

        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToNext = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentSlide(prev => {
            const newSlide = prev + 1;
            if (newSlide >= totalSlides) {
                // Go back to the first slide
                return 0;
            }
            return newSlide;
        });

        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Auto-play functionality (optional - remove if not needed)
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    // Calculate the width for each image based on visible count
    const imageWidth = 100 / visibleCount;

    return (
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center">
                    {/* Carousel Container */}
                    <div className="relative w-full overflow-hidden">
                        {/* Arrow Navigation */}
                        {totalSlides > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={goToNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Images Container */}
                        <div
                            ref={containerRef}
                            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                            style={{
                                transform: `translateX(-${currentSlide * slideMovement}%)`,
                                width: `${rowImages.length * (100 / visibleCount)}%`
                            }}
                        >
                            {rowImages.map((image, index) => (
                                <div
                                    key={`carousel-${index}`}
                                    className="px-2"
                                    style={{ width: `${imageWidth}%` }}
                                >
                                    <div className="relative overflow-hidden group cursor-pointer rounded-lg aspect-[4/3]">
                                        <Image
                                            src={image}
                                            alt={`Gallery Image - ${index + 1}`}
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            placeholder="blur"
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator - only show if there are multiple slides */}
                    {totalSlides > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setCurrentSlide(index);
                                        setTimeout(() => setIsTransitioning(false), 500);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentSlide
                                            ? 'bg-primary scale-125'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PhotoSection;