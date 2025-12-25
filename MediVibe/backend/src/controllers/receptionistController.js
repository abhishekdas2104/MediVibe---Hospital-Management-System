import Patient from '../models/Patient.js';
import Bed from '../models/Bed.js';
import Assignment from '../models/Assignment.js';

// Admit patient
export const admitPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, age, gender, bloodType, address, emergencyContact, ward, admissionReason } = req.body;
    
    // Find available bed in requested ward
    const availableBed = await Bed.findOne({ ward, status: 'Available' });
    if (!availableBed) {
      return res.status(400).json({ success: false, message: `No available beds in ${ward} ward` });
    }
    
    // Create patient
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      age,
      gender,
      bloodType,
      address,
      emergencyContact,
      ward,
      admissionReason,
      assignedBed: availableBed._id,
      status: 'Admitted'
    });
    
    // Update bed status
    availableBed.status = 'Occupied';
    availableBed.occupiedBy = patient._id;
    await availableBed.save();
    
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to admit patient', error: error.message });
  }
};

// Get all patients
export const getPatients = async (_req, res) => {
  try {
    const patients = await Patient.find({ status: { $ne: 'Discharged' } })
      .populate('assignedBed')
      .populate('doctor', 'name specialization')
      .sort({ admissionDate: -1 });
    
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
};

// Discharge patient
export const dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    // Update patient status
    patient.status = 'Discharged';
    patient.dischargeDate = new Date();
    await patient.save();
    
    // Release bed
    if (patient.assignedBed) {
      await Bed.findByIdAndUpdate(patient.assignedBed, {
        status: 'Cleaning',
        occupiedBy: null
      });
    }
    
    // Mark assignments as completed
    await Assignment.updateMany({ patient: id, status: 'active' }, { status: 'completed' });
    
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to discharge patient', error: error.message });
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
