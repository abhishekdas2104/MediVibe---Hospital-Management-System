import express from 'express';
import { protect } from '../middleware/auth.js';
import roleAuth from '../middleware/roleAuth.js';
import {
  getNurseDuties,
  getNursePatients,
  addCareNote,
  updateBedStatus,
  getPatientDetails,
  updateDutyStatus,
  markVisited
} from '../controllers/nurseController.js';

const router = express.Router();

router.use(protect, roleAuth('nurse'));

router.get('/duties', getNurseDuties);
router.patch('/duties/:dutyId/status', updateDutyStatus);
router.get('/patients', getNursePatients);
router.get('/patients/:id', getPatientDetails);
router.post('/patients/:id/visit', markVisited);
router.post('/assignments/:assignmentId/care-notes', addCareNote);
router.patch('/beds/:bedId/status', updateBedStatus);

export default router;
