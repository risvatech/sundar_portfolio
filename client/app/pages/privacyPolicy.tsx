'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import {
    Shield,
    Lock,
    Eye,
    Database,
    Users,
    Mail,
    FileText,
    CheckCircle2,
    Clock,
    Globe,
    Building2,
    Scale,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
    const [activeSection, setActiveSection] = useState<string>('overview');
    const { scrollYProgress } = useScroll();

    const sections = [
        { id: 'overview', label: 'Overview', icon: Shield },
        { id: 'information', label: 'Information Collection', icon: Database },
        { id: 'usage', label: 'How We Use Data', icon: Eye },
        { id: 'sharing', label: 'Data Sharing', icon: Users },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'rights', label: 'Your Rights', icon: Scale },
        { id: 'contact', label: 'Contact', icon: Mail }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(s => ({
                id: s.id,
                element: document.getElementById(s.id)
            }));

            const current = sectionElements.find(({ element }) => {
                if (!element) return false;
                const rect = element.getBoundingClientRect();
                return rect.top <= 200 && rect.bottom >= 200;
            });

            if (current) {
                setActiveSection(current.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 180;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-primary-gradient text-primary-foreground overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-secondary rounded-full blur-3xl" />
                </div>

                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Legal & Compliance</span>
                        </div>

                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 text-white">
                            Privacy Policy
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 font-sans leading-relaxed max-w-3xl">
                            At our strategy and advisory practice, your trust is paramount. This policy outlines
                            how we protect and handle your confidential business information.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Effective: January 1, 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <span>GDPR & CCPA Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>Professional Services</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* Main Content */}
            <div className="container-wide py-16">
                {/* Overview Section */}
                <section id="overview" className="mb-20 scroll-mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="font-serif text-4xl text-primary">Overview</h2>
                        </div>

                        <div className="card bg-card-gradient mb-8">
                            <p className="text-lg text-foreground/90 leading-relaxed mb-6 font-sans">
                                As a strategy and growth advisory firm, we understand the critical importance of
                                confidentiality and data protection in business consulting relationships. This Privacy
                                Policy explains our commitment to safeguarding your personal and business information.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                                    <h4 className="font-semibold text-primary mb-2 font-sans">Client Confidentiality</h4>
                                    <p className="text-sm text-muted-foreground">
                                        All strategic insights and business data remain strictly confidential
                                    </p>
                                </div>
                                <div className="p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                                    <h4 className="font-semibold text-primary mb-2 font-sans">Data Minimization</h4>
                                    <p className="text-sm text-muted-foreground">
                                        We collect only what's necessary for advisory services
                                    </p>
                                </div>
                                <div className="p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                                    <h4 className="font-semibold text-primary mb-2 font-sans">Transparent Practices</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Clear communication about data usage at every stage
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-accent-light border-l-4 border-accent">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-accent-foreground mb-2">Important Notice</h4>
                                    <p className="text-sm text-accent-foreground/80">
                                        This policy applies to all consulting engagements, advisory services, market research
                                        projects, and strategic planning initiatives. By engaging our services, you acknowledge
                                        and agree to these privacy practices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Information Collection */}
                <section id="information" className="mb-20 scroll-mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                                <Database className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="font-serif text-4xl text-primary">Information We Collect</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Client Information */}
                            <div className="card">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-2 bg-accent-light rounded-lg">
                                        <Building2 className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-2xl text-primary mb-3 font-serif">
                                            Client & Business Information
                                        </h3>
                                        <p className="text-muted-foreground mb-4 font-sans">
                                            When you engage our advisory services, we collect information necessary to
                                            provide strategic guidance and consulting support:
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
                                            Professional Details
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Name, title, and organizational role
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Company name, size, and industry sector
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Business contact information
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Professional credentials and background
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
                                            Engagement Specific
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Strategic objectives and goals
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Market and competitive information
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Financial and operational data (when relevant)
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                Project scope and deliverable requirements
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Website Information */}
                            <div className="card bg-muted/50">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-accent-light rounded-lg">
                                        <Globe className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-2xl text-primary mb-3 font-serif">
                                            Website & Analytics Data
                                        </h3>
                                        <p className="text-muted-foreground mb-4 font-sans">
                                            When you visit our website or interact with our digital platforms:
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                                IP address and geographic location
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                                Browser type and device information
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                                Pages viewed and content accessed
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                                Referral sources and navigation patterns
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* How We Use Data */}
                <section id="usage" className="mb-20 scroll-mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                                <Eye className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="font-serif text-4xl text-primary">How We Use Your Information</h2>
                        </div>

                        <div className="card bg-card-gradient">
                            <p className="text-lg text-foreground/90 mb-6 font-sans">
                                Your information serves exclusively to deliver exceptional advisory services and
                                strategic insights. We maintain strict protocols around data usage:
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                                    <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-accent font-bold">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2 font-sans">Strategic Consulting Delivery</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Conducting market research, competitive analysis, growth strategy development,
                                            and providing actionable recommendations tailored to your business objectives.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                                    <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-accent font-bold">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2 font-sans">Client Communications</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Maintaining engagement communication, project updates, sharing industry insights,
                                            and delivering reports, presentations, and strategic documentation.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                                    <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-accent font-bold">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2 font-sans">Service Enhancement</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Improving our methodologies, refining analytical frameworks, and developing
                                            deeper industry expertise through aggregated, anonymized insights.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                                    <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-accent font-bold">4</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2 font-sans">Legal & Contractual Obligations</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Fulfilling engagement agreements, maintaining professional standards, and
                                            complying with applicable business and regulatory requirements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Data Sharing */}
                <section id="sharing" className="mb-20 scroll-mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="font-serif text-4xl text-primary">Data Sharing & Disclosure</h2>
                        </div>

                        <div className="card bg-primary-light border-l-4 border-primary mb-6">
                            <h3 className="font-semibold text-xl text-primary mb-3 font-sans">Our Commitment</h3>
                            <p className="text-muted-foreground font-sans">
                                <strong className="text-primary">We do not sell, rent, or trade your information.</strong>
                                {' '}As a professional advisory firm, client confidentiality is foundational to our practice.
                                Information sharing is limited to specific, necessary circumstances:
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="card hover:shadow-medium transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-accent-light rounded-lg">
                                        <FileText className="w-5 h-5 text-accent" />
                                    </div>
                                    <h4 className="font-semibold text-lg text-primary font-sans">Service Providers</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Trusted partners who assist in delivering advisory services (e.g., specialized
                                    research firms, data analytics platforms, secure cloud storage).
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    All providers are bound by confidentiality agreements and data protection standards.
                                </p>
                            </div>

                            <div className="card hover:shadow-medium transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-accent-light rounded-lg">
                                        <Scale className="w-5 h-5 text-accent" />
                                    </div>
                                    <h4 className="font-semibold text-lg text-primary font-sans">Legal Requirements</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    When required by law, court order, government investigation, or to protect
                                    our legal rights and those of our clients.
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    We will notify you when legally permitted before such disclosure.
                                </p>
                            </div>

                            <div className="card hover:shadow-medium transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-accent-light rounded-lg">
                                        <Building2 className="w-5 h-5 text-accent" />
                                    </div>
                                    <h4 className="font-semibold text-lg text-primary font-sans">Business Transfers</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    In the event of a merger, acquisition, or sale of assets, client information
                                    may transfer to the acquiring entity.
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    You will be notified of any such change and given options regarding your data.
                                </p>
                            </div>

                            <div className="card hover:shadow-medium transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-accent-light rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-accent" />
                                    </div>
                                    <h4 className="font-semibold text-lg text-primary font-sans">With Your Consent</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Any other sharing of your information requires explicit, written consent
                                    (e.g., case studies, testimonials, referrals).
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    You maintain full control and can revoke consent at any time.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Security */}
                <section id="security" className="mb-20 scroll-mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                                <Lock className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="font-serif text-4xl text-primary">Data Security Measures</h2>
                        </div>

                        <div className="card bg-card-gradient mb-6">
                            <p className="text-lg text-foreground/90 mb-6 font-sans">
                                We implement enterprise-grade security measures to protect sensitive business information
                                and client data:
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-primary-light rounded-lg">
                                    <Lock className="w-6 h-6 text-primary mb-3" />
                                    <h4 className="font-semibold text-primary mb-2 text-sm">Encryption</h4>
                                    <p className="text-xs text-muted-foreground">
                                        End-to-end encryption for all data transmission and storage using industry-standard protocols
                                    </p>
                                </div>
                                <div className="p-4 bg-primary-light rounded-lg">
                                    <Shield className="w-6 h-6 text-primary mb-3" />
                                    <h4 className="font-semibold text-primary mb-2 text-sm">Access Controls</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Multi-factor authentication and role-based access with strict need-to-know policies
                                    </p>
                                </div>
                                <div className="p-4 bg-primary-light rounded-lg">
                                    <FileText className="w-6 h-6 text-primary mb-3" />
                                    <h4 className="font-semibold text-primary mb-2 text-sm">Regular Audits</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Quarterly security assessments and compliance reviews by independent auditors
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Secure cloud infrastructure with SOC 2 Type II compliance</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Regular security training for all team members handling client data</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Incident response protocols and data breach notification procedures</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Secure document management with version control and audit trails</span>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-accent-light border-l-4 border-accent">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-accent-foreground mb-2">Security Disclaimer</h4>
                                    <p className="text-sm text-accent-foreground/80">
                                        While we implement robust security measures, no system is completely immune to breaches.
                                        We continuously monitor and update our security practices to address emerging threats
                                        and maintain the highest standards of data protection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Your Rights */}
                <section id="rights" className="mb-20 scroll-mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center">
                                <Scale className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="font-serif text-4xl text-primary">Your Privacy Rights</h2>
                        </div>

                        <div className="card bg-card-gradient mb-6">
                            <p className="text-lg text-foreground/90 mb-6 font-sans">
                                You maintain full control over your personal and business information. We honor the
                                following rights in accordance with GDPR, CCPA, and best practices:
                            </p>

                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Right to Access',
                                        description: 'Request a complete copy of all personal and business data we hold about you, including the source and purpose of collection.',
                                        timeline: 'Response within 30 days'
                                    },
                                    {
                                        title: 'Right to Rectification',
                                        description: 'Request correction of any inaccurate or incomplete information to ensure our records reflect current and accurate data.',
                                        timeline: 'Updates within 15 days'
                                    },
                                    {
                                        title: 'Right to Erasure',
                                        description: 'Request deletion of your data when it is no longer necessary for the purpose collected or when you withdraw consent.',
                                        timeline: 'Subject to legal obligations'
                                    },
                                    {
                                        title: 'Right to Restriction',
                                        description: 'Request limitation of data processing while we verify accuracy or assess the legitimacy of processing.',
                                        timeline: 'Immediate upon request'
                                    },
                                    {
                                        title: 'Right to Data Portability',
                                        description: 'Receive your data in a structured, commonly used format and transmit it to another service provider.',
                                        timeline: 'Within 45 days'
                                    },
                                    {
                                        title: 'Right to Object',
                                        description: 'Object to processing of your data for direct marketing, research, or other purposes not essential to service delivery.',
                                        timeline: 'Immediate cessation'
                                    }
                                ].map((right, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-bold">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h4 className="font-semibold text-primary font-sans">{right.title}</h4>
                                                <span className="text-xs text-accent bg-accent-light px-2 py-1 rounded-full whitespace-nowrap">
                          {right.timeline}
                        </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{right.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

            </div>

            {/* Footer Section */}
            <section className="py-16 bg-muted border-t border-border">
                <div className="container-wide">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="card">
                                <h3 className="font-semibold text-xl text-primary mb-3 font-sans">Updates to This Policy</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    We review and update this Privacy Policy annually or when our practices change materially.
                                    Significant changes will be communicated via email to active clients.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>Current Version: 2.0 | Effective: January 1, 2026</span>
                                </div>
                            </div>

                            <div className="card bg-accent-light">
                                <h3 className="font-semibold text-xl text-accent-foreground mb-3 font-sans">
                                    Related Policies
                                </h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/terms"
                                        className="block text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors"
                                    >
                                        → Terms of Engagement
                                    </Link>
                                    <Link
                                        href="/confidentiality"
                                        className="block text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors"
                                    >
                                        → Confidentiality Agreement
                                    </Link>
                                    <Link
                                        href="/data-processing"
                                        className="block text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors"
                                    >
                                        → Data Processing Addendum
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="font-serif text-3xl mb-4 text-primary">Questions About Your Privacy?</h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                We're committed to transparency and protecting your confidential business information.
                                Our team is here to address any concerns.
                            </p>
                            <Link
                                href="/book"
                                className="btn-accent inline-flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                Book a Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;