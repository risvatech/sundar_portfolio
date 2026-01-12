// app/services/[id]/page.tsx
import { services } from "../../data/services";
import ServiceDetail from "../../pages/ServiceDetail";

interface PageProps {
    params: {
        id: string;
    };
}

export default function ServiceDetailPage({ params }: PageProps) {
    return <ServiceDetail params={params} />;
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
    // Return all possible id values at build time
    return services.map((service) => ({
        id: service.id,
    }));
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const service = services.find((s) => s.id === params.id);

    if (!service) {
        return {
            title: "Service Not Found | Sundar Consulting",
            description: "The service you're looking for doesn't exist.",
        };
    }

    return {
        title: `${service.title} | Sundar Consulting`,
        description: service.description,
        openGraph: {
            title: service.title,
            description: service.description,
            type: "website",
        },
    };
}

// Optional: Configure page behavior
export const dynamicParams = true; // Allow non-pre-generated pages (will show 404)
// export const dynamicParams = false; // Disallow non-pre-generated pages

// Optional: Enable Incremental Static Regeneration (ISR)
// export const revalidate = 3600; // Revalidate every hour