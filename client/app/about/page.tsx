"use client";

import { Layout } from "../components/layout/Layout";
import { AboutSection } from "../components/sections/AboutSection";
import { TimelineSection } from "../components/sections/TimelineSection";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import {AboutCards} from "@/app/components/AboutCards";

const About = () => {
    return (
        <Layout>
            <AboutSection />
            <AboutCards />
            <WhyChooseUs/>
            <TimelineSection />
        </Layout>
    );
};

export default About;
