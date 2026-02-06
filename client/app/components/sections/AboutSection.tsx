"use client";

import {Award, BookOpen, Users, Trophy, CheckCircle2, ChartNoAxesCombined, UserCheck, ShieldPlus} from "lucide-react";
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
        title: "IIM - MBA",
        description: "Masters in Business Administration from IIM Pune (2006-2008)",
    },
    {
        icon: BookOpen,
        title: "Panelist",
        description: "Smart Healthcare India Summit 2015",
    },
    {
        icon: Users,
        title: "Speaker",
        description: "Conference on Medical Textiles by ITTA 2015",
    },
    {
        icon: Award,
        title: "Expertise",
        description: "Market Research & Sourcing strategies",
    },
];

export function AboutSection() {

    return (
            <section className="section-padding bg-warm-gradient ">
                <div className="container-wide">
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
                                    I am a Strategy & Growth Advisor with 18+ years of experience, working at the intersection of business strategy, market research, and design thinking.
                                </p>
                                <p>
                                    I partner with leadership teams to bring clarity when decisions are high-stakes—whether it’s entering a new market, scaling a business, launching a product, or validating an investment. My work spans India, Europe, the US, and Southeast Asia, across startups, MSMEs, large enterprises, and institutions..
                                </p>
                                <p>
                                    What defines my approach is the ability to blend analytical depth with human-centered thinking. I don’t just ask “What does the data say?”—I focus equally on “What problem are we really trying to solve?”
                                </p>
                                <p>
                                    The result: strategies that are insight-led, practical, and execution-ready
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
                                        <h3 className="font-serif font-semibold text-foreground mb-1">
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
                <div className="grid gap-6 lg:grid-cols-3 px-10">

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

            </section>

    );
}