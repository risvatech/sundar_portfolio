"use client";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { services } from "../data/services";
import ProvenImpact from "@/app/components/sections/ProvenImpact";

interface CaseStudy {
    company: string;
    industry: string;
    before: string;
    after: string;
    timeframe: string;
}

const caseStudies: CaseStudy[] = [
    {
        company: "TechFlow Solutions",
        industry: "SaaS",
        before: "$500K ARR",
        after: "$2.5M ARR",
        timeframe: "12 months",
    },
    {
        company: "GreenLeaf Wellness",
        industry: "Health & Wellness",
        before: "3 locations",
        after: "12 locations",
        timeframe: "18 months",
    },
    {
        company: "Atlas Ventures",
        industry: "Investment",
        before: "$10M AUM",
        after: "$45M AUM",
        timeframe: "24 months",
    },
];



const Services = () => {
    return (
        <Layout>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-warm-gradient">
                <div className="container-wide text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-4">
            Services
          </span>
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                        How I Can Help You{" "}
                        <span className="text-primary">Grow</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Every business is unique. I offer a range of consulting services designed to
                        meet you where you are and take you where you want to be.
                    </p>
                    <Button variant="hero" size="xl">
                       <Link href="/book"> Book a Free Consultation</Link>
                        <ArrowRight className="ml-2" size={20} />
                    </Button>
                </div>
            </section>

            <ProvenImpact/>

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

            {/* Case Studies */}
            {/*<section className="section-padding bg-secondary">*/}
            {/*    <div className="container-wide">*/}
            {/*        <div className="text-center mb-16">*/}
            {/*/!*<span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-foreground text-sm font-medium mb-4">*!/*/}
            {/*/!*  Results*!/*/}
            {/*/!*</span>*!/*/}
            {/*            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">*/}
            {/*                Case Studies*/}
            {/*            </h2>*/}
            {/*            <p className="text-muted-foreground max-w-2xl mx-auto">*/}
            {/*                Here&apos;s a glimpse of the impact we&apos;ve achieved together with some of my clients.*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        /!*<div className="grid md:grid-cols-3 gap-8">*!/*/}
            {/*        /!*    {caseStudies.map((study, index) => (*!/*/}
            {/*        /!*        <Card key={index} variant="elevated" className="overflow-hidden transition-all duration-300 hover:shadow-medium">*!/*/}
            {/*        /!*            <CardContent className="p-8">*!/*/}
            {/*        /!*                <div className="inline-block px-3 py-1 rounded-lg bg-primary-light text-primary text-xs font-medium mb-4">*!/*/}
            {/*        /!*                    {study.industry}*!/*/}
            {/*        /!*                </div>*!/*/}
            {/*        /!*                <h3 className="font-serif text-xl font-semibold text-foreground mb-6">*!/*/}
            {/*        /!*                    {study.company}*!/*/}
            {/*        /!*                </h3>*!/*/}
            {/*        /!*                <div className="flex items-center gap-4 mb-2">*!/*/}
            {/*        /!*                    <div className="flex-1">*!/*/}
            {/*        /!*                        <div className="text-sm text-muted-foreground mb-1">Before</div>*!/*/}
            {/*        /!*                        <div className="text-lg font-semibold text-foreground">{study.before}</div>*!/*/}
            {/*        /!*                    </div>*!/*/}
            {/*        /!*                    <ArrowRight className="text-primary flex-shrink-0" />*!/*/}
            {/*        /!*                    <div className="flex-1">*!/*/}
            {/*        /!*                        <div className="text-sm text-muted-foreground mb-1">After</div>*!/*/}
            {/*        /!*                        <div className="text-lg font-semibold text-primary">{study.after}</div>*!/*/}
            {/*        /!*                    </div>*!/*/}
            {/*        /!*                </div>*!/*/}
            {/*        /!*                <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">*!/*/}
            {/*        /!*                    Achieved in {study.timeframe}*!/*/}
            {/*        /!*                </div>*!/*/}
            {/*        /!*            </CardContent>*!/*/}
            {/*        /!*        </Card>*!/*/}
            {/*        /!*    ))}*!/*/}
            {/*        /!*</div>*!/*/}
            {/*    </div>*/}
            {/*</section>*/}

            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container-narrow text-center">
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
                        Ready to Achieve Similar Results?
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                        Leverage 18+ years of proven expertise to drive measurable impact in your organization.
                        Let's discuss how we can achieve outstanding results together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" variant="secondary" className="px-8">
                                Book Strategy Session
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button size="lg" variant="outline" className="px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                View Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


        </Layout>
    );
};

export default Services;