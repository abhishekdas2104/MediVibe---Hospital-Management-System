import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['ICU', 'General', 'Emergency', 'Pediatric', 'Orthopedic', 'Cardiac'],
      required: true,
      unique: true
    },
    description: String,
    totalBeds: {
      type: Number,
      required: true,
      default: 0
    },
    availableBeds: {
      type: Number,
      default: 0
    },
    occupiedBeds: {
      type: Number,
      default: 0
    },
    maintenanceBeds: {
      type: Number,
      default: 0
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    staff: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    equipmentList: [String],
    specializations: [String],
    occupancyRate: {
      type: Number,
      default: 0
    },
    emergencyPhoneNumber: String,
    location: String, // Floor/Building info
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Ward', wardSchema);
