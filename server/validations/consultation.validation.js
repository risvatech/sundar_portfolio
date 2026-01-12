import Joi from 'joi';

export const createConsultationSchema = Joi.object({
    // Contact Information
    firstName: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must be less than 100 characters'
    }),
    lastName: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must be less than 100 characters'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional().allow('').messages({
        'string.pattern.base': 'Please enter a valid phone number'
    }),
    company: Joi.string().max(255).optional().allow(''),
    jobTitle: Joi.string().max(100).optional().allow(''),

    // Business Information
    businessType: Joi.string().max(100).optional().allow(''),
    industry: Joi.string().max(100).optional().allow(''),
    businessSize: Joi.string().max(50).optional().allow(''),
    annualRevenue: Joi.string().max(100).optional().allow(''),

    // Consultation Details
    consultationType: Joi.string().max(100).required().messages({
        'string.empty': 'Consultation type is required'
    }),
    preferredDate: Joi.date().iso().optional().allow(''),
    preferredTime: Joi.string().max(50).optional().allow(''),
    timezone: Joi.string().max(50).optional().allow(''),

    // Project Information
    projectDescription: Joi.string().max(2000).optional().allow(''),
    mainChallenges: Joi.string().max(2000).optional().allow(''),
    goals: Joi.string().max(2000).optional().allow(''),
    budgetRange: Joi.string().max(100).optional().allow(''),
    timeline: Joi.string().max(100).optional().allow(''),

    // How did you hear about us
    referralSource: Joi.string().max(100).optional().allow(''),
    referralDetails: Joi.string().max(500).optional().allow(''),

    // Additional Information
    additionalInfo: Joi.string().max(2000).optional().allow(''),
    hearAboutUs: Joi.string().max(500).optional().allow('')
});