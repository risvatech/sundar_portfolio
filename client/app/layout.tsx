// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp"; // Add this import

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Favicons */}
            <link rel="icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest.json" />

            {/* Theme Color */}
            <meta name="theme-color" content="#ffffff" />

            {/* Robots */}
            <meta name="robots" content="index, follow" />

            {/* Structured Data - Homepage specific, you might want to make this dynamic */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "S. Sundara Moorthy",
                        "jobTitle": "Strategy & Growth Advisor",
                        "url": "https://www.sundara-moorthy.com",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Chennai",
                            "addressCountry": "IN"
                        },
                        "alumniOf": {
                            "@type": "CollegeOrUniversity",
                            "name": "IIM Trichy"
                        },
                        "sameAs": [
                            "https://www.linkedin.com/in/sundaramoorthy15/",
                            "https://x.com/sundara_sethu"
                        ]
                    })
                }}
            />

        </head>

        <body>
        {/* Add Google Analytics here */}
        {/*<GoogleAnalytics />*/}

        <ClientProviders>
            {children}
            <FloatingWhatsApp />
        </ClientProviders>
        </body>
        </html>
    );
}
