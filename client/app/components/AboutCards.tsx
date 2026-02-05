"use client";

import { abouts } from "../../app/data/abouts";

export function AboutCards() {
    return (
        <section className="section-padding bg-background">
            <div className="container-wide">
                <div className="mb-12 text-center">
                    <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                        What I Do
                    </h2>
                    <div>
                        <h4 className={"font-bold mt-3"}>
                            How I Help MSMEs & Startups Grow with Clarity
                        </h4>
                    </div>

                    <p className="text-muted-foreground mt-3">
                        I work closely with startup founders, MSME promoters, and leadership teams to bring structure, clarity, and confidence to growth and scale-up decisions—especially when resources are limited and decisions matter most.

                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {abouts.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.id}
                                className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>

                                <h3 className="font-serif text-lg font-semibold mb-2">
                                    {item.title}
                                </h3>
                                <ul className="space-y-2">
                                    {item.description.map((point, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
