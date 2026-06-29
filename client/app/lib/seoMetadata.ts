// app/lib/seoMetadata.ts
export interface PageMetadata {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
}

export const SEO_CONFIG: Record<string, PageMetadata> = {
    home: {
        title: 'Strategy & Growth Advisor | Chennai | IIM Trichy Alumni',
        description: 'Chennai-based Strategy & Growth Advisor with 18+ years across 250+ engagements. Specialist in Healthcare, EV & Automotive, and EPR strategy. Helping MSMEs and CXOs make high-stakes decisions with rigour.',
        keywords: 'strategy consultant Chennai, growth advisor India, IIM Trichy alumni strategy consultant, MSME advisory Tamil Nadu, healthcare market research India, EV automotive strategy consultant, EPR compliance advisory India, B2B market research Chennai, business strategy consultant, design thinking expert, GTM strategy, startup advisor, Chennai business consultant',
        ogTitle: 'S. Sundara Moorthy – Strategy & Growth Advisor | Chennai',
        ogDescription: 'Chennai-based Strategy & Growth Advisor with 18+ years across 250+ engagements. Specialist in Healthcare, EV & Automotive, and EPR strategy.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy & Growth Advisor | Chennai | IIM Trichy Alumni',
        twitterDescription: '18+ years, 250+ engagements. Healthcare, EV, EPR strategy specialist. Helping MSMEs and CXOs.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },
    about: {
        title: 'About S. Sundara Moorthy | IIM Trichy Alumni | 18+ Years Strategy Advisor',
        description: 'Learn about S. Sundara Moorthy, IIM Trichy alumni and Strategy & Growth Advisor with 18+ years of experience across 250+ engagements in India, US, Europe, and Southeast Asia. Specialist in Healthcare, EV, and sustainability (EPR) strategy.',
        keywords: 'about strategy consultant, Sundara Moorthy profile, business advisor India, IIM Trichy alumni strategy consultant, design thinking consultant India, Chennai strategy advisor, healthcare strategy consultant, EV automotive advisor',
        ogTitle: 'About S. Sundara Moorthy – Strategy & Growth Advisor',
        ogDescription: 'IIM Trichy alumni with 18+ years and 250+ global engagements. Specialist in Healthcare, EV, and EPR strategy.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/about',
        ogType: 'profile',
        twitterCard: 'summary_large_image',
        twitterTitle: 'About – IIM Trichy Alumni Strategy Advisor',
        twitterDescription: '18+ years experience across 250+ engagements in strategy, market research, and growth advisory.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },
    whatido: {
        title: 'Strategy Consulting Services | Chennai | Market Research, GTM & Growth Advisory',
        description: 'Chennai-based Strategy & Growth Advisor offering market research, GTM strategy, investment advisory, and design thinking services for MSMEs, startups, and CXOs across Healthcare, EV, and EPR sectors. IIM Trichy alumni with 18+ years experience.',
        keywords: 'strategy consulting Chennai, market research India, GTM strategy consultant, growth advisory Tamil Nadu, investment advisory India, feasibility study consultant, design thinking practitioner, IIM Trichy alumni consultant, healthcare strategy consultant, EV automotive advisor, EPR compliance advisory, Chennai business consultant',
        ogTitle: 'Strategy & Growth Services – Chennai | IIM Trichy Alumni',
        ogDescription: 'Market research, GTM strategy, investment advisory, and design thinking for Healthcare, EV, and EPR sectors.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/what-i-do',
        ogType: 'service',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consulting Services | Chennai',
        twitterDescription: 'Insight-led strategy services for growth, expansion, and investment decisions. 18+ years experience.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },
    portfolio: {
        title: 'Portfolio | Strategy & Market Research Engagements Across 25+ Countries',
        description: 'Explore 250+ strategy, market research, and advisory engagements across industries including healthcare, EV, manufacturing, and green energy.',
        keywords: 'strategy consulting portfolio, market research case studies, business consulting projects India, feasibility studies examples, GTM strategy case studies',
        ogTitle: 'Portfolio – Strategy & Advisory Work',
        ogDescription: 'Real-world strategy and consulting engagements across global markets.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/portfolio',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Portfolio',
        twitterDescription: '250+ consulting engagements across sectors and geographies.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },
    contact: {
        title: 'Contact Sundara Moorthy | Strategy & Growth Advisor',
        description: 'Get in touch for strategy consulting, market research, growth advisory, and high-stakes business decision support.',
        keywords: 'contact strategy consultant India, hire business advisor, growth consultant contact, market research consultant India contact',
        ogTitle: 'Contact – Strategy & Growth Advisor',
        ogDescription: 'Discuss your business challenge and get structured strategic guidance.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/contact',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Contact Sundara Moorthy',
        twitterDescription: 'Let’s discuss your strategy and growth challenges.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },
    blog: {
        title: 'Strategy & Growth Insights Blog | Market Trends, GTM & Business Strategy',
        description: 'Insights on market trends, strategy frameworks, design thinking, and growth decisions for startups, MSMEs, and business leaders.',
        keywords: 'strategy blog India, business growth insights, GTM strategy blog, market research insights, design thinking articles, consulting frameworks',
        ogTitle: 'Strategy & Growth Insights',
        ogDescription: 'Practical insights on strategy, growth, and decision-making.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/blog',
        ogType: 'blog',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy & Growth Blog',
        twitterDescription: 'Insights for founders, CXOs, and business leaders.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },
    hosur: {
        title: 'Strategy Consultant in Hosur | Growth & Market Research Advisor',
        description: 'Strategy & Growth Advisor serving Hosur businesses with market research, GTM strategy, and investment decision support for MSMEs and growing companies.',
        keywords: 'strategy consultant hosur, business consultant hosur, market research hosur, growth strategy hosur, MSME consultant hosur, GTM strategy hosur',
        ogTitle: 'Strategy Consultant in Hosur',
        ogDescription: 'Helping Hosur businesses make better growth and investment decisions with structured strategy.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/strategy-consultant-hosur',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consultant in Hosur',
        twitterDescription: 'Market research, GTM, and growth advisory for Hosur businesses.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },

    bangalore: {
        title: 'Strategy Consultant in Bangalore | Growth, GTM & Market Entry Advisor',
        description: 'Experienced Strategy & Growth Advisor working with Bangalore startups, MSMEs, and CXOs on market entry, growth strategy, and investment decisions.',
        keywords: 'strategy consultant bangalore, business consultant bangalore, startup advisor bangalore, GTM strategy bangalore, market entry consultant bangalore',
        ogTitle: 'Strategy Consultant in Bangalore',
        ogDescription: 'Supporting Bangalore businesses with high-stakes strategy and growth decisions.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/strategy-consultant-bangalore',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consultant in Bangalore',
        twitterDescription: 'Strategy, market research, and growth advisory for startups and enterprises.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },

    tamilnadu: {
        title: 'Strategy Consultant in Tamil Nadu | Business Growth & Market Advisory',
        description: 'Strategy consulting across Tamil Nadu for MSMEs and enterprises—covering market research, feasibility studies, GTM strategy, and investment advisory.',
        keywords: 'strategy consultant tamil nadu, business consultant tamilnadu, market research tamilnadu, feasibility study tamilnadu, growth advisor tamil nadu',
        ogTitle: 'Strategy Consultant in Tamil Nadu',
        ogDescription: 'Enabling structured growth and strategic clarity for businesses across Tamil Nadu.',
        ogImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
        ogUrl: 'https://www.sundara-moorthy.com/strategy-consultant-tamilnadu',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consultant in Tamil Nadu',
        twitterDescription: 'Market intelligence and growth strategy for MSMEs and enterprises.',
        twitterImage: 'https://www.sundara-moorthy.com/social-banner.jpg',
    },

} as const;

export type PageKey = keyof typeof SEO_CONFIG;
