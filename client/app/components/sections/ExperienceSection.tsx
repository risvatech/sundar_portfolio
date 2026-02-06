import {
    Users,
    TrendingUp,
    Target,
    Lightbulb,
    Building2,
    GitBranch,
    CheckCircle2,
    HelpCircle,
    UserCheck, Brain, BicepsFlexed, ShieldPlus, ChartNoAxesCombined
} from 'lucide-react';

const ExperienceSection = () => {
    const experienceHighlights = [
        {
            icon: Target,
            text: "Led 250+ consulting and research engagements"
        },
        {
            icon: Users,
            text: "Worked closely with CXOs, founders, investors, and policy stakeholders"
        },
        {
            icon: TrendingUp,
            text: "Supported decisions related to growth, investment, sourcing, and transformation"
        },
        {
            icon: Building2,
            text: "Built and scaled consulting verticals and advisory practices"
        },
        {
            icon: Lightbulb,
            text: "Delivered projects across Healthcare, EV & Auto Components, Green Energy, Industrial Manufacturing, Agri Equipment, and E-commerce"
        },
        {
            icon: GitBranch,
            text: "Bridged boardroom strategy with on-ground execution realities"
        }
    ];

    return (
        <section className="w-full bg-white py-20 ">
            <div className="container-wide relative px-4">


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
                                className="relative rounded-xl border border-gray-200  p-6 transition-shadow hover:shadow-md"
                            >
                                <div className="absolute right-6 top-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <IconComponent className="h-6 w-6 text-[#0B1F32]" />
                                    </div>
                                </div>
                                <p className="pr-12 text-base leading-relaxed text-gray-700">
                                    {item.text}
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