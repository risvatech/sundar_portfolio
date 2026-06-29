// app/components/BreadcrumbSchema.tsx
interface BreadcrumbItem {
    name: string;
    item: string;
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": items.map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.name,
                        "item": item.item,
                    })),
                }),
            }}
        />
    );
}
