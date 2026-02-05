"use client";

import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import img from "../../../public/sundara-moorthy2.jpeg"
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary-light/30" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div
                className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "2s" }}
            />

            <div className="container-wide relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                            18+ Years of Business Excellence
                        </div>

                        <h1
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                        >
                            Transforming Visions into{" "}
                            <span className="text-primary">Thriving Businesses</span>
                        </h1>

                        <p
                            className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in"
                            style={{ animationDelay: "0.2s" }}
                        >

                            As a Business Consultant & Market Strategy Leader, I support organizations in identifying growth opportunities, improving competitiveness, and making strategic investment decisions. Over 18 years, I’ve led 250+ assignments across multiple geographies, helping global enterprises answer their most critical questions:
                        </p>
                            <div className="strategy-section">
                                <ol className="dot-list text-muted-foreground">
                                    <li>Where to play?</li>
                                    <li>How to win?</li>
                                    <li>What to build next?</li>
                                    <li>How to scale profitably?</li>
                                </ol>
                                <p className="expertise-text pb-2 text-muted-foreground">
                                    My core expertise includes market entry strategy, GTM planning, competitive intelligence, feasibility studies, sourcing strategy, and CXO decision support across Healthcare, EVs, Industrial Equipment, and emerging technologies.
                                </p>
                            </div>


                        <div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <Button variant="secondary" size="sm">
                               <Link href="/services">View My Services</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Portrait */}
                    <div
                        className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <div className="relative">
                            {/* Decorative ring */}
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />

                            {/* Image container */}
                            <div className="relative w-80 sm:w-[420px] lg:w-[520px] aspect-[16/9] rounded-3xl overflow-hidden shadow-medium">
                                <Image
                                    src={img}
                                    alt="Sundar - Business Consultant"
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}