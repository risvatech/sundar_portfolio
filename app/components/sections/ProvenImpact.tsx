import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ProvenImpact() {
    return (
        <section className="px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center bg-[#2E5C8A] rounded-3xl overflow-hidden shadow-elevated">
                {/* Left Image */}
                <div className="relative h-full min-h-[400px] md:min-h-[500px]">
                    <Image
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
                        alt="Consulting meeting with team discussing strategy"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent md:hidden" />
                </div>

                {/* Right Content */}
                <div className="p-8 md:p-10 lg:p-12 text-white">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                        EXPERIENCE AT A GLANCE
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mb-4">
                        Advisory Experience
                    </h2>
                    <p className="text-white/80 mb-3 text-lg leading-relaxed">
                        Across my career, I have supported leadership teams with market intelligence, strategic analysis and practical decision frameworks for growth, market entry, investment and transformation.
                    </p>
                    <ul className="space-y-5 mb-10">
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">18+ years</span>
                                <span className="text-white/90"> across strategy, research and advisory </span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">250+</span>
                                <span className="text-white/90"> strategy and market-research engagements</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">15+ sectors</span>
                                <span className="text-white/90">  across healthcare, mobility, industrial, energy and consumer markets</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">25+ global markets</span>
                                <span className="text-white/90">  across India and international regions</span>
                            </div>
                        </li>
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:border hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg text-center"
                        >
                            Explore Experience
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
                        >
                            Contact
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}