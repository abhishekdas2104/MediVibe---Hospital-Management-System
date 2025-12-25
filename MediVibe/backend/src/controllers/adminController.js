import User from '../models/User.js';
import Bed from '../models/Bed.js';
import Ward from '../models/Ward.js';
import Patient from '../models/Patient.js';
import Assignment from '../models/Assignment.js';
import Duty from '../models/Duty.js';

// USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }
    const user = await User.create({ name, email, password, role, phone });
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

// PATIENTS
export const getPatientsAdmin = async (_req, res) => {
  try {
    const patients = await Patient.find().sort({ admissionDate: -1 }).populate('doctor', 'name email').populate('assignedBed', 'bedNumber ward');
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
};

export const assignPatientToCareTeam = async (req, res) => {
  try {
    const { patientId, doctorId, nurseId, ward, shiftDate, shiftStart, shiftEnd, notes } = req.body;

    if (!patientId || !doctorId || !nurseId || !ward || !shiftDate || !shiftStart || !shiftEnd) {
      return res.status(400).json({ success: false, message: 'patientId, doctorId, nurseId, ward, shiftDate, shiftStart, and shiftEnd are required' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const [doctor, nurse] = await Promise.all([
      User.findOne({ _id: doctorId, role: 'doctor' }),
      User.findOne({ _id: nurseId, role: 'nurse' })
    ]);

    if (!doctor) return res.status(404).json({ success: false, message: `Doctor with ID ${doctorId} not found or does not have role 'doctor'` });
    if (!nurse) return res.status(404).json({ success: false, message: `Nurse with ID ${nurseId} not found or does not have role 'nurse'` });

    // Check if assignment already exists for this patient with different staff
    const existingAssignment = await Assignment.findOne({ patient: patientId, status: 'active' });
    
    const assignmentPayload = { 
      patient: patientId, 
      doctor: doctorId, 
      nurse: nurseId, 
      notes, 
      status: 'active' 
    };
    
    const assignment = await Assignment.findOneAndUpdate(
      { patient: patientId, status: 'active' },
      assignmentPayload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Update patient with new doctor and ward
    patient.doctor = doctorId;
    patient.ward = ward;
    await patient.save();

    // Create duty records for doctor and nurse
    const dutyBase = {
      ward,
      shiftDate,
      shiftStart,
      shiftEnd,
      status: 'active',
      notes: notes || `Assigned to ${patient.firstName} ${patient.lastName}`,
      isActive: true
    };

    await Promise.all([
      Duty.findOneAndUpdate(
        { user: doctorId, shiftDate, shiftStart, shiftEnd }, 
        { user: doctorId, ...dutyBase }, 
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ),
      Duty.findOneAndUpdate(
        { user: nurseId, shiftDate, shiftStart, shiftEnd }, 
        { user: nurseId, ...dutyBase }, 
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    ]);

    res.json({ success: true, data: assignment, message: `Successfully assigned ${patient.firstName} ${patient.lastName} to ${doctor.name} and ${nurse.name}` });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to assign care team', error: error.message });
  }
};

export const dischargePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { status: 'Discharged', dischargeDate: new Date(), assignedBed: null },
      { new: true }
    ).populate('doctor', 'name email').populate('assignedBed', 'bedNumber ward');
    
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    
    if (patient.assignedBed) {
      await Bed.findByIdAndUpdate(patient.assignedBed, { status: 'Cleaning' });
    }
    
    await Assignment.updateMany(
      { patient: patientId, status: 'active' },
      { status: 'completed' }
    );
    
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to discharge patient', error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
};

// BEDS
export const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find().sort({ bedNumber: 1 });
    res.json({ success: true, data: beds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch beds', error: error.message });
  }
};

export const createBed = async (req, res) => {
  try {
    const bed = await Bed.create(req.body);
    res.status(201).json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create bed', error: error.message });
  }
};

export const updateBedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const bed = await Bed.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update bed', error: error.message });
  }
};

// REPORTS
export const getReportSummary = async (_req, res) => {
  try {
    const [bedTotal, bedAvailable, bedOccupied] = await Promise.all([
      Bed.countDocuments(),
      Bed.countDocuments({ status: 'Available' }),
      Bed.countDocuments({ status: 'Occupied' })
    ]);

    const wardAgg = await Ward.find({}, 'name totalBeds availableBeds occupiedBeds');
    const patientCounts = await Patient.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        beds: { total: bedTotal, available: bedAvailable, occupied: bedOccupied },
        wards: wardAgg,
        patients: patientCounts,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to build summary', error: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const type = req.body?.type || 'occupancy';
    const summary = await Bed.aggregate([
      { $group: { _id: '$ward', total: { $sum: 1 }, available: { $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] } } } },
      { $project: { ward: '$_id', total: 1, available: 1, occupied: { $subtract: ['$total', '$available'] }, _id: 0 } }
    ]);

    res.json({ success: true, data: { type, generatedAt: new Date().toISOString(), summary } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate report', error: error.message });
  }
};
