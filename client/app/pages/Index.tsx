"use client";

import { Layout } from "../components/layout/Layout";
import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/AboutSection";
import { TimelineSection } from "../components/sections/TimelineSection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { CTASection } from "../components/sections/CTASection";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import {LogoCarousel} from "@/app/pages/LogoCarousel";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
        <LogoCarousel/>
      <AboutSection />
        <WhyChooseUs/>
      <TimelineSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
