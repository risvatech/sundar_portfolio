import {
    Users,
    TrendingUp,
    Target,
    Lightbulb,
    Building2,
    GitBranch,
    CheckCircle2,
    HelpCircle,
    UserCheck,
    Brain,
    BicepsFlexed,
    ShieldPlus,
    ChartNoAxesCombined
} from 'lucide-react';

const ExperienceSection = () => {
    const experienceHighlights = [
        {
            icon: Target,
            title: "250+ Strategy & Research Engagements",
            description: "Strategy, market research, feasibility, and sourcing projects"
        },
        {
            icon: UserCheck,
            title: "Founder & CXO Advisor",
            description: "Worked closely with startup founders, MSME promoters, and senior leaders"
        },
        {
            icon: TrendingUp,
            title: "Growth & Investment Decisions",
            description: "Supported market entry, expansion, investment, and procurement decisions"
        },
        {
            icon: Building2,
            title: "Built & Scaled Advisory Practices",
            description: "Set up and scaled consulting and advisory teams"
        },
        {
            icon: ShieldPlus,
            title: "Multi-Sector Experience",
            description: "Healthcare, EV & Auto, Green Energy, Manufacturing, Agri, and E-commerce"
        },
        {
            icon: GitBranch,
            title: "Strategy to Execution",
            description: "Turned strategy into practical, on-ground action"
        }
    ];

    return (
        <section className="w-full bg-white py-20 ">
            <div className=" relative px-6">
                {/* Section Header */}
                <div className="mb-16 max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Experience
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-gray-600">
                        With over <span className="font-semibold text-gray-900">18 years</span> in strategy,
                        market research, and advisory roles, I help organizations make
                        confident decisions in complex and high-stakes environments.
                    </p>
                </div>

                {/* Experience Highlights with Icons */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {experienceHighlights.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={index}
                                className="relative rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                            >
                                <div className="absolute right-6 top-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <IconComponent className="h-6 w-6 text-[#0B1F32]" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="pr-16 text-lg font-semibold text-gray-900 mb-3">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-base leading-relaxed text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default ExperienceSection;