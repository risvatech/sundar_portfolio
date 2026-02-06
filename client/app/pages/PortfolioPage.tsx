// components/PortfolioPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Phone, Mail, Linkedin, Calendar,
    Globe, Briefcase, Target, Users, Cpu,
    ShoppingCart, ClipboardCheck, Leaf,
    ChevronRight, Sparkles, TrendingUp,
    Award, Zap, Target as TargetIcon,
    Layers, ArrowRight
} from 'lucide-react';

const PortfolioPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const experienceSections = [
        {
            title: 'Global Market Entry & Category Expansion',
            icon: <Globe className="w-5 h-5" />,
            items: [
                'Developed market entry blueprints for industrial, construction equipment, and home appliance categories across India, USA, and South Asia.',
                'Designed product-mix, pricing, channel, and service network strategies for excavators, road construction equipment, and premium kitchen appliances.',
                'Created regulatory, compliance & standards mapping covering emission norms, fuel standards, and safety regulations across Southeast Asia, Latin America & Africa.'
            ]
        },
        {
            title: 'Industrial Manufacturing & Supply Chain Strategy',
            icon: <Briefcase className="w-5 h-5" />,
            items: [
                'Evaluated carbon-based particle manufacturing ecosystems and identified global strategic partners.',
                'Mapped the plastic processing, marine pumps, vacuum pumps, and industrial bearings markets to size opportunities and benchmark competitive landscapes.',
                'Delivered global contract manufacturing ecosystem mapping for Nutri-cosmetics and oral supplements for European clients.'
            ]
        },
        {
            title: 'Healthcare & MedTech Commercial Intelligence',
            icon: <Target className="w-5 h-5" />,
            items: [
                'Built market entry & adoption strategies for Continuous Glucose Monitoring Systems (CGMS) and IV fluid administration systems.',
                'Conducted commercial due diligence and feasibility assessments for syringes, sutures, medical gloves, and medical rubber products across India, Africa, and the Middle East.',
                'Designed service line expansion strategies for multi-specialty hospitals (Pune, Solapur, Colombo) and assessed heart, organ transplant & surgery demand.'
            ]
        },
        {
            title: 'Customer Insight, UX & Product Validation',
            icon: <Users className="w-5 h-5" />,
            items: [
                'Moderated Product Clinics & Focus Group Discussions for automotive and industrial brands covering medium-duty trucks, automation systems, and premium consumer products.',
                'Led customer experience (CX) and user behaviour studies across industrial automation, retail, and B2B segments.'
            ]
        },
        {
            title: 'Automation, Robotics & Technology Transformation',
            icon: <Cpu className="w-5 h-5" />,
            items: [
                'Conducted a national-level assessment of automation & robotics adoption potential within the Indian SME sector.',
                'Identified global technology partners for public sector diversification, mapping the right product mixes and institutional opportunities.'
            ]
        },
        {
            title: 'Strategic Sourcing & Procurement Intelligence',
            icon: <ShoppingCart className="w-5 h-5" />,
            items: [
                'Developed sourcing strategies for Agri-commodities (lemons for a US biomedicine client), medical consumables, and industrial components.',
                'Conducted cross-border scrap steel sourcing evaluations from Bangladesh and South Asia.'
            ]
        },
        {
            title: 'Feasibility Studies & Investment Decision Support',
            icon: <ClipboardCheck className="w-5 h-5" />,
            items: [
                'Delivered techno-commercial feasibility studies for automobile scrap parks, green ship recycling yards, and healthcare infrastructure (hospitals, MRI centers, medical colleges).',
                'Supported investment and funding decisions through market sizing, unit economics, business modelling & risk analysis.'
            ]
        },
        {
            title: 'Sustainability, Circular Economy & Environmental Studies',
            icon: <Leaf className="w-5 h-5" />,
            items: [
                'Led environmental impact and industry trend studies for the global ship breaking industry and assessed green, compliant, and circular industrial models.',
                'Evaluated ESG compliance, safety standards, and sustainability trends across sectors.'
            ]
        }
    ];

    const stats = [
        { value: '15+', label: 'Years Experience', icon: <Calendar className="w-4 h-4" /> },
        { value: '220+', label: 'Projects Completed', icon: <TargetIcon className="w-4 h-4" /> },
        { value: '25+', label: 'Countries Covered', icon: <Globe className="w-4 h-4" /> },
        { value: '8+', label: 'Key Industries', icon: <Layers className="w-4 h-4" /> }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
        },
        hover: {
            scale: 1.02,
            y: -5,
            transition: { duration: 0.2 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <main className="min-h-screen bg-subtle-gradient py-16">

            {/* Overview Section */}
            <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="py-10 sm:py-12 lg:pt-24"
            >
                <div className="container-wide">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-card via-background to-card/80 rounded-xl shadow-soft border border-border/50 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left Column - Content */}
                                <div className="p-6 sm:p-8 lg:p-10">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <div className="p-2 bg-accent/10 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-serif font-semibold text-primary">
                                            Strategic Experience Portfolio (2010-2025)
                                        </h3>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="text-foreground leading-relaxed mb-6"
                                    >
                                        With 18+ years of international consulting experience, I have led 250+ multi-country market research, strategy, sourcing, and feasibility engagements across Europe, USA, Southeast Asia, Middle East, and India. My work spans industrial manufacturing, construction equipment, EVs, green energy, medical devices, healthcare services, automation, consumer products, and public-sector transformation.
                                    </motion.p>

                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                                    >
                                        {['Europe', 'USA', 'Southeast Asia', 'Middle East', 'India', 'Latin America', 'Africa', 'South Asia'].map((region, index) => (
                                            <motion.span
                                                key={region}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-primary-light text-primary px-3 py-1.5 rounded-full text-sm font-medium text-center"
                                            >
                                                {region}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Right Column - Image */}
                                <div className="relative h-64 lg:h-auto">
                                    {/* Optional: Add a gradient overlay for better text contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent z-10"></div>

                                    <motion.img
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                        alt="Global business strategy meeting with world map in background"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Optional decorative element */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="absolute bottom-0 left-0 h-1 bg-accent z-20"
                                    ></motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Experience Sections */}
            <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-10 sm:py-12 lg:py-14"
            >
                <div className="container-wide">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-8 text-center"
                        >
                            Strategic Expertise & Capabilities
                        </motion.h2>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {experienceSections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="group"
                                >
                                    <div className="bg-gradient-to-br from-card via-background to-card/80 rounded-xl shadow-soft border border-border/50 p-5 h-full hover:shadow-medium transition-all duration-300">
                                        <div className="flex items-start gap-3 mb-4">
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                                className="p-2 bg-accent/10 rounded-lg text-accent"
                                            >
                                                {section.icon}
                                            </motion.div>
                                            <h3 className="text-lg font-serif font-semibold text-primary group-hover:text-accent transition-colors">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <ul className="space-y-2.5">
                                            {section.items.map((item, itemIndex) => (
                                                <motion.li
                                                    key={itemIndex}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: itemIndex * 0.1 }}
                                                    className="text-foreground text-sm leading-relaxed relative pl-4"
                                                >
                                                    <ChevronRight className="absolute left-0 top-1 w-3 h-3 text-accent" />
                                                    {item}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-10 sm:py-12 lg:py-14"
            >
                <div className="container-wide">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#2E5C8A] text-accent-foreground rounded-xl shadow-soft p-6 relative overflow-hidden"
                        >


                            <div className="relative z-10">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-6"
                                >
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3 text-white">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-sm font-medium">Let's Collaborate</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 text-white">
                                        Ready to Transform Your Business Strategy?
                                    </h3>
                                    <p className="text-white">
                                        Let's discuss how my expertise in market intelligence and strategic planning can drive your organization's growth.
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="flex flex-wrap justify-center gap-3"
                                >
                                    <motion.a
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href="mailto:sundaramoorthy.s15@gmail.com"
                                        className="inline-flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 font-medium px-5 py-2.5 rounded-lg transition-all shadow-md border border-white/20"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Contact via Email
                                    </motion.a>

                                    <motion.a
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href="/contact"
                                        className="inline-flex items-center gap-2 bg-white/20 text-white hover:bg-white/30  font-medium px-5 py-2.5 rounded-lg transition-all border border-white/20"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Contact Now
                                    </motion.a>

                                    <motion.a
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href="https://www.linkedin.com/in/sundaramoorthy15/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 font-medium px-5 py-2.5 rounded-lg transition-all border border-white/20"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        Connect on LinkedIn
                                    </motion.a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </main>
    );
};

export default PortfolioPage;