"use client";
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

const rowImages = [
    portfolio1,
    portfolio3,
    heroFashion,
    portfolio5,
    heroWedding,
    portfolio2,
    portfolio4,
    portfolio6,
    heroFashion,
];

const PhotoSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Responsive visible count
    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) setVisibleCount(1);
            else if (window.innerWidth < 1024) setVisibleCount(2);
            else setVisibleCount(3);
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    // Reset slide when layout changes (IMPORTANT FIX)
    useEffect(() => {
        setCurrentSlide(0);
    }, [visibleCount]);

    const totalSlides = Math.ceil(rowImages.length / visibleCount);

    const goToPrevious = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentSlide((prev) =>
            prev === 0 ? totalSlides - 1 : prev - 1
        );

        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToNext = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentSlide((prev) =>
            prev === totalSlides - 1 ? 0 : prev + 1
        );

        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Auto play
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    return (
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center">

                    <div className="relative w-full overflow-hidden">

                        {/* Arrows */}
                        {totalSlides > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={goToNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Images Container */}
                        <div
                            ref={containerRef}
                            className={`flex ${
                                isTransitioning
                                    ? "transition-transform duration-500 ease-out"
                                    : ""
                            }`}
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                            }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    className="flex-shrink-0 w-full"
                                >
                                    <div
                                        className={`grid gap-4 ${
                                            visibleCount === 1
                                                ? "grid-cols-1"
                                                : visibleCount === 2
                                                    ? "grid-cols-2"
                                                    : "grid-cols-3"
                                        }`}
                                    >
                                        {rowImages
                                            .slice(
                                                slideIndex * visibleCount,
                                                slideIndex * visibleCount + visibleCount
                                            )
                                            .map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative overflow-hidden group cursor-pointer rounded-lg aspect-[4/3]"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`Gallery Image ${index}`}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        placeholder="blur"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots */}
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
                                            ? "bg-primary scale-125"
                                            : "bg-gray-300 hover:bg-gray-400"
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
