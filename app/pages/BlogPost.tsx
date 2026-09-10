"use client";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Clock, ArrowLeft, ArrowRight, Share2, Linkedin, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, allPosts } from "../data/blogPosts";

interface BlogPostProps {
    params: {
        slug: string;
    };
}

const BlogPost = ({ params }: BlogPostProps) => {
    const router = useRouter();
    const post = getPostBySlug(params.slug);

    if (!post) {
        return (
            <Layout>
                <section className="pt-32 pb-16">
                    <div className="container-narrow text-center">
                        <h1 className="font-serif text-4xl font-semibold text-foreground mb-4">
                            Post Not Found
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The blog post you&apos;re looking for doesn&apos;t exist.
                        </p>
                        <Button variant="hero" onClick={() => router.push("/blog")}>
                            <ArrowLeft className="mr-2" size={16} />
                            Back to Blog
                        </Button>
                    </div>
                </section>
            </Layout>
        );
    }

    // Get related posts (same category, excluding current)
    const relatedPosts = allPosts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    return (
        <Layout>
            {/* Hero */}
            <section className="pt-32 pb-8 bg-warm-gradient">
                <div className="container-narrow">
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-2"
                        onClick={() => router.push("/blog")}
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Back to Blog
                    </Button>

                    <div className="flex items-center gap-3 mb-6">
                        <Badge variant="secondary" className="rounded-lg">
                            {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock size={14} />
                            {post.readTime}
            </span>
                        <span className="text-sm text-muted-foreground">
              {post.date}
            </span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {post.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <Image
                                src={post.authorImage}
                                alt={post.author}
                                fill
                                className="rounded-full object-cover"
                                sizes="48px"
                            />
                        </div>
                        <div>
                            <div className="font-medium text-foreground">{post.author}</div>
                            <div className="text-sm text-muted-foreground">Business Consultant</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-7 order-2 lg:order-1">
                            {/* Featured Image */}
                            <div className="rounded-2xl overflow-hidden mb-10 shadow-soft">
                                <div className="relative w-full h-64 sm:h-80">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 66vw"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Article Content */}
                            <div
                                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-soft"
                                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                            />

                            {/* Share */}
                            <div className="mt-12 pt-8 border-t">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Share2 size={18} />
                                        <span className="text-sm font-medium">Share this article</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        >
                                            <Twitter size={18} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        >
                                            <Linkedin size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-5 order-1 lg:order-2">
                            <div className="lg:sticky lg:top-32 space-y-8">
                                {/* Author Card */}
                                <Card variant="warm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative w-16 h-16">
                                                <Image
                                                    src={post.authorImage}
                                                    alt={post.author}
                                                    fill
                                                    className="rounded-full object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-serif font-semibold text-foreground">{post.author}</div>
                                                <div className="text-sm text-muted-foreground">Business Consultant</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            With 15+ years of experience helping businesses grow, I share insights
                                            and practical strategies for sustainable success.
                                        </p>
                                        <Button variant="outline" className="w-full">
                                            View Profile
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Related Posts */}
                                {relatedPosts.length > 0 && (
                                    <div>
                                        <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                                            Related Articles
                                        </h3>
                                        <div className="space-y-4">
                                            {relatedPosts.map((relatedPost) => (
                                                <Link
                                                    key={relatedPost.id}
                                                    href={`/blog/${relatedPost.slug}`}
                                                    className="block group"
                                                >
                                                    <Card variant="default" className="hover:-translate-y-0.5 transition-all duration-300">
                                                        <CardContent className="p-4">
                                                            <Badge variant="secondary" className="rounded-lg mb-2 text-xs">
                                                                {relatedPost.category}
                                                            </Badge>
                                                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                                {relatedPost.title}
                                                            </h4>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                                <Clock size={12} />
                                                                {relatedPost.readTime}
                              </span>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA Card */}
                                <Card className="bg-primary text-primary-foreground overflow-hidden">
                                    <CardContent className="p-6">
                                        <h3 className="font-serif text-xl font-semibold mb-3">
                                            Ready to Transform Your Business?
                                        </h3>
                                        <p className="text-primary-foreground/80 text-sm mb-4">
                                            Book a free 30-minute consultation and let&apos;s discuss how I can help you reach your goals.
                                        </p>
                                        <Button variant="secondary" className="w-full">
                                            Schedule a Call
                                            <ArrowRight className="ml-2" size={16} />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
    return content
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/^(?!<[hul]|<li)(.*$)/gm, (match) => match.trim() ? `<p>${match}</p>` : '')
        .replace(/<p><\/p>/g, '')
        .replace(/---/g, '<hr />');
}

export default BlogPost;