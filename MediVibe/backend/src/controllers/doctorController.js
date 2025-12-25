import Duty from '../models/Duty.js';
import Assignment from '../models/Assignment.js';
import Patient from '../models/Patient.js';
import Bed from '../models/Bed.js';

// Get doctor's duties
export const getDoctorDuties = async (req, res) => {
  try {
    const duties = await Duty.find({ user: req.user._id }).sort({ shiftDate: -1 });
    res.json({ success: true, data: duties });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch duties', error: error.message });
  }
};

// Get assigned patients
export const getDoctorPatients = async (req, res) => {
  try {
    const assignments = await Assignment.find({ doctor: req.user._id, status: 'active' })
      .populate('patient')
      .populate('nurse', 'name email');
    
    const patients = assignments.map((a) => ({
      assignmentId: a._id,
      patient: a.patient,
      nurse: a.nurse,
      assignedAt: a.assignedAt,
      notes: a.notes
    }));
    
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
};

// Get patient details
export const getPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).populate('assignedBed').populate('doctor', 'name specialization');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    const assignment = await Assignment.findOne({ patient: id, doctor: req.user._id, status: 'active' });
    
    res.json({ success: true, data: { patient, assignment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patient details', error: error.message });
  }
};

// Update doctor's notes
export const updateDoctorNotes = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { notes } = req.body;
    
    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, doctor: req.user._id },
      { notes },
      { new: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notes', error: error.message });
  }
};

// Update duty status for the authenticated doctor
export const updateDutyStatus = async (req, res) => {
  try {
    const { dutyId } = req.params;
    const { status } = req.body;

    const allowed = ['scheduled', 'active', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid duty status' });
    }

    const duty = await Duty.findOneAndUpdate(
      { _id: dutyId, user: req.user._id },
      { status },
      { new: true }
    );

    if (!duty) {
      return res.status(404).json({ success: false, message: 'Duty not found' });
    }

    res.json({ success: true, data: duty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update duty status', error: error.message });
  }
};

// Mark patient visited by doctor (today)
export const markVisited = async (req, res) => {
  try {
    const { id } = req.params; // patient id
    const assignment = await Assignment.findOne({ patient: id, doctor: req.user._id, status: 'active' });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Active assignment not found' });
    }

    assignment.visitLogs = assignment.visitLogs || [];
    assignment.visitLogs.push({
      date: new Date(),
      visitedBy: req.user._id,
      role: 'doctor'
    });
    await assignment.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark visit', error: error.message });
  }
};
// Get bed availability (read-only)
export const getBedAvailability = async (_req, res) => {
  try {
    const bedStats = await Bed.aggregate([
      { $group: { _id: '$ward', total: { $sum: 1 }, available: { $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] } } } },
      { $project: { ward: '$_id', total: 1, available: 1, occupied: { $subtract: ['$total', '$available'] }, _id: 0 } }
    ]);
    
    res.json({ success: true, data: bedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bed stats', error: error.message });
  }
};
