"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import Logo from "../../../public/sundar-logo-big.png";
import Image from "next/image";

interface NavItem {
    name: string;
    path: string;
}

const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "What I Do", path: "/what-i-do" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Insights", path: "/insights" },
];

export function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when menu open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                // 📱 Mobile always background
                "bg-card shadow-sm md:shadow-none",
                // 💻 Desktop scroll effect
                isScrolled
                    ? "md:bg-card/95 md:backdrop-blur-md md:shadow-soft md:py-3"
                    : "md:bg-card/95 md:py-5 py-4"
            )}
        >
            {/* NAV BAR */}
            <nav className="container-wide flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                        <Image
                            src={Logo}
                            alt="Sundara Moorthy Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-serif text-base md:text-lg font-semibold text-foreground whitespace-nowrap">
            Sundara Moorthy
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

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <Button variant="warm" size="lg" className="text-white">
                        <Link href="/contact">Let’s Talk Strategy</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            <div
                className={cn(
                    "md:hidden fixed inset-0 bg-card z-50 transition-transform duration-300",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">

                    {/* 🔥 Mobile Menu Header (Logo + Close) */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2"
                        >
                            <div className="relative w-10 h-10">
                                <Image
                                    src={Logo}
                                    alt="Sundara Moorthy Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="font-serif text-base font-semibold">
                Sundara Moorthy
              </span>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col gap-4 px-6 py-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "text-base font-medium py-3 px-4 rounded-lg transition-colors",
                                    pathname === item.path
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Button
                            variant="secondary"
                            size="lg"
                            className="mt-4 w-full text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Link href="/contact">Book a Consultation</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
