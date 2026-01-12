"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Layers, Menu, X} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface NavItem {
    name: string;
    path: string;
}

const navItems: NavItem[] = [
    { name: "About", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Impact", path: "/impact" },
    // { name: "Impact", path: "/expertise" },
    { name: "Articles",  path: "/articles" },

];

export function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Track the previous pathname to detect route changes
    const [prevPathname, setPrevPathname] = useState(pathname);

    useEffect(() => {
        // Check if pathname has actually changed
        if (pathname !== prevPathname) {
            setIsMobileMenuOpen(false);
            setPrevPathname(pathname);
        }
    }, [pathname, prevPathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Check initial scroll position
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-card/95 backdrop-blur-md shadow-soft py-3"
                    : "bg-transparent py-5"
            )}
        >
            <nav className="container-wide flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-serif font-bold text-lg">S</span>
                    </div>
                    <span className="font-serif text-xl font-semibold text-foreground">
                        Sundar
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "text-sm font-medium transition-colors duration-200 relative py-1",
                                pathname === item.path
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {item.name}
                            {pathname === item.path && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Button variant="hero" size="lg">
                        <Link href="/book">Book a Consultation</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden fixed inset-0 top-[64px] bg-card/98 backdrop-blur-md transition-all duration-300 ease-in-out z-40",
                    isMobileMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                )}
                aria-hidden={!isMobileMenuOpen}
            >
                <div className="container-wide py-6 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "text-base font-medium py-3 px-4 rounded-lg transition-colors hover:text-primary hover:bg-muted/50",
                                pathname === item.path
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button variant="hero" size="lg" className="mt-4 w-full">
                        <Link href="/book">Book a Consultation</Link>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
}