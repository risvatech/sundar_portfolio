import {
    TrendingUp,
    Palette,
    Settings,
    Rocket,
    Monitor,
    Users,
    LucideIcon, BarChart3, Truck
} from "lucide-react";

export interface about {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string[];

}

export const abouts: about[] = [
    {
        id: "business-strategy",
        icon: TrendingUp, // 📈 Growth, strategy, scale
        title: "Strategy & Growth Advisory for MSMEs & Startups",
        description: [
            "Growth strategy for startups and MSMEs",
            "Market entry and expansion planning",
            "Business model validation and refinement",
            "Strategic roadmap and prioritization for founders",
            "Advisory support for scale-up and diversification decisions",
        ],
    },
    {
        id: "brand-development",
        icon: Palette, // 🎨 Design thinking, creativity
        title: "Design Thinking for Startups & Entrepreneurial Teams",
        description: [
            "Problem framing before solution building",
            "Customer discovery and unmet-need identification",
            "Customer journey mapping for products and services",
            "Design thinking workshops for founders and leadership teams",
            "Translating customer insights into scalable business strategy",
        ],
    },
    {
        id: "process-optimization",
        icon: BarChart3, // 📊 Research, insights, intelligence
        title: "Market Research & Competitive Intelligence",
        description: [
            "Market sizing and opportunity assessment (TAM–SAM–SOM)",
            "Customer segmentation and buying behavior analysis",
            "Competitive benchmarking for startups and MSMEs",
            "Industry trend analysis and white-space opportunities",
            "Primary and secondary market research for decision-making"
        ],
    },
    {
        id: "growth-consulting",
        icon: Rocket, // 🚀 Go-to-market, launch
        title: "Go-to-Market & Feasibility Advisory",
        description: [
            "Go-to-market (GTM) strategy for startups and MSMEs",
            "Pricing, positioning, and value proposition strategy",
            "Techno-commercial feasibility studies",
            "Business case and go / no-go decision support",
            "Market validation for investors and lenders"
        ],
    },
    {
        id: "digital-transformation",
        icon: Truck, // 🚚 Supply chain, logistics, procurement
        title: "Supply Chain & Procurement Consulting for MSMEs",
        description: [
            "Supply chain strategy aligned to business growth",
            "Supplier identification and vendor benchmarking",
            "Global sourcing and localization strategy",
            "Cost optimization and make-vs-buy decisions",
            "Procurement risk assessment and resilience planning"
        ],
    },
];


export const getAboutById = (id: string) => {
    return abouts.find(a => a.id === id);
};
