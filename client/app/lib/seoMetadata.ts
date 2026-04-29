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
        title: 'Sundara Moorthy - Strategy & Growth Advisor | Design Thinking Practitioner',
        description: 'Sundara Moorthy, Strategy & Growth Advisor | Design Thinking Practitioner',
        keywords: 'strategy consultant India, growth advisor, business strategy consultant, market research consulting, design thinking expert, GTM strategy, MSME consultant India, startup advisor',
        ogTitle: 'Sundara Moorthy – Strategy & Growth Advisor',
        ogDescription: 'Helping businesses solve complex problems with insight-led, execution-ready strategies.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy & Growth Advisor | Sundara Moorthy',
        twitterDescription: 'Clarity-driven strategy for high-stakes business decisions.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },
    about: {
        title: 'About Sundara Moorthy | Strategy & Growth Advisor with 18+ Years Experience',
        description: 'Learn about Sundara Moorthy, a Strategy & Growth Advisor with global experience across India, US, Europe, and Southeast Asia, specializing in market intelligence and design-led strategy.',
        keywords: 'about strategy consultant, Sundara Moorthy profile, business advisor India, IIM Trichy alumni strategy consultant, design thinking consultant India',
        ogTitle: 'About Sundara Moorthy – Strategy Advisor',
        ogDescription: '18+ years of experience in strategy, consulting, and market intelligence across industries.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/about',
        ogType: 'profile',
        twitterCard: 'summary_large_image',
        twitterTitle: 'About Sundara Moorthy',
        twitterDescription: 'Strategy, market research, and design thinking expert.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },
    whatido: {
        title: 'Strategy Consulting Services | Market Research, GTM & Growth Advisory',
        description: 'Explore strategy consulting services including market research, GTM strategy, investment advisory, design thinking, and CXO decision support for startups and enterprises.',
        keywords: 'strategy consulting services, market research India, GTM strategy consulting, business growth advisor, feasibility study consultant, investment advisory India',
        ogTitle: 'Strategy & Growth Services',
        ogDescription: 'Insight-led strategy services for growth, expansion, and investment decisions.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/what-i-do',
        ogType: 'service',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consulting Services',
        twitterDescription: 'From market intelligence to growth strategy and investment advisory.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },
    portfolio: {
        title: 'Portfolio | Strategy & Market Research Engagements Across 25+ Countries',
        description: 'Explore 250+ strategy, market research, and advisory engagements across industries including healthcare, EV, manufacturing, and green energy.',
        keywords: 'strategy consulting portfolio, market research case studies, business consulting projects India, feasibility studies examples, GTM strategy case studies',
        ogTitle: 'Portfolio – Strategy & Advisory Work',
        ogDescription: 'Real-world strategy and consulting engagements across global markets.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/portfolio',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Portfolio',
        twitterDescription: '250+ consulting engagements across sectors and geographies.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },
    contact: {
        title: 'Contact Sundara Moorthy | Strategy & Growth Advisor',
        description: 'Get in touch for strategy consulting, market research, growth advisory, and high-stakes business decision support.',
        keywords: 'contact strategy consultant India, hire business advisor, growth consultant contact, market research consultant India contact',
        ogTitle: 'Contact – Strategy & Growth Advisor',
        ogDescription: 'Discuss your business challenge and get structured strategic guidance.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/contact',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Contact Sundara Moorthy',
        twitterDescription: 'Let’s discuss your strategy and growth challenges.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },
    blog: {
        title: 'Strategy & Growth Insights Blog | Market Trends, GTM & Business Strategy',
        description: 'Insights on market trends, strategy frameworks, design thinking, and growth decisions for startups, MSMEs, and business leaders.',
        keywords: 'strategy blog India, business growth insights, GTM strategy blog, market research insights, design thinking articles, consulting frameworks',
        ogTitle: 'Strategy & Growth Insights',
        ogDescription: 'Practical insights on strategy, growth, and decision-making.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/blog',
        ogType: 'blog',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy & Growth Blog',
        twitterDescription: 'Insights for founders, CXOs, and business leaders.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },
    hosur: {
        title: 'Strategy Consultant in Hosur | Growth & Market Research Advisor',
        description: 'Strategy & Growth Advisor serving Hosur businesses with market research, GTM strategy, and investment decision support for MSMEs and growing companies.',
        keywords: 'strategy consultant hosur, business consultant hosur, market research hosur, growth strategy hosur, MSME consultant hosur, GTM strategy hosur',
        ogTitle: 'Strategy Consultant in Hosur',
        ogDescription: 'Helping Hosur businesses make better growth and investment decisions with structured strategy.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/strategy-consultant-hosur',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consultant in Hosur',
        twitterDescription: 'Market research, GTM, and growth advisory for Hosur businesses.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },

    bangalore: {
        title: 'Strategy Consultant in Bangalore | Growth, GTM & Market Entry Advisor',
        description: 'Experienced Strategy & Growth Advisor working with Bangalore startups, MSMEs, and CXOs on market entry, growth strategy, and investment decisions.',
        keywords: 'strategy consultant bangalore, business consultant bangalore, startup advisor bangalore, GTM strategy bangalore, market entry consultant bangalore',
        ogTitle: 'Strategy Consultant in Bangalore',
        ogDescription: 'Supporting Bangalore businesses with high-stakes strategy and growth decisions.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/strategy-consultant-bangalore',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consultant in Bangalore',
        twitterDescription: 'Strategy, market research, and growth advisory for startups and enterprises.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },

    tamilnadu: {
        title: 'Strategy Consultant in Tamil Nadu | Business Growth & Market Advisory',
        description: 'Strategy consulting across Tamil Nadu for MSMEs and enterprises—covering market research, feasibility studies, GTM strategy, and investment advisory.',
        keywords: 'strategy consultant tamil nadu, business consultant tamilnadu, market research tamilnadu, feasibility study tamilnadu, growth advisor tamil nadu',
        ogTitle: 'Strategy Consultant in Tamil Nadu',
        ogDescription: 'Enabling structured growth and strategic clarity for businesses across Tamil Nadu.',
        ogImage: 'https://www.sundara-moorthy.com/favicon.ico',
        ogUrl: 'https://www.sundara-moorthy.com/strategy-consultant-tamilnadu',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Strategy Consultant in Tamil Nadu',
        twitterDescription: 'Market intelligence and growth strategy for MSMEs and enterprises.',
        twitterImage: 'https://www.sundara-moorthy.com/favicon.ico',
    },

} as const;

export type PageKey = keyof typeof SEO_CONFIG;