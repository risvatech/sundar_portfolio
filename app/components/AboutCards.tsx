"use client";

import { abouts } from "@/app/data/abouts";

export function AboutCards() {
    return (
        <section className="section-padding">
            <div className="container-wide">
                {/* Section Heading */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        What I Do
                    </h2>

                    <h4 className="text-xl font-semibold text-foreground mt-3">
                        Strategy, Market Intelligence & Advisory Expertise
                    </h4>

                    <p className="text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
                        Across my professional career, I have worked with founders,
                        promoters, CXOs, investors and institutions to bring
                        structure, clarity and evidence to complex growth,
                        market-entry, investment and transformation decisions.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {abouts.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.id}
                                className="group bg-card rounded-2xl border border-border p-6 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-foreground leading-snug mb-3">
                                    {item.title}
                                </h3>

                                {/* Heading */}
                                <p className="text-base text-muted-foreground leading-relaxed mb-5">
                                    {item.heading}
                                </p>

                                {/* Description */}
                                <ul className="space-y-3">
                                    {item.description.map((point, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 text-muted-foreground leading-relaxed"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
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