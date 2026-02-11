"use client";
import { ExternalLink } from 'lucide-react';


interface TimelineItem {
    year: string;
    title: string;
    tag: string;
    description: string;
    link?:string;
}

const timelineItems: TimelineItem[] = [
    {
        year: "Dec 2022 – till date ",
        title: "Head - Strategy & Advisory Services",
        tag: "Kepler Consulting, Chennai",
        description: "Responsible for smooth running of independent market research & \n" +
            "sourcing assignments  \n" +
            "Cross functional collaboration with Innovation, Operations and Sourcing & \n" +
            "Procurement consulting teams for their internal market research \n" +
            "requirements ",
        link: "https://www.kepler-consulting.com/",
    },
    {
        year: "Jul 2019 – Dec 2022 ",
        tag: "",
        title: " Asst Vice President-Business Advisory Services \n" +
            "MITCON Consultancy & Engineering Services \n" +
            "Limited",
        description: "Business & Technology Consulting and Sales Transformation strategist \n" +
            "Responsible for P&L for Business Advisory Services Department \n" +
            "Driving key account management and business development activities ",
    },
    {
        year: "April 2013 – Jun 2019",
        tag: "",
        title: " Senior Manager – Projects & Head- Healthcare \n" +
            "Consulting Division, BDB India Private Limited ",
        description: "Responsible for B2B Business Consulting & Market Research Division \n" +
            "Heading the “Knowledge Center” which develop periodic industry analysis \n" +
            "& reports ",
    },
    {
        year: "2010 - 2013",
        tag: "",
        title: "Regional Leadership - South India",
        description: "Established regional operations and expanded advisory footprint across industrial and B2B sectors",
    },

    {
        year:"2007 – 2010",
        tag: "",
        title: "Business Development & Institutional Sales",
        description: "Built foundational experience in market development, stakeholder engagement and consultative selling.",
    },
];

export function TimelineSection() {
    return (
        <section className="section-padding">
            <div className="container-wide">
                <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-4">
            My Journey
          </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                        18+ Years of Excellence
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From corporate strategy to helping entrepreneurs build their dreams, here&apos;s my story.
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
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
                                    <div className={`flex-1 pl-20 md:pl-0 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                                        <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold mb-2">
                                            {item.year}
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="leading-relaxed">{item.tag}</p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>

                                    </div>

                                    {/* Dot */}
                                    <div
                                        className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-soft"
                                    />

                                    {/* Spacer for opposite side */}
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