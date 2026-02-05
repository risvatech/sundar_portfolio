"use client";

import { Button } from "../ui/button";
import { ArrowRight, Mail, Calendar } from "lucide-react";

export function CTASection() {
    const handleScheduleClick = () => {
        // You can implement scheduling logic here
        // For example: open a modal, redirect to booking page, etc.
        console.log("Schedule call clicked");
    };

    const handleEmailClick = () => {
        window.location.href = "mailto:hello@sundar.com";
    };

    return (
        <section className="section-padding">
            <div className="container-narrow">
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-primary" />
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "20px 20px"
                        }}
                    />

                    <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
                            <Calendar size={16} />
                            Free 30-minute discovery call
                        </div>

                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 max-w-2xl mx-auto">
                            Ready to Transform Your Business?
                        </h2>

                        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                            Let&apos;s start with a conversation. Book your free discovery call and let&apos;s explore
                            how we can unlock your business potential together.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="xl"
                                className="bg-white text-primary hover:bg-white/90 rounded-2xl"
                                onClick={handleScheduleClick}
                            >
                                Let’s Talk Strategy
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="xl"
                                className="text-white hover:bg-white/10 border-2 border-white/30 rounded-2xl"
                                onClick={handleEmailClick}
                            >
                                <Mail className="mr-2" size={20} />
                                hello@sarahmitchell.com
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}