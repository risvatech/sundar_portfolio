"use client";

import { ExternalLink } from "lucide-react";

interface TimelineItem {
    year: string;
    title: string;
    tag: string;
    description: string;
    link?: string;
}

const timelineItems: TimelineItem[] = [
    {
        year: "Dec 2022 - Present",
        title: "Head - Strategy & Advisory Services",
        tag: "Kepler Consulting, Chennai",
        description:
            "Lead market research, strategic advisory and business-development initiatives across India and international markets. Work closely with Kepler's consulting practices to support market intelligence, growth strategy, market entry, sourcing and client decision-making requirements.\n\nContribute to the development of Kepler Ventures and its India market-entry and strategic advisory capabilities.",
        link: "https://www.kepler-consulting.com/",
    },
    {
        year: "Jul 2019 – Dec 2022",
        tag: "",
        title:
            "Asst Vice President-Business Advisory Services\nMITCON Consultancy & Engineering Services\nLimited",
        description:
            "Led the Business Advisory Services function with responsibility for P&L, client development and consulting delivery. Supported organizations through business strategy, techno-commercial feasibility, growth planning, sales transformation and market expansion initiatives.",
    },
    {
        year: "April 2013 – Jun 2019",
        tag: "",
        title:
            "Senior Manager – Projects & Head- Healthcare\nConsulting Division, BDB India Private Limited",
        description:
            "Built and led consulting capabilities across healthcare, MedTech and industrial sectors. Managed market research, growth strategy, customer intelligence and feasibility engagements while developing the Healthcare Consulting Division into a significant revenue-generating practice.",
    },
    {
        year: "2010 - 2013",
        tag: "",
        title: "Regional Leadership - South India",
        description:
            "Established and expanded the company’s advisory presence across South India, with responsibility for regional P&L, client relationships, business development and consulting engagements across industrial and B2B sectors.",
    },
    {
        year: "2007 – 2010",
        tag: "",
        title: "Business Development & Institutional Sales",
        description:
            "Built foundational experience in market development, stakeholder engagement and consultative selling.",
    },
];

export function TimelineSection() {
    return (
        <section className="section-padding">
            <div className="container-wide">
                <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-4">
            My Professional Journey
          </span>

                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                        18+ Years of Strategy, Research & Advisory Leadership
                    </h2>

                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A career spanning market research, business advisory, growth
                        strategy, practice building and commercial leadership across Indian
                        and international markets.
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

                    <div className="space-y-12">
                        {timelineItems.map((item, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`relative flex items-start gap-8 ${
                                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                                >
                                    {/* Content */}
                                    <div
                                        className={`flex-1 pl-20 md:pl-0 ${
                                            isEven ? "md:pr-16 md:text-right" : "md:pl-16"
                                        }`}
                                    >
                                        <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold mb-2">
                                            {item.year}
                                        </div>

                                        <h3 className="font-serif text-xl font-bold text-foreground mb-2 whitespace-pre-line">
                                            {item.title}
                                        </h3>

                                        {item.tag &&
                                            (item.link ? (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 mb-3 text-primary hover:underline font-medium"
                                                >
                                                    {item.tag}
                                                    <ExternalLink size={16} />
                                                </a>
                                            ) : (
                                                <p className="leading-relaxed mb-3">{item.tag}</p>
                                            ))}

                                        {/* Description */}
                                        {index === 0 ? (
                                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                                {item.description
                                                    .split("\n\n")
                                                    .map((paragraph, i) => (
                                                        <p key={i}>{paragraph}</p>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-soft" />

                                    {/* Spacer */}
                                    <div className="hidden md:block flex-1" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}