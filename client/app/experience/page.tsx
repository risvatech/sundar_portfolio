'use client'

import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Layout } from "../components/layout/Layout"
import {
    Award,
    TrendingUp,
    Trophy,
    Star,
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
        title: "Sales Performer \n" +
            "of the Year - 2009",
        description: "Awarded “Sales Performer \n" +
            "of the Year - 2009” for \n" +
            "achieving 120% of plan \n" +
            "within first year of hire in \n" +
            "2010 ",
        icon: Trophy,
        metrics: [
            { label: "Plan Achievement", value: "120%" },
            { label: "Revenue Generated", value: "$150K+" },
            { label: "Client Retention", value: "95%" }
        ]
    },
    {
        id: 2,
        title: "Best NSV award",
        description: "Best NSV award for the \n" +
            "consecutive quarters (April – December, 2009) ",
        icon: Award,
        metrics: [
            { label: "Sales Growth", value: "45%" },
            { label: "Consecutive Quarters", value: "3 Quarters" },
            { label: "Promotion Timeline", value: "9 Months" }
        ]
    },
    {
        id: 3,
        title: "Roche Diagnostics Restructuring",
        description: "Restructured primary billing systematically in Roche Diagnostics Coimbatore territory",
        icon: TrendingUp,
        metrics: [
            { label: "Process Efficiency", value: "60% ↑" },
            { label: "Billing Accuracy", value: "99%" },
            { label: "Time Saved", value: "20 hrs/week" }
        ]
    },
    {
        id: 4,
        title: "Rapid Career Progression",
        description: "Joined as Trainee in August 2010 and became Regional Manager in May 2011 (in 9 months)",
        icon: Star,
        metrics: [
            { label: "Territory Growth", value: "75%" },
            { label: "Team Managed", value: "12+" },
            { label: "Promotion Time", value: "9 Months" },
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
        company: "MITCON Consultancy & Engineering Services Limited, Pune ",
        role: "Asst. Vice President-Business Advisory Services ",
        duration: "2019 – 2022",
        achievements: [
            "Business & Technology Consulting and Sales Transformation strategist ",
            "Responsible for P&L for Business Advisory Services Department",
            "Driving key account management and business development activities "
        ]
    },
    {
        company: "BDB (India) Private Limited, Pune",
        role: "Senior Manager – Projects, & Head – Healthcare Consulting Division",
        duration: "2016 – 2019",
        achievements: [
            "Responsible for B2B Business Consulting & Market Research business ",
            "Heading the “Knowledge Center” which develop periodic industry analysis & reports",
            "Designing business strategy, client engagement, liaising with major corporate companies & associations in \n" +
            "various industrial segments "
        ]
    },
    {
        company: "BDB (India) Private Limited, Pune",
        role: "Manager – Projects & Regional Manager - South",
        duration: "2010 – 2016 ",
        achievements: [
            "Responsible for smooth running of market research assignments like organizing resources for project \n" +
            "execution, report preparation and assuring the successful completion of the project.",
            "Interacting with the clients - kick-off and progress meeting in between the project",
            "Analyze the primary & secondary data and recommend suitable marketing strategies to clients as per the \n" +
            "project scope. "
        ]
    },
    {
        company: "Roche Diagnostics India Pvt Ltd (Diabetes Care Division)",
        role: "Sales Executive - Institutional, Coimbatore",
        duration: "2009 - 2010",
        achievements: [
            "Awarded “Sales Performer of the Year - 2009” for achieving 120% of plan within first year of hire",
            "Continued to exceed sales objectives, maintaining the high NSV throughout tenure.",
            "Transformed minimally producing territory into one of the company’s most lucrative revenue \n" +
            "generators. Built trust, salvaged damaged relationships and won back product loyalty."
        ]
    },
    {
        company: "GenxBio Health Sciences Private Limited",
        role: "Business Development Executive, Pune",
        duration: "2007 - 2008",
        achievements: [
            "Made the first sale within 3 month of hire",
            "Made entry in Government institutions like NCL, NCCS through rate contracts"
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">250+</div>
                            <div className="text-sm text-muted-foreground">Client Engagements</div>
                        </Card>
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">18+</div>
                            <div className="text-sm text-muted-foreground">Years Experience</div>
                        </Card>
                        <Card className="text-center p-6">
                            <div className="text-4xl font-bold text-primary mb-2">25+</div>
                            <div className="text-sm text-muted-foreground">Countries Served</div>
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
                    <h2 className="font-serif text-3xl font-semibold text-white mb-8 text-center">
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
        </Layout>
    )
}