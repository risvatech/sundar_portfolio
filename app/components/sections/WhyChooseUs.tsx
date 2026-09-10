import React from "react";
import { Award, BookOpen, Users, Trophy, LucideProps } from "lucide-react";

interface FeatureItem {
    title: string;
    desc: string;
    icon: React.ComponentType<LucideProps>;
}

const features: FeatureItem[] = [
    {
        title: "Focused Tailored Consulting",
        desc: "Strategies uniquely crafted for your financial and operational needs.",
        icon: Award,
    },
    {
        title: "Data-Driven Decisions",
        desc: "Clear recommendations powered by accurate and reliable data.",
        icon: BookOpen,
    },
    {
        title: "Long-Term Advisory",
        desc: "Ongoing support to drive sustainable and future-ready growth.",
        icon: Trophy,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 px-6 bg-primary">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Why Clients Choose Us
                </h2>
                <p className="text-white max-w-3xl mx-auto mb-12">
                    We deliver clarity, strategy, and measurable results—helping businesses grow with confidence.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={i}
                                className="rounded-xl p-8 hover:shadow-lg transition-all duration-300 text-center bg-secondary/70 hover:bg-primary"
                            >
                                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-accent text-2xl mb-6">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                                <p className="text-white/90">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}