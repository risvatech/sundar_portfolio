"use client";

import { Layout } from "../components/layout/Layout";
import { AboutSection } from "../components/sections/AboutSection";
import { TimelineSection } from "../components/sections/TimelineSection";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import {AboutCards} from "@/app/components/AboutCards";
import SEOHead from "@/app/components/SEOHead";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

const About = () => {
    return (
        <Layout>
            <BreadcrumbSchema
                items={[
                    { name: "Home", item: "https://www.sundara-moorthy.com/" },
                    { name: "About", item: "https://www.sundara-moorthy.com/about" },
                ]}
            />
            <SEOHead page="about" />
            <AboutSection />
            {/*<AboutCards />*/}
            {/*<WhyChooseUs/>*/}
            <TimelineSection />
        </Layout>
    );
};

export default About;
