import express from 'express';
import { protect } from '../middleware/auth.js';
import roleAuth from '../middleware/roleAuth.js';
import {
  getBeds,
  getBedsByWard,
  getBedAvailabilitySummary,
  updateBedStatus,
  getDetailedBeds
} from '../controllers/bedController.js';

const router = express.Router();

// Public read endpoints - accessible to all authenticated users
router.get('/', getBeds);
router.get('/ward/:ward', getBedsByWard);
router.get('/availability/summary', getBedAvailabilitySummary);
router.get('/details/all', protect, getDetailedBeds);

// Protected update endpoint for staff roles
router.patch(
  '/:bedId/status',
  protect,
  roleAuth('admin', 'nurse', 'doctor', 'receptionist', 'staff'),
  updateBedStatus
);

export default router;
