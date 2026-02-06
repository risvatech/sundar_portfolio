"use client"

import { Layout } from "../components/layout/Layout";
import PortfolioPage from "@/app/pages/PortfolioPage";
import SEOHead from "@/app/components/SEOHead";

export default function Portfolio() {
    return (
        <>
            <Layout>
                <SEOHead page="home" />
                <PortfolioPage/>
            </Layout>
        </>
    )
}