import express from 'express';
import { protect } from '../middleware/auth.js';
import roleAuth from '../middleware/roleAuth.js';
import {
  getUsers,
  createUser,
  updateUserStatus,
  getPatientsAdmin,
  assignPatientToCareTeam,
  dischargePatient,
  getBeds,
  createBed,
  updateBedStatus,
  getReportSummary,
  generateReport,
} from '../controllers/adminController.js';

const router = express.Router();

// All routes protected and admin-only
router.use(protect, roleAuth('admin'));

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id/status', updateUserStatus);

// Patients & Assignments
router.get('/patients', getPatientsAdmin);
router.post('/assignments', assignPatientToCareTeam);
router.patch('/patients/:patientId/discharge', dischargePatient);

// Beds
router.get('/beds', getBeds);
router.post('/beds', createBed);
router.patch('/beds/:id/status', updateBedStatus);

// Reports
router.get('/reports/summary', getReportSummary);
router.post('/reports/generate', generateReport);

export default router;
