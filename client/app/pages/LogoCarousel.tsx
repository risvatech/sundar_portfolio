"use client";

import { useEffect, useState } from "react";

const clientLogos = [
    // Original
    "Stripe", "Notion", "Figma", "Linear", "Vercel", "Supabase",
    "GitHub", "Slack", "Zoom", "Dropbox", "Shopify", "Twilio",
    "Airbnb", "Spotify", "Netflix", "Uber", "Lyft", "DoorDash",
    "Salesforce", "HubSpot", "Mailchimp", "Intercom", "Zendesk",
    "Atlassian", "Trello", "Asana", "Monday.com", "ClickUp",
    "Google", "Microsoft", "Apple", "Amazon", "Meta",
    "Adobe", "Canva", "InVision", "Sketch", "Miro",
    "Twitter", "LinkedIn", "Instagram", "Pinterest", "TikTok",
    "Coinbase", "Robinhood", "PayPal", "Square", "Brex",
    "AWS", "Google Cloud", "Azure", "DigitalOcean", "Heroku",
    "Nike", "Adidas", "Tesla", "SpaceX", "Airbnb",
    "Spotify", "Netflix", "Disney", "HBO", "Hulu",
    "IBM", "Intel", "Cisco", "Oracle", "SAP",
    "McKinsey", "BCG", "Bain", "Deloitte", "PwC",
    "Accenture", "EY", "KPMG", "Goldman Sachs", "JP Morgan"
];

export function LogoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const logosPerView = 9; // Number of logos visible at once

    // Auto-rotate logos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === Math.ceil(clientLogos.length / logosPerView) - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Calculate visible logos based on currentIndex
    const visibleLogos = clientLogos.slice(
        currentIndex * logosPerView,
        currentIndex * logosPerView + logosPerView
    );

    return (
        <section className="py-16 border-y bg-primary/10">
            <div className="container-wide">
                <div className="text-center mb-12">
          {/*<span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-4">*/}
          {/*  Trusted By*/}
          {/*</span>*/}
                    <h3 className="font-serif text-2xl font-semibold text-foreground">
                        Trusted By
                    </h3>
                </div>

                {/* Logo Carousel Container */}
                <div className="relative">
                    {/* Logo Carousel */}
                    <div className="overflow-hidden">
                        <div className="flex justify-center gap-12 md:gap-16 transition-all duration-500">
                            {visibleLogos.map((logo, index) => (
                                <div
                                    key={index}
                                    className="text-2xl font-semibold text-primary hover:text-muted-foreground transition-colors duration-300 whitespace-nowrap"
                                >
                                    {logo}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Manual navigation dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(clientLogos.length / logosPerView) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    currentIndex === index ? "bg-primary w-6" : "bg-muted-foreground/30"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}