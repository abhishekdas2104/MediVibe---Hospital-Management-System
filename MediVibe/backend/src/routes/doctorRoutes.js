import express from 'express';
import { protect } from '../middleware/auth.js';
import roleAuth from '../middleware/roleAuth.js';
import { 
  getDoctorDuties,
  getDoctorPatients,
  getPatientDetails,
  updateDoctorNotes,
  getBedAvailability,
  updateDutyStatus,
  markVisited
} from '../controllers/doctorController.js';

const router = express.Router();

router.use(protect, roleAuth('doctor'));

router.get('/duties', getDoctorDuties);
router.patch('/duties/:dutyId/status', updateDutyStatus);
router.get('/patients', getDoctorPatients);
router.get('/patients/:id', getPatientDetails);
router.post('/patients/:id/visit', markVisited);
router.patch('/assignments/:assignmentId/notes', updateDoctorNotes);
router.get('/beds/availability', getBedAvailability);

export default router;
