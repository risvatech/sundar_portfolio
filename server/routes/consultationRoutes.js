import express from 'express';
import { consultationController } from '../controllers/consultationController.js';

const router = express.Router();

// Public routes
router.post('/consultations', consultationController.createConsultation);


// For now, without authentication:
router.get('/admin/consultations', consultationController.getAllConsultations);
router.get('/admin/consultations/stats', consultationController.getConsultationStats);
router.get('/admin/consultations/:id', consultationController.getConsultationById);
router.patch('/admin/consultations/:id', consultationController.updateConsultationStatus);
router.delete('/admin/consultations/:id', consultationController.deleteConsultation);

export default router;