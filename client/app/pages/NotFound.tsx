"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const NotFound = () => {
    const pathname = usePathname();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", pathname);
    }, [pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl md:text-5xl font-serif font-bold text-foreground">404</h1>
                    <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
                    <p className="text-muted-foreground mb-8">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        Return to Home
                    </Link>

                    <div className="text-sm text-muted-foreground">
                        <p>Looking for something specific?</p>
                        <div className="mt-2 space-x-4">
                            <Link href="/articles" className="hover:text-primary transition-colors">Blog</Link>
                            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;