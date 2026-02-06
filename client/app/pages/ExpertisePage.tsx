'use client'

import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Layout } from "../components/layout/Layout"
import {
  Heart,
  Zap,
  Factory,
  Cpu,
  Building,
  Target,
  CheckCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const industries = [
  {
    id: 1,
    name: "Healthcare & MedTech",
    icon: Heart,
    color: "from-red-400 to-pink-500",
    description: "Transforming healthcare delivery through innovative strategies and market intelligence",
    problems: [
      "Market entry for new medical devices",
      "Regulatory pathway optimization",
      "Healthcare provider adoption strategies",
      "Pricing and reimbursement models"
    ],
    projects: [
      "MedTech innovation strategy development",
      "Healthcare provider market research",
      "Digital health adoption studies",
      "Medical device market entry"
    ],
    outcomes: [
      "Increased market share by 35%",
      "Reduced time-to-market by 40%",
      "Improved ROI on R&D investments",
      "Enhanced stakeholder adoption"
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800"
  },
  {
    id: 2,
    name: "EV & Green Energy",
    icon: Zap,
    color: "from-green-400 to-emerald-600",
    description: "Driving sustainable mobility and energy transformation strategies",
    problems: [
      "EV charging infrastructure planning",
      "Battery technology investment decisions",
      "Sustainable supply chain development",
      "Consumer adoption barriers"
    ],
    projects: [
      "EV market entry strategy",
      "Renewable energy investment analysis",
      "Supply chain sustainability audits",
      "Consumer behavior studies"
    ],
    outcomes: [
      "$50M+ investment decisions supported",
      "Market penetration accelerated by 2x",
      "Supply chain costs reduced by 25%",
      "Consumer adoption increased by 40%"
    ],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800"
  },
  {
    id: 3,
    name: "Industrial & Construction Equipment",
    icon: Factory,
    color: "from-blue-400 to-indigo-600",
    description: "Optimizing industrial operations and construction efficiency through strategic insights",
    problems: [
      "Equipment lifecycle management",
      "Operational efficiency gaps",
      "Supply chain disruptions",
      "Technology adoption challenges"
    ],
    projects: [
      "Equipment market analysis",
      "Operational efficiency audits",
      "Technology adoption roadmaps",
      "Supplier evaluation frameworks"
    ],
    outcomes: [
      "Operational efficiency improved by 30%",
      "Equipment downtime reduced by 45%",
      "Supply chain resilience enhanced",
      "ROI on equipment investments increased"
    ],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800"
  },
  {
    id: 4,
    name: "Emerging Technologies",
    icon: Cpu,
    color: "from-purple-400 to-violet-600",
    description: "Navigating the future of technology innovation and market disruption",
    problems: [
      "Technology adoption roadblocks",
      "Market timing decisions",
      "Investment risk assessment",
      "Talent acquisition strategies"
    ],
    projects: [
      "Emerging tech market sizing",
      "Innovation portfolio strategy",
      "Technology scouting and assessment",
      "Future scenario planning"
    ],
    outcomes: [
      "Early market entry advantages captured",
      "Investment risks reduced by 60%",
      "Innovation pipelines strengthened",
      "Competitive positioning enhanced"
    ],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800"
  },
  {
    id: 5,
    name: "B2B & Manufacturing",
    icon: Building,
    color: "from-orange-400 to-amber-600",
    description: "Transforming B2B operations and manufacturing excellence through strategic insights",
    problems: [
      "Market expansion challenges",
      "Operational efficiency gaps",
      "Customer retention issues",
      "Technology integration barriers"
    ],
    projects: [
      "B2B market entry strategy",
      "Manufacturing process optimization",
      "Customer journey mapping",
      "Digital transformation roadmaps"
    ],
    outcomes: [
      "Market share increased by 28%",
      "Operational costs reduced by 35%",
      "Customer retention improved by 50%",
      "Digital adoption accelerated"
    ],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800"
  }
]

export default function ExpertisePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-warm-gradient">
        <div className="container-wide text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Industry Expertise
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Deep <span className="text-gradient">Industry Knowledge</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            18+ years of specialized experience across high-growth sectors, helping organizations
            navigate complex market landscapes and drive sustainable growth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="outline" className="text-sm px-4 py-1.5">
              220+ Industry Engagements
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1.5">
              3 Continents Experience
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1.5">
              Multi-Sector Expertise
            </Badge>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <Card key={industry.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${industry.color} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-2xl font-semibold text-white mb-1">
                        {industry.name}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6">
                      {industry.description}
                    </p>

                    <div className="space-y-6">
                      {/* Problems Solved */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-foreground">Typical Problems Solved</h4>
                        </div>
                        <ul className="space-y-2">
                          {industry.problems.map((problem, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{problem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Project Types */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-foreground">Types of Projects</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {industry.projects.map((project, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Business Outcomes */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-foreground">Business Outcomes</h4>
                        </div>
                        <ul className="space-y-2">
                          {industry.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/*<div className="mt-6 pt-6 border-t">*/}
                    {/*  <Link href="/contact">*/}
                    {/*    <Button className="w-full group/btn">*/}
                    {/*      Discuss {industry.name} Strategy*/}
                    {/*      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />*/}
                    {/*    </Button>*/}
                    {/*  </Link>*/}
                    {/*</div>*/}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Need Specialized Industry Insights?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're entering a new market, scaling operations, or optimizing your strategy,
            get expert guidance tailored to your industry's unique challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="px-8">
                Book Strategy Call
              </Button>
            </Link>
            <Link href="/what-i-do">
              <Button size="lg" variant="outline" className="px-8">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}