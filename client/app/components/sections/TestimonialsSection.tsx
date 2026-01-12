"use client";

import { Card, CardContent } from "../ui/card";
import { Quote } from "lucide-react";
import Image from "next/image";

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    image: string;
}

const testimonials: Testimonial[] = [
    {
        quote: "Sarah transformed our struggling startup into a profitable business in just 8 months. Her strategic insights were invaluable.",
        name: "Michael Chen",
        role: "CEO, TechFlow Solutions",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
        quote: "Working with Sarah was a game-changer. She helped us identify blind spots we never knew existed and create a clear path forward.",
        name: "Emily Rodriguez",
        role: "Founder, GreenLeaf Wellness",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
        quote: "The ROI on Sarah's consulting was incredible. Within a year, our revenue had doubled and our team was more aligned than ever.",
        name: "David Thompson",
        role: "Managing Director, Atlas Ventures",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
];

export function TestimonialsSection() {
    return (
        <section className="section-padding bg-secondary">
            <div className="container-wide">
                <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Client Stories
          </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                        What My Clients Say
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Real results from real partnerships. Here&apos;s what business leaders have to say about our work together.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            variant="elevated"
                            className="group hover:-translate-y-1 transition-all duration-300"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CardContent className="p-8">
                                <Quote className="w-10 h-10 text-primary/20 mb-6" />
                                <blockquote className="text-foreground leading-relaxed mb-8">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="rounded-full object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}