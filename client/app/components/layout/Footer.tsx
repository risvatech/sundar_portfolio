import Link from "next/link";
import { Linkedin, Twitter, Mail, Instagram, LucideProps } from "lucide-react";

interface FooterLink {
    name: string;
    path: string;
}

// Updated interface to accept LucideProps
interface SocialLink {
    icon: React.ComponentType<LucideProps>;
    href: string;
    label: string;
}

const footerLinks = {
    pages: [
        { name: "About Me", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Articles", path: "/articles" },
    ],
    legal: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
    ],
} as const;

const socialLinks: SocialLink[] = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "mailto:hello@sarahmitchell.com", label: "Email" },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary border-t">
            <div className="container-wide py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-serif font-bold text-lg">S</span>
                            </div>
                            <span className="font-serif text-xl font-semibold text-foreground">
                                Sundar
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm leading-relaxed mb-6">
                            Helping businesses unlock their full potential through strategic consulting,
                            innovative solutions, and personalized guidance.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                        target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                                        rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pages */}
                    <div>
                        <h4 className="font-serif font-semibold text-foreground mb-4">Pages</h4>
                        <ul className="space-y-3">
                            {footerLinks.pages.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        href={link.path}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-serif font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        href={link.path}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Sundar Consulting. All rights reserved.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Powered by <a href="https://www.risva.app/">Risva.app</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}