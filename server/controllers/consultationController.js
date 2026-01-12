import { db } from '../db/sql.js';
import { consultationRequests } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { createConsultationSchema } from '../validations/consultation.validation.js';

export const consultationController = {
    // Create new consultation request
    async createConsultation(req, res) {
        try {
            // Validate request body
            const { error, value } = createConsultationSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Insert consultation request
            const [consultation] = await db.insert(consultationRequests)
                .values({
                    firstName: value.firstName,
                    lastName: value.lastName,
                    email: value.email,
                    phone: value.phone || null,
                    company: value.company || null,
                    jobTitle: value.jobTitle || null,
                    businessType: value.businessType || null,
                    industry: value.industry || null,
                    businessSize: value.businessSize || null,
                    annualRevenue: value.annualRevenue || null,
                    consultationType: value.consultationType,
                    preferredDate: value.preferredDate || null,
                    preferredTime: value.preferredTime || null,
                    timezone: value.timezone || null,
                    projectDescription: value.projectDescription || null,
                    mainChallenges: value.mainChallenges || null,
                    goals: value.goals || null,
                    budgetRange: value.budgetRange || null,
                    timeline: value.timeline || null,
                    referralSource: value.referralSource || null,
                    referralDetails: value.referralDetails || null,
                    additionalInfo: value.additionalInfo || null,
                    hearAboutUs: value.hearAboutUs || null,
                    status: 'pending'
                })
                .returning();

            return res.json({
                success: true,
                message: 'Consultation request submitted successfully!',
                data: {
                    id: consultation.id,
                    name: `${consultation.firstName} ${consultation.lastName}`,
                    email: consultation.email,
                    consultationType: consultation.consultationType,
                    status: consultation.status,
                    createdAt: consultation.createdAt
                }
            });

        } catch (error) {
            console.error('Error creating consultation request:', error);

            // Handle duplicate email submission (optional)
            if (error.code === '23505') {
                return res.status(409).json({
                    success: false,
                    message: 'A consultation request with this email already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to submit consultation request',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get all consultation requests
    async getAllConsultations(req, res) {
        try {
            const { status, page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            let query = db.select().from(consultationRequests);

            // Filter by status if provided
            if (status && status !== 'all') {
                query = query.where(eq(consultationRequests.status, status));
            }

            // Add pagination and ordering
            const consultations = await query
                .orderBy(desc(consultationRequests.createdAt))
                .limit(parseInt(limit))
                .offset(offset);

            // Get total count for pagination
            let allData = await db.select().from(consultationRequests);
            if (status && status !== 'all') {
                allData = allData.filter(item => item.status === status);
            }
            const total = allData.length;

            return res.json({
                success: true,
                data: consultations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });

        } catch (error) {
            console.error('Error fetching consultations:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch consultation requests',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get single consultation by ID
    async getConsultationById(req, res) {
        try {
            const { id } = req.params;

            const [consultation] = await db.select()
                .from(consultationRequests)
                .where(eq(consultationRequests.id, parseInt(id)));

            if (!consultation) {
                return res.status(404).json({
                    success: false,
                    message: 'Consultation request not found'
                });
            }

            return res.json({
                success: true,
                data: consultation
            });

        } catch (error) {
            console.error('Error fetching consultation:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch consultation request'
            });
        }
    },

    // Update consultation status
    async updateConsultationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes, isFollowedUp } = req.body;

            // Validate status if provided
            const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
            if (status && !validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, confirmed, completed, cancelled'
                });
            }

            const updateData = {
                updatedAt: new Date()
            };

            if (status) updateData.status = status;
            if (notes !== undefined) updateData.notes = notes;
            if (isFollowedUp !== undefined) updateData.isFollowedUp = isFollowedUp;

            const [updatedConsultation] = await db.update(consultationRequests)
                .set(updateData)
                .where(eq(consultationRequests.id, parseInt(id)))
                .returning();

            if (!updatedConsultation) {
                return res.status(404).json({
                    success: false,
                    message: 'Consultation request not found'
                });
            }

            return res.json({
                success: true,
                message: 'Consultation updated successfully',
                data: updatedConsultation
            });

        } catch (error) {
            console.error('Error updating consultation:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update consultation request'
            });
        }
    },

    // Delete consultation
    async deleteConsultation(req, res) {
        try {
            const { id } = req.params;

            const [deletedConsultation] = await db.delete(consultationRequests)
                .where(eq(consultationRequests.id, parseInt(id)))
                .returning();

            if (!deletedConsultation) {
                return res.status(404).json({
                    success: false,
                    message: 'Consultation request not found'
                });
            }

            return res.json({
                success: true,
                message: 'Consultation request deleted successfully'
            });

        } catch (error) {
            console.error('Error deleting consultation:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete consultation request'
            });
        }
    },

    // Get consultation statistics
    async getConsultationStats(req, res) {
        try {
            const allConsultations = await db.select().from(consultationRequests);

            const stats = {
                total: allConsultations.length,
                pending: allConsultations.filter(c => c.status === 'pending').length,
                confirmed: allConsultations.filter(c => c.status === 'confirmed').length,
                completed: allConsultations.filter(c => c.status === 'completed').length,
                cancelled: allConsultations.filter(c => c.status === 'cancelled').length,
            };

            const recentConsultations = allConsultations
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10);

            return res.json({
                success: true,
                data: {
                    stats,
                    recent: recentConsultations
                }
            });

        } catch (error) {
            console.error('Error fetching consultation stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch consultation statistics',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};