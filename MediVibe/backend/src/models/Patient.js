import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    age: Number,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true
    },
    address: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    medicalHistory: [String],
    allergies: [String],
    currentMedications: [String],
    
    // Admission Details
    admissionDate: {
      type: Date,
      default: Date.now
    },
    dischargeDate: Date,
    assignedBed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
      default: null
    },
    ward: {
      type: String,
      enum: ['ICU', 'General', 'Emergency', 'Pediatric', 'Orthopedic', 'Cardiac']
    },
    admissionReason: String,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Admitted', 'Discharged', 'Critical', 'Recovering', 'Observation'],
      default: 'Admitted'
    },
    
    // Insurance Information
    insuranceProvider: String,
    insurancePolicyNumber: String,
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Compound index for efficient queries
patientSchema.index({ firstName: 1, lastName: 1 });
patientSchema.index({ status: 1, admissionDate: -1 });

export default mongoose.model('Patient', patientSchema);
