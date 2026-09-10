"use client";

import {
    Award,
    BookOpen,
    Users,
    Trophy,
    CheckCircle2,
    ChartNoAxesCombined,
    UserCheck,
    ShieldPlus,
    GitBranch, Compass
} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";
import {Button} from "@/app/components/ui/button";
import Link from "next/link";
import {services} from "@/app/data/services";

interface Achievement {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const achievements: Achievement[] = [
    {
        icon: Trophy,
        title: "IIM Alumnus",
        description: "PGCSMP, IIM Trichy",
    },
    {
        icon: BookOpen,
        title: "Board Governance" +
            "Member - Independent Directors Databank",
        description: "Governance & Board Advisory",
    },
    {
        icon: Users,
        title: "Speaker",
        description: "Industry Speaker" +
            "Conferences, Panels & Business Forums",
    },
    {
        icon: Award,
        title: "Guest Lecturer",
        description: "Strategy, Consulting & Design Thinking",
    },
];

export function AboutSection() {

    return (
            <section className="container-wide pt-32 pb-16 ">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Story */}
                        <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About Me
            </span>
                            <h3 className="font-serif text-3xl sm:text-4xl text-foreground mb-6">
                                Strategy & Growth Advisor
                            </h3>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    I am a Strategy & Growth Advisor with 18+ years of experience across business strategy, market research, growth advisory and design-led problem solving. I currently lead Market Research & Advisory at Kepler Consulting and support the development of Kepler Ventures in India.
                                </p>
                                <p>
                                    Across my career, I have worked with leadership teams, investors and institutions on market entry, business growth, product strategy, feasibility and investment decisions across India and international markets.
                                </p>
                                <p>
                                    My approach combines analytical depth, market intelligence and human-centred thinking. I look beyond what the data says to understand the underlying business problem, commercial context and execution realities.
                                </p>
                                <p>
                                    The result is insight-led, practical and execution-ready strategy.
                                </p>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="grid grid-cols-2 gap-6">
                            {achievements.map((achievement, index) => {
                                const Icon = achievement.icon;

                                return (
                                    <div
                                        key={index}
                                        className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-accent" />
                                        </div>

                                        <h3
                                            className={`font-serif font-semibold text-foreground mb-1 ${
                                                index === 1 ? "text-lg leading-5" : "text-xl"
                                            }`}
                                        >
                                            {achievement.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {achievement.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <Button variant="secondary" size="sm">
                                <Link href="/portfolio">View My Portfolio</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <section className="section-padding">
                    <div className="container-wide">
                        <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
                            Areas of Expertise
                        </h2>
                        <p className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                            My professional experience spans market intelligence, growth strategy, feasibility assessment, design thinking, strategic decision support and executive knowledge sharing.
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <Card
                                    key={service.id}
                                    variant="warm"
                                    className="group hover:-translate-y-1 transition-all duration-300"
                                >
                                    <CardHeader>
                                        <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                                            <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                                        </div>
                                        <CardTitle className="text-xl">{service.title}</CardTitle>
                                        <CardDescription className="text-base">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        {/*<Link href={`/services/${service.id}`}>*/}
                                        {/*    <Button variant="outline" className="w-full mt-6">*/}
                                        {/*        Learn More*/}
                                        {/*        <ArrowRight className="ml-2" size={16} />*/}
                                        {/*    </Button>*/}
                                        {/*</Link>*/}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="my-20 h-px w-full bg-gray-200"/>

                {/* Three Column Grid with Dark Background */}
                <section className="container-wide grid gap-6 lg:grid-cols-3">

                    {/* Strengths Card */}
                    <div className="group flex flex-col rounded-2xl bg-[#2E5C8A] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <ShieldPlus className="h-6 w-6 text-white"/>
                        </div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            PROFESSIONAL STRENGTHS
                        </p>
                        <h3 className="mb-6 text-xl font-bold text-white/60">
                            What I Bring to Advisory Engagements
                        </h3>

                        <ul className="flex-1 space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Clarity in complexity—structuring ambiguous business problems</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Evidence-led thinking—combining data, market insight and judgement </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Human-centred problem solving—defining the right problem before developing solutions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Practical strategy—grounded in market conditions and execution realities </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Collaborative leadership—working closely with senior stakeholders and multidisciplinary teams</span>
                            </li>
                        </ul>
                    </div>

                    {/* Engagement Context Card */}
                    <div className="group flex flex-col rounded-2xl bg-[#2E5C8A] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <Compass  className="h-6 w-6 text-white"/>
                        </div>

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            STRATEGIC CONTEXT
                        </p>
                        <h3 className="mb-6 text-xl font-bold text-white/60">
                            Situations I Have Supported
                        </h3>

                        <ul className="flex-1 space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Market opportunities or strategic priorities are unclear </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">The commercial or investment risk of a decision is significant </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Leadership teams require structured, evidence-based perspectives </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Expansion, diversification or market-entry options need evaluation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Multiple viewpoints must be translated into a clear decision roadmap</span>
                            </li>
                        </ul>
                    </div>

                    {/* Collaboration Card */}
                    <div className="group flex flex-col rounded-2xl bg-[#2E5C8A] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <UserCheck className="h-6 w-6 text-white" />
                        </div>


                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                            STAKEHOLDER EXPERIENCE
                        </p>
                        <h3 className="mb-6 text-xl font-bold text-white/60">
                            Leadership Teams I Have Worked With
                        </h3>

                        <ul className="flex-1 space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Founders and promoters evaluating growth and diversification</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">CXOs leading market entry, transformation or portfolio decisions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Business and functional leaders requiring market and customer intelligence</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Investors and institutions assessing feasibility and commercial potential</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"></span>
                                <span className="leading-relaxed">Consulting teams requiring research, analysis and execution support</span>
                            </li>
                        </ul>
                    </div>

                </section>

            </section>

    );
}