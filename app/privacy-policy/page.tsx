"use client"

import Services from "@/app/pages/Services";
import PrivacyPolicyPage from "@/app/pages/privacyPolicy";
import {Layout} from "@/app/components/layout/Layout";
import {AboutSection} from "@/app/components/sections/AboutSection";
import {AboutCards} from "@/app/components/AboutCards";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import {TimelineSection} from "@/app/components/sections/TimelineSection";
import SEOHead from "@/app/components/SEOHead";

export default function Service() {
    return (
        <Layout>
            <SEOHead page="home" />
            <PrivacyPolicyPage/>
        </Layout>
    )
}