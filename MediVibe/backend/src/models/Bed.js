import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    ward: {
      type: String,
      enum: ['ICU', 'General', 'Emergency', 'Pediatric', 'Orthopedic', 'Cardiac'],
      required: true
    },
    bedType: {
      type: String,
      enum: ['Standard', 'Semi-Deluxe', 'Deluxe', 'ICU Standard', 'ICU Advanced'],
      default: 'Standard'
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Maintenance', 'Cleaning'],
      default: 'Available'
    },
    occupiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null
    },
    capacity: {
      type: Number,
      default: 1
    },
    features: [String], // e.g., ['AC', 'WiFi', 'TV', 'Attached Bathroom']
    dailyRate: {
      type: Number,
      required: true,
      default: 0
    },
    lastCleaned: Date,
    maintenanceNotes: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Bed', bedSchema);
