"use client";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { services } from "../data/services";
import ProvenImpact from "@/app/components/sections/ProvenImpact";
import {AboutCards} from "@/app/components/AboutCards";

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

            <AboutCards />

        </Layout>
    );
};

export default Services;