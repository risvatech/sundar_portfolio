"use client"

import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Calendar, Clock, CheckCircle2, Users, Phone, Mail, MessageCircle } from "lucide-react";
import BookConsultationForm, { ConsultationFormData } from "../pages/BookConsultationForm";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "@/app/hooks/use-toast";
import api from "../service/api";
import SEOHead from "@/app/components/SEOHead";
import Image from "next/image";
import img2 from "../../public/IMG-20260205-WA0011.jpg";
import bg from "../../public/assets/6975302_23833.jpg";
import { Linkedin, Facebook, Twitter } from "lucide-react";
import { useContacts } from "@/app/context/ContactContext";

// Add error type definitions
interface ApiError {
    response?: {
        data?: {
            errors?: string[];
            message?: string;
        };
        status?: number;
    };
    request?: any;
    message?: string;
}

export default function BookConsultationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formResetKey, setFormResetKey] = useState(0);
    const { toast } = useToast();

    // Get Zoho mutation from context with safe fallback
    let sendZohoMessageMutation;
    try {
        const contacts = useContacts();
        sendZohoMessageMutation = contacts?.sendZohoMessageMutation;
    } catch (error) {
        console.warn('ContactsProvider not available:', error);
        sendZohoMessageMutation = {
            mutate: (data: any) => {
                console.log('Zoho mail would be sent with data:', data);
            }
        };
    }

    // Handle form submission
    const handleSubmitForm = async (formData: ConsultationFormData) => {
        setIsSubmitting(true);

        try {
            console.log('Submitting form data:', formData);

            const response = await api.post('/consultations', formData);

            // Handle different response formats
            let result;
            if (typeof response === 'object' && 'data' in response) {
                result = response.data;
            } else {
                result = response;
            }

            console.log('API Response:', result);

            if (result.success) {
                // Prepare data for Zoho
                const zohoFormattedData = {
                    subject: "Consultation Booking Request",
                    firstName: formData.name.split(' ')[0],
                    phone: formData.phone || "",
                    email: formData.email,
                    notes: `Consultation Booking Request:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || "Not provided"}
Job Title: ${formData.title || "Not provided"}
Location: ${formData.location || "Not provided"}
Service Type: ${formData.serviceType || "Not provided"}
Consultation Details: ${formData.description || "No additional details provided"}`,
                };

                // Send to Zoho if available
                if (sendZohoMessageMutation && typeof sendZohoMessageMutation.mutate === 'function') {
                    sendZohoMessageMutation.mutate(zohoFormattedData);
                    console.log('Zoho notification triggered');
                } else {
                    console.log('Zoho mutation not available, skipping Zoho notification');
                }

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

                console.log('Form submitted successfully:', result.data);
            } else {
                // Handle API errors
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach((err: any) => {
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
        } catch (error: unknown) {
            console.error('Error submitting form:', error);

            // Type guard to check if error is an object with response property
            const apiError = error as ApiError;

            // Handle network errors or server errors
            if (apiError.response) {
                const errorData = apiError.response.data || {};
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    errorData.errors.forEach((err: any) => {
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
                        description: `Server error: ${apiError.response.status}`,
                        variant: "destructive",
                        duration: 5000,
                    });
                }
            } else if (apiError.request) {
                toast({
                    title: "Network Error",
                    description: 'Network error. Please check your connection and try again.',
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Error",
                    description: apiError.message || 'Something went wrong. Please try again.',
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
            <SEOHead page="contact" />
            {/* Hero Section */}
            <section className="relative pt-32 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={bg}
                        alt="Consultation Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="container-wide relative z-10">
                    <div className="text-center text-black">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-black text-sm font-medium mb-4">
                            Consultation
                        </span>

                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6">
                            Let's Have a Strategic Conversation
                        </h1>

                        <p className="text-lg text-black/90 max-w-2xl mx-auto mb-8">
                            If you're evaluating growth opportunities, entering a new market, or trying to solve a complex business challenge—and want clarity before committing time or capital—I'd be happy to help
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10 text-black">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-black" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">30 Minutes</div>
                                <div className="text-sm text-black/80">Discovery Call</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-black" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">No Commitment</div>
                                <div className="text-sm text-black/80">Zero Pressure</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-black" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">250+ Businesses</div>
                                <div className="text-sm text-black/80">Successfully Helped</div>
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
                                key={formResetKey}
                                onSubmit={handleSubmitForm}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        {/* Right Column - Benefits & Info */}
                        <div className="lg:col-span-1">
                            {/* Inner Profile Card */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={img2}
                                        alt="Sundara Moorthy"
                                        fill
                                        className="object-cover object-top"
                                        priority
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-black">
                                        S. Sundara Moorthy
                                    </h3>
                                    <p className="text-sm text-black/80 mt-2">
                                        Strategy & Growth Advisor | Design Thinking Practitioner
                                    </p>

                                    <div className="flex justify-center gap-4 mt-4">
                                        <a
                                            href="https://whatsapp.com/channel/0029VbBzqZV3AzNRM1WRIR27"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-amber-400 transition-colors"
                                        >
                                            <MessageCircle size={20} />
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/sundaramoorthy15/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-amber-400 transition-all duration-200 hover:scale-110"
                                        >
                                            <Linkedin size={20} />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/profile.php?id=100064303444109"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-amber-400 transition-all duration-200 hover:scale-110"
                                        >
                                            <Facebook size={20} />
                                        </a>
                                        <a
                                            href="https://x.com/sundara_sethu"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-amber-400 transition-all duration-200 hover:scale-110"
                                        >
                                            <Twitter size={20} />
                                        </a>
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
                                        <span className="text-sm">
                                            <a
                                                href="mailto:reach@sundara-moorthy.com"
                                                className="text-lg hover:text-amber-400 transition-colors"
                                            >
                                                reach@sundara-moorthy.com
                                            </a>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <a
                                            href="tel:+919994715658"
                                            className="text-sm hover:underline"
                                        >
                                            +91-9994715658
                                        </a>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full mt-6"
                                    asChild
                                >
                                    <Link href="/portfolio">View My Portfolio</Link>
                                </Button>
                            </div>

                            <div className="lg:sticky lg:top-32 space-y-8">
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}