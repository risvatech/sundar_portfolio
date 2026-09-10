"use client";

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServiceById, services } from "../data/services";

interface ServiceDetailProps {
    params: {
        id: string;
    };
}

interface ProcessStep {
    step: string;
    description: string;
}

const ServiceDetail = ({ params }: ServiceDetailProps) => {
    const router = useRouter();
    const service = getServiceById(params.id);

    if (!service) {
        return (
            <Layout>
                <section className="pt-32 pb-16">
                    <div className="container-narrow text-center">
                        <h1 className="font-serif text-4xl font-semibold text-foreground mb-4">
                            Service Not Found
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The service you&apos;re looking for doesn&apos;t exist.
                        </p>
                        <Button variant="hero" onClick={() => router.push("/services")}>
                            <ArrowLeft className="mr-2" size={16} />
                            Back to Services
                        </Button>
                    </div>
                </section>
            </Layout>
        );
    }

    const Icon = service.icon;
    const otherServices = services.filter(s => s.id !== service.id).slice(0, 3);

    return (
        <Layout>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-warm-gradient">
                <div className="container-wide">
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-2"
                        onClick={() => router.push("/services")}
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Back to Services
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>

                            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
                                {service.title}
                            </h1>

                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                {service.longDescription}
                            </p>

                            <div className="flex flex-wrap gap-3 mb-8">
                                {service.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded-xl bg-card text-sm font-medium text-foreground border shadow-sm"
                                    >
                    {feature}
                  </span>
                                ))}
                            </div>

                            <Button variant="hero" size="xl">
                                <Calendar className="mr-2" size={20} />
                                <Link href="/contact">Book a Consultation</Link>
                            </Button>
                        </div>

                        <div className="rounded-3xl overflow-hidden shadow-elevated">
                            <div className="relative w-full h-80 lg:h-[450px]">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits & Process */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Benefits */}
                        <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-4">
                Benefits
              </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">
                                What You&apos;ll Gain
                            </h2>
                            <div className="space-y-4">
                                {service.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed pt-1">
                                            {benefit}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Process */}
                        <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-foreground text-sm font-medium mb-4">
                Process
              </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">
                                How We Work Together
                            </h2>
                            <div className="space-y-6">
                                {service.process.map((step: ProcessStep, index: number) => (
                                    <div key={index} className="relative pl-12">
                                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        {index < service.process.length - 1 && (
                                            <div className="absolute left-4 top-8 w-px h-full bg-border -translate-x-1/2" />
                                        )}
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {step.step}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Services */}
            <section className="section-padding bg-secondary">
                <div className="container-wide">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                            Explore Other Services
                        </h2>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Each service can work independently or as part of a comprehensive transformation program.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {otherServices.map((otherService) => {
                            const OtherIcon = otherService.icon;
                            return (
                                <Link key={otherService.id} href={`/services/${otherService.id}`}>
                                    <Card variant="warm" className="h-full hover:-translate-y-1 group transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                                <OtherIcon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                            </div>
                                            <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {otherService.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {otherService.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-narrow">
                    <Card className="bg-primary text-primary-foreground overflow-hidden">
                        <CardContent className="p-8 sm:p-12 text-center">
                            <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-4">
                                Ready to Get Started with {service.title}?
                            </h2>
                            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
                                Book a free 30-minute discovery call to discuss your challenges and how we might work together.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="secondary" size="xl">
                                    <Calendar className="mr-2" size={20} />
                                    Schedule Your Call
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                    Download Service Guide
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </Layout>
    );
};

export default ServiceDetail;