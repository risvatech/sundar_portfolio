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

                {/* Divider */}
                <div className="my-20 h-px w-full bg-gray-200"/>

                {/* Three Column Grid with Dark Background */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Strengths Card */}
                    <div className="group flex flex-col rounded-2xl bg-[#2E5C8A] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <ShieldPlus className="h-6 w-6 text-white"/>
                        </div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            Strengths
                        </p>
                        <h3 className="mb-6 text-xl font-bold text-white/60">
                            What Clients Value
                        </h3>

                        <ul className="flex-1 space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Clarity over complexity – simplifying ambiguous problems</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Design-led thinking – solving the right problem before scaling solutions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Structured decision-making – especially when data is imperfect</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Practical strategies – grounded in market and execution realities</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Trusted advisor mindset – not just a report-driven consultant</span>
                            </li>
                        </ul>
                    </div>

                    {/* Engagement Context Card */}
                    <div className="group flex flex-col rounded-2xl bg-[#2E5C8A] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                           <ChartNoAxesCombined className="h-6 w-6 text-white"/>
                        </div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            Engagement Context
                        </p>
                        <h3 className="mb-6 text-xl font-bold text-white/60">
                            Clients Often Engage Me When
                        </h3>

                        <ul className="flex-1 space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">The problem is unclear</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">The risk of wrong decisions is high</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">They need a thinking partner, not more slides</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">When the project is "stuck in a loop," characterized by repeated debates, circular arguments, or analysis paralysis, and they need a structured process to break through to a clear, actionable path.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Collaboration Card */}
                    <div className="group flex flex-col rounded-2xl bg-[#2E5C8A] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <UserCheck className="h-6 w-6 text-white" />
                        </div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            Collaboration
                        </p>
                        <h3 className="mb-6 text-xl font-bold text-white/60">
                            Who I Work Best With
                        </h3>

                        <ul className="flex-1 space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Startup founders seeking structured growth</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">MSME leaders moving beyond intuition-led decisions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">CXOs navigating expansion, transformation, or diversification</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Investors and institutions requiring market or feasibility validation</span>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default ExperienceSection;