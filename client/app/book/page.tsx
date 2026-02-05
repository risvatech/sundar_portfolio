"use client"

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { ArrowRight, Calendar, Clock, CheckCircle2, Users, Star, Target, Phone, Mail } from "lucide-react";
import BookConsultationForm from "../pages/BookConsultationForm";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "../components/ui/use-toast"; // Import your toast hook
import api from "../service/api";

// Type for the form data
interface ConsultationFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    businessType?: string;
    industry?: string;
    businessSize?: string;
    annualRevenue?: string;
    consultationType: string;
    preferredDate?: Date | string;
    preferredTime?: string;
    timezone?: string;
    projectDescription?: string;
    mainChallenges?: string;
    goals?: string;
    budgetRange?: string;
    timeline?: string;
    referralSource?: string;
    referralDetails?: string;
    additionalInfo?: string;
    hearAboutUs?: string;
}

// Type for API response
interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    errors?: string[];
}

export default function BookConsultationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formResetKey, setFormResetKey] = useState(0);
    const { toast } = useToast(); // Use your toast hook

    // Handle form submission
    const handleSubmitForm = async (formData: ConsultationFormData) => {
        setIsSubmitting(true);

        try {
            // Prepare data for API
            const apiData = {
                ...formData,
                preferredDate: formData.preferredDate
                    ? (formData.preferredDate instanceof Date
                        ? formData.preferredDate.toISOString()
                        : formData.preferredDate)
                    : undefined,
            };

            console.log('Submitting form data:', apiData); // Debug log

            const response = await api.post('/consultations', apiData);

            // Handle different response formats
            let result: ApiResponse;

            if (typeof response === 'object' && 'data' in response) {
                // Axios response format
                result = response.data as ApiResponse;
            } else {
                // Direct response format
                result = response as ApiResponse;
            }

            console.log('API Response:', result); // Debug log

            if (result.success) {
                // Show success toast
                toast({
                    title: "Success!",
                    description: result.message || 'Consultation request submitted successfully!',
                    variant: "default",
                    duration: 5000,
                });

                // Reset form by changing the key
                setFormResetKey(prev => prev + 1);

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Show success message in console for debugging
                console.log('Form submitted successfully:', result.data);
            } else {
                // Handle API errors
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach((err: string) => {
                        toast({
                            title: "Error",
                            description: err,
                            variant: "destructive",
                            duration: 5000,
                        });
                    });
                } else {
                    toast({
                        title: "Error",
                        description: result.message || 'Failed to submit consultation request',
                        variant: "destructive",
                        duration: 5000,
                    });
                }
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);

            // Handle network errors or server errors
            if (error.response) {
                // Server responded with error status
                const errorData = error.response.data || {};
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    errorData.errors.forEach((err: string) => {
                        toast({
                            title: "Error",
                            description: err,
                            variant: "destructive",
                            duration: 5000,
                        });
                    });
                } else if (errorData.message) {
                    toast({
                        title: "Error",
                        description: errorData.message,
                        variant: "destructive",
                        duration: 5000,
                    });
                } else {
                    toast({
                        title: "Server Error",
                        description: `Server error: ${error.response.status}`,
                        variant: "destructive",
                        duration: 5000,
                    });
                }
            } else if (error.request) {
                // Request was made but no response
                toast({
                    title: "Network Error",
                    description: 'Network error. Please check your connection and try again.',
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                // Other errors
                toast({
                    title: "Error",
                    description: error.message || 'Something went wrong. Please try again.',
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-warm-gradient">
                <div className="container-wide">
                    <div className="text-center">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-4">
                            Free Consultation
                        </span>
                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                            Let’s Have a Strategic Conversation
                            {/*<span className="text-primary">Business Together</span>*/}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            If you’re evaluating growth opportunities, entering a new market, or trying to solve a complex business challenge—and want clarity before committing time or capital—I’d be happy to help
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-foreground">30 Minutes</div>
                                <div className="text-sm text-muted-foreground">Free Discovery Call</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-foreground">No Commitment</div>
                                <div className="text-sm text-muted-foreground">Zero Pressure</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-foreground">250+ Businesses</div>
                                <div className="text-sm text-muted-foreground">Successfully Helped</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - Two Column Layout */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-2">
                            <BookConsultationForm
                                key={formResetKey} // This will force re-render and reset
                                onSubmit={handleSubmitForm}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        {/* Right Column - Benefits & Info */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-32 space-y-8">
                                {/* What to Expect Card */}
                                <div className="bg-card rounded-2xl p-6 shadow-soft">
                                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        What to Expect
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                A confidential discussion about your business
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                Strategic insights tailored to your situation
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                Clear next steps and action plan
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                No sales pitch - just valuable advice
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Why Choose Us Card */}
                                <div className="bg-card rounded-2xl p-6 shadow-soft">
                                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-primary" />
                                        Why Choose Sundar
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-primary font-semibold text-sm">18+</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">Years Experience</div>
                                                <div className="text-sm text-muted-foreground">Helping businesses grow</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Target className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">Strategic Approach</div>
                                                <div className="text-sm text-muted-foreground">Data-driven solutions</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-primary font-semibold text-sm">98%</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">Client Satisfaction</div>
                                                <div className="text-sm text-muted-foreground">Consistent results</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info Card */}
                                <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                                    <h3 className="font-serif text-xl font-semibold mb-4">
                                        Have Questions?
                                    </h3>
                                    <p className="text-primary-foreground/80 text-sm mb-4">
                                        Prefer to talk before booking? Reach out directly.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm"> <a
                                                href="mailto:sundaramoorthy.s15@gmail.com"
                                                className="text-lg hover:text-amber-400 transition-colors"
                                            >
                                        sundaramoorthy.s15@gmail.com
                                    </a> </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <a
                                                href="tel:+917020166785"
                                                className="text-sm hover:underline"
                                            >
                                                +91-7020166785
                                            </a>
                                        </div>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full mt-6"
                                        asChild
                                    >
                                        <Link href="/services">View My Services</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}