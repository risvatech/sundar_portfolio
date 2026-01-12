'use client'

import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Layout } from "../components/layout/Layout"
import {
    Award,
    TrendingUp,
    Users,
    Globe,
    Briefcase,
    Target,
    ChevronRight,
    Calendar,
    DollarSign,
    MapPin,
    BarChart3
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const achievements = [
    {
        id: 1,
        title: "Built Healthcare Consulting Division",
        description: "Grew division from scratch to $150K+ annual revenue within 18 months",
        icon: TrendingUp,
        metrics: [
            { label: "Revenue Generated", value: "$150K+" },
            { label: "Client Retention", value: "95%" },
            { label: "Team Size", value: "8+" }
        ]
    },
    {
        id: 2,
        title: "Rapid Career Progression",
        description: "Promoted from Trainee to Regional Manager in just 9 months at Roche Diagnostics",
        icon: Award,
        metrics: [
            { label: "Promotion Time", value: "9 Months" },
            { label: "Team Managed", value: "12+" },
            { label: "Sales Growth", value: "45%" }
        ]
    },
    {
        id: 3,
        title: "Sales Excellence Award",
        description: "Recognized as Sales Performer of the Year at Roche Diagnostics",
        icon: Award,
        metrics: [
            { label: "Target Achievement", value: "156%" },
            { label: "Market Share Gain", value: "22%" },
            { label: "Client Satisfaction", value: "98%" }
        ]
    },
    {
        id: 4,
        title: "Investment-Grade Studies",
        description: "Led multiple feasibility studies supporting $200M+ investment decisions",
        icon: DollarSign,
        metrics: [
            { label: "Studies Completed", value: "50+" },
            { label: "Investment Supported", value: "$200M+" },
            { label: "Decision Accuracy", value: "92%" }
        ]
    }
]

const engagements = [
    {
        type: "Market Entry Strategy",
        examples: [
            "Medical devices in Southeast Asia",
            "EV infrastructure in Europe",
            "Industrial equipment in Middle East"
        ],
        outcomes: "Successfully entered 15+ new markets with 85% success rate"
    },
    {
        type: "Investment Decision Support",
        examples: [
            "$50M EV manufacturing plant",
            "$30M MedTech acquisition",
            "$75M renewable energy project"
        ],
        outcomes: "Supported $200M+ investment decisions with validated ROI projections"
    },
    {
        type: "Innovation Strategy",
        examples: [
            "Digital health platform development",
            "Smart manufacturing initiatives",
            "Green technology roadmaps"
        ],
        outcomes: "Accelerated innovation timelines by 40% and improved success rates"
    },
    {
        type: "Operational Excellence",
        examples: [
            "Supply chain optimization",
            "Sales transformation programs",
            "Customer experience redesign"
        ],
        outcomes: "Delivered average 30% improvement in operational efficiency"
    }
]

const careerHighlights = [
    {
        company: "Kepler Consulting",
        role: "Head of Market Research",
        duration: "2018 - 2022",
        achievements: [
            "Built and led market research practice",
            "Delivered 120+ client engagements",
            "Expanded service portfolio by 40%"
        ]
    },
    {
        company: "MITCON",
        role: "AVP Advisory",
        duration: "2015 - 2018",
        achievements: [
            "Led strategic advisory practice",
            "Managed $50M+ project portfolio",
            "Developed industry partnerships"
        ]
    },
    {
        company: "BDB",
        role: "Head Healthcare Consulting",
        duration: "2012 - 2015",
        achievements: [
            "Built healthcare consulting division",
            "Achieved $150K+ annual revenue",
            "Established thought leadership"
        ]
    },
    {
        company: "Roche Diagnostics",
        role: "Sales Excellence Manager",
        duration: "2006 - 2012",
        achievements: [
            "Sales Performer of the Year award",
            "Managed 12+ member team",
            "Achieved 45% sales growth"
        ]
    }
]

export default function ExperienceImpactPage() {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-warm-gradient">
                <div className="container-wide text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Track Record & Impact
          </span>
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                        Proven <span className="text-gradient">Results & Impact</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                        18+ years of delivering measurable business impact through strategic insights and
                        hands-on leadership across global markets and industries.
                    </p>
                </div>
            </section>

            {/* Career Impact Stats */}
            <section className="py-12">
                <div className="container-wide">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">220+</div>
                            <div className="text-sm text-muted-foreground">Client Engagements</div>
                        </Card>
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">18+</div>
                            <div className="text-sm text-muted-foreground">Years Experience</div>
                        </Card>
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">$200K+</div>
                            <div className="text-sm text-muted-foreground">Average Project Value</div>
                        </Card>
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">3</div>
                            <div className="text-sm text-muted-foreground">Continents Served</div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Selected Achievements */}
            <section className="section-padding">
                <div className="container-wide">
                    <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
                        Selected Achievements
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {achievements.map((achievement) => {
                            const Icon = achievement.icon
                            return (
                                <Card key={achievement.id} className="hover:shadow-2xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                                                    {achievement.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm">
                                                    {achievement.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                            {achievement.metrics.map((metric, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className="text-lg font-bold text-foreground">{metric.value}</div>
                                                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Types of Engagements */}
            <section className="py-16 bg-secondary">
                <div className="container-wide">
                    <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
                        Types of Engagements
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {engagements.map((engagement, idx) => (
                            <Card key={idx} className="bg-card-gradient border-none shadow-medium">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Target className="w-5 h-5 text-primary" />
                                        <h3 className="font-serif text-xl font-semibold text-foreground">
                                            {engagement.type}
                                        </h3>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-foreground mb-2">Examples:</h4>
                                        <ul className="space-y-1">
                                            {engagement.examples.map((example, exIdx) => (
                                                <li key={exIdx} className="flex items-start gap-2 text-sm">
                                                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{example}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-primary/5 rounded-lg">
                                        <h4 className="text-sm font-medium text-primary mb-1">Key Outcome:</h4>
                                        <p className="text-sm text-muted-foreground">{engagement.outcomes}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Highlights */}
            <section className="section-padding">
                <div className="container-wide">
                    <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
                        Career Highlights
                    </h2>
                    <div className="space-y-8">
                        {careerHighlights.map((highlight, idx) => (
                            <Card key={idx} className="hover:shadow-2xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="font-serif text-xl font-semibold text-foreground">
                                                {highlight.company}
                                            </h3>
                                            <p className="text-primary font-medium">{highlight.role}</p>
                                        </div>
                                        <Badge variant="outline" className="self-start md:self-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {highlight.duration}
                                        </Badge>
                                    </div>

                                    <ul className="space-y-2">
                                        {highlight.achievements.map((achievement, aIdx) => (
                                            <li key={aIdx} className="flex items-start gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                <span className="text-muted-foreground">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container-narrow text-center">
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
                        Ready to Achieve Similar Results?
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                        Leverage 18+ years of proven expertise to drive measurable impact in your organization.
                        Let's discuss how we can achieve outstanding results together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" variant="secondary" className="px-8">
                                Book Strategy Session
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button size="lg" variant="outline" className="px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                View Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    )
}