import express from 'express';
import { protect } from '../middleware/auth.js';
import roleAuth from '../middleware/roleAuth.js';
import {
  admitPatient,
  getPatients,
  dischargePatient,
  getBedAvailability
} from '../controllers/receptionistController.js';

const router = express.Router();

// Allow both receptionists and staff to access receptionist workflows
router.use(protect, roleAuth('receptionist', 'staff'));

router.post('/patients/admit', admitPatient);
router.get('/patients', getPatients);
router.patch('/patients/:id/discharge', dischargePatient);
router.get('/beds/availability', getBedAvailability);

export default router;
