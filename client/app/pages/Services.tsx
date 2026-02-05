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
        </Layout>
    );
};

export default Services;