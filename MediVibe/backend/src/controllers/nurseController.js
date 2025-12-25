import Duty from '../models/Duty.js';
import Assignment from '../models/Assignment.js';
import Patient from '../models/Patient.js';
import Bed from '../models/Bed.js';

// Get nurse's duties
export const getNurseDuties = async (req, res) => {
  try {
    const duties = await Duty.find({ user: req.user._id }).sort({ shiftDate: -1 });
    res.json({ success: true, data: duties });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch duties', error: error.message });
  }
};

// Get assigned patients
export const getNursePatients = async (req, res) => {
  try {
    const assignments = await Assignment.find({ nurse: req.user._id, status: 'active' })
      .populate('patient')
      .populate('doctor', 'name specialization');
    
    const patients = assignments.map((a) => ({
      assignmentId: a._id,
      patient: a.patient,
      doctor: a.doctor,
      assignedAt: a.assignedAt,
      careNotes: a.careNotes || []
    }));
    
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
};

// Add care note
export const addCareNote = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { note, vitals } = req.body;
    
    const assignment = await Assignment.findOne({ _id: assignmentId, nurse: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    assignment.careNotes.push({
      nurseId: req.user._id,
      note,
      vitals,
      timestamp: new Date()
    });
    
    await assignment.save();
    
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add care note', error: error.message });
  }
};

// Update duty status for the authenticated nurse
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

// Mark patient visited by nurse (today)
export const markVisited = async (req, res) => {
  try {
    const { id } = req.params; // patient id
    const assignment = await Assignment.findOne({ patient: id, nurse: req.user._id, status: 'active' });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Active assignment not found' });
    }

    assignment.visitLogs = assignment.visitLogs || [];
    assignment.visitLogs.push({
      date: new Date(),
      visitedBy: req.user._id,
      role: 'nurse'
    });
    await assignment.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark visit', error: error.message });
  }
};
// Update bed status
export const updateBedStatus = async (req, res) => {
  try {
    const { bedId } = req.params;
    const { status } = req.body;
    
    // Only allow status changes to: Cleaning, Available
    if (!['Cleaning', 'Available'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status for nurse update' });
    }
    
    const bed = await Bed.findByIdAndUpdate(bedId, { status, lastCleaned: status === 'Available' ? new Date() : undefined }, { new: true });
    
    res.json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update bed status', error: error.message });
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
    
    const assignment = await Assignment.findOne({ patient: id, nurse: req.user._id, status: 'active' });
    
    res.json({ success: true, data: { patient, assignment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patient details', error: error.message });
  }
};
