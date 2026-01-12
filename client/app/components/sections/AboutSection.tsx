"use client";

import { Award, BookOpen, Users, Trophy } from "lucide-react";

interface Achievement {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const achievements: Achievement[] = [
    {
        icon: Trophy,
        title: "Forbes Top 50",
        description: "Business Consultants 2024",
    },
    {
        icon: BookOpen,
        title: "Bestselling Author",
        description: "'Growth Mindset' Book",
    },
    {
        icon: Users,
        title: "Speaker",
        description: "TEDx & Fortune 500 Events",
    },
    {
        icon: Award,
        title: "Certified",
        description: "McKinsey & Bain Alum",
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
                            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-6">
                                Building Businesses, <br />
                                <span className="text-primary">Empowering Leaders</span>
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    I&apos;m Sundar, and I believe every business has untapped potential waiting to be unlocked.
                                    After spending a decade at top consulting firms like McKinsey and Bain, I realized my true
                                    passion lay in working closely with entrepreneurs and growing companies.
                                </p>
                                <p>
                                    What drives me? Seeing that moment when a founder finally has clarity on their path forward.
                                    Watching a struggling team transform into a high-performing unit. Celebrating with clients
                                    when they hit milestones they once thought impossible.
                                </p>
                                <p>
                                    My approach blends rigorous strategic thinking with genuine human connection. Because at
                                    the end of the day, business is about people—and I&apos;m here to help you bring out the best
                                    in yours.
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
                                            <Icon className="w-6 h-6 text-primary" />
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
                    </div>
                </div>
            </section>
    );
}