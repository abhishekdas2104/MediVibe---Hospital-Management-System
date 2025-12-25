import mongoose from 'mongoose';

const dutySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ward: {
      type: String,
      enum: ['ICU', 'General', 'Emergency', 'Pediatric', 'Orthopedic', 'Cardiac'],
      required: true
    },
    shiftDate: {
      type: Date,
      required: true
    },
    shiftStart: {
      type: String,
      required: true // e.g., "08:00"
    },
    shiftEnd: {
      type: String,
      required: true // e.g., "16:00"
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    notes: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

dutySchema.index({ user: 1, shiftDate: 1 });

export default mongoose.model('Duty', dutySchema);
