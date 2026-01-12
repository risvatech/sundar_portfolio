"use client";

interface TimelineItem {
    year: string;
    title: string;
    description: string;
}

const timelineItems: TimelineItem[] = [
    {
        year: "2009",
        title: "Started My Journey",
        description: "Began consulting for small businesses while completing my MBA at Harvard Business School.",
    },
    {
        year: "2012",
        title: "Founded Mitchell Consulting",
        description: "Launched my independent practice, focusing on startup growth and digital transformation.",
    },
    {
        year: "2016",
        title: "Expanded Globally",
        description: "Grew the practice to serve clients across North America, Europe, and Asia-Pacific.",
    },
    {
        year: "2020",
        title: "Published 'Growth Mindset'",
        description: "Authored my bestselling book on sustainable business growth strategies.",
    },
    {
        year: "2024",
        title: "200+ Businesses Transformed",
        description: "Reached a milestone of helping over 200 companies achieve their growth goals.",
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
                        15 Years of Excellence
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
                                        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                                            {item.title}
                                        </h3>
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