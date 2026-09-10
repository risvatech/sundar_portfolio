import {
    TrendingUp,
    Palette,
    Rocket,
    IndianRupee,
    LucideIcon,
    BarChart3,
    Truck,
} from "lucide-react";

export interface about {
    id: string;
    icon: LucideIcon;
    title: string;
    heading: string;
    description: string[];
}

export const abouts: about[] = [
    {
        id: "business-strategy",
        icon: TrendingUp,
        title: "Strategy & Growth Advisory",
        heading:
            "Experience supporting organisations with growth, diversification and strategic-priority decisions.",
        description: [
            "Growth and diversification strategy",
            "Market-entry and expansion planning",
            "Business-model validation",
            "Strategic roadmaps and prioritization",
            "Scale-up and transformation decision support",
        ],
    },

    {
        id: "brand-development",
        icon: Palette,
        title: "Design Thinking & Innovation",
        heading:
            "Applying structured and human-centred methods to understand customer needs, frame problems and validate solutions.",
        description: [
            "Problem framing before solution development",
            "Customer discovery and unmet-needs analysis",
            "Customer-journey mapping",
            "New product and service strategy",
            "Concept validation and workshops",
        ],
    },

    {
        id: "process-optimization",
        icon: BarChart3,
        title: "Market Research & Competitive Intelligence",
        heading:
            "Building evidence-based perspectives on markets, customers, competitors and emerging opportunities.",
        description: [
            "Market sizing and opportunity assessment",
            "Customer segmentation and buying behaviour",
            "Competitive intelligence and benchmarking",
            "Industry trends and white-space analysis",
            "Primary and secondary market research",
        ],
    },

    {
        id: "growth-consulting",
        icon: Rocket,
        title: "Go-to-Market & Feasibility",
        heading:
            "Evaluating market attractiveness, commercial viability and the most practical route to market.",
        description: [
            "Go-to-market and commercialization strategy",
            "Pricing, positioning and value proposition",
            "Techno-commercial feasibility studies",
            "Business cases and go/no-go assessment",
            "Market validation for investors and lenders",
        ],
    },

    {
        id: "supply-chain",
        icon: Truck,
        title: "Supply Chain & Strategic Sourcing",
        heading:
            "Aligning supplier ecosystems, sourcing decisions and supply-chain capabilities with business-growth requirements.",
        description: [
            "Supply-chain strategy aligned with growth",
            "Supplier and partner identification",
            "Vendor assessment and benchmarking",
            "Global sourcing and localization",
            "Make-versus-buy, cost and resilience assessment",
        ],
    },

    {
        id: "investment-board",
        icon: IndianRupee,
        title: "Investment & Strategic Decision Support",
        heading:
            "Supporting leadership teams with structured market, commercial and risk analysis for investment and expansion decisions.",
        description: [
            "Investment readiness and decision validation",
            "Commercial due diligence and market validation",
            "Capital-allocation and expansion assessment",
            "Risk and scenario analysis",
            "Evidence-based go/no-go decision support",
        ],
    },
];

export const getAboutById = (id: string) => {
    return abouts.find((a) => a.id === id);
};