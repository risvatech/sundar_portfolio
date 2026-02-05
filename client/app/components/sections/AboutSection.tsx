"use client";

import {Award, BookOpen, Users, Trophy, CheckCircle2} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";
import {Button} from "@/app/components/ui/button";
import Link from "next/link";

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
            <section className="section-padding bg-warm-gradient">
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
                                <Link href="/services">View My Services</Link>
                            </Button>
                        </div>
                    </div>
                </div>

            </section>

    );
}