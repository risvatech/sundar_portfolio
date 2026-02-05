"use client";

import { Layout } from "../components/layout/Layout";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { featuredPosts, blogPosts } from "../data/blogPosts";

const categories = ["All", "Strategy", "Growth", "Leadership", "Digital", "Branding"];

const Blog = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts = activeCategory === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === activeCategory);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
    };

    return (
        <Layout>
            {/* Hero */}
            <section className="pt-32 pb-8 bg-warm-gradient">
                <div className="container-wide text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-4">
            Insights & Ideas
          </span>
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                        The <span className="text-primary">Growth</span> Blog
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Practical wisdom, strategic insights, and lessons learned from 15 years of helping
                        businesses reach their full potential.
                    </p>
                </div>
            </section>

            {/* Featured Carousel */}
            <section className="section-padding pb-8">
                <div className="container-wide">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-serif text-2xl font-semibold text-foreground">
                            Featured Articles
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={prevSlide}>
                                <ChevronLeft size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextSlide}>
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {featuredPosts.map((post) => (
                                <div key={post.id} className="w-full flex-shrink-0">
                                    <div className="grid md:grid-cols-2 gap-0">
                                        <div className="relative h-64 md:h-96">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="w-full h-full object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                        <div className="bg-card p-8 md:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Badge variant="secondary" className="rounded-lg">
                                                    {post.category}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock size={14} />
                                                    {post.readTime}
                        </span>
                                            </div>
                                            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <Link href={`/blog/${post.slug}`}>
                                                <Button variant="outline" className="self-start">
                                                    Read Article
                                                    <ArrowRight className="ml-2" size={16} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-4 md:left-auto md:right-4 flex gap-2">
                            {featuredPosts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        currentSlide === index ? "bg-primary w-6" : "bg-muted-foreground/30"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8">
                <div className="container-wide">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    activeCategory === category
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="section-padding pt-8">
                <div className="container-wide">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                                <Card variant="default" className="group hover:-translate-y-1 h-full transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Badge variant="secondary" className="rounded-lg">
                                                {post.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                        {post.date}
                      </span>
                                        </div>
                                        <h3 className="font-serif text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                          {post.readTime}
                      </span>
                                            <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight size={14} />
                      </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            Load More Articles
                        </Button>
                    </div>
                </div>
            </section>

        </Layout>
    );
};

export default Blog;