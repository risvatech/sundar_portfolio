import { 
  TrendingUp, 
  Palette, 
  Settings, 
  Rocket, 
  Monitor, 
  Users,
  LucideIcon
} from "lucide-react";

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  longDescription: string;
  benefits: string[];
  process: { step: string; description: string }[];
  image: string;
}

export const services: Service[] = [
  {
    id: "business-strategy",
    icon: TrendingUp,
    title: "Market & Opportunity Intelligence",
    description: "Develop a clear roadmap for sustainable growth with data-driven strategies tailored to your unique market position.",
    features: ["Market Research (B2B & B2G)", "Competitive Intelligence", "TAM / SAM / SOM", "Trend & Foresight Studies"],
    longDescription: "In today's rapidly evolving business landscape, having a clear strategic direction is more important than ever. My Business Strategy consulting helps you cut through the noise and focus on what truly matters for sustainable growth. Together, we'll analyze your market position, identify untapped opportunities, and create a roadmap that aligns with your vision and values.",
    benefits: [
      "Crystal-clear understanding of your competitive landscape",
      "Actionable growth roadmap with measurable milestones",
      "Aligned team working toward shared objectives",
      "Data-driven decision-making framework",
      "Sustainable competitive advantages"
    ],
    process: [
      { step: "Discovery", description: "Deep dive into your business, market, and aspirations through interviews and analysis" },
      { step: "Analysis", description: "Comprehensive market research, competitor analysis, and internal capability assessment" },
      { step: "Strategy Development", description: "Collaborative workshops to define vision, priorities, and strategic initiatives" },
      { step: "Implementation Planning", description: "Detailed action plans with timelines, owners, and success metrics" },
      { step: "Execution Support", description: "Ongoing guidance and course corrections as you implement your strategy" }
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  },
  {
    id: "brand-development",
    icon: Palette,
    title: "Growth & Go-To-Market Strategy",
    description: "Build a compelling brand identity that resonates with your audience and sets you apart from competitors.",
    features: ["GTM Strategy", "Market Entry Strategy", "Sales Transformation", "Pricing & Positioning"],
    longDescription: "Your brand is more than a logo—it's the feeling people get when they interact with your business. Effective brand development creates emotional connections that turn customers into advocates. I help you uncover your authentic brand story and translate it into a consistent, compelling presence across every touchpoint.",
    benefits: [
      "Authentic brand identity that reflects your values",
      "Clear messaging that resonates with your ideal customers",
      "Consistent brand experience across all channels",
      "Stronger emotional connection with your audience",
      "Premium positioning that supports higher pricing"
    ],
    process: [
      { step: "Brand Audit", description: "Evaluate current brand perception, assets, and market position" },
      { step: "Audience Research", description: "Deep understanding of your ideal customers' needs, desires, and language" },
      { step: "Positioning Workshop", description: "Define your unique value proposition and competitive differentiation" },
      { step: "Messaging Development", description: "Create your brand story, voice, and key messages" },
      { step: "Implementation", description: "Roll out new brand consistently across all touchpoints" }
    ],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop"
  },
  {
    id: "process-optimization",
    icon: Settings,
    title: "Investment & Feasibility Advisory",
    description: "Streamline operations to boost efficiency, reduce costs, and create scalable systems for your team.",
    features: ["Techno-Commercial Feasibility", "Business Case & Financial Models", "Investment Decision Support", "Risk & Scenario Analysis"],
    longDescription: "Inefficient processes drain resources, frustrate employees, and limit growth. Process optimization identifies bottlenecks, eliminates waste, and creates systems that scale. I bring a human-centered approach to operational efficiency, ensuring that improvements work for your team, not against them.",
    benefits: [
      "Significant time savings across key processes",
      "Reduced operational costs and waste",
      "Happier, more productive team members",
      "Scalable systems that grow with you",
      "Clear documentation and repeatability"
    ],
    process: [
      { step: "Process Mapping", description: "Document current workflows and identify pain points" },
      { step: "Analysis", description: "Quantify inefficiencies and prioritize improvement opportunities" },
      { step: "Redesign", description: "Create optimized workflows with team input and buy-in" },
      { step: "Implementation", description: "Roll out changes with proper training and support" },
      { step: "Measurement", description: "Track improvements and continue iterating" }
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
  },
  {
    id: "growth-consulting",
    icon: Rocket,
    title: "Innovation & Design Thinking",
    description: "Accelerate your business growth with proven strategies for customer acquisition, retention, and expansion.",
    features: ["Design Thinking Workshops", "Customer Journey Mapping", "New Product Strategy", "Concept Validation"],
    longDescription: "Growth isn't just about getting more customers—it's about building a sustainable engine that compounds over time. My growth consulting focuses on the full customer lifecycle, from acquisition through retention and expansion. We'll identify your biggest growth levers and build the systems to pull them consistently.",
    benefits: [
      "Accelerated revenue growth",
      "Lower customer acquisition costs",
      "Higher customer lifetime value",
      "Predictable, repeatable growth engine",
      "Reduced dependency on any single channel"
    ],
    process: [
      { step: "Growth Audit", description: "Analyze current acquisition, conversion, and retention metrics" },
      { step: "Opportunity Identification", description: "Find the highest-impact growth levers for your business" },
      { step: "Strategy Development", description: "Create a comprehensive growth plan with clear priorities" },
      { step: "Experimentation", description: "Design and run tests to validate growth hypotheses" },
      { step: "Scale", description: "Double down on what works and build repeatable systems" }
    ],
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop"
  },
  {
    id: "digital-transformation",
    icon: Monitor,
    title: "CXO Advisory & Strategic Decisions",
    description: "Navigate the digital landscape with strategic technology adoption that drives innovation and efficiency.",
    features: ["Board-level decision support","Growth roadmap","Portfolio strategy","Strategic sourcing"],
    longDescription: "Digital transformation isn't about technology—it's about people. The most successful transformations put humans at the center, using technology to amplify their capabilities rather than replace them. I guide organizations through this complex journey with a focus on sustainable change that actually sticks.",
    benefits: [
      "Clear digital strategy aligned with business goals",
      "Higher adoption rates through human-centered design",
      "Reduced risk of failed implementations",
      "Empowered teams that embrace new tools",
      "Measurable ROI on technology investments"
    ],
    process: [
      { step: "Assessment", description: "Evaluate current technology landscape and organizational readiness" },
      { step: "Strategy", description: "Define digital vision and prioritized transformation roadmap" },
      { step: "Pilot", description: "Start with focused pilots to prove value and build momentum" },
      { step: "Scale", description: "Roll out successful initiatives across the organization" },
      { step: "Sustain", description: "Build internal capabilities for ongoing innovation" }
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
  },
  {
    id: "leadership-coaching",
    icon: Users,
    title: "Leadership Coaching",
    description: "Develop the leadership skills and mindset needed to guide your team through challenges and opportunities.",
    features: ["Executive Coaching", "Team Development", "Culture Building", "Succession Planning"],
    longDescription: "Great organizations are built by great leaders. My leadership coaching helps executives and emerging leaders develop the skills, mindset, and presence needed to inspire teams and drive results. Through personalized coaching and practical frameworks, we'll accelerate your leadership journey.",
    benefits: [
      "Enhanced leadership presence and influence",
      "Improved decision-making under pressure",
      "Stronger relationships with team members",
      "Better work-life integration",
      "Clear personal development roadmap"
    ],
    process: [
      { step: "Assessment", description: "360-degree feedback and leadership style evaluation" },
      { step: "Goal Setting", description: "Define specific, measurable leadership development goals" },
      { step: "Coaching Sessions", description: "Regular one-on-one sessions focused on real challenges" },
      { step: "Practice", description: "Apply new skills in your daily work with reflection exercises" },
      { step: "Integration", description: "Build sustainable habits and continue growing" }
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
  },
];

export const getServiceById = (id: string) => {
  return services.find(service => service.id === id);
};
