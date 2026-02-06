'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';

// Dynamic import for better performance
const WhatsAppIcon = dynamic(() => import('./WhatsAppIcon'), {
    ssr: false,
    loading: () => null,
});

const FloatingWhatsApp: React.FC = () => {
    const pathname = usePathname();

    // Check if current path starts with /cms or /admin or any other routes you want to exclude
    const hiddenRoutes = ['/cms', '/admin', '/dashboard']; // Add more routes as needed
    const shouldHide = hiddenRoutes.some(route => pathname?.startsWith(route));

    // Don't render anything on CMS routes
    if (shouldHide) {
        return null;
    }

    // You can customize these props
    const whatsAppProps = {
        phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+917020166785', // Using your number
        message: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hello Sundar, Let's Talk Strategy",
        position: 'bottom-right' as const,
    };

    return (
        <Suspense fallback={null}>
            <WhatsAppIcon {...whatsAppProps} />
        </Suspense>
    );
};

export default FloatingWhatsApp;