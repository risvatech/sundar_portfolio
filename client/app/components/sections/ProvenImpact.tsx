import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ProvenImpact() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center bg-primary rounded-3xl overflow-hidden shadow-elevated">
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
                        Results That Matter
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mb-4">
                        Proven Impact
                    </h2>
                    <p className="text-white/80 mb-8 text-lg leading-relaxed">
                        Our case studies highlight how strategic consulting creates real, measurable impact
                        that drives sustainable growth and transformation.
                    </p>

                    <ul className="space-y-5 mb-10">
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">120+</span>
                                <span className="text-white/90"> successful consulting projects across industries</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">30%</span>
                                <span className="text-white/90"> average efficiency improvement for clients</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-semibold text-white text-lg">98%</span>
                                <span className="text-white/90"> client satisfaction and retention rate</span>
                            </div>
                        </li>
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/services"
                            className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:border hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg text-center"
                        >
                            Explore All Case Studies
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link
                            href="/book"
                            className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
                        >
                            Schedule a Consultation
                        </Link>
                    </div>

                    {/* Trust indicator */}
                    <div className="mt-10 pt-8 border-t border-white/20">
                        <p className="text-white/70 text-sm">
                            Trusted by 50+ enterprises and growing startups across North America
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}