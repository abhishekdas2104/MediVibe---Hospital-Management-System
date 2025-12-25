import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'transferred'],
      default: 'active'
    },
    notes: String,
    careNotes: [
      {
        date: { type: Date, default: Date.now },
        nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
        vitals: {
          temperature: Number,
          bloodPressure: String,
          heartRate: Number,
          oxygenLevel: Number
        }
      }
    ],
    visitLogs: [
      {
        date: { type: Date, default: Date.now },
        visitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['doctor', 'nurse'] },
        note: String
      }
    ]
  },
  { timestamps: true }
);

assignmentSchema.index({ patient: 1, status: 1 });
assignmentSchema.index({ doctor: 1, status: 1 });
assignmentSchema.index({ nurse: 1, status: 1 });

export default mongoose.model('Assignment', assignmentSchema);
