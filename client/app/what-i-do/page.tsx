import Services from "@/app/pages/Services";
import SEOHead from "@/app/components/SEOHead";
import Head from "next/head";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

export default function Service() {
    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ProfessionalService",
                            "name": "S. Sundara Moorthy - Strategy & Growth Advisory",
                            "description": "Strategic growth planning, market strategy development, and global investment decisions.",
                            "url": "https://www.sundara-moorthy.com/what-i-do",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Chennai",
                                "addressCountry": "IN"
                            },
                            "sameAs": [
                                "https://www.linkedin.com/in/sundaramoorthy15/",
                                "https://x.com/sundara_sethu"
                            ]
                        })
                    }}
                />
            </Head>
            <BreadcrumbSchema
                items={[
                    { name: "Home", item: "https://www.sundara-moorthy.com/" },
                    { name: "What I Do", item: "https://www.sundara-moorthy.com/what-i-do" },
                ]}
            />
            <SEOHead page="whatido" />
            <Services/>
        </>
    )
}
