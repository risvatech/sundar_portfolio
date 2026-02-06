"use client"
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image"

import portfolio1 from "../../public/assets/sundar-moorthy-1.jpeg";
import portfolio2 from "../../public/assets/sundar-moorthy-2.jpg";
import portfolio3 from "../../public/assets/sundar-moorthy-5.jpg";
import portfolio4 from "../../public/assets/sundar-moorthy-3.jpeg";
import portfolio5 from "../../public/assets/sundar-moorthy-4.jpeg";
import portfolio6 from "../../public/assets/sundar-moorthy-6.jpg";
import heroWedding from "../../public/assets/sundar-moorthy-7.jpg";
import heroFashion from "../../public/assets/sundar-moorthy-8.jpg";
// import heroEvent from "../../public/assets/sundar-moorthy-9.jpg";
import heroPortrait from "../../public/assets/sundar-moorthy-10.jpg";


// Create separate arrays for each row to ensure equal distribution
const row1Images = [
    portfolio1, portfolio3, portfolio5, heroWedding,  heroPortrait,
     heroFashion, portfolio2, portfolio4, portfolio6, heroFashion,
];

const row2Images = [
    portfolio2, portfolio4, portfolio6, heroFashion, portfolio1, portfolio3,
    portfolio5, heroWedding,  heroPortrait, portfolio2, portfolio4, portfolio6,
    heroFashion, portfolio1, portfolio3, portfolio5, heroWedding,
    heroPortrait, portfolio2,
    portfolio4, portfolio6, heroFashion
];

// Ensure both arrays have the same length
const maxLength = Math.max(row1Images.length, row2Images.length);
const row1 = row1Images.slice(0, maxLength);
row2Images.slice(0, maxLength);
const PhotoSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef(null);
    const isInView = useInView(headerRef, { once: true });
    const [galleryWidth, setGalleryWidth] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    // Get window width on mount
    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate gallery width - BASED ON EQUAL ROWS
    useEffect(() => {
        if (windowWidth === 0) return;

        const imageWidth = 320; // w-80 = 320px
        const gap = 16; // gap-4 = 16px
        const totalWidth = (imageWidth + gap) * row1.length;
        setGalleryWidth(totalWidth);
    }, [windowWidth]);

    // Use scroll progress for this section only
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Gallery progress - make it slower
    const galleryProgress = useTransform(
        scrollYProgress,
        [0, 1],
        [0, 1]
    );

    // Calculate visible width - how many images can fit on screen
    const visibleImages = Math.floor(windowWidth / 336); // 320px image + 16px gap
    const visibleWidth = visibleImages * 336;

    // ROW 1: Comes from RIGHT side, moves LEFT, STOPS when first image reaches left edge
    const row1X = useTransform(
        galleryProgress,
        [0, 1],
        [windowWidth * 0.1, -(galleryWidth - visibleWidth)]
    );



    // SECTION HEIGHT: Adjusted for better scrolling
    const sectionHeight = galleryWidth > 0
        ? Math.max(window.innerHeight * 3, galleryWidth * 0.5)
        : '40vh';




    return (
        <section
            ref={sectionRef}
            className="relative "
            style={{
                height: typeof sectionHeight === 'number' ? `${sectionHeight}px` : sectionHeight
            }}
        >
            {/* Fixed container that stays in viewport */}
            <div
                ref={containerRef}
                className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden"
            >
                {/* Gallery Container with boundaries */}
                <div className="relative w-full">
                    {/* Row 1: Comes from RIGHT, moves LEFT, STOPS */}
                    <motion.div
                        className="flex gap-4 mb-4"
                        style={{ x: row1X }}
                    >
                        {row1.map((image, index) => (
                            <div
                                key={`row1-${index}`}
                                className="flex-shrink-0 w-64 h-48 lg:w-80 lg:h-60 overflow-hidden group cursor-pointer relative rounded-lg"
                            >
                                <Image
                                    src={image}
                                    alt={`Gallery Row 1 - ${index + 1}`}
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    placeholder="blur"
                                    fill // Add this if using absolute dimensions
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </motion.div>



                </div>

                {/* Progress Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])
                    }}
                >
                    <div className="w-48 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            style={{ scaleX: galleryProgress }}
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default PhotoSection;