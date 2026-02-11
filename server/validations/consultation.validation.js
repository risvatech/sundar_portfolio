// consultation.validation.js
import Joi from 'joi';

export const createConsultationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).required(),
    company: Joi.string().min(2).required(),
    title: Joi.string().min(2).required(),
    location: Joi.string().min(2).required(),
    serviceType: Joi.string().valid(
        'Growth Strategy',
        'Market Entry',
        'Go-to-Market (GTM)',
        'Feasibility & Investment Support',
        'Market Research',
        'Supply Chain & Sourcing',
        'Executive / Founder Advisory',
        'Design Thinking Workshop',
        'Guest Lecture / Speaking',
        'Other',
        // Add kebab-case versions
        'growth-strategy',
        'market-entry',
        'go-to-market-(gtm)',
        'feasibility-&-investment-support',
        'market-research',
        'supply-chain-&-sourcing',
        'executive-/-founder-advisory',
        'design-thinking-workshop',
        'guest-lecture-/-speaking',
        'other'
    ).required(),
    description: Joi.string().min(10).max(500).required()
});